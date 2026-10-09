import type { Metadata } from 'next';

export const metadata: Metadata = { title: '隐私政策 · 人生重构计划' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16 sm:px-8">
      <p className="text-[10px] tracking-[0.2em] text-primary/70">PRIVACY POLICY</p>
      <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground">隐私政策</h1>
      <p className="mt-2 text-xs text-muted-foreground">草案 · 上线前需由项目主人确认后正式发布</p>

      <div className="mt-10 space-y-8 font-serif text-sm leading-[1.9] text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">一、我们收集的信息</h2>
          <p>账号信息：昵称与经加密处理的密码。个人设置：年龄、窗口表态、偏好与您主动填写的内容。使用记录：AI 调用次数与必要的错误日志，用于额度计量与故障排查。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">二、本地存储</h2>
          <p>年龄、表态等部分数据保存在您的浏览器本地存储中，不会上传至服务器。清除浏览器数据即会删除这些内容。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">三、第三方服务</h2>
          <p>账号数据存储于 Supabase；AI 功能会将您提交的问题内容发送至所配置的大模型服务商。若您使用自备密钥（BYOK），请求将直接由您的密钥发出，我们不保存该密钥的明文。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">四、信息用途与保存</h2>
          <p>我们仅将信息用于提供与改进本服务。账号注销或您提出删除请求后，我们将在合理期限内删除相关数据，法律另有要求的除外。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">五、您的权利</h2>
          <p>您可以查看、更正、删除自己的账号信息，也可以随时停止使用本服务。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">六、联系方式</h2>
          <p>如对本政策有疑问，请通过项目发布渠道与我们联系。</p>
        </section>
      </div>
    </div>
  );
}
