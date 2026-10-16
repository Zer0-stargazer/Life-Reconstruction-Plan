import type { CareerResourceSet } from '../career-resources';

export const salesResources: Record<string, CareerResourceSet> = {
  '大客户销售': {
    videos: [{ title: 'LinkedIn Learning 销售主题课程合集', url: 'https://www.linkedin.com/learning/topics/sales', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [
      { title: 'reddit · r/sales', url: 'https://www.reddit.com/r/sales/', source: '行业社区', note: '销售从业全球社区', kind: 'community' },
{ title: 'HubSpot Academy 入站销售（Inbound Sales）免费课程', url: 'https://academy.hubspot.com/courses/inbound-sales', source: 'HubSpot Academy' }],
    books: [
      { title: 'The Challenger Sale', author: 'Matthew Dixon, Brent Adamson', why: '大客户场景下如何用洞察引导客户决策' },
      { title: 'SPIN Selling', author: 'Neil Rackham', why: '基于大量实证研究的大单销售提问方法' },
    ],
  },
  '客户成功经理': {
    videos: [{ title: 'LinkedIn Learning 客户成功主题课程合集', url: 'https://www.linkedin.com/learning/topics/customer-success', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [
      { title: 'reddit · r/CustomerSuccess', url: 'https://www.reddit.com/r/CustomerSuccess/', source: '行业社区', note: '客户成功全球社区', kind: 'community' },
{ title: 'Trailhead 免费学习平台（Salesforce 官方）', url: 'https://trailhead.salesforce.com/home', source: 'Salesforce 官方', note: '可按 Customer Success 相关模块学习' }],
    books: [
      { title: '客户成功：软件公司持续增长之道', author: '尼克·梅塔', why: '客户成功领域的开山之作' },
{ title: 'Customer Success: How Innovative Companies Are Reducing Churn and Growing Recurring Revenue', author: 'Nick Mehta, Dan Steinman, Lincoln Murphy', why: '系统讲解订阅制企业的客户成功体系' }],
  },
  '电商运营': {
    books: [
      { title: '增长黑客', author: '范冰', why: '电商增长的方法论' },
      { title: '精益创业', author: '埃里克·莱斯', why: '小步试错做运营' },
    ],
    videos: [{ title: 'LinkedIn Learning 市场营销主题课程合集', url: 'https://www.linkedin.com/learning/topics/marketing', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [
      { title: 'reddit · r/ecommerce', url: 'https://www.reddit.com/r/ecommerce/', source: '行业社区', note: '电商运营全球社区', kind: 'community' },
{ title: 'Amazon Seller Learn 卖家学习中心', url: 'https://sell.amazon.com/learn/', source: 'Amazon 官方' }],
  },
  '品牌经理': {
    videos: [{ title: 'LinkedIn Learning 品牌管理主题课程合集', url: 'https://www.linkedin.com/learning/topics/brand-management', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [
      { title: 'reddit · r/marketing', url: 'https://www.reddit.com/r/marketing/', source: '行业社区', note: '市场营销全球社区', kind: 'community' },
{ title: 'HubSpot Academy 内容营销（Content Marketing）免费课程', url: 'https://academy.hubspot.com/courses/content-marketing', source: 'HubSpot Academy' }],
    books: [
      { title: 'Positioning: The Battle for Your Mind', author: 'Al Ries, Jack Trout', why: '品牌定位理论的经典入门著作' },
      { title: 'Building a StoryBrand', author: 'Donald Miller', why: '用叙事框架梳理品牌信息与表达' },
    ],
  },
  '市场研究分析师': {
    docs: [
      { title: 'reddit · r/marketing', url: 'https://www.reddit.com/r/marketing/', source: '行业社区', note: '市场研究讨论社区', kind: 'community' },

      { title: '市场调研（浙江财经大学）', url: 'https://www.icourse163.org/course/ZUFE-1206509807', source: '中国大学MOOC', note: '调研技术与数据分析的系统课程' },
    ],
    videos: [{ title: 'edX 商业分析（Business Analytics）课程合集', url: 'https://www.edx.org/learn/business-analytics', source: 'edX', note: '课程合集页，可免费旁听部分课程' }],
    books: [
      { title: '精益数据分析', author: '阿利斯泰尔·克罗尔', why: '市场数据的分析方法' },
{ title: 'Marketing Research: An Applied Orientation', author: 'Naresh K. Malhotra', why: '市场调研方法与数据分析的系统教材' }],
  },
  '公关经理': {
    docs: [
      { title: 'reddit · r/PublicRelations', url: 'https://www.reddit.com/r/PublicRelations/', source: '行业社区', note: '公关从业全球社区', kind: 'community' },

      { title: '公共关系学：沟通公众的艺术', url: 'https://www.icourse163.org/course/ZGJL-1462426163', source: '中国大学MOOC', note: '公关策划与危机公关的系统课程' },
    ],
    videos: [{ title: 'LinkedIn Learning 公共关系主题课程合集', url: 'https://www.linkedin.com/learning/topics/public-relations', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    books: [
      { title: '舆论', author: '沃尔特·李普曼', why: '公关传播的思想原典' },
{ title: 'Made to Stick', author: 'Chip Heath, Dan Heath', why: '讲解如何让信息被记住，适合传播与公关沟通' }],
  },
  '广告优化师': {
    books: [
      { title: '一个广告人的自白', author: '大卫·奥格威', why: '广告业必读经典' },
      { title: '文案训练手册', author: '约瑟夫·休格曼', why: '广告文案实操' },
    ],
    docs: [
      { title: 'reddit · r/PPC', url: 'https://www.reddit.com/r/PPC/', source: '行业社区', note: '效果广告投放社区', kind: 'community' },

      { title: '广告学概论：观念与思路（中国传媒大学）', url: 'https://www.icourse163.org/course/CUC-1206148805', source: '中国大学MOOC', note: '广告投放与创意的系统理论' },
    ],
    videos: [{ title: 'LinkedIn Learning 市场营销主题课程合集', url: 'https://www.linkedin.com/learning/topics/marketing', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
  '私域运营': {
    books: [
      { title: '流量池', author: '杨飞', why: '私域流量的方法论之作' },
      { title: '超级转化率', author: '陈勇', why: '转化优化的实操手册' },
    ],
    videos: [
      { title: '私域运营零基础入门实操课', url: 'https://www.bilibili.com/video/BV1Ctq8YdEbf', source: 'Bilibili', note: '私域运营系统课' },
    ],
    docs: [
      { title: 'reddit · r/marketing', url: 'https://www.reddit.com/r/marketing/', source: '行业社区', note: '私域运营讨论社区', kind: 'community' },
{ title: 'HubSpot Academy 社交媒体营销（Social Media Marketing）免费课程', url: 'https://academy.hubspot.com/courses/social-media-marketing', source: 'HubSpot Academy' }],
  },
  '跨境电商运营': {
    books: [
      { title: '世界是平的', author: '托马斯·弗里德曼', why: '全球化贸易的背景框架' },
      { title: '长尾理论', author: '克里斯·安德森', why: '跨境电商选品逻辑' },
    ],
    videos: [
      { title: '从0-1做跨境电商：虾皮平台保姆级教程', url: 'https://www.bilibili.com/video/BV1RYqHYnEw8', source: 'Bilibili', note: '跨境电商入行课' },
    ],
    docs: [
      { title: 'reddit · r/ecommerce', url: 'https://www.reddit.com/r/ecommerce/', source: '行业社区', note: '跨境电商讨论社区', kind: 'community' },
{ title: 'Amazon Seller Learn 卖家学习中心', url: 'https://sell.amazon.com/learn/', source: 'Amazon 官方', note: '跨境卖家平台规则与运营指南' }],
  },
  'B2B市场经理': {
    videos: [
      { title: 'B2B公司如何从网络上获客', url: 'https://www.bilibili.com/video/BV1zv4y1A7nh', source: 'Bilibili', note: 'B2B营销获客方法' },
    ],
    docs: [
      { title: 'reddit · r/sales', url: 'https://www.reddit.com/r/sales/', source: '行业社区', note: '销售从业全球社区', kind: 'community' },
{ title: 'HBR 市场营销专题', url: 'https://hbr.org/topic/subject/marketing', source: 'Harvard Business Review', note: '专题文章，部分需付费' }],
    books: [
      { title: 'SPIN销售巨人', author: '尼尔·雷克汉姆', why: '大客户销售的经典方法论' },
{ title: 'Predictable Revenue', author: 'Aaron Ross, Marylou Tyler', why: '讲解 B2B 企业如何建立可预测的销售线索管道' }],
  },
  '渠道销售经理': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '渠道谈判的心理根基' },
      { title: '赢', author: '杰克·韦尔奇', why: '商业管理的通用经典' },
    ],
    videos: [
      { title: '上海交通大学：销售渠道管理44集全', url: 'https://www.bilibili.com/video/BV154411W7Va', source: 'Bilibili', note: '渠道管理系统课' },
    ],
    docs: [
      { title: 'reddit · r/Entrepreneur', url: 'https://www.reddit.com/r/Entrepreneur/', source: '行业社区', note: '渠道经营社区', kind: 'community' },
{ title: 'HBR 销售专题', url: 'https://hbr.org/topic/subject/sales', source: 'Harvard Business Review', note: '专题文章，部分需付费' }],
  },
  '客户体验经理': {
    videos: [
      { title: '我为什么放弃产品经理转岗客户成功', url: 'https://www.bilibili.com/video/BV1i7moYyELi', source: 'Bilibili', note: '客户成功转岗实录' },
    ],
    docs: [
      { title: 'reddit · r/CustomerSuccess', url: 'https://www.reddit.com/r/CustomerSuccess/', source: '行业社区', note: '客户成功全球社区', kind: 'community' },
{ title: 'HBR 客户体验专题', url: 'https://hbr.org/topic/subject/customer-experience', source: 'Harvard Business Review', note: '专题文章，部分需付费' }],
    books: [
      { title: '客户成功：软件公司持续增长之道', author: '尼克·梅塔', why: '客户成功领域的开山之作' },
{ title: 'Customer Success: How Innovative Companies Are Reducing Churn and Growing Recurring Revenue', author: 'Nick Mehta, Dan Steinman, Lincoln Murphy', why: '从客户留存与体验角度理解订阅业务增长' }],
  },
  '业务拓展经理': {
    docs: [
      { title: 'reddit · r/negotiation', url: 'https://www.reddit.com/r/negotiation/', source: '行业社区', note: '谈判技巧全球社区', kind: 'community' },

      { title: '市场营销学（浙江财经大学嘉兴学院）', url: 'https://www.icourse163.org/course/ZCIB-1206695846', source: '中国大学MOOC', note: '含渠道与促销的全景框架' },
    ],
    videos: [{ title: 'LinkedIn Learning 商务拓展主题课程合集', url: 'https://www.linkedin.com/learning/topics/business-development', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    books: [
      { title: '谈判力', author: '罗杰·费希尔', why: '哈佛谈判项目的经典' },
{ title: 'Never Split the Difference', author: 'Chris Voss', why: '谈判技巧实战指南，适合商务拓展与合作谈判' }],
  },
  '猎头顾问': {
    docs: [
      { title: 'reddit · r/recruiting', url: 'https://www.reddit.com/r/recruiting/', source: '行业社区', note: '招聘行业社区', kind: 'community' },

      { title: '人力资源管理（四川大学）', url: 'https://www.icourse163.org/course/SCU-1002532009', source: '中国大学MOOC', note: '招聘甄选与人才测评课程' },
    ],
    videos: [
      { title: '新人猎头人才寻访入门法宝', url: 'https://www.bilibili.com/video/BV1GW411o7Up', source: 'Bilibili', note: '猎头寻访方法课' },
    ],
    books: [
      { title: '关键对话', author: '科里·帕特森', why: '候选人沟通的经典' },
{ title: 'Who: The A Method for Hiring', author: 'Geoff Smart, Randy Street', why: '系统化的人才甄选与判断方法' }],
  },
  '采购经理': {
    videos: [{ title: 'edX 供应链管理（Supply Chain Management）课程合集', url: 'https://www.edx.org/learn/supply-chain-management', source: 'edX', note: '课程合集页，可免费旁听部分课程' }],
    docs: [
      { title: 'reddit · r/smallbusiness', url: 'https://www.reddit.com/r/smallbusiness/', source: '行业社区', note: '小微企业社区', kind: 'community' },
{ title: 'HBR 供应链管理专题', url: 'https://hbr.org/topic/subject/supply-chain-management', source: 'Harvard Business Review', note: '专题文章，部分需付费' }],
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '渠道谈判的心理根基' },
{ title: 'Getting to Yes', author: 'Roger Fisher, William Ury', why: '经典谈判理论，适合采购与供应商谈判' }],
  },
  '活动策划师': {
    books: [
      { title: '金字塔原理', author: '芭芭拉·明托', why: '策划方案写作的根基' },
      { title: '参与感', author: '黎万强', why: '活动与用户运营的案例' },
    ],
    docs: [
      { title: 'reddit · r/eventplanning', url: 'https://www.reddit.com/r/eventplanning/', source: '行业社区', note: '活动策划全球社区', kind: 'community' },

      { title: '会展策划与管理Online（华中农业大学）', url: 'https://www.icourse163.org/course/HZAU-1449895162', source: '中国大学MOOC', note: '会展立项/招商/节事活动全流程' },
    ],
    videos: [{ title: 'LinkedIn Learning 活动策划主题课程合集', url: 'https://www.linkedin.com/learning/topics/event-planning', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
  'SaaS销售': {
    videos: [{ title: 'edX 销售（Sales）课程合集', url: 'https://www.edx.org/learn/sales', source: 'edX', note: '课程合集页，可免费旁听部分课程' }],
    docs: [
      { title: 'reddit · r/saas', url: 'https://www.reddit.com/r/saas/', source: '行业社区', note: 'SaaS行业社区', kind: 'community' },
{ title: 'Trailhead 免费学习平台（Salesforce 官方）', url: 'https://trailhead.salesforce.com/home', source: 'Salesforce 官方' }],
    books: [
      { title: 'SPIN销售巨人', author: '尼尔·雷克汉姆', why: '大客户销售的经典方法论' },
{ title: 'Predictable Revenue', author: 'Aaron Ross, Marylou Tyler', why: 'SaaS 销售团队的获客与管道建设方法' }],
  },
  '数字营销经理': {
    videos: [{ title: 'LinkedIn Learning 市场营销主题课程合集', url: 'https://www.linkedin.com/learning/topics/marketing', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    docs: [
      { title: 'reddit · r/growthacking', url: 'https://www.reddit.com/r/growthacking/', source: '行业社区', note: '增长黑客全球社区', kind: 'community' },
{ title: 'HubSpot Academy 邮件营销（Email Marketing）免费课程', url: 'https://academy.hubspot.com/courses/email-marketing', source: 'HubSpot Academy' }],
    books: [
      { title: '增长黑客', author: '范冰', why: '数字增长的方法论' },
{ title: 'Contagious: Why Things Catch On', author: 'Jonah Berger', why: '解析内容传播与口碑营销的底层规律' }],
  },
  '增长黑客': {
    docs: [
      { title: 'reddit · r/growthacking', url: 'https://www.reddit.com/r/growthacking/', source: '行业社区', note: '增长黑客全球社区', kind: 'community' },

      { title: '数字营销：走进智慧的品牌（暨南大学）', url: 'https://www.icourse163.org/course/JNU-1001603003', source: '中国大学MOOC', note: '数字营销与智慧品牌的系统课程' },
    ],
    videos: [
      { title: '增长黑客用户运营系列课程', url: 'https://www.bilibili.com/video/BV1DQ4y1P7eB', source: 'Bilibili', note: '增长运营系统课' },
    ],
    books: [
      { title: '增长黑客', author: '范冰', why: '数字增长的方法论' },
{ title: 'Hacking Growth', author: 'Sean Ellis, Morgan Brown', why: '通过实验驱动增长的方法论，增长黑客入门必读' }],
  },
  '展会策划师': {
    books: [
      { title: '金字塔原理', author: '芭芭拉·明托', why: '策划方案写作的根基' },
      { title: '参与感', author: '黎万强', why: '活动与用户运营的案例' },
    ],
    docs: [
      { title: 'reddit · r/eventplanning', url: 'https://www.reddit.com/r/eventplanning/', source: '行业社区', note: '活动策划全球社区', kind: 'community' },

      { title: '会展策划与管理Online（华中农业大学）', url: 'https://www.icourse163.org/course/HZAU-1449895162', source: '中国大学MOOC', note: '会展立项/招商/节事活动全流程' },
    ],
    videos: [{ title: 'LinkedIn Learning 活动策划主题课程合集', url: 'https://www.linkedin.com/learning/topics/event-planning', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
  '社群运营': {
    books: [
      { title: '流量池', author: '杨飞', why: '私域流量的方法论之作' },
      { title: '超级转化率', author: '陈勇', why: '转化优化的实操手册' },
    ],
    videos: [
      { title: '私域运营零基础入门实操课', url: 'https://www.bilibili.com/video/BV1Ctq8YdEbf', source: 'Bilibili', note: '私域运营系统课' },
    ],
    docs: [
      { title: 'reddit · r/Entrepreneur', url: 'https://www.reddit.com/r/Entrepreneur/', source: '行业社区', note: '创业者社区', kind: 'community' },
{ title: 'HubSpot Academy 社交媒体营销（Social Media Marketing）免费课程', url: 'https://academy.hubspot.com/courses/social-media-marketing', source: 'HubSpot Academy' }],
  },
  '商务拓展（BD）': {
    docs: [
      { title: 'reddit · r/negotiation', url: 'https://www.reddit.com/r/negotiation/', source: '行业社区', note: '谈判技巧全球社区', kind: 'community' },

      { title: '市场营销学（浙江财经大学嘉兴学院）', url: 'https://www.icourse163.org/course/ZCIB-1206695846', source: '中国大学MOOC', note: '含渠道与促销的全景框架' },
    ],
    videos: [{ title: 'LinkedIn Learning 商务拓展主题课程合集', url: 'https://www.linkedin.com/learning/topics/business-development', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
    books: [
      { title: '谈判力', author: '罗杰·费希尔', why: '哈佛谈判项目的经典' },
{ title: 'Getting to Yes', author: 'Roger Fisher, William Ury', why: '经典谈判理论，适合合作机会的商务谈判' }],
  },
  '战略合作经理': {
    docs: [
      { title: 'reddit · r/business', url: 'https://www.reddit.com/r/business/', source: '行业社区', note: '商务合作讨论社区', kind: 'community' },

      { title: '市场营销学（浙江财经大学嘉兴学院）', url: 'https://www.icourse163.org/course/ZCIB-1206695846', source: '中国大学MOOC', note: '含渠道与促销的全景框架' },
    ],
    videos: [
      { title: '前FBI首席人质谈判代表的沟通策略', url: 'https://www.bilibili.com/video/BV1ts4y1w7vJ', source: 'Bilibili', note: '谈判心理学课' },
    ],
    books: [
      { title: '谈判力', author: '罗杰·费希尔', why: '哈佛谈判项目的经典' },
{ title: 'Getting to Yes', author: 'Roger Fisher, William Ury', why: '经典谈判理论，适合战略合作谈判' }],
  },
  '会务销售经理': {
    books: [
      { title: '金字塔原理', author: '芭芭拉·明托', why: '策划方案写作的根基' },
      { title: '参与感', author: '黎万强', why: '活动与用户运营的案例' },
    ],
    docs: [
      { title: 'reddit · r/eventplanning', url: 'https://www.reddit.com/r/eventplanning/', source: '行业社区', note: '活动策划全球社区', kind: 'community' },

      { title: '会展策划与管理Online（华中农业大学）', url: 'https://www.icourse163.org/course/HZAU-1449895162', source: '中国大学MOOC', note: '会展立项/招商/节事活动全流程' },
    ],
    videos: [{ title: 'LinkedIn Learning 活动策划主题课程合集', url: 'https://www.linkedin.com/learning/topics/event-planning', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
  '社交电商运营': {
    books: [
      { title: '世界是平的', author: '托马斯·弗里德曼', why: '全球化贸易的背景框架' },
      { title: '长尾理论', author: '克里斯·安德森', why: '跨境电商选品逻辑' },
    ],
    videos: [
      { title: '从0-1做跨境电商：虾皮平台保姆级教程', url: 'https://www.bilibili.com/video/BV1RYqHYnEw8', source: 'Bilibili', note: '跨境电商入行课' },
    ],
    docs: [
      { title: 'reddit · r/FulfillmentByAmazon', url: 'https://www.reddit.com/r/FulfillmentByAmazon/', source: '行业社区', note: '亚马逊卖家社区', kind: 'community' },
{ title: 'HubSpot Academy 社交媒体营销（Social Media Marketing）免费课程', url: 'https://academy.hubspot.com/courses/social-media-marketing', source: 'HubSpot Academy' }],
  },
  '达人商务BD': {
    books: [
      { title: '增长黑客', author: '范冰', why: '数字增长的方法论' },
      { title: '精益数据分析', author: '阿利斯泰尔·克罗尔', why: '用数据驱动运营决策' },
    ],
    docs: [
      { title: 'reddit · r/growthacking', url: 'https://www.reddit.com/r/growthacking/', source: '行业社区', note: '增长黑客全球社区', kind: 'community' },

      { title: '数字营销：走进智慧的品牌（暨南大学）', url: 'https://www.icourse163.org/course/JNU-1001603003', source: '中国大学MOOC', note: '数字营销与智慧品牌的系统课程' },
    ],
    videos: [{ title: 'LinkedIn Learning 商务拓展主题课程合集', url: 'https://www.linkedin.com/learning/topics/business-development', source: 'LinkedIn Learning', note: '课程合集页，需登录' }],
  },
};
