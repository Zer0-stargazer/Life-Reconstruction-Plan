import type { CareerResourceSet } from '../career-resources';

export const supplementResources03: Record<string, CareerResourceSet> = {
  '远程办公管理专家': {
    videos: [
      { title: 'Project Management Principles and Practices（项目管理原理与实践）', url: 'https://www.edx.org/learn/project-management', source: 'edX', note: '英文，项目管理基础，适用于分布式团队协作' }
    ],
    docs: [
      { title: '人力资源管理（北京科技大学）', url: 'https://higher.smartedu.cn/course/62354d629906eace049031ef', source: '国家高等教育智慧教育平台', note: '招聘甄选与绩效管理工具' },

      { title: 'reddit · r/digitalnomad', url: 'https://www.reddit.com/r/digitalnomad/', source: '行业社区', note: '数字游民社区', kind: 'community' }
    ],
    books: [
      { title: '每周工作4小时', author: '蒂莫西·费里斯', why: '远程与效率经典' },
{ title: 'Remote: Office Not Required（远程：办公室可以不要）', author: 'Jason Fried, David Heinemeier Hansson', why: '远程团队管理的经典实践总结' }],
  },
  'CNC五轴编程工程师': {
    books: [
      { title: '机械制造工艺学', author: '王先逵', why: '切削加工与工艺规程的根基' },
      { title: '机械设计手册', author: '成大先', why: '加工参数与标准件查询工具书' },
    ],
    videos: [
      { title: '数控车床编程基础教程', url: 'https://www.bilibili.com/video/BV1AdXKB9E7z', source: 'Bilibili', note: '数控编程入门' },
    ],
    docs: [
      { title: 'reddit · r/Machinists', url: 'https://www.reddit.com/r/Machinists/', source: '行业社区', note: '机加工技师全球社区', kind: 'community' },

      { title: '中华人民共和国人力资源和社会保障部', url: 'https://www.mohrss.gov.cn', source: '官方文档', note: '职业技能标准与职业分类的官方查询入口' },
    ],
  },
  '陪诊师': {
    books: [
      { title: '最好的告别', author: '阿图·葛文德', why: '老年关怀与临终照护的必读经典' },
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '居家养老照护的理念之作' }
    ],
    videos: [
      { title: '养老护理员基础知识（初中高级·国家职业资格）', url: 'https://www.bilibili.com/video/BV1iSeFeuErF', source: 'Bilibili', note: '养老护理考证课' }
    ],
    docs: [
      { title: '护理学导论（西安交通大学）', url: 'https://www.icourse163.org/course/-1456748161', source: '中国大学MOOC', note: '护理程序与健康管理基础' },

      { title: 'reddit · r/eldercare', url: 'https://www.reddit.com/r/eldercare/', source: '行业社区', note: '养老照护全球社区', kind: 'community' }
    ],
  },
  '宠物殡葬师': {
    books: [
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '临终陪伴服务的范式参考' },
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '人与动物情感联结的经典' }
    ],
    videos: [
      { title: '宠物殡葬行业揭秘', url: 'https://www.bilibili.com/video/BV1iJ4m1G7kJ', source: 'Bilibili', note: '宠物殡葬行业认知' }
    ],
    docs: [
      { title: '宠物美容与护理（上海农林职业技术学院）', url: 'https://www.icourse163.org/course/SHISU-1462073161', source: '中国大学MOOC', note: '宠物护理岗位全程课' },

      { title: 'reddit · r/Petloss', url: 'https://www.reddit.com/r/Petloss/', source: '行业社区', note: '宠物离世抚慰社区', kind: 'community' }
    ],
  },
  // 2026-10-12 AI配音工程师 / 体育赛事解说员 已迁到 resources/media.ts 重配专属资源，此处删除避免覆盖。
  '碳汇开发经理': {
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: 'Climate Change（气候变化）', url: 'https://www.edx.org/learn/climate-change', source: 'edX', note: '英文，气候科学与应对基础' },
      { title: 'Sustainability（可持续发展）', url: 'https://www.edx.org/learn/sustainability', source: 'edX', note: '英文，可持续发展理念与实践' },
    ],
    docs: [
      { title: 'reddit · r/Environment', url: 'https://www.reddit.com/r/Environment/', source: '行业社区', note: '环境议题社区', kind: 'community' },

      { title: '全国碳排放权交易市场', url: 'https://www.cnemc.cn', source: '官方文档', note: '全国碳市场及碳排放核算相关信息' },
      { title: '生态环境部', url: 'https://www.mee.gov.cn', source: '官方文档', note: '碳汇方法学与生态保护政策发布' },
    ],
  },
  '初级量化分析师': {
    videos: [
      { title: 'Financial Engineering and Risk Management Part I（金融工程与风险管理 第一部分）', url: 'https://www.coursera.org/learn/financial-engineering-1', source: 'Coursera', note: '英文，衍生品定价与金融工程基础' },
      { title: 'Financial Markets（金融市场，耶鲁大学）', url: 'https://www.coursera.org/learn/financial-markets-global', source: 'Coursera', note: '英文，金融市场结构与运行机制' },
    ],
    docs: [
      { title: '聚宽量化社区', url: 'https://www.joinquant.com/', source: '行业社区', note: '国内量化研究社区，策略与因子讨论', kind: 'community' },

      { title: 'BigQuant（AI量化社区）', url: 'https://bigquant.com/', source: '行业社区', note: '量化平台社区，策略与数据集共享', kind: 'community' },

      { title: 'MIT OCW 15.401 Finance Theory I（麻省理工金融理论 I）', url: 'https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/', source: 'MIT OCW', note: '英文，免费公开课件，金融理论基础' },
    ],
    books: [
      { title: '打开量化投资的黑箱', author: '里纳尔迪', why: '量化策略从数据到执行的完整链条' },
{ title: 'Python金融大数据分析（Python for Finance）', author: 'Yves Hilpisch', why: '用 Python 实现金融数据分析与量化策略' }],
  },
  '高级量化分析师': {
    videos: [
      { title: 'Financial Engineering and Risk Management Part I（金融工程与风险管理 第一部分）', url: 'https://www.coursera.org/learn/financial-engineering-1', source: 'Coursera', note: '英文，衍生品与风险管理' },
    ],
    docs: [
      { title: '聚宽量化社区', url: 'https://www.joinquant.com/', source: '行业社区', note: '国内量化研究社区，策略与因子讨论', kind: 'community' },

      { title: 'reddit · r/algotrading', url: 'https://www.reddit.com/r/algotrading/', source: '行业社区', note: '算法交易与量化策略讨论', kind: 'community' },

      { title: 'MIT OCW 15.401 Finance Theory I（麻省理工金融理论 I）', url: 'https://ocw.mit.edu/courses/15-401-finance-theory-i-fall-2008/', source: 'MIT OCW', note: '英文，金融理论进阶' },
    ],
    books: [
      { title: '打开量化投资的黑箱', author: '里纳尔迪', why: '量化策略从数据到执行的完整链条' },
{ title: 'Options, Futures, and Other Derivatives（期权、期货及其他衍生品）', author: 'John C. Hull', why: '衍生品定价领域的标准教材' }],
  },
  '初级投资银行家': {
    books: [
      { title: '投资银行：估值、杠杆收购、兼并与收购', author: '乔舒亚·罗森鲍姆', why: '投行估值与交易实务的操作手册' },
      { title: '门口的野蛮人', author: '布赖恩·伯勒', why: '杠杆收购史上的经典实录' },
    ],
    videos: [
      { title: 'Introduction to Finance（金融学导论）', url: 'https://www.edx.org/learn/finance', source: 'edX', note: '英文，公司金融与投资基础' },
      { title: 'Banking and Financial Institutions（银行与金融机构）', url: 'https://www.edx.org/learn/banking', source: 'edX', note: '英文，金融机构运作' },
    ],
    docs: [
      { title: 'reddit · r/stocks', url: 'https://www.reddit.com/r/stocks/', source: '行业社区', note: '股票投资讨论', kind: 'community' },

      { title: 'reddit · r/CryptoMarkets', url: 'https://www.reddit.com/r/CryptoMarkets/', source: '行业社区', note: '加密市场讨论', kind: 'community' },

      { title: 'CFA Institute 项目介绍', url: 'https://www.cfainstitute.org/en/programs/cfa-program', source: 'CFA Institute', note: '金融分析专业认证，覆盖估值与公司金融' },
    ],
  },
  '高级投资银行家': {
    videos: [
      { title: 'Banking and Financial Institutions（银行与金融机构）', url: 'https://www.edx.org/learn/banking', source: 'edX', note: '英文，资本市场与金融机构' }
    ],
    docs: [
      { title: '投资银行学', url: 'https://www.icourse163.org/course/-1449724164', source: '中国大学MOOC', note: 'IPO、并购与资产证券化全程课' },

      { title: 'reddit · r/stocks', url: 'https://www.reddit.com/r/stocks/', source: '行业社区', note: '股票投资讨论', kind: 'community' },

      { title: 'reddit · r/CryptoMarkets', url: 'https://www.reddit.com/r/CryptoMarkets/', source: '行业社区', note: '加密市场讨论', kind: 'community' }
    ],
    books: [
      { title: '投资银行：估值、杠杆收购、兼并与收购', author: '乔舒亚·罗森鲍姆', why: '投行估值与交易实务的操作手册' },
{ title: 'Investment Banking: Valuation, LBOs, M&A, and IPOs（投资银行：估值、杠杆收购、并购与首次公开募股）', author: 'Joshua Rosenbaum, Joshua Pearl', why: '投行估值与交易流程的实务经典' }],
  },
  '初级精算师': {
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },
      { title: '概率论与数理统计', author: '盛骤', why: '精算数学的概率论基础' }
    ],
    videos: [
      { title: 'Risk Management（风险管理）', url: 'https://www.edx.org/learn/risk-management', source: 'edX', note: '英文，风险识别与度量基础' },
      { title: 'Statistics（统计学）', url: 'https://www.edx.org/learn/statistics', source: 'edX', note: '英文，概率与统计基础，精算考试核心' }
    ],
    docs: [
      { title: 'reddit · r/actuary', url: 'https://www.reddit.com/r/actuary/', source: '行业社区', note: '精算师考试与职业社区', kind: 'community' },

      { title: 'Casualty Actuarial Society（美国意外险精算学会）', url: 'https://www.casact.org/', source: '官方文档', note: '非寿险精算考试与资料' }
    ],
  },
  '高级精算师': {
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },
      { title: '概率论与数理统计', author: '盛骤', why: '精算数学的概率论基础' }
    ],
    videos: [
      { title: '精算学：从入门到精通（央财）', url: 'https://www.bilibili.com/video/BV1Kg4y1v7HR', source: 'Bilibili', note: '精算学科系统课' },


    ],
    docs: [
      { title: '保险学（首都经济贸易大学）', url: 'https://higher.smartedu.cn/course/673bce0f16d8a05eed6525ce', source: '国家高等教育智慧教育平台', note: '保险定价原理与费率厘定' },

      { title: 'reddit · r/InsuranceAgent', url: 'https://www.reddit.com/r/InsuranceAgent/', source: '行业社区', note: '保险从业与承保讨论', kind: 'community' }
    ],
  },
  '初级基金经理': {
    books: [
      { title: '共同基金常识', author: '约翰·博格', why: '指数化投资与基金运作的底层逻辑' },
      { title: '投资学', author: '兹维·博迪', why: '资产定价与组合理论教科书' },
    ],
    videos: [
      { title: 'Investment Management（投资管理）', url: 'https://www.coursera.org/learn/investment-management', source: 'Coursera', note: '英文，资产配置与投资组合管理' },
    ],
    docs: [
      { title: 'reddit · r/valueinvesting', url: 'https://www.reddit.com/r/valueinvesting/', source: '行业社区', note: '价值投资讨论社区', kind: 'community' },


      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn', source: '官方文档', note: '基金从业资格与行业规范' },
      { title: '中国证券监督管理委员会', url: 'https://www.csrc.gov.cn', source: '官方文档', note: '公募基金监管法规' },
    ],
  },
  '高级基金经理': {
    books: [
      { title: '共同基金常识', author: '约翰·博格', why: '指数化投资与基金运作的底层逻辑' },
      { title: '投资学', author: '兹维·博迪', why: '资产定价与组合理论教科书' }
    ],
    videos: [
      { title: 'Investment Management（投资管理）', url: 'https://www.coursera.org/learn/investment-management', source: 'Coursera', note: '英文，投资组合理论与绩效评估' }
    ],
    docs: [
      { title: 'reddit · r/valueinvesting', url: 'https://www.reddit.com/r/valueinvesting/', source: '行业社区', note: '价值投资讨论社区', kind: 'community' },

      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn', source: '官方文档', note: '基金行业自律规则与登记备案' }
    ],
  },
  '初级风险分析师': {
    books: [
      { title: '风险管理与金融机构', author: '约翰·赫尔', why: '风险度量与管理体系的标准框架' },
      { title: '打开量化投资的黑箱', author: '里纳尔迪', why: '理解模型驱动的风险决策' },
    ],
    videos: [
      { title: 'Risk Management（风险管理）', url: 'https://www.edx.org/learn/risk-management', source: 'edX', note: '英文，风险管理框架' },
    ],
    docs: [
      { title: '淘股吧', url: 'https://www.taoguba.com.cn/', source: '行业社区', note: '交易者社区', kind: 'community' },


      { title: 'Basel III 框架（巴塞尔委员会）', url: 'https://www.bis.org/bcbs/basel3.htm', source: 'BIS', note: '银行监管资本与风险管理标准' },
      { title: '金融稳定理事会（FSB）', url: 'https://www.fsb.org/', source: '官方文档', note: '全球金融稳定与系统性风险政策' },
    ],
  },
  '高级风险分析师': {
    videos: [
      { title: 'FRM一级基础精讲', url: 'https://www.bilibili.com/video/BV1uT421D7j5', source: 'Bilibili', note: '风险管理国际认证体系课' },


    ],
    docs: [
      { title: '网易财经', url: 'https://money.163.com/', source: '行业社区', note: '财经资讯与市场评论', kind: 'community' },


      { title: 'Basel III 框架（巴塞尔委员会）', url: 'https://www.bis.org/bcbs/basel3.htm', source: 'BIS', note: '资本充足率与流动性风险标准' }
    ],
    books: [
      { title: '风险管理与金融机构', author: '约翰·赫尔', why: '风险度量与管理体系的标准框架' },
{ title: 'Options, Futures, and Other Derivatives（期权、期货及其他衍生品）', author: 'John C. Hull', why: '市场风险与衍生品对冲的标准教材' }],
  },
  '初级金融科技产品经理': {
    books: [
      { title: '银行4.0', author: '布雷特·金', why: '金融服务数字化的演进方向' },
      { title: '启示录：打造用户喜爱的产品', author: '马蒂·卡根', why: '产品经理方法论经典' },
    ],
    videos: [
      { title: 'FinTech（金融科技）', url: 'https://www.edx.org/learn/fintech', source: 'edX', note: '英文，金融科技行业概览' },
    ],
    docs: [
      { title: '智通财经', url: 'https://www.zhitongcaijing.com/', source: '行业社区', note: '港股与全球市场资讯', kind: 'community' },

      { title: 'reddit · r/personalfinance', url: 'https://www.reddit.com/r/personalfinance/', source: '行业社区', note: '个人理财讨论', kind: 'community' },

      { title: '中国人民银行', url: 'https://www.pbc.gov.cn', source: '官方文档', note: '金融科技监管与支付清算政策' },
    ],
  },
  '高级金融科技产品经理': {
    books: [
      { title: '银行4.0', author: '布雷特·金', why: '金融服务数字化的演进方向' },
      { title: '启示录：打造用户喜爱的产品', author: '马蒂·卡根', why: '产品经理方法论经典' }
    ],
    videos: [
      { title: 'FinTech（金融科技）', url: 'https://www.edx.org/learn/fintech', source: 'edX', note: '英文，金融科技产品与监管' }
    ],
    docs: [
      { title: '互联网金融（西南财经大学）', url: 'https://www.chinaooc.com.cn/course/67c8de8a225d72705e9b81be', source: '国家高等教育智慧教育平台', note: '网络支付、网贷与众筹的系统课' },
      { title: '智通财经', url: 'https://www.zhitongcaijing.com/', source: '行业社区', note: '港股与全球市场资讯', kind: 'community' },

      { title: 'reddit · r/personalfinance', url: 'https://www.reddit.com/r/personalfinance/', source: '行业社区', note: '个人理财讨论', kind: 'community' }
    ],
  },
  '初级保险精算师': {
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },
      { title: '概率论与数理统计', author: '盛骤', why: '精算数学的概率论基础' },
    ],
    videos: [
      { title: 'Risk Management（风险管理）', url: 'https://www.edx.org/learn/risk-management', source: 'edX', note: '英文，保险风险识别与度量' },
    ],
    docs: [
      { title: 'reddit · r/InsuranceAgent', url: 'https://www.reddit.com/r/InsuranceAgent/', source: '行业社区', note: '保险从业与承保讨论', kind: 'community' },


      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn', source: '官方文档', note: '保险监管法规与偿付能力制度' },
      { title: 'Society of Actuaries（北美精算师协会）', url: 'https://www.soa.org/', source: '官方文档', note: '精算考试体系' },
    ],
  },
  '高级保险精算师': {
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },
      { title: '概率论与数理统计', author: '盛骤', why: '精算数学的概率论基础' }
    ],
    videos: [
      { title: '中国精算师考试科目一备考技巧', url: 'https://www.bilibili.com/video/BV1d1421C7c8', source: 'Bilibili', note: '精算考试科目与方法' }
    ],
    docs: [
      { title: 'reddit · r/InsuranceAgent', url: 'https://www.reddit.com/r/InsuranceAgent/', source: '行业社区', note: '保险从业与承保讨论', kind: 'community' },

      { title: 'Casualty Actuarial Society（美国意外险精算学会）', url: 'https://www.casact.org/', source: '官方文档', note: '非寿险精算研究资料' }
    ],
  },
  '初级私人银行经理': {
    books: [
      { title: '聪明的投资者', author: '格雷厄姆', why: '服务客户资产配置的价值根基' },
      { title: '投资最重要的事', author: '霍华德·马克斯', why: '财富保值的风险与周期心法' },
    ],
    videos: [
      { title: 'Investment Management（投资管理）', url: 'https://www.coursera.org/learn/investment-management', source: 'Coursera', note: '英文，财富管理与资产配置' },
    ],
    docs: [
      { title: 'reddit · r/financialindependence', url: 'https://www.reddit.com/r/financialindependence/', source: '行业社区', note: '财富管理与财务自由社区', kind: 'community' },


      { title: 'CFA Institute 项目介绍', url: 'https://www.cfainstitute.org/en/programs/cfa-program', source: 'CFA Institute', note: '财富管理与投资顾问专业认证' },
    ],
  },
  '高级私人银行经理': {
    books: [
      { title: '聪明的投资者', author: '格雷厄姆', why: '服务客户资产配置的价值根基' },
      { title: '投资最重要的事', author: '霍华德·马克斯', why: '财富保值的风险与周期心法' }
    ],
    videos: [
      { title: '银行管理精讲（新版）', url: 'https://www.bilibili.com/video/BV1TrMM6dENH', source: 'Bilibili', note: '银行财富管理条线系统课' },


    ],
    docs: [
      { title: 'reddit · r/Bogleheads', url: 'https://www.reddit.com/r/Bogleheads/', source: '行业社区', note: '长期财富管理社区', kind: 'community' },


      { title: '中国证券业协会', url: 'https://www.sac.net.cn', source: '官方文档', note: '证券与财富管理行业规范' }
    ],
  },
  '初级信贷审核师': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' },
    ],
    videos: [
      { title: 'Banking and Financial Institutions（银行与金融机构）', url: 'https://www.edx.org/learn/banking', source: 'edX', note: '英文，银行信贷业务基础' },
    ],
    docs: [
      { title: 'reddit · r/CRedit', url: 'https://www.reddit.com/r/CRedit/', source: '行业社区', note: '个人信用专门社区', kind: 'community' },


      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn', source: '官方文档', note: '银行业信贷监管规定' },
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn', source: '官方文档', note: '征信与货币信贷政策' },
    ],
  },
  '高级信贷审核师': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '银行从业《公司信贷》精讲', url: 'https://www.bilibili.com/video/BV1mB4y1u7gu', source: 'Bilibili', note: '信贷审查审批全流程系统课' },
    ],
    docs: [
      { title: 'reddit · r/CRedit', url: 'https://www.reddit.com/r/CRedit/', source: '行业社区', note: '个人信用专门社区', kind: 'community' },


      { title: 'Basel III 框架（巴塞尔委员会）', url: 'https://www.bis.org/bcbs/basel3.htm', source: 'BIS', note: '信用风险资本计量标准' }
    ],
  },
  '初级外汇交易员': {
    books: [
      { title: '日本蜡烛图技术', author: '史蒂夫·尼森', why: '外汇技术分析的形态字典' },
      { title: '交易心理分析', author: '马克·道格拉斯', why: '交易纪律与心理管理' },
    ],
    videos: [
      { title: 'Financial Markets（金融市场，耶鲁大学）', url: 'https://www.coursera.org/learn/financial-markets-global', source: 'Coursera', note: '英文，外汇与利率市场基础' },
    ],
    docs: [
      { title: 'reddit · r/Forex', url: 'https://www.reddit.com/r/Forex/', source: '行业社区', note: '外汇交易全球社区', kind: 'community' },


      { title: '国家外汇管理局', url: 'https://www.safe.gov.cn', source: '官方文档', note: '外汇管理法规与政策' },
    ],
  },
  '高级外汇交易员': {
    videos: [
      { title: 'Financial Engineering and Risk Management Part I（金融工程与风险管理 第一部分）', url: 'https://www.coursera.org/learn/financial-engineering-1', source: 'Coursera', note: '英文，外汇衍生品定价' },
    ],
    docs: [
      { title: 'reddit · r/Forex', url: 'https://www.reddit.com/r/Forex/', source: '行业社区', note: '外汇交易全球社区', kind: 'community' },


      { title: '国家外汇管理局', url: 'https://www.safe.gov.cn', source: '官方文档', note: '跨境资金与外汇市场监管' },
    ],
    books: [
      { title: '日本蜡烛图技术', author: '史蒂夫·尼森', why: '外汇技术分析的形态字典' },
{ title: 'Options, Futures, and Other Derivatives（期权、期货及其他衍生品）', author: 'John C. Hull', why: '外汇期权与远期合约定价的标准教材' }],
  },
  '初级临床医生': {
    books: [
      { title: '诊断学', author: '万学红', why: '问诊查体与临床思维的根基教材' },
      { title: '默克家庭诊疗手册', author: '默克公司', why: '全科视角的疾病诊疗权威参考' },
    ],
    videos: [
      { title: 'Medicine（医学）', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '英文，医学基础课程合集' },
    ],
    docs: [
      { title: 'reddit · r/medicine', url: 'https://www.reddit.com/r/medicine/', source: '行业社区', note: '临床医生全球社区', kind: 'community' },

      { title: '世界卫生组织出版物', url: 'https://www.who.int/publications', source: 'WHO', note: '临床指南与公共卫生出版物' },
    ],
  },
  '高级临床医生': {
    books: [
      { title: '诊断学', author: '万学红', why: '问诊查体与临床思维的根基教材' },
      { title: '默克家庭诊疗手册', author: '默克公司', why: '全科视角的疾病诊疗权威参考' }
    ],
    videos: [
      { title: '临床思维能力训练', url: 'https://www.bilibili.com/video/BV1WkL9zEEtC', source: 'Bilibili', note: '临床决策与诊疗思维' },


    ],
    docs: [
      { title: '丁香园（医者社区）', url: 'https://www.dxy.cn/', source: '行业社区', note: '国内医生聚集地，病例与指南讨论', kind: 'community' },

      { title: '世界卫生组织出版物', url: 'https://www.who.int/publications', source: 'WHO', note: '循证临床指南' }
    ],
  },
  '初级心理咨询师': {
    books: [
      { title: '心理咨询与治疗的理论及实践', author: '杰拉德·科里', why: '咨询流派与技术的体系化教材' },
      { title: '登天的感觉', author: '岳晓东', why: '心理咨询案例的通俗入门' },
    ],
    videos: [
      { title: 'Introduction to Psychology（心理学导论）', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '英文，心理学基础' },
      { title: 'Mental Health（心理健康）', url: 'https://www.edx.org/learn/mental-health', source: 'edX', note: '英文，心理健康知识与干预' },
    ],
    docs: [
      { title: 'reddit · r/psychotherapy', url: 'https://www.reddit.com/r/psychotherapy/', source: '行业社区', note: '心理治疗师全球社区', kind: 'community' },

      { title: '中国心理学会', url: 'https://www.cpsbeijing.org/', source: '官方文档', note: '心理学学术与职业规范' },
    ],
  },
  '高级心理咨询师': {
    books: [
      { title: '心理咨询与治疗的理论及实践', author: '杰拉德·科里', why: '咨询流派与技术的体系化教材' },
      { title: '登天的感觉', author: '岳晓东', why: '心理咨询案例的通俗入门' },
    ],
    videos: [
      { title: 'Mental Health（心理健康）', url: 'https://www.edx.org/learn/mental-health', source: 'edX', note: '英文，心理评估与干预进阶' },
    ],
    docs: [
      { title: 'reddit · r/psychotherapy', url: 'https://www.reddit.com/r/psychotherapy/', source: '行业社区', note: '心理治疗师全球社区', kind: 'community' },

      { title: '中国心理学会', url: 'https://www.cpsbeijing.org/', source: '官方文档', note: '心理咨询伦理与职业规范' },
    ],
  },
  '初级药剂师': {
    books: [
      { title: '药理学', author: '朱依谆', why: '药物作用机制的人卫标准教材' },
      { title: '药学综合知识与技能', author: '国家药监局执业药师资格认证中心', why: '执业药师实务的官方教材' },
    ],
    videos: [
      { title: '药理学', url: 'https://www.bilibili.com/video/BV1bP4y1P76R', source: 'Bilibili', note: '药物作用机制的体系课' },
    ],
    docs: [
      { title: 'reddit · r/pharmacy', url: 'https://www.reddit.com/r/pharmacy/', source: '行业社区', note: '药师全球社区', kind: 'community' },

      { title: '中国药典（国家药典委员会）', url: 'https://www.chp.org.cn/', source: '官方文档', note: '药品标准与用药规范' },
      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn', source: '官方文档', note: '药品注册与监管政策' },
    ],
  },
  '高级药剂师': {
    books: [
      { title: '药理学', author: '朱依谆', why: '药物作用机制的人卫标准教材' },
      { title: '药学综合知识与技能', author: '国家药监局执业药师资格认证中心', why: '执业药师实务的官方教材' }
    ],
    videos: [
      { title: '临床药学副高精讲', url: 'https://www.bilibili.com/video/BV1EnGtzdEbz', source: 'Bilibili', note: '临床药学高级职称全程课' },


    ],
    docs: [
      { title: 'reddit · r/pharmacy', url: 'https://www.reddit.com/r/pharmacy/', source: '行业社区', note: '药师全球社区', kind: 'community' },

      { title: '中国药典（国家药典委员会）', url: 'https://www.chp.org.cn/', source: '官方文档', note: '药品质量标准' },
      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn', source: '官方文档', note: '药品监管与临床用药政策' }
    ],
  },
  '初级医学影像AI工程师': {
    books: [
      { title: '深度学习', author: '伊恩·古德费洛', why: '医学影像AI的算法根基' },
      { title: '基因传', author: '悉达多·穆克吉', why: '基因组数据与临床AI的叙事背景' },
    ],
    videos: [
      { title: 'AI For Medical Diagnosis（医学诊断中的人工智能）', url: 'https://www.coursera.org/learn/ai-for-medical-diagnosis', source: 'Coursera', note: '英文，医学影像AI入门' },
      { title: 'Artificial Intelligence（人工智能）', url: 'https://www.edx.org/learn/artificial-intelligence', source: 'edX', note: '英文，AI 基础' },
    ],
    docs: [
      { title: 'reddit · r/bioinformatics', url: 'https://www.reddit.com/r/bioinformatics/', source: '行业社区', note: '医学AI与生信交叉社区', kind: 'community' },

      { title: 'RSNA 北美放射学会', url: 'https://www.rsna.org/', source: '官方文档', note: '医学影像学术资源与AI研究动态' },
      { title: 'PyTorch Tutorials（PyTorch 官方教程）', url: 'https://pytorch.org/tutorials/', source: '官方文档', note: '深度学习框架实践' },
    ],
  },
  '高级医学影像AI工程师': {
    videos: [
      { title: 'AI For Medical Diagnosis（医学诊断中的人工智能）', url: 'https://www.coursera.org/learn/ai-for-medical-diagnosis', source: 'Coursera', note: '英文，影像诊断模型应用' }
    ],
    docs: [
      { title: '梅斯医学', url: 'https://www.medsci.cn/', source: '行业社区', note: '医学前沿与AI进展资讯', kind: 'community' },

      { title: 'RSNA 北美放射学会', url: 'https://www.rsna.org/', source: '官方文档', note: '影像AI研究与临床应用文献' }
    ],
    books: [
      { title: '深度学习', author: '伊恩·古德费洛', why: '医学影像AI的算法根基' },
{ title: '深度学习（Deep Learning）', author: 'Ian Goodfellow, Yoshua Bengio, Aaron Courville', why: '深度学习理论基础，是影像模型研发的必备参考' }],
  },
};
