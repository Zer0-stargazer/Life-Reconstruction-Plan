import 'server-only';

/**
 * 短信发送（验证码用途）——**当前只留骨架，不参与任何线上流程**。
 *
 * 为什么手机号先不发码：国内短信验证码需要企业主体 + 域名 ICP 备案 + 签名/模板报备，
 * 个人开发者基本申请不下来，而且按条计费、被刷就是真金白银。
 * 所以现在的做法是：手机号作为「绑定项」存进资料（后台可见、脱敏展示），
 * 验证码通道整体预留，等有了可用服务商（云片 / SubMail / 阿里云等）在这里加一个分支即可，
 * 业务代码一行都不用改。
 *
 * SMS_PROVIDER 取值：
 *   - console（默认）：验证码打印到服务端控制台，方便本地把绑定流程跑通
 *   - 其它：视为未接入，isSmsEnabled() 返回 false，前端应隐藏「发送短信验证码」入口
 */

export type SmsPurpose = 'register' | 'login' | 'reset' | 'bind' | 'rebind';

export interface SendSmsResult {
  ok: boolean;
  provider: string;
  error?: string;
}

const PROVIDER = (process.env.SMS_PROVIDER ?? 'console').toLowerCase();

/** 短信通道是否已接入真实服务商（console 只用于本地调试） */
export function isSmsEnabled(): boolean {
  return PROVIDER !== 'console' && PROVIDER !== 'off' && PROVIDER !== '';
}

export function smsProviderName(): string {
  return PROVIDER;
}

export async function sendVerificationCodeSms(input: {
  to: string;
  code: string;
  purpose: SmsPurpose;
}): Promise<SendSmsResult> {
  const { to, purpose } = input;

  if (PROVIDER === 'console') {
    // 与 mailer.ts 对齐：生产环境不允许 console 模式兜底，否则用户会被
    // 告知"已发送"却永远收不到码，且验证码只留在服务端日志里。
    if (process.env.NODE_ENV === 'production') {
      return { ok: false, provider: PROVIDER, error: '短信通道未配置：生产环境不允许 console 模式' };
    }
    // 本地开发：不发真短信，验证码走接口 debugCode 回传（仅非生产，见 verification.ts）。
    // 不在日志打印验证码明文；手机号只留头尾，避免日志里出现完整 PII。
    console.info(
      `[sms:console] 已生成验证码（开发模式，见调试返回） 用途=${purpose} 接收方=${to.slice(0, 3)}****${to.slice(-4)}`
    );
    return { ok: true, provider: PROVIDER };
  }

  if (PROVIDER === 'off' || PROVIDER === '') {
    return { ok: false, provider: PROVIDER || '(未设置)', error: '短信通道未接入' };
  }

  // 真实服务商分支示例（接通道时在这里加）：
  // if (PROVIDER === 'yunpian') { ... }
  return { ok: false, provider: PROVIDER, error: `短信通道未实现：${PROVIDER}` };
}
