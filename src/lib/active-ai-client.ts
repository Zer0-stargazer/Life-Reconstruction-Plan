/**
 * 客户端：读取用户在 /user 页配置的当前 AI 源（localStorage）
 * 供各模块的 AI 分析请求携带 provider / apiKey / model。
 *
 * localStorage 结构与 user/page.tsx 保持一致：
 * - api-active-source: 'builtin' | providerId
 * - api-keys: Record<providerId, string>
 * - api-enabled-providers: Record<providerId, boolean>
 * - api-selected-models: Record<sourceId, modelId>
 */

export interface ActiveAiConfig {
  provider?: string;
  apiKey?: string;
  model?: string;
}

export function getActiveAiConfig(): ActiveAiConfig {
  try {
    const source = localStorage.getItem('api-active-source');
    const models = JSON.parse(localStorage.getItem('api-selected-models') || '{}') as Record<string, string>;

    if (!source || source === 'builtin') {
      return { provider: 'builtin', model: models['builtin'] };
    }

    const keys = JSON.parse(localStorage.getItem('api-keys') || '{}') as Record<string, string>;
    const enabled = JSON.parse(localStorage.getItem('api-enabled-providers') || '{}') as Record<string, boolean>;
    const apiKey = keys[source];

    // 未启用 / 未填 Key / 开关关闭 → 回退内置 AI（与 user 页"禁用后自动回退"文案一致）
    if (!apiKey || !apiKey.trim() || enabled[source] === false) {
      return { provider: 'builtin', model: models['builtin'] };
    }
    return { provider: source, apiKey: apiKey.trim(), model: models[source] };
  } catch {
    return { provider: 'builtin' };
  }
}
