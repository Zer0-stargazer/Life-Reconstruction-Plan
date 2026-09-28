/**
 * AI 厂商配置 — analyze / test-key 等服务端路由共用
 *
 * 分两类协议：
 * - OpenAI 兼容（POST {base}/chat/completions，SSE delta 格式）：doubao / glm / qwen / deepseek / mimo
 * - 私有协议：claude（Anthropic Messages SSE）、gemini（streamGenerateContent SSE）、minimax（chatcompletion_v2）
 */

export const OPENAI_COMPAT_BASE_URLS: Record<string, string> = {
  doubao: "https://ark.cn-beijing.volces.com/api/v3",
  glm: "https://open.bigmodel.cn/api/paas/v4",
  qwen: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  deepseek: "https://api.deepseek.com",
  mimo: "https://xiaomimimimi.cn/v1",
};

export const NON_OPENAI_PROVIDERS = ["claude", "gemini", "minimax"] as const;

export const ALL_AI_PROVIDERS: string[] = [
  ...Object.keys(OPENAI_COMPAT_BASE_URLS),
  ...NON_OPENAI_PROVIDERS,
];

/** 自定义源（用户自建端点）允许的协议 */
export const CUSTOM_PROTOCOLS = ["openai", "claude", "gemini", "minimax"] as const;
export type CustomProtocol = (typeof CUSTOM_PROTOCOLS)[number];

/** 前端传来的用户 AI 源配置 */
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
 * - 无 provider / builtin → 走服务端 env（内置 AI）
 * - provider 在白名单且带 Key → 走用户自己的源
 * - 其余情况返回 invalid（调用方应回 400，而不是静默回退）
 */
export function resolveAiSource(cfg?: AiSourceConfig): ResolvedAiSource {
  if (!cfg || !cfg.provider || cfg.provider === "builtin") {
    return { kind: "env", model: cfg?.model };
  }
  const provider = cfg.provider;
  const apiKey = (cfg.apiKey || "").trim();
  const model = cfg.model?.trim() || undefined;

  if (!apiKey) {
    return { kind: "invalid", reason: `${provider} 缺少 API Key` };
  }
  if (apiKey.length > 1000) {
    return { kind: "invalid", reason: "API Key 格式异常" };
  }

  // 自定义源：地址由用户提供（第三方中转站 / 自建网关 / 本地 ollama 等）
  // 注意：这个分支必须在下面的厂商白名单校验之前，custom 不在白名单里
  if (provider === "custom") {
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

  if (!ALL_AI_PROVIDERS.includes(provider)) {
    return { kind: "invalid", reason: `不支持的 AI 厂商: ${provider}` };
  }

  if (provider === "claude") {
    return { kind: "claude", baseUrl: "https://api.anthropic.com/v1", apiKey, model, provider };
  }
  if (provider === "gemini") {
    return { kind: "gemini", baseUrl: "https://generativelanguage.googleapis.com/v1beta", apiKey, model, provider };
  }
  if (provider === "minimax") {
    return { kind: "minimax", baseUrl: "https://api.minimax.chat/v1/text", apiKey, model, provider };
  }

  const baseUrl = OPENAI_COMPAT_BASE_URLS[provider];
  if (!baseUrl) return { kind: "invalid", reason: `厂商配置缺失: ${provider}` };
  return { kind: "openai", baseUrl, apiKey, model, provider, protocol: "openai" };
}
