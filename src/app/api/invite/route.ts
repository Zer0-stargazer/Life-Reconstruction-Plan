import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { sessionFromRequest, signSession } from "@/lib/session";
import { getSetting } from "@/lib/app-settings";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// POST /api/invite - 用户兑换邀请码升级为充电用户
//
// 修复说明（原实现有两个安全问题）：
//   1. 无鉴权：userId 由请求体自报，任何人拿到一个有效码就能给任意账号升级。
//      → 现在.userId 一律取服务端会话令牌（Authorization: Bearer <token>），
//        请求体里的 userId 不再被信任。
//   2. 竞态超发：used_count 是先读后写（used_count + 1），并发兑换可以突破 max_uses。
//      → 现在用乐观锁 `.eq("used_count", 读到的值)`，写不进去说明被别人抢了，直接 409。
//   3. 无限制猜码：→ 按 IP 限流（共享的 Supabase 限流，15 分钟 10 次尝试）。

export async function POST(request: NextRequest) {
  const rl = await rateLimit(`invite:${getClientIp(request)}`, 10, 15 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "尝试次数过多，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // 1) 会话校验：身份只认服务端签发的令牌
  const session = sessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ error: "登录态无效或已过期，请重新登录" }, { status: 401 });
  }
  const userId = session.userId;

  try {
    if (!(await getSetting("redeem_enabled"))) {
      return NextResponse.json({ error: "兑换功能已暂停，请稍后再试" }, { status: 503 });
    }

    const body = await request.json();
    const { code } = body as { code?: string; userId?: number };

    if (!code || typeof code !== "string" || code.length > 100) {
      return NextResponse.json({ error: "邀请码无效" }, { status: 400 });
    }

    const client = getSupabaseClient();

    // 2) 查询邀请码
    const { data: invite, error } = await client
      .from("invite_codes")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .maybeSingle();

    if (error) throw new Error(`查询失败: ${error.message}`);
    if (!invite) {
      return NextResponse.json({ error: "邀请码无效" }, { status: 404 });
    }

    // 3) 过期检查
    if (invite.expires_at && new Date(invite.expires_at) < new Date()) {
      return NextResponse.json({ error: "邀请码已过期" }, { status: 400 });
    }

    // 4) 用量检查（真正的并发防护在下面第 6 步的乐观锁）
    if (invite.max_uses !== null && invite.max_uses !== undefined && invite.used_count >= invite.max_uses) {
      return NextResponse.json({ error: "邀请码已被用完" }, { status: 400 });
    }

    // 5) 查询用户（userId 来自会话，不是请求体）
    const { data: user, error: userError } = await client
      .from("app_users")
      .select("id, role, nickname, is_active, ai_credits, ai_credits_total")
      .eq("id", userId)
      .maybeSingle();

    if (userError) throw new Error(`查询用户失败: ${userError.message}`);
    if (!user) {
      return NextResponse.json({ error: "用户不存在" }, { status: 404 });
    }
    if (!user.is_active) {
      return NextResponse.json({ error: "该账号已被禁用" }, { status: 403 });
    }

    // 6) 先占位：乐观锁自增 used_count。
    //    `.eq("used_count", 读到的值)` 保证并发下只有一个请求能写成功，
    //    写不进去（返回空）说明名额刚被别人抢走。
    const { data: claimed, error: claimError } = await client
      .from("invite_codes")
      .update({ used_count: invite.used_count + 1 })
      .eq("id", invite.id)
      .eq("used_count", invite.used_count)
      .select("id");

    if (claimError) throw new Error(`更新邀请码失败: ${claimError.message}`);
    if (!claimed || claimed.length === 0) {
      return NextResponse.json({ error: "邀请码刚刚被用完了，请换个码试试" }, { status: 409 });
    }

    // 7) 再升级用户：额度到账；普通用户升级为 premium，premium / developer 角色保持不变
    const grantCredits = invite.ai_credits ?? 0;
    const newBalance = (user.ai_credits ?? 0) + grantCredits;
    const newRole = user.role === "normal" ? "premium" : user.role;
    const { error: updateError } = await client
      .from("app_users")
      .update({
        role: newRole,
        invite_code_used: code,
        ai_credits: newBalance,
        ai_credits_total: (user.ai_credits_total ?? 0) + grantCredits,
      })
      .eq("id", userId);

    if (updateError) {
      // 升级失败要把名额还回去，否则这个码白白少一次
      await client
        .from("invite_codes")
        .update({ used_count: invite.used_count })
        .eq("id", invite.id);
      throw new Error(`升级失败: ${updateError.message}`);
    }

    // 7.5) 额度流水（审计/对账）；失败不阻断兑换，只打日志
    if (grantCredits > 0) {
      const { error: logError } = await client.from("ai_credit_logs").insert({
        user_id: userId,
        delta: grantCredits,
        reason: "redeem_code",
        balance: newBalance,
      });
      if (logError) console.error("ai_credit_logs 写入失败:", logError.message);
    }

    // 8) 记录日志
    await client.from("access_logs").insert({
      user_id: userId,
      action: "redeem_code",
      detail: `用户 ${user.nickname} 使用邀请码 ${code} 兑换（角色: ${newRole}，到账额度: ${grantCredits}）`,
    });

    // 9) role 可能变了，重新签发令牌，让前端本地会话跟上服务端
    const token = signSession({
      userId,
      nickname: user.nickname,
      role: newRole,
    });

    return NextResponse.json({ success: true, role: newRole, credits: newBalance, token });

  } catch (err) {
    console.error("invite 兑换失败:", err);
    return NextResponse.json({ error: "服务器错误，请稍后重试" }, { status: 500 });
  }
}
