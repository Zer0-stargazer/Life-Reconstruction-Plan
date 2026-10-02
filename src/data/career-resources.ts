/**
 * 职业级专属学习资源。
 *
 * 背景：此前学习资源按「分类」查找（getBooks 等），同分类下 45 个医疗职业
 * 推荐同一套书，用户反馈"太重复"。这里按**职业名**存专属资源，查不到时
 * 才回落到分类级通用资源——专属在前、通用在后。
 *
 * 数据来源：2026-10-02 起分批联网调研（首批：黄金/高危快看组职业），
 * 课程/参考的 URL 逐一实测可达才写入；验证不过的字段 url 留空，绝不编造。
 * 书籍类以"真实存在、可买到"为准，标注 why 说明为什么适合这份职业。
 */

export interface CareerResourceBook {
  title: string;
  author: string;
  /** 为什么适合这份职业的自学者，≤40 字 */
  why?: string;
}

export interface CareerResourceCourse {
  title: string;
  platform: string;
  /** 实测可达的课程/文档地址；未验证成功则留空 */
  url?: string;
  note?: string;
}

export interface CareerResourceRef {
  name: string;
  url?: string;
  why?: string;
}

export interface CareerResourceSet {
  book: CareerResourceBook;
  course: CareerResourceCourse;
  reference: CareerResourceRef;
}

/** 键 = 职业名（与 careers.ts 的 name 字段精确一致） */
export const CAREER_RESOURCES: Record<string, CareerResourceSet> = {};
