import 'server-only';

/**
 * 邮件发送（验证码用途）。
 *
 * provider 由 MAIL_PROVIDER 决定，三种取值：
 *   - console（默认）：不发真信，验证码通过接口 debugCode 回传给前端（仅非生产）。本地开发用；
 *     生产环境（NODE_ENV=production）下视为未配置，且任何环境都不在日志打印验证码明文。
 *   - resend：调用 Resend HTTP API，需要 RESEND_API_KEY + MAIL_FROM。
 *   - 其它值：视为未配置，isMailConfigured() 返回 false，发码接口直接拒绝并给出明确原因。
 *
 * 之所以不内置 SMTP：SMTP 需要 nodemailer 这类依赖，而 Resend/Brevo 都有 HTTP API 和免费额度，
 * 一条 fetch 就能发信，依赖更少。真要走 SMTP 时在这里加一个分支即可，业务代码不用动。
 */

export type MailPurpose = 'register' | 'login' | 'reset' | 'bind' | 'rebind';

export interface SendMailResult {
  ok: boolean;
  provider: string;
  error?: string;
}

const PROVIDER = (process.env.MAIL_PROVIDER ?? 'console').toLowerCase();
const FROM = process.env.MAIL_FROM ?? '';
const SITE_NAME = '人生沙盘';

const PURPOSE_TEXT: Record<MailPurpose, string> = {
  register: '注册账号',
  login: '登录账号',
  reset: '重置密码',
  bind: '绑定邮箱',
  rebind: '更换邮箱',
};

/** 邮件通道是否已真正可用（console 模式永远可用，它只是打日志） */
export function isMailConfigured(): boolean {
  // 生产环境 console 视为未配置：验证码不能只进日志（用户收不到，且日志里留明文）
  if (PROVIDER === 'console') return process.env.NODE_ENV !== 'production';
  if (PROVIDER === 'resend') return Boolean(process.env.RESEND_API_KEY && FROM);
  return false;
}

export function mailProviderName(): string {
  return PROVIDER;
}

function buildMail(to: string, code: string, purpose: MailPurpose): { subject: string; text: string } {
  const action = PURPOSE_TEXT[purpose] ?? '验证';
  return {
    subject: `${SITE_NAME} · ${action}验证码`,
    text: [
      `你正在${action}，验证码是：`,
      '',
      `    ${code}`,
      '',
      '5 分钟内有效，不要告诉任何人。',
      '如果不是你本人操作，忽略这封邮件即可。',
    ].join('\n'),
  };
}

/**
 * 发送验证码邮件。
 * 调用方（/api/auth）应该先过限流和唯一性校验，再调这里。
 */
export async function sendVerificationCodeMail(input: {
  to: string;
  code: string;
  purpose: MailPurpose;
}): Promise<SendMailResult> {
  const { to, code, purpose } = input;

  if (PROVIDER === 'console') {
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, provider: PROVIDER, error: '邮件通道未配置：生产环境不允许 console 模式' };
    }
    // 本地开发：验证码只进控制台，不发真信，避免误发和浪费额度
    // 不在日志里打印验证码明文；开发调试走接口回传的 debugCode（仅非生产，见 verification.ts）
    console.info(`[mailer:console] 已生成验证码（开发模式，见调试返回） 用途=${purpose}`);
    return { ok: true, provider: PROVIDER };
  }

  if (PROVIDER === 'resend') {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || !FROM) {
      return { ok: false, provider: PROVIDER, error: '邮件通道未配置：缺少 RESEND_API_KEY 或 MAIL_FROM' };
    }
    const { subject, text } = buildMail(to, code, purpose);
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ from: FROM, to, subject, text }),
      });
      if (!res.ok) {
        const detail = await res.text().catch(() => '');
        return { ok: false, provider: PROVIDER, error: `发信失败(${res.status}): ${detail.slice(0, 200)}` };
      }
      return { ok: true, provider: PROVIDER };
    } catch (err) {
      return { ok: false, provider: PROVIDER, error: `发信异常: ${err instanceof Error ? err.message : '未知'}` };
    }
  }

  return { ok: false, provider: PROVIDER, error: `未知的 MAIL_PROVIDER: ${PROVIDER}` };
}
