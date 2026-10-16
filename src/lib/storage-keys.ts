/**
 * 全站 localStorage 键名唯一真源。
 *
 * 背景：同一份数据曾在多个文件里手写字符串键名（default-age 一度两套编码、
 * visited-modules 三处实现），改一处漏一处。除这里登记的键外，
 * 不要在业务代码里新写裸字符串键。
 *
 * 约定：新键带版本后缀 `.v1`，结构变更时升 `.v2` 并写迁移；
 * 历史键保持原名（改名等于丢用户数据），只收敛引用入口。
 */
export const STORAGE_KEYS = {
  /** 全局默认年龄（/me 滑块、/user 设置、/windows 输入、首页图表指针共用） */
  defaultAge: 'default-age',
  /** /me 最早的年龄键，只作读取迁移 */
  defaultAgeLegacy: 'me-age',
  /** 人生阶段定义（/user 编辑，destiny/windows/simulation 消费） */
  lifeStages: 'life-stages',
  /** 六维偏好权重（/user 编辑，destiny 消费） */
  preferenceWeights: 'preference-weights',
  /** 模块访问记录（根布局 ModuleVisitTracker 写，/user 读） */
  visitedModules: 'visited-modules',
  /** 窗口三态个人标记（/me） */
  windowMarks: 'window-marks.v1',
  /** 自定义 AI 接入源列表 */
  aiSources: 'ai-sources',
  /** 当前生效的 AI 源 id（历史名 api-active-source，保持不变避免丢用户选择） */
  aiActiveSource: 'api-active-source',
  /** 登录用户信息（仅界面展示，权限以 auth-token 为准） */
  authUser: 'auth-user',
  /** 服务端签发的会话令牌（HMAC，7 天） */
  authToken: 'auth-token',
  /** 访客各模块已免费展开的详情次数（JSON：{ [moduleId]: count }，见 src/lib/free-preview.ts） */
  freePreview: 'free-preview.v1',
  /** 首页访客登录引导条本次会话已关闭（sessionStorage，VisitorLoginNudge 用） */
  visitorNudgeDismissed: 'visitor-nudge-dismissed.v1',
  /** 翻页式介绍文档已读标记——旧版全浏览器共用键，仅作历史登记，不再读写（见 onboardingTourDoneFor） */
  onboardingTourDone: 'onboarding-tour.v1',
  /** 翻页式介绍文档已读标记前缀（按用户区分：同一浏览器的新账号也能看到介绍） */
  onboardingSeenPrefix: 'onboarding.seen.v1:',
  // ---- 云同步模块数据键（batch 联动，写入点见各模块；与 user-state-sync SYNC_KEYS 对齐） ----
  /** 命运模块画像输入 */
  destinyInput: 'destiny.input.v1',
  /** 命运模块已生成报告 */
  destinyReport: 'destiny.report.v1',
  /** 健康问卷答案 */
  healthAnswers: 'health.answers.v1',
  /** 模拟器六维权重 */
  simDimensions: 'sim.dimensions.v2',
  /** 模拟器六维问答 */
  simAnswers: 'sim.answers.v2',
  /** 名字模块风格偏好 */
  nameStyle: 'name.style.v1',
  /** 名字模块性别选择 */
  nameGender: 'name.gender.v1',
  /** 名字模块姓氏 */
  nameSurname: 'name.surname.v1',
  /** 职业三态标记（想做/在做/做过） */
  careerMarks: 'career-marks.v1',
  /** 规律收藏 */
  lawsFavorites: 'laws-favorites.v1',
  /** 运气收藏 */
  luckFavorites: 'luck-favorites.v1',
  /** 云同步 meta：上次推送值 + 数据归属账号 __owner（user-state-sync.ts 专用，P0 防串号） */
  userStateSyncMeta: 'user-state-sync.v1',
  /** 开发者后台会话（按 UTC 日轮换的哈希，24-48h 有效） */
  devToken: 'dev-token',
} as const;

/** 介绍文档已读标记的按用户键（`onboarding.seen.v1:<userId>`） */
export function onboardingSeenKey(userId: number | string): string {
  return `${STORAGE_KEYS.onboardingSeenPrefix}${userId}`;
}

/** sessionStorage：云同步拉取后已刷新页面的守卫前缀（`user-state-reloaded-<userId>`） */
export const SESSION_KEYS = {
  userStateReloadedPrefix: 'user-state-reloaded-',
  /** 登录已过期提示标记（会话过期后页面会因云同步守卫刷新一次，靠它让提示横幅跨刷新保留） */
  sessionExpired: 'session-expired.v1',
  /** 首页开场落印（刻度轨道描出 + 方印落下）本会话已播放，只播一次 */
  atlasIntro: 'atlas-intro.v1',
  /** /journey 八个节点依次点亮 + 方印落下，本会话已播放，只播一次 */
  journeyLit: 'journey-lit.v1',
} as const;
