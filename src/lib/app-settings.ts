import 'server-only';
import { getSupabaseClient } from '@/storage/database/supabase-client';

export const SETTING_KEYS = [
  'builtin_ai_enabled',
  'redeem_enabled',
  // 内容安全（batch7）：是否记录 AI 对话正文、命中规则后是否自动处置
  'ai_content_logging_enabled',
  'auto_moderation_enabled',
] as const;
export type SettingKey = (typeof SETTING_KEYS)[number];

/** 读取开关；查询失败时按开启处理，避免数据库抖动把整站功能关掉 */
export async function getSetting(key: SettingKey): Promise<boolean> {
  const { data, error } = await getSupabaseClient()
    .from('app_settings')
    .select('value')
    .eq('key', key)
    .maybeSingle();
  if (error || !data) return true;
  return data.value === true;
}
