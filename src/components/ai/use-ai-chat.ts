'use client';

import { useCallback, useRef, useState } from 'react';
import { getAuthHeader } from '@/lib/client-auth';
import { useAuth } from '@/contexts/auth-context';
import { consumeAiSseStream } from '@/lib/sse-client';
import { readAiHttpError, type AiErrorInfo } from '@/lib/ai-error-copy';

/**
 * AI 面板流式会话 hook（7 处面板共用，替代各页手写的 fetch + consumeAiSseStream + 错误处理）。
 *
 * 约定：
 * - 错误不进对话历史：失败信息只放在 `error`（面板单独展示 + 重试按钮）；
 * - 出错/中止时已生成的正文（partial）保存为 assistant 消息；
 *   用户点「停止」保存的消息带 stopped=true（UI 追加灰色「（已停止生成）」）；
 * - 发给服务端的 history 由调用方用 `toApiHistory(messages)` 构造（会剥掉 stopped 标记）。
 */

export interface AiChatMessage {
  role: 'user' | 'assistant';
  content: string;
  /** 用户中途点了「停止」，内容不完整 */
  stopped?: boolean;
}

export function toApiHistory(messages: AiChatMessage[]): { role: 'user' | 'assistant'; content: string }[] {
  return messages.map(m => ({ role: m.role, content: m.content }));
}

const SMOOTH_THRESHOLD = 40;
const SMOOTH_MIN_STEP = 6;
const SMOOTH_FRAMES = 36;

export function useAiChat() {
  const { handleSessionExpired } = useAuth();
  const [messages, setMessages] = useState<AiChatMessage[]>([]);
  const [content, setContent] = useState('');
  const [thinking, setThinking] = useState('');
  /** 仅收到思考心跳（无思维链文本）：UI 显示「正在思考…」 */
  const [thinkingBeat, setThinkingBeat] = useState(false);
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<AiErrorInfo | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastBodyRef = useRef<Record<string, unknown> | null>(null);
  const errorPartialRef = useRef(false);

  const run = useCallback(async (body: Record<string, unknown>) => {
    lastBodyRef.current = body;
    errorPartialRef.current = false;
    setStreaming(true);
    setContent('');
    setThinking('');
    setThinkingBeat(false);
    setError(null);
    const controller = new AbortController();
    abortRef.current = controller;

    let partial = '';
    // 流式 chunk 合并：每帧最多一次 setState（partial 仍同步保存最新全文）
    let rafId = 0;
    let pendingContent: string | null = null;
    let pendingThinking: string | null = null;
    // 平滑吐字：一次到达的新文本 >40 字时，按每帧 ≥6 字逐帧释放；
    // 步长随积压增大，保证约 36 帧（≈600ms）内追平。流结束时 finally 清空流式文本、
    // 完整正文由 onDone/pushAssistant 立即整段呈现。
    let targetContent = '';
    let shownLen = 0;
    const flush = () => {
      rafId = 0;
      if (pendingThinking !== null) { setThinking(pendingThinking); pendingThinking = null; }
      if (pendingContent !== null) {
        targetContent = pendingContent;
        pendingContent = null;
      }
      if (shownLen > targetContent.length) shownLen = targetContent.length;
      const backlog = targetContent.length - shownLen;
      if (backlog > 0) {
        const step = backlog > SMOOTH_THRESHOLD ? Math.max(SMOOTH_MIN_STEP, Math.ceil(backlog / SMOOTH_FRAMES)) : backlog;
        shownLen = Math.min(targetContent.length, shownLen + step);
        // 不把代理对（emoji 等）从中间切开
        const code = targetContent.charCodeAt(shownLen - 1);
        const cut = shownLen < targetContent.length && code >= 0xd800 && code <= 0xdbff ? shownLen + 1 : shownLen;
        shownLen = cut;
        setContent(targetContent.slice(0, shownLen));
        if (shownLen < targetContent.length) rafId = requestAnimationFrame(flush);
      }
    };
    const schedule = () => { if (!rafId) rafId = requestAnimationFrame(flush); };
    const pushAssistant = (text: string, stopped?: boolean) =>
      setMessages(prev => [...prev, stopped ? { role: 'assistant', content: text, stopped: true } : { role: 'assistant', content: text }]);

    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        // 带着令牌却 401 = 登录已过期（无令牌的 401 是「需登录」，由原错误文案处理）
        if (response.status === 401 && getAuthHeader().Authorization) handleSessionExpired();
        setError(await readAiHttpError(response));
        return;
      }

      await consumeAiSseStream(response, {
        onReasoning: (accumulated) => { pendingThinking = accumulated; schedule(); },
        onThinking: () => setThinkingBeat(true),
        onContent: (accumulated) => { partial = accumulated; pendingContent = accumulated; schedule(); },
        onError: (message, info) => {
          if (info.partial) { pushAssistant(info.partial); errorPartialRef.current = true; }
          setError({ message, code: info.code });
        },
        onDone: (fullText) => {
          if (fullText) pushAssistant(fullText);
        },
      });
    } catch (e) {
      if (e instanceof Error && e.name === 'AbortError') {
        if (partial) pushAssistant(partial, true);
      } else {
        if (partial) { pushAssistant(partial); errorPartialRef.current = true; }
        setError({ message: '' });
      }
    } finally {
      if (rafId) cancelAnimationFrame(rafId);
      pendingContent = null;
      pendingThinking = null;
      setContent('');
      setThinkingBeat(false);
      setStreaming(false);
    }
  }, [handleSessionExpired]);

  /** 重试：用上一次的请求体重发 */
  const retry = useCallback(() => {
    if (!lastBodyRef.current) return;
    // 上次出错时保存的不完整回复会被这次重试替代，避免对话里出现"半截 + 完整"两条
    if (errorPartialRef.current) setMessages(prev => prev.slice(0, -1));
    void run(lastBodyRef.current);
  }, [run]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  /** 清空会话（切换分析对象时） */
  const reset = useCallback(() => {
    setMessages([]);
    setContent('');
    setThinking('');
    setThinkingBeat(false);
    setStreaming(false);
    setError(null);
    errorPartialRef.current = false;
  }, []);

  return {
    messages, setMessages, content, thinking, thinkingBeat, streaming, error,
    abortRef, run, retry, stop, reset,
  };
}
