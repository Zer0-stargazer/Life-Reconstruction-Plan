'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';
import { Lock, Zap, Crown, ArrowRight } from 'lucide-react';
import { SealMark } from '@/components/shared/seal-mark';
import { TickRule } from '@/components/shared/fig-kit';
import { MODULE_IDENTITIES, TIMELINE_IDENTITY, chapterOf } from '@/lib/module-identity';
import { chapterMeta } from '@/lib/chapter-meta';
import { unlockStore } from '@/lib/unlock-store';
import { BUSINESS_MODE } from '@/lib/business-mode';

const IS_OPEN_MODE = BUSINESS_MODE === 'open';

// Module lock overlay - wraps module page content
//
// 2026-10-02 起为预览模式：不再整页拦截——列表/摘要永远渲染，
// 详情弹层、AI 分析等触发动作由各页 useLockedAction().guard 拦截；
// 预览态时在页头下方挂一条解锁引导横幅（PreviewBanner）。
//
// 2026-10-13 加登录门：/me /windows /career /laws /luck 五个板块
// 访客连预览也没有，整页换成登录引导（LoginGate）；登录后可看，
// 功能解锁仍走使用权（与「能否看」是两层）。
export function ModuleGate({ modulePath, children }: { modulePath: string; children: React.ReactNode }) {
  const { isLoading, canAccessModule, canViewModule } = useAuth();

  if (isLoading) return <GateSkeleton />;

  if (!canViewModule(modulePath)) {
    return <LoginGate modulePath={modulePath} />;
  }

  return (
    <>
      {!canAccessModule(modulePath) && <PreviewBanner />}
      {children}
    </>
  );
}

/** 门控加载骨架：认证状态未就绪 / 页面内容分包加载中共用 */
export function GateSkeleton() {
  return (
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md text-left">
        <div className="h-5 w-32 bg-muted rounded animate-pulse mb-4" />
        <div className="h-4 w-full bg-muted rounded animate-pulse mb-2" />
        <div className="h-4 w-2/3 bg-muted rounded animate-pulse" />
      </div>
    </div>
  );
}

/**
 * 登录门：访客访问需登录板块时的整页引导。
 * 不展示任何内容，只给一个明确的「为什么 / 怎么办」。
 */
export function LoginGate({ modulePath }: { modulePath: string }) {
  // 登录后回跳：带上当前路径，/user 登录成功后据此 router.replace
  const pathname = usePathname();
  const loginHref = pathname ? `/user?next=${encodeURIComponent(pathname)}` : '/user';

  // 扉页化：章节大数字 + 该模块的问题。编号、问题一律取自 module-identity，不手写。
  const chapter = chapterOf(modulePath);
  const meta = chapter ? chapterMeta(chapter.num) : null;
  const identity = MODULE_IDENTITIES.find((m) => m.href === modulePath);
  const isTimeline = modulePath === TIMELINE_IDENTITY.href;
  const title = identity?.title ?? (isTimeline ? TIMELINE_IDENTITY.note : '');
  const question = identity?.question ?? (isTimeline ? TIMELINE_IDENTITY.question : '这一圈，你走了多远？');
  const numeral = chapter?.num ?? '终';

  return (
    <div className="flex min-h-[70vh] flex-col px-6 py-10 sm:px-10 lg:px-16">
      <div className="mx-auto grid w-full max-w-5xl flex-1 items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-0">
        {/* 左栏：章节大数字 + 这一章能回答的问题 */}
        <div className="animate-fade-in-up lg:pr-12">
          <div className="font-serif text-8xl font-bold leading-[0.8] tabular-nums text-primary sm:text-[9rem]" aria-hidden>
            {numeral}
          </div>
          <div className="mt-8 flex items-center gap-4">
            <span className="h-px w-8 bg-primary" aria-hidden />
            <span className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {meta?.en || 'EPILOGUE'}{title && ` · ${title}`}
            </span>
          </div>
          <p className="mt-4 max-w-md font-serif text-2xl leading-[1.5] text-foreground sm:text-3xl">{question}</p>
        </div>

        {/* 右栏：方印 + 登录 */}
        <div className="animate-fade-in-up stagger-2 border-border lg:border-l lg:pl-12">
          <SealMark className="h-12 w-12 rounded-[2px]" />
          <h2 className="mt-6 font-serif text-xl font-semibold text-foreground">
            {IS_OPEN_MODE ? '登录后进入' : '登录后才能看'}
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {IS_OPEN_MODE
              ? '登录后记住你的年龄与标记，换设备也在。内容不设试用与正式之分。'
              : '所有板块的内容都只对登录用户开放：时间轴、窗口、名字、职业、规律、命运、模拟、健康。登录就能看。'}
          </p>
          <a
            href={loginHref}
            className="btn-press mt-6 inline-flex items-center gap-3 bg-primary px-6 py-3 font-serif text-sm tracking-[0.12em] text-primary-foreground hover:bg-primary/90"
          >
            登录 / 注册
            <ArrowRight className="h-4 w-4" strokeWidth={1.25} aria-hidden />
          </a>
          <p className="mt-4 max-w-sm text-[11px] leading-relaxed text-muted-foreground/70">
            {IS_OPEN_MODE
              ? '没有账号？注册需要昵称、8 位以上密码，和邮箱或手机号（至少一项，用于找回）'
              : '没有账号？注册只要一个昵称和密码'}
          </p>
        </div>
      </div>

      <TickRule className="mx-auto mt-12 w-full max-w-5xl" label="LOGIN REQUIRED" />
    </div>
  );
}

/**
 * 预览横幅：一句话说明当前是"可逛不可点"的预览态，
 * 解锁动作收口到全局 UnlockDialog（unlockStore.show）。
 *
 * 已登录后**不再显示**：横幅写的是"访客预览"，登录了还说访客是自相矛盾的。
 * 已登录未持码的用户点详情时会走 UnlockDialog 就地兑换，/user 页也有兑换入口，
 * 不缺引导，不需要这条横幅一直挂着。
 */
export function PreviewBanner() {
  const { user } = useAuth();

  if (user) return null;

  return (
    <div className="w-full max-w-7xl 2xl:max-w-[1600px] mx-auto px-6 sm:px-8 pt-4">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-primary/25 bg-primary/[0.05] px-4 py-2.5">
        <Lock className="h-3.5 w-3.5 shrink-0 text-primary/70" />
        <span className="text-xs text-muted-foreground leading-relaxed">
          {IS_OPEN_MODE ? (
            <>登录后全部可读；<span className="text-foreground font-medium">AI 分析</span>注册送 50 次，用完可输入续码或填自己的 Key。</>
          ) : (
            <>
              访客预览：可浏览全部条目；<span className="text-foreground font-medium">详情与 AI 分析</span>需授权码解锁
              {user ? '' : '（登录后可用码兑换）'}
            </>
          )}
        </span>
        <button
          onClick={() => unlockStore.show()}
          className="ml-auto inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 transition-colors btn-press"
        >
          <Zap className="h-3.5 w-3.5" />
          {IS_OPEN_MODE ? '续码' : '解锁'}
        </button>
      </div>
    </div>
  );
}

// Sidebar lock indicator
export function ModuleLockIcon({ modulePath }: { modulePath: string }) {
  const { isLoading, canAccessModule } = useAuth();

  if (isLoading || canAccessModule(modulePath)) return null;

  return (
    <Lock className="w-3 h-3 text-muted-foreground/75" />
  );
}

// Role badge component
export function RoleBadge() {
  const { user, isPremium, isDeveloper } = useAuth();

  if (!user) return null;

  if (isDeveloper) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
        <Crown className="w-3 h-3" />
        开发者
      </span>
    );
  }

  if (isPremium) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary border border-primary/20">
        <Zap className="w-3 h-3" />
        {IS_OPEN_MODE ? '成员' : '充电用户'}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-muted text-muted-foreground border border-border">
      普通用户
    </span>
  );
}
