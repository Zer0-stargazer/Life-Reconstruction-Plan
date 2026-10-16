/**
 * AI 面板的预填追问（每个有 AI 面板的模块 3 条）。
 * 原则：具体、贴合该模块数据与用户处境，不写鸡汤，不问「怎么看」这类空问题。
 * key 用各面板传给 /api/ai/analyze 的 module 字段，同时兼容页面路由名。
 */

export const AI_PROMPTS: Record<string, readonly [string, string, string]> = {
  career: [
    '这个职业 5 年后最可能被什么替代？',
    '从我现在的背景转过去，最短路径是什么？',
    '入行第一年最容易踩的坑是什么？',
  ],
  laws: [
    '这条规律在什么条件下会失效？',
    '我现在的处境里，哪一步最容易触发它？',
    '如果只做一件事来顺应它，应该是什么？',
  ],
  window: [
    '按我的年龄，哪个窗口关得最快，补救代价是多少？',
    '手头资源有限时，这几个窗口该先抓哪一个？',
    '哪些窗口看起来紧迫，其实可以放心推迟？',
  ],
  simulation: [
    '六维里哪一项提升一格，对整体影响最大？',
    '我的最强项能怎么去补最弱项？',
    '未来 90 天只改一件事，应该改什么？',
  ],
  luck: [
    '这个节点的风险，能提前布置哪些对冲？',
    '我怎样才能分辨它是运气还是被我误读的信号？',
    '遇到它之后，前 30 天最该做什么、最不该做什么？',
  ],
  destiny: [
    '报告里的下一个窗口，我现在最该准备什么？',
    '我的自评和我的实际选择之间，有哪些矛盾？',
    '未来三年，哪一个决定的代价最大？',
  ],
  health: [
    '最弱的子域里，哪一件小事做了回报最高？',
    '哪些信号已经超出自我调整的范围，应该去就医？',
    '睡眠、运动和精力三者，先动哪一个？',
  ],
};

/** 页面路由名 → 面板 module 字段（如 windows 页发送 module: 'window'） */
const ALIAS: Record<string, string> = { windows: 'window' };

export function getAiPrompts(module: string): readonly string[] {
  return AI_PROMPTS[ALIAS[module] ?? module] ?? [];
}
