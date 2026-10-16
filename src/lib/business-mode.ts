/**
 * 商业模式开关（新旧方案分离开，互不删除）
 *
 * "open"（默认，当前生效）—— 开源免费模式：
 *   - 登录即解锁全部内容，不再要求 premium 使用权
 *   - AI 是唯一付费点：平台额度扣完可改用自带 Key（BYOK）继续，或充值续码
 *
 * "legacy" —— 买断制模式（旧方案，代码保留）：
 *   - 内容需 premium/developer 使用权解锁
 *   - AI 需先有使用权，再扣平台额度
 *
 * 切换方式：设置环境变量 NEXT_PUBLIC_BUSINESS_MODE=legacy 后重新构建即可整体回退，
 * 无需改代码。
 */
export const BUSINESS_MODE = (
  process.env.NEXT_PUBLIC_BUSINESS_MODE === "legacy" ? "legacy" : "open"
) as "open" | "legacy";
