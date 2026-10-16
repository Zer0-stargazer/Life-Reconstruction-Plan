import { NextRequest, NextResponse } from "next/server";
import { isValidCustomBaseUrl, CUSTOM_PROTOCOLS, type CustomProtocol } from "@/lib/ai-providers";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { sessionFromRequestVerified } from "@/lib/session";

/** 测试连接最多等 30s，给平台留一点余量 */
export const maxDuration = 45;

interface TestKeyRequest {
  provider: string;
  apiKey?: string;
  model?: string;
  /** 自定义源：接口地址 */
  baseUrl?: string;
  /** 自定义源：协议 openai / claude / gemini / minimax */
  protocol?: string;
}


export async function POST(request: NextRequest) {
  try {
    // 单 IP 限流：测试连接会实际发起外部请求，防止被当作探测工具滥用
    const ip = getClientIp(request);
    const rl = await rateLimit(`ai-test-key:${ip}`, 10, 60_000);
    if (!rl.ok) {
      return NextResponse.json(
        { success: false, error: `请求过于频繁，请 ${rl.retryAfter} 秒后再试` },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    // 需要登录：避免匿名用户把服务端当作外部请求探测工具
    if (!await sessionFromRequestVerified(request)) {
      return NextResponse.json({ success: false, error: "请先登录后再测试连接" }, { status: 401 });
    }

    const { provider, apiKey, model, baseUrl: reqBaseUrl, protocol } = (await request.json()) as TestKeyRequest;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "缺少必要参数" },
        { status: 400 }
      );
    }

    // ---- 自定义源：地址由用户提供（第三方中转站 / 自建网关 / 本地模型） ----
    if (provider === "custom") {
      if (!apiKey || !apiKey.trim()) {
        return NextResponse.json({ success: false, error: "缺少 API Key" }, { status: 400 });
      }
      const rawBase = (reqBaseUrl || "").trim();
      if (!rawBase || !isValidCustomBaseUrl(rawBase)) {
        return NextResponse.json(
          { success: false, error: "接口地址无效（需以 http:// 或 https:// 开头）" },
          { status: 400 }
        );
      }
      const base = rawBase.replace(/\/+$/, "");
      const proto =
        protocol && (CUSTOM_PROTOCOLS as readonly string[]).includes(protocol)
          ? (protocol as CustomProtocol)
          : "openai";
      const m = (model || "").trim() || "gpt-4o-mini";

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 30000);

      // 推理型模型（GLM-5 等）默认会把 token 全花在思维链上、正文为空，
      // 与 ai-stream.ts 保持一致：默认关掉，否则"测试成功"却看不到任何回复。
      const noThinking = process.env.AI_THINKING === "1"
        ? { thinking: { type: "enabled" } }
        : { thinking: { type: "disabled" } };

      let url: string;
      let headers: Record<string, string>;
      let body: string;

      if (proto === "claude") {
        url = `${base}/messages`;
        headers = {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        };
        body = JSON.stringify({
          model: m,
          max_tokens: 50,
          messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
        });
      } else if (proto === "gemini") {
        url = `${base}/models/${encodeURIComponent(m)}:generateContent`;
        // Key 走请求头而不是 URL 查询串，避免被代理/日志记录
        headers = { "Content-Type": "application/json", "x-goog-api-key": apiKey };
        body = JSON.stringify({
          contents: [{ parts: [{ text: "你好，用一句话回复确认你在工作" }] }],
          generationConfig: { maxOutputTokens: 50 },
        });
      } else if (proto === "minimax") {
        url = `${base}/chatcompletion_v2`;
        headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
        body = JSON.stringify({
          model: m,
          max_tokens: 50,
          messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
        });
      } else {
        url = `${base}/chat/completions`;
        headers = { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` };
        body = JSON.stringify({
          model: m,
          max_tokens: 50,
          messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
          ...noThinking,
        });
      }

      // 防探测：HTTP 状态 / 超时 / 网络失败统一一句话，不区分原因、不回显上游任何内容
      const CONNECT_FAILED = "连接失败，请检查地址、Key 与模型名";
      const startedAt = Date.now();
      let res: Response;
      try {
        res = await fetch(url, { method: "POST", headers, body, signal: controller.signal, redirect: "error" });
      } catch {
        clearTimeout(timer);
        return NextResponse.json({ success: false, error: CONNECT_FAILED });
      }
      clearTimeout(timer);

      if (!res.ok) {
        // 丢弃响应体，释放连接
        await res.body?.cancel().catch(() => {});
        return NextResponse.json({ success: false, error: CONNECT_FAILED });
      }
      await res.body?.cancel().catch(() => {});

      // 成功只回「连接成功」与耗时，不回显模型名与输出片段
      return NextResponse.json({
        success: true,
        message: "连接成功",
        elapsedMs: Date.now() - startedAt,
      });
    }
    return NextResponse.json(
      { success: false, error: "仅支持测试自定义接入源" },
      { status: 400 }
    );
  } catch (error) {
    console.error("test-key 异常:", error);
    return NextResponse.json(
      { success: false, error: "服务器内部错误，请稍后重试" },
      { status: 500 }
    );
  }
}