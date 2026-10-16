/**
 * 职业级专属学习资源：视频 / 文档与论坛 / 书籍 三类。
 *
 * 只收录实测可达的链接（curl 返回 200，或 403 即站点在线但拦截爬虫）；
 * 未验证成功的链接一律不写入，绝不编造。书籍以真实存在、可购买为准，不标 ISBN。
 * 键 = 职业名（与 careers.ts 的 name 字段精确一致）。没有对应条目的职业，页面如实显示"资源整理中"。
 */

import { medicalResources } from './resources/medical';
import { financeResources } from './resources/finance';
import { techResources } from './resources/tech';
import { educationResources } from './resources/education';
import { managementResources } from './resources/management';
import { scienceResources } from './resources/science';
import { lawResources } from './resources/law';
import { designResources } from './resources/design';
import { engineeringResources } from './resources/engineering';
import { salesResources } from './resources/sales';
import { mediaResources } from './resources/media';
import { serviceResources } from './resources/service';
import { energyResources } from './resources/energy';
import { supplementResources01 } from './resources/supplement-01';
import { supplementResources02 } from './resources/supplement-02';
import { supplementResources03 } from './resources/supplement-03';
import { supplementResources04 } from './resources/supplement-04';
import { supplementResources05 } from './resources/supplement-05';
import { supplementResources06 } from './resources/supplement-06';
import { supplementResources07 } from './resources/supplement-07';
import { supplementResources08 } from './resources/supplement-08';
import { supplementResources09 } from './resources/supplement-09';
import { supplementResources10 } from './resources/supplement-10';
import { supplementResources11 } from './resources/supplement-11';

export interface CareerResourceLink {
  title: string;
  url: string;
  /** 来源平台，如 Coursera、B站、官方文档 */
  source: string;
  note?: string;
  /**
   * 这条链接是"社区/论坛"而不是"文档"。
   *
   * 2026-10-12 加。资源面板原本就把第二组标题写成「文档与论坛」，但四类资源审计发现
   * 论坛这一类此前一条都没配过——栏目留了位、数据是空的。加这个字段后，
   * 页面把 docs 拆成「文档」与「论坛社区」两组渲染，一眼能看出哪些是可读的资料、
   * 哪些是能提问、能看别人实战的地方。缺省即文档，不影响任何历史数据。
   */
  kind?: 'community';
}

export interface CareerResourceBook {
  title: string;
  author: string;
  /** 为什么适合这份职业的自学者，≤40 字 */
  why?: string;
}

export interface CareerResourceSet {
  videos?: CareerResourceLink[];
  docs?: CareerResourceLink[];
  books?: CareerResourceBook[];
}

const LEGACY_RESOURCES: Record<string, CareerResourceSet> = {
  // ---- 黄金赛道 · 科技 ----
  '数据科学家': {
    docs: [
      { title: 'scikit-learn 官方文档', url: 'https://scikit-learn.org/stable/', source: '官方文档' },
      { title: 'Kaggle Learn 免费微课程', url: 'https://www.kaggle.com/learn', source: 'Kaggle', note: '边学边做数据竞赛题' },
    ],
    books: [{ title: '利用Python进行数据分析（第3版）', author: 'Wes McKinney', why: 'pandas 作者亲写，数据分析自学首选，实战性强' }],
  },
  '网络安全专家': {
    videos: [{ title: 'IBM Cybersecurity Analyst Professional Certificate', url: 'https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst', source: 'Coursera' }],
    docs: [{ title: 'OWASP Top 10（Web 十大安全风险官方项目）', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP' }],
    books: [{ title: '白帽子讲Web安全', author: '吴翰清', why: '阿里安全专家经典，Web 安全知识体系完整易懂' }],
  },
  '云架构师': {
    docs: [{ title: 'AWS Well-Architected Framework（官方架构最佳实践）', url: 'https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html', source: 'AWS 官方' }],
    books: [{ title: 'SRE：Google运维解密', author: 'Betsy Beyer 等（Google SRE 团队）', why: 'Google 官方出品，云上可靠架构设计必读' }],
  },
  '区块链开发工程师': {
    docs: [{ title: 'Solidity 官方文档', url: 'https://docs.soliditylang.org/en/latest/', source: '官方文档' }],
    books: [{ title: '精通以太坊（Mastering Ethereum）', author: 'Andreas M. Antonopoulos、Gavin Wood', why: '以太坊开发圣经，智能合约与 DApp 原理讲透' }],
  },
  '嵌入式系统工程师': {
    docs: [{ title: 'FreeRTOS 官网与文档（主流嵌入式 RTOS）', url: 'https://www.freertos.org/', source: '官方文档' }],
    books: [{ title: '嵌入式Linux应用开发完全手册', author: '韦东山', why: '国内嵌入式 Linux 经典，从裸机到驱动全覆盖' }],
  },
  '大数据工程师': {
    videos: [{ title: '尚硅谷Hadoop教程（3.x 搭建到集群调优，178 集）', url: 'https://www.bilibili.com/video/BV1Qp4y1n7EN/', source: 'B站' }],
    docs: [{ title: 'Apache Spark 官方文档', url: 'https://spark.apache.org/docs/latest/', source: '官方文档' }],
    books: [{ title: 'Hadoop权威指南：大数据的存储与分析（第4版）', author: 'Tom White', why: 'Hadoop 生态权威之作，大数据自学基础必读' }],
  },
  'NLP工程师': {
    videos: [
      { title: 'CS224N 自然语言处理与深度学习（斯坦福）', url: 'https://web.stanford.edu/class/cs224n/', source: '斯坦福', note: '官方课程主页，含讲义与作业' },
    ],
    docs: [{ title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', source: '官方文档' }],
    books: [{ title: '自然语言处理入门', author: '何晗', why: 'HanLP 作者亲写，理论加代码，中文 NLP 实战首选' }],
  },
  '计算机视觉工程师': {
    docs: [
      { title: 'OpenCV 官方文档', url: 'https://docs.opencv.org/4.x/', source: '官方文档' }
    ],
    books: [{ title: '数字图像处理（第3版）', author: 'Rafael C. Gonzalez（冈萨雷斯）', why: '图像处理领域圣经，打牢计算机视觉理论基础' }],
  },
  '推荐系统工程师': {
    videos: [{ title: 'Recommender Systems Specialization（明尼苏达大学）', url: 'https://www.coursera.org/specializations/recommender-systems', source: 'Coursera' }],
    docs: [{ title: 'RecBole 官方文档（PyTorch 推荐系统框架，94 种算法）', url: 'https://recbole.io/docs/', source: '官方文档' }],
    books: [{ title: '推荐系统实践', author: '项亮', why: '国内推荐系统开山经典，算法与工程思路清晰' }],
  },
  '量化交易工程师': {
    docs: [{ title: 'VeighNa（vn.py）开源量化交易框架官网', url: 'https://www.vnpy.com/', source: '开源项目' }],
    books: [{ title: '量化交易：如何建立自己的算法交易事业', author: 'Ernest P. Chan（欧内斯特·陈）', why: '量化入门经典，手把手搭建个人算法交易体系' }],
  },
  // ---- 高危赛道 · 传媒/商业 ----
  '内容创作者/KOL': {
    docs: [{ title: '新榜（内容产业与 KOL 数据平台）', url: 'https://www.newrank.cn/', source: '行业平台' }],
    books: [{ title: '爆款文案', author: '关健明', why: '拆解爆款带货文案的写作套路，适合内容变现入门' }],
  },
  '视频剪辑师': {
    books: [{ title: '剪辑的语法', author: '罗伊·汤普森、克里斯托弗·鲍恩', why: '镜头组接的经典入门教材，剪辑基本功系统透彻' }],
  },
  '新媒体运营': {
    docs: [{ title: '人人都是产品经理（运营从业者社区）', url: 'https://www.woshipm.com/', source: '行业社区' }],
    books: [{ title: '从零开始做运营', author: '张亮', why: '运营入门经典，系统讲透内容、用户、活动三大模块' }],
  },
  '新闻记者': {
    books: [{ title: '哈佛非虚构写作课：怎样讲好一个故事', author: '马克·克雷默、温迪·考尔 编', why: '非虚构写作权威文集，选题采访到叙事成稿全覆盖' }],
  },
  '美食博主': {
    docs: [{ title: '下厨房（中文美食菜谱社区）', url: 'https://www.xiachufang.com/', source: '行业社区' }],
    books: [{ title: '鱼翅与花椒', author: '扶霞·邓洛普', why: '美食写作的典范，示范如何把食物写成动人的故事' }],
  },
  '旅游博主': {
    docs: [{ title: '穷游网（出境自助游社区与攻略）', url: 'https://www.qyer.com/', source: '行业社区' }],
    books: [{ title: '背包十年', author: '小鹏', why: '中国职业旅行开拓者自述，展示旅行如何做成事业' }],
  },
  '社区团购团长': {
    videos: [
      { title: '20节课全体系私域/社群运营', url: 'https://www.bilibili.com/video/BV1dP411g73U', source: 'Bilibili', note: '社群团购运营课' },
    ],
    docs: [
      { title: 'reddit · r/startups', url: 'https://www.reddit.com/r/startups/', source: '行业社区', note: '初创社区', kind: 'community' },
{ title: '人人都是产品经理（含大量私域运营文章）', url: 'https://www.woshipm.com/', source: '行业社区' }],
    books: [
      { title: '参与感', author: '黎万强', why: '社区运营的经典案例' },
{ title: '流量池', author: '杨飞', why: '系统讲裂变与私域打法，社区团购获客转化实用参考' }],
  },
  // ---- 黄金赛道 · 科技第二批 ----
  'Rust开发工程师': {
    docs: [{ title: 'The Rust Programming Language（在线阅读）', url: 'https://doc.rust-lang.org/book/', source: '官方文档', note: '官方 The Book，免费在线读' }],
    books: [{ title: 'Rust程序设计语言（The Rust Programming Language）', author: 'Steve Klabnik、Carol Nichols', why: '官方 The Book，Rust 自学的唯一正统入口' }],
  },
  '算法工程师': {
    videos: [{ title: 'MIT 6.006 算法导论（麻省理工公开课）', url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/', source: 'MIT OCW', note: '全套讲义与视频免费' }],
    docs: [{ title: '力扣 LeetCode（题库 + 官方学习计划）', url: 'https://leetcode.cn/', source: '刷题平台' }],
    books: [{ title: '算法导论', author: 'Thomas H. Cormen 等', why: '算法领域圣经，打牢工程师底层功力' }],
  },
  '音视频开发工程师': {
    docs: [{ title: 'FFmpeg 官方文档', url: 'https://ffmpeg.org/documentation.html', source: '官方文档' }],
    books: [{ title: 'FFmpeg从入门到精通', author: '刘歧', why: '国内 FFmpeg 实战代表作，音视频开发绕不开' }],
  },
  '自动驾驶工程师': {
    books: [{ title: '概率机器人', author: 'Sebastian Thrun 等', why: '感知与定位的理论基石，自动驾驶算法必修' }],
  },
  // ---- 高危赛道第二批 ----
  '电话销售': {
    docs: [
      { title: 'reddit · r/advertising', url: 'https://www.reddit.com/r/advertising/', source: '行业社区', note: '广告社区', kind: 'community' },

      { title: '销售管理（华中农业大学）', url: 'https://www.icourse163.org/course/HZAU-1003244009', source: '中国大学MOOC', note: '销售队伍设计与管理的标准课程' },
    ],
    videos: [
      { title: '打工皇帝养成记：电话销售篇', url: 'https://www.bilibili.com/video/BV1s8Hrz8Eo8', source: 'Bilibili', note: '电话销售实务' },
    ],
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '销售心理的经典' },
{ title: 'SPIN销售巨人：大订单销售训练手册', author: '尼尔·雷克汉姆', why: '销售方法论鼻祖，把话术升级为可复制的提问模型' }],
  },
  '银行柜员': {
    docs: [
      { title: 'reddit · r/FinancialCareers', url: 'https://www.reddit.com/r/FinancialCareers/', source: '行业社区', note: '银行从业者职业社区', kind: 'community' },

      { title: '商业银行业务与经营', url: 'https://www.icourse163.org/course/YEU-1485679165', source: '中国大学MOOC', note: '银行柜面与业务经营课程' },
    ],
    videos: [
      { title: '商业银行业务从基础到进阶（全48集）', url: 'https://www.bilibili.com/video/BV1JX4y1q75i', source: 'Bilibili', note: '银行业务全景课' },
    ],
    books: [
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行业务与资产负债管理教材' },
{ title: '手把手教你读财报', author: '唐朝', why: '零基础看懂三张表，柜员转岗财务分析的敲门砖' }],
  },
  '插画师': {
    docs: [
      { title: 'reddit · r/illustration', url: 'https://www.reddit.com/r/illustration/', source: '行业社区', note: '插画师全球社区', kind: 'community' },

      { title: '视觉传达设计（华中农业大学）', url: 'https://www.icourse163.org/course/HZAU-1466076214', source: '中国大学MOOC', note: '图形创意与色彩表现的课程根基' },
    ],
    videos: [
      { title: 'B站最完整的绘画教程（插画/厚涂/原画/板绘）', url: 'https://www.bilibili.com/video/BV1d64y197gj', source: 'Bilibili', note: '绘画全风格系统课' },
    ],
    books: [
      { title: '色彩与光线', author: '詹姆斯·格尔尼', why: '绘画光色理论的必读经典' },
{ title: '伯里曼人体结构绘画教学', author: '乔治·伯里曼', why: '人体结构素描经典，插画基本功必修' }],
  },
  '摄影师': {
    docs: [
      { title: 'reddit · r/Photography', url: 'https://www.reddit.com/r/Photography/', source: '行业社区', note: '摄影全球社区', kind: 'community' },

      { title: '摄影基础（国家一流课程）', url: 'https://www.icourse163.org/course/-1001958013', source: '中国大学MOOC', note: '曝光构图用光的国家级课程' },
    ],
    videos: [
      { title: '从零开始学摄影：20节课从小白到大师', url: 'https://www.bilibili.com/video/BV1pv411H78e', source: 'Bilibili', note: '摄影系统课' },
    ],
    books: [
      { title: '美国纽约摄影学院摄影教材', author: '纽约摄影学院', why: '摄影技艺的百科全书式教材' },
{ title: '纽约摄影学院摄影教材', author: '纽约摄影学院', why: '中文摄影入门圣经，构图用光体系完整' }],
  },
  '动画师': {
    docs: [
      { title: 'reddit · r/animation', url: 'https://www.reddit.com/r/animation/', source: '行业社区', note: '动画师全球社区', kind: 'community' },

      { title: '动画运动规律（无锡城市职业技术学院）', url: 'https://www.icourse163.org/course/WXSTC-1469677173', source: '中国大学MOOC', note: '运动规律与原动画规律' },
    ],
    videos: [
      { title: '全网最漫长的动画教程', url: 'https://www.bilibili.com/video/BV1v1aZ6zEjg', source: 'Bilibili', note: '动画制作系统课' },
    ],
    books: [
      { title: '动画师生存手册', author: '理查德·威廉姆斯', why: '动画十二法则的作者亲授' },
{ title: '原动画基础教程：动画师的生存工具', author: '理查德·威廉姆斯', why: '动画运动规律第一经典，迪士尼级方法论' }],
  },
  '平面设计师': {
    videos: [
      { title: '平面设计全套系统课程（107集）', url: 'https://www.bilibili.com/video/BV1gh411C7B1', source: 'Bilibili', note: '平面设计系统课' },
    ],
    docs: [
      { title: 'reddit · r/graphic_design', url: 'https://www.reddit.com/r/graphic_design/', source: '行业社区', note: '平面设计全球社区', kind: 'community' },
{ title: 'Figma 官方资源库（教程与模板）', url: 'https://www.figma.com/resource-library/', source: '官方文档' }],
    books: [
      { title: '写给大家看的设计书', author: '罗宾·威廉姆斯', why: '版式四大原则的入门经典' },
{ title: '设计中的设计', author: '原研哉', why: '重新理解设计思维，从技法上升到理念' }],
  },
  // ---- 第一批 ----
  '全栈开发工程师': {
    videos: [
      { title: 'CS50 计算机科学导论（哈佛）', url: 'https://cs50.harvard.edu/x/', source: 'edX / 哈佛', note: '零基础建立全栈所需的计算机全局观' },
    ],
    docs: [
      { title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn_web_development', source: '官方文档' },
      { title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/current/', source: '官方文档' },
    ],
    books: [{ title: 'JavaScript高级程序设计（第4版）', author: 'Nicholas C. Zakas', why: '前端 JavaScript 体系化经典，打通浏览器与服务端' }],
  },
  '产品经理': {
    books: [{ title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '硅谷产品管理经典，讲透产品发现与团队方法' }],
  },
  'DevOps工程师': {
    docs: [
      { title: 'Docker 官方文档', url: 'https://docs.docker.com/', source: '官方文档' },
      { title: 'Kubernetes 官方教程', url: 'https://kubernetes.io/docs/tutorials/', source: '官方文档' },
    ],
    books: [{ title: '加速：精益软件与DevOps的科学', author: 'Nicole Forsgren、Jez Humble、Gene Kim', why: '用数据论证 DevOps 效能指标，理论与实践兼备' }],
  },
  '前端开发工程师': {
    docs: [
      { title: 'MDN JavaScript 参考（英文）', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', source: '官方文档' },
      { title: 'MDN JavaScript 指南（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript', source: '官方文档' },
    ],
    books: [{ title: '你不知道的JavaScript（上卷）', author: 'Kyle Simpson', why: '深入理解 JavaScript 作用域与原型，前端进阶必读' }],
  },
  '后端开发工程师': {
    videos: [{ title: 'CS50 计算机科学导论（哈佛）', url: 'https://cs50.harvard.edu/x/', source: 'edX / 哈佛' }],
    docs: [{ title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/current/', source: '官方文档' }],
    books: [{ title: '数据密集型应用系统设计', author: 'Martin Kleppmann', why: '后端分布式数据系统设计的权威入门，原理讲得透' }],
  },
  '移动端开发工程师': {
    books: [{ title: 'Android开发艺术探索', author: '任玉刚', why: '国内 Android 进阶经典，讲清视图与系统机制' }],
  },
  '测试开发工程师': {
    docs: [{ title: 'Selenium 官方文档', url: 'https://www.selenium.dev/documentation/', source: '官方文档' }],
    books: [{ title: 'Google软件测试之道', author: 'James Whittaker 等', why: 'Google 测试工程实践总结，建立质量保障思维' }],
  },
  '游戏开发工程师': {
    docs: [{ title: 'Unity 官方手册（英文）', url: 'https://docs.unity3d.com/Manual/index.html', source: '官方文档' }],
    books: [{ title: '游戏引擎架构', author: 'Jason Gregory', why: '游戏引擎底层原理的系统讲解，适合深入进阶' }],
  },
  '物联网工程师': {
    docs: [{ title: 'AWS IoT Core 开发者指南', url: 'https://docs.aws.amazon.com/iot/latest/developerguide/', source: 'AWS 官方' }],
  },
  'AR/VR开发工程师': {
    docs: [{ title: 'Unity 官方手册（英文，含 XR 开发）', url: 'https://docs.unity3d.com/Manual/index.html', source: '官方文档' }],
  },
  '数据库管理员': {
    docs: [
      { title: 'MySQL 官方文档', url: 'https://dev.mysql.com/doc/', source: '官方文档' },
      { title: 'PostgreSQL 官方文档', url: 'https://www.postgresql.org/docs/current/', source: '官方文档' },
    ],
    books: [{ title: 'MySQL必知必会', author: 'Ben Forta', why: '数据库操作入门首选，SQL 基础扎实' }],
  },
  '系统管理员': {
    docs: [{ title: 'RFC 文档库（网络协议原始标准）', url: 'https://www.rfc-editor.org/', source: '标准组织' }],
    books: [{ title: '鸟哥的Linux私房菜（基础学习篇 第4版）', author: '鸟哥（荆涛）', why: '国内 Linux 系统管理入门经典，贴近实际操作' }],
  },
  '技术支持工程师': {
    books: [{ title: '非暴力沟通', author: 'Marshall B. Rosenberg', why: '倾听与表达的方法论，客服支持岗位最需要的能力' }],
  },
  'Python开发工程师': {
    videos: [{ title: 'CS50 计算机科学导论（哈佛）', url: 'https://cs50.harvard.edu/x/', source: 'edX / 哈佛' }],
    docs: [{ title: 'Python 官方教程（中文）', url: 'https://docs.python.org/zh-cn/3/tutorial/index.html', source: '官方文档' }],
    books: [{ title: '流畅的Python（第2版）', author: 'Luciano Ramalho', why: '深入讲解 Python 语言特性，从会用到写得地道' }],
  },
  'Java开发工程师': {
    docs: [{ title: 'Oracle Java 官方文档', url: 'https://docs.oracle.com/en/java/', source: '官方文档' }],
    books: [{ title: 'Effective Java（第3版）', author: 'Joshua Bloch', why: 'Java 最佳实践的经典条目集，进阶必读' }],
  },
  'Go开发工程师': {
    books: [{ title: 'Go程序设计语言', author: 'Alan A. A. Donovan、Brian W. Kernighan', why: 'Go 语言权威教材，并发与工程实践讲解系统' }],
  },
  'C++开发工程师': {
    docs: [{ title: 'cppreference.com（C++ 标准库参考）', url: 'https://en.cppreference.com/w/', source: '官方参考' }],
    books: [{ title: 'C++ Primer 中文版（第5版）', author: 'Stanley B. Lippman 等', why: 'C++ 入门到进阶的标准教材，语言细节覆盖完整' }],
  },
  '网络工程师': {
    docs: [{ title: 'RFC 文档库（网络协议原始标准）', url: 'https://www.rfc-editor.org/', source: '标准组织' }],
    books: [{ title: 'TCP/IP详解 卷1：协议', author: 'W. Richard Stevens', why: '网络协议的经典深度读物，排障与设计基础' }],
  },
  '机器人工程师': {
    docs: [{ title: 'ROS 官方网站与文档', url: 'https://www.ros.org/', source: '官方文档' }],
    books: [{ title: '机器人学导论', author: 'John J. Craig', why: '机器人运动学与控制的入门经典，理论与建模兼顾' }],
  },
  '芯片设计工程师': {
    books: [{ title: '数字设计和计算机体系结构（第2版）', author: 'David Money Harris、Sarah L. Harris', why: '从数字电路到 CPU 体系结构的系统教材' }],
  },
  '隐私计算工程师': {
    books: [{ title: '应用密码学（第2版）', author: 'Bruce Schneier', why: '密码学原理与协议的经典参考，隐私计算基础' }],
  },
  '边缘计算工程师': {
    docs: [{ title: 'KubeEdge 官方文档', url: 'https://www.kubeedge.io/docs/', source: '官方文档' }],
  },
  'AI产品经理': {
    books: [{ title: '精益创业', author: 'Eric Ries', why: '用小步快跑验证需求，适合 AI 产品的试错式探索' }],
  },
  '技术项目经理': {
    docs: [{ title: 'Scrum 指南（官方中文可查）', url: 'https://scrumguides.org/', source: '官方文档' }],
    books: [{ title: '敏捷软件开发：原则、模式与实践', author: 'Robert C. Martin', why: '敏捷开发的原则与实践体系，团队协作的理论基础' }],
  },
  'IT审计师': {
    docs: [{ title: 'ISACA 官方网站（CISA/CISM 认证）', url: 'https://www.isaca.org/', source: '行业协会' }],
  },
  'SRE工程师': {
    books: [{ title: '凤凰项目', author: 'Gene Kim、Kevin Behr、George Spafford', why: '用小说形式讲透 DevOps 与运维协作，入门轻松' }],
  },
  '无线通信工程师': {
    docs: [{ title: '3GPP 官方网站（移动通信标准）', url: 'https://www.3gpp.org/', source: '标准组织' }],
  },
  '编译器开发工程师': {
    docs: [{ title: 'LLVM 官方文档', url: 'https://llvm.org/docs/', source: '官方文档' }],
    books: [{ title: '编译原理（第2版）', author: 'Alfred V. Aho 等', why: '经典“龙书”，编译前端与优化的理论基础' }],
  },
  'IT运维工程师': {
    books: [{ title: 'Linux 命令行与shell脚本编程大全（第3版）', author: 'Christine Bresnahan、Richard Blum', why: '日常运维的命令与脚本自动化，动手导向强' }],
  },
  '语音识别工程师': {
    docs: [{ title: 'Kaldi 语音识别工具包官网', url: 'https://kaldi-asr.org/', source: '开源项目' }],
    books: [{ title: '解析深度学习：语音识别实践', author: '俞栋、邓力', why: '国内语音识别深度学习实践的权威著作' }],
  },
  '知识图谱工程师': {
    docs: [{ title: 'Neo4j 官方文档', url: 'https://neo4j.com/docs/', source: '官方文档' }],
    books: [{ title: '知识图谱', author: '刘峤、李杨等', why: '国内知识图谱体系化教材，覆盖构建与应用' }],
  },
  'GPU编程工程师': {
    books: [{ title: 'CUDA C编程权威指南', author: 'John Cheng、Max Grossman、Ty McKercher', why: 'CUDA 并行编程的权威教材，从原理到优化' }],
  },
  '金融科技工程师': {
    books: [{ title: 'Python金融大数据分析', author: 'Yves Hilpisch', why: '用 Python 处理金融数据与建模，金融科技入门实用' }],
  },
  '企业架构师': {
    books: [{ title: '架构整洁之道', author: 'Robert C. Martin', why: '从设计原则到系统结构，建立架构思维的基础' }],
  },
  'VR游戏开发': {
    docs: [{ title: 'Unity 官方手册（英文）', url: 'https://docs.unity3d.com/Manual/index.html', source: '官方文档' }],
    books: [{ title: '游戏设计艺术（第2版）', author: 'Jesse Schell', why: '游戏设计思维的系统讲解，交互体验设计必备' }],
  },
  '代码审计工程师': {
    docs: [
      { title: 'OWASP Code Review Guide（代码审计指南）', url: 'https://owasp.org/www-project-code-review-guide/', source: 'OWASP' },
      { title: 'OWASP Top 10（Web 十大安全风险）', url: 'https://owasp.org/www-project-top-ten/', source: 'OWASP' },
    ],
    books: [{ title: '白帽子讲Web安全', author: '吴翰清', why: 'Web 安全漏洞原理的国内经典，代码审计入门首选' }],
  },
  // ---- 第二批：法律 / 金融 / 医疗 / 教育 / 管理 / 科研（2026-10-09 curl 实测） ----
  '律师': {
    docs: [{ title: '中国裁判文书网（公开的真实判决书）', url: 'https://wenshu.court.gov.cn/', source: '官方平台', note: '读真实判例是入门最快的方式' }],
    books: [
      { title: '法律的道路', author: '小奥利弗·温德尔·霍姆斯', why: '美国法学的奠基文章，讲清法律实际如何运作' },
      { title: '正义的理念', author: '阿马蒂亚·森', why: '从公平出发理解法律与正义，拓宽法律思维' },
    ],
  },
  '合规师': {
    docs: [

    ],
  },
  '专利代理人': {
    docs: [{ title: '世界知识产权组织（WIPO）官网', url: 'https://www.wipo.int/', source: '国际组织' }],
  },
  '劳动法律师': {
    docs: [{ title: '国际劳工组织（ILO）官网', url: 'https://www.ilo.org/', source: '国际组织' }],
  },
  '国际法律师': {
    docs: [{ title: '世界贸易组织（WTO）官网与法律文件', url: 'https://www.wto.org/', source: '国际组织' }],
  },
  '公证员': {
    docs: [{ title: '中国政府网（法规库入口）', url: 'https://www.gov.cn/', source: '官方平台' }],
  },
  '基金经理': {
    videos: [{ title: 'Financial Markets（耶鲁大学，Robert Shiller）', url: 'https://www.coursera.org/learn/financial-markets-global', source: 'Coursera' }],
    docs: [
      { title: 'reddit · r/CFA', url: 'https://www.reddit.com/r/CFA/', source: '行业社区', note: 'CFA 考证与投资职业社区', kind: 'community' },
{ title: 'CFA 协会学习平台', url: 'https://www.cfainstitute.org/', source: '行业协会' }],
    books: [
      { title: '共同基金常识', author: '约翰·博格', why: '指数化投资与基金运作的底层逻辑' },
{ title: '漫步华尔街', author: '伯顿·马尔基尔', why: '资产配置与指数投资的经典入门，基金经理必读' }],
  },
  '风险分析师': {
    docs: [
      { title: 'reddit · r/investing', url: 'https://www.reddit.com/r/investing/', source: '行业社区', note: '投资讨论全球社区', kind: 'community' },

      { title: '商业银行业务与经营（武汉理工大学）', url: 'https://higher.smartedu.cn/course/62354c7b9906eace048c4b48', source: '智慧教育平台', note: '含征信、大数据信用评估与开放银行专题' },
    ],
    videos: [
      { title: '金融风控课程：信用评分卡与风控建模', url: 'https://www.bilibili.com/video/BV1RL8kzTErw', source: 'Bilibili', note: '评分卡模型全流程' },
    ],
    books: [
      { title: '风险管理与金融机构', author: '约翰·赫尔', why: '风险度量与管理体系的标准框架' },
{ title: '风险管理与金融机构（第5版）', author: 'John C. Hull', why: '金融风险度量与管理的标准教材' }],
  },
  '投资银行家': {
    videos: [
      { title: '投行IBD和精品投行FA怎么选', url: 'https://www.bilibili.com/video/BV1rX4y1x7KD', source: 'Bilibili', note: '投行职业路径对比' }
    ],
    docs: [
      { title: '投资银行学', url: 'https://www.icourse163.org/course/-1449724164', source: '中国大学MOOC', note: 'IPO、并购与资产证券化全程课' },

      { title: 'reddit · r/FinancialCareers', url: 'https://www.reddit.com/r/FinancialCareers/', source: '行业社区', note: '金融职业发展与求职讨论', kind: 'community' }
    ],
    books: [
      { title: '门口的野蛮人', author: '布赖恩·伯勒', why: '杠杆收购史上的经典实录' },
{ title: '投资银行：估值、杠杆收购、兼并与收购', author: 'Joshua Rosenbaum、Joshua Pearl', why: '投行估值与并购建模的实操圣经' }],
  },
  '量化分析师': {
    docs: [
      { title: '聚宽量化社区', url: 'https://www.joinquant.com/', source: '行业社区', note: '国内量化研究社区，策略与因子讨论', kind: 'community' },

      { title: '证券投资学（四川大学，SPOC）', url: 'https://www.icourse163.org/course/SCU-1462935166', source: '中国大学MOOC', note: '债券、股票估值与组合理论全章' },
    ],
    videos: [
      { title: '普通人如何从0开始做量化（保姆级全流程）', url: 'https://www.bilibili.com/video/BV1JY8F61E6y', source: 'Bilibili', note: '量化职业路径与入门全流程' },
    ],
    books: [
      { title: '打开量化投资的黑箱', author: '里纳尔迪', why: '量化策略从数据到执行的完整链条' },
{ title: '量化投资：策略与技术', author: '丁鹏', why: '国内量化投资体系化入门，策略研发思路清晰' }],
  },
  '金融分析师': {
    videos: [
      { title: '北京大学《价值投资课程》', url: 'https://www.bilibili.com/video/BV19MGi6dEHC', source: 'Bilibili', note: '基本面分析框架' },
    ],
    docs: [
      { title: 'reddit · r/investing', url: 'https://www.reddit.com/r/investing/', source: '行业社区', note: '投资分析全球社区', kind: 'community' },
{ title: 'CFA 协会学习平台', url: 'https://www.cfainstitute.org/', source: '行业协会' }],
    books: [
      { title: '证券分析', author: '格雷厄姆', why: '基本面分析的奠基之作' },
{ title: '财务报表分析', author: 'K. R. Subramanyam', why: '从报表读出企业经营本质，分析师基本功' }],
  },
  '理财规划师': {
    videos: [
      { title: '理财规划计算工具与方法', url: 'https://www.bilibili.com/video/BV1EyMVzuE42', source: 'Bilibili', note: '理财规划实操' }
    ],
    docs: [
      { title: '个人理财', url: 'https://www.icourse163.org/course/-1464150162', source: '中国大学MOOC', note: '八大理财规划与资产配置' },

      { title: 'reddit · r/financialindependence', url: 'https://www.reddit.com/r/financialindependence/', source: '行业社区', note: '长期财务规划社区', kind: 'community' }
    ],
    books: [
      { title: '漫步华尔街', author: '马尔基尔', why: '生命周期资产配置的理性框架' },
{ title: '穷爸爸富爸爸', author: '罗伯特·清崎', why: '用资产与负债视角理解个人理财，入门读物' }],
  },
  '金融合规官': {
    books: [
      { title: '货币金融学', author: '米什金', why: '金融监管的货币银行学基础' },
      { title: '置身事内', author: '兰小欢', why: '中国金融监管体制的运行逻辑' }
    ],
    videos: [
      { title: '金融监管理论与监管体制', url: 'https://www.bilibili.com/video/BV1VG4y1n7Xy', source: 'Bilibili', note: '金融监管框架' }
    ],
    docs: [
      { title: '金融学（首都经济贸易大学）', url: 'https://higher.smartedu.cn/course/6ab054a3b44e493c76f833eb', source: '国家高等教育智慧教育平台', note: '银行监管与金融体系入门全景' },

      { title: 'reddit · r/FinancialCareers', url: 'https://www.reddit.com/r/FinancialCareers/', source: '行业社区', note: '金融合规职业社区', kind: 'community' }
    ],
  },
  '反洗钱分析师': {
    books: [
      { title: '货币金融学', author: '米什金', why: '反洗钱背后的货币银行体系' },
      { title: '置身事内', author: '兰小欢', why: '中国金融监管的运行逻辑' }
    ],
    videos: [
      { title: '反洗钱基础知识入门', url: 'https://www.bilibili.com/video/BV1C5dzYwEzV', source: 'Bilibili', note: '反洗钱入门' }
    ],
    docs: [
      { title: '金融学（首都经济贸易大学）', url: 'https://higher.smartedu.cn/course/6ab054a3b44e493c76f833eb', source: '国家高等教育智慧教育平台', note: '银行监管与金融体系入门全景' },

      { title: '财联社', url: 'https://www.cls.cn/', source: '行业社区', note: '反洗钱监管动态', kind: 'community' }
    ],
  },
  '临床医生': {
    videos: [
      { title: '诊断学基础', url: 'https://www.bilibili.com/video/BV1tV4y167JS', source: 'Bilibili', note: '临床问诊与查体的根基课' },
    ],
    docs: [
      { title: 'reddit · r/medicine', url: 'https://www.reddit.com/r/medicine/', source: '行业社区', note: '临床医生全球社区', kind: 'community' },
{ title: '世界卫生组织（WHO）官网与指南', url: 'https://www.who.int/', source: '国际组织' }],
    books: [
      { title: '诊断学', author: '万学红', why: '问诊查体与临床思维的根基教材' },
{ title: '希氏内科学（Harrison 内科学）', author: 'Dennis L. Kasper 等', why: '内科学最权威的参考教材' }],
  },
  '护士': {
    books: [
      { title: '基础护理学', author: '李小寒', why: '护理操作与流程的人卫教材' },
      { title: '薄世宁医学通识讲义', author: '薄世宁', why: '临床思维的通识底座' }
    ],
    videos: [
      { title: '308护理综合：护理学基础精讲', url: 'https://www.bilibili.com/video/BV1UE411i7j5', source: 'Bilibili', note: '护理系统课程' }
    ],
    docs: [
      { title: '护理学导论（西安交通大学）', url: 'https://www.icourse163.org/course/-1456748161', source: '中国大学MOOC', note: '护理程序与健康管理基础' },

      { title: 'reddit · r/nursing', url: 'https://www.reddit.com/r/nursing/', source: '行业社区', note: '护士全球社区', kind: 'community' }
    ],
  },
  '药剂师': {
    videos: [
      { title: '药理学', url: 'https://www.bilibili.com/video/BV1bP4y1P76R', source: 'Bilibili', note: '药物作用机制的体系课' }
    ],
    docs: [
      { title: '临床药学实践全14讲', url: 'https://www.bilibili.com/video/BV1G8RjBuEem', source: 'Bilibili', note: '医院药学实务系列课' },

      { title: 'reddit · r/pharmacy', url: 'https://www.reddit.com/r/pharmacy/', source: '行业社区', note: '药师全球社区', kind: 'community' }
    ],
    books: [
      { title: '药理学', author: '朱依谆', why: '药物作用机制的人卫标准教材' },
{ title: 'Rang & Dale 药理学（第8版）', author: 'H. P. Rang 等', why: '药理学机制讲解清晰，药剂工作的理论底座' }],
  },
  '营养师': {
    books: [
      { title: '营养学：概念与争论', author: '弗朗西斯·辛泽薇', why: '营养科学框架的经典教材' },
      { title: '中国居民膳食指南', author: '中国营养学会', why: '膳食指导的权威标准' }
    ],
    videos: [
      { title: '营养学（北京大学精品课）', url: 'https://www.bilibili.com/video/BV1SqsqezEA2', source: 'Bilibili', note: '营养学系统课' }
    ],
    docs: [
      { title: '营养与食品卫生学（华中科技大学）', url: 'https://www.icourse163.org/course/-1206892801', source: '中国大学MOOC', note: '基础营养到临床营养全链条' },

      { title: 'reddit · r/nutrition', url: 'https://www.reddit.com/r/nutrition/', source: '行业社区', note: '营养学全球社区', kind: 'community' }
    ],
  },
  '心理咨询师': {
    videos: [
      { title: '从0开始，心理咨询全流程基础技术系统课', url: 'https://www.bilibili.com/video/BV1Ck4y1e71M', source: 'Bilibili', note: '咨询设置与基本技术' },
    ],
    docs: [
      { title: 'reddit · r/psychotherapy', url: 'https://www.reddit.com/r/psychotherapy/', source: '行业社区', note: '心理治疗师全球社区', kind: 'community' },
{ title: '美国心理学会（APA）官网', url: 'https://www.apa.org/', source: '行业协会' }],
    books: [
      { title: '心理咨询与治疗的理论及实践', author: '杰拉德·科里', why: '咨询流派与技术的体系化教材' },
{ title: '存在主义心理治疗', author: 'Irvin D. Yalom', why: '心理治疗理论与咨询关系的经典读物' }],
  },
  '公共卫生专家': {
    books: [
      { title: '流行病学', author: '詹思延', why: '流行病学研究方法的人卫教材' },
      { title: '枪炮、病菌与钢铁', author: '贾雷德·戴蒙德', why: '传染病与人群健康的宏观视角' },
    ],
    videos: [
      { title: '流行病学（詹思延版教材领学）', url: 'https://www.bilibili.com/video/BV12F411J7SE', source: 'Bilibili', note: '流行病学全书讲解' },
    ],
    docs: [
      { title: 'reddit · r/epidemiology', url: 'https://www.reddit.com/r/epidemiology/', source: '行业社区', note: '流行病学全球社区', kind: 'community' },
{ title: '世界卫生组织（WHO）官网', url: 'https://www.who.int/', source: '国际组织' }],
  },
  '医学研究员': {
    books: [
      { title: '医学统计学', author: '李康', why: '医学科研统计的人卫教材' },
      { title: '循证医学', author: '李幼平', why: '证据医学的方法论教材' },
    ],
    videos: [
      { title: '医学统计学（第二军医大学·贺佳）', url: 'https://www.bilibili.com/video/BV11S4y1M7EG', source: 'Bilibili', note: '医学科研的统计方法课' },
    ],
    docs: [
      { title: 'ResearchGate', url: 'https://www.researchgate.net/', source: '行业社区', note: '全球科研交流平台', kind: 'community' },
{ title: 'Nature 期刊官网（前沿研究）', url: 'https://www.nature.com/', source: '学术期刊' }],
  },
  '大学教授': {
    videos: [
      { title: '上海交通大学：高校教师教学能力入门（全25讲）', url: 'https://www.bilibili.com/video/BV1tG41157Pa', source: 'Bilibili', note: '高校教学能力系统课' },
    ],
    docs: [
      { title: 'reddit · r/Professors', url: 'https://www.reddit.com/r/Professors/', source: '行业社区', note: '大学教授全球社区', kind: 'community' },
{ title: '中华人民共和国教育部官网', url: 'https://www.moe.gov.cn/', source: '官方平台' }],
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '教师职业的经典指南' },
{ title: '大学之用', author: 'Clark Kerr', why: '大学的使命与治理的经典思考' }],
  },
  '幼儿教师': {
    videos: [
      { title: '幼儿游戏与指导（北京师范大学）', url: 'https://www.bilibili.com/video/BV1zQ4y1y7nh', source: 'Bilibili', note: '幼儿游戏理论与实操' }
    ],
    docs: [
      { title: '学前教育原理（陕西师范大学）', url: 'https://www.chinaooc.com.cn/course/6a6a7c70b44e493c768fc309', source: '国家高等教育智慧教育平台', note: '学前教育理论与园所实务' },

      { title: 'reddit · r/ECEProfessionals', url: 'https://www.reddit.com/r/ECEProfessionals/', source: '行业社区', note: '幼教从业者全球社区', kind: 'community' }
    ],
    books: [
      { title: '正面管教', author: '简·尼尔森', why: '幼儿正向引导的经典' },
{ title: '童年的秘密', author: '玛利亚·蒙台梭利', why: '儿童发展与教育观察的经典，幼教入门读物' }],
  },
  '课程设计师': {
    videos: [
      { title: '教案模版：教学设计怎么写', url: 'https://www.bilibili.com/video/BV1Wt4y1r7mX', source: 'Bilibili', note: '教案写作基本功' }
    ],
    docs: [
      { title: '课程与教学论（陕西师范大学）', url: 'https://higher.smartedu.cn/course/66df7d71711dc30c34c4e732', source: '国家高等教育智慧教育平台', note: '课程设计与教学评价原理' },

      { title: 'reddit · r/Teachers', url: 'https://www.reddit.com/r/Teachers/', source: '行业社区', note: '中小学教师全球社区', kind: 'community' }
    ],
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '辅导教学的经典指南' },
{ title: '理解力的培养：逆向课程设计', author: 'Grant Wiggins、Jay McTighe', why: '从目标倒推课程设计，课程设计师的核心方法' }],
  },
  '企业培训师': {
    books: [
      { title: '演讲的力量', author: '克里斯·安德森', why: '公开表达的经典方法论' },
      { title: '学会提问', author: '尼尔·布朗', why: '批判性思维的入门经典' },
    ],
    videos: [
      { title: 'TTT系列：培训的基本原理与培训师职业特征', url: 'https://www.bilibili.com/video/BV1p7411273C', source: 'Bilibili', note: 'TTT 培训师系统课' },
    ],
    docs: [
      { title: 'reddit · r/humanresources', url: 'https://www.reddit.com/r/humanresources/', source: '行业社区', note: '培训与人才发展社区', kind: 'community' },
{ title: 'SHRM 美国人力资源管理协会官网', url: 'https://www.shrm.org/', source: '行业协会' }],
  },
  '心理测评专家': {
    books: [
      { title: '心理与教育测量', author: '戴海崎', why: '心理测量的标准教材' },
      { title: '思考，快与慢', author: '丹尼尔·卡尼曼', why: '测量背后认知科学的根基' },
    ],
    videos: [
      { title: '心理测量学', url: 'https://www.bilibili.com/video/BV1En7BzNEek', source: 'Bilibili', note: '心理测评理论课' },
    ],
    docs: [
      { title: 'reddit · r/AcademicPsychology', url: 'https://www.reddit.com/r/AcademicPsychology/', source: '行业社区', note: '心理学学术社区', kind: 'community' },
{ title: '美国心理学会（APA）官网', url: 'https://www.apa.org/', source: '行业协会' }],
  },
  '教育技术专家': {
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
      { title: '精益创业', author: '埃里克·莱斯', why: '教育产品验证的方法论' }
    ],
    videos: [
      { title: '产品经理案例分析：全面剖析在线教育行业', url: 'https://www.bilibili.com/video/BV1fb411x7Sq', source: 'Bilibili', note: '在线教育产品案例课' }
    ],
    docs: [
      { title: '现代教育技术（江苏第二师范学院）', url: 'https://higher.smartedu.cn/course/67ad2af0225d72705e160b96', source: '国家高等教育智慧教育平台', note: '数智化教学设计与工具' },

      { title: 'reddit · r/edtech', url: 'https://www.reddit.com/r/edtech/', source: '行业社区', note: '教育科技全球社区', kind: 'community' }
    ],
  },
  '人力资源总监': {
    books: [
      { title: '人力资源管理', author: '加里·德斯勒', why: 'HR领域的标准教材' },
      { title: '奈飞文化手册', author: '帕蒂·麦考德', why: '人才文化的实操经典' },
    ],
    videos: [
      { title: '从0到1精通人力资源管理（2000分钟）', url: 'https://www.bilibili.com/video/BV1Tgju6LEPh', source: 'Bilibili', note: 'HR全栈系统课' },
    ],
    docs: [
      { title: 'reddit · r/AskHR', url: 'https://www.reddit.com/r/AskHR/', source: '行业社区', note: 'HR问答社区', kind: 'community' },
{ title: 'SHRM 美国人力资源管理协会官网', url: 'https://www.shrm.org/', source: '行业协会' }],
  },
  '财务总监': {
    videos: [
      { title: '钱自严：从总账到总监（CFO的独家财务笔记）', url: 'https://www.bilibili.com/video/BV1b4421Z77o', source: 'Bilibili', note: '财务总监成长课' },
    ],
    docs: [
      { title: 'reddit · r/Accounting', url: 'https://www.reddit.com/r/Accounting/', source: '行业社区', note: '财会从业全球社区', kind: 'community' },
{ title: 'IFRS 国际财务报告准则官网', url: 'https://www.ifrs.org/', source: '国际组织' }],
    books: [
      { title: '财务报表分析', author: '张新民', why: '财报分析权威教材' },
{ title: '公司理财（原书第11版）', author: 'Stephen A. Ross 等', why: '公司财务决策的标准教材，财务总监的理论底座' }],
  },
  '战略顾问': {
    docs: [
      { title: 'reddit · r/consulting', url: 'https://www.reddit.com/r/consulting/', source: '行业社区', note: '咨询从业全球社区', kind: 'community' },

      { title: '战略管理（扬州大学）', url: 'https://www.icourse163.org/course/YZU-1449612163', source: '中国大学MOOC', note: '含公司治理与战略领导力的系统课' },
    ],
    videos: [
      { title: '思维力训练：用框架解决问题（46集）', url: 'https://www.bilibili.com/video/BV1ZW411q7P2', source: 'Bilibili', note: '结构化思维系统课' },
    ],
    books: [
      { title: '麦肯锡方法', author: '艾森·拉塞尔', why: '咨询方法论入门' },
{ title: '竞争战略', author: 'Michael E. Porter', why: '行业竞争与战略定位的奠基之作' }],
  },
  'ESG总监': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳经济的框架之作' },
      { title: '蓝色经济', author: '冈特·鲍利', why: '可持续商业的经典' },
    ],
    videos: [
      { title: '10分钟快速入门ESG', url: 'https://www.bilibili.com/video/BV18Ck3YaE6H', source: 'Bilibili', note: 'ESG入门课' },
    ],
    docs: [
      { title: 'reddit · r/sustainability', url: 'https://www.reddit.com/r/sustainability/', source: '行业社区', note: 'ESG与可持续社区', kind: 'community' },
{ title: '联合国官网（可持续发展目标）', url: 'https://www.un.org/', source: '国际组织' }],
  },
  '气候科学家': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型路线图' },
      { title: '寂静的春天', author: '蕾切尔·卡逊', why: '环境与生态议题的源头之作' },
    ],
    videos: [
      { title: 'Global Warming - Climate 101', url: 'https://www.bilibili.com/video/BV1sC4y1W7FG', source: 'Bilibili', note: '气候变化入门双语课' },
    ],
    docs: [
      { title: 'Earth Science Stack Exchange', url: 'https://earthscience.stackexchange.com/', source: '行业社区', note: '地球科学学术问答社区', kind: 'community' },
{ title: 'IPCC 政府间气候变化专门委员会官网', url: 'https://www.ipcc.ch/', source: '国际组织' }],
  },
  '神经科学家': {
    videos: [
      { title: '浙江大学神经科学基础与疾病全 56 讲', url: 'https://www.bilibili.com/video/BV1Ym4y187ig', source: 'Bilibili', note: '院士团队全程课' },
    ],
    docs: [
      { title: 'reddit · r/neuroscience', url: 'https://www.reddit.com/r/neuroscience/', source: '行业社区', note: '神经科学研究社区', kind: 'community' },
{ title: 'Khan Academy 生物学课程', url: 'https://www.khanacademy.org/science/biology', source: 'Khan Academy', note: '免费基础生物学，打牢神经科学前置知识' }],
    books: [
      { title: '神经科学原理', author: '埃里克·坎德尔', why: '神经科学的圣经级教材' },
{ title: '神经科学：探索脑（第5版）', author: 'Mark F. Bear 等', why: '神经科学本科权威教材，系统讲清脑的结构与功能' }],
  },
  'AI研究员': {
    videos: [
      { title: '带读 AI 经典论文 100 篇', url: 'https://www.bilibili.com/video/BV1tU4y147Ah', source: 'Bilibili', note: '顶级学者逐句带读 AI 奠基论文' },
    ],
    docs: [
      { title: 'reddit · r/MachineLearning', url: 'https://www.reddit.com/r/MachineLearning/', source: '行业社区', note: '机器学习研究社区', kind: 'community' },
{ title: 'PyTorch 官方文档与教程', url: 'https://pytorch.org/tutorials/', source: '官方文档' }],
    books: [
      { title: '人工智能：一种现代方法', author: '斯图尔特·罗素', why: 'AI 研究的全局教科书' },
{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '深度学习理论的权威教材，研究者必读' }],
  },
  '天体物理学家': {
    videos: [
      { title: '耶鲁大学天体物理公开课', url: 'https://www.bilibili.com/video/BV1RPh46VEcF', source: 'Bilibili', note: '黑洞与暗物质系统课' },
    ],
    docs: [
      { title: 'reddit · r/astrophysics', url: 'https://www.reddit.com/r/astrophysics/', source: '行业社区', note: '天体物理研究社区', kind: 'community' },
{ title: 'NASA 官网（天文与航天数据）', url: 'https://www.nasa.gov/', source: '官方机构' }],
    books: [
      { title: '宇宙', author: '卡尔·萨根', why: '天体物理的经典启蒙' },
{ title: '时间简史', author: 'Stephen Hawking', why: '天体物理与宇宙学的通俗入门' }],
  },
  '量子物理学家': {
    videos: [
      { title: '北京大学量子力学全 58 讲（田光善）', url: 'https://www.bilibili.com/video/BV1yb411G7bo', source: 'Bilibili', note: '量子力学经典全程课' }
    ],
    docs: [
      { title: '量子力学（西安电子科技大学）', url: 'https://higher.smartedu.cn/course/694b05335345b68214bf3a4c', source: '国家高等教育智慧教育平台', note: '量子力学核心课' },

      { title: 'reddit · r/quantum', url: 'https://www.reddit.com/r/quantum/', source: '行业社区', note: '量子物理与量子计算社区', kind: 'community' }
    ],
    books: [
      { title: '量子力学概论', author: '大卫·格里菲斯', why: '量子力学国际标准教材' },
{ title: '量子力学导论（第4版）', author: 'David J. Griffiths', why: '本科量子力学标准教材，推导清晰' }],
  },
  '生态学家': {
    docs: [
      { title: 'reddit · r/ecology', url: 'https://www.reddit.com/r/ecology/', source: '行业社区', note: '生态学研究社区', kind: 'community' },

      { title: '生态学（北京师范大学）', url: 'https://higher.smartedu.cn/course/63f54941af1f1b5d3ecfc499', source: '国家高等教育智慧教育平台', note: '生态学国家级课程' },
    ],
    videos: [
      { title: '北师大基础生态学（牛翠娟）', url: 'https://www.bilibili.com/video/BV1Lt411672b', source: 'Bilibili', note: '生态学全程课' },
    ],
    books: [
      { title: '基础生态学', author: '牛翠娟', why: '生态学标准教材' },
{ title: '寂静的春天', author: '蕾切尔·卡森', why: '现代生态学与环境保护的开端之作' }],
  },
  '社会学家': {
    docs: [
      { title: 'reddit · r/sociology', url: 'https://www.reddit.com/r/sociology/', source: '行业社区', note: '社会学研究社区', kind: 'community' },

      { title: '社会学概论（西安交通大学）', url: 'https://www.icourse163.org/course/XJTU-1001596004', source: '中国大学MOOC', note: '社会学系统课' },
    ],
    videos: [
      { title: '北京大学社会学概论全 64 讲（卢晖临）', url: 'https://www.bilibili.com/video/BV1XK4y1n7gp', source: 'Bilibili', note: '社会学全程课' },
    ],
    books: [
      { title: '社会学概论新修', author: '郑杭生', why: '社会学标准教材' },
{ title: '社会学的想象力', author: 'C. Wright Mills', why: '把个人困扰与社会结构连起来的经典方法论' }],
  },
  '人类学家': {
    docs: [
      { title: 'reddit · r/Anthropology', url: 'https://www.reddit.com/r/Anthropology/', source: '行业社区', note: '人类学讨论社区', kind: 'community' },

      { title: '文化人类学（中央民族大学）', url: 'https://www.icourse163.org/course/MUC-1207186807', source: '中国大学MOOC', note: '人类学系统课' },
    ],
    videos: [
      { title: '台大文化人类学（王梅霞）', url: 'https://www.bilibili.com/video/BV1vZ4y1y7zs', source: 'Bilibili', note: '人类学全程课' },
    ],
    books: [
      { title: '人类学概论', author: '庄孔韶', why: '人类学标准教材' },
{ title: '文化的解释', author: 'Clifford Geertz', why: '文化人类学“深描”方法的奠基著作' }],
  },
};

export const CAREER_RESOURCES: Record<string, CareerResourceSet> = {
  ...LEGACY_RESOURCES,
  ...medicalResources,
  ...financeResources,
  ...techResources,
  ...educationResources,
  ...managementResources,
  ...scienceResources,
  ...lawResources,
  ...designResources,
  ...engineeringResources,
  ...salesResources,
  ...mediaResources,
  ...serviceResources,
  ...energyResources,
  ...supplementResources01,
  ...supplementResources02,
  ...supplementResources03,
  ...supplementResources04,
  ...supplementResources05,
  ...supplementResources06,
  ...supplementResources07,
  ...supplementResources08,
  ...supplementResources09,
  ...supplementResources10,
  ...supplementResources11,
};
