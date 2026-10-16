import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * 轻量服务端会话令牌（HMAC-SHA256 签名）。
 *
 * 背景：本项目原本完全没有服务端会话——登录成功后只把整个 user 对象（含 role）
 * 明文存进 localStorage，服务端任何 API 都不校验身份。这意味着只要改一下浏览器
 * 控制台就能把自己变成 premium/developer，还能拿一个有效邀请码给任意 userId 升级。
 *
 * 这里补上最小可用的会话层：登录/注册时签发令牌，敏感接口（如兑换邀请码）
 * 用令牌里的 userId，不再信任请求体自报的 userId。
 *
 * 令牌格式：`<base64url(payload)>.<base64url(hmac)>`
 * 它只是签名（不是加密），payload 可被解码，请不要往里放敏感信息。
 */

export interface SessionPayload {
  userId: number;
  nickname: string;
  role: string;
  /** 会话版本号：签发时等于 app_users.token_version，改密/禁用等操作会使旧会话失效 */
  ver: number;
  /** 过期时间（Unix 秒） */
  exp: number;
}

/** 会话有效期：7 天 */
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

export const MIN_SECRET_LENGTH = 32;

// 开发环境的临时密钥：进程启动后首次需要时随机生成，挂在 globalThis 上，
// 避免 dev 下各路由模块实例各生成一份导致签发/校验不一致。重启即失效（旧登录态作废）。
const DEV_SECRET_KEY = Symbol.for("lrs.dev-session-secret");

/**
 * 会话签名密钥，只读 SESSION_SECRET。
 * - 生产环境：必须配置且 ≥32 字符，否则抛错（调用方按 500 通用文案处理），绝不使用默认值
 * - 开发环境：缺失或过短时 console.warn 并使用进程启动时随机生成的临时密钥（非硬编码常量）
 * verification.ts 的验证码哈希盐也走这里，保证两处口径一致。
 */
export function getSessionSecret(): string {
  const configured = process.env.SESSION_SECRET?.trim();
  if (configured && configured.length >= MIN_SECRET_LENGTH) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error(`SESSION_SECRET 未配置或长度不足 ${MIN_SECRET_LENGTH} 字符：生产环境必须设置会话密钥`);
  }

  const g = globalThis as unknown as Record<symbol, string | undefined>;
  let dev = g[DEV_SECRET_KEY];
  if (!dev) {
    dev = randomBytes(48).toString("base64url");
    g[DEV_SECRET_KEY] = dev;
    console.warn(
      `SESSION_SECRET 未配置或不足 ${MIN_SECRET_LENGTH} 字符，开发环境使用本次进程随机生成的临时密钥（重启后已登录会话失效）`
    );
  }
  return dev;
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function hmac(payloadB64: string): string {
  return b64url(createHmac("sha256", getSessionSecret()).update(payloadB64).digest());
}

/** 签发会话令牌 */
export function signSession(input: Omit<SessionPayload, "exp">): string {
  const payload: SessionPayload = {
    ...input,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };
  const payloadB64 = b64url(JSON.stringify(payload));
  return `${payloadB64}.${hmac(payloadB64)}`;
}

/** 校验会话令牌，返回载荷；无效/过期/被篡改一律返回 null */
export function verifySession(token: string | null | undefined): SessionPayload | null {
  if (!token) return null;

  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;

  const payloadB64 = token.slice(0, dot);
  const signature = token.slice(dot + 1);

  let expected: string;
  let actual: Buffer;
  let expectedBuf: Buffer;
  try {
    expected = hmac(payloadB64);
    actual = Buffer.from(signature);
    expectedBuf = Buffer.from(expected);
  } catch {
    return null;
  }

  // timingSafeEqual 要求等长，长度不符直接判失败
  if (actual.length !== expectedBuf.length) return null;
  if (!timingSafeEqual(actual, expectedBuf)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(payloadB64.replace(/-/g, "+").replace(/_/g, "/"), "base64").toString("utf8")
    ) as SessionPayload;

    if (typeof payload.userId !== "number" || typeof payload.exp !== "number") return null;
    if (payload.exp * 1000 < Date.now()) return null;

    return payload;
  } catch {
    return null;
  }
}

/**
 * 从请求里取出会话令牌。
 * 支持 `Authorization: Bearer <token>` 与 `x-session-token: <token>` 两种写法。
 */
export function readSessionToken(request: Request): string | null {
  const auth = request.headers.get("authorization");
  if (auth && auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim() || null;
  }
  return request.headers.get("x-session-token");
}

/** 便捷方法：校验请求里的会话，失败返回 null（仅验签名，不查库） */
export function sessionFromRequest(request: Request): SessionPayload | null {
  return verifySession(readSessionToken(request));
}

/**
 * 增强版会话校验：签名之外再查库比对 token_version 与 is_active。
 * 改密 / 管理员重置密码会递增 token_version，被禁用账号 is_active=false，
 * 两者都会让旧令牌立即失效（P1-4 修复）。
 * 校验失败返回 null，数据库异常时拒绝（fail-closed）。
 */
export async function sessionFromRequestVerified(
  request: Request
): Promise<SessionPayload | null> {
  const payload = sessionFromRequest(request);
  if (!payload) return null;

  try {
    const { getSupabaseClient } = await import("@/storage/database/supabase-client");
    const { data, error } = await getSupabaseClient()
      .from("app_users")
      .select("token_version, is_active")
      .eq("id", payload.userId)
      .maybeSingle();

    if (error) throw new Error(error.message);
    if (!data) return null; // 用户已不存在
    if (data.is_active === false) return null; // 已禁用
    // 库里 token_version 为 NULL（旧数据）视为 0；载荷缺 ver（旧令牌）也视为 0
    const dbVer = (data.token_version as number | null) ?? 0;
    const tokenVer = payload.ver ?? 0;
    if (tokenVer !== dbVer) return null; // 改密后旧令牌失效

    return payload;
  } catch (err) {
    // fail-closed：查不到库就无法确认会话没被撤销/禁用，一律按无效处理
    console.error(
      "会话版本校验失败（fail-closed，按无效会话处理）:",
      err instanceof Error ? err.message : err
    );
    return null;
  }
}
