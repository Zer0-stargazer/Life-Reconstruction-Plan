/**
 * AI 源解析 — analyze / test-key 等服务端路由共用
 *
 * 只支持两种来源（2026-09-28 简化）：
 * - 内置 AI：provider 缺省 / 'builtin' → 走服务端 env（AI_API_URL / AI_API_KEY / AI_MODEL）
 * - 自定义源：provider 'custom' → 用户自己填的接口地址 + 协议 + Key + 模型
 *
 * 原先写死的 8 家厂商（官方域名 + 硬编码模型 id）已移除：
 * 它们与用户实际手上的第三方中转站 Key 对不上（官方地址 + 中转站 Key 必然鉴权失败），
 * 且模型列表是过期/未经核实的数据。自定义接入源可以覆盖同样的场景且更灵活。
 */

/** 自定义源允许的协议 */
export const CUSTOM_PROTOCOLS = ["openai", "claude", "gemini", "minimax"] as const;
export type CustomProtocol = (typeof CUSTOM_PROTOCOLS)[number];

/** 前端传来的 AI 源配置 */
export interface AiSourceConfig {
  provider?: string;
  apiKey?: string;
  model?: string;
  /** 自定义源：接口地址（http/https） */
  baseUrl?: string;
  /** 自定义源：协议类型，决定用哪种请求格式 */
  protocol?: string;
}

function isSafeBaseUrl(url: string): boolean {
  const v = url.trim();
  if (!v || v.length > 500) return false;
  // 只允许 http/https，挡掉 javascript:、file: 等
  return /^https?:\/\/[^\s]+$/i.test(v);
}

function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export type ResolvedAiSource =
  | { kind: "env"; model?: string }
  | { kind: "openai"; baseUrl: string; apiKey: string; model?: string; provider: string; protocol?: string }
  | { kind: "minimax"; baseUrl: string; apiKey: string; model?: string; provider: string; protocol?: string }
  | { kind: "claude"; baseUrl: string; apiKey: string; model?: string; provider: string; protocol?: string }
  | { kind: "gemini"; baseUrl: string; apiKey: string; model?: string; provider: string; protocol?: string }
  | { kind: "invalid"; reason: string };

/**
 * 把用户配置解析为服务端可执行的调用方式。
 * 不合规一律返回 invalid（调用方应回 400，而不是静默回退）。
 */
export function resolveAiSource(cfg?: AiSourceConfig): ResolvedAiSource {
  if (!cfg || !cfg.provider || cfg.provider === "builtin") {
    return { kind: "env", model: cfg?.model };
  }

  const provider = cfg.provider;
  const apiKey = (cfg.apiKey || "").trim();
  const model = cfg.model?.trim() || undefined;

  if (provider !== "custom") {
    return { kind: "invalid", reason: `不支持的 AI 来源: ${provider}（仅支持 builtin 与 custom）` };
  }
  if (!apiKey) {
    return { kind: "invalid", reason: "缺少 API Key" };
  }
  if (apiKey.length > 1000) {
    return { kind: "invalid", reason: "API Key 格式异常" };
  }

  const rawUrl = (cfg.baseUrl || "").trim();
  if (!isSafeBaseUrl(rawUrl)) {
    return { kind: "invalid", reason: "接口地址无效（需以 http:// 或 https:// 开头）" };
  }
  const baseUrl = normalizeBaseUrl(rawUrl);
  const protocol = (cfg.protocol && CUSTOM_PROTOCOLS.includes(cfg.protocol as CustomProtocol)
    ? cfg.protocol
    : "openai") as CustomProtocol;

  switch (protocol) {
    case "claude":
      return { kind: "claude", baseUrl, apiKey, model, provider, protocol };
    case "gemini":
      return { kind: "gemini", baseUrl, apiKey, model, provider, protocol };
    case "minimax":
      return { kind: "minimax", baseUrl, apiKey, model, provider, protocol };
    default:
      return { kind: "openai", baseUrl, apiKey, model, provider, protocol: "openai" };
  }
}
