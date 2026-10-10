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

export interface CareerResourceLink {
  title: string;
  url: string;
  /** 来源平台，如 Coursera、B站、官方文档 */
  source: string;
  note?: string;
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
      { title: 'OpenCV 官方文档', url: 'https://docs.opencv.org/4.x/', source: '官方文档' },
      { title: 'PyTorch 官方教程', url: 'https://pytorch.org/tutorials/', source: '官方文档' },
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
    docs: [{ title: '人人都是产品经理（含大量私域运营文章）', url: 'https://www.woshipm.com/', source: '行业社区' }],
    books: [{ title: '流量池', author: '杨飞', why: '系统讲裂变与私域打法，社区团购获客转化实用参考' }],
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
    books: [{ title: 'SPIN销售巨人：大订单销售训练手册', author: '尼尔·雷克汉姆', why: '销售方法论鼻祖，把话术升级为可复制的提问模型' }],
  },
  '银行柜员': {
    books: [{ title: '手把手教你读财报', author: '唐朝', why: '零基础看懂三张表，柜员转岗财务分析的敲门砖' }],
  },
  '插画师': {
    books: [{ title: '伯里曼人体结构绘画教学', author: '乔治·伯里曼', why: '人体结构素描经典，插画基本功必修' }],
  },
  '摄影师': {
    books: [{ title: '纽约摄影学院摄影教材', author: '纽约摄影学院', why: '中文摄影入门圣经，构图用光体系完整' }],
  },
  '动画师': {
    books: [{ title: '原动画基础教程：动画师的生存工具', author: '理查德·威廉姆斯', why: '动画运动规律第一经典，迪士尼级方法论' }],
  },
  '平面设计师': {
    docs: [{ title: 'Figma 官方资源库（教程与模板）', url: 'https://www.figma.com/resource-library/', source: '官方文档' }],
    books: [{ title: '设计中的设计', author: '原研哉', why: '重新理解设计思维，从技法上升到理念' }],
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
      { title: '中国证监会官网（监管规则与规范性文件）', url: 'https://www.csrc.gov.cn/', source: '监管机构' },
      { title: '中国人民银行官网（金融监管规则）', url: 'https://www.pbc.gov.cn/', source: '监管机构' },
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
    docs: [{ title: 'CFA 协会学习平台', url: 'https://www.cfainstitute.org/', source: '行业协会' }],
    books: [{ title: '漫步华尔街', author: '伯顿·马尔基尔', why: '资产配置与指数投资的经典入门，基金经理必读' }],
  },
  '风险分析师': {
    books: [{ title: '风险管理与金融机构（第5版）', author: 'John C. Hull', why: '金融风险度量与管理的标准教材' }],
  },
  '投资银行家': {
    docs: [{ title: '中国证监会官网（证券发行与并购监管）', url: 'https://www.csrc.gov.cn/', source: '监管机构' }],
    books: [{ title: '投资银行：估值、杠杆收购、兼并与收购', author: 'Joshua Rosenbaum、Joshua Pearl', why: '投行估值与并购建模的实操圣经' }],
  },
  '量化分析师': {
    books: [{ title: '量化投资：策略与技术', author: '丁鹏', why: '国内量化投资体系化入门，策略研发思路清晰' }],
  },
  '金融分析师': {
    docs: [{ title: 'CFA 协会学习平台', url: 'https://www.cfainstitute.org/', source: '行业协会' }],
    books: [{ title: '财务报表分析', author: 'K. R. Subramanyam', why: '从报表读出企业经营本质，分析师基本功' }],
  },
  '理财规划师': {
    docs: [{ title: '中国人民银行官网（个人金融消费政策）', url: 'https://www.pbc.gov.cn/', source: '监管机构' }],
    books: [{ title: '穷爸爸富爸爸', author: '罗伯特·清崎', why: '用资产与负债视角理解个人理财，入门读物' }],
  },
  '金融合规官': {
    docs: [{ title: '中国证监会官网（监管规则）', url: 'https://www.csrc.gov.cn/', source: '监管机构' }],
  },
  '反洗钱分析师': {
    docs: [{ title: '中国人民银行官网（反洗钱规定）', url: 'https://www.pbc.gov.cn/', source: '监管机构' }],
  },
  '临床医生': {
    docs: [{ title: '世界卫生组织（WHO）官网与指南', url: 'https://www.who.int/', source: '国际组织' }],
    books: [{ title: '希氏内科学（Harrison 内科学）', author: 'Dennis L. Kasper 等', why: '内科学最权威的参考教材' }],
  },
  '护士': {
    docs: [{ title: '世界卫生组织（WHO）官网', url: 'https://www.who.int/', source: '国际组织' }],
  },
  '药剂师': {
    docs: [{ title: '世界卫生组织（WHO）官网（药品与基本药物）', url: 'https://www.who.int/', source: '国际组织' }],
    books: [{ title: 'Rang & Dale 药理学（第8版）', author: 'H. P. Rang 等', why: '药理学机制讲解清晰，药剂工作的理论底座' }],
  },
  '营养师': {
    docs: [{ title: '世界卫生组织（WHO）官网（营养与饮食）', url: 'https://www.who.int/', source: '国际组织' }],
  },
  '心理咨询师': {
    docs: [{ title: '美国心理学会（APA）官网', url: 'https://www.apa.org/', source: '行业协会' }],
    books: [{ title: '存在主义心理治疗', author: 'Irvin D. Yalom', why: '心理治疗理论与咨询关系的经典读物' }],
  },
  '公共卫生专家': {
    docs: [{ title: '世界卫生组织（WHO）官网', url: 'https://www.who.int/', source: '国际组织' }],
  },
  '医学研究员': {
    docs: [{ title: 'Nature 期刊官网（前沿研究）', url: 'https://www.nature.com/', source: '学术期刊' }],
  },
  '大学教授': {
    docs: [{ title: '中华人民共和国教育部官网', url: 'https://www.moe.gov.cn/', source: '官方平台' }],
    books: [{ title: '大学之用', author: 'Clark Kerr', why: '大学的使命与治理的经典思考' }],
  },
  '幼儿教师': {
    docs: [{ title: '中华人民共和国教育部官网（幼儿园工作规程等）', url: 'https://www.moe.gov.cn/', source: '官方平台' }],
    books: [{ title: '童年的秘密', author: '玛利亚·蒙台梭利', why: '儿童发展与教育观察的经典，幼教入门读物' }],
  },
  '课程设计师': {
    docs: [{ title: '中华人民共和国教育部官网（课程标准）', url: 'https://www.moe.gov.cn/', source: '官方平台' }],
    books: [{ title: '理解力的培养：逆向课程设计', author: 'Grant Wiggins、Jay McTighe', why: '从目标倒推课程设计，课程设计师的核心方法' }],
  },
  '企业培训师': {
    docs: [{ title: 'SHRM 美国人力资源管理协会官网', url: 'https://www.shrm.org/', source: '行业协会' }],
  },
  '心理测评专家': {
    docs: [{ title: '美国心理学会（APA）官网', url: 'https://www.apa.org/', source: '行业协会' }],
  },
  '教育技术专家': {
    docs: [{ title: '中华人民共和国教育部官网（教育信息化）', url: 'https://www.moe.gov.cn/', source: '官方平台' }],
  },
  '人力资源总监': {
    docs: [{ title: 'SHRM 美国人力资源管理协会官网', url: 'https://www.shrm.org/', source: '行业协会' }],
  },
  '财务总监': {
    docs: [{ title: 'IFRS 国际财务报告准则官网', url: 'https://www.ifrs.org/', source: '国际组织' }],
    books: [{ title: '公司理财（原书第11版）', author: 'Stephen A. Ross 等', why: '公司财务决策的标准教材，财务总监的理论底座' }],
  },
  '战略顾问': {
    books: [{ title: '竞争战略', author: 'Michael E. Porter', why: '行业竞争与战略定位的奠基之作' }],
  },
  'ESG总监': {
    docs: [{ title: '联合国官网（可持续发展目标）', url: 'https://www.un.org/', source: '国际组织' }],
  },
  '气候科学家': {
    docs: [{ title: 'IPCC 政府间气候变化专门委员会官网', url: 'https://www.ipcc.ch/', source: '国际组织' }],
  },
  '神经科学家': {
    docs: [{ title: 'Khan Academy 生物学课程', url: 'https://www.khanacademy.org/science/biology', source: 'Khan Academy', note: '免费基础生物学，打牢神经科学前置知识' }],
    books: [{ title: '神经科学：探索脑（第5版）', author: 'Mark F. Bear 等', why: '神经科学本科权威教材，系统讲清脑的结构与功能' }],
  },
  'AI研究员': {
    docs: [{ title: 'PyTorch 官方文档与教程', url: 'https://pytorch.org/tutorials/', source: '官方文档' }],
    books: [{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '深度学习理论的权威教材，研究者必读' }],
  },
  '天体物理学家': {
    docs: [{ title: 'NASA 官网（天文与航天数据）', url: 'https://www.nasa.gov/', source: '官方机构' }],
    books: [{ title: '时间简史', author: 'Stephen Hawking', why: '天体物理与宇宙学的通俗入门' }],
  },
  '量子物理学家': {
    docs: [{ title: 'NSF 美国国家科学基金会官网', url: 'https://www.nsf.gov/', source: '官方机构' }],
    books: [{ title: '量子力学导论（第4版）', author: 'David J. Griffiths', why: '本科量子力学标准教材，推导清晰' }],
  },
  '生态学家': {
    books: [{ title: '寂静的春天', author: '蕾切尔·卡森', why: '现代生态学与环境保护的开端之作' }],
  },
  '社会学家': {
    books: [{ title: '社会学的想象力', author: 'C. Wright Mills', why: '把个人困扰与社会结构连起来的经典方法论' }],
  },
  '人类学家': {
    books: [{ title: '文化的解释', author: 'Clifford Geertz', why: '文化人类学“深描”方法的奠基著作' }],
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
};
