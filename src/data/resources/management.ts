import type { CareerResourceSet } from '../career-resources';

export const managementResources: Record<string, CareerResourceSet> = {
  '创业者': {
    videos: [{ title: 'New Enterprises（新企业）', url: 'https://ocw.mit.edu/courses/15-390-new-enterprises-spring-2013/', source: 'MIT OpenCourseWare', note: 'MIT斯隆商学院创业课程，免费公开' }],
    books: [
      { title: '精益创业', author: 'Eric Ries', why: '用小步快跑验证商业假设，创业入门必读' },
      { title: '从0到1', author: 'Peter Thiel', why: '硅谷创业者视角，讲清楚如何创造独特价值' },
    ],
  },
  'COO/运营总监': {
    books: [{ title: '精益思想', author: 'James P. Womack, Daniel T. Jones', why: '系统讲解精益生产与流程优化，运营效率的核心方法' }],
  },
  '运营总监': {
    books: [{ title: '精益思想', author: 'James P. Womack, Daniel T. Jones', why: '系统讲解精益生产与流程优化，运营效率的核心方法' }],
  },
  '敏捷教练': {
    videos: [{ title: 'Agile Project Management', url: 'https://www.coursera.org/learn/agile-project-management', source: 'Coursera', note: '敏捷项目管理基础课程' }],
    docs: [
      { title: 'The Scrum Guide（Scrum指南）', url: 'https://scrumguides.org/scrum-guide.html', source: 'Scrum Guides', note: 'Scrum规则的权威定义' },
      { title: 'Agile Alliance', url: 'https://www.agilealliance.org/', source: 'Agile Alliance', note: '敏捷社区与实践资料' },
    ],
  },
  'OKR教练': {
    docs: [{ title: 'OKR 官方资源', url: 'https://www.okrs.com/', source: 'okrs.com', note: 'OKR方法的介绍与案例' }],
    books: [{ title: 'OKR：做最重要的事', author: 'John Doerr', why: '由OKR推广者讲述Intel与Google的实践' }],
  },
  'CTO/技术总监': {
    books: [{ title: '人月神话', author: 'Frederick P. Brooks Jr.', why: '大型软件项目管理经典，技术管理者必读' }],
  },
  'CIO/信息总监': {
    docs: [{ title: 'COBIT 框架', url: 'https://www.isaca.org/resources/cobit', source: 'ISACA', note: 'IT治理与管理的权威框架' }],
  },
  '内部审计师': {
    docs: [
      { title: 'The IIA（国际内部审计师协会）', url: 'https://www.theiia.org/', source: 'IIA', note: '内部审计专业标准与认证' },
      { title: '中国内部审计协会', url: 'https://www.ciia.com.cn/', source: '中国内部审计协会', note: '国内内部审计准则与资格' },
    ],
  },
  '风险控制总监': {
    docs: [{ title: 'COSO 企业风险管理框架', url: 'https://www.coso.org/', source: 'COSO', note: '企业内部控制与风险管理的主流框架' }],
  },
  'CFO（首席财务官）': {
    docs: [
      { title: 'IFRS 会计准则', url: 'https://www.ifrs.org/', source: 'IFRS基金会', note: '国际财务报告准则官方来源' },
      { title: '中国注册会计师协会', url: 'https://www.cicpa.org.cn/', source: '中国注册会计师协会', note: '国内会计与审计准则' },
    ],
  },
  '投资总监': {
    docs: [{ title: 'CFA Institute', url: 'https://www.cfainstitute.org/', source: 'CFA Institute', note: '投资专业标准与CFA认证' }],
    books: [{ title: '聪明的投资者', author: 'Benjamin Graham', why: '价值投资的经典著作，构建投资理念的基础' }],
  },
  'CEO（首席执行官）': {
    books: [{ title: '从优秀到卓越', author: 'Jim Collins', why: '分析企业从优秀迈向卓越的关键要素' }],
  },
  '变革管理顾问': {
    videos: [{ title: 'Leading transformations: Manage change（领导变革：管理变化）', url: 'https://www.coursera.org/learn/change-management', source: 'Coursera', note: '组织变革的实操方法' }],
    books: [{ title: '领导变革', author: 'John P. Kotter', why: '提出变革八步法，变革管理的经典框架' }],
  },
  '组织发展专家': {
  },
  '质量总监': {
    docs: [{ title: 'ISO 9001 质量管理', url: 'https://www.iso.org/iso-9001-quality-management.html', source: 'ISO', note: '质量管理体系的国际标准' }],
  },
  '项目管理办公室(PMO)': {
    docs: [{ title: 'PMI 项目管理学会', url: 'https://www.pmi.org/', source: 'PMI', note: 'PMBOK指南与项目管理认证' }],
    books: [{ title: 'PMBOK指南（项目管理知识体系指南）', author: 'PMI（项目管理协会）', why: '项目管理领域的标准知识体系' }],
  },
  '知识管理专家': {
    books: [{ title: '知识创造公司', author: 'Ikujiro Nonaka, Hirotaka Takeuchi', why: '解释组织如何创造与传播知识的经典研究' }],
  },
  '供应链总监': {
    docs: [{ title: 'ASCM（前身为APICS）', url: 'https://www.ascm.org/', source: 'ASCM', note: '供应链管理专业认证与知识体系' }],
  },
  '产品总监': {
    books: [{ title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '讲透产品发现与团队方法，适合产品负责人' }],
  },
  '招聘经理': {
    docs: [{ title: 'SHRM（美国人力资源管理协会）', url: 'https://www.shrm.org/', source: 'SHRM', note: '人力资源与招聘实践的权威资料' }],
  },
  '绩效管理专家': {
    docs: [{ title: 'SHRM（美国人力资源管理协会）', url: 'https://www.shrm.org/', source: 'SHRM', note: '绩效管理与人才发展资料' }],
  },
  '继任计划经理': {
    docs: [{ title: 'SHRM（美国人力资源管理协会）', url: 'https://www.shrm.org/', source: 'SHRM', note: '人才梯队与继任管理实践' }],
  },
  '员工体验经理': {
    docs: [{ title: 'CIPD（英国特许人事与发展协会）', url: 'https://www.cipd.org/', source: 'CIPD', note: '员工体验与人力资源研究' }],
  },
  '多元包容经理': {
    docs: [{ title: 'SHRM（美国人力资源管理协会）', url: 'https://www.shrm.org/', source: 'SHRM', note: '多元与包容实践资料' }],
  },
  '雇主品牌经理': {
    docs: [{ title: 'CIPD（英国特许人事与发展协会）', url: 'https://www.cipd.org/', source: 'CIPD', note: '雇主品牌与人才吸引研究' }],
  },
  '人力资源数据分析师': {
    docs: [{ title: 'CIPD（英国特许人事与发展协会）', url: 'https://www.cipd.org/', source: 'CIPD', note: '人力资源分析与人才数据研究' }],
  },
  'HR共享服务中心经理': {
    docs: [{ title: 'SHRM（美国人力资源管理协会）', url: 'https://www.shrm.org/', source: 'SHRM', note: '人力资源共享服务的运营实践' }],
  },
  '首席人才官': {
    docs: [{ title: 'SHRM（美国人力资源管理协会）', url: 'https://www.shrm.org/', source: 'SHRM', note: '人才战略与组织发展资料' }],
  },
  '员工关系经理': {
    docs: [{ title: 'CIPD（英国特许人事与发展协会）', url: 'https://www.cipd.org/', source: 'CIPD', note: '员工关系与劳资实践研究' }],
  },
  '薪酬福利经理': {
    docs: [{ title: '中华人民共和国人力资源和社会保障部', url: 'https://www.mohrss.gov.cn/', source: '人社部', note: '国内薪酬福利与社保政策' }],
  },
  '总经理助理': {
    videos: [{ title: 'Leadership Essentials（领导力基础）', url: 'https://www.coursera.org/learn/leadership-essentials', source: 'Coursera', note: '管理与领导力入门' }],
  },
};
