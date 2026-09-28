/**
 * 客户端：读取用户在 /user 页配置的当前 AI 源（localStorage）
 * 供各模块的 AI 分析请求携带 provider / apiKey / model / baseUrl / protocol。
 *
 * localStorage 结构：
 * - api-active-source: 'builtin' | 厂商 id | 自定义源 id（src_xxx）
 * - api-keys / api-enabled-providers / api-selected-models：8 家内置厂商
 * - ai-sources：用户自定义源数组（见 ai-sources.ts）
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
    const source = localStorage.getItem("api-active-source");
    const models = JSON.parse(localStorage.getItem("api-selected-models") || "{}") as Record<string, string>;

    if (!source || source === "builtin") {
      return { provider: "builtin", model: models["builtin"] };
    }

    // 自定义源（id 以 src_ 开头，或能在 ai-sources 里找到）
    const sources = JSON.parse(localStorage.getItem(STORAGE_KEY_SOURCES) || "[]") as AiSource[];
    const custom = sources.find((s) => s.id === source);
    if (custom) {
      if (!custom.enabled || !custom.apiKey?.trim()) {
        return { provider: "builtin", model: models["builtin"] };
      }
      return {
        provider: "custom",
        protocol: custom.protocol,
        baseUrl: custom.baseUrl,
        apiKey: custom.apiKey.trim(),
        model: custom.model,
      };
    }

    const keys = JSON.parse(localStorage.getItem("api-keys") || "{}") as Record<string, string>;
    const enabled = JSON.parse(localStorage.getItem("api-enabled-providers") || "{}") as Record<string, boolean>;
    const apiKey = keys[source];

    // 未启用 / 未填 Key / 开关关闭 → 回退内置 AI
    if (!apiKey || !apiKey.trim() || enabled[source] === false) {
      return { provider: "builtin", model: models["builtin"] };
    }
    return { provider: source, apiKey: apiKey.trim(), model: models[source] };
  } catch {
    return { provider: "builtin" };
  }
}
