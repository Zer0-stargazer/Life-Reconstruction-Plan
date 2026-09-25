import { NextRequest, NextResponse } from "next/server";
import { invokeChat } from "@/lib/ai-stream";

interface TestKeyRequest {
  provider: string;
  apiKey?: string;
  model?: string;
}

// External provider API configurations
const PROVIDER_CONFIGS: Record<string, {
  url: (model: string) => string;
  method: string;
  headers: (apiKey: string) => Record<string, string>;
  body: (model: string) => string;
  extractResponse: (data: Record<string, unknown>) => { success: boolean; snippet?: string; error?: string };
}> = {
  gemini: {
    url: (model) => `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
    method: "POST",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    }),
    body: () => JSON.stringify({
      contents: [{ parts: [{ text: "你好，用一句话回复确认你在工作" }] }],
      generationConfig: { maxOutputTokens: 50 },
    }),
    extractResponse: (data) => {
      const candidates = data.candidates as Array<{ content: { parts: Array<{ text: string }> } }> | undefined;
      if (candidates && candidates.length > 0) {
        const text = candidates[0]?.content?.parts?.[0]?.text;
        return { success: true, snippet: text?.slice(0, 60) };
      }
      const error = data.error as { message?: string } | undefined;
      return { success: false, error: error?.message || "未知错误" };
    },
  },

  claude: {
    url: () => "https://api.anthropic.com/v1/messages",
    method: "POST",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    }),
    body: (model) => JSON.stringify({
      model,
      max_tokens: 50,
      messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
    }),
    extractResponse: (data) => {
      const content = data.content as Array<{ text: string }> | undefined;
      if (content && content.length > 0) {
        return { success: true, snippet: content[0].text?.slice(0, 60) };
      }
      const error = data.error as { message?: string } | undefined;
      return { success: false, error: error?.message || "未知错误" };
    },
  },

  glm: {
    url: () => "https://open.bigmodel.cn/api/paas/v4/chat/completions",
    method: "POST",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (model) => JSON.stringify({
      model,
      max_tokens: 50,
      messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
    }),
    extractResponse: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      if (choices && choices.length > 0) {
        return { success: true, snippet: choices[0].message.content?.slice(0, 60) };
      }
      const error = data.error as { message?: string } | undefined;
      return { success: false, error: error?.message || "未知错误" };
    },
  },

  qwen: {
    url: () => "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    method: "POST",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (model) => JSON.stringify({
      model,
      max_tokens: 50,
      messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
    }),
    extractResponse: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      if (choices && choices.length > 0) {
        return { success: true, snippet: choices[0].message.content?.slice(0, 60) };
      }
      const error = data.error as { message?: string } | undefined;
      return { success: false, error: error?.message || "未知错误" };
    },
  },

  deepseek: {
    url: () => "https://api.deepseek.com/chat/completions",
    method: "POST",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (model) => JSON.stringify({
      model,
      max_tokens: 50,
      messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
    }),
    extractResponse: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      if (choices && choices.length > 0) {
        return { success: true, snippet: choices[0].message.content?.slice(0, 60) };
      }
      const error = data.error as { message?: string } | undefined;
      return { success: false, error: error?.message || "未知错误" };
    },
  },

  doubao: {
    url: () => "https://ark.cn-beijing.volces.com/api/v3/chat/completions",
    method: "POST",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (model) => JSON.stringify({
      model,
      max_tokens: 50,
      messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
    }),
    extractResponse: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      if (choices && choices.length > 0) {
        return { success: true, snippet: choices[0].message.content?.slice(0, 60) };
      }
      const error = data.error as { message?: string } | undefined;
      return { success: false, error: error?.message || "未知错误" };
    },
  },

  minimax: {
    url: () => "https://api.minimax.chat/v1/text/chatcompletion_v2",
    method: "POST",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (model) => JSON.stringify({
      model,
      max_tokens: 50,
      messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
    }),
    extractResponse: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      if (choices && choices.length > 0) {
        return { success: true, snippet: choices[0].message.content?.slice(0, 60) };
      }
      const baseResp = data.base_resp as { status_msg?: string } | undefined;
      return { success: false, error: baseResp?.status_msg || "未知错误" };
    },
  },

  mimo: {
    url: () => "https://xiaomimimimi.cn/v1/chat/completions",
    method: "POST",
    headers: (apiKey) => ({
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    }),
    body: (model) => JSON.stringify({
      model,
      max_tokens: 50,
      messages: [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
    }),
    extractResponse: (data) => {
      const choices = data.choices as Array<{ message: { content: string } }> | undefined;
      if (choices && choices.length > 0) {
        return { success: true, snippet: choices[0].message.content?.slice(0, 60) };
      }
      const error = data.error as { message?: string } | undefined;
      return { success: false, error: error?.message || "未知错误" };
    },
  },
};

function getDefaultModel(provider: string): string {
  const defaults: Record<string, string> = {
    gemini: "gemini-2.5-pro",
    claude: "claude-sonnet-4-6-20260219",
    glm: "glm-5.1",
    qwen: "qwen3.6-plus",
    deepseek: "deepseek-chat",
    doubao: "doubao-2.0-pro",
    minimax: "MiniMax-M2.7",
    mimo: "MiMo-V2-Pro",
    builtin: "doubao-seed-2-0-lite-260215",
  };
  return defaults[provider] || "";
}

export async function POST(request: NextRequest) {
  try {
    const { provider, apiKey, model } = (await request.json()) as TestKeyRequest;

    if (!provider) {
      return NextResponse.json(
        { success: false, error: "缺少必要参数" },
        { status: 400 }
      );
    }

    const effectiveModel = model || getDefaultModel(provider);

    // Handle built-in: use AI_API_KEY from env
    if (provider === "builtin") {
      const result = await invokeChat(
        [{ role: "user", content: "你好，用一句话回复确认你在工作" }],
        { model: effectiveModel, temperature: 0.5 }
      );
      if (result.error) {
        return NextResponse.json({ success: false, error: result.error });
      }
      return NextResponse.json({
        success: true,
        message: `内置 AI 正常 (${effectiveModel})`,
        responseSnippet: result.content?.slice(0, 60),
      });
    }

    // External providers require an API key
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "缺少 API Key" },
        { status: 400 }
      );
    }

    const config = PROVIDER_CONFIGS[provider];
    if (!config) {
      return NextResponse.json(
        { success: false, error: `不支持的提供商: ${provider}` },
        { status: 400 }
      );
    }

    // Build URL (Gemini uses query param for key, others use header)
    const baseUrl = config.url(effectiveModel);
    const url = provider === "gemini"
      ? `${baseUrl}?key=${apiKey}`
      : baseUrl;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    let response: Response;
    try {
      response = await fetch(url, {
        method: config.method,
        headers: config.headers(apiKey),
        body: config.body(effectiveModel),
        signal: controller.signal,
      });
    } catch (fetchError) {
      clearTimeout(timeout);
      if (fetchError instanceof Error && fetchError.name === "AbortError") {
        return NextResponse.json({
          success: false,
          error: "请求超时（30秒），请检查网络或 API Key 是否正确",
        });
      }
      return NextResponse.json({
        success: false,
        error: `网络请求失败: ${fetchError instanceof Error ? fetchError.message : "未知错误"}`,
      });
    }

    clearTimeout(timeout);

    const data = await response.json() as Record<string, unknown>;

    if (!response.ok) {
      const errorMsg = (data.error as { message?: string })?.message
        || (data.message as string)
        || `HTTP ${response.status}: ${response.statusText}`;
      return NextResponse.json({
        success: false,
        error: errorMsg,
      });
    }

    const result = config.extractResponse(data);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `连接成功 (${effectiveModel})`,
        responseSnippet: result.snippet,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error || "模型返回异常",
      });
    }
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