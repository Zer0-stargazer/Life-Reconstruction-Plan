import { NextRequest, NextResponse } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { sessionFromRequest } from "@/lib/session";

/** GET /api/ai/credits - 查询当前登录用户的剩余 AI 额度（需要会话令牌） */
export async function GET(request: NextRequest) {
  const session = sessionFromRequest(request);
  if (!session) {
    return NextResponse.json({ success: false, error: "登录态无效或已过期" }, { status: 401 });
  }

  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from("app_users")
      .select("ai_credits, ai_credits_total, role, is_active")
      .eq("id", session.userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 });
    if (!data.is_active) {
      return NextResponse.json({ success: false, error: "该账号已被禁用" }, { status: 403 });
    }

    // 开发者不消耗额度，前端可按 role 提示"不限量"（role 以数据库为准）
    return NextResponse.json({
      success: true,
      credits: data.ai_credits ?? 0,
      total: data.ai_credits_total ?? 0,
      role: data.role,
    });
  } catch (err) {
    console.error("credits 查询失败:", err);
    return NextResponse.json({ success: false, error: "服务器错误，请稍后重试" }, { status: 500 });
  }
}
