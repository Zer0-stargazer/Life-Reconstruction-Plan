import { createHmac, timingSafeEqual } from "crypto";

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
  /** 过期时间（Unix 秒） */
  exp: number;
}

/** 会话有效期：7 天 */
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7;

/**
 * 会话签名密钥。生产环境必须显式配置 SESSION_SECRET，
 * 否则拒绝签发（避免静默使用不安全默认值）。
 */
function getSecret(): string {
  const configured = process.env.SESSION_SECRET || process.env.DEV_PASSWORD;
  if (configured && configured.trim().length > 0) return configured;

  if (process.env.NODE_ENV === "production") {
    throw new Error("SESSION_SECRET 未配置：生产环境必须设置会话密钥才能签发登录态");
  }
  // 仅开发环境兜底，方便本地起服务
  return "lrs-dev-insecure-session-secret";
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function hmac(payloadB64: string): string {
  return b64url(createHmac("sha256", getSecret()).update(payloadB64).digest());
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

/** 便捷方法：校验请求里的会话，失败返回 null */
export function sessionFromRequest(request: Request): SessionPayload | null {
  return verifySession(readSessionToken(request));
}
