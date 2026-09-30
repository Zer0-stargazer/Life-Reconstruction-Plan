'use client';

/**
 * useEscapeKey —— 按下 Escape 时调用 onClose。
 *
 * 用途：弹层/抽屉的可访问性。之前全站只有 /laws /luck /user 处理了 Esc，
 * 其余弹层（/destiny /simulation /windows 的详情弹层、AI 分析面板）按 Esc 没反应，
 * 键盘用户只能去找那个小小的关闭按钮。
 *
 * active=false 时不挂监听——弹层没打开就别占着全局 keydown，
 * 否则多个实例会互相抢、也会在不该关的时候误关。
 */

import { useEffect } from 'react';

export function useEscapeKey(onClose: () => void, active = true) {
  useEffect(() => {
    if (!active) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, active]);
}
