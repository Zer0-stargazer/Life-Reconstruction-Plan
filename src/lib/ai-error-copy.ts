/**
 * AI 错误文案映射（各 AI 面板共用，不要每页各写一份）。
 *
 * 服务端文案优先；缺省（旧服务端无 message / 网络层错误）时按 code 取映射。
 * 不写"未扣次数"：客户端无法判断服务端是否已扣。
 */

export type AiErrorCode =
  | 'UPSTREAM_UNAVAILABLE'
  | 'TIMEOUT'
  | 'BLOCKED'
  | 'NO_CREDITS'
  | 'NOT_CONFIGURED'
  | 'RATE_LIMITED'
  | 'BAD_REQUEST'
  | 'INTERNAL';

export interface AiErrorInfo {
  message: string;
  code?: string;
}

const COPY: Record<string, string> = {
  NO_CREDITS: 'AI 次数已用完。可在「我的」页输入续码补充，或填入自己的 Key 继续。',
  RATE_LIMITED: '请求有点频繁，稍等片刻再试。',
  TIMEOUT: 'AI 服务暂时繁忙，请稍后重试。',
  UPSTREAM_UNAVAILABLE: 'AI 服务暂时繁忙，请稍后重试。',
  NOT_CONFIGURED: '内置 AI 暂未开放，可在「我的」页填入自己的 Key 使用。',
};

const FALLBACK = '分析没能完成，请重试。';

/** 展示给用户的文案：服务端文案优先，否则按 code 映射，再否则通用兜底 */
export function getAiErrorText(err: AiErrorInfo): string {
  const server = err.message?.trim();
  if (server) return server;
  return (err.code && COPY[err.code]) || FALLBACK;
}

/** 该错误是否应附「前往我的页」入口 */
export function shouldShowTopUpLink(err: AiErrorInfo): boolean {
  return err.code === 'NO_CREDITS' || err.code === 'NOT_CONFIGURED';
}

/** 无 code 的 HTTP 状态码兜底 */
function codeFromStatus(status: number): string | undefined {
  if (status === 402) return 'NO_CREDITS';
  if (status === 429) return 'RATE_LIMITED';
  if (status === 400) return 'BAD_REQUEST';
  return undefined;
}

/** 读取非 200 响应体 {error, code?}；解析失败时只按状态码映射 */
export async function readAiHttpError(response: Response): Promise<AiErrorInfo> {
  let message = '';
  let code: string | undefined;
  try {
    const j = await response.json();
    if (typeof j?.error === 'string') message = j.error;
    if (typeof j?.code === 'string') code = j.code;
  } catch { /* 响应体不是 JSON */ }
  code = code ?? codeFromStatus(response.status);
  // 没有服务端文案且无可映射 code 时，用通用兜底而不是裸状态码
  return { message, code };
}
