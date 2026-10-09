import type { CareerResourceSet } from '../career-resources';

export const financeResources: Record<string, CareerResourceSet> = {
  '精算师': {
    docs: [
      { title: '北美精算师协会（SOA）', url: 'https://www.soa.org/', source: '国际精算组织', note: '精算考试与职业路径的权威来源' },
      { title: '美国精算学会（CAS）', url: 'https://www.casact.org/', source: '国际精算组织', note: '财产险与意外险精算方向' },
    ],
    books: [
      { title: 'Loss Models: From Data to Decisions', author: 'Klugman, Panjer, Willmot', why: '精算建模与损失分布的经典教材' },
    ],
  },
  '保险精算师': {
    docs: [
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '保险业监管政策与规章' },
      { title: '北美精算师协会（SOA）', url: 'https://www.soa.org/', source: '国际精算组织' },
    ],
    books: [
      { title: 'Loss Models: From Data to Decisions', author: 'Klugman, Panjer, Willmot', why: '保险损失建模的核心参考书' },
    ],
  },
  '保险精算定价师': {
    docs: [
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '保险产品费率与准备金监管' },
    ],
    books: [
      { title: 'Loss Models: From Data to Decisions', author: 'Klugman, Panjer, Willmot', why: '定价所需的损失分布与风险建模基础' },
    ],
  },
  '保险产品精算': {
    docs: [
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '保险产品审批与精算规定' },
    ],
  },
  '养老金精算师': {
    docs: [
      { title: '北美精算师协会（SOA）', url: 'https://www.soa.org/', source: '国际精算组织', note: '养老金与退休计划相关考试' },
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '养老金相关监管规定' },
    ],
  },
  '保险核保师': {
    docs: [
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '保险业务与承保规则监管' },
    ],
  },
  '保险科技产品经理': {
    videos: [
      { title: 'Fintech（金融科技）', url: 'https://www.coursera.org/learn/fintech', source: 'Coursera', note: '金融科技业务模式入门' },
    ],
    docs: [
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '保险科技与数字化监管要求' },
    ],
  },
  '金融科技产品经理': {
    videos: [
      { title: 'Fintech（金融科技）', url: 'https://www.coursera.org/learn/fintech', source: 'Coursera', note: '金融科技生态与产品逻辑' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '金融科技监管与支付政策' },
    ],
  },
  '支付系统架构师': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '支付清算体系与监管规则' },
    ],
  },
  '支付产品经理': {
    videos: [
      { title: 'Fintech（金融科技）', url: 'https://www.coursera.org/learn/fintech', source: 'Coursera', note: '支付与金融科技产品基础' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '非银行支付机构监管规定' },
    ],
  },
  '第三方支付运营': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '第三方支付牌照与业务规范' },
    ],
  },
  '跨境支付产品经理': {
    docs: [
      { title: '国家外汇管理局', url: 'https://www.safe.gov.cn/', source: '官方监管机构', note: '跨境收支与外汇管理规则' },
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '跨境支付相关政策' },
    ],
  },
  '私人银行经理': {
    videos: [
      { title: 'Personal Financial Planning（个人理财规划）', url: 'https://www.coursera.org/learn/financial-planning', source: 'Coursera', note: '个人财务规划基础' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '银行理财与财富管理监管' },
    ],
  },
  '家族办公室经理': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '财富管理相关金融监管' },
    ],
  },
  '信贷审核师': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '信贷政策与征信体系' },
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '银行业贷款管理监管' },
    ],
  },
  '小微金融风控': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '普惠金融与小微企业贷款政策' },
    ],
  },
  '消费金融产品经理': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '消费金融业务监管要求' },
    ],
  },
  '小额贷款风控': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '小额贷款业务相关规则' },
    ],
  },
  '助学贷款产品经理': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '贷款产品与信贷政策' },
    ],
  },
  '汽车金融经理': {
    docs: [
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '汽车金融公司监管规定' },
    ],
  },
  '信用修复顾问': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '征信与信用报告相关规定' },
    ],
  },
  '征信数据分析': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '征信业务与数据管理规范' },
    ],
  },
  '金融风控建模师': {
    videos: [
      { title: 'Analytics of Finance（金融分析）', url: 'https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/index.htm', source: 'MIT OpenCourseWare', note: '金融计量与建模方法' },
    ],
    books: [
      { title: 'Risk Management and Financial Institutions', author: 'John C. Hull', why: '金融机构风险建模与管理的经典教材' },
    ],
  },
  '金融科技风控建模': {
    videos: [
      { title: 'Analytics of Finance（金融分析）', url: 'https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/index.htm', source: 'MIT OpenCourseWare', note: '金融建模与数据分析' },
    ],
    books: [
      { title: 'Risk Management and Financial Institutions', author: 'John C. Hull', why: '风控模型与金融机构风险管理的核心参考' },
    ],
  },
  '金融数据分析师': {
    videos: [
      { title: 'Analytics of Finance（金融分析）', url: 'https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/index.htm', source: 'MIT OpenCourseWare', note: '金融数据的统计与分析方法' },
    ],
    books: [
      { title: 'Advances in Financial Machine Learning', author: 'Marcos López de Prado', why: '金融数据中机器学习应用的前沿参考' },
    ],
  },
  '金融数学建模师': {
    videos: [
      { title: 'Analytics of Finance（金融分析）', url: 'https://ocw.mit.edu/courses/15-450-analytics-of-finance-fall-2010/index.htm', source: 'MIT OpenCourseWare', note: '金融数学与建模基础' },
    ],
    books: [
      { title: 'Advances in Financial Machine Learning', author: 'Marcos López de Prado', why: '金融数学建模与机器学习方法的结合' },
    ],
  },
  '外汇交易员': {
    videos: [
      { title: 'Derivative Securities（衍生证券）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/derivative-securities', source: 'Khan Academy', note: '远期、期货、期权等衍生工具入门' },
    ],
    docs: [
      { title: '国家外汇管理局', url: 'https://www.safe.gov.cn/', source: '官方监管机构', note: '外汇市场管理与交易规则' },
    ],
    books: [
      { title: 'Options, Futures, and Other Derivatives', author: 'John C. Hull', why: '衍生品定价与风险对冲的经典教材' },
    ],
  },
  '期货交易员': {
    videos: [
      { title: 'Derivative Securities（衍生证券）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/derivative-securities', source: 'Khan Academy', note: '期货合约与套期保值原理' },
    ],
    docs: [
      { title: '上海期货交易所', url: 'https://www.shfe.com.cn/', source: '官方交易所', note: '期货品种与交易规则' },
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '期货市场监管' },
    ],
    books: [
      { title: 'Options, Futures, and Other Derivatives', author: 'John C. Hull', why: '期货与衍生品定价的标准教材' },
    ],
  },
  '债券交易员': {
    videos: [
      { title: 'Stocks and Bonds（股票与债券）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/stock-and-bonds', source: 'Khan Academy', note: '债券基本要素与估值' },
      { title: 'Interest（利率）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/interest-tutorial', source: 'Khan Academy', note: '利率与债券价格关系' },
    ],
    docs: [
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '证券与债券市场监管' },
    ],
    books: [
      { title: 'Fixed Income Securities', author: 'Bruce Tuckman, Angel Serrat', why: '固定收益证券定价与风险的权威教材' },
    ],
  },
  '贵金属交易员': {
    videos: [
      { title: 'Derivative Securities（衍生证券）', url: 'https://www.khanacademy.org/economics-finance-domain/core-finance/derivative-securities', source: 'Khan Academy', note: '商品衍生品与对冲基础' },
    ],
    docs: [
      { title: '上海期货交易所', url: 'https://www.shfe.com.cn/', source: '官方交易所', note: '黄金、白银等品种的交易规则' },
    ],
  },
  '税务规划师': {
    docs: [
      { title: '国家税务总局', url: 'https://www.chinatax.gov.cn/', source: '官方税务机关', note: '税收政策与法规' },
      { title: '财政部', url: 'https://www.mof.gov.cn/', source: '官方部门', note: '财税政策发布' },
    ],
  },
  '资产估值师': {
    docs: [
      { title: 'IFRS 国际财务报告准则', url: 'https://www.ifrs.org/issued-standards/list-of-standards/', source: '国际准则机构', note: '公允价值与资产计量准则' },
    ],
    books: [
      { title: 'Valuation: Measuring and Managing the Value of Companies', author: 'Tim Koller 等', why: '企业估值方法的经典实务教材' },
    ],
  },
  '碳交易分析师': {
    videos: [
      { title: 'ESG', url: 'https://www.coursera.org/learn/esg', source: 'Coursera', note: 'ESG 与可持续金融基础' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '绿色金融与碳金融相关政策' },
    ],
  },
  '绿色金融分析师': {
    videos: [
      { title: 'ESG', url: 'https://www.coursera.org/learn/esg', source: 'Coursera', note: 'ESG 投资与绿色金融框架' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '绿色金融政策与标准' },
    ],
  },
  '数字货币研究员': {
    videos: [
      { title: 'Blockchain Basics（区块链基础）', url: 'https://www.coursera.org/learn/blockchain-basics', source: 'Coursera', note: '区块链与数字资产原理' },
      { title: 'Cryptocurrency（加密货币）', url: 'https://www.coursera.org/learn/cryptocurrency', source: 'Coursera', note: '加密货币的经济与技术基础' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '数字人民币相关政策' },
      { title: '国际清算银行（BIS）', url: 'https://www.bis.org/', source: '国际机构', note: '央行数字货币研究报告' },
    ],
    books: [
      { title: 'Blockchain Revolution', author: 'Don Tapscott, Alex Tapscott', why: '区块链技术与金融变革的通俗入门' },
    ],
  },
  '数字货币合规官': {
    videos: [
      { title: 'Cryptocurrency（加密货币）', url: 'https://www.coursera.org/learn/cryptocurrency', source: 'Coursera', note: '加密资产的业务与风险基础' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '数字货币管理与合规要求' },
      { title: '国际清算银行（BIS）', url: 'https://www.bis.org/', source: '国际机构', note: '全球央行数字货币研究' },
    ],
  },
  '金融监管科技': {
    videos: [
      { title: 'Fintech（金融科技）', url: 'https://www.coursera.org/learn/fintech', source: 'Coursera', note: '金融科技与监管科技的基础' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '监管科技与数据报送要求' },
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '金融机构监管数字化' },
    ],
  },
  '金融监管政策研究员': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '货币与金融政策发布' },
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '金融监管政策发布' },
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '证券市场监管政策' },
    ],
  },
  '地方金融监管员': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '地方金融组织监管框架' },
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '金融机构监管规定' },
    ],
  },
  '并购顾问': {
    docs: [
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '上市公司并购重组监管规则' },
    ],
    books: [
      { title: 'Investment Banking: Valuation, LBOs, M&A, and IPOs', author: 'Joshua Rosenbaum, Joshua Pearl', why: '并购与估值实务的经典入门书' },
    ],
  },
  '供应链金融经理': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '供应链金融与票据业务政策' },
    ],
  },
  '供应链票据产品经理': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '票据业务与电子商业汇票规则' },
    ],
  },
  '不动产投资经理': {
    docs: [
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '公募REITs等不动产金融产品监管' },
    ],
  },
  '房地产金融分析师': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '房地产金融政策与贷款管理' },
    ],
  },
  '不动产信托基金经理': {
    docs: [
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '不动产投资信托基金监管' },
    ],
  },
  '投后管理经理': {
    docs: [
      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn/', source: '行业自律组织', note: '私募股权投资管理规范' },
    ],
    books: [
      { title: 'Venture Deals', author: 'Brad Feld, Jason Mendelson', why: '创投融资条款与投后治理的实务指南' },
    ],
  },
  'VC投资经理': {
    docs: [
      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn/', source: '行业自律组织', note: '私募基金备案与行业规范' },
    ],
    books: [
      { title: 'Venture Deals', author: 'Brad Feld, Jason Mendelson', why: '风险投资条款与交易结构的实务入门' },
    ],
  },
  'PE投资经理': {
    docs: [
      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn/', source: '行业自律组织', note: '私募股权基金登记与管理规范' },
    ],
  },
  '天使投资人': {
    books: [
      { title: 'Venture Deals', author: 'Brad Feld, Jason Mendelson', why: '早期投资条款与创业公司治理的入门读物' },
    ],
  },
  '产业投资基金经理': {
    docs: [
      { title: '中国证券投资基金业协会', url: 'https://www.amac.org.cn/', source: '行业自律组织', note: '私募投资基金运作规范' },
    ],
  },
  '证券分析师': {
    docs: [
      { title: '中国证券业协会', url: 'https://www.sac.net.cn/', source: '行业自律组织', note: '证券分析师执业规范与考试' },
      { title: 'CFA Institute', url: 'https://www.cfainstitute.org/en/programs/cfa', source: '国际职业认证', note: 'CFA 项目介绍' },
    ],
    books: [
      { title: 'Security Analysis', author: 'Benjamin Graham, David Dodd', why: '证券基本面分析的经典著作' },
    ],
  },
  '对冲基金分析师': {
    books: [
      { title: 'Security Analysis', author: 'Benjamin Graham, David Dodd', why: '证券估值与分析方法的经典参考' },
    ],
  },
  '宏观经济学家': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '货币政策报告与宏观数据' },
      { title: '国际清算银行（BIS）', url: 'https://www.bis.org/', source: '国际机构', note: '全球金融与宏观研究报告' },
    ],
    books: [
      { title: 'The Economics of Money, Banking, and Financial Markets', author: 'Frederic Mishkin', why: '货币、银行与宏观金融的经典教材' },
    ],
  },
  '产业研究员': {
    docs: [
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '上市公司行业信息披露规则' },
    ],
  },
  'IPO项目经理': {
    docs: [
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '首次公开发行股票监管规则' },
      { title: '上海证券交易所', url: 'https://www.sse.com.cn/', source: '官方交易所', note: '上市审核与规则' },
    ],
  },
  'IPO审核专家': {
    docs: [
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: 'IPO注册制相关规则' },
      { title: '深圳证券交易所', url: 'https://www.szse.cn/', source: '官方交易所', note: '上市审核业务规则' },
    ],
  },
  '信用评级分析师': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '债券市场信用评级相关规定' },
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '证券市场评级机构监管' },
    ],
  },
  '互联网金融运营': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '互联网金融业务监管要求' },
    ],
  },
  '互联网证券产品经理': {
    docs: [
      { title: '中国证监会', url: 'https://www.csrc.gov.cn/', source: '官方监管机构', note: '互联网证券业务监管规定' },
      { title: '上海证券交易所', url: 'https://www.sse.com.cn/', source: '官方交易所', note: '证券交易规则' },
    ],
  },
  '信托经理': {
    docs: [
      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn/', source: '官方监管机构', note: '信托公司监管规定' },
    ],
  },
  '券商客户经理': {
    docs: [
      { title: '中国证券业协会', url: 'https://www.sac.net.cn/', source: '行业自律组织', note: '证券从业人员执业规范' },
    ],
  },
  '资产证券化分析师': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '资产支持证券相关规定' },
    ],
    books: [
      { title: 'Fixed Income Securities', author: 'Bruce Tuckman, Angel Serrat', why: '结构化金融与证券定价的核心参考' },
    ],
  },
  '财富科技工程师': {
    videos: [
      { title: 'Fintech（金融科技）', url: 'https://www.coursera.org/learn/fintech', source: 'Coursera', note: '财富管理科技的业务基础' },
    ],
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '官方监管机构', note: '金融科技监管要求' },
    ],
  },
};
