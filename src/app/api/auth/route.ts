import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

// POST /api/auth - register or login
export async function POST(request: NextRequest) {
  try {
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

      return NextResponse.json({ success: true, user: data });

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

      const { password_hash, is_active, ...safeUser } = user;
      return NextResponse.json({ success: true, user: safeUser });

    } else {
      return NextResponse.json({ error: "无效操作" }, { status: 400 });
    }

  } catch (err) {
    const message = err instanceof Error ? err.message : "服务器内部错误";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}