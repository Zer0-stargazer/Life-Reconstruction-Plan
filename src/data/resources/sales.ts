import type { CareerResourceSet } from '../career-resources';

export const salesResources: Record<string, CareerResourceSet> = {
  '大客户销售': {
    videos: [{ title: 'LinkedIn Learning 销售主题课程合集', url: 'https://www.linkedin.com/learning/topics/sales', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [{ title: 'HubSpot Academy 入站销售（Inbound Sales）免费课程', url: 'https://academy.hubspot.com/courses/inbound-sales', source: 'HubSpot Academy' }],
    books: [
      { title: 'The Challenger Sale', author: 'Matthew Dixon, Brent Adamson', why: '大客户场景下如何用洞察引导客户决策' },
      { title: 'SPIN Selling', author: 'Neil Rackham', why: '基于大量实证研究的大单销售提问方法' },
    ],
  },
  '客户成功经理': {
    videos: [{ title: 'LinkedIn Learning 客户成功主题课程合集', url: 'https://www.linkedin.com/learning/topics/customer-success', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [{ title: 'Trailhead 免费学习平台（Salesforce 官方）', url: 'https://trailhead.salesforce.com/home', source: 'Salesforce 官方', note: '可按 Customer Success 相关模块学习' }],
    books: [{ title: 'Customer Success: How Innovative Companies Are Reducing Churn and Growing Recurring Revenue', author: 'Nick Mehta, Dan Steinman, Lincoln Murphy', why: '系统讲解订阅制企业的客户成功体系' }],
  },
  '电商运营': {
    videos: [{ title: 'LinkedIn Learning 市场营销主题课程合集', url: 'https://www.linkedin.com/learning/topics/marketing', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [{ title: 'Amazon Seller Learn 卖家学习中心', url: 'https://sell.amazon.com/learn/', source: 'Amazon 官方' }],
  },
  '品牌经理': {
    videos: [{ title: 'LinkedIn Learning 品牌管理主题课程合集', url: 'https://www.linkedin.com/learning/topics/brand-management', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [{ title: 'HubSpot Academy 内容营销（Content Marketing）免费课程', url: 'https://academy.hubspot.com/courses/content-marketing', source: 'HubSpot Academy' }],
    books: [
      { title: 'Positioning: The Battle for Your Mind', author: 'Al Ries, Jack Trout', why: '品牌定位理论的经典入门著作' },
      { title: 'Building a StoryBrand', author: 'Donald Miller', why: '用叙事框架梳理品牌信息与表达' },
    ],
  },
  '市场研究分析师': {
    videos: [{ title: 'edX 商业分析（Business Analytics）课程合集', url: 'https://www.edx.org/learn/business-analytics', source: 'edX', note: '课程合集页，可免费旁听部分课程' }],
    books: [{ title: 'Marketing Research: An Applied Orientation', author: 'Naresh K. Malhotra', why: '市场调研方法与数据分析的系统教材' }],
  },
  '公关经理': {
    videos: [{ title: 'LinkedIn Learning 公共关系主题课程合集', url: 'https://www.linkedin.com/learning/topics/public-relations', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    books: [{ title: 'Made to Stick', author: 'Chip Heath, Dan Heath', why: '讲解如何让信息被记住，适合传播与公关沟通' }],
  },
  '广告优化师': {
    videos: [{ title: 'LinkedIn Learning 市场营销主题课程合集', url: 'https://www.linkedin.com/learning/topics/marketing', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
  '私域运营': {
    docs: [{ title: 'HubSpot Academy 社交媒体营销（Social Media Marketing）免费课程', url: 'https://academy.hubspot.com/courses/social-media-marketing', source: 'HubSpot Academy' }],
  },
  '跨境电商运营': {
    docs: [{ title: 'Amazon Seller Learn 卖家学习中心', url: 'https://sell.amazon.com/learn/', source: 'Amazon 官方', note: '跨境卖家平台规则与运营指南' }],
  },
  'B2B市场经理': {
    docs: [{ title: 'HBR 市场营销专题', url: 'https://hbr.org/topic/subject/marketing', source: 'Harvard Business Review', note: '专题文章，部分需付费' }],
    books: [{ title: 'Predictable Revenue', author: 'Aaron Ross, Marylou Tyler', why: '讲解 B2B 企业如何建立可预测的销售线索管道' }],
  },
  '渠道销售经理': {
    docs: [{ title: 'HBR 销售专题', url: 'https://hbr.org/topic/subject/sales', source: 'Harvard Business Review', note: '专题文章，部分需付费' }],
  },
  '客户体验经理': {
    docs: [{ title: 'HBR 客户体验专题', url: 'https://hbr.org/topic/subject/customer-experience', source: 'Harvard Business Review', note: '专题文章，部分需付费' }],
    books: [{ title: 'Customer Success: How Innovative Companies Are Reducing Churn and Growing Recurring Revenue', author: 'Nick Mehta, Dan Steinman, Lincoln Murphy', why: '从客户留存与体验角度理解订阅业务增长' }],
  },
  '业务拓展经理': {
    videos: [{ title: 'LinkedIn Learning 商务拓展主题课程合集', url: 'https://www.linkedin.com/learning/topics/business-development', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    books: [{ title: 'Never Split the Difference', author: 'Chris Voss', why: '谈判技巧实战指南，适合商务拓展与合作谈判' }],
  },
  '猎头顾问': {
    books: [{ title: 'Who: The A Method for Hiring', author: 'Geoff Smart, Randy Street', why: '系统化的人才甄选与判断方法' }],
  },
  '采购经理': {
    videos: [{ title: 'edX 供应链管理（Supply Chain Management）课程合集', url: 'https://www.edx.org/learn/supply-chain-management', source: 'edX', note: '课程合集页，可免费旁听部分课程' }],
    docs: [{ title: 'HBR 供应链管理专题', url: 'https://hbr.org/topic/subject/supply-chain-management', source: 'Harvard Business Review', note: '专题文章，部分需付费' }],
    books: [{ title: 'Getting to Yes', author: 'Roger Fisher, William Ury', why: '经典谈判理论，适合采购与供应商谈判' }],
  },
  '活动策划师': {
    videos: [{ title: 'LinkedIn Learning 活动策划主题课程合集', url: 'https://www.linkedin.com/learning/topics/event-planning', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
  'SaaS销售': {
    videos: [{ title: 'edX 销售（Sales）课程合集', url: 'https://www.edx.org/learn/sales', source: 'edX', note: '课程合集页，可免费旁听部分课程' }],
    docs: [{ title: 'Trailhead 免费学习平台（Salesforce 官方）', url: 'https://trailhead.salesforce.com/home', source: 'Salesforce 官方' }],
    books: [{ title: 'Predictable Revenue', author: 'Aaron Ross, Marylou Tyler', why: 'SaaS 销售团队的获客与管道建设方法' }],
  },
  '数字营销经理': {
    videos: [{ title: 'LinkedIn Learning 市场营销主题课程合集', url: 'https://www.linkedin.com/learning/topics/marketing', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [{ title: 'HubSpot Academy 邮件营销（Email Marketing）免费课程', url: 'https://academy.hubspot.com/courses/email-marketing', source: 'HubSpot Academy' }],
    books: [{ title: 'Contagious: Why Things Catch On', author: 'Jonah Berger', why: '解析内容传播与口碑营销的底层规律' }],
  },
  '增长黑客': {
    books: [{ title: 'Hacking Growth', author: 'Sean Ellis, Morgan Brown', why: '通过实验驱动增长的方法论，增长黑客入门必读' }],
  },
  '展会策划师': {
    videos: [{ title: 'LinkedIn Learning 活动策划主题课程合集', url: 'https://www.linkedin.com/learning/topics/event-planning', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
  '社群运营': {
    docs: [{ title: 'HubSpot Academy 社交媒体营销（Social Media Marketing）免费课程', url: 'https://academy.hubspot.com/courses/social-media-marketing', source: 'HubSpot Academy' }],
  },
  '商务拓展（BD）': {
    videos: [{ title: 'LinkedIn Learning 商务拓展主题课程合集', url: 'https://www.linkedin.com/learning/topics/business-development', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    books: [{ title: 'Getting to Yes', author: 'Roger Fisher, William Ury', why: '经典谈判理论，适合合作机会的商务谈判' }],
  },
  '战略合作经理': {
    books: [{ title: 'Getting to Yes', author: 'Roger Fisher, William Ury', why: '经典谈判理论，适合战略合作谈判' }],
  },
  '会务销售经理': {
    videos: [{ title: 'LinkedIn Learning 活动策划主题课程合集', url: 'https://www.linkedin.com/learning/topics/event-planning', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
  '社交电商运营': {
    docs: [{ title: 'HubSpot Academy 社交媒体营销（Social Media Marketing）免费课程', url: 'https://academy.hubspot.com/courses/social-media-marketing', source: 'HubSpot Academy' }],
  },
  '达人商务BD': {
    videos: [{ title: 'LinkedIn Learning 商务拓展主题课程合集', url: 'https://www.linkedin.com/learning/topics/business-development', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
};
