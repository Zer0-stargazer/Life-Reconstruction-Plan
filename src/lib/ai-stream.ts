import "server-only";
/**
 * AI 流式客户端 — AI 流式客户端
 * 支持 OpenAI-compatible API + SSE streaming
 */

import type { AiSourceConfig, ResolvedAiSource } from "./ai-providers";
import { AI_ERROR_MESSAGES, sanitizeUpstreamError, type AiErrorCode } from "./ai-safety";

/**
 * 内置 AI 的配置全部来自服务端 env（见 .env.example）。
 * 不再内置任何厂商地址与模型 id —— 旧版写死的火山方舟地址 + doubao 模型
 * 在没有官方 Key 时必然失败，且模型 id 早已过期，属于误导性的"假默认"。
 */
const ENV_BASE_URL = process.env.AI_API_URL || "";
const ENV_API_KEY = process.env.AI_API_KEY || "";
const ENV_MODEL = process.env.AI_MODEL || "";

function envConfigError(baseUrl: string, apiKey: string, model: string, builtin: boolean): StreamChunk | null {
  if (baseUrl && apiKey && model) return null;
  if (builtin) {
    // 变量名等细节只进服务端日志，客户端只看到通用文案
    console.error("内置 AI 未配置完整（AI_API_URL / AI_API_KEY / AI_MODEL 缺失）");
    return { error: AI_ERROR_MESSAGES.NOT_CONFIGURED, code: "NOT_CONFIGURED" };
  }
  return { error: "自定义接入源缺少接口地址、Key 或模型名", code: "BAD_REQUEST" };
}

export interface StreamChunk {
  content?: string;
  /** 推理模型的思维链增量（GLM-5 等先出 reasoning_content 再出 content） */
  reasoning?: string;
  /** 面向客户端的错误文案：内置源为通用文案，自带 Key 源为已脱敏、限长的上游信息 */
  error?: string;
  code?: AiErrorCode;
}

/**
 * 构造对客户端可见的错误帧。原始细节只写服务端日志；
 * 内置源一律通用文案，自带 Key 源展示脱敏后的 detail（去 URL、限 200 字）。
 */
function failure(builtin: boolean, code: AiErrorCode, detail: unknown, label = "上游 AI 错误"): StreamChunk {
  console.error(`${label}:`, detail instanceof Error ? detail.message : detail);
  if (builtin) return { error: AI_ERROR_MESSAGES[code], code };
  return { error: sanitizeUpstreamError(detail), code };
}

/** 是否内置源（env 或 env 配置的备用源） */
function isBuiltinSource(source: ResolvedAiSource): boolean {
  return source.kind === "env" || (source.kind !== "invalid" && source.provider === "fallback");
}

/**
 * 调用 OpenAI-compatible chat completions API，返回异步可迭代流
 */
export async function* streamChat(
  messages: { role: string; content: string }[],
  options?: { model?: string; temperature?: number; baseUrl?: string; apiKey?: string; path?: string; signal?: AbortSignal; builtin?: boolean }
): AsyncGenerator<StreamChunk> {
  const baseUrl = options?.baseUrl || ENV_BASE_URL;
  const apiKey = options?.apiKey || ENV_API_KEY;
  const model = options?.model || ENV_MODEL;
  const builtin = options?.builtin ?? !options?.baseUrl;

  const cfgErr = envConfigError(baseUrl, apiKey, model, builtin);
  if (cfgErr) {
    yield cfgErr;
    return;
  }

  const temperature = options?.temperature ?? 0.7;
  const path = options?.path || "/chat/completions";

  const url = `${baseUrl}${path}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      redirect: "error",
      signal: options?.signal,
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
  } catch (err) {
    // P1 修复：首 fetch 网络异常转成 error 帧而不是未捕获 rejection（AbortError 原样上抛给调用方）
    if ((err as Error)?.name === "AbortError") throw err;
    yield failure(builtin, "UPSTREAM_UNAVAILABLE", `网络异常，无法连接 AI 服务（${(err as Error)?.message ?? "unknown"}）`, "上游 AI 连接失败");
    return;
  }

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    console.error("上游 AI 返回错误:", response.status, errText.slice(0, 500));
    yield failure(builtin, "UPSTREAM_UNAVAILABLE", `AI 请求失败: HTTP ${response.status}`, "上游 AI HTTP 错误");
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    yield failure(builtin, "UPSTREAM_UNAVAILABLE", "无法读取响应流");
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
          const reasoning = json.choices?.[0]?.delta?.reasoning_content;
          if (reasoning) {
            yield { reasoning };
          }
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
  opts: { apiKey: string; model?: string; temperature?: number; baseUrl?: string; signal?: AbortSignal }
): AsyncGenerator<StreamChunk> {
  // 模型名必填：内置一个"猜的模型 id"大概率不存在（旧版写死的 id 已失效），
  // 不如直接报错让用户填准确的。
  const model = opts.model?.trim();
  if (!model) {
    yield { error: "缺少模型名：请在自定义接入源里填写准确的模型 id", code: "BAD_REQUEST" };
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
      redirect: "error",
      signal: opts.signal,
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
    if ((err as Error)?.name === "AbortError") throw err;
    yield failure(false, "UPSTREAM_UNAVAILABLE", `Claude 请求失败: ${err instanceof Error ? err.message : "网络错误"}`, "Claude 请求失败");
    return;
  }

  if (!response.ok || !response.body) {
    const errText = await response.text().catch(() => "");
    let errMsg = `Claude 请求失败: HTTP ${response.status}`;
    try {
      const j = JSON.parse(errText);
      errMsg = j.error?.message || errMsg;
    } catch {}
    yield failure(false, "UPSTREAM_UNAVAILABLE", errMsg, "Claude 上游错误");
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
          yield failure(false, "UPSTREAM_UNAVAILABLE", json.error?.message || "Claude 流式错误", "Claude 流式错误");
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
  opts: { apiKey: string; model?: string; temperature?: number; baseUrl?: string; signal?: AbortSignal }
): AsyncGenerator<StreamChunk> {
  const rawModel = opts.model?.trim();
  if (!rawModel) {
    yield { error: "缺少模型名：请在自定义接入源里填写准确的模型 id", code: "BAD_REQUEST" };
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
        redirect: "error",
        signal: opts.signal,
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
    if ((err as Error)?.name === "AbortError") throw err;
    yield failure(false, "UPSTREAM_UNAVAILABLE", `Gemini 请求失败: ${err instanceof Error ? err.message : "网络错误"}`, "Gemini 请求失败");
    return;
  }

  if (!response.ok || !response.body) {
    const errText = await response.text().catch(() => "");
    let errMsg = `Gemini 请求失败: HTTP ${response.status}`;
    try {
      const j = JSON.parse(errText);
      errMsg = j.error?.message || errMsg;
    } catch {}
    yield failure(false, "UPSTREAM_UNAVAILABLE", errMsg, "Gemini 上游错误");
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
          yield failure(false, "UPSTREAM_UNAVAILABLE", json.error.message || "Gemini 流式错误", "Gemini 流式错误");
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
  options?: { temperature?: number; signal?: AbortSignal }
): AsyncGenerator<StreamChunk> {
  switch (source.kind) {
    case "env":
      yield* streamChat(messages, { model: source.model, temperature: options?.temperature, signal: options?.signal, builtin: true });
      return;
    case "openai":
      yield* streamChat(messages, {
        builtin: isBuiltinSource(source),
        baseUrl: source.baseUrl,
        apiKey: source.apiKey,
        model: source.model,
        temperature: options?.temperature,
        signal: options?.signal,
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
        signal: options?.signal,
      });
      return;
    case "claude":
      yield* streamChatClaude(messages, {
        baseUrl: source.baseUrl,
        apiKey: source.apiKey,
        model: source.model,
        temperature: options?.temperature,
        signal: options?.signal,
      });
      return;
    case "gemini":
      yield* streamChatGemini(messages, {
        baseUrl: source.baseUrl,
        apiKey: source.apiKey,
        model: source.model,
        temperature: options?.temperature,
        signal: options?.signal,
      });
      return;
    case "invalid":
      yield { error: sanitizeUpstreamError(source.reason), code: "BAD_REQUEST" };
      return;
  }
}

/**
 * 主源 + 备用源的容错入口。
 *
 * 语义：只有主源**在产出任何内容之前**就失败（HTTP 错误 / 连接失败 / 空响应）才切备用源。
 * 一旦主源已吐出正文或思维链，就不再切换——否则会把两段不同来源的正文拼接给用户。
 *
 * - 主源抛异常（多为超时 abort、客户端断开、网络错误）不在此处吞掉，原样上抛，
 *   交给 analyze 路由按既有错误路径处理（超时文案、退还额度）。
 * - fallback 为 null 时行为与 streamChatAuto 完全一致。
 */
export async function* streamChatWithFallback(
  messages: { role: string; content: string }[],
  primary: ResolvedAiSource,
  fallback: ResolvedAiSource | null,
  options?: { temperature?: number; signal?: AbortSignal }
): AsyncGenerator<StreamChunk> {
  if (!fallback || fallback.kind === "invalid") {
    yield* streamChatAuto(messages, primary, options);
    return;
  }

  let produced = false;
  for await (const chunk of streamChatAuto(messages, primary, options)) {
    if (chunk.error) {
      if (produced) {
        yield chunk; // 已流给用户内容：透传错误，不再切换（避免拼接半截正文）
        return;
      }
      break; // 未产出内容即失败 → 落到下方尝试备用源
    }
    if (chunk.content || chunk.reasoning) produced = true;
    yield chunk;
  }
  if (produced) return;

  // 主源失败，切备用源
  console.warn("内置 AI 主源失败，切换备用源");
  for await (const chunk of streamChatAuto(messages, fallback, options)) {
    if (chunk.error) {
      // 备用源同样失败：对客户端只给通用文案（内置源），细节已由 failure() 记入服务端日志
      console.error("内置 AI 备用源同样失败");
      yield chunk.code === "NOT_CONFIGURED"
        ? chunk
        : { error: AI_ERROR_MESSAGES.UPSTREAM_UNAVAILABLE, code: "UPSTREAM_UNAVAILABLE" };
      return;
    }
    yield chunk;
  }
}

export type { AiSourceConfig };
