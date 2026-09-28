/**
 * 客户端：读取用户在 /user 页配置的当前 AI 源（localStorage）
 * 供各模块的 AI 分析请求携带 provider / apiKey / model / baseUrl / protocol。
 *
 * AI 来源只有两种：
 * 1. 内置 AI（provider: 'builtin'）—— 走服务端 .env，模型由 AI_MODEL 决定
 * 2. 自定义接入源（provider: 'custom'）—— 地址/协议/Key/模型全由用户在 /user 页填
 *
 * （2026-09-28 移除了原先写死的 8 家厂商预设：官方地址 + 硬编码模型列表，
 *   与用户实际手上的中转站 Key 对不上，已由自定义接入源取代）
 *
 * localStorage：
 * - api-active-source: 'builtin' | 自定义源 id（src_xxx）
 * - ai-sources: 自定义源数组（见 ai-sources.ts）
 */

import type { AiSource } from "./ai-sources";
import { STORAGE_KEY_SOURCES } from "./ai-sources";

export interface ActiveAiConfig {
  provider?: string;
  apiKey?: string;
  model?: string;
  baseUrl?: string;
  protocol?: string;
}

export function getActiveAiConfig(): ActiveAiConfig {
  try {
    const sourceId = localStorage.getItem("api-active-source");
    if (!sourceId || sourceId === "builtin") return { provider: "builtin" };

    const sources = JSON.parse(localStorage.getItem(STORAGE_KEY_SOURCES) || "[]") as AiSource[];
    const custom = sources.find((s) => s.id === sourceId);

    // 源被删了 / 停用了 / 没填 Key → 回退内置 AI
    if (!custom || !custom.enabled || !custom.apiKey?.trim()) {
      return { provider: "builtin" };
    }

    return {
      provider: "custom",
      protocol: custom.protocol,
      baseUrl: custom.baseUrl,
      apiKey: custom.apiKey.trim(),
      model: custom.model,
    };
  } catch {
    return { provider: "builtin" };
  }
}
