import type { CareerResourceSet } from '../career-resources';

export const gapResourcesD: Record<string, CareerResourceSet> = {
  'CDN工程师': {
    docs: [
      { title: 'Cloudflare 缓存文档（Cache）', url: 'https://developers.cloudflare.com/cache/', source: '官方文档', note: '边缘缓存规则、缓存键与失效策略的官方说明' },
    ],
  },
  '技术债务管理专家': {
    docs: [
      { title: 'Martin Fowler：Technical Debt（技术债务）', url: 'https://martinfowler.com/bliki/TechnicalDebt.html', source: 'martinfowler.com', note: '技术债务概念与分类的经典短文' },
    ],
    books: [
      { title: '重构：改善既有代码的设计（Refactoring: Improving the Design of Existing Code）', author: 'Martin Fowler', why: '系统讲解如何在不改变行为的前提下偿还代码层面的技术债务' },
    ],
  },
  '研发效能工程师': {
    videos: [
      { title: 'MIT OCW 6.170: Software Studio（软件工作室）', url: 'https://ocw.mit.edu/courses/6-170-software-studio-spring-2013/', source: 'MIT OCW', note: '英文，软件工程实践与团队协作流程' },
    ],
    docs: [
      { title: 'DORA 研究（DevOps 研发效能指标）', url: 'https://dora.dev/research/', source: 'DORA', note: '交付效能四项关键指标的权威研究与报告' },
    ],
    books: [
      { title: 'Accelerate：软件交付与绩效的科学（Accelerate: The Science of Lean Software and DevOps）', author: 'Nicole Forsgren、Jez Humble、Gene Kim', why: '基于大规模调研，给出提升研发效能的可验证方法' },
    ],
  },
  '基础设施融资经理': {
    docs: [
      { title: '世界银行 PPP 知识中心（Public-Private Partnership）', url: 'https://ppp.worldbank.org/public-private-partnership/', source: '世界银行', note: '公私合营（PPP）项目的政策框架与案例资料' },
    ],
  },
  '设计讲师/培训师': {
    videos: [
      { title: 'Learning How to Learn（如何学会学习）', url: 'https://www.coursera.org/learn/learning-how-to-learn', source: 'Coursera', note: '英文，学习方法与教学设计的认知基础' },
    ],
    books: [
      { title: '设计心理学（The Design of Everyday Things）', author: 'Don Norman', why: '设计原则的经典入门，便于向学员讲解设计思维' },
    ],
  },
};
