import type { CareerResourceSet } from '../career-resources';

export const scienceResources: Record<string, CareerResourceSet> = {
  '材料科学家': {
    videos: [{ title: '3.091SC 固体化学导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/3-091sc-introduction-to-solid-state-chemistry-fall-2010/', source: 'MIT OCW' }],
    docs: [
      { title: 'reddit · r/materials', url: 'https://www.reddit.com/r/materials/', source: '行业社区', note: '材料科学研究社区', kind: 'community' },
{ title: 'NIST 美国国家标准与技术研究院', url: 'https://www.nist.gov/', source: '官方文档' }],
    books: [
      { title: '材料科学基础', author: '胡赓祥', why: '材料学科的根基教材' },
{ title: 'Materials Science and Engineering: An Introduction', author: 'William D. Callister Jr.', why: '材料科学入门经典教材' }],
  },
  '基因编辑研究员': {
    videos: [{ title: '7.01SC 生物学基础（MIT OCW）', url: 'https://ocw.mit.edu/courses/7-01sc-fundamentals-of-biology-fall-2011/', source: 'MIT OCW' }],
    docs: [
      { title: '分子生物学（中南大学）', url: 'https://www.icourse163.org/course/csu-1002531010', source: '中国大学MOOC', note: '基因工程与基因治疗，国家级一流课' },

      { title: 'Biology Stack Exchange', url: 'https://biology.stackexchange.com/', source: '行业社区', note: '生物学术问答社区', kind: 'community' }
    ],
    books: [
      { title: '上帝的手术刀：基因编辑', author: '王立铭', why: 'CRISPR 的中文权威科普' },
{ title: 'A Crack in Creation', author: 'Jennifer Doudna / Samuel Sternberg', why: 'CRISPR 发明者亲述基因编辑历程' }],
  },
  '计算生物学家': {
    videos: [{ title: '7.012 生物学导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/7-012-introduction-to-biology-fall-2004/', source: 'MIT OCW' }],
    docs: [
      { title: '分子生物学（中南大学）', url: 'https://www.icourse163.org/course/csu-1002531010', source: '中国大学MOOC', note: '基因工程与基因治疗，国家级一流课' },

      { title: 'reddit · r/statistics', url: 'https://www.reddit.com/r/statistics/', source: '行业社区', note: '统计学与建模社区', kind: 'community' }
    ],
    books: [
      { title: '生物信息学', author: '陈铭', why: '计算生物学标准教材' },
{ title: 'Biological Sequence Analysis', author: 'Richard Durbin 等', why: '生物序列分析的经典计算方法' }],
  },
  '认知科学家': {
    videos: [
      { title: '认知心理学国家级精品课全 50 讲', url: 'https://www.bilibili.com/video/BV1fz4y1x7sM', source: 'Bilibili', note: '认知科学基础课' }
    ],
    docs: [
      { title: '心理学导论（电子科技大学）', url: 'https://higher.smartedu.cn/course/64f901ca374ed23bd755efe7', source: '国家高等教育智慧教育平台', note: '认知过程与科学心理学方法' },

      { title: 'Psychology Stack Exchange', url: 'https://psychology.stackexchange.com/', source: '行业社区', note: '心理与认知学术问答社区', kind: 'community' }
    ],
    books: [
      { title: '认知心理学', author: '王甦', why: '国内认知心理学标准教材' },
{ title: 'How the Mind Works', author: 'Steven Pinker', why: '认知科学通俗而系统的入门读物' }],
  },
  '核物理学家': {
    books: [
      { title: '原子核物理', author: '卢希庭', why: '核物理标准教材' },
      { title: '原子弹秘史', author: '理查德·罗兹', why: '核技术起源叙事' },
    ],
    videos: [
      { title: '北京大学核物理与粒子物理导论', url: 'https://www.bilibili.com/video/BV1Nr4y1P7Pt', source: 'Bilibili', note: '核物理导论公开课' },
    ],
    docs: [
      { title: 'reddit · r/nuclear', url: 'https://www.reddit.com/r/nuclear/', source: '行业社区', note: '核能技术社区', kind: 'community' },
{ title: 'IAEA 国际原子能机构', url: 'https://www.iaea.org/', source: '官方文档' }],
  },
  '海洋学家': {
    videos: [
      { title: '中国海洋大学海洋学Ⅰ（王秀芹）', url: 'https://www.bilibili.com/video/BV1y54y1n7QM', source: 'Bilibili', note: '海洋学全程课' },
    ],
    docs: [
      { title: 'reddit · r/earthscience', url: 'https://www.reddit.com/r/earthscience/', source: '行业社区', note: '地球科学综合社区', kind: 'community' },
{ title: 'NOAA 美国国家海洋和大气管理局', url: 'https://www.noaa.gov/', source: '官方文档' }],
    books: [
      { title: '海洋科学导论', author: '冯士筰', why: '海洋学标准教材' },
{ title: 'The Sea Around Us', author: 'Rachel Carson', why: '海洋科学的经典科普名著' }],
  },
  '考古学家': {
    docs: [
      { title: 'reddit · r/Archaeology', url: 'https://www.reddit.com/r/Archaeology/', source: '行业社区', note: '考古学讨论社区', kind: 'community' },

      { title: '人类骨骼考古学（西北大学）', url: 'https://higher.smartedu.cn/course/62354d7b9906eace0490bbc2', source: '国家高等教育智慧教育平台', note: '考古学分支课' },
    ],
    videos: [
      { title: '中国考古通论课程', url: 'https://www.bilibili.com/video/BV1D34y1t7Zs', source: 'Bilibili', note: '考古学系统课' },
    ],
    books: [
      { title: '中国考古通论', author: '张之恒', why: '考古学标准教材' },
{ title: 'Archaeology: Theories, Methods and Practice', author: 'Colin Renfrew / Paul Bahn', why: '考古学理论与方法的标准教材' }],
  },
  '机器人学研究员': {
    videos: [{ title: '6.832 欠驱动机器人学（MIT OCW）', url: 'https://ocw.mit.edu/courses/6-832-underactuated-robotics-spring-2009/', source: 'MIT OCW' }],
    docs: [
      { title: 'reddit · r/artificial', url: 'https://www.reddit.com/r/artificial/', source: '行业社区', note: 'AI 与机器人讨论社区', kind: 'community' },
{ title: 'NSF 美国国家科学基金会', url: 'https://www.nsf.gov/', source: '官方文档' }],
    books: [
      { title: '机器人学导论', author: '约翰·克雷格', why: '机器人运动学标准教材' },
{ title: 'Modern Robotics', author: 'Kevin M. Lynch / Frank C. Park', why: '机器人运动学与控制的系统教材' }],
  },
  '能源科学家': {
    docs: [
      { title: '科学网博客', url: 'https://blog.sciencenet.cn/', source: '行业社区', note: '中文科研人员社区', kind: 'community' },

      { title: '能源经济学（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1473949178', source: '中国大学MOOC', note: '能源经济系统课' },
    ],
    videos: [
      { title: '西安交通大学燃烧学全 55 讲', url: 'https://www.bilibili.com/video/BV1D3btzSEsN', source: 'Bilibili', note: '能源科学核心课' },
    ],
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
{ title: 'Sustainable Energy – Without the Hot Air', author: 'David J.C. MacKay', why: '用数据量化讨论可持续能源的入门读物' }],
  },
  '农业科学家': {
    books: [
      { title: '齐民要术', author: '贾思勰', why: '农学千年原典' },
      { title: '杂交水稻学', author: '袁隆平', why: '水稻育种权威著作' },
    ],
    videos: [
      { title: '现场示范水稻杂交全过程', url: 'https://www.bilibili.com/video/BV1gd4y137ju', source: 'Bilibili', note: '育种实务实录' },
    ],
    docs: [
      { title: 'reddit · r/agriculture', url: 'https://www.reddit.com/r/agriculture/', source: '行业社区', note: '农业科学讨论社区', kind: 'community' },
{ title: 'FAO 联合国粮农组织', url: 'https://www.fao.org/home/en', source: '官方文档' }],
  },
  '药物化学家': {
    books: [
      { title: '药物化学', author: '尤启冬', why: '药物化学标准教材' },
      { title: '仿制药的真相', author: '凯瑟琳·埃班', why: '药物产业的现实' }
    ],
    videos: [{ title: '5.111SC 化学科学原理（MIT OCW）', url: 'https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/', source: 'MIT OCW' }],
    docs: [
      { title: '食品化学（南昌大学）', url: 'https://www.chinaooc.com.cn/course/630fe46b325d39c27c417db5', source: '国家高等教育智慧教育平台', note: '分子结构与性质，化学根基' },

      { title: 'reddit · r/Pharmacology', url: 'https://www.reddit.com/r/Pharmacology/', source: '行业社区', note: '药理学讨论社区', kind: 'community' }
    ],
  },
  '合成生物学家': {
    videos: [{ title: '7.012 生物学导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/7-012-introduction-to-biology-fall-2004/', source: 'MIT OCW' }],
    docs: [
      { title: '分子生物学（华中农业大学）', url: 'https://higher.smartedu.cn/course/64d56a024ee4896964c5a5e2', source: '国家高等教育智慧教育平台', note: '遗传信息传递与基因表达调控' },

      { title: 'reddit · r/syntheticbiology', url: 'https://www.reddit.com/r/syntheticbiology/', source: '行业社区', note: '合成生物学社区', kind: 'community' }
    ],
    books: [
      { title: '生命的未来', author: '克雷格·文特尔', why: '合成生物学的工程愿景' },
{ title: 'Synthetic Biology: A Very Short Introduction', author: 'Jamie A. Davies', why: '合成生物学的简明入门' }],
  },
  '大气物理学家': {
    videos: [
      { title: '南京大学动力气象学全 52 讲', url: 'https://www.bilibili.com/video/BV1eCYXzzE4q', source: 'Bilibili', note: '国家级精品课' },
    ],
    docs: [
      { title: 'reddit · r/meteorology', url: 'https://www.reddit.com/r/meteorology/', source: '行业社区', note: '气象学讨论社区', kind: 'community' },
{ title: 'IPCC 政府间气候变化专门委员会', url: 'https://www.ipcc.ch/', source: '官方文档' }],
    books: [
      { title: '大气物理学', author: '盛裴轩', why: '大气科学标准教材' },
{ title: 'Atmospheric Science: An Introductory Survey', author: 'John M. Wallace / Peter V. Hobbs', why: '大气科学的标准入门教材' }],
  },
  '古生物学家': {
    videos: [
      { title: '有史以来发现的最稀有化石', url: 'https://www.bilibili.com/video/BV17tXMBDEhN', source: 'Bilibili', note: '古生物化石深度科普' }
    ],
    docs: [
      { title: '古生物学（南京大学）', url: 'https://www.icourse163.org/course/-1449998166', source: '中国大学MOOC', note: '化石类群与生命演化系统课' },

      { title: 'reddit · r/Paleontology', url: 'https://www.reddit.com/r/Paleontology/', source: '行业社区', note: '古生物研究社区', kind: 'community' }
    ],
    books: [
      { title: '物种起源', author: '查尔斯·达尔文', why: '演化论原典' },
{ title: 'Wonderful Life', author: 'Stephen Jay Gould', why: '寒武纪生命大爆发的经典科普' }],
  },
  '地震学家': {
    videos: [
      { title: '中科大地震学原理与应用（刘斌）', url: 'https://www.bilibili.com/video/BV12a411q7TX', source: 'Bilibili', note: '地震学系统课' },
    ],
    docs: [
      { title: 'reddit · r/geology', url: 'https://www.reddit.com/r/geology/', source: '行业社区', note: '地质与地震讨论社区', kind: 'community' },
{ title: 'USGS 美国地质调查局地震项目', url: 'https://earthquake.usgs.gov/', source: '官方文档' }],
    books: [
      { title: '地震学原理与应用', author: '刘斌', why: '地震学标准教材' },
{ title: 'Earthquakes', author: 'Bruce A. Bolt', why: '地震学的经典入门教材' }],
  },
  '水文学家': {
    books: [
      { title: '水文学原理', author: '芮孝芳', why: '水文学标准教材' },
      { title: '水文地质学基础', author: '王大纯', why: '地下水学科根基' },
    ],
    videos: [
      { title: '北京大学水文学与水资源概论', url: 'https://www.bilibili.com/video/BV1rk4y1B78Z', source: 'Bilibili', note: '水文全程课' },
    ],
    docs: [
      { title: 'reddit · r/hydrology', url: 'https://www.reddit.com/r/hydrology/', source: '行业社区', note: '水文学讨论社区', kind: 'community' },
{ title: 'USGS 美国地质调查局', url: 'https://www.usgs.gov/', source: '官方文档' }],
  },
  '营养科学研究员': {
    books: [
      { title: '中国居民膳食指南', author: '中国营养学会', why: '权威膳食标准' },
      { title: '营养学：概念与争论', author: '弗朗西斯·萨耶', why: '营养学经典教材' }
    ],
    videos: [
      { title: '北京大学营养学精品课', url: 'https://www.bilibili.com/video/BV1SqsqezEA2', source: 'Bilibili', note: '营养学全程课' }
    ],
    docs: [
      { title: '营养与食品卫生学（福建医科大学）', url: 'https://www.icourse163.org/course/-1459996163', source: '中国大学MOOC', note: '膳食指南与人群营养实务' },

      { title: 'reddit · r/foodscience', url: 'https://www.reddit.com/r/foodscience/', source: '行业社区', note: '食品与营养科学社区', kind: 'community' }
    ],
  },
  '理论物理学家': {
    docs: [
      { title: 'Physics Stack Exchange', url: 'https://physics.stackexchange.com/', source: '行业社区', note: '物理问答学术社区', kind: 'community' },

      { title: '量子力学（西安电子科技大学）', url: 'https://higher.smartedu.cn/course/694b05335345b68214bf3a4c', source: '国家高等教育智慧教育平台', note: '理论物理核心课' },
    ],
    videos: [{ title: '8.01SC 经典力学（MIT OCW）', url: 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/', source: 'MIT OCW' }],
    books: [
      { title: '量子力学概论', author: '大卫·格里菲斯', why: '量子力学国际标准教材' },
{ title: 'The Theoretical Minimum', author: 'Leonard Susskind / George Hrabovsky', why: '从零理解理论物理的入门读物' }],
  },
  '化学生物学家': {
    books: [
      { title: '有机化学', author: '邢其毅', why: '化学根基教材' },
      { title: '生物化学', author: '王镜岩', why: '生化标准教材' },
    ],
    videos: [{ title: '5.111SC 化学科学原理（MIT OCW）', url: 'https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/', source: 'MIT OCW' }],
    docs: [
      { title: 'Chemistry Stack Exchange', url: 'https://chemistry.stackexchange.com/', source: '行业社区', note: '化学术问答社区', kind: 'community' },
{ title: 'Nature 期刊（前沿研究）', url: 'https://www.nature.com/', source: '官方文档' }],
  },
  '宇宙学家': {
    videos: [
      { title: '大爆炸理论的三缺陷与六个证据', url: 'https://www.bilibili.com/video/BV16rUWBpEao', source: 'Bilibili', note: '宇宙学硬核科普' },
    ],
    docs: [
      { title: 'reddit · r/cosmology', url: 'https://www.reddit.com/r/cosmology/', source: '行业社区', note: '宇宙学讨论社区', kind: 'community' },
{ title: 'NASA 美国国家航空航天局', url: 'https://www.nasa.gov/', source: '官方文档' }],
    books: [
      { title: '时间简史', author: '史蒂芬·霍金', why: '宇宙学的公众经典' },
{ title: 'Cosmos', author: 'Carl Sagan', why: '宇宙科学的经典科普名著' }],
  },
  '数据驱动材料发现': {
    books: [
      { title: '材料科学基础', author: '胡赓祥', why: '材料学科的根基教材' },
      { title: '机器学习', author: '周志华', why: '数据驱动建模的西瓜书' },
    ],
    videos: [
      { title: '对话前 DeepMind 研究员：AI for Science 时代', url: 'https://www.bilibili.com/video/BV1GQgg6yEy5', source: 'Bilibili', note: '数据驱动材料发现的前沿对话' },
    ],
    docs: [
      { title: 'reddit · r/materials', url: 'https://www.reddit.com/r/materials/', source: '行业社区', note: '材料科学研究社区', kind: 'community' },
{ title: 'NIST 美国国家标准与技术研究院', url: 'https://www.nist.gov/', source: '官方文档' }],
  },
  '脑机接口研究员': {
    books: [
      { title: '神经科学原理', author: '埃里克·坎德尔', why: '神经科学的圣经级教材' },
      { title: '脑与意识', author: '斯坦尼斯拉斯·迪昂', why: '意识科学的里程碑' }
    ],
    videos: [{ title: '9.40 神经计算导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/9-40-introduction-to-neural-computation-spring-2018/', source: 'MIT OCW', note: '偏神经计算基础，与脑机接口相关' }],
    docs: [
      { title: '医学神经生物学（苏州大学）', url: 'https://higher.smartedu.cn/course/6500e6f6374ed23bd755fca3', source: '国家高等教育智慧教育平台', note: '神经系统结构与功能系统课' },

      { title: 'reddit · r/neuro', url: 'https://www.reddit.com/r/neuro/', source: '行业社区', note: '神经科学与脑机接口社区', kind: 'community' }
    ],
  },
  '古基因组学家': {
    videos: [
      { title: '人类进化论长期被误解的图片', url: 'https://www.bilibili.com/video/BV1th4y1X7Fj', source: 'Bilibili', note: '人类演化证据梳理' }
    ],
    docs: [
      { title: '分子生物学（黑龙江大学）', url: 'https://www.icourse163.org/course/HLJU-1449260162', source: '中国大学MOOC', note: '基因组学与分子技术基础' },

      { title: 'reddit · r/genomics', url: 'https://www.reddit.com/r/genomics/', source: '行业社区', note: '基因组学社区', kind: 'community' }
    ],
    books: [
      { title: '尼安德特人', author: '斯万特·帕博', why: '古DNA之父的自传' },
{ title: 'Who We Are and How We Got Here', author: 'David Reich', why: '古DNA研究如何重写人类历史' }],
  },
  '计算神经科学家': {
    videos: [{ title: '9.40 神经计算导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/9-40-introduction-to-neural-computation-spring-2018/', source: 'MIT OCW' }],
    docs: [
      { title: 'reddit · r/cogsci', url: 'https://www.reddit.com/r/cogsci/', source: '行业社区', note: '认知科学讨论社区', kind: 'community' },
{ title: 'NSF 美国国家科学基金会', url: 'https://www.nsf.gov/', source: '官方文档' }],
    books: [
      { title: '神经科学原理', author: '埃里克·坎德尔', why: '神经科学的圣经级教材' },
{ title: 'Theoretical Neuroscience', author: 'Peter Dayan / L.F. Abbott', why: '计算神经科学的经典教材' }],
  },
  '生物物理学家': {
    videos: [
      { title: '生物物理学概论', url: 'https://www.bilibili.com/video/BV1x3411z7RA', source: 'Bilibili', note: '生物物理系统课' },
    ],
    docs: [
      { title: 'reddit · r/biology', url: 'https://www.reddit.com/r/biology/', source: '行业社区', note: '生物学研究社区', kind: 'community' },
{ title: 'NSF 美国国家科学基金会', url: 'https://www.nsf.gov/', source: '官方文档' }],
    books: [
      { title: '生命是什么', author: '埃尔温·薛定谔', why: '生物物理的开山之问' },
{ title: 'Physical Biology of the Cell', author: 'Rob Phillips 等', why: '用物理视角理解细胞的经典教材' }],
  },
  '环境毒理学家': {
    videos: [
      { title: '现代毒理学考点精讲', url: 'https://www.bilibili.com/video/BV1oz4y1z79m', source: 'Bilibili', note: '毒理学系统课' },
    ],
    docs: [
      { title: 'reddit · r/toxicology', url: 'https://www.reddit.com/r/toxicology/', source: '行业社区', note: '毒理学讨论社区', kind: 'community' },
{ title: 'NIH 美国国立卫生研究院', url: 'https://www.nih.gov/', source: '官方文档' }],
    books: [
      { title: '毒理学基础', author: '王心如', why: '毒理学标准教材' },
{ title: 'Silent Spring', author: 'Rachel Carson', why: '环境毒理研究的奠基性著作' }],
  },
  '法医人类学家': {
    docs: [
      { title: 'reddit · r/Anthropology', url: 'https://www.reddit.com/r/Anthropology/', source: '行业社区', note: '体质人类学讨论社区', kind: 'community' },

      { title: '法医学（河南警察学院）', url: 'https://www.icourse163.org/course/-1464580183', source: '中国大学MOOC', note: '法医学系统课' },
    ],
    videos: [
      { title: '法医秦明：法医煮人体骨骼', url: 'https://www.bilibili.com/video/BV1WJ411C74c', source: 'Bilibili', note: '法医实务第一视角' },
    ],
    books: [
      { title: '法医学', author: '王保捷', why: '法医学标准教材' },
{ title: 'Written in Bone', author: 'Sue Black', why: '法医人类学家讲述骨骼鉴定的真实案例' }],
  },
};
