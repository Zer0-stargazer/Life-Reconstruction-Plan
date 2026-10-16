'use client';

import { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { SealMark } from '@/components/shared/seal-mark';
import { CONTENT_TOTAL, MODULE_COUNT } from '@/data/content-total';
import { version as APP_VERSION } from '../../../package.json';

// 构建时内联的公开配置（留空则显示对应占位文案）
const CONTACT = (process.env.NEXT_PUBLIC_CONTACT ?? '').trim();
const DONATE_URL = (process.env.NEXT_PUBLIC_DONATE_URL ?? '').trim();
const REPO_URL = (process.env.NEXT_PUBLIC_REPO_URL ?? '').trim();

const BUILD_DATE = (process.env.NEXT_PUBLIC_BUILD_DATE ?? '').trim();

const MODULE_OPTIONS = ['通用', '时间', '窗口', '名字', '职业', '规律', '运气', '努力', '健康', '命运'];

function Card({ no, title, children }: { no?: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-8">
      <h2 className="flex items-baseline gap-4 font-serif text-xl font-semibold text-foreground">
        {no && <span className="font-mono text-[11px] tracking-[0.2em] text-primary">{no}</span>}
        {title}
      </h2>
      <div className="mt-4 space-y-2.5 text-[15px] leading-[1.8] text-muted-foreground">{children}</div>
    </section>
  );
}
/** 反馈表单：登录可选，单 IP 限流由服务端控制 */
function FeedbackForm() {
  const [content, setContent] = useState('');
  const [contact, setContact] = useState('');
  const [module, setModule] = useState('通用');
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (content.trim().length < 5) {
      setError('至少写 5 个字，不然我猜不出你想说什么');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: content.trim(), contact: contact.trim(), module }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : '提交失败，请稍后再试');
        return;
      }
      setDone(true);
      setContent('');
    } catch {
      setError('网络异常，请稍后再试');
    } finally {
      setSubmitting(false);
    }
  }

  if (done) {
    return (
      <section className="rounded-sm border border-primary/30 bg-primary/5 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div>
            <p className="text-sm font-medium text-foreground">收到。真的会看，也会真的改。</p>
            <p className="mt-1 text-xs text-muted-foreground">
              留了联系方式的话，处理完我会回你。
            </p>
            <button
              onClick={() => setDone(false)}
              className="mt-3 text-xs text-primary hover:underline"
            >
              再提一条 →
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-border py-8">
      <h2 className="flex items-center gap-2 font-serif text-base font-medium text-foreground">
        
        提点意见
      </h2>
      <p className="mt-2 text-xs text-muted-foreground">
        哪里不好用、哪句话没看懂，直接写。想加什么模块，也可以说。
      </p>
      <form onSubmit={handleSubmit} className="mt-4 space-y-3">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          maxLength={1000}
          rows={4}
          placeholder="想说的都在这里（5–1000 字）"
          className="w-full resize-none rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={module}
            onChange={(e) => setModule(e.target.value)}
            className="rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/40"
          >
            {MODULE_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m === '通用' ? '反馈模块：通用' : `反馈模块：${m}`}
              </option>
            ))}
          </select>
          <input
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={100}
            placeholder="联系方式（选填，邮箱 / 微信都行）"
            className="flex-1 rounded-sm border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary/40"
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <div className="flex items-center justify-between">
          <span className="text-[11px] tabular-nums text-muted-foreground">{content.length}/1000</span>
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-1.5 rounded-sm bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-3.5 w-3.5" />
            {submitting ? '发送中…' : '发送反馈'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="relative grain-texture mx-auto w-full max-w-2xl px-4 py-10 sm:py-14">
      <header className="pb-8">
        <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">COLOPHON</p>
        <h1 className="mt-3 font-serif text-3xl font-bold leading-tight tracking-[-0.01em] text-foreground sm:text-4xl">一个人的沙盘</h1>
        <p className="mt-3 text-sm text-muted-foreground">不替你决定，只帮你把牌摊开。</p>
      </header>

      <div>
        <Card no="一" title="为什么做这个">
          <p>这个网站最初来自一个很具体的晚上：我发现自己在人生的岔路口站了很久，手里没有地图。</p>
          <p>
            网上的建议不是「要努力」就是「看开点」——都对，但没用。
            我想把「我是谁、我在哪、我有哪些路」摊开摆在桌上，一块一块看清楚，于是有了人生沙盘。
          </p>
          <p>它不替你做决定。它只是帮你把牌摊开——怎么打，还是你的事。</p>
        </Card>

        <Card no="二" title="关于收费">
          {REPO_URL ? (
            <p>
              整站源代码公开，仓库就在下面。你可以自己部署一份：
              数据库在你自己的 Supabase，AI 填自己的 Key，全程不花钱。
            </p>
          ) : null}
          <p>站内内容不设试用与正式之分，登录后全部可读。</p>
          <p>
            真正要花钱的只有内置 AI——每次分析都是实打实的 API 开销。所以：注册送 50 次，无需绑卡；
            用完后可在「我的」页填自己的 Key（OpenAI 兼容接口都行），走你自己的额度。
          </p>
        </Card>

        <Card no="三" title="这些数据从哪来，哪些没把握">
          <p>
            网站里的条目（职业、窗口、规律、运气、健康）由作者整理汇编，参考公开资料与常识，不是权威数据库，也没有经过机构审定。
            年龄区间、薪资、趋势这类数字是粗略估计，个体差异很大，只适合拿来对照，不适合当依据。
          </p>
          <p>AI 分析依据你填写的信息和页面数据生成，可能出错，仅供参考，不替代专业意见。</p>
          <p>健康内容只写常识范围内的提示，不做诊断，不替代就医；有症状请去看医生。</p>
          <p>发现哪条不对，请用下面的表单告诉我。</p>
        </Card>

        <Card no="四" title="如果它帮到了你">
          <p>
            这个沙盘会一直更新下去。真正让它更新下去的，是有人用得上它——提意见、指出错误，就已经是很大的帮忙。
          </p>
          {DONATE_URL ? (
            <>
              <p>如果你愿意顺手请我喝杯咖啡，那也很好。它不解锁任何东西。</p>
              <a
                href={DONATE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-press mt-1 inline-flex items-center bg-primary px-5 py-2.5 font-serif text-sm tracking-[0.12em] text-primary-foreground hover:bg-primary/90"
              >
                请我喝杯咖啡
              </a>
            </>
          ) : (
            <p className="mt-1 text-xs italic text-muted-foreground/80">谢谢你看到这一页。</p>
          )}
        </Card>

        <Card title="联系我">
          {CONTACT ? (
            <p>
              有事直接说，看到都会回。加我微信：
              <span className="mx-1 select-all font-mono text-foreground">{CONTACT}</span>
              <span className="text-xs text-muted-foreground">（备注「人生沙盘」更容易通过）</span>
            </p>
          ) : (
            <p className="text-xs italic text-muted-foreground/80">暂未开放，先谢谢你看到这一页。有事请用下面的反馈表单。</p>
          )}
          {REPO_URL && (
            <p>
              源代码仓库：
              <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="ml-1 text-primary hover:underline">
                {REPO_URL}
              </a>
            </p>
          )}
        </Card>

        <FeedbackForm />
      </div>

      <footer className="mt-4 border-t border-border pt-8">
        <p className="font-mono text-[11px] leading-[2] tracking-[0.1em] text-muted-foreground">
          v{APP_VERSION} · {MODULE_COUNT} 个模块 · {CONTENT_TOTAL.toLocaleString('en-US')} 条内容
          {BUILD_DATE && <> · 最后更新 {BUILD_DATE}</>}
          <br />© 人生沙盘 · 一个人做的，慢慢更新
        </p>
        <SealMark className="mt-6 h-10 w-10 rounded-[2px]" />
      </footer>
    </div>
  );
}
