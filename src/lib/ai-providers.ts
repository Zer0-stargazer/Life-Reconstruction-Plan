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

function isPrivateIPv4(a: number, b: number, c = -1): boolean {
  if (a === 0 || a === 10 || a === 127) return true;       // 0/8、10/8、127/8
  if (a === 100 && b >= 64 && b <= 127) return true;       // 100.64/10（含 100.100.100.200）
  if (a === 169 && b === 254) return true;                 // 链路本地 / 云元数据
  if (a === 172 && b >= 16 && b <= 31) return true;        // 172.16/12
  if (a === 192 && b === 168) return true;                 // 192.168/16
  if (a === 192 && b === 0 && c === 0) return true;        // 192.0.0.0/24（IETF 协议分配）
  if (a === 198 && (b === 18 || b === 19)) return true;    // 198.18.0.0/15（基准测试）
  if (a >= 224) return true;                               // 224/4 组播、240/4 保留、255.255.255.255 广播
  return false;
}

/** 把 IPv6 字面量（已去方括号）解析为 8 个 16 位组；无法解析返回 null */
function parseIPv6(host: string): number[] | null {
  let h = host.split('%')[0];
  // 末尾内嵌的点分 IPv4 转成两个十六进制组
  const tail = h.match(/^(.*:)(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (tail) {
    const o = [tail[2], tail[3], tail[4], tail[5]].map(Number);
    if (o.some((n) => n > 255)) return null;
    h = `${tail[1]}${((o[0] << 8) | o[1]).toString(16)}:${((o[2] << 8) | o[3]).toString(16)}`;
  }
  const halves = h.split('::');
  if (halves.length > 2) return null;
  const head = halves[0] ? halves[0].split(':') : [];
  const rest = halves.length === 2 && halves[1] ? halves[1].split(':') : [];
  const missing = 8 - head.length - rest.length;
  if (halves.length === 2 ? missing < 1 : missing !== 0) return null;
  const parts = [...head, ...Array(halves.length === 2 ? missing : 0).fill('0'), ...rest];
  const groups = parts.map((p) => (/^[0-9a-f]{1,4}$/.test(p) ? parseInt(p, 16) : NaN));
  return groups.length === 8 && groups.every((n) => !Number.isNaN(n)) ? groups : null;
}

/**
 * 判断主机名是否属于内网 / 回环 / 链路本地 / 云元数据地址（SSRF 防护）。
 * 自定义源只能指向公网地址；本地模型请通过公网可达的网关接入。
 * 残余风险：公网域名解析到内网 IP（DNS rebinding）无法在 URL 层面拦截。
 * 说明：生产部署在 Cloudflare Workers，Worker 无法访问内网，故不做 DNS 级校验；
 * 若迁移到可访问内网的运行环境（自建服务器 / 容器），必须补上 DNS 解析后的 IP 校验。
 */
export function isBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '').replace(/\.$/, '');
  if (host === 'localhost' || host.endsWith('.localhost')) return true;
  if (host.endsWith('.local') || host.endsWith('.internal')) return true;

  const ipv4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4) return isPrivateIPv4(Number(ipv4[1]), Number(ipv4[2]), Number(ipv4[3]));

  if (host.includes(':')) {
    const g = parseIPv6(host);
    if (!g) return true;                                              // 无法解析的 IPv6 一律拒绝
    if (g.every((n) => n === 0)) return true;                         // ::
    if (g.slice(0, 7).every((n) => n === 0) && g[7] === 1) return true; // ::1
    if ((g[0] & 0xfe00) === 0xfc00) return true;                      // fc00::/7
    if ((g[0] & 0xffc0) === 0xfe80) return true;                      // fe80::/10
    if ((g[0] & 0xff00) === 0xff00) return true;                      // ff00::/8 组播
    if (g[0] === 0x2002) return true;                                 // 2002::/16 6to4（内嵌任意 IPv4）
    if (g[0] === 0x2001 && g[1] === 0) return true;                   // 2001::/32 Teredo
    const first5Zero = g.slice(0, 5).every((n) => n === 0);
    const mapped = first5Zero && g[5] === 0xffff;                     // ::ffff:a.b.c.d
    const compat = g.slice(0, 6).every((n) => n === 0);               // ::a.b.c.d
    const nat64 = g[0] === 0x64 && g[1] === 0xff9b && g.slice(2, 6).every((n) => n === 0);
    if (mapped || compat || nat64) {
      return isPrivateIPv4(g[6] >> 8, g[6] & 0xff, g[7] >> 8);
    }
  }
  return false;
}

/** 公网地址允许的端口：默认（空）/80/443 + 常见自建模型网关端口 */
const ALLOWED_PUBLIC_PORTS = new Set([80, 443, 11434, 1234, 8000, 8080]);

/**
 * 端口白名单（仅对公网地址生效；回环/私网在生产本就被 isBlockedHost 整体拒绝，
 * 开发环境的 loopback 放行不受端口限制）。port 为 URL.port 字符串，空串=协议默认端口。
 */
export function isAllowedPort(port: string): boolean {
  if (!port) return true;
  const n = Number(port);
  return Number.isInteger(n) && ALLOWED_PUBLIC_PORTS.has(n);
}

function isSafeBaseUrl(url: string): boolean {
  const v = url.trim();
  if (!v || v.length > 500) return false;
  // 只允许 http/https，挡掉 javascript:、file: 等
  if (!/^https?:\/\/[^\s]+$/i.test(v)) return false;
  try {
    const parsed = new URL(v);
    const host = parsed.hostname;
    if (parsed.username || parsed.password) return false; // 禁止 userinfo（user:pass@host）
    // 开发环境放行回环地址：本地联调 Ollama / LM Studio 等自建模型是合法场景
    // （产品定位明确支持"自建网关/本地模型"）。生产环境保持拦截——
    // 服务端 fetch 的 localhost/127.0.0.1 属内网 SSRF 面，一律拒绝。
    if (process.env.NODE_ENV !== "production") {
      const h = host.toLowerCase().replace(/^\[|\]$/g, "");
      if (h === "localhost" || h.endsWith(".localhost") || h === "127.0.0.1" || h === "::1") {
        return true;
      }
    }
    if (isBlockedHost(host)) return false;
    return isAllowedPort(parsed.port);
  } catch {
    return false;
  }
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

/** 自定义源地址校验（analyze / test-key 路由共用）：http(s) + 拦截高危内网地址 */
export function isValidCustomBaseUrl(url: string): boolean {
  return isSafeBaseUrl(url);
}

/**
 * 把用户配置解析为服务端可执行的调用方式。
 * 不合规一律返回 invalid（调用方应回 400，而不是静默回退）。
 */
export function resolveAiSource(cfg?: AiSourceConfig): ResolvedAiSource {
  if (!cfg || !cfg.provider || cfg.provider === "builtin") {
    return { kind: "env" };
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

/**
 * 内置 AI 的备用源（env：AI_FALLBACK_URL / AI_FALLBACK_KEY / AI_FALLBACK_MODEL）。
 * 只有三件套齐全才视为已配置，否则返回 null（调用方即不启用容错）。
 * 备用源只在内置 AI 主源"未产出内容即失败"时启用；BYOK 自定义源不参与容错。
 * 返回与自定义源同构的 openai kind，直接复用 streamChatAuto 的 openai 分支。
 */
export function resolveFallbackSource(): ResolvedAiSource | null {
  const baseUrl = (process.env.AI_FALLBACK_URL || "").trim();
  const apiKey = (process.env.AI_FALLBACK_KEY || "").trim();
  const model = (process.env.AI_FALLBACK_MODEL || "").trim();
  if (!baseUrl || !apiKey || !model) return null;
  if (!isSafeBaseUrl(baseUrl)) {
    console.error("备用 AI 源地址不安全，已忽略:", baseUrl);
    return null;
  }
  return { kind: "openai", baseUrl: normalizeBaseUrl(baseUrl), apiKey, model, provider: "fallback" };
}
