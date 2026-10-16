import type { CareerResourceSet } from '../career-resources';

export const financeResources: Record<string, CareerResourceSet> = {
  '精算师': {
    videos: [
      { title: '中国精算师科目一《概率论与数理统计》冲刺', url: 'https://www.bilibili.com/video/BV1mzuq6CEPA', source: 'Bilibili', note: '精算数学基础' }
    ],
    docs: [
      { title: 'reddit · r/insurance', url: 'https://www.reddit.com/r/insurance/', source: '行业社区', note: '保险行业从业者社区', kind: 'community' },

      { title: '美国精算学会（CAS）', url: 'https://www.casact.org/', source: '国际精算组织', note: '财产险与意外险精算方向' }
    ],
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },

      { title: 'Loss Models: From Data to Decisions', author: 'Klugman, Panjer, Willmot', why: '精算建模与损失分布的经典教材' }
    ],
  },
  '保险精算师': {
    videos: [
      { title: '中国精算师科目一《概率论与数理统计》冲刺', url: 'https://www.bilibili.com/video/BV1mzuq6CEPA', source: 'Bilibili', note: '精算数学基础' }
    ],
    docs: [
      { title: 'reddit · r/insurance', url: 'https://www.reddit.com/r/insurance/', source: '行业社区', note: '保险行业从业者社区', kind: 'community' },

      { title: '北美精算师协会（SOA）', url: 'https://www.soa.org/', source: '国际精算组织' }
    ],
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },

      { title: 'Loss Models: From Data to Decisions', author: 'Klugman, Panjer, Willmot', why: '保险损失建模的核心参考书' }
    ],
  },
  '保险精算定价师': {
    videos: [
      { title: '中国精算师考试科目一备考技巧', url: 'https://www.bilibili.com/video/BV1d1421C7c8', source: 'Bilibili', note: '精算考试科目与方法' }
    ],
    docs: [
      { title: '保险学（首都经济贸易大学）', url: 'https://higher.smartedu.cn/course/673bce0f16d8a05eed6525ce', source: '国家高等教育智慧教育平台', note: '保险定价原理与费率厘定' },

      { title: 'reddit · r/insurance', url: 'https://www.reddit.com/r/insurance/', source: '行业社区', note: '保险行业从业者社区', kind: 'community' }
    ],
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },

      { title: 'Loss Models: From Data to Decisions', author: 'Klugman, Panjer, Willmot', why: '定价所需的损失分布与风险建模基础' }
    ],
  },
  '保险产品精算': {
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },
      { title: '概率论与数理统计', author: '盛骤', why: '精算数学的概率论基础' },
    ],
    videos: [
      { title: '中国准精算师考试科目介绍', url: 'https://www.bilibili.com/video/BV1Wg411U7Xc', source: 'Bilibili', note: '准精算师考试体系' },
    ],
    docs: [
      { title: 'reddit · r/actuary', url: 'https://www.reddit.com/r/actuary/', source: '行业社区', note: '精算师考试与职业社区', kind: 'community' },


      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '保险产品审批与精算规定' },
    ],
  },
  '养老金精算师': {
    books: [
      { title: '保险学', author: '魏华林', why: '保险原理与市场的标准教材' },
      { title: '概率论与数理统计', author: '盛骤', why: '精算数学的概率论基础' }
    ],
    videos: [
      { title: '中国精算师科目一《概率论与数理统计》冲刺', url: 'https://www.bilibili.com/video/BV1mzuq6CEPA', source: 'Bilibili', note: '精算数学基础' }
    ],
    docs: [
      { title: 'reddit · r/actuary', url: 'https://www.reddit.com/r/actuary/', source: '行业社区', note: '精算师考试与职业社区', kind: 'community' },


      { title: '北美精算师协会（SOA）', url: 'https://www.soa.org/', source: '国际精算组织', note: '养老金与退休计划相关考试' }
    ],
  },
  '保险核保师': {
    books: [
      { title: '保险学', author: '魏华林', why: '承保与保险原理的标准教材' },
      { title: '风险管理与金融机构', author: '约翰·赫尔', why: '承保风险评估的体系框架' },
    ],
    videos: [
      { title: '保险核保与理赔：核保基础知识', url: 'https://www.bilibili.com/video/BV1n5411x7kQ', source: 'Bilibili', note: '核保实务课程' },
    ],
    docs: [
      { title: 'reddit · r/investing', url: 'https://www.reddit.com/r/investing/', source: '行业社区', note: '投资讨论全球社区', kind: 'community' },


      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '保险业务与承保规则监管' },
    ],
  },
  '保险科技产品经理': {
    books: [
      { title: '银行4.0', author: '布雷特·金', why: '金融服务数字化的演进方向' },
      { title: '启示录：打造用户喜爱的产品', author: '马蒂·卡根', why: '产品经理方法论经典' },
    ],
    videos: [
      { title: 'Fintech（金融科技）', url: 'https://www.coursera.org/learn/fintech', source: 'Coursera', note: '金融科技业务模式入门' },
    ],
    docs: [

      { title: 'reddit · r/fintech', url: 'https://www.reddit.com/r/fintech/', source: '行业社区', note: '金融科技产品与技术社区', kind: 'community' },

      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '保险科技与数字化监管要求' },
    ],
  },
  '金融科技产品经理': {
    books: [
      { title: '银行4.0', author: '布雷特·金', why: '金融服务数字化的演进方向' },
      { title: '启示录：打造用户喜爱的产品', author: '马蒂·卡根', why: '产品经理方法论经典' }
    ],
    videos: [
      { title: '金融科技（国科大·厦大）', url: 'https://www.bilibili.com/video/BV1QC4y1j7pr', source: 'Bilibili', note: '金融科技系统课' },


    ],
    docs: [
      { title: '金融科技与互联网金融（江苏服务职业技术学院）', url: 'https://www.icourse163.org/course/JSSVC-1207056805', source: '中国大学MOOC', note: '金融科技业态与监管全景课' },


      { title: 'reddit · r/fintech', url: 'https://www.reddit.com/r/fintech/', source: '行业社区', note: '金融科技产品与技术社区', kind: 'community' }
    ],
  },
  '支付系统架构师': {
    books: [
      { title: '支付战争', author: '埃里克·杰克逊', why: 'PayPal 早期支付创业实录' },
      { title: '银行4.0', author: '布雷特·金', why: '支付与银行服务的数字化演进' }
    ],
    videos: [
      { title: '支付行业知多少', url: 'https://www.bilibili.com/video/BV1jS4y1U7dt', source: 'Bilibili', note: '支付行业格局与链条' }
    ],
    docs: [
      { title: '互联网金融（西南财经大学）', url: 'https://www.icourse163.org/course/detail.htm?cid=1205780802', source: '中国大学MOOC', note: '网络支付、第三方支付与监管系统课' },

      { title: '华尔街见闻', url: 'https://wallstreetcn.com/', source: '行业社区', note: '全球市场资讯与讨论', kind: 'community' },

      { title: '财联社', url: 'https://www.cls.cn/', source: '行业社区', note: '支付行业监管快讯', kind: 'community' }
    ],
  },
  '支付产品经理': {
    books: [
      { title: '支付战争', author: '埃里克·杰克逊', why: 'PayPal 早期支付创业实录' },
      { title: '银行4.0', author: '布雷特·金', why: '支付与银行服务的数字化演进' }
    ],
    videos: [
      { title: 'Fintech（金融科技）', url: 'https://www.coursera.org/learn/fintech', source: 'Coursera', note: '支付与金融科技产品基础' }
    ],
    docs: [
      { title: '互联网金融（西南财经大学）', url: 'https://www.icourse163.org/course/detail.htm?cid=1205780802', source: '中国大学MOOC', note: '网络支付、第三方支付与监管系统课' },

      { title: '华尔街见闻', url: 'https://wallstreetcn.com/', source: '行业社区', note: '全球市场资讯与讨论', kind: 'community' },

      { title: '财联社', url: 'https://www.cls.cn/', source: '行业社区', note: '支付行业监管快讯', kind: 'community' }
    ],
  },
  '第三方支付运营': {
    books: [
      { title: '支付战争', author: '埃里克·杰克逊', why: 'PayPal 早期支付创业实录' },
      { title: '银行4.0', author: '布雷特·金', why: '支付与银行服务的数字化演进' }
    ],
    videos: [
      { title: '支付行业知多少', url: 'https://www.bilibili.com/video/BV1jS4y1U7dt', source: 'Bilibili', note: '支付行业格局与链条' }
    ],
    docs: [
      { title: '互联网金融（西南财经大学）', url: 'https://www.icourse163.org/course/detail.htm?cid=1205780802', source: '中国大学MOOC', note: '网络支付、第三方支付与监管系统课' },

      { title: '第一财经', url: 'https://www.yicai.com/', source: '行业社区', note: '财经资讯与市场解读', kind: 'community' },

      { title: 'reddit · r/valueinvesting', url: 'https://www.reddit.com/r/valueinvesting/', source: '行业社区', note: '价值投资讨论', kind: 'community' }
    ],
  },
  '跨境支付产品经理': {
    books: [
      { title: '支付战争', author: '埃里克·杰克逊', why: 'PayPal 早期支付创业实录' },
      { title: '银行4.0', author: '布雷特·金', why: '支付与银行服务的数字化演进' }
    ],
    videos: [
      { title: '尚硅谷：微信支付&支付宝支付开发', url: 'https://www.bilibili.com/video/BV1US4y1D77m', source: 'Bilibili', note: '支付系统技术实现' }
    ],
    docs: [
      { title: '每日经济新闻', url: 'https://www.nbd.com.cn/', source: '行业社区', note: '财经新闻与上市公司报道', kind: 'community' },

      { title: 'reddit · r/StockMarket', url: 'https://www.reddit.com/r/StockMarket/', source: '行业社区', note: '股市讨论社区', kind: 'community' },

      { title: '国家外汇管理局', url: 'https://www.safe.gov.cn/', source: '官方监管机构', note: '跨境收支与外汇管理规则' }
    ],
  },
  '私人银行经理': {
    books: [
      { title: '聪明的投资者', author: '格雷厄姆', why: '服务客户资产配置的价值根基' },
      { title: '投资最重要的事', author: '霍华德·马克斯', why: '财富保值的风险与周期心法' }
    ],
    videos: [
      { title: 'Personal Financial Planning（个人理财规划）', url: 'https://www.coursera.org/learn/financial-planning', source: 'Coursera', note: '个人财务规划基础' }
    ],
    docs: [
      { title: '个人理财', url: 'https://www.icourse163.org/course/-1464150162', source: '中国大学MOOC', note: '八大理财规划与资产配置' },

      { title: 'reddit · r/financialindependence', url: 'https://www.reddit.com/r/financialindependence/', source: '行业社区', note: '财富管理与财务自由社区', kind: 'community' }
    ],
  },
  '家族办公室经理': {
    books: [
      { title: '穷查理宝典', author: '查理·芒格', why: '家族长期投资的多元思维' },
      { title: '投资最重要的事', author: '霍华德·马克斯', why: '家族财富保值的风险观' }
    ],
    videos: [
      { title: '小Lin说：信托——金融理财圈最神奇的存在', url: 'https://www.bilibili.com/video/BV1f64y197hm', source: 'Bilibili', note: '家族财富工具科普' }
    ],
    docs: [
      { title: '个人理财业务（广州职业技术大学）', url: 'https://www.chinaooc.com.cn/course/68bca2429d83483b433474a7', source: '国家高等教育智慧教育平台', note: '客户财务诊断与理财方案设计' },

      { title: '每日经济新闻', url: 'https://www.nbd.com.cn/', source: '行业社区', note: '财经新闻与上市公司报道', kind: 'community' }
    ],
  },
  '信贷审核师': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '授信额度及审批、贷款审查要素', url: 'https://www.bilibili.com/video/BV11LMtzsE3o', source: 'Bilibili', note: '授信与审批要点' }
    ],
    docs: [
      { title: '商业银行业务与经营（南京审计大学）', url: 'https://higher.smartedu.cn/course/62354cb69906eace048d3f40', source: '国家高等教育智慧教育平台', note: '信贷流程与信用管理标准课' },

      { title: 'reddit · r/mortgages', url: 'https://www.reddit.com/r/mortgages/', source: '行业社区', note: '抵押贷款与房贷社区', kind: 'community' }
    ],
  },
  '小微金融风控': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '授信额度及审批、贷款审查要素', url: 'https://www.bilibili.com/video/BV11LMtzsE3o', source: 'Bilibili', note: '授信与审批要点' }
    ],
    docs: [
      { title: '商业银行业务与经营（南京审计大学）', url: 'https://higher.smartedu.cn/course/62354cb69906eace048d3f40', source: '国家高等教育智慧教育平台', note: '信贷流程与信用管理标准课' },

      { title: 'reddit · r/mortgages', url: 'https://www.reddit.com/r/mortgages/', source: '行业社区', note: '抵押贷款与房贷社区', kind: 'community' }
    ],
  },
  '消费金融产品经理': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '半佛：如何科学理解征信', url: 'https://www.bilibili.com/video/BV1kh411n7b9', source: 'Bilibili', note: '征信体系科普' }
    ],
    docs: [
      { title: '金融风险管理（东华大学）', url: 'https://www.icourse163.org/course/DHU-1002563001', source: '中国大学MOOC', note: '信用风险度量与各类风险管理' },

      { title: 'reddit · r/mortgages', url: 'https://www.reddit.com/r/mortgages/', source: '行业社区', note: '抵押贷款与房贷社区', kind: 'community' }
    ],
  },
  '小额贷款风控': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '授信额度及审批、贷款审查要素', url: 'https://www.bilibili.com/video/BV11LMtzsE3o', source: 'Bilibili', note: '授信与审批要点' }
    ],
    docs: [
      { title: '商业银行业务与经营（南京审计大学）', url: 'https://higher.smartedu.cn/course/62354cb69906eace048d3f40', source: '国家高等教育智慧教育平台', note: '信贷流程与信用管理标准课' },

      { title: 'reddit · r/credit', url: 'https://www.reddit.com/r/credit/', source: '行业社区', note: '信贷与个人信用讨论', kind: 'community' }
    ],
  },
  '助学贷款产品经理': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '个人征信解读', url: 'https://www.bilibili.com/video/BV1fY1FYJEU1', source: 'Bilibili', note: '征信报告逐项解读' }
    ],
    docs: [
      { title: '金融风险管理（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1466015170', source: '中国大学MOOC', note: '风险度量模型与巴塞尔监管框架' },

      { title: 'reddit · r/credit', url: 'https://www.reddit.com/r/credit/', source: '行业社区', note: '信贷与个人信用讨论', kind: 'community' }
    ],
  },
  '汽车金融经理': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '个人征信解读', url: 'https://www.bilibili.com/video/BV1fY1FYJEU1', source: 'Bilibili', note: '征信报告逐项解读' }
    ],
    docs: [
      { title: '金融风险管理（东华大学）', url: 'https://www.icourse163.org/course/DHU-1002563001', source: '中国大学MOOC', note: '信用风险度量与各类风险管理' },

      { title: 'reddit · r/debtfree', url: 'https://www.reddit.com/r/debtfree/', source: '行业社区', note: '负债管理与信贷讨论', kind: 'community' }
    ],
  },
  '信用修复顾问': {
    books: [
      { title: '邻家的百万富翁', author: '托马斯·斯坦利', why: '个人财富积累的实证研究' },
      { title: '漫步华尔街', author: '马尔基尔', why: '重建个人财务的理性框架' }
    ],
    videos: [
      { title: '个人征信解读', url: 'https://www.bilibili.com/video/BV1fY1FYJEU1', source: 'Bilibili', note: '征信报告逐项解读' }
    ],
    docs: [
      { title: '金融风险管理（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1466015170', source: '中国大学MOOC', note: '风险度量模型与巴塞尔监管框架' },

      { title: 'reddit · r/credit', url: 'https://www.reddit.com/r/credit/', source: '行业社区', note: '信用修复与个人信用讨论', kind: 'community' }
    ],
  },
  '征信数据分析': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '吴毅《信贷审查审批实务》', url: 'https://www.bilibili.com/video/BV1xQLtzjEbL', source: 'Bilibili', note: '信贷审查的实务课' }
    ],
    docs: [
      { title: '个人理财业务（广州职业技术大学）', url: 'https://www.chinaooc.com.cn/course/68bca2429d83483b433474a7', source: '国家高等教育智慧教育平台', note: '客户财务诊断与理财方案设计' },

      { title: 'reddit · r/debtfree', url: 'https://www.reddit.com/r/debtfree/', source: '行业社区', note: '负债管理与信贷讨论', kind: 'community' }
    ],
  },
  '金融风控建模师': {
    docs: [
      { title: 'reddit · r/quant', url: 'https://www.reddit.com/r/quant/', source: '行业社区', note: '风险建模与量化风险讨论', kind: 'community' },


      { title: '商业银行业务与经营（武汉理工大学）', url: 'https://higher.smartedu.cn/course/62354c7b9906eace048c4b48', source: '智慧教育平台', note: '含征信、大数据信用评估与开放银行专题' }
    ],
    videos: [
      { title: '金融风控与评分卡建模', url: 'https://www.bilibili.com/video/BV1RL8kzTErw', source: 'Bilibili', note: '信用评分卡与风控模型实战' },


    ],
    books: [
      { title: '风险管理与金融机构', author: '约翰·赫尔', why: '风险度量与管理体系的标准框架' },

      { title: 'Risk Management and Financial Institutions', author: 'John C. Hull', why: '金融机构风险建模与管理的经典教材' }
    ],
  },
  '金融科技风控建模': {
    docs: [
      { title: 'reddit · r/quant', url: 'https://www.reddit.com/r/quant/', source: '行业社区', note: '风险建模与量化风险讨论', kind: 'community' },


      { title: '商业银行业务与经营（武汉理工大学）', url: 'https://higher.smartedu.cn/course/62354c7b9906eace048c4b48', source: '智慧教育平台', note: '含征信、大数据信用评估与开放银行专题' },
    ],
    videos: [
      { title: 'Analytics of Finance（金融分析）', url: 'https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/index.htm', source: 'MIT OpenCourseWare', note: '金融建模与数据分析' },
    ],
    books: [
      { title: '风险管理与金融机构', author: '约翰·赫尔', why: '风险度量与管理体系的标准框架' },

      { title: 'Risk Management and Financial Institutions', author: 'John C. Hull', why: '风控模型与金融机构风险管理的核心参考' },
    ],
  },
  '金融数据分析师': {
    docs: [
      { title: 'reddit · r/quant', url: 'https://www.reddit.com/r/quant/', source: '行业社区', note: '金融数据分析讨论', kind: 'community' },

      { title: 'BigQuant（AI量化社区）', url: 'https://bigquant.com/', source: '行业社区', note: '金融数据与因子研究社区', kind: 'community' },

      { title: '公司金融（中国矿业大学）', url: 'https://www.icourse163.org/course/CUMT-1470645173', source: '中国大学MOOC', note: '金融数据分析的估值与资本结构基础' },
    ],
    videos: [
      { title: 'Analytics of Finance（金融分析）', url: 'https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/index.htm', source: 'MIT OpenCourseWare', note: '金融数据的统计与分析方法' },
    ],
    books: [
      { title: '打开量化投资的黑箱', author: '里纳尔迪', why: '金融数据到策略的转化路径' },

      { title: 'Advances in Financial Machine Learning', author: 'Marcos López de Prado', why: '金融数据中机器学习应用的前沿参考' },
    ],
  },
  '金融数学建模师': {
    docs: [
      { title: '每日经济新闻', url: 'https://www.nbd.com.cn/', source: '行业社区', note: '财经新闻与上市公司报道', kind: 'community' },

      { title: 'BigQuant（AI量化社区）', url: 'https://bigquant.com/', source: '行业社区', note: '量化建模与数据社区', kind: 'community' },

      { title: '公司金融（中国矿业大学）', url: 'https://www.icourse163.org/course/CUMT-1470645173', source: '中国大学MOOC', note: 'CAPM、APT 与资本结构的数理底盘' },
    ],
    videos: [
      { title: 'Analytics of Finance（金融分析）', url: 'https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/index.htm', source: 'MIT OpenCourseWare', note: '金融数学与建模基础' },
    ],
    books: [
      { title: '期权、期货及其他衍生品', author: '约翰·赫尔', why: '衍生品定价数学的行业标准教材' },

      { title: 'Advances in Financial Machine Learning', author: 'Marcos López de Prado', why: '金融数学建模与机器学习方法的结合' },
    ],
  },
  '外汇交易员': {
    videos: [
      { title: 'Derivative Securities（衍生证券）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/derivative-securities', source: 'Khan Academy', note: '远期、期货、期权等衍生工具入门' },
    ],
    docs: [
      { title: 'reddit · r/Forex', url: 'https://www.reddit.com/r/Forex/', source: '行业社区', note: '外汇交易全球社区', kind: 'community' },


      { title: '国家外汇管理局', url: 'https://www.safe.gov.cn/', source: '官方监管机构', note: '外汇市场管理与交易规则' },
    ],
    books: [
      { title: '日本蜡烛图技术', author: '史蒂夫·尼森', why: '外汇技术分析的形态字典' },

      { title: 'Options, Futures, and Other Derivatives', author: 'John C. Hull', why: '衍生品定价与风险对冲的经典教材' },
    ],
  },
  '期货交易员': {
    videos: [
      { title: 'Derivative Securities（衍生证券）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/derivative-securities', source: 'Khan Academy', note: '期货合约与套期保值原理' }
    ],
    docs: [
      { title: 'reddit · r/Daytrading', url: 'https://www.reddit.com/r/Daytrading/', source: '行业社区', note: '日内交易讨论社区', kind: 'community' },

      { title: '淘股吧', url: 'https://www.taoguba.com.cn/', source: '行业社区', note: '期货与商品交易者社区', kind: 'community' },

      { title: '上海期货交易所', url: 'https://www.shfe.com.cn/', source: '官方交易所', note: '期货品种与交易规则' }
    ],
    books: [
      { title: '期权、期货及其他衍生品', author: '约翰·赫尔', why: '期货定价与对冲的标准教材' },

      { title: 'Options, Futures, and Other Derivatives', author: 'John C. Hull', why: '期货与衍生品定价的标准教材' }
    ],
  },
  '债券交易员': {
    videos: [
      { title: 'Stocks and Bonds（股票与债券）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds', source: 'Khan Academy', note: '债券基本要素与估值' },
      { title: 'Interest（利率）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial', source: 'Khan Academy', note: '利率与债券价格关系' }
    ],
    docs: [
      { title: '公司金融（江西财经大学）', url: 'https://www.icourse163.org/course/JXUFE-1206455816', source: '中国大学MOOC', note: '债券估值与资本结构系统课' },

      { title: '集思录（低风险投资）', url: 'https://www.jisilu.cn/', source: '行业社区', note: '债券与固收策略社区', kind: 'community' },

      { title: 'reddit · r/bonds', url: 'https://www.reddit.com/r/bonds/', source: '行业社区', note: '债券市场讨论社区', kind: 'community' }
    ],
    books: [
      { title: '固定收益证券手册', author: '弗兰克·法博齐', why: '债券定价与组合的权威手册' },

      { title: 'Fixed Income Securities', author: 'Bruce Tuckman, Angel Serrat', why: '固定收益证券定价与风险的权威教材' }
    ],
  },
  '贵金属交易员': {
    books: [
      { title: '日本蜡烛图技术', author: '史蒂夫·尼森', why: '贵金属技术分析形态字典' },
      { title: '股票大作手回忆录', author: '埃德温·勒菲弗', why: '投机交易的传世经典' },
    ],
    videos: [
      { title: 'Derivative Securities（衍生证券）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/derivative-securities', source: 'Khan Academy', note: '商品衍生品与对冲基础' },
    ],
    docs: [
      { title: 'reddit · r/Daytrading', url: 'https://www.reddit.com/r/Daytrading/', source: '行业社区', note: '日内与商品交易讨论', kind: 'community' },

      { title: '淘股吧', url: 'https://www.taoguba.com.cn/', source: '行业社区', note: '贵金属交易者社区', kind: 'community' },

      { title: '上海期货交易所', url: 'https://www.shfe.com.cn/', source: '官方交易所', note: '黄金、白银等品种的交易规则' },
    ],
  },
  '税务规划师': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '税务与财报联动的实务基础' },
      { title: '置身事内', author: '兰小欢', why: '中国财税体制的运行逻辑' },
    ],
    videos: [
      { title: '个人所得税税务筹划', url: 'https://www.bilibili.com/video/BV1mpkMYEE7z', source: 'Bilibili', note: '个税筹划方法' },
    ],
    docs: [
      { title: '会计视野论坛', url: 'https://bbs.esnai.com/', source: '行业社区', note: '税务财会从业者社区', kind: 'community' },

      { title: 'reddit · r/tax', url: 'https://www.reddit.com/r/tax/', source: '行业社区', note: '税务规划讨论社区', kind: 'community' },

      { title: '国家税务总局', url: 'https://www.chinatax.gov.cn/', source: '官方税务机关', note: '税收政策与法规' },
      { title: '财政部', url: 'https://www.mof.gov.cn/', source: '官方部门', note: '财税政策发布' },
    ],
  },
  '资产估值师': {
    videos: [
      { title: 'DCF估值建模全流程', url: 'https://www.bilibili.com/video/BV1PxZeB2E1i', source: 'Bilibili', note: '从收入拆分到终值计算' },
    ],
    docs: [
      { title: 'reddit · r/SecurityAnalysis', url: 'https://www.reddit.com/r/SecurityAnalysis/', source: '行业社区', note: '基本面分析与估值讨论', kind: 'community' },


      { title: 'IFRS 国际财务报告准则', url: 'https://www.ifrs.org/issued-standards/list-of-standards/', source: '国际准则机构', note: '公允价值与资产计量准则' },
    ],
    books: [
      { title: '估值', author: '达摩达兰', why: '估值方法论体系化讲授' },

      { title: 'Valuation: Measuring and Managing the Value of Companies', author: 'Tim Koller 等', why: '企业估值方法的经典实务教材' },
    ],
  },
  '碳交易分析师': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳经济的技术与商业全景' },
      { title: '置身事内', author: '兰小欢', why: '理解中国政策驱动型碳市场' }
    ],
    videos: [
      { title: 'ESG', url: 'https://www.coursera.org/learn/esg', source: 'Coursera', note: 'ESG 与可持续金融基础' }
    ],
    docs: [
      { title: '区块链技术与应用（西南交通大学）', url: 'https://www.icourse163.org/course/SWJTU-1207109825', source: '中国大学MOOC', note: '数字资产与价值传递技术课' },

      { title: '东方财富股吧', url: 'https://guba.eastmoney.com/', source: '行业社区', note: '个股与市场讨论', kind: 'community' },

      { title: '雪球（投资者社区）', url: 'https://xueqiu.com/', source: '行业社区', note: '碳市场与绿色资产讨论', kind: 'community' }
    ],
  },
  '绿色金融分析师': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳经济的技术与商业全景' },
      { title: '置身事内', author: '兰小欢', why: '理解中国政策驱动型碳市场' }
    ],
    videos: [
      { title: 'ESG', url: 'https://www.coursera.org/learn/esg', source: 'Coursera', note: 'ESG 投资与绿色金融框架' }
    ],
    docs: [
      { title: '中央银行学（江西师范大学）', url: 'https://higher.smartedu.cn/course/697d1d7395df98bb27aea45e', source: '国家高等教育智慧教育平台', note: '央行制度、业务与宏观审慎政策' },

      { title: '东方财富股吧', url: 'https://guba.eastmoney.com/', source: '行业社区', note: '个股与市场讨论', kind: 'community' },

      { title: '雪球（投资者社区）', url: 'https://xueqiu.com/', source: '行业社区', note: '碳市场与绿色资产讨论', kind: 'community' }
    ],
  },
  '数字货币研究员': {
    videos: [
      { title: 'Blockchain Basics（区块链基础）', url: 'https://www.coursera.org/learn/blockchain-basics', source: 'Coursera', note: '区块链与数字资产原理' },
      { title: 'Cryptocurrency（加密货币）', url: 'https://www.coursera.org/learn/cryptocurrency', source: 'Coursera', note: '加密货币的经济与技术基础' }
    ],
    docs: [
      { title: '区块链技术与应用（西南交通大学）', url: 'https://www.icourse163.org/course/SWJTU-1207109825', source: '中国大学MOOC', note: '数字资产与价值传递技术课' },

      { title: 'reddit · r/Bitcoin', url: 'https://www.reddit.com/r/Bitcoin/', source: '行业社区', note: '比特币技术与市场社区', kind: 'community' }
    ],
    books: [
      { title: 'Blockchain Revolution', author: 'Don Tapscott, Alex Tapscott', why: '区块链技术与金融变革的通俗入门' },
      { title: '精通比特币', author: '安德烈亚斯·安东诺普洛斯', why: '区块链与数字资产技术原理的权威读本' }
    ],
  },
  '数字货币合规官': {
    books: [
      { title: '货币金融学', author: '米什金', why: '金融监管的货币银行学基础' },
      { title: '置身事内', author: '兰小欢', why: '中国金融监管体制的运行逻辑' }
    ],
    videos: [
      { title: 'Cryptocurrency（加密货币）', url: 'https://www.coursera.org/learn/cryptocurrency', source: 'Coursera', note: '加密资产的业务与风险基础' }
    ],
    docs: [
      { title: '会计视野论坛', url: 'https://bbs.esnai.com/', source: '行业社区', note: '合规与审计从业者社区', kind: 'community' },

      { title: '21财经', url: 'https://www.21jingji.com/', source: '行业社区', note: '财经深度报道', kind: 'community' },

      { title: '国际清算银行（BIS）', url: 'https://www.bis.org/', source: '国际机构', note: '全球央行数字货币研究' }
    ],
  },
  '金融监管科技': {
    books: [
      { title: '货币金融学', author: '米什金', why: '金融监管的货币银行学基础' },
      { title: '置身事内', author: '兰小欢', why: '中国金融监管体制的运行逻辑' }
    ],
    videos: [
      { title: '金融监管基础课', url: 'https://www.bilibili.com/video/BV1MJaUz2EnT', source: 'Bilibili', note: '监管框架与合规要点' },


    ],
    docs: [
      { title: '金融学（首都经济贸易大学）', url: 'https://higher.smartedu.cn/course/6ab054a3b44e493c76f833eb', source: '国家高等教育智慧教育平台', note: '银行监管与金融体系入门全景' },

      { title: '会计视野论坛', url: 'https://bbs.esnai.com/', source: '行业社区', note: '合规与审计从业者社区', kind: 'community' },

      { title: '21财经', url: 'https://www.21jingji.com/', source: '行业社区', note: '财经深度报道', kind: 'community' }
    ],
  },
  '金融监管政策研究员': {
    books: [
      { title: '货币金融学', author: '米什金', why: '金融监管的货币银行学基础' },
      { title: '置身事内', author: '兰小欢', why: '中国金融监管体制的运行逻辑' }
    ],
    videos: [
      { title: '反洗钱师·理论基础·实务指南', url: 'https://www.bilibili.com/video/BV1LiPvznEWE', source: 'Bilibili', note: '合规与反洗钱体系' }
    ],
    docs: [
      { title: '中央银行学（江西师范大学）', url: 'https://higher.smartedu.cn/course/697d1d7395df98bb27aea45e', source: '国家高等教育智慧教育平台', note: '央行制度、业务与宏观审慎政策' },

      { title: '集思录（低风险投资）', url: 'https://www.jisilu.cn/', source: '行业社区', note: '低风险投资与固收社区', kind: 'community' },

      { title: '21财经', url: 'https://www.21jingji.com/', source: '行业社区', note: '财经深度报道', kind: 'community' }
    ],
  },
  '地方金融监管员': {
    books: [
      { title: '货币金融学', author: '米什金', why: '金融监管的货币银行学基础' },
      { title: '置身事内', author: '兰小欢', why: '中国金融监管体制的运行逻辑' }
    ],
    videos: [
      { title: '反洗钱师·理论基础·实务指南', url: 'https://www.bilibili.com/video/BV1LiPvznEWE', source: 'Bilibili', note: '合规与反洗钱体系' }
    ],
    docs: [
      { title: '中央银行学（江西师范大学）', url: 'https://higher.smartedu.cn/course/697d1d7395df98bb27aea45e', source: '国家高等教育智慧教育平台', note: '央行制度、业务与宏观审慎政策' },

      { title: '集思录（低风险投资）', url: 'https://www.jisilu.cn/', source: '行业社区', note: '低风险投资与固收社区', kind: 'community' },

      { title: '网易财经', url: 'https://money.163.com/', source: '行业社区', note: '财经资讯与市场评论', kind: 'community' }
    ],
  },
  '并购顾问': {
    videos: [
      { title: '经典案例详解并购重组', url: 'https://www.bilibili.com/video/BV19g4y1t795', source: 'Bilibili', note: '并购重组案例课' }
    ],
    docs: [
      { title: '投资银行学', url: 'https://www.icourse163.org/course/-1449724164', source: '中国大学MOOC', note: 'IPO、并购与资产证券化全程课' },

      { title: 'reddit · r/SecurityAnalysis', url: 'https://www.reddit.com/r/SecurityAnalysis/', source: '行业社区', note: '并购标的估值讨论', kind: 'community' },

      { title: '投中网', url: 'https://www.pedaily.cn/', source: '行业社区', note: '并购与一级市场资讯', kind: 'community' }
    ],
    books: [
      { title: '门口的野蛮人', author: '布赖恩·伯勒', why: '并购史上的经典实录' },

      { title: 'Investment Banking: Valuation, LBOs, M&A, and IPOs', author: 'Joshua Rosenbaum, Joshua Pearl', why: '并购与估值实务的经典入门书' }
    ],
  },
  '供应链金融经理': {
    books: [
      { title: '供应链金融', author: '宋华', why: '供应链金融模式与风控的系统著作' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '供应链融资的银行视角' },
    ],
    videos: [
      { title: '供应链金融的前世今生', url: 'https://www.bilibili.com/video/BV1sUKuzAEPo', source: 'Bilibili', note: '供应链金融模式演进' },
    ],
    docs: [
      { title: 'reddit · r/finance', url: 'https://www.reddit.com/r/finance/', source: '行业社区', note: '供应链金融讨论', kind: 'community' },

      { title: '投中网', url: 'https://www.pedaily.cn/', source: '行业社区', note: '供应链金融与产业资本资讯', kind: 'community' },

      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '供应链金融与票据业务政策' },
    ],
  },
  '供应链票据产品经理': {
    books: [
      { title: '供应链金融', author: '宋华', why: '供应链金融模式与风控的系统著作' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '供应链融资的银行视角' },
    ],
    videos: [
      { title: '供应链金融', url: 'https://www.bilibili.com/video/BV1XBbVexELF', source: 'Bilibili', note: '供应链金融业务框架' },
    ],
    docs: [
      { title: 'reddit · r/finance', url: 'https://www.reddit.com/r/finance/', source: '行业社区', note: '供应链金融讨论', kind: 'community' },

      { title: '投中网', url: 'https://www.pedaily.cn/', source: '行业社区', note: '供应链金融与产业资本资讯', kind: 'community' },

      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '票据业务与电子商业汇票规则' },
    ],
  },
  '不动产投资经理': {
    books: [
      { title: '置身事内', author: '兰小欢', why: '土地财政与不动产金融的底层逻辑' },
      { title: '投资中最简单的事', author: '邱国鹭', why: '不动产等重资产行业投资方法' }
    ],
    videos: [
      { title: '房地产经济（中南财经政法大学）', url: 'https://www.bilibili.com/video/BV1GjEozCE6X', source: 'Bilibili', note: '不动产市场与经济分析' }
    ],
    docs: [
      { title: '个人理财（住房规划模块）', url: 'https://www.icourse163.org/course/detail.htm?cid=1003540065', source: '中国大学MOOC', note: '房地产投资与个人住房规划' },

      { title: 'reddit · r/realestateinvesting', url: 'https://www.reddit.com/r/realestateinvesting/', source: '行业社区', note: '不动产投资全球社区', kind: 'community' }
    ],
  },
  '房地产金融分析师': {
    books: [
      { title: '置身事内', author: '兰小欢', why: '土地财政与不动产金融的底层逻辑' },
      { title: '投资中最简单的事', author: '邱国鹭', why: '不动产等重资产行业投资方法' }
    ],
    videos: [
      { title: '房地产金融全体系', url: 'https://www.bilibili.com/video/BV1kW4y117TR', source: 'Bilibili', note: '房地产金融系统课' }
    ],
    docs: [
      { title: '个人理财（住房规划模块）', url: 'https://www.icourse163.org/course/detail.htm?cid=1003540065', source: '中国大学MOOC', note: '房地产投资与个人住房规划' },

      { title: 'reddit · r/realestateinvesting', url: 'https://www.reddit.com/r/realestateinvesting/', source: '行业社区', note: '不动产投资全球社区', kind: 'community' }
    ],
  },
  '不动产信托基金经理': {
    books: [
      { title: '置身事内', author: '兰小欢', why: '土地财政与不动产金融的底层逻辑' },
      { title: '投资中最简单的事', author: '邱国鹭', why: '不动产等重资产行业投资方法' },
    ],
    videos: [
      { title: '房地产金融全体系', url: 'https://www.bilibili.com/video/BV1kW4y117TR', source: 'Bilibili', note: '房地产金融系统课' },
    ],
    docs: [
      { title: 'reddit · r/realestateinvesting', url: 'https://www.reddit.com/r/realestateinvesting/', source: '行业社区', note: '不动产投资全球社区', kind: 'community' },


      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '不动产投资信托基金监管' },
    ],
  },
  '投后管理经理': {
    videos: [
      { title: '私募股权投资PE：项目投资全流程', url: 'https://www.bilibili.com/video/BV1RV4y1T7HJ', source: 'Bilibili', note: 'PE 投资流程实务' }
    ],
    docs: [
      { title: '公司金融学（西南财经大学）', url: 'https://higher.smartedu.cn/course/62354d6f9906eace04907742', source: '国家高等教育智慧教育平台', note: '估值报告写作，投行必修' },

      { title: 'reddit · r/venturecapital', url: 'https://www.reddit.com/r/venturecapital/', source: '行业社区', note: 'VC/PE 行业社区', kind: 'community' }
    ],
    books: [
      { title: '风险投资交易', author: '布拉德·费尔德', why: 'VC 条款与谈判的行业标准' },

      { title: 'Venture Deals', author: 'Brad Feld, Jason Mendelson', why: '创投融资条款与投后治理的实务指南' }
    ],
  },
  'VC投资经理': {
    videos: [
      { title: '私募股权投资PE：项目投资全流程', url: 'https://www.bilibili.com/video/BV1RV4y1T7HJ', source: 'Bilibili', note: 'PE 投资流程实务' },
    ],
    docs: [
      { title: 'reddit · r/venturecapital', url: 'https://www.reddit.com/r/venturecapital/', source: '行业社区', note: 'VC/PE 行业社区', kind: 'community' },


      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn/', source: '行业自律组织', note: '私募基金备案与行业规范' },
    ],
    books: [
      { title: '风险投资交易', author: '布拉德·费尔德', why: 'VC 条款与谈判的行业标准' },

      { title: 'Venture Deals', author: 'Brad Feld, Jason Mendelson', why: '风险投资条款与交易结构的实务入门' },
    ],
  },
  'PE投资经理': {
    books: [
      { title: '风险投资交易', author: '布拉德·费尔德', why: 'VC 条款与谈判的行业标准' },
      { title: '创业维艰', author: '本·霍洛维茨', why: '理解被投企业的经营现实' },
    ],
    videos: [
      { title: '私募股权101：20分钟了解PE', url: 'https://www.bilibili.com/video/BV1xQt4z6Eqs', source: 'Bilibili', note: 'PE 行业全景' },
    ],
    docs: [
      { title: 'reddit · r/venturecapital', url: 'https://www.reddit.com/r/venturecapital/', source: '行业社区', note: 'VC/PE 行业社区', kind: 'community' },


      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn/', source: '行业自律组织', note: '私募股权基金登记与管理规范' },
    ],
  },
  '天使投资人': {
    docs: [
      { title: 'reddit · r/Banking', url: 'https://www.reddit.com/r/Banking/', source: '行业社区', note: '银行业从业者与客户社区', kind: 'community' },


      { title: '公司金融（中央财经大学）', url: 'https://www.icourse163.org/course/-1207105819', source: '中国大学MOOC', note: '估值与资本结构的课程底盘，含企业危机案例' },
    ],
    videos: [
      { title: '私募股权101：20分钟了解PE', url: 'https://www.bilibili.com/video/BV1xQt4z6Eqs', source: 'Bilibili', note: 'PE 行业全景' },
    ],
    books: [
      { title: '风险投资交易', author: '布拉德·费尔德', why: 'VC 条款与谈判的行业标准' },

      { title: 'Venture Deals', author: 'Brad Feld, Jason Mendelson', why: '早期投资条款与创业公司治理的入门读物' },
    ],
  },
  '产业投资基金经理': {
    books: [
      { title: '风险投资交易', author: '布拉德·费尔德', why: 'VC 条款与谈判的行业标准' },
      { title: '创业维艰', author: '本·霍洛维茨', why: '理解被投企业的经营现实' },
    ],
    videos: [
      { title: '私募股权投资PE：项目投资全流程', url: 'https://www.bilibili.com/video/BV1RV4y1T7HJ', source: 'Bilibili', note: 'PE 投资流程实务' },
    ],
    docs: [
      { title: 'reddit · r/Banking', url: 'https://www.reddit.com/r/Banking/', source: '行业社区', note: '银行业从业者与客户社区', kind: 'community' },


      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn/', source: '行业自律组织', note: '私募投资基金运作规范' },
    ],
  },
  '证券分析师': {
    videos: [
      { title: '证券从业通关课（金融基础+法律法规）', url: 'https://www.bilibili.com/video/BV1Vc9NBiExY', source: 'Bilibili', note: '证券市场体系课' },
    ],
    docs: [
      { title: '和讯网', url: 'https://www.hexun.com/', source: '行业社区', note: '财经资讯社区', kind: 'community' },

      { title: '雪球（投资者社区）', url: 'https://xueqiu.com/', source: '行业社区', note: '卖方买方观点交锋主阵地', kind: 'community' },

      { title: '中国证券业协会', url: 'https://www.sac.net.cn/', source: '行业自律组织', note: '证券分析师执业规范与考试' },
      { title: 'CFA Institute', url: 'https://www.cfainstitute.org/en/programs/cfa', source: '国际职业认证', note: 'CFA 项目介绍' },
    ],
    books: [
      { title: '证券分析', author: '格雷厄姆', why: '基本面分析的奠基之作' },

      { title: 'Security Analysis', author: 'Benjamin Graham, David Dodd', why: '证券基本面分析的经典著作' },
    ],
  },
  '对冲基金分析师': {
    docs: [
      { title: '和讯网', url: 'https://www.hexun.com/', source: '行业社区', note: '财经资讯社区', kind: 'community' },


      { title: '公司金融（中国矿业大学）', url: 'https://www.icourse163.org/course/CUMT-1470645173', source: '中国大学MOOC', note: '组合理论与 CAPM 的课程基础' },
    ],
    videos: [
      { title: '普通人如何从0开始做量化', url: 'https://www.bilibili.com/video/BV1JY8F61E6y', source: 'Bilibili', note: '对冲策略的量化路径' },
    ],
    books: [
      { title: '对冲基金奇才', author: '杰克·施瓦格', why: '顶级对冲基金经理访谈录' },

      { title: 'Security Analysis', author: 'Benjamin Graham, David Dodd', why: '证券估值与分析方法的经典参考' },
    ],
  },
  '宏观经济学家': {
    videos: [
      { title: '宏观经济学全集（经管老邢）', url: 'https://www.bilibili.com/video/BV1nP411t7fu', source: 'Bilibili', note: '宏观经济学系统课' }
    ],
    docs: [
      { title: 'reddit · r/economics', url: 'https://www.reddit.com/r/economics/', source: '行业社区', note: '宏观经济学讨论社区', kind: 'community' },

      { title: '国际清算银行（BIS）', url: 'https://www.bis.org/', source: '国际机构', note: '全球金融与宏观研究报告' }
    ],
    books: [
      { title: '置身事内', author: '兰小欢', why: '中国宏观经济运行的政治经济学' },

      { title: 'The Economics of Money, Banking, and Financial Markets', author: 'Frederic Mishkin', why: '货币、银行与宏观金融的经典教材' }
    ],
  },
  '产业研究员': {
    books: [
      { title: '投资中最简单的事', author: '邱国鹭', why: '行业选择与公司质地判断' },
      { title: '商业模式新生代', author: '奥斯特瓦德', why: '产业研究的商业模式分析工具' }
    ],
    videos: [
      { title: '8分钟看透一家上市公司财务报表', url: 'https://www.bilibili.com/video/BV1QdN4ztEVN', source: 'Bilibili', note: '产业研究的财报工具' }
    ],
    docs: [
      { title: '公司金融（江西财经大学）', url: 'https://www.icourse163.org/course/JXUFE-1206455816', source: '中国大学MOOC', note: '债券估值与资本结构系统课' },

      { title: '和讯网', url: 'https://www.hexun.com/', source: '行业社区', note: '财经资讯社区', kind: 'community' },

      { title: 'reddit · r/Banking', url: 'https://www.reddit.com/r/Banking/', source: '行业社区', note: '银行业从业者与客户社区', kind: 'community' }
    ],
  },
  'IPO项目经理': {
    books: [
      { title: '投资银行：估值、杠杆收购、兼并与收购', author: '乔舒亚·罗森鲍姆', why: 'IPO 估值与承销实务手册' },
      { title: '门口的野蛮人', author: '布赖恩·伯勒', why: '资本运作的经典实录' },
    ],
    videos: [
      { title: '投行IBD interview strategy', url: 'https://www.bilibili.com/video/BV12s411q7j8', source: 'Bilibili', note: 'IPO 承销与投行业务' },
    ],
    docs: [
      { title: 'reddit · r/Bogleheads', url: 'https://www.reddit.com/r/Bogleheads/', source: '行业社区', note: '指数化投资与长期配置社区', kind: 'community' },

      { title: 'reddit · r/dividends', url: 'https://www.reddit.com/r/dividends/', source: '行业社区', note: '股息与收益投资讨论', kind: 'community' },

      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '首次公开发行股票监管规则' },
      { title: '上海证券交易所', url: 'https://www.sse.com.cn/', source: '官方交易所', note: '上市审核与规则' },
    ],
  },
  'IPO审核专家': {
    books: [
      { title: '投资银行：估值、杠杆收购、兼并与收购', author: '乔舒亚·罗森鲍姆', why: 'IPO 估值与承销实务手册' },
      { title: '门口的野蛮人', author: '布赖恩·伯勒', why: '资本运作的经典实录' },
    ],
    videos: [
      { title: '投行IBD interview strategy', url: 'https://www.bilibili.com/video/BV12s411q7j8', source: 'Bilibili', note: 'IPO 承销与投行业务' },
    ],
    docs: [
      { title: 'reddit · r/stocks', url: 'https://www.reddit.com/r/stocks/', source: '行业社区', note: '股票投资讨论', kind: 'community' },

      { title: 'reddit · r/dividends', url: 'https://www.reddit.com/r/dividends/', source: '行业社区', note: '股息与收益投资讨论', kind: 'community' },

      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: 'IPO注册制相关规则' },
      { title: '深圳证券交易所', url: 'https://www.szse.cn/', source: '官方交易所', note: '上市审核业务规则' },
    ],
  },
  '信用评级分析师': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '吴毅《信贷审查审批实务》', url: 'https://www.bilibili.com/video/BV1xQLtzjEbL', source: 'Bilibili', note: '信贷审查的实务课' }
    ],
    docs: [
      { title: '公司金融学（西南财经大学）', url: 'https://higher.smartedu.cn/course/62354d6f9906eace04907742', source: '国家高等教育智慧教育平台', note: '估值报告写作，投行必修' },

      { title: 'reddit · r/debtfree', url: 'https://www.reddit.com/r/debtfree/', source: '行业社区', note: '负债管理与信贷讨论', kind: 'community' }
    ],
  },
  '互联网金融运营': {
    books: [
      { title: '银行4.0', author: '布雷特·金', why: '金融服务数字化的演进方向' },
      { title: '启示录：打造用户喜爱的产品', author: '马蒂·卡根', why: '产品经理方法论经典' },
    ],
    videos: [
      { title: '金融科技概论', url: 'https://www.bilibili.com/video/BV1Ai4y1T7r6', source: 'Bilibili', note: '金融科技课程体系' },
    ],
    docs: [
      { title: '格隆汇', url: 'https://www.gelonghui.com/', source: '行业社区', note: '海外投资与市场观点社区', kind: 'community' },

      { title: 'reddit · r/StockMarket', url: 'https://www.reddit.com/r/StockMarket/', source: '行业社区', note: '股市讨论社区', kind: 'community' },

      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '互联网金融业务监管要求' },
    ],
  },
  '互联网证券产品经理': {
    books: [
      { title: '银行4.0', author: '布雷特·金', why: '金融服务数字化的演进方向' },
      { title: '启示录：打造用户喜爱的产品', author: '马蒂·卡根', why: '产品经理方法论经典' }
    ],
    videos: [
      { title: '金融科技概论', url: 'https://www.bilibili.com/video/BV1Ai4y1T7r6', source: 'Bilibili', note: '金融科技课程体系' }
    ],
    docs: [
      { title: '格隆汇', url: 'https://www.gelonghui.com/', source: '行业社区', note: '海外投资与市场观点社区', kind: 'community' },

      { title: 'reddit · r/StockMarket', url: 'https://www.reddit.com/r/StockMarket/', source: '行业社区', note: '股市讨论社区', kind: 'community' },

      { title: '上海证券交易所', url: 'https://www.sse.com.cn/', source: '官方交易所', note: '证券交易规则' }
    ],
  },
  '信托经理': {
    books: [
      { title: '穷查理宝典', author: '查理·芒格', why: '高净值财富管理的思维模型' },
      { title: '投资最重要的事', author: '霍华德·马克斯', why: '信托资产的风险管理心法' }
    ],
    videos: [
      { title: '小Lin说：信托', url: 'https://www.bilibili.com/video/BV1f64y197hm', source: 'Bilibili', note: '信托业务科普' }
    ],
    docs: [
      { title: '公司金融学（西南财经大学）', url: 'https://higher.smartedu.cn/course/62354d6f9906eace04907742', source: '国家高等教育智慧教育平台', note: '估值报告写作，投行必修' },

      { title: 'reddit · r/economics', url: 'https://www.reddit.com/r/economics/', source: '行业社区', note: '经济讨论社区', kind: 'community' },

      { title: 'reddit · r/FinancialPlanning', url: 'https://www.reddit.com/r/FinancialPlanning/', source: '行业社区', note: '个人财务规划讨论', kind: 'community' }
    ],
  },
  '券商客户经理': {
    books: [
      { title: '投资中最简单的事', author: '邱国鹭', why: '服务客户的价值投资话术根基' },
      { title: '聪明的投资者', author: '格雷厄姆', why: '客户资产配置的经典框架' },
    ],
    videos: [
      { title: '证券从业通关课', url: 'https://www.bilibili.com/video/BV1Vc9NBiExY', source: 'Bilibili', note: '券商业务与市场基础' },
    ],
    docs: [
      { title: 'reddit · r/economics', url: 'https://www.reddit.com/r/economics/', source: '行业社区', note: '经济讨论社区', kind: 'community' },

      { title: '华尔街见闻', url: 'https://wallstreetcn.com/', source: '行业社区', note: '全球市场资讯与讨论', kind: 'community' },

      { title: '中国证券业协会', url: 'https://www.sac.net.cn/', source: '行业自律组织', note: '证券从业人员执业规范' },
    ],
  },
  '资产证券化分析师': {
    videos: [
      { title: '你长大了，该了解什么是资产证券化了', url: 'https://www.bilibili.com/video/BV1TLNu6QEUz', source: 'Bilibili', note: 'ABS 结构科普' }
    ],
    docs: [
      { title: '公司金融（江西财经大学）', url: 'https://www.icourse163.org/course/JXUFE-1206455816', source: '中国大学MOOC', note: '债券估值与资本结构系统课' },

      { title: 'reddit · r/finance', url: 'https://www.reddit.com/r/finance/', source: '行业社区', note: '结构化金融讨论', kind: 'community' }
    ],
    books: [
      { title: '固定收益证券手册', author: '弗兰克·法博齐', why: '资产证券化产品的权威手册' },

      { title: 'Fixed Income Securities', author: 'Bruce Tuckman, Angel Serrat', why: '结构化金融与证券定价的核心参考' }
    ],
  },
  '财富科技工程师': {
    books: [
      { title: '银行4.0', author: '布雷特·金', why: '金融服务数字化的演进方向' },
      { title: '启示录：打造用户喜爱的产品', author: '马蒂·卡根', why: '产品经理方法论经典' }
    ],
    videos: [
      { title: 'Fintech（金融科技）', url: 'https://www.coursera.org/learn/fintech', source: 'Coursera', note: '财富管理科技的业务基础' }
    ],
    docs: [
      { title: '金融科技与互联网金融（江苏服务职业技术学院）', url: 'https://www.icourse163.org/course/JSSVC-1207056805', source: '中国大学MOOC', note: '金融科技业态与监管全景课' },

      { title: '格隆汇', url: 'https://www.gelonghui.com/', source: '行业社区', note: '海外投资与市场观点社区', kind: 'community' },

      { title: 'reddit · r/personalfinance', url: 'https://www.reddit.com/r/personalfinance/', source: '行业社区', note: '个人理财讨论', kind: 'community' }
    ],
  },
};
