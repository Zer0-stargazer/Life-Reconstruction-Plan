/**
 * AI 流式客户端 — AI 流式客户端
 * 支持 OpenAI-compatible API + SSE streaming
 */

import type { AiSourceConfig, ResolvedAiSource } from "./ai-providers";

/**
 * 内置 AI 的配置全部来自服务端 env（见 .env.example）。
 * 不再内置任何厂商地址与模型 id —— 旧版写死的火山方舟地址 + doubao 模型
 * 在没有官方 Key 时必然失败，且模型 id 早已过期，属于误导性的"假默认"。
 */
const ENV_BASE_URL = process.env.AI_API_URL || "";
const ENV_API_KEY = process.env.AI_API_KEY || "";
const ENV_MODEL = process.env.AI_MODEL || "";

/** 内置 AI 缺配置时的统一提示 */
const ENV_MISSING_MSG =
  "服务端未配置内置 AI：请在 .env.local 里填写 AI_API_URL / AI_API_KEY / AI_MODEL（参考 .env.example），或在「我的」页用自定义接入源";

function envConfigError(baseUrl: string, apiKey: string, model: string): string | null {
  if (!baseUrl || !apiKey || !model) return ENV_MISSING_MSG;
  return null;
}

interface StreamChunk {
  content?: string;
  error?: string;
}

/**
 * 调用 OpenAI-compatible chat completions API，返回异步可迭代流
 */
export async function* streamChat(
  messages: { role: string; content: string }[],
  options?: { model?: string; temperature?: number; baseUrl?: string; apiKey?: string; path?: string }
): AsyncGenerator<StreamChunk> {
  const baseUrl = options?.baseUrl || ENV_BASE_URL;
  const apiKey = options?.apiKey || ENV_API_KEY;
  const model = options?.model || ENV_MODEL;

  const cfgErr = envConfigError(baseUrl, apiKey, model);
  if (cfgErr) {
    yield { error: cfgErr };
    return;
  }

  const temperature = options?.temperature ?? 0.7;
  const path = options?.path || "/chat/completions";

  const url = `${baseUrl}${path}`;

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
      // 推理型模型（如 GLM-5 系列）默认会先吐一大段思维链再给正文，
      // 实测同一请求：开启 112 秒、关闭 6 秒。这里默认关闭，
      // 需要深度推理时用 AI_THINKING=1 打开。不支持该字段的厂商会忽略它。
      ...(process.env.AI_THINKING === "1"
        ? { thinking: { type: "enabled" } }
        : { thinking: { type: "disabled" } }),
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
  const baseUrl = options?.baseUrl || ENV_BASE_URL;
  const apiKey = options?.apiKey || ENV_API_KEY;
  const model = options?.model || ENV_MODEL;

  const cfgErr = envConfigError(baseUrl, apiKey, model);
  if (cfgErr) return { error: cfgErr };

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
        // 与 streamChat 保持一致：推理型模型（GLM-5 等）默认关闭思维链。
        // 实测不关时 token 全花在 reasoning_content 上，content 是空字符串，
        // 测试连接会拿到"成功但没内容"的结果。
        ...(process.env.AI_THINKING === "1"
          ? { thinking: { type: "enabled" } }
          : { thinking: { type: "disabled" } }),
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
    const choices = data.choices as Array<{
      message: { content?: string; reasoning_content?: string };
    }> | undefined;
    if (choices && choices.length > 0) {
      const msg = choices[0].message;
      // 推理型模型在思维链被打开时会把正文放进 reasoning_content，content 为空
      const text = (msg.content || msg.reasoning_content || "").trim();
      if (text) return { content: text };
    }
    return { error: "模型返回空内容" };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "未知错误" };
  }
}

/**
 * 逐行读取 SSE 数据帧（data: {...}），跨 chunk 拼缓冲
 */
async function* sseDataFrames(
  reader: ReadableStreamDefaultReader<Uint8Array>
): AsyncGenerator<string> {
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
        if (!trimmed.startsWith("data:")) continue;
        yield trimmed.slice(5).trim();
      }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Anthropic Messages API 流式适配（Claude 私有协议）
 */
export async function* streamChatClaude(
  messages: { role: string; content: string }[],
  opts: { apiKey: string; model?: string; temperature?: number; baseUrl?: string }
): AsyncGenerator<StreamChunk> {
  // 模型名必填：内置一个"猜的模型 id"大概率不存在（旧版写死的 id 已失效），
  // 不如直接报错让用户填准确的。
  const model = opts.model?.trim();
  if (!model) {
    yield { error: "缺少模型名：请在自定义接入源里填写准确的模型 id" };
    return;
  }
  const system = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
  const chat = messages
    .filter(m => m.role !== "system")
    .map(m => ({ role: m.role === "assistant" ? "assistant" : "user", content: m.content }));

  let response: Response;
  try {
    // 自定义源时地址由用户指定（自建/中转网关），否则用官方地址
    response = await fetch(`${opts.baseUrl || "https://api.anthropic.com/v1"}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": opts.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: 4096,
        stream: true,
        temperature: opts.temperature ?? 0.7,
        ...(system ? { system } : {}),
        messages: chat.length > 0 ? chat : [{ role: "user", content: "你好" }],
      }),
    });
  } catch (err) {
    yield { error: `Claude 请求失败: ${err instanceof Error ? err.message : "网络错误"}` };
    return;
  }

  if (!response.ok || !response.body) {
    const errText = await response.text().catch(() => "");
    let errMsg = `Claude 请求失败: HTTP ${response.status}`;
    try {
      const j = JSON.parse(errText);
      errMsg = j.error?.message || errMsg;
    } catch {}
    yield { error: errMsg };
    return;
  }

  const reader = response.body.getReader();
  try {
    for await (const frame of sseDataFrames(reader)) {
      if (frame === "[DONE]") return;
      try {
        const json = JSON.parse(frame) as {
          type?: string;
          delta?: { type?: string; text?: string };
          error?: { message?: string };
        };
        if (json.type === "content_block_delta" && json.delta?.text) {
          yield { content: json.delta.text };
        } else if (json.type === "message_stop") {
          return;
        } else if (json.type === "error") {
          yield { error: json.error?.message || "Claude 流式错误" };
          return;
        }
      } catch { /* 忽略解析错误 */ }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * Gemini streamGenerateContent 流式适配（Google 私有协议）
 */
export async function* streamChatGemini(
  messages: { role: string; content: string }[],
  opts: { apiKey: string; model?: string; temperature?: number; baseUrl?: string }
): AsyncGenerator<StreamChunk> {
  const rawModel = opts.model?.trim();
  if (!rawModel) {
    yield { error: "缺少模型名：请在自定义接入源里填写准确的模型 id" };
    return;
  }
  const model = encodeURIComponent(rawModel);
  const system = messages.filter(m => m.role === "system").map(m => m.content).join("\n\n");
  const contents = messages
    .filter(m => m.role !== "system")
    .map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  let response: Response;
  try {
    response = await fetch(
      `${opts.baseUrl || "https://generativelanguage.googleapis.com/v1beta"}/models/${model}:streamGenerateContent?alt=sse`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": opts.apiKey,
        },
        body: JSON.stringify({
          ...(system ? { systemInstruction: { parts: [{ text: system }] } } : {}),
          contents: contents.length > 0 ? contents : [{ role: "user", parts: [{ text: "你好" }] }],
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: opts.temperature ?? 0.7,
          },
        }),
      }
    );
  } catch (err) {
    yield { error: `Gemini 请求失败: ${err instanceof Error ? err.message : "网络错误"}` };
    return;
  }

  if (!response.ok || !response.body) {
    const errText = await response.text().catch(() => "");
    let errMsg = `Gemini 请求失败: HTTP ${response.status}`;
    try {
      const j = JSON.parse(errText);
      errMsg = j.error?.message || errMsg;
    } catch {}
    yield { error: errMsg };
    return;
  }

  const reader = response.body.getReader();
  try {
    for await (const frame of sseDataFrames(reader)) {
      try {
        const json = JSON.parse(frame) as {
          candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          error?: { message?: string };
        };
        if (json.error) {
          yield { error: json.error.message || "Gemini 流式错误" };
          return;
        }
        const text = json.candidates?.[0]?.content?.parts?.map(p => p.text || "").join("") || "";
        if (text) yield { content: text };
      } catch { /* 忽略解析错误 */ }
    }
  } finally {
    reader.releaseLock();
  }
}

/**
 * 统一入口：按解析出的 AI 源自动选择协议。
 * analyze 路由应使用本函数而非直接调用 streamChat。
 */
export async function* streamChatAuto(
  messages: { role: string; content: string }[],
  source: ResolvedAiSource,
  options?: { temperature?: number }
): AsyncGenerator<StreamChunk> {
  switch (source.kind) {
    case "env":
      yield* streamChat(messages, { model: source.model, temperature: options?.temperature });
      return;
    case "openai":
      yield* streamChat(messages, {
        baseUrl: source.baseUrl,
        apiKey: source.apiKey,
        model: source.model,
        temperature: options?.temperature,
      });
      return;
    case "minimax":
      // MiniMax chatcompletion_v2：Bearer 鉴权，SSE 沿用 OpenAI delta 格式
      yield* streamChat(messages, {
        // 自定义源地址必填（resolveAiSource 已校验），不再内置官方域名兜底
        baseUrl: source.baseUrl,
        path: source.protocol === "minimax" ? "/chatcompletion_v2" : "/chat/completions",
        apiKey: source.apiKey,
        model: source.model,
        temperature: options?.temperature,
      });
      return;
    case "claude":
      yield* streamChatClaude(messages, {
        baseUrl: source.baseUrl,
        apiKey: source.apiKey,
        model: source.model,
        temperature: options?.temperature,
      });
      return;
    case "gemini":
      yield* streamChatGemini(messages, {
        baseUrl: source.baseUrl,
        apiKey: source.apiKey,
        model: source.model,
        temperature: options?.temperature,
      });
      return;
    case "invalid":
      yield { error: source.reason };
      return;
  }
}

export type { AiSourceConfig };