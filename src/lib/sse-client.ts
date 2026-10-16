/**
 * 客户端 SSE 流式解析（/api/ai/analyze 的响应）。
 *
 * 全站唯一的解析实现：之前 6 处（5 个页面 + AIAnalysisPanel）各自手写
 * `chunk.split('\n')`，没有跨 chunk 的行缓冲——一条 `data:{...}` 被 TCP
 * 分包切开时 JSON.parse 失败，该段正文被静默丢弃。这里统一做缓冲拼接。
 *
 * 终态约定（调用方只需处理两条路径，二者互斥，且只会触发其一）：
 * - 正常结束：onDone(fullText)
 * - 出错 / 异常中断：onError(message, { partial, code })
 *   partial 是出错前已累计的正文（可能为空串），调用方应先把它保存为 assistant 消息，
 *   再把 message 展示为独立错误提示（不要写进对话历史）。
 * 用户主动中止（AbortError）不在此处理，会原样抛给调用方。
 */

export interface AiSseErrorInfo {
  /** 出错前已累计的正文（可能为空串） */
  partial: string;
  /** 服务端错误码（UPSTREAM_UNAVAILABLE / TIMEOUT / NO_CREDITS …），旧服务端可能没有 */
  code?: string;
}

export interface AiSseHandlers {
  /** 每收到一段增量正文，参数是累计全文（调用方直接 setState 即可） */
  onContent: (accumulated: string) => void;
  /** 每收到一段思维链增量，参数是累计思维链（自带 Key 源仍可能下发） */
  onReasoning: (accumulated: string) => void;
  /** 内置 AI 的思考心跳帧 {"thinking":true}（不含文本，约每秒一次） */
  onThinking?: () => void;
  /** 服务端 error 帧，或流异常结束 */
  onError: (message: string, info: AiSseErrorInfo) => void;
  /** 流正常结束（收到 [DONE]），参数是全文（可能为空串） */
  onDone: (fullText: string) => void;
}

type FrameResult =
  | { kind: 'done' }
  | { kind: 'error'; message: string; code?: string }
  | null;

const INTERRUPTED_MESSAGE = '连接中断，回复可能不完整';

function isAbortError(e: unknown): boolean {
  return typeof e === 'object' && e !== null && (e as { name?: string }).name === 'AbortError';
}

export async function consumeAiSseStream(
  response: Response,
  handlers: AiSseHandlers
): Promise<void> {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder();
  let buffer = '';
  let accumulated = '';
  let reasoningAccumulated = '';

  const handleData = (data: string): FrameResult => {
    if (data === '[DONE]') return { kind: 'done' };
    let parsed: {
      content?: string;
      reasoning?: string;
      thinking?: boolean;
      error?: string;
      code?: string;
    } | null = null;
    try { parsed = JSON.parse(data); } catch { parsed = null; }
    if (!parsed || typeof parsed !== 'object') return null;
    if (parsed.error) {
      return {
        kind: 'error',
        message: String(parsed.error),
        code: typeof parsed.code === 'string' ? parsed.code : undefined,
      };
    }
    if (parsed.thinking) handlers.onThinking?.();
    if (parsed.reasoning) {
      reasoningAccumulated += parsed.reasoning;
      handlers.onReasoning(reasoningAccumulated);
    }
    if (parsed.content) {
      accumulated += parsed.content;
      handlers.onContent(accumulated);
    }
    return null;
  };

  /** 处理一行；返回 true 表示流已终结（done / error 已回调） */
  const handleLine = (line: string): boolean => {
    const trimmed = line.trim();
    if (!trimmed.startsWith('data:')) return false;
    const result = handleData(trimmed.slice(5).trim());
    if (result?.kind === 'done') {
      handlers.onDone(accumulated);
      return true;
    }
    if (result?.kind === 'error') {
      handlers.onError(result.message, { partial: accumulated, code: result.code });
      return true;
    }
    return false;
  };

  try {
    while (true) {
      let chunk: ReadableStreamReadResult<Uint8Array>;
      try {
        chunk = await reader.read();
      } catch (e) {
        if (isAbortError(e)) throw e;
        // 网络中途断开：把已收到的正文交出去
        handlers.onError(INTERRUPTED_MESSAGE, { partial: accumulated });
        return;
      }
      if (chunk.done) break;

      // 跨 chunk 缓冲：最后一段可能是不完整行，留到下一个 chunk 拼接
      buffer += decoder.decode(chunk.value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (handleLine(line)) return;
      }
    }

    // 流结束：flush 解码器与缓冲区剩余的最后一行（上游不以换行结尾时不能丢）
    buffer += decoder.decode();
    if (buffer && handleLine(buffer)) return;

    // 连接关闭但没等到 [DONE]：说明上游中断，把已收到的正文交出去并报错
    handlers.onError(INTERRUPTED_MESSAGE, { partial: accumulated });
  } finally {
    reader.releaseLock();
  }
}
