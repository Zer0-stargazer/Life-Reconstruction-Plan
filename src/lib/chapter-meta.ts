/**
 * 章节的展示层元信息：英文小标签与一句导语。
 *
 * 与 module-identity.ts 分开放：那边是数据真源（编号、标题、指标），
 * 这里只是排版用的注记，不含任何事实断言。
 */
export const CHAPTER_META: Record<string, { en: string; lede: string }> = {
  序: { en: 'PROLOGUE', lede: '先看清自己现在站在人生的哪一段。' },
  壹: { en: 'CHAPTER I', lede: '机会有开合的时间，先知道哪些门还开着。' },
  贰: { en: 'CHAPTER II', lede: '名字与职业，是你带到牌桌上的底色。' },
  叁: { en: 'CHAPTER III', lede: '那些在暗处转动的齿轮，以及概率里的运气。' },
  肆: { en: 'CHAPTER IV', lede: '哪些事是你能动手改的，改了会怎样。' },
  终: { en: 'EPILOGUE', lede: '把以上叠起来，看清手里的牌面。' },
};

export function chapterMeta(num: string) {
  return CHAPTER_META[num] ?? { en: '', lede: '' };
}
