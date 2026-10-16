import { NextRequest } from "next/server";
import { getSupabaseClient } from "@/storage/database/supabase-client";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { findBlockedTerm } from "@/lib/content-filter";
import { sessionFromRequestVerified } from "@/lib/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MIN_CONTENT = 5;
const MAX_CONTENT = 1000;
const MAX_CONTACT = 100;

/** 反馈相关模块白名单（与「支持作者」页表单选项一致） */
const MODULE_OPTIONS = ["通用", "时间", "窗口", "名字", "职业", "规律", "运气", "努力", "健康", "命运"];

/**
 * POST /api/feedback —— 提交反馈（登录可选）
 * body: { content: string; contact?: string; module?: string }
 * 流控：单 IP 3 次 / 10 分钟；内容过敏感词；服务端截断。
 */
export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const rl = await rateLimit(`feedback:${ip}`, 3, 600_000);
    if (!rl.ok) {
      return new Response(
        JSON.stringify({ error: `提交太频繁了，请 ${rl.retryAfter} 秒后再试` }),
        {
          status: 429,
          headers: {
            "Content-Type": "application/json",
            "Retry-After": String(rl.retryAfter),
          },
        }
      );
    }

    const body = await request.json().catch(() => null);
    const content = typeof body?.content === "string" ? body.content.trim() : "";
    if (content.length < MIN_CONTENT) {
      return new Response(
        JSON.stringify({ error: `反馈内容至少写 ${MIN_CONTENT} 个字，不然我猜不出你想说什么` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    const clipped = content.slice(0, MAX_CONTENT);

    const blocked = findBlockedTerm(clipped);
    if (blocked) {
      return new Response(
        JSON.stringify({ error: "内容包含被屏蔽的词句，请调整后再提交" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const contact = typeof body?.contact === "string" ? body.contact.trim().slice(0, MAX_CONTACT) : "";
    const moduleRaw = typeof body?.module === "string" ? body.module : "";
    const moduleTag = MODULE_OPTIONS.includes(moduleRaw) ? moduleRaw : "通用";

    // 登录可选：带有效会话则关联账号并记下昵称快照
    const session = await sessionFromRequestVerified(request).catch(() => null);
    let nickname: string | null = null;
    if (session) {
      const { data: me } = await getSupabaseClient()
        .from("app_users")
        .select("nickname")
        .eq("id", session.userId)
        .maybeSingle();
      nickname = (me?.nickname as string | undefined) ?? null;
    }

    const { error } = await getSupabaseClient().from("feedback").insert({
      user_id: session?.userId ?? null,
      nickname,
      contact: contact || null,
      module: moduleTag,
      content: clipped,
    });
    if (error) {
      console.error("feedback 写入失败:", error.message);
      return new Response(
        JSON.stringify({ error: "反馈保存失败，请稍后再试" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("feedback 接口异常:", err instanceof Error ? err.message : err);
    return new Response(
      JSON.stringify({ error: "服务暂时不可用，请稍后再试" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * GET /api/feedback —— 反馈列表（仅 developer）
 * 返回最近 200 条 + 未处理数量。
 */
export async function GET(request: NextRequest) {
  try {
    const session = await sessionFromRequestVerified(request);
    if (!session) {
      return new Response(JSON.stringify({ error: "未登录" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const client = getSupabaseClient();
    const { data: me, error: meError } = await client
      .from("app_users")
      .select("role, is_active")
      .eq("id", session.userId)
      .maybeSingle();
    if (meError || !me || !me.is_active || me.role !== "developer") {
      return new Response(JSON.stringify({ error: "无权限" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data, error } = await client
      .from("feedback")
      .select("id, nickname, contact, module, content, status, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) {
      console.error("feedback 查询失败:", error.message);
      return new Response(
        JSON.stringify({ error: "查询失败，请稍后再试" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const openCount = (data ?? []).filter((f) => f.status === "open").length;
    return new Response(JSON.stringify({ items: data ?? [], openCount }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("feedback 查询接口异常:", err instanceof Error ? err.message : err);
    return new Response(
      JSON.stringify({ error: "服务暂时不可用，请稍后再试" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
