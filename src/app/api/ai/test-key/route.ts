import { NextRequest, NextResponse } from "next/server";
import { invokeChat } from "@/lib/ai-stream";

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
    // 注意：这里重命名，避免与下面内置厂商分支里的 `const baseUrl = config.url(...)` 冲突
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
      if (!rawBase || rawBase.length > 500 || !/^https?:\/\/[^\s]+$/i.test(rawBase)) {
        return NextResponse.json(
          { success: false, error: "接口地址无效（需以 http:// 或 https:// 开头）" },
          { status: 400 }
        );
      }
      const base = rawBase.replace(/\/+$/, "");
      const proto = protocol && ["openai", "claude", "gemini", "minimax"].includes(protocol)
        ? protocol
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
        url = `${base}/models/${encodeURIComponent(m)}:generateContent?key=${apiKey}`;
        headers = { "Content-Type": "application/json" };
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

      let res: Response;
      try {
        res = await fetch(url, { method: "POST", headers, body, signal: controller.signal });
      } catch (e) {
        clearTimeout(timer);
        if (e instanceof Error && e.name === "AbortError") {
          return NextResponse.json({ success: false, error: "请求超时（30秒），请检查地址或 Key" });
        }
        return NextResponse.json(
          { success: false, error: `网络请求失败: ${e instanceof Error ? e.message : "未知错误"}` }
        );
      }
      clearTimeout(timer);

      const raw = await res.text();
      let data: Record<string, unknown> = {};
      try { data = JSON.parse(raw); } catch { /* 非 JSON 响应 */ }

      if (!res.ok) {
        const msg = (data as { error?: { message?: string } }).error?.message
          || (data as { message?: string }).message
          || raw.slice(0, 120)
          || `HTTP ${res.status}: ${res.statusText}`;
        return NextResponse.json({ success: false, error: msg });
      }

      // OpenAI 兼容：正文可能在 content（常规模型）或 reasoning_content（推理模型）里
      const openaiSnippet = (() => {
        const msg = (data.choices as Array<{ message?: { content?: string; reasoning_content?: string } }>)?.[0]?.message;
        return (msg?.content || msg?.reasoning_content || "").slice(0, 60);
      })();

      const snippet =
        proto === "claude"
          ? ((data.content as Array<{ text?: string }>)?.[0]?.text?.slice(0, 60) ?? "")
          : proto === "gemini"
            ? ((data.candidates as Array<{ content?: { parts?: Array<{ text?: string }> } }>)?.[0]?.content?.parts?.[0]?.text?.slice(0, 60) ?? "")
            : openaiSnippet;

      return NextResponse.json({
        success: true,
        message: `连接成功 · ${m}`,
        responseSnippet: snippet,
      });
    }

    // ---- 内置 AI：走服务端 .env 的 AI_API_URL / AI_API_KEY / AI_MODEL ----
    if (provider === "builtin") {
      const result = await invokeChat(
        [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
        { temperature: 0.5 }
      );
      if (result.error) {
        return NextResponse.json({ success: false, error: result.error });
      }
      return NextResponse.json({
        success: true,
        message: "内置 AI 正常",
        responseSnippet: result.content?.slice(0, 60),
      });
    }

    return NextResponse.json(
      { success: false, error: `不支持的 AI 来源: ${provider}（仅支持 builtin 与 custom）` },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "服务器内部错误",
      },
      { status: 500 }
    );
  }
}