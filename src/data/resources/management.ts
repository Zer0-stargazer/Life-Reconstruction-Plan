import type { CareerResourceSet } from '../career-resources';

export const managementResources: Record<string, CareerResourceSet> = {
  '创业者': {
    docs: [
      { title: 'reddit · r/startups', url: 'https://www.reddit.com/r/startups/', source: '行业社区', note: '初创公司社区', kind: 'community' },

      { title: '战略管理（扬州大学）', url: 'https://www.icourse163.org/course/YZU-1449612163', source: '中国大学MOOC', note: '创业者需要的战略框架' },
    ],
    videos: [{ title: 'New Enterprises（新企业）', url: 'https://ocw.mit.edu/courses/15-390-new-enterprises-spring-2013/', source: 'MIT OpenCourseWare', note: 'MIT斯隆商学院创业课程，免费公开' }],
    books: [
      { title: '精益创业', author: 'Eric Ries', why: '用小步快跑验证商业假设，创业入门必读' },
      { title: '从0到1', author: 'Peter Thiel', why: '硅谷创业者视角，讲清楚如何创造独特价值' },
    ],
  },
  'COO/运营总监': {
    docs: [
      { title: 'reddit · r/management', url: 'https://www.reddit.com/r/management/', source: '行业社区', note: '管理者全球社区', kind: 'community' },

      { title: '运营管理（中央财经大学）', url: 'https://www.icourse163.org/course/CUFE-1206304809', source: '中国大学MOOC', note: '含项目管理/质量/库存的全景课程' },
    ],
    videos: [
      { title: '干嘉伟：如何科学运营一家企业', url: 'https://www.bilibili.com/video/BV1B64y1F7Bt', source: 'Bilibili', note: '科学运营方法论' },
    ],
    books: [
      { title: '格鲁夫给经理人的第一课', author: '安迪·格鲁夫', why: '管理杠杆率的经典' },
{ title: '精益思想', author: 'James P. Womack, Daniel T. Jones', why: '系统讲解精益生产与流程优化，运营效率的核心方法' }],
  },
  '运营总监': {
    docs: [
      { title: 'reddit · r/management', url: 'https://www.reddit.com/r/management/', source: '行业社区', note: '管理者全球社区', kind: 'community' },

      { title: '运营管理（中央财经大学）', url: 'https://www.icourse163.org/course/CUFE-1206304809', source: '中国大学MOOC', note: '含项目管理/质量/库存的全景课程' },
    ],
    videos: [
      { title: '干嘉伟：如何科学运营一家企业', url: 'https://www.bilibili.com/video/BV1B64y1F7Bt', source: 'Bilibili', note: '科学运营方法论' },
    ],
    books: [
      { title: '格鲁夫给经理人的第一课', author: '安迪·格鲁夫', why: '管理杠杆率的经典' },
{ title: '精益思想', author: 'James P. Womack, Daniel T. Jones', why: '系统讲解精益生产与流程优化，运营效率的核心方法' }],
  },
  '敏捷教练': {
    books: [
      { title: '敏捷革命', author: '杰夫·萨瑟兰', why: 'Scrum创始人之作' },
      { title: '凤凰项目', author: '吉恩·金', why: '敏捷与DevOps经典' },
    ],
    videos: [{ title: 'Agile Project Management', url: 'https://www.coursera.org/learn/agile-project-management', source: 'Coursera', note: '敏捷项目管理基础课程' }],
    docs: [
      { title: 'reddit · r/agile', url: 'https://www.reddit.com/r/agile/', source: '行业社区', note: '敏捷全球社区', kind: 'community' },

      { title: 'The Scrum Guide（Scrum指南）', url: 'https://scrumguides.org/scrum-guide.html', source: 'Scrum Guides', note: 'Scrum规则的权威定义' },
      { title: 'Agile Alliance', url: 'https://www.agilealliance.org/', source: 'Agile Alliance', note: '敏捷社区与实践资料' },
    ],
  },
  'OKR教练': {
    videos: [
      { title: '谷歌OKR目标管理：开启高光时刻', url: 'https://www.bilibili.com/video/BV1Sa411Q7M2', source: 'Bilibili', note: 'OKR方法与工具' },
    ],
    docs: [
      { title: 'reddit · r/consulting', url: 'https://www.reddit.com/r/consulting/', source: '行业社区', note: '咨询社区', kind: 'community' },
{ title: 'OKR 官方资源', url: 'https://www.okrs.com/', source: 'okrs.com', note: 'OKR方法的介绍与案例' }],
    books: [
      { title: '这就是OKR', author: '约翰·杜尔', why: 'OKR方法论原典' },
{ title: 'OKR：做最重要的事', author: 'John Doerr', why: '由OKR推广者讲述Intel与Google的实践' }],
  },
  'CTO/技术总监': {
    docs: [
      { title: 'reddit · r/ExperiencedDevs', url: 'https://www.reddit.com/r/ExperiencedDevs/', source: '行业社区', note: '资深开发者社区', kind: 'community' },

      { title: '项目管理（西安交通大学）', url: 'https://higher.smartedu.cn/course/6ab1ab3fb44e493c76ff9c16', source: '智慧教育平台', note: '含研发与技术管理中的项目管理专题' },
    ],
    videos: [
      { title: '高效研发团队的技术管理之道', url: 'https://www.bilibili.com/video/BV1Gt4y1p753', source: 'Bilibili', note: '技术管理实务' },
    ],
    books: [
      { title: '凤凰项目', author: '吉恩·金', why: 'DevOps与技术管理小说' },
{ title: '人月神话', author: 'Frederick P. Brooks Jr.', why: '大型软件项目管理经典，技术管理者必读' }],
  },
  'CIO/信息总监': {
    books: [
      { title: '大数据时代', author: '维克托·迈尔-舍恩伯格', why: '数字化转型的背景框架' },
      { title: 'IT不再重要', author: '尼古拉斯·卡尔', why: 'IT战略的经典思辨' },
    ],
    videos: [
      { title: '人人都说数字化转型：什么是/为什么/如何做', url: 'https://www.bilibili.com/video/BV1JzECznEsT', source: 'Bilibili', note: '数字化转型系统课' },
    ],
    docs: [
      { title: 'reddit · r/BusinessIntelligence', url: 'https://www.reddit.com/r/BusinessIntelligence/', source: '行业社区', note: '商业智能社区', kind: 'community' },
{ title: 'COBIT 框架', url: 'https://www.isaca.org/resources/cobit', source: 'ISACA', note: 'IT治理与管理的权威框架' }],
  },
  '内部审计师': {
    books: [
      { title: '穷查理宝典', author: '查理·芒格', why: '风险与决策的智慧' },
      { title: '黑天鹅', author: '纳西姆·尼古拉斯·塔勒布', why: '风险思维的经典' },
    ],
    videos: [
      { title: '审计新人：内控审计全流程', url: 'https://www.bilibili.com/video/BV1kN4y1y7qq', source: 'Bilibili', note: '内审实务课' },
    ],
    docs: [
      { title: 'reddit · r/InternalAudit', url: 'https://www.reddit.com/r/InternalAudit/', source: '行业社区', note: '内审从业社区', kind: 'community' },

      { title: 'The IIA（国际内部审计师协会）', url: 'https://www.theiia.org/', source: 'IIA', note: '内部审计专业标准与认证' },
      { title: '中国内部审计协会', url: 'https://www.ciia.com.cn/', source: '中国内部审计协会', note: '国内内部审计准则与资格' },
    ],
  },
  '风险控制总监': {
    books: [
      { title: '黑天鹅', author: '纳西姆·尼古拉斯·塔勒布', why: '极端风险的思维框架' },
      { title: '穷查理宝典', author: '查理·芒格', why: '决策风险的多元思维' },
    ],
    videos: [
      { title: '企业内部控制与风险管理', url: 'https://www.bilibili.com/video/BV1Yk4y1k7Po', source: 'Bilibili', note: '风控系统课' },
    ],
    docs: [
      { title: 'reddit · r/InternalAudit', url: 'https://www.reddit.com/r/InternalAudit/', source: '行业社区', note: '风控内审讨论', kind: 'community' },
{ title: 'COSO 企业风险管理框架', url: 'https://www.coso.org/', source: 'COSO', note: '企业内部控制与风险管理的主流框架' }],
  },
  'CFO（首席财务官）': {
    books: [
      { title: '财务报表分析', author: '张新民', why: '财报分析权威教材' },
      { title: '从总账到总监', author: '钱自严', why: 'CFO成长路径实录' },
    ],
    videos: [
      { title: '钱自严：从总账到总监（CFO的独家财务笔记）', url: 'https://www.bilibili.com/video/BV1b4421Z77o', source: 'Bilibili', note: '财务总监成长课' },
    ],
    docs: [
      { title: 'reddit · r/Accounting', url: 'https://www.reddit.com/r/Accounting/', source: '行业社区', note: '财会从业全球社区', kind: 'community' },

      { title: 'IFRS 会计准则', url: 'https://www.ifrs.org/', source: 'IFRS基金会', note: '国际财务报告准则官方来源' },
      { title: '中国注册会计师协会', url: 'https://www.cicpa.org.cn/', source: '中国注册会计师协会', note: '国内会计与审计准则' },
    ],
  },
  '投资总监': {
    videos: [
      { title: '中央财经大学《投资学》国家级精品课', url: 'https://www.bilibili.com/video/BV1qa411q7zV', source: 'Bilibili', note: '投资学系统课' },
    ],
    docs: [
      { title: 'reddit · r/consulting', url: 'https://www.reddit.com/r/consulting/', source: '行业社区', note: '投资咨询讨论', kind: 'community' },
{ title: 'CFA Institute', url: 'https://www.cfainstitute.org/', source: 'CFA Institute', note: '投资专业标准与CFA认证' }],
    books: [
      { title: '投资中最简单的事', author: '邱国鹭', why: '价值投资本土经典' },
{ title: '聪明的投资者', author: 'Benjamin Graham', why: '价值投资的经典著作，构建投资理念的基础' }],
  },
  'CEO（首席执行官）': {
    docs: [
      { title: 'reddit · r/leadership', url: 'https://www.reddit.com/r/leadership/', source: '行业社区', note: '领导力社区', kind: 'community' },

      { title: '企业战略管理（四川大学）', url: 'https://higher.smartedu.cn/course/695ed09428f09a0af5c12435', source: '智慧教育平台', note: '战略分析/制定/实施的全景课' },
    ],
    videos: [
      { title: '董事长、CEO、总裁，谁说了算', url: 'https://www.bilibili.com/video/BV1Z3nXz7EDD', source: 'Bilibili', note: '高管角色认知' },
    ],
    books: [
      { title: '原则', author: '瑞·达利欧', why: 'CEO决策与组织原则' },
{ title: '从优秀到卓越', author: 'Jim Collins', why: '分析企业从优秀迈向卓越的关键要素' }],
  },
  '变革管理顾问': {
    docs: [
      { title: 'HRoot · 人力资源行业社区', url: 'https://www.hroot.com/', source: '行业社区', note: 'HR内容与活动平台', kind: 'community' },

      { title: '组织行为学', url: 'https://www.icourse163.org/course/detail.htm?cid=1206453819', source: '中国大学MOOC', note: '领导理论与组织变革章节' },
    ],
    videos: [{ title: 'Leading transformations: Manage change（领导变革：管理变化）', url: 'https://www.coursera.org/learn/change-management', source: 'Coursera', note: '组织变革的实操方法' }],
    books: [
      { title: '思考，快与慢', author: '丹尼尔·卡尼曼', why: '变革中的人类决策偏见' },
{ title: '领导变革', author: 'John P. Kotter', why: '提出变革八步法，变革管理的经典框架' }],
  },
  '组织发展专家': {
    books: [
      { title: '组织文化与领导力', author: '埃德加·沙因', why: '组织发展奠基之作' },
      { title: '驱动力', author: '丹尼尔·平克', why: '组织激励的经典' },
    ],
    docs: [
      { title: '三茅人力资源网 · 组织发展社区', url: 'https://www.hrloo.com/', source: '行业社区', note: 'HR从业者实名社区', kind: 'community' },

      { title: '组织行为学', url: 'https://www.icourse163.org/course/detail.htm?cid=1003544137', source: '中国大学MOOC', note: '个体/群体/领导/组织的系统理论' },
    ],
    videos: [
      { title: '人力资源3D：OD、LD、TD', url: 'https://www.bilibili.com/video/BV1c741117Zf', source: 'Bilibili', note: '组织发展定位课' },
    ],
  },
  '质量总监': {
    books: [
      { title: '质量免费', author: '菲利普·克罗斯比', why: '质量管理的经典' },
      { title: '朱兰质量手册', author: '约瑟夫·朱兰', why: '质量领域权威手册' },
    ],
    videos: [
      { title: '质量管理（已完结）', url: 'https://www.bilibili.com/video/BV1L7411d7vx', source: 'Bilibili', note: '质量管理系统课' },
    ],
    docs: [
      { title: 'reddit · r/qualityassurance', url: 'https://www.reddit.com/r/qualityassurance/', source: '行业社区', note: '质量从业全球社区', kind: 'community' },
{ title: 'ISO 9001 质量管理', url: 'https://www.iso.org/iso-9001-quality-management.html', source: 'ISO', note: '质量管理体系的国际标准' }],
  },
  '项目管理办公室(PMO)': {
    videos: [
      { title: '清华大学《项目管理的逻辑》（全6讲）', url: 'https://www.bilibili.com/video/BV1sU4y1r7eM', source: 'Bilibili', note: '项目管理思维课' },
    ],
    docs: [
      { title: 'PMI 项目管理学会', url: 'https://www.pmi.org/', source: 'PMI', note: 'PMBOK指南与项目管理认证' },
      { title: 'reddit · r/projectmanagement', url: 'https://www.reddit.com/r/projectmanagement/', source: '行业社区', note: '项目管理全球社区', kind: 'community' },
    ],
    books: [
      { title: 'PMBOK指南（项目管理知识体系指南）', author: 'PMI（项目管理协会）', why: '项目管理领域的标准知识体系' },
      { title: '凤凰项目', author: '吉恩·金', why: '以小说形式讲透项目管理与DevOps的经典' },
    ],
  },
  '知识管理专家': {
    docs: [
      { title: 'reddit · r/productivity', url: 'https://www.reddit.com/r/productivity/', source: '行业社区', note: '知识效率社区', kind: 'community' },

      { title: '大数据分析与应用（北京交通大学）', url: 'https://higher.smartedu.cn/course/63fd325aaf1f1b5d3ecfd1b8', source: '智慧教育平台', note: '含知识库建模专题' },
    ],
    videos: [
      { title: '个人知识管理全流程实践演示', url: 'https://www.bilibili.com/video/BV1Gi421v7ir', source: 'Bilibili', note: '知识管理方法课' },
    ],
    books: [
      { title: '打造第二大脑', author: '蒂亚戈·福特', why: '知识管理方法经典' },
{ title: '知识创造公司', author: 'Ikujiro Nonaka, Hirotaka Takeuchi', why: '解释组织如何创造与传播知识的经典研究' }],
  },
  '供应链总监': {
    books: [
      { title: '供应链管理', author: '马丁·克里斯托弗', why: '供应链经典教材' },
      { title: '供应链管理：高成本、高库存、重资产的解决方案', author: '刘宝红', why: '本土供应链实操' },
    ],
    videos: [
      { title: '供应链管理（山东财经大学·全70讲）', url: 'https://www.bilibili.com/video/BV1vsRbYDE99', source: 'Bilibili', note: '供应链系统课' },
    ],
    docs: [
      { title: 'reddit · r/supplychain', url: 'https://www.reddit.com/r/supplychain/', source: '行业社区', note: '供应链全球社区', kind: 'community' },
{ title: 'ASCM（前身为APICS）', url: 'https://www.ascm.org/', source: 'ASCM', note: '供应链管理专业认证与知识体系' }],
  },
  '产品总监': {
    docs: [
      { title: 'reddit · r/ProductManagement', url: 'https://www.reddit.com/r/ProductManagement/', source: '行业社区', note: '产品经理全球社区', kind: 'community' },

      { title: '运营管理（中央财经大学）', url: 'https://www.icourse163.org/course/CUFE-1206304809', source: '中国大学MOOC', note: '产品与服务设计章节' },
    ],
    videos: [
      { title: '你的总监在想什么：高阶管理心得', url: 'https://www.bilibili.com/video/BV1uT4y1i7xn', source: 'Bilibili', note: '产品总监视角' },
    ],
    books: [
      { title: '俞军产品方法论', author: '俞军', why: '本土产品方法论代表作' },
{ title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '讲透产品发现与团队方法，适合产品负责人' }],
  },
  '招聘经理': {
    books: [
      { title: '聘谁', author: '杰夫·斯马特', why: 'A级人才招聘法' },
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '候选人吸引与说服' }
    ],
    videos: [
      { title: '许林芳：带你打通招聘解聘全流程', url: 'https://www.bilibili.com/video/BV1A34y1r7K6', source: 'Bilibili', note: '招聘全流程课' }
    ],
    docs: [
      { title: '人力资源管理（选育用留全景）', url: 'https://www.icourse163.org/course/detail.htm?cid=1450873208', source: '中国大学MOOC', note: '招聘甄选与绩效薪酬实务' },

      { title: 'reddit · r/recruiting', url: 'https://www.reddit.com/r/recruiting/', source: '行业社区', note: '招聘从业社区', kind: 'community' }
    ],
  },
  '绩效管理专家': {
    books: [
      { title: '驱动力', author: '丹尼尔·平克', why: '绩效与内在动机' },
      { title: '原则', author: '瑞·达利欧', why: '绩效文化的方法论' }
    ],
    videos: [
      { title: '36小时精通绩效管理', url: 'https://www.bilibili.com/video/BV1UKcUziE4G', source: 'Bilibili', note: '绩效管理系统课' }
    ],
    docs: [
      { title: '人力资源管理（北京科技大学）', url: 'https://higher.smartedu.cn/course/62354d629906eace049031ef', source: '国家高等教育智慧教育平台', note: '招聘甄选与绩效管理工具' },

      { title: 'reddit · r/productivity', url: 'https://www.reddit.com/r/productivity/', source: '行业社区', note: '职场效率社区', kind: 'community' }
    ],
  },
  '继任计划经理': {
    books: [
      { title: '人力资源管理', author: '加里·德斯勒', why: 'HR领域的标准教材' },
      { title: '奈飞文化手册', author: '帕蒂·麦考德', why: '人才文化的实操经典' }
    ],
    videos: [
      { title: '从0到1精通人力资源管理（2000分钟）', url: 'https://www.bilibili.com/video/BV1Tgju6LEPh', source: 'Bilibili', note: 'HR全栈系统课' }
    ],
    docs: [
      { title: '人力资源管理（中央财经大学）', url: 'https://higher.smartedu.cn/course/6a98a49db44e493c7673a194', source: '国家高等教育智慧教育平台', note: '人才吸纳、激励与绩效系统课' },

      { title: 'reddit · r/AskHR', url: 'https://www.reddit.com/r/AskHR/', source: '行业社区', note: 'HR问答社区', kind: 'community' }
    ],
  },
  '员工体验经理': {
    books: [
      { title: '驱动力', author: '丹尼尔·平克', why: '员工内在动机的经典' },
      { title: '联盟', author: '里德·霍夫曼', why: '雇主与员工的新型关系' },
    ],
    videos: [
      { title: '最适合管理00后员工的方法：X-Y理论', url: 'https://www.bilibili.com/video/BV1f6bnz2EAS', source: 'Bilibili', note: '员工体验管理课' },
    ],
    docs: [
      { title: '三茅人力资源网 · 员工体验讨论', url: 'https://www.hrloo.com/', source: '行业社区', note: 'HR从业者实名社区', kind: 'community' },
{ title: 'CIPD（英国特许人事与发展协会）', url: 'https://www.cipd.org/', source: 'CIPD', note: '员工体验与人力资源研究' }],
  },
  '多元包容经理': {
    books: [
      { title: '非暴力沟通', author: '马歇尔·卢森堡', why: '包容沟通的经典' },
      { title: '驱动力', author: '丹尼尔·平克', why: '包容性激励方法' }
    ],
    videos: [
      { title: 'TED演讲：多元化、公平与包容（DEI）的重新思考', url: 'https://www.bilibili.com/video/BV15WetzgEPV', source: 'Bilibili', note: 'DEI理念课' }
    ],
    docs: [
      { title: '人力资源管理（中央财经大学）', url: 'https://higher.smartedu.cn/course/6a98a49db44e493c7673a194', source: '国家高等教育智慧教育平台', note: '人才吸纳、激励与绩效系统课' },

      { title: '三茅人力资源网 · 多元包容讨论', url: 'https://www.hrloo.com/', source: '行业社区', note: 'HR从业者实名社区', kind: 'community' }
    ],
  },
  '雇主品牌经理': {
    books: [
      { title: '聘谁', author: '杰夫·斯马特', why: 'A级人才招聘法' },
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '候选人吸引与说服' }
    ],
    videos: [
      { title: '许林芳：带你打通招聘解聘全流程', url: 'https://www.bilibili.com/video/BV1A34y1r7K6', source: 'Bilibili', note: '招聘全流程课' }
    ],
    docs: [
      { title: '人力资源管理（选育用留全景）', url: 'https://www.icourse163.org/course/detail.htm?cid=1450873208', source: '中国大学MOOC', note: '招聘甄选与绩效薪酬实务' },

      { title: 'reddit · r/recruiting', url: 'https://www.reddit.com/r/recruiting/', source: '行业社区', note: '招聘从业社区', kind: 'community' }
    ],
  },
  '人力资源数据分析师': {
    books: [
      { title: '精益数据分析', author: '阿利斯泰尔·克罗尔', why: '人力数据的分析方法' },
      { title: '谁说大象不能跳舞', author: '郭士纳', why: '用数据管理企业的实践' },
    ],
    videos: [
      { title: 'PowerBI人力资源分析专辑（17集）', url: 'https://www.bilibili.com/video/BV1cYjQz6EB1', source: 'Bilibili', note: '人力数据可视化' },
    ],
    docs: [
      { title: 'reddit · r/careers', url: 'https://www.reddit.com/r/careers/', source: '行业社区', note: '职场发展社区', kind: 'community' },
{ title: 'CIPD（英国特许人事与发展协会）', url: 'https://www.cipd.org/', source: 'CIPD', note: '人力资源分析与人才数据研究' }],
  },
  'HR共享服务中心经理': {
    books: [
      { title: '人力资源转型', author: '戴维·尤里奇', why: 'HR三支柱奠基之作' },
      { title: '奈飞文化手册', author: '帕蒂·麦考德', why: 'HR文化实践' },
    ],
    videos: [
      { title: '浅谈人力资源三大支柱', url: 'https://www.bilibili.com/video/BV1jJ411A71B', source: 'Bilibili', note: 'HR三支柱认知' },
    ],
    docs: [
      { title: 'reddit · r/careers', url: 'https://www.reddit.com/r/careers/', source: '行业社区', note: '职场发展社区', kind: 'community' },
{ title: 'SHRM（美国人力资源管理协会）', url: 'https://www.shrm.org/', source: 'SHRM', note: '人力资源共享服务的运营实践' }],
  },
  '首席人才官': {
    books: [
      { title: '人力资源管理', author: '加里·德斯勒', why: 'HR领域的标准教材' },
      { title: '奈飞文化手册', author: '帕蒂·麦考德', why: '人才文化的实操经典' }
    ],
    videos: [
      { title: '从0到1精通人力资源管理（2000分钟）', url: 'https://www.bilibili.com/video/BV1Tgju6LEPh', source: 'Bilibili', note: 'HR全栈系统课' }
    ],
    docs: [
      { title: '人力资源管理（中央财经大学）', url: 'https://higher.smartedu.cn/course/6a98a49db44e493c7673a194', source: '国家高等教育智慧教育平台', note: '人才吸纳、激励与绩效系统课' },

      { title: 'reddit · r/AskHR', url: 'https://www.reddit.com/r/AskHR/', source: '行业社区', note: 'HR问答社区', kind: 'community' }
    ],
  },
  '员工关系经理': {
    books: [
      { title: '非暴力沟通', author: '马歇尔·卢森堡', why: '员工沟通的经典' },
      { title: '中华人民共和国劳动合同法', author: '全国人民代表大会常务委员会', why: '员工关系管理的法律依据' },
    ],
    videos: [
      { title: 'HR劳动关系管理必备：三小时拿捏劳动合同法', url: 'https://www.bilibili.com/video/BV1No4y1Y7SM', source: 'Bilibili', note: '劳动关系法律课' },
    ],
    docs: [
      { title: 'HRoot · 员工关系与劳动关系', url: 'https://www.hroot.com/', source: '行业社区', note: 'HR内容与活动平台', kind: 'community' },
{ title: 'CIPD（英国特许人事与发展协会）', url: 'https://www.cipd.org/', source: 'CIPD', note: '员工关系与劳资实践研究' }],
  },
  '薪酬福利经理': {
    books: [
      { title: '薪酬管理', author: '乔治·米尔科维奇', why: '薪酬体系的标准教材' },
      { title: '原则', author: '瑞·达利欧', why: '薪酬与绩效文化' },
    ],
    videos: [
      { title: '企业薪酬体系设计技巧（152分钟）', url: 'https://www.bilibili.com/video/BV1RM9CB5EpA', source: 'Bilibili', note: '薪酬设计系统课' },
    ],
    docs: [
      { title: 'reddit · r/careers', url: 'https://www.reddit.com/r/careers/', source: '行业社区', note: '职场发展社区', kind: 'community' },
{ title: '中华人民共和国人力资源和社会保障部', url: 'https://www.mohrss.gov.cn/', source: '人社部', note: '国内薪酬福利与社保政策' }],
  },
  '总经理助理': {
    books: [
      { title: '卓有成效的管理者', author: '彼得·德鲁克', why: '管理者的永恒经典' },
      { title: '高效能人士的七个习惯', author: '史蒂芬·柯维', why: '职业化素养根基' },
    ],
    docs: [
      { title: 'reddit · r/leadership', url: 'https://www.reddit.com/r/leadership/', source: '行业社区', note: '领导力社区', kind: 'community' },

      { title: '组织行为学（四川大学）', url: 'https://higher.smartedu.cn/course/6986692295df98bb27d90d46', source: '智慧教育平台', note: '个体/群体/领导/组织文化的理论框架' },
    ],
    videos: [{ title: 'Leadership Essentials（领导力基础）', url: 'https://www.coursera.org/learn/leadership-essentials', source: 'Coursera', note: '管理与领导力入门' }],
  },
};
