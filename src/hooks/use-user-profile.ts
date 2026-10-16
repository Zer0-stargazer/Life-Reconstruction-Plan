'use client';

/**
 * useUserProfile —— 用户画像聚合的响应式包装。
 *
 * 数据来源与更新时机：
 * - 窗口标记：useWindowMarks（模块级 store，标记变化立即响应）
 * - 健康 / 模拟器 / 命运报告：localStorage，挂载时读一次，
 *   之后监听 storage（跨标签页）与 user-state:dirty（本页写入广播）刷新
 * - 云同步拉取改写本地后也会触发 user-state:dirty（usePersistedState 写回时广播），自动跟上
 */

import { useEffect, useMemo, useState } from 'react';
import { useWindowMarks } from './use-window-marks';
import { USER_STATE_DIRTY_EVENT } from '@/lib/user-state-sync';
import {
  readHealthSummary,
  readSimSummary,
  readDestinyReportSnapshot,
  readCareerMarkSummary,
  summarizeWindowMarks,
  type HealthSummary,
  type SimSummary,
  type DestinyReportSnapshot,
  type CareerMarkSummary,
  type UserProfile,
} from '@/lib/user-profile';

export function useUserProfile(): UserProfile {
  const { marks } = useWindowMarks();
  const [health, setHealth] = useState<HealthSummary | null>(null);
  const [sim, setSim] = useState<SimSummary | null>(null);
  const [destinyReport, setDestinyReport] = useState<DestinyReportSnapshot | null>(null);
  const [careerMarks, setCareerMarks] = useState<CareerMarkSummary | null>(null);

  useEffect(() => {
    const refresh = () => {
      setHealth(readHealthSummary());
      setSim(readSimSummary());
      setDestinyReport(readDestinyReportSnapshot());
      setCareerMarks(readCareerMarkSummary());
    };
    refresh(); // 挂载后先读一次（首帧保持 null 与 SSR 一致，避免水合不匹配）
    window.addEventListener('storage', refresh);
    window.addEventListener(USER_STATE_DIRTY_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(USER_STATE_DIRTY_EVENT, refresh);
    };
  }, []);

  return useMemo(
    () => ({
      windowMarks: marks,
      windowAction: summarizeWindowMarks(marks),
      health,
      sim,
      destinyReport,
      careerMarks,
    }),
    [marks, health, sim, destinyReport, careerMarks],
  );
}
