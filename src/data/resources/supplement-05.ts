import type { CareerResourceSet } from '../career-resources';

export const supplementResources05: Record<string, CareerResourceSet> = {
  '初级口腔医生': {
    books: [
      { title: '口腔解剖生理学', author: '何三纲', why: '口腔医学的人卫根基教材' },
      { title: '牙体牙髓病学', author: '樊明文', why: '牙体疾病诊疗的核心教材' },
    ],
    docs: [
      { title: 'reddit · r/dentistry', url: 'https://www.reddit.com/r/dentistry/', source: '行业社区', note: '牙医全球社区', kind: 'community' },

      { title: '系统解剖学（武汉大学）', url: 'https://www.icourse163.org/course/whu-476001', source: '中国大学MOOC', note: '头颈部解剖的根基课程' },
    ],
    videos: [
      { title: '口腔解剖生理学（慕课）', url: 'https://mooc.yinghuaonline.com/mo_course/detail/1001995', source: '慕课', note: '牙体形态、牙列、咬合与咀嚼肌基础' },
    ],
  },
  '高级口腔医生': {
    books: [
      { title: '口腔解剖生理学', author: '何三纲', why: '口腔医学的人卫根基教材' },
      { title: '牙体牙髓病学', author: '樊明文', why: '牙体疾病诊疗的核心教材' },
    ],
    docs: [
      { title: 'reddit · r/dentistry', url: 'https://www.reddit.com/r/dentistry/', source: '行业社区', note: '牙医全球社区', kind: 'community' },

      { title: '系统解剖学（中国矿业大学）', url: 'https://www.icourse163.org/course/CUMT-1207114820', source: '中国大学MOOC', note: '系统解剖的完整讲解' },
    ],
    videos: [
      { title: 'Implant Dentistry（种植牙）', url: 'https://www.coursera.org/learn/implant-dentistry-chinese', source: 'Coursera', note: '种植修复方向进阶内容' },
    ],
  },
  '初级中医师': {
    books: [
      { title: '中医基础理论', author: '郑洪新', why: '中医理论的人卫标准教材' },
      { title: '针灸学', author: '梁繁荣', why: '针灸经络的核心教材' },
    ],
    docs: [
      { title: 'reddit · r/medicalschool', url: 'https://www.reddit.com/r/medicalschool/', source: '行业社区', note: '医学生社区', kind: 'community' },

      { title: '生理学（南京中医药大学）', url: 'https://higher.smartedu.cn/course/6a960464b44e493c7664e4e9', source: '智慧教育平台', note: '中西医结合的现代生理基础' },
    ],
    videos: [
      { title: 'Everyday Chinese Medicine（日常中医，香港中文大学）', url: 'https://www.coursera.org/learn/everyday-chinese-medicine', source: 'Coursera', note: '中医基础理论入门，可免费试听' },
    ],
  },
  '初级品牌策划师': {
    docs: [
      { title: '数英网（数字媒体行业社区）', url: 'https://www.digitaling.com/', source: '行业社区', note: '品牌营销案例主阵地', kind: 'community' },

      { title: '视觉传达设计（华中农业大学）', url: 'https://www.icourse163.org/course/HZAU-1466076214', source: '中国大学MOOC', note: '标志与品牌形象设计全章节' },
    ],
    videos: [
      { title: 'Brand Positioning and Marketing Strategy（品牌定位与营销策略）', url: 'https://www.coursera.org/learn/brand-positioning-marketing-strategy', source: 'Coursera', note: '消费者行为与品牌定位，约 9 小时' },
      { title: 'Brand Identity and Strategy（品牌识别与战略）', url: 'https://www.coursera.org/learn/brand-identity-strategy', source: 'Coursera', note: '定位表述与差异化' },
    ],
    books: [
      { title: '超级符号就是超级创意', author: '华杉', why: '本土品牌符号战略的经典' },
{ title: '定位（Positioning: The Battle for Your Mind）', author: 'Al Ries、Jack Trout', why: '品牌定位理论的经典入门著作' }],
  },
  '高级品牌策划师': {
    books: [
      { title: '超级符号就是超级创意', author: '华杉', why: '本土品牌符号战略的经典' },
      { title: '定位', author: '艾·里斯', why: '品牌心智定位的奠基之作' },
    ],
    docs: [
      { title: '数英网（数字媒体行业社区）', url: 'https://www.digitaling.com/', source: '行业社区', note: '品牌营销案例主阵地', kind: 'community' },

      { title: '视觉传达设计（华中农业大学）', url: 'https://www.icourse163.org/course/HZAU-1466076214', source: '中国大学MOOC', note: '标志与品牌形象设计全章节' },
    ],
    videos: [
      { title: 'Brand Management and Brand Strategy（品牌管理与品牌战略）', url: 'https://www.coursera.org/learn/brand-management-brand-strategy', source: 'Coursera', note: '品牌资产的分析、构建与强化' },
    ],
  },
  '初级独立游戏制作人': {
    docs: [
      { title: 'reddit · r/gamedev', url: 'https://www.reddit.com/r/gamedev/', source: '行业社区', note: '独立游戏开发全球社区', kind: 'community' },

      { title: 'indienova 开发专栏（开发教程与后记）', url: 'https://indienova.com/indie-game-development/', source: '官方资料库', note: '独立游戏开发教程与开发者后记' },
    ],
    videos: [
      { title: 'Introduction to Game Design（游戏设计入门，CalArts）', url: 'https://www.coursera.org/learn/game-design', source: 'Coursera', note: '不需要编程，学习规则与机制设计' },
      { title: '如何制作一款独立游戏（B站专栏图文教程）', url: 'https://www.bilibili.com/opus/263330595311858519', source: 'B站专栏', note: '从策划、美术到程序的全流程概览' },
    ],
    books: [
      { title: '游戏设计艺术', author: '杰西·谢尔', why: '独立游戏设计的透镜体系' },
{ title: '游戏设计艺术（The Art of Game Design: A Book of Lenses）', author: 'Jesse Schell', why: '游戏设计思维的经典教材，适合制作人入门' }],
  },
  '高级独立游戏制作人': {
    books: [
      { title: '游戏设计艺术', author: '杰西·谢尔', why: '独立游戏设计的透镜体系' },
      { title: '游戏设计梦工厂', author: '特雷西·富勒顿', why: '游戏原型与测试的方法论' },
    ],
    docs: [
      { title: 'reddit · r/Design', url: 'https://www.reddit.com/r/Design/', source: '行业社区', note: '综合设计讨论社区', kind: 'community' },

      { title: 'indienova 开发专栏（开发教程与后记）', url: 'https://indienova.com/indie-game-development/', source: '官方资料库', note: '独立游戏开发教程与开发者后记' },
    ],
    videos: [
      { title: 'Game Design and Development 1: 2D Shooter（游戏设计与开发 1：2D 射击游戏，Unity）', url: 'https://www.coursera.org/learn/game-design-and-development-1', source: 'Coursera', note: '密歇根州立大学，Unity 实操项目' },
    ],
  },
  '初级插画师': {
    books: [
      { title: '伯里曼人体结构绘画教学', author: '乔治·伯里曼', why: '人体结构画的传世教材' },
      { title: '色彩与光线', author: '詹姆斯·格尔尼', why: '绘画光色理论的必读经典' },
    ],
    docs: [
      { title: 'reddit · r/illustration', url: 'https://www.reddit.com/r/illustration/', source: '行业社区', note: '插画师全球社区', kind: 'community' },

      { title: '古田路9号（品牌与插画案例库）', url: 'https://www.gtn9.com/', source: '官方资料库', note: '国内品牌插画案例与作品库' },
    ],
    videos: [
      { title: '插画零基础入门，应该从哪里就开始学习（插画全集）', url: 'https://www.bilibili.com/video/BV1Xz4y1f71E/', source: 'B站', note: '约 27 集，从数位板与 PS 基础讲起' },
    ],
  },
  '初级摄影师': {
    books: [
      { title: '美国纽约摄影学院摄影教材', author: '纽约摄影学院', why: '摄影技艺的百科全书式教材' },
      { title: '论摄影', author: '苏珊·桑塔格', why: '摄影美学的思想经典' },
    ],
    docs: [
      { title: 'reddit · r/Photography', url: 'https://www.reddit.com/r/Photography/', source: '行业社区', note: '摄影全球社区', kind: 'community' },

      { title: '摄影基础（国家一流课程）', url: 'https://www.icourse163.org/course/-1001958013', source: '中国大学MOOC', note: '曝光构图用光的国家级课程' },
    ],
    videos: [
      { title: '摄影入门你只需要看这29节课', url: 'https://www.bilibili.com/video/BV1y4411e7sv/', source: 'B站', note: '约 3.7 小时的快速入门' },
      { title: '【摄影入门】B站最全相机摄影教程（系列）', url: 'https://www.bilibili.com/video/BV1EnivBpEaC/', source: 'B站', note: '从相机操作到案例实战，分P较多' },
      { title: 'Cameras, Exposure, and Photography（相机、曝光与摄影）', url: 'https://www.coursera.org/learn/exposure-photography', source: 'Coursera', note: '曝光原理入门' },
    ],
  },
  '高级摄影师': {
    books: [
      { title: '美国纽约摄影学院摄影教材', author: '纽约摄影学院', why: '摄影技艺的百科全书式教材' },
      { title: '论摄影', author: '苏珊·桑塔格', why: '摄影美学的思想经典' },
    ],
    docs: [
      { title: 'reddit · r/Photography', url: 'https://www.reddit.com/r/Photography/', source: '行业社区', note: '摄影全球社区', kind: 'community' },

      { title: '摄影基础（常州工学院）', url: 'https://higher.smartedu.cn/course/69a3692e95df98bb2773b223', source: '智慧教育平台', note: '摄影技术与创作实践课' },
    ],
    videos: [
      { title: 'Camera Control（相机控制）', url: 'https://www.coursera.org/learn/camera-control', source: 'Coursera', note: '手动控制与进阶拍摄' },
      { title: 'Photography Basics and Beyond: From Smartphone to DSLR（摄影基础与进阶：从手机到单反）', url: 'https://www.coursera.org/specializations/photography-basics', source: 'Coursera', note: '密歇根州立大学五门课专项，构图与创作' },
    ],
  },
  '初级动画师': {
    docs: [
      { title: 'reddit · r/animation', url: 'https://www.reddit.com/r/animation/', source: '行业社区', note: '动画师全球社区', kind: 'community' },

      { title: '动画运动规律（无锡城市职业技术学院）', url: 'https://www.icourse163.org/course/WXSTC-1469677173', source: '中国大学MOOC', note: '运动规律与原动画规律' },
    ],
    videos: [
      { title: 'Fundamentals of Animation（动画基础，Aaron Blaise）', url: 'https://creatureartteacher.com/product/fundamentals-of-animation/', source: '官方课程页', note: '迪士尼动画原则讲解，价格以页面为准' },
    ],
    books: [
      { title: '动画师生存手册', author: '理查德·威廉姆斯', why: '动画十二法则的作者亲授' },
{ title: '生命的幻觉（The Illusion of Life: Disney Animation）', author: 'Frank Thomas、Ollie Johnston', why: '迪士尼动画师亲笔撰写，动画表演经典' }],
  },
  '高级动画师': {
    books: [
      { title: '动画师生存手册', author: '理查德·威廉姆斯', why: '动画十二法则的作者亲授' },
      { title: '生命的幻象', author: '弗兰克·托马斯', why: '迪士尼动画原理的奠基之作' },
    ],
    docs: [
      { title: 'reddit · r/animation', url: 'https://www.reddit.com/r/animation/', source: '行业社区', note: '动画师全球社区', kind: 'community' },

      { title: '动画运动规律（无锡城市职业技术学院）', url: 'https://www.icourse163.org/course/WXSTC-1469677173', source: '中国大学MOOC', note: '运动规律与原动画规律' },
    ],
    videos: [
      { title: 'A Masterclass in Animation（动画大师课专项）', url: 'https://www.coursera.org/specializations/a-masterclass-in-animation', source: 'Coursera', note: '十门课程，使用 Blender 等工具' },
    ],
  },
  '呼吸治疗师': {
    books: [
      { title: '康复医学', author: '黄晓琳', why: '康复医学的人卫标准教材' },
      { title: '物理治疗学', author: '燕铁斌', why: '运动治疗与物理因子的核心技术教材' },
    ],
    docs: [
      { title: '医脉通', url: 'https://www.medlive.cn/', source: '行业社区', note: '指南与病例资源', kind: 'community' },

      { title: '系统解剖学（武汉大学）', url: 'https://www.icourse163.org/course/whu-476001', source: '中国大学MOOC', note: '康复与运动系统的解剖根基' },
    ],
    videos: [
      { title: 'Hamilton Medical e-Academy（有创/无创通气在线课程）', url: 'https://www.hamilton-medical.com/en_US/Academy/e-Academy.html', source: '官方课程页', note: '呼吸机操作与通气原理，部分模块可获得 CRCE 学分' },
      { title: 'Mechanical Ventilation Essentials（机械通气要点）', url: 'https://www.medmastery.com/courses/mechanical-ventilation-essentials', source: 'MedMastery', note: '由注册呼吸治疗师讲授，部分章节免费' },
    ],
  },
  '分子病理诊断师': {
    books: [
      { title: '诊断学', author: '万学红', why: '实验室检查解读的根基教材' },
      { title: '病者生存', author: '沙龙·莫勒姆', why: '血液与遗传的演化视角科普' },
    ],
    videos: [
      { title: '临床生物化学检验（中南大学精品课）', url: 'https://www.bilibili.com/video/BV1YY4y1u7Ux', source: 'Bilibili', note: '检验核心课程' },
    ],
    docs: [
      { title: 'reddit · r/medlabprofessionals', url: 'https://www.reddit.com/r/medlabprofessionals/', source: '行业社区', note: '检验技师全球社区', kind: 'community' },

      { title: 'FreeCME 病理学专题（分子与遗传病理）', url: 'https://www.freecme.com/specialties/pathology', source: 'FreeCME', note: '包括二代测序、肿瘤分子谱分析等继续教育课程' },
    ],
  },
  '液压工程师': {
    books: [
      { title: '液压与气压传动', author: '刘银水、许福玲', why: '流体传动的标准教材' },
      { title: '机械设计手册', author: '成大先', why: '液压气动元件选型工具书' },
    ],
    docs: [
      { title: 'reddit · r/MechanicalEngineering', url: 'https://www.reddit.com/r/MechanicalEngineering/', source: '行业社区', note: '流体传动讨论社区', kind: 'community' },

      { title: '液压与气压传动（北京科技大学·一流课程）', url: 'https://higher.smartedu.cn/course/6983c15995df98bb27d1f138', source: '智慧教育平台', note: '液压泵/阀/回路的权威课程' },
    ],
    videos: [
      { title: 'Fundamentals of Fluid Power（流体动力基础，明尼苏达大学）', url: 'https://www.coursera.org/learn/fluid-power', source: 'Coursera', note: '液压元件、回路建模与系统设计，可免费旁听' },
    ],
  },
  '气动工程师': {
    books: [
      { title: '液压与气压传动', author: '刘银水、许福玲', why: '流体传动的标准教材' },
      { title: '机械设计手册', author: '成大先', why: '液压气动元件选型工具书' },
    ],
    docs: [
      { title: 'reddit · r/engineering', url: 'https://www.reddit.com/r/engineering/', source: '行业社区', note: '综合工程社区', kind: 'community' },

      { title: '液压与气压传动（北京科技大学·一流课程）', url: 'https://higher.smartedu.cn/course/6983c15995df98bb27d1f138', source: '智慧教育平台', note: '液压泵/阀/回路的权威课程' },
    ],
    videos: [
      { title: 'Fundamentals of Fluid Power（流体动力基础，明尼苏达大学）', url: 'https://www.coursera.org/learn/fluid-power', source: 'Coursera', note: '涵盖液压与气动元件及回路' },
    ],
  },
  // 2026-10-12 数据新闻记者 已迁到 resources/media.ts 重配专属资源，此处删除避免覆盖。
};
