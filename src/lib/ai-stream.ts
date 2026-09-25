/**
 * AI 流式客户端 — AI 流式客户端
 * 支持 OpenAI-compatible API + SSE streaming
 */

const DEFAULT_BASE_URL = process.env.AI_API_URL || "https://ark.cn-beijing.volces.com/api/v3";
const DEFAULT_API_KEY = process.env.AI_API_KEY || "";
const DEFAULT_MODEL = process.env.AI_MODEL || "doubao-seed-2-0-lite-260215";

interface StreamChunk {
  content?: string;
  error?: string;
}

/**
 * 调用 OpenAI-compatible chat completions API，返回异步可迭代流
 */
export async function* streamChat(
  messages: { role: string; content: string }[],
  options?: { model?: string; temperature?: number; baseUrl?: string; apiKey?: string }
): AsyncGenerator<StreamChunk> {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const apiKey = options?.apiKey || DEFAULT_API_KEY;
  const model = options?.model || DEFAULT_MODEL;
  const temperature = options?.temperature ?? 0.7;

  const url = `${baseUrl}/chat/completions`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      temperature,
      stream: true,
      max_tokens: 4096,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    let errMsg = `AI 请求失败: HTTP ${response.status}`;
    try {
      const errJson = JSON.parse(errText);
      errMsg = errJson.error?.message || errJson.message || errMsg;
    } catch {}
    yield { error: errMsg };
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    yield { error: "无法读取响应流" };
    return;
  }

  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith("data: ")) continue;
        const data = trimmed.slice(6);
        if (data === "[DONE]") return;
        try {
          const json = JSON.parse(data);
          const content = json.choices?.[0]?.delta?.content;
          if (content) {
            yield { content };
          }
        } catch {
          // 忽略解析错误
        }
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * 非流式调用（用于 API Key 测试等场景）
 */
export async function invokeChat(
  messages: { role: string; content: string }[],
  options?: { model?: string; temperature?: number; baseUrl?: string; apiKey?: string; maxTokens?: number }
): Promise<{ content?: string; error?: string }> {
  const baseUrl = options?.baseUrl || DEFAULT_BASE_URL;
  const apiKey = options?.apiKey || DEFAULT_API_KEY;
  const model = options?.model || DEFAULT_MODEL;

  const url = `${baseUrl}/chat/completions`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options?.temperature ?? 0.5,
        max_tokens: options?.maxTokens ?? 50,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      let errMsg = `AI 请求失败: HTTP ${response.status}`;
      try {
        const errJson = JSON.parse(errText);
        errMsg = errJson.error?.message || errJson.message || errMsg;
      } catch {}
      return { error: errMsg };
    }

    const data = await response.json() as Record<string, unknown>;
    const choices = data.choices as Array<{ message: { content: string } }> | undefined;
    if (choices && choices.length > 0) {
      return { content: choices[0].message.content };
    }
    return { error: "模型返回空内容" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "未知错误" };
  }
}