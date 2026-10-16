/**
 * AI 链路的纯函数安全工具（无 server-only，可直接单测）：
 * - 错误码与面向用户的脱敏文案
 * - 自带 Key 源上游报错的清洗
 * - 退款判定（sentAnything 统一口径）
 * - 提示词标记转义 + 用户输入（item / question / history）统一过滤与截断
 */
import { findBlockedTerm } from "./content-filter";

export type AiErrorCode =
  | "UPSTREAM_UNAVAILABLE"
  | "TIMEOUT"
  | "BLOCKED"
  | "NO_CREDITS"
  | "NOT_CONFIGURED"
  | "RATE_LIMITED"
  | "BAD_REQUEST"
  | "INTERNAL";

/** 内置源面向用户的统一文案（不含任何变量名 / 地址 / 状态码） */
export const AI_ERROR_MESSAGES: Record<AiErrorCode, string> = {
  UPSTREAM_UNAVAILABLE: "AI 服务暂时不可用，请稍后重试",
  TIMEOUT: "AI 响应超时（超过 50 秒），请稍后重试",
  BLOCKED: "该内容不适合显示，已停止生成。",
  NO_CREDITS: "AI 额度已用完：在「我的」页兑换续码即可到账；或改用自己的专属 Key 继续用（不扣额度）",
  NOT_CONFIGURED: "内置 AI 暂未开放，可在「我的」页填入自己的 Key 使用",
  RATE_LIMITED: "请求过于频繁，请稍后再试",
  BAD_REQUEST: "请求参数有误，请检查后重试",
  INTERNAL: "服务器内部错误，请稍后重试",
};

/**
 * 清洗自带 Key 源的上游报错：去 URL、去疑似密钥、压缩空白、限 200 字。
 * 先去 URL 再截断，避免截断在 URL 中间留下半截地址。
 */
export function sanitizeUpstreamError(raw: unknown, maxLen = 200): string {
  let s = typeof raw === "string" ? raw : raw instanceof Error ? raw.message : "";
  s = s
    .replace(/https?:\/\/\S+/gi, "[地址已隐藏]")
    .replace(/\bsk-[A-Za-z0-9_-]{8,}/g, "[密钥已隐藏]")
    .replace(/\s+/g, " ")
    .trim();
  if (!s) return "上游服务返回错误";
  return s.length > maxLen ? s.slice(0, maxLen) : s;
}

export type RefundReason = "error" | "timeout" | "aborted" | "empty" | "blocked";

/**
 * 退款判定：只有「没有向客户端发出任何正文也没有发出任何 reasoning/thinking」才退；
 * 内容安全拦截（blocked）一律不退。与是否 cancelled / timedOut 的先后无关。
 */
export function shouldRefund(sentAnything: boolean, reason: RefundReason): boolean {
  if (reason === "blocked") return false;
  return !sentAnything;
}

/** 删除用户文本中伪造的【资料】/【提问】开闭标记（循环删除，防止嵌套拼回） */
export function stripPromptMarkers(s: string): string {
  const re = /[【\[]\s*\/?\s*(?:资料|提问)\s*[】\]]/g;
  let prev: string;
  let cur = s;
  do {
    prev = cur;
    cur = cur.replace(re, "");
  } while (cur !== prev);
  return cur;
}

export function wrapItem(item: string): string {
  return `【资料】${stripPromptMarkers(item)}【/资料】`;
}

export function wrapQuestion(question: string): string {
  return `【提问】${stripPromptMarkers(question)}【/提问】`;
}

export interface InputLimits {
  maxItem: number;
  maxQuestion: number;
  maxHistoryMessages: number;
  maxHistoryMessageLength: number;
}

export type ScreenedInputs =
  | { ok: false; blockedTerm: string }
  | {
      ok: true;
      item: string;
      question: string;
      history: { role: "user" | "assistant"; content: string }[];
    };

/**
 * 统一处理并过滤全部用户可控字段：item / question / history（含 assistant 条目）。
 * 先截断后过滤；history 保留最近 maxHistoryMessages 条，assistant 历史不丢弃。
 */
export function screenUserInputs(
  raw: { item: unknown; question: unknown; history: unknown },
  limits: InputLimits
): ScreenedInputs {
  const item = String(raw.item ?? "").slice(0, limits.maxItem);
  const question = typeof raw.question === "string" ? raw.question.slice(0, limits.maxQuestion) : "";

  const history: { role: "user" | "assistant"; content: string }[] = [];
  if (Array.isArray(raw.history)) {
    for (const msg of raw.history.slice(-limits.maxHistoryMessages)) {
      if (!msg || typeof msg !== "object") continue;
      const m = msg as { role?: unknown; content?: unknown };
      if (m.role !== "user" && m.role !== "assistant") continue;
      const content = stripPromptMarkers(String(m.content ?? "").slice(0, limits.maxHistoryMessageLength));
      history.push({ role: m.role, content });
    }
  }

  const fields = [item, question, ...history.map((h) => h.content)];
  for (const f of fields) {
    const hit = findBlockedTerm(f);
    if (hit) return { ok: false, blockedTerm: hit };
  }
  return { ok: true, item, question, history };
}
