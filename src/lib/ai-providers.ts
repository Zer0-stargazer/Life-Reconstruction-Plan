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

/** 前端传来的用户 AI 源配置 */
export interface AiSourceConfig {
  provider?: string;
  apiKey?: string;
  model?: string;
}

export type ResolvedAiSource =
  | { kind: "env"; model?: string }
  | { kind: "openai"; baseUrl: string; apiKey: string; model?: string; provider: string }
  | { kind: "minimax"; apiKey: string; model?: string; provider: string }
  | { kind: "claude"; apiKey: string; model?: string; provider: string }
  | { kind: "gemini"; apiKey: string; model?: string; provider: string }
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

  if (!ALL_AI_PROVIDERS.includes(provider)) {
    return { kind: "invalid", reason: `不支持的 AI 厂商: ${provider}` };
  }
  if (!apiKey) {
    return { kind: "invalid", reason: `${provider} 缺少 API Key` };
  }
  if (apiKey.length > 1000) {
    return { kind: "invalid", reason: "API Key 格式异常" };
  }

  if (provider === "claude") return { kind: "claude", apiKey, model, provider };
  if (provider === "gemini") return { kind: "gemini", apiKey, model, provider };
  if (provider === "minimax") return { kind: "minimax", apiKey, model, provider };

  const baseUrl = OPENAI_COMPAT_BASE_URLS[provider];
  if (!baseUrl) return { kind: "invalid", reason: `厂商配置缺失: ${provider}` };
  return { kind: "openai", baseUrl, apiKey, model, provider };
}
