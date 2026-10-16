import type { Metadata } from 'next';

export const metadata: Metadata = { title: '隐私政策 · 人生沙盘' };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
      <p className="text-[11px] tracking-[0.2em] text-primary/70">PRIVACY POLICY</p>
      <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground">隐私政策</h1>
      <p className="mt-2 text-xs text-muted-foreground">草案 · 上线前需由项目主人确认后正式发布</p>

      <div className="mt-10 space-y-8 font-serif text-sm leading-[1.9] text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">一、我们收集的信息</h2>
          <p>账号信息：昵称、邮箱、手机号与经加密处理的密码（邮箱与手机号为你主动绑定）。个人设置：年龄、窗口表态、偏好与你主动填写的内容。使用记录：AI 调用次数与必要的错误日志，用于额度计量与故障排查；平台默认会记录 AI 对话正文用于内容安全审计（后台可关闭该记录），并按第二条的规则审核与处置。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">二、AI 内容安全审核</h2>
          <p>
            使用期间，平台会自动识别 AI 对话内容进行安全审核：系统先按关键词规则快速筛查，
            再对命中的对话辅以模型复核，用于识别色情低俗、暴力恐怖、诈骗引流、人身攻击、违法违禁等不良内容。
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>审核范围：你向 AI 提交的问题，以及 AI 生成的回复。</li>
            <li>保存期限：被判定存在风险的对话正文最多保留 30 天，到期后仅保留时间、模块、风险等级等元数据。</li>
            <li>查看权限：仅管理员可查看完整正文，且每一次查看都会留下审计记录。</li>
            <li>处置方式：视风险程度，我们可能向你发送提醒或警告；多次触发或情节严重的，可能暂停账号使用。</li>
            <li>成本与误报：模型复核仅对已命中规则的对话触发；复核判定为正常内容的，不会对你做任何处置。</li>
          </ul>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">三、本地存储</h2>
          <p>未登录时，年龄、窗口标记等偏好只存于本机浏览器，清除浏览器数据即会删除。登录后，这些偏好会同步到你的账号（用于换设备），退出登录时会清除本机上同步过的数据。AI 对话内容会被记录用于安全审计（详见第二条）。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">四、第三方服务</h2>
          <p>账号数据存储于 Supabase；AI 功能会将你提交的问题内容发送至所配置的大模型服务商。若你使用自备密钥（BYOK），请求将直接由你的密钥发出，我们不保存该密钥的明文。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">五、信息用途与保存</h2>
          <p>我们仅将信息用于提供与改进本服务，以及上文所述的内容安全审核。账号注销或你提出删除请求后，我们将在合理期限内删除相关数据，法律另有要求的除外。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">六、你的权利</h2>
          <p>你可以查看、更正、删除自己的账号信息，也可以随时停止使用本服务。如认为内容审核判定有误，可通过下方渠道向我们申诉。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">七、联系方式</h2>
          <p>如对本政策有疑问，请通过项目发布渠道与我们联系。</p>
        </section>
      </div>
    </div>
  );
}
