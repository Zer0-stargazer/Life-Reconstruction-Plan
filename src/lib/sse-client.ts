/**
 * 客户端 SSE 流式解析（/api/ai/analyze 的响应）。
 *
 * 全站唯一的解析实现：之前 6 处（5 个页面 + AIAnalysisPanel）各自手写
 * `chunk.split('\n')`，没有跨 chunk 的行缓冲——一条 `data:{...}` 被 TCP
 * 分包切开时 JSON.parse 失败，该段正文被静默丢弃。这里统一做缓冲拼接。
 */

export interface AiSseHandlers {
  /** 每收到一段增量正文，参数是累计全文（调用方直接 setState 即可） */
  onContent: (accumulated: string) => void;
  /** 每收到一段思维链增量，参数是累计思维链（推理模型先思考后作答） */
  onReasoning: (accumulated: string) => void;
  /** 服务端返回 error 帧 */
  onError: (message: string) => void;
  /** 流结束（收到 [DONE] 或连接关闭），参数是全文（可能为空串） */
  onDone: (fullText: string) => void;
}

type FrameResult = { kind: 'done' } | { kind: 'error'; message: string } | null;

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
    let parsed: { content?: string; reasoning?: string; error?: string } | null = null;
    try { parsed = JSON.parse(data); } catch { parsed = null; }
    if (!parsed) return null;
    if (parsed.error) return { kind: 'error', message: parsed.error };
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

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      // 跨 chunk 缓冲：最后一段可能是不完整行，留到下一个 chunk 拼接
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const result = handleData(trimmed.slice(5).trim());
        if (result?.kind === 'done') {
          handlers.onDone(accumulated);
          return;
        }
        if (result?.kind === 'error') {
          handlers.onError(result.message);
          return;
        }
      }
    }
    // 连接关闭但没等到 [DONE]：把已收到的正文交付出去
    handlers.onDone(accumulated);
  } finally {
    reader.releaseLock();
  }
}
