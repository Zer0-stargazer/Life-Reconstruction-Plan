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
  // ---- 黄金赛道 · 科技第二批（2026-10-02 直测；外网超时的 URL 置空处理） ----
  'Rust开发工程师': {
    book: { title: 'Rust程序设计语言（The Rust Programming Language）', author: 'Steve Klabnik、Carol Nichols', why: '官方 The Book，Rust 自学的唯一正统入口' },
    reference: { name: 'Rust 官方 Book（在线阅读）', url: 'https://doc.rust-lang.org/book/' },
  },
  '算法工程师': {
    book: { title: '算法导论', author: 'Thomas H. Cormen 等', why: '算法领域圣经，打牢工程师底层功力' },
    reference: { name: '力扣 LeetCode（题库 + 官方学习计划）', url: 'https://leetcode.cn/' },
  },
  '音视频开发工程师': {
    book: { title: 'FFmpeg从入门到精通', author: '刘歧', why: '国内 FFmpeg 实战代表作，音视频开发绕不开' },
    reference: { name: 'FFmpeg 官方文档', url: 'https://ffmpeg.org/documentation.html' },
  },
  '自动驾驶工程师': {
    book: { title: '概率机器人', author: 'Sebastian Thrun 等', why: '感知与定位的理论基石，自动驾驶算法必修' },
    course: { title: 'Self-Driving Cars Specialization（多伦多大学）', platform: 'Coursera' },
    reference: { name: '百度 Apollo 开源自动驾驶平台' },
  },
  // ---- 高危赛道第二批（2026-10-02 直测；仅录入确定真实的书目/社区） ----
  '电话销售': {
    book: { title: 'SPIN销售巨人：大订单销售训练手册', author: '尼尔·雷克汉姆', why: '销售方法论鼻祖，把话术升级为可复制的提问模型' },
  },
  '银行柜员': {
    book: { title: '手把手教你读财报', author: '唐朝', why: '零基础看懂三张表，柜员转岗财务分析的敲门砖' },
  },
  '插画师': {
    book: { title: '伯里曼人体结构绘画教学', author: '乔治·伯里曼', why: '人体结构素描经典，插画基本功必修' },
    reference: { name: 'ArtStation（全球数字艺术作品社区）' },
  },
  '摄影师': {
    book: { title: '纽约摄影学院摄影教材', author: '纽约摄影学院', why: '中文摄影入门圣经，构图用光体系完整' },
    reference: { name: '500px / 图虫（摄影作品社区）' },
  },
  '动画师': {
    book: { title: '原动画基础教程：动画师的生存工具', author: '理查德·威廉姆斯', why: '动画运动规律第一经典，迪士尼级方法论' },
  },
  '平面设计师': {
    book: { title: '设计中的设计', author: '原研哉', why: '重新理解设计思维，从技法上升到理念' },
    reference: { name: 'Adobe 官方教程（Photoshop/Illustrator）' },
  },
  // ---- 第一批（2026-10-09 调研；WebFetch 本批不可用，全部 url 留空，待实测后补充） ----
  '全栈开发工程师': {
    book: { title: 'JavaScript高级程序设计（第4版）', author: 'Nicholas C. Zakas', why: '前端 JavaScript 体系化经典，打通浏览器与服务端' },
    course: { title: 'Meta Full Stack Developer: Front-End & Back-End from Scratch', platform: 'Coursera' },
    reference: { name: 'MDN Web 开发学习区' },
  },
  '产品经理': {
    book: { title: '启示录：打造用户喜爱的产品', author: 'Marty Cagan', why: '硅谷产品管理经典，讲透产品发现与团队方法' },
    course: { title: 'Digital Product Management Specialization', platform: 'Coursera' },
  },
  'DevOps工程师': {
    book: { title: '加速：精益软件与DevOps的科学', author: 'Nicole Forsgren、Jez Humble、Gene Kim', why: '用数据论证 DevOps 效能指标，理论与实践兼备' },
    course: { title: 'Exam Prep: AWS Certified DevOps Engineer - Professional', platform: 'Coursera' },
    reference: { name: 'Docker 官方文档' },
  },
  '前端开发工程师': {
    book: { title: '你不知道的JavaScript（上卷）', author: 'Kyle Simpson', why: '深入理解 JavaScript 作用域与原型，前端进阶必读' },
    course: { title: 'Meta Front-End Developer Professional Certificate', platform: 'Coursera' },
    reference: { name: 'MDN Web 开发学习区' },
  },
  '后端开发工程师': {
    book: { title: '数据密集型应用系统设计', author: 'Martin Kleppmann', why: '后端分布式数据系统设计的权威入门，原理讲得透' },
    course: { title: 'Meta Back-End Developer Professional Certificate', platform: 'Coursera' },
    reference: { name: 'PostgreSQL 官方文档' },
  },
  '移动端开发工程师': {
    book: { title: 'Android开发艺术探索', author: '任玉刚', why: '国内 Android 进阶经典，讲清视图与系统机制' },
    course: { title: 'Android App Development Specialization', platform: 'Coursera（Vanderbilt University）' },
    reference: { name: 'Android Developers 官方文档' },
  },
  '测试开发工程师': {
    book: { title: 'Google软件测试之道', author: 'James Whittaker 等', why: 'Google 测试工程实践总结，建立质量保障思维' },
    reference: { name: 'Selenium 官方文档' },
  },
  '游戏开发工程师': {
    book: { title: '游戏引擎架构', author: 'Jason Gregory', why: '游戏引擎底层原理的系统讲解，适合深入进阶' },
    course: { title: 'Unity Learn 官方学习平台', platform: 'Unity' },
    reference: { name: 'Unity 官方文档' },
  },
  '物联网工程师': {
    course: { title: 'Internet of Things Specialization（加州大学欧文分校）', platform: 'Coursera' },
    reference: { name: 'AWS IoT Core 开发者文档' },
  },
  'AR/VR开发工程师': {
    reference: { name: 'Unity XR 开发官方文档' },
  },
  '技术文档工程师': {
    reference: { name: 'Google 开发者文档风格指南' },
  },
  '数据库管理员': {
    book: { title: 'MySQL必知必会', author: 'Ben Forta', why: '数据库操作入门首选，SQL 基础扎实' },
    reference: { name: 'MySQL 官方文档' },
  },
  '系统管理员': {
    book: { title: '鸟哥的Linux私房菜（基础学习篇 第4版）', author: '鸟哥（荆涛）', why: '国内 Linux 系统管理入门经典，贴近实际操作' },
    reference: { name: 'Linux man 手册页（man pages）' },
  },
  '技术支持工程师': {
    book: { title: '非暴力沟通', author: 'Marshall B. Rosenberg', why: '倾听与表达的方法论，客服支持岗位最需要的能力' },
  },
  'Python开发工程师': {
    book: { title: '流畅的Python（第2版）', author: 'Luciano Ramalho', why: '深入讲解 Python 语言特性，从会用到写得地道' },
    course: { title: 'Python for Everybody Specialization（密歇根大学）', platform: 'Coursera' },
    reference: { name: 'Python 官方文档' },
  },
  'Java开发工程师': {
    book: { title: 'Effective Java（第3版）', author: 'Joshua Bloch', why: 'Java 最佳实践的经典条目集，进阶必读' },
    reference: { name: 'Oracle Java 官方文档' },
  },
  'Go开发工程师': {
    book: { title: 'Go程序设计语言', author: 'Alan A. A. Donovan、Brian W. Kernighan', why: 'Go 语言权威教材，并发与工程实践讲解系统' },
    reference: { name: 'Go 官方文档（go.dev/doc）' },
  },
  'C++开发工程师': {
    book: { title: 'C++ Primer 中文版（第5版）', author: 'Stanley B. Lippman 等', why: 'C++ 入门到进阶的标准教材，语言细节覆盖完整' },
    reference: { name: 'cppreference.com（C++ 标准库参考）' },
  },
  '网络工程师': {
    book: { title: 'TCP/IP详解 卷1：协议', author: 'W. Richard Stevens', why: '网络协议的经典深度读物，排障与设计基础' },
    course: { title: 'Cisco Networking Academy 网络课程', platform: 'Cisco NetAcad' },
  },
  '机器人工程师': {
    book: { title: '机器人学导论', author: 'John J. Craig', why: '机器人运动学与控制的入门经典，理论与建模兼顾' },
    course: { title: 'Robotics Specialization（宾夕法尼亚大学）', platform: 'Coursera' },
    reference: { name: 'ROS 官方文档' },
  },
  '芯片设计工程师': {
    book: { title: '数字设计和计算机体系结构（第2版）', author: 'David Money Harris、Sarah L. Harris', why: '从数字电路到 CPU 体系结构的系统教材' },
  },
  '隐私计算工程师': {
    book: { title: '应用密码学（第2版）', author: 'Bruce Schneier', why: '密码学原理与协议的经典参考，隐私计算基础' },
    reference: { name: 'OpenMined 隐私计算开源社区' },
  },
  '边缘计算工程师': {
    reference: { name: 'KubeEdge 官方文档' },
  },
  'AI产品经理': {
    book: { title: '精益创业', author: 'Eric Ries', why: '用小步快跑验证需求，适合 AI 产品的试错式探索' },
    course: { title: 'AI For Everyone', platform: 'Coursera（吴恩达）' },
  },
  '技术项目经理': {
    book: { title: '敏捷软件开发：原则、模式与实践', author: 'Robert C. Martin', why: '敏捷开发的原则与实践体系，团队协作的理论基础' },
    course: { title: 'Google Project Management: Professional Certificate', platform: 'Coursera' },
    reference: { name: 'Scrum 指南（Scrum.org）' },
  },
  'IT审计师': {
    reference: { name: 'ISACA 官方网站' },
  },
  'SRE工程师': {
    book: { title: '凤凰项目', author: 'Gene Kim、Kevin Behr、George Spafford', why: '用小说形式讲透 DevOps 与运维协作，入门轻松' },
    reference: { name: 'Google SRE 官方书籍站点（sre.google）' },
  },
  '无线通信工程师': {
    reference: { name: '3GPP 官方网站（移动通信标准）' },
  },
  'FPGA工程师': {
    reference: { name: 'AMD Xilinx 官方文档' },
  },
  '编译器开发工程师': {
    book: { title: '编译原理（第2版）', author: 'Alfred V. Aho 等', why: '经典“龙书”，编译前端与优化的理论基础' },
    reference: { name: 'LLVM 官方文档' },
  },
  'IT运维工程师': {
    book: { title: 'Linux 命令行与shell脚本编程大全（第3版）', author: 'Christine Bresnahan、Richard Blum', why: '日常运维的命令与脚本自动化，动手导向强' },
  },
  '语音识别工程师': {
    book: { title: '解析深度学习：语音识别实践', author: '俞栋、邓力', why: '国内语音识别深度学习实践的权威著作' },
    reference: { name: 'Kaldi 语音识别工具包' },
  },
  '知识图谱工程师': {
    book: { title: '知识图谱', author: '刘峤、李杨等', why: '国内知识图谱体系化教材，覆盖构建与应用' },
    reference: { name: 'Neo4j 官方文档' },
  },
  'GPU编程工程师': {
    book: { title: 'CUDA C编程权威指南', author: 'John Cheng、Max Grossman、Ty McKercher', why: 'CUDA 并行编程的权威教材，从原理到优化' },
    reference: { name: 'NVIDIA CUDA 官方文档' },
  },
  '金融科技工程师': {
    book: { title: 'Python金融大数据分析', author: 'Yves Hilpisch', why: '用 Python 处理金融数据与建模，金融科技入门实用' },
  },
  '低代码平台开发': {
    reference: { name: 'Microsoft Power Apps 官方文档' },
  },
  '企业架构师': {
    book: { title: '架构整洁之道', author: 'Robert C. Martin', why: '从设计原则到系统结构，建立架构思维的基础' },
    reference: { name: 'TOGAF 企业架构框架（The Open Group）' },
  },
  'VR游戏开发': {
    book: { title: '游戏设计艺术（第2版）', author: 'Jesse Schell', why: '游戏设计思维的系统讲解，交互体验设计必备' },
    reference: { name: 'Unity 官方文档' },
  },
  '代码审计工程师': {
    book: { title: '白帽子讲Web安全', author: '吴翰清', why: 'Web 安全漏洞原理的国内经典，代码审计入门首选' },
    reference: { name: 'OWASP Code Review Guide（代码审计指南）' },
  },
};
