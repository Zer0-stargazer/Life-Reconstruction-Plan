/**
 * 职业级专属学习资源。
 *
 * 背景：此前学习资源按「分类」查找（getBooks 等），同分类下 45 个医疗职业
 * 推荐同一套书，用户反馈"太重复"。这里按**职业名**存专属资源，查不到时
 * 才回落到分类级通用资源——专属在前、通用在后。
 *
 * 数据来源：2026-10-02 起分批联网调研（首批：黄金/高危快看组职业）。
 * 课程/参考的 URL 由调研代理逐一实测可达才写入（verified），验证不过的
 * 字段 url 留空，绝不编造；书籍以"真实存在、可买到"为准，不标 ISBN。
 * 字段均可缺省：调研只拿到可靠书籍时就不写 course/reference。
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
  book?: CareerResourceBook;
  course?: CareerResourceCourse;
  reference?: CareerResourceRef;
}

/** 键 = 职业名（与 careers.ts 的 name 字段精确一致） */
export const CAREER_RESOURCES: Record<string, CareerResourceSet> = {
  // ---- 黄金赛道 · 科技（2026-10-02 调研，URL 全部实测可达） ----
  '数据科学家': {
    book: { title: '利用Python进行数据分析（第3版）', author: 'Wes McKinney', why: 'pandas 作者亲写，数据分析自学首选，实战性强' },
    course: { title: 'Machine Learning Specialization（吴恩达机器学习专项）', platform: 'Coursera', url: 'https://www.coursera.org/specializations/machine-learning-introduction' },
    reference: { name: 'scikit-learn 官方文档', url: 'https://scikit-learn.org/stable/' },
  },
  '网络安全专家': {
    book: { title: '白帽子讲Web安全', author: '吴翰清', why: '阿里安全专家经典，Web 安全知识体系完整易懂' },
    course: { title: 'IBM Cybersecurity Analyst Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst' },
    reference: { name: 'OWASP Top 10（Web 十大安全风险官方项目）', url: 'https://owasp.org/www-project-top-ten/' },
  },
  '云架构师': {
    book: { title: 'SRE：Google运维解密', author: 'Betsy Beyer 等（Google SRE 团队）', why: 'Google 官方出品，云上可靠架构设计必读' },
    course: { title: 'AWS Cloud Solutions Architect Professional Certificate', platform: 'Coursera', url: 'https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect' },
    reference: { name: 'AWS Well-Architected Framework（官方架构最佳实践）', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html' },
  },
  '区块链开发工程师': {
    book: { title: '精通以太坊（Mastering Ethereum）', author: 'Andreas M. Antonopoulos、Gavin Wood', why: '以太坊开发圣经，智能合约与 DApp 原理讲透' },
    course: { title: 'Blockchain Specialization（含 Solidity 与 DApp 开发）', platform: 'Coursera', url: 'https://www.coursera.org/specializations/blockchain' },
    reference: { name: 'Solidity 官方文档', url: 'https://docs.soliditylang.org/en/latest/' },
  },
  '嵌入式系统工程师': {
    book: { title: '嵌入式Linux应用开发完全手册', author: '韦东山', why: '国内嵌入式 Linux 经典，从裸机到驱动全覆盖' },
    course: { title: 'Introduction to Embedded Systems Software and Development Environments', platform: 'Coursera', url: 'https://www.coursera.org/learn/introduction-embedded-systems' },
    reference: { name: 'FreeRTOS 官网与文档（主流嵌入式 RTOS）', url: 'https://www.freertos.org/' },
  },
  '大数据工程师': {
    book: { title: 'Hadoop权威指南：大数据的存储与分析（第4版）', author: 'Tom White', why: 'Hadoop 生态权威之作，大数据自学基础必读' },
    course: { title: '尚硅谷Hadoop教程（3.x 搭建到集群调优，178 集）', platform: 'B站', url: 'https://www.bilibili.com/video/BV1Qp4y1n7EN/' },
    reference: { name: 'Apache Spark 官方文档', url: 'https://spark.apache.org/docs/latest/' },
  },
  'NLP工程师': {
    book: { title: '自然语言处理入门', author: '何晗', why: 'HanLP 作者亲写，理论加代码，中文 NLP 实战首选' },
    course: { title: 'Natural Language Processing Specialization', platform: 'Coursera', url: 'https://www.coursera.org/specializations/natural-language-processing' },
    reference: { name: '斯坦福 CS224N 官方课程主页', url: 'https://web.stanford.edu/class/cs224n/' },
  },
  '计算机视觉工程师': {
    book: { title: '数字图像处理（第3版）', author: 'Rafael C. Gonzalez（冈萨雷斯）', why: '图像处理领域圣经，打牢计算机视觉理论基础' },
    course: { title: 'Deep Learning Specialization（第 4 门课为 CNN）', platform: 'Coursera', url: 'https://www.coursera.org/specializations/deep-learning' },
    reference: { name: 'OpenCV 官方文档', url: 'https://docs.opencv.org/4.x/' },
  },
  '推荐系统工程师': {
    book: { title: '推荐系统实践', author: '项亮', why: '国内推荐系统开山经典，算法与工程思路清晰' },
    course: { title: 'Recommender Systems Specialization（明尼苏达大学）', platform: 'Coursera', url: 'https://www.coursera.org/specializations/recommender-systems' },
    reference: { name: 'RecBole 官方文档（PyTorch 推荐系统框架，94 种算法）', url: 'https://recbole.io/docs/' },
  },
  '量化交易工程师': {
    book: { title: '量化交易：如何建立自己的算法交易事业', author: 'Ernest P. Chan（欧内斯特·陈）', why: '量化入门经典，手把手搭建个人算法交易体系' },
    course: { title: 'Investment Management with Python and Machine Learning', platform: 'Coursera', url: 'https://www.coursera.org/specializations/investment-management-python-machine-learning' },
    reference: { name: 'VeighNa（vn.py）开源量化交易框架官网', url: 'https://www.vnpy.com/' },
  },
  // ---- 高危赛道 · 传媒/商业（2026-10-02 调研；课程类可靠来源少，宁缺毋滥） ----
  '内容创作者/KOL': {
    book: { title: '爆款文案', author: '关健明', why: '拆解爆款带货文案的写作套路，适合内容变现入门' },
    reference: { name: '新榜（内容产业与 KOL 数据平台）', url: 'https://www.newrank.cn/' },
  },
  '视频剪辑师': {
    book: { title: '剪辑的语法', author: '罗伊·汤普森、克里斯托弗·鲍恩', why: '镜头组接的经典入门教材，剪辑基本功系统透彻' },
    reference: { name: 'Adobe Premiere Pro 官方帮助文档' },
  },
  '新媒体运营': {
    book: { title: '从零开始做运营', author: '张亮', why: '运营入门经典，系统讲透内容、用户、活动三大模块' },
    reference: { name: '人人都是产品经理（运营从业者社区）', url: 'https://www.woshipm.com/' },
  },
  '新闻记者': {
    book: { title: '哈佛非虚构写作课：怎样讲好一个故事', author: '马克·克雷默、温迪·考尔 编', why: '非虚构写作权威文集，选题采访到叙事成稿全覆盖' },
    course: { title: '当代媒介素养', platform: '网易公开课' },
    reference: { name: '中国记协（中华全国新闻工作者协会）' },
  },
  '美食博主': {
    book: { title: '鱼翅与花椒', author: '扶霞·邓洛普', why: '美食写作的典范，示范如何把食物写成动人的故事' },
    reference: { name: '下厨房（中文美食菜谱社区）', url: 'https://www.xiachufang.com/' },
  },
  '旅游博主': {
    book: { title: '背包十年', author: '小鹏', why: '中国职业旅行开拓者自述，展示旅行如何做成事业' },
    reference: { name: '穷游网（出境自助游社区与攻略）', url: 'https://www.qyer.com/' },
  },
  '社区团购团长': {
    book: { title: '流量池', author: '杨飞', why: '系统讲裂变与私域打法，社区团购获客转化实用参考' },
    reference: { name: '人人都是产品经理（含大量私域运营文章）', url: 'https://www.woshipm.com/' },
  },
};
