import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { sessionFromRequestVerified, signSession } from "@/lib/session";
import { getSetting } from "@/lib/app-settings";
import { getClientIp, rateLimit } from "@/lib/rate-limit";

// POST /api/invite - 用户兑换邀请码升级为充电用户
//
// 说明：
//   1. 身份只认服务端会话令牌（Authorization: Bearer <token>），请求体 userId 不被信任。
//   2. 兑换由数据库函数 redeem_invite_code 原子完成（batch13）：行锁校验 max_uses、
//      (user_id, code_id) 唯一约束防同一用户重复兑换、额度增量更新不覆盖并发扣减。
//   3. 按 IP 限流（共享的 Supabase 限流，15 分钟 10 次尝试），防猜码。

export async function POST(request: NextRequest) {
  const rl = await rateLimit(`invite:${getClientIp(request)}`, 10, 15 * 60_000);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "尝试次数过多，请稍后再试" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
    );
  }

  // 1) 会话校验：身份只认服务端签发的令牌
  const session = await sessionFromRequestVerified(request);
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

    // 2) 原子兑换：行锁校验 + 防重复兑换 + 增量加额度 + 写流水，全部在数据库单事务内完成
    //    （redeem_invite_code，见 supabase/migrations/2026-10-15-batch13-invite-redeem.sql）
    const { data: rpcData, error: rpcError } = await client.rpc("redeem_invite_code", {
      p_user_id: userId,
      p_code: code,
    });
    if (rpcError) throw new Error(`兑换失败: ${rpcError.message}`);

    const result = (rpcData ?? {}) as {
      status?: string;
      kind?: string;
      credits_granted?: number;
      new_balance?: number;
      role?: string;
      nickname?: string;
      token_version?: number;
    };

    const FAIL: Record<string, { error: string; http: number }> = {
      not_found: { error: "邀请码无效", http: 404 },
      inactive: { error: "邀请码无效", http: 404 },
      expired: { error: "邀请码已过期", http: 400 },
      exhausted: { error: "邀请码已被用完", http: 400 },
      already_redeemed: { error: "你已经兑换过这个邀请码了", http: 409 },
      user_not_found: { error: "用户不存在", http: 404 },
      user_disabled: { error: "该账号已被禁用", http: 403 },
    };
    if (result.status !== "ok") {
      const f = FAIL[result.status ?? ""];
      if (!f) throw new Error(`兑换返回未知状态: ${String(result.status)}`);
      return NextResponse.json({ error: f.error }, { status: f.http });
    }

    const kind = result.kind ?? "bundle";
    const grantCredits = result.credits_granted ?? 0;
    const newBalance = result.new_balance ?? 0;
    const newRole = result.role ?? "normal";
    const nickname = result.nickname ?? session.nickname;

    // 3) 记录日志（失败不影响兑换结果）
    await client.from("access_logs").insert({
      user_id: userId,
      action: "redeem_code",
      detail: `用户 ${nickname} 使用邀请码 ${code} 兑换（类型: ${kind}，角色: ${newRole}，到账额度: ${grantCredits}）`,
    });

    // 4) role 可能变了，重新签发令牌，让前端本地会话跟上服务端
    const token = signSession({
      userId,
      nickname,
      role: newRole,
      ver: result.token_version ?? 0,
    });

    return NextResponse.json({
      success: true,
      role: newRole,
      credits: newBalance,
      kind,
      grantedAccess: kind !== "ai",       // 本次兑换是否获得了使用权
      grantedCredits: grantCredits,        // 本次到账的 AI 额度
      token,
    });
  } catch (err) {
    console.error("invite 兑换失败:", err);
    return NextResponse.json({ error: "服务器错误，请稍后重试" }, { status: 500 });
  }
}
