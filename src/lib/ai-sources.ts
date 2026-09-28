import type { AiSourceConfig } from "@/lib/ai-providers";

/**
 * 用户自定义的 AI 接入源。
 *
 * 背景：项目原本只支持 8 家写死的厂商（baseUrl 内置官方域名）。
 * 但现实中很多人用的是**第三方中转站 / 自建网关 / 代理**的 Key，
 * 官方域名 + 中转站 Key 必然鉴权失败（实测报"令牌已过期或验证不正确"）。
 * 这里补上"像软件里接入自定义模型一样"的能力：地址、密钥、模型都由用户填。
 *
 * 存储：localStorage `ai-sources`（数组）+ `ai-active-source`（当前源 id）
 */

export type AiProtocol = "openai" | "claude" | "gemini" | "minimax";

export interface AiSource {
  id: string;
  /** 用户自命名，方便区分多个源 */
  name: string;
  /** 协议（决定怎么发请求），OpenAI 兼容覆盖绝大多数中转站 */
  protocol: AiProtocol;
  /** 接口地址，例如 https://api.apikey.fan/v1 */
  baseUrl: string;
  apiKey: string;
  model: string;
  enabled: boolean;
  createdAt: number;
  lastTest?: { ok: boolean; at: number; message?: string };
}

export const STORAGE_KEY_SOURCES = "ai-sources";
export const STORAGE_KEY_ACTIVE = "ai-active-source";

export const PROTOCOL_OPTIONS: { id: AiProtocol; label: string; hint: string }[] = [
  { id: "openai", label: "OpenAI 兼容", hint: "绝大多数中转站/自建网关都走这个，推荐先试" },
  { id: "claude", label: "Anthropic Claude", hint: "官方 Messages API 格式" },
  { id: "gemini", label: "Google Gemini", hint: "官方 generateContent 格式" },
  { id: "minimax", label: "MiniMax", hint: "官方 chatcompletion_v2 格式" },
];

/** 接口地址合法性：只允许 http/https，避免 javascript: 之类的注入 */
export function isValidBaseUrl(url: string): boolean {
  const v = url.trim();
  if (!v || v.length > 500) return false;
  return /^https?:\/\/[^\s]+$/i.test(v);
}

/** 规范化：去掉末尾斜杠，避免拼接出 // */
export function normalizeBaseUrl(url: string): string {
  return url.trim().replace(/\/+$/, "");
}

export function validateSource(input: Partial<AiSource>): string | null {
  if (!input.name || !input.name.trim()) return "请填写名称";
  if (input.name.trim().length > 40) return "名称不能超过 40 个字符";
  if (!input.protocol) return "请选择协议";
  if (!isValidBaseUrl(input.baseUrl || "")) return "接口地址必须以 http:// 或 https:// 开头";
  if (!input.apiKey || !input.apiKey.trim()) return "请填写 API Key";
  if ((input.apiKey || "").length > 1000) return "API Key 过长";
  if (!input.model || !input.model.trim()) return "请填写模型名";
  return null;
}

export function makeId(): string {
  return `src_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

/** 转成传给 analyze 的配置（服务端 resolveAiSource 能识别） */
export function toAiSourceConfig(source: AiSource): AiSourceConfig {
  return {
    // 自定义源统一用 "custom" 让服务端走 baseUrl 分支；
    // 协议信息单独给，服务端据此决定用哪种请求格式。
    provider: "custom",
    protocol: source.protocol,
    baseUrl: normalizeBaseUrl(source.baseUrl),
    apiKey: source.apiKey,
    model: source.model,
  } as AiSourceConfig;
}

/* ============ 导入 / 导出 ============ */

export interface SourcesFile {
  /** 文件格式标记，导入时校验 */
  _format: "life-reboot-ai-sources";
  _version: 1;
  exportedAt: string;
  sources: AiSource[];
}

export function serializeSources(sources: AiSource[]): string {
  const payload: SourcesFile = {
    _format: "life-reboot-ai-sources",
    _version: 1,
    exportedAt: new Date().toISOString(),
    sources,
  };
  return JSON.stringify(payload, null, 2);
}

export interface ParseResult {
  sources: AiSource[];
  skipped: number;
  error?: string;
}

/**
 * 解析导入内容。宽松处理：既支持本工具导出的完整文件，
 * 也支持直接粘一个数组；字段缺失的条目标记为跳过而不是整体失败。
 */
export function parseSources(text: string): ParseResult {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { sources: [], skipped: 0, error: "不是合法的 JSON" };
  }

  let list: unknown[];
  if (Array.isArray(raw)) {
    list = raw;
  } else if (raw && typeof raw === "object" && Array.isArray((raw as SourcesFile).sources)) {
    list = (raw as SourcesFile).sources;
  } else {
    return { sources: [], skipped: 0, error: "找不到源列表（期望数组或 { sources: [...] }）" };
  }

  const out: AiSource[] = [];
  let skipped = 0;

  for (const item of list) {
    if (!item || typeof item !== "object") { skipped += 1; continue; }
    const o = item as Record<string, unknown>;
    const candidate: Partial<AiSource> = {
      name: typeof o.name === "string" ? o.name : "",
      protocol: (typeof o.protocol === "string" ? o.protocol : "openai") as AiProtocol,
      baseUrl: typeof o.baseUrl === "string" ? o.baseUrl : "",
      apiKey: typeof o.apiKey === "string" ? o.apiKey : "",
      model: typeof o.model === "string" ? o.model : "",
    };
    if (!PROTOCOL_OPTIONS.some((p) => p.id === candidate.protocol)) candidate.protocol = "openai";
    if (validateSource(candidate)) { skipped += 1; continue; }

    out.push({
      id: typeof o.id === "string" && o.id ? o.id : makeId(),
      name: candidate.name!.trim(),
      protocol: candidate.protocol!,
      baseUrl: normalizeBaseUrl(candidate.baseUrl!),
      apiKey: candidate.apiKey!.trim(),
      model: candidate.model!.trim(),
      enabled: o.enabled === undefined ? true : Boolean(o.enabled),
      createdAt: typeof o.createdAt === "number" ? o.createdAt : Date.now(),
    });
  }

  if (!out.length) {
    return { sources: [], skipped, error: skipped ? "没有一条源能通过校验" : "文件里没有源" };
  }
  return { sources: out, skipped };
}
