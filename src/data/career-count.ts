/**
 * 职业总数。careers.ts 有 185KB，模块身份/首页/侧栏只需要一个数字，
 * 不应为了显示它把整份职业库打进 bundle，所以单独放这里。
 * 由 src/data/career-count.test.ts 断言与 careers.length 一致——改数据时记得同步。
 */
export const CAREER_COUNT = 888;
