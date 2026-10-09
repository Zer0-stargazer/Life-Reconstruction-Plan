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
  /** 开发者后台会话（按 UTC 日轮换的哈希，24-48h 有效） */
  devToken: 'dev-token',
} as const;
