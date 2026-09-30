import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { signSession } from "@/lib/session";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// POST /api/auth - register or login
export async function POST(request: NextRequest) {
  try {
    // 防爆破：密码最短只要 4 位，不限流就能被在线暴力破解。
    // 按 IP 限流，登录和注册共用同一个桶。
    const ip = getClientIp(request);
    const rl = rateLimit(`auth:${ip}`, 10, 5 * 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { error: `尝试过于频繁，请 ${rl.retryAfter} 秒后再试` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, nickname, password } = body;

    if (!nickname || !password) {
      return NextResponse.json({ error: "请输入昵称和密码" }, { status: 400 });
    }

    if (nickname.length > 50) {
      return NextResponse.json({ error: "昵称不能超过50个字符" }, { status: 400 });
    }

    if (password.length < 4) {
      return NextResponse.json({ error: "密码至少4位" }, { status: 400 });
    }

    const client = getSupabaseClient();

    if (action === "register") {
      // Check if nickname taken
      const { data: existing, error: checkError } = await client
        .from("app_users")
        .select("id")
        .eq("nickname", nickname)
        .maybeSingle();

      if (checkError) throw new Error(`查询失败: ${checkError.message}`);
      if (existing) {
        return NextResponse.json({ error: "该昵称已被注册" }, { status: 409 });
      }

      // Hash password with bcrypt
      const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

      // Create user
      const { data, error } = await client
        .from("app_users")
        .insert({
          nickname,
          password_hash: passwordHash,
          avatar: "👤",
          role: "normal",
        })
        .select("id, nickname, avatar, role, created_at")
        .single();

      if (error) throw new Error(`注册失败: ${error.message}`);

      // Log access
      await client.from("access_logs").insert({
        user_id: data.id,
        action: "register",
        detail: `用户 ${nickname} 注册`,
      });

      // 签发服务端会话令牌（敏感接口用它识别身份，不再信任请求体自报的 userId）
      const token = signSession({
        userId: data.id,
        nickname: data.nickname,
        role: data.role,
      });

      return NextResponse.json({ success: true, user: data, token });

    } else if (action === "login") {
      // Find user
      const { data: user, error } = await client
        .from("app_users")
        .select("id, nickname, avatar, role, password_hash, is_active, created_at")
        .eq("nickname", nickname)
        .maybeSingle();

      if (error) throw new Error(`查询失败: ${error.message}`);
      if (!user) {
        return NextResponse.json({ error: "该昵称未注册" }, { status: 404 });
      }
      if (!user.is_active) {
        return NextResponse.json({ error: "该账号已被禁用" }, { status: 403 });
      }

      // Verify password with bcrypt
      const passwordValid = await bcrypt.compare(password, user.password_hash);
      if (!passwordValid) {
        return NextResponse.json({ error: "密码错误" }, { status: 401 });
      }

      // Update last login
      await client
        .from("app_users")
        .update({ last_login_at: new Date().toISOString() })
        .eq("id", user.id);

      // Log access
      await client.from("access_logs").insert({
        user_id: user.id,
        action: "login",
        detail: `用户 ${nickname} 登录`,
      });

      // 解构丢弃敏感字段后再返回前端（password_hash / is_active 是有意不使用的）
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password_hash, is_active, ...safeUser } = user;

      // 签发服务端会话令牌（敏感接口用它识别身份，不再信任请求体自报的 userId）
      const token = signSession({
        userId: safeUser.id,
        nickname: safeUser.nickname,
        role: safeUser.role,
      });

      return NextResponse.json({ success: true, user: safeUser, token });

    } else {
      return NextResponse.json({ error: "无效操作" }, { status: 400 });
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : "服务器内部错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}