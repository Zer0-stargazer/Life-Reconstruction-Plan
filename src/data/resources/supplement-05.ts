import type { CareerResourceSet } from '../career-resources';

export const supplementResources05: Record<string, CareerResourceSet> = {
  '初级口腔医生': {
    videos: [
      { title: '口腔解剖生理学（慕课）', url: 'https://mooc.yinghuaonline.com/mo_course/detail/1001995', source: '慕课', note: '牙体形态、牙列、咬合与咀嚼肌基础' },
    ],
  },
  '高级口腔医生': {
    videos: [
      { title: 'Implant Dentistry（种植牙）', url: 'https://www.coursera.org/learn/implant-dentistry-chinese', source: 'Coursera', note: '种植修复方向进阶内容' },
    ],
  },
  '初级中医师': {
    videos: [
      { title: 'Everyday Chinese Medicine（日常中医，香港中文大学）', url: 'https://www.coursera.org/learn/everyday-chinese-medicine', source: 'Coursera', note: '中医基础理论入门，可免费试听' },
    ],
  },
  '初级品牌策划师': {
    videos: [
      { title: 'Brand Positioning and Marketing Strategy（品牌定位与营销策略）', url: 'https://www.coursera.org/learn/brand-positioning-marketing-strategy', source: 'Coursera', note: '消费者行为与品牌定位，约 9 小时' },
      { title: 'Brand Identity and Strategy（品牌识别与战略）', url: 'https://www.coursera.org/learn/brand-identity-strategy', source: 'Coursera', note: '定位表述与差异化' },
    ],
    books: [{ title: '定位（Positioning: The Battle for Your Mind）', author: 'Al Ries、Jack Trout', why: '品牌定位理论的经典入门著作' }],
  },
  '高级品牌策划师': {
    videos: [
      { title: 'Brand Management and Brand Strategy（品牌管理与品牌战略）', url: 'https://www.coursera.org/learn/brand-management-brand-strategy', source: 'Coursera', note: '品牌资产的分析、构建与强化' },
    ],
  },
  '初级独立游戏制作人': {
    videos: [
      { title: 'Introduction to Game Design（游戏设计入门，CalArts）', url: 'https://www.coursera.org/learn/game-design', source: 'Coursera', note: '不需要编程，学习规则与机制设计' },
      { title: '如何制作一款独立游戏（B站专栏图文教程）', url: 'https://www.bilibili.com/opus/263330595311858519', source: 'B站专栏', note: '从策划、美术到程序的全流程概览' },
    ],
    books: [{ title: '游戏设计艺术（The Art of Game Design: A Book of Lenses）', author: 'Jesse Schell', why: '游戏设计思维的经典教材，适合制作人入门' }],
  },
  '高级独立游戏制作人': {
    videos: [
      { title: 'Game Design and Development 1: 2D Shooter（游戏设计与开发 1：2D 射击游戏，Unity）', url: 'https://www.coursera.org/learn/game-design-and-development-1', source: 'Coursera', note: '密歇根州立大学，Unity 实操项目' },
    ],
  },
  '初级插画师': {
    videos: [
      { title: '插画零基础入门，应该从哪里就开始学习（插画全集）', url: 'https://www.bilibili.com/video/BV1Xz4y1f71E/', source: 'B站', note: '约 27 集，从数位板与 PS 基础讲起' },
    ],
  },
  '初级摄影师': {
    videos: [
      { title: '摄影入门你只需要看这29节课', url: 'https://www.bilibili.com/video/BV1y4411e7sv/', source: 'B站', note: '约 3.7 小时的快速入门' },
      { title: '【摄影入门】B站最全相机摄影教程（系列）', url: 'https://www.bilibili.com/video/BV1EnivBpEaC/', source: 'B站', note: '从相机操作到案例实战，分P较多' },
      { title: 'Cameras, Exposure, and Photography（相机、曝光与摄影）', url: 'https://www.coursera.org/learn/exposure-photography', source: 'Coursera', note: '曝光原理入门' },
    ],
  },
  '高级摄影师': {
    videos: [
      { title: 'Camera Control（相机控制）', url: 'https://www.coursera.org/learn/camera-control', source: 'Coursera', note: '手动控制与进阶拍摄' },
      { title: 'Photography Basics and Beyond: From Smartphone to DSLR（摄影基础与进阶：从手机到单反）', url: 'https://www.coursera.org/specializations/photography-basics', source: 'Coursera', note: '密歇根州立大学五门课专项，构图与创作' },
    ],
  },
  '初级动画师': {
    videos: [
      { title: 'Fundamentals of Animation（动画基础，Aaron Blaise）', url: 'https://creatureartteacher.com/product/fundamentals-of-animation/', source: '官方课程页', note: '迪士尼动画原则讲解，价格以页面为准' },
    ],
    books: [{ title: '生命的幻觉（The Illusion of Life: Disney Animation）', author: 'Frank Thomas、Ollie Johnston', why: '迪士尼动画师亲笔撰写，动画表演经典' }],
  },
  '高级动画师': {
    videos: [
      { title: 'A Masterclass in Animation（动画大师课专项）', url: 'https://www.coursera.org/specializations/a-masterclass-in-animation', source: 'Coursera', note: '十门课程，使用 Blender 等工具' },
    ],
  },
  '运维开发工程师': {
    videos: [
      { title: 'Preparing for Google Cloud Certification: Cloud DevOps Engineer（Google 云 DevOps 工程师专业证书）', url: 'https://www.coursera.org/professional-certificates/sre-devops-engineer-google-cloud', source: 'Coursera', note: '构建发布流水线、监控与事件管理' },
    ],
    books: [{ title: 'SRE：Google 运维解密（Site Reliability Engineering）', author: 'Betsy Beyer 等', why: 'Google 站点可靠性工程实践经典' }],
  },
  '呼吸治疗师': {
    videos: [
      { title: 'Hamilton Medical e-Academy（有创/无创通气在线课程）', url: 'https://www.hamilton-medical.com/en_US/Academy/e-Academy.html', source: '官方课程页', note: '呼吸机操作与通气原理，部分模块可获得 CRCE 学分' },
      { title: 'Mechanical Ventilation Essentials（机械通气要点）', url: 'https://www.medmastery.com/courses/mechanical-ventilation-essentials', source: 'MedMastery', note: '由注册呼吸治疗师讲授，部分章节免费' },
    ],
  },
  '分子病理诊断师': {
    docs: [
      { title: 'FreeCME 病理学专题（分子与遗传病理）', url: 'https://www.freecme.com/specialties/pathology', source: 'FreeCME', note: '包括二代测序、肿瘤分子谱分析等继续教育课程' },
    ],
  },
  '液压工程师': {
    videos: [
      { title: 'Fundamentals of Fluid Power（流体动力基础，明尼苏达大学）', url: 'https://www.coursera.org/learn/fluid-power', source: 'Coursera', note: '液压元件、回路建模与系统设计，可免费旁听' },
    ],
  },
  '气动工程师': {
    videos: [
      { title: 'Fundamentals of Fluid Power（流体动力基础，明尼苏达大学）', url: 'https://www.coursera.org/learn/fluid-power', source: 'Coursera', note: '涵盖液压与气动元件及回路' },
    ],
  },
  '数据新闻记者': {
    videos: [
      { title: 'Visualization for Data Journalism（数据新闻可视化，伊利诺伊大学）', url: 'https://www.coursera.org/learn/visualization-for-data-journalism', source: 'Coursera', note: '数据可视化与叙事' },
      { title: 'Doing Journalism with Data（数据驱动新闻 MOOC）', url: 'https://datajournalismcourse.net/', source: '课程官网', note: '系统讲解用数据做新闻的完整流程' },
    ],
    docs: [
      { title: 'EDJNet 数据新闻入门课程', url: 'https://www.europeandatajournalism.eu/resources-for-journalists/learn-courses-tutorials/', source: 'EDJNet', note: '免费英文课程，四个自学模块，可获得选题指导' },
    ],
  },
};
