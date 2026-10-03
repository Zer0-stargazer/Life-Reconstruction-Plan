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
      .select("ai_credits, ai_credits_total, role")
      .eq("id", session.userId)
      .maybeSingle();

    if (error) throw new Error(`查询失败: ${error.message}`);
    if (!data) return NextResponse.json({ success: false, error: "用户不存在" }, { status: 404 });

    // 开发者不消耗额度，前端可按 role 提示"不限量"
    return NextResponse.json({
      success: true,
      credits: data.ai_credits ?? 0,
      total: data.ai_credits_total ?? 0,
      role: data.role,
    });
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : "服务器错误" },
      { status: 500 }
    );
  }
}
