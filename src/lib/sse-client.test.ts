import { describe, expect, it, vi } from 'vitest';
import { consumeAiSseStream, type AiSseHandlers } from './sse-client';

function makeResponse(chunks: (string | Uint8Array)[], opts?: { errorAfter?: boolean }): Response {
  const enc = new TextEncoder();
  let i = 0;
  const stream = new ReadableStream<Uint8Array>({
    pull(controller) {
      if (i < chunks.length) {
        const c = chunks[i++];
        controller.enqueue(typeof c === 'string' ? enc.encode(c) : c);
      } else if (opts?.errorAfter) {
        controller.error(new Error('network down'));
      } else {
        controller.close();
      }
    },
  });
  return new Response(stream);
}

function makeHandlers() {
  const h = {
    onContent: vi.fn(),
    onReasoning: vi.fn(),
    onThinking: vi.fn(),
    onError: vi.fn(),
    onDone: vi.fn(),
  };
  return h satisfies AiSseHandlers;
}

const frame = (o: unknown) => `data: ${JSON.stringify(o)}\n\n`;

describe('consumeAiSseStream', () => {
  it('累计正文并在 [DONE] 时交付全文', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(
      makeResponse([frame({ content: '你' }), frame({ content: '好' }), 'data: [DONE]\n\n']),
      h
    );
    expect(h.onContent).toHaveBeenLastCalledWith('你好');
    expect(h.onDone).toHaveBeenCalledWith('你好');
    expect(h.onError).not.toHaveBeenCalled();
  });

  it('跨 chunk 切断的帧能拼接', async () => {
    const h = makeHandlers();
    const full = frame({ content: '完整' });
    await consumeAiSseStream(
      makeResponse([full.slice(0, 10), full.slice(10), 'data: [DONE]\n\n']),
      h
    );
    expect(h.onDone).toHaveBeenCalledWith('完整');
  });

  it('thinking 心跳帧触发 onThinking，不触发 reasoning/content', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(
      makeResponse([frame({ thinking: true }), frame({ thinking: true }), frame({ content: 'x' }), 'data: [DONE]\n\n']),
      h
    );
    expect(h.onThinking).toHaveBeenCalledTimes(2);
    expect(h.onReasoning).not.toHaveBeenCalled();
    expect(h.onDone).toHaveBeenCalledWith('x');
  });

  it('reasoning 帧仍然累计', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(
      makeResponse([frame({ reasoning: '想' }), frame({ reasoning: '想' }), 'data: [DONE]\n\n']),
      h
    );
    expect(h.onReasoning).toHaveBeenLastCalledWith('想想');
  });

  it('error 帧携带 code 与已累计正文，且不再调用 onDone', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(
      makeResponse([frame({ content: '半截' }), frame({ error: '超时了', code: 'TIMEOUT' }), frame({ content: '不应出现' })]),
      h
    );
    expect(h.onError).toHaveBeenCalledWith('超时了', { partial: '半截', code: 'TIMEOUT' });
    expect(h.onDone).not.toHaveBeenCalled();
    expect(h.onContent).toHaveBeenCalledTimes(1);
  });

  it('error 帧没有 code 字段时兼容', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(makeResponse([frame({ error: '出错' })]), h);
    expect(h.onError).toHaveBeenCalledWith('出错', { partial: '', code: undefined });
  });

  it('最后一行不以换行结尾时也要 flush（正文不丢）', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(
      makeResponse([frame({ content: '前' }), `data: ${JSON.stringify({ content: '后' })}`, ]),
      h
    );
    expect(h.onContent).toHaveBeenLastCalledWith('前后');
  });

  it('最后一行无换行的 [DONE] 也能正常结束', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(makeResponse([frame({ content: 'a' }), 'data: [DONE]']), h);
    expect(h.onDone).toHaveBeenCalledWith('a');
    expect(h.onError).not.toHaveBeenCalled();
  });

  it('无 [DONE] 直接断流：onError 携带 partial，不调用 onDone', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(makeResponse([frame({ content: '已有内容' })]), h);
    expect(h.onError).toHaveBeenCalledTimes(1);
    expect(h.onError.mock.calls[0][1]).toEqual({ partial: '已有内容' });
    expect(h.onDone).not.toHaveBeenCalled();
  });

  it('读取中途网络异常：onError 携带 partial', async () => {
    const h = makeHandlers();
    await consumeAiSseStream(makeResponse([frame({ content: '前半' })], { errorAfter: true }), h);
    expect(h.onError).toHaveBeenCalledTimes(1);
    expect(h.onError.mock.calls[0][1]).toEqual({ partial: '前半' });
    expect(h.onDone).not.toHaveBeenCalled();
  });

  it('多字节字符被切在 chunk 边界时不乱码', async () => {
    const h = makeHandlers();
    const bytes = new TextEncoder().encode(frame({ content: '中文' }) + 'data: [DONE]\n\n');
    await consumeAiSseStream(makeResponse([bytes.slice(0, 16), bytes.slice(16)]), h);
    expect(h.onDone).toHaveBeenCalledWith('中文');
  });
});
