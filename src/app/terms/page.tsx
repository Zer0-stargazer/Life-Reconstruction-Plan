import type { Metadata } from 'next';

export const metadata: Metadata = { title: '用户协议 · 人生沙盘' };

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8">
      <p className="text-[11px] tracking-[0.2em] text-primary/70">TERMS OF SERVICE</p>
      <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight text-foreground">用户协议</h1>
      <p className="mt-2 text-xs text-muted-foreground">草案 · 上线前需由项目主人确认后正式发布</p>

      <div className="mt-10 space-y-8 font-serif text-sm leading-[1.9] text-muted-foreground">
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">一、服务性质</h2>
          <p>人生沙盘是一款基于公开数据与概率框架的决策辅助工具，提供时间窗口、职业、规律与模拟等内容。本服务不构成人生、职业、财务、法律或医疗建议，所有结论仅供参考，决策责任由用户自行承担。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">二、账号</h2>
          <p>用户可注册昵称与密码账号。你应妥善保管账号信息，不得将账号转让或出借给他人。注册功能可能因运营需要暂停开放，已有账号不受影响。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">三、AI 生成内容</h2>
          <p>平台中的 AI 解读、起名与建议由第三方大模型生成，可能存在不准确或不完整之处。AI 内容不代表平台立场，不应作为唯一决策依据。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">四、用户行为</h2>
          <p>你不得利用本服务从事违法活动，不得干扰服务正常运行、尝试获取未授权的数据或对服务进行攻击。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">五、责任限制</h2>
          <p>在法律允许的最大范围内，平台不对因使用或无法使用本服务而产生的直接或间接损失承担责任。</p>
        </section>
        <section>
          <h2 className="mb-2 text-base font-semibold text-foreground">六、协议变更</h2>
          <p>我们可能适时更新本协议，更新后的版本在本页面公布即生效。</p>
        </section>
      </div>
    </div>
  );
}
