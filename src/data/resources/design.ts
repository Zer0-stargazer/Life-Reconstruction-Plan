import type { CareerResourceSet } from '../career-resources';

export const designResources: Record<string, CareerResourceSet> = {
  '品牌策划师': {
    videos: [{ title: 'edX 设计思维（Design Thinking）课程', url: 'https://www.edx.org/learn/design-thinking', source: 'edX' }],
    docs: [{ title: 'Figma 官方资源库（设计教程与模板）', url: 'https://www.figma.com/resource-library/', source: '官方文档' }],
    books: [
      { title: 'Designing Brand Identity', author: 'Alina Wheeler', why: '品牌识别从策略到落地的完整流程，适合系统入门' },
      { title: '设计中的设计', author: '原研哉', why: '理解设计理念与洞察，有助于提炼品牌灵魂' },
    ],
  },
  'UI/UX设计师': {
    videos: [
    ],
    docs: [
      { title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' },
      { title: 'Apple Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/', source: '官方文档' },
    ],
    books: [
      { title: "Don't Make Me Think", author: 'Steve Krug', why: '可用性设计入门经典，篇幅短、案例直观' },
      { title: 'About Face: The Essentials of Interaction Design', author: 'Alan Cooper', why: '交互设计方法论的经典著作，覆盖用户目标与行为设计' },
    ],
  },
  '初级UI/UX设计师': {
    docs: [{ title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' }],
    books: [{ title: "Don't Make Me Think", author: 'Steve Krug', why: '可用性设计入门经典，适合作为起点' }],
  },
  '高级UI/UX设计师': {
    books: [{ title: 'About Face: The Essentials of Interaction Design', author: 'Alan Cooper', why: '深入交互设计方法论，适合进阶与体系化思考' }],
    docs: [{ title: 'Apple Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/', source: '官方文档' }],
  },
  '独立游戏制作人': {
    videos: [
      { title: 'Unity Essentials 学习路径（官方）', url: 'https://learn.unity.com/pathway/unity-essentials', source: 'Unity Learn' },
    ],
    docs: [{ title: 'Godot 官方文档（稳定版）', url: 'https://docs.godotengine.org/en/stable/', source: '官方文档', note: '开源引擎，适合小团队' }],
    books: [{ title: 'The Art of Game Design: A Book of Lenses', author: 'Jesse Schell', why: '游戏设计思维框架，适合独立制作人建立设计判断' }],
  },
  '室内设计师': {
    docs: [{ title: 'SketchUp 官方教程（Learn SketchUp）', url: 'https://learn.sketchup.com/tutorials', source: '官方文档' }],
    books: [{ title: 'Interior Design Illustrated', author: 'Francis D. K. Ching', why: '空间与平面表达的图解经典，适合建立基础功' }],
  },
  '初级室内设计师': {
    docs: [{ title: 'SketchUp 官方教程（Learn SketchUp）', url: 'https://learn.sketchup.com/tutorials', source: '官方文档' }],
  },
  '高级室内设计师': {
    books: [{ title: 'Interior Design Illustrated', author: 'Francis D. K. Ching', why: '空间表达与图纸语言的权威参考，适合深化专业能力' }],
  },
  '工业设计师': {
    docs: [{ title: 'SketchUp 官方教程（Learn SketchUp）', url: 'https://learn.sketchup.com/tutorials', source: '官方文档' }],
    books: [{ title: 'The Design of Everyday Things', author: 'Don Norman', why: '从用户与物的关系理解产品设计，工业设计必读' }],
  },
  '初级工业设计师': {
    docs: [{ title: 'SketchUp 官方教程（Learn SketchUp）', url: 'https://learn.sketchup.com/tutorials', source: '官方文档' }],
    books: [{ title: 'The Design of Everyday Things', author: 'Don Norman', why: '建立产品设计的基本判断，适合入门' }],
  },
  '高级工业设计师': {
    books: [{ title: 'The Design of Everyday Things', author: 'Don Norman', why: '用户心理与产品交互的深度思考，适合进阶' }],
  },
  '交互设计师': {
    docs: [
      { title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' },
      { title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn', source: '官方文档', note: '了解前端实现边界' },
    ],
    books: [
      { title: 'Designing Interfaces', author: 'Jenifer Tidwell', why: '交互模式的经典总结，可直接用于设计决策' },
      { title: 'The Design of Everyday Things', author: 'Don Norman', why: '交互设计的心智模型入门，理解用户行为' },
    ],
  },
  '初级交互设计师': {
    books: [{ title: 'The Design of Everyday Things', author: 'Don Norman', why: '建立交互设计的基础思维' }],
  },
  '高级交互设计师': {
    books: [{ title: 'Designing Interfaces', author: 'Jenifer Tidwell', why: '系统梳理交互模式，适合进阶与方法沉淀' }],
    docs: [{ title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' }],
  },
  '字体设计师': {
    books: [
      { title: 'Thinking with Type', author: 'Ellen Lupton', why: '字体与版式的实用入门，理解字形与信息传达' },
      { title: 'The Elements of Typographic Style', author: 'Robert Bringhurst', why: '字体排印的权威规范，适合深入研究' },
    ],
  },
  '3D建模师': {
    docs: [
      { title: 'Blender 官方手册（英文最新版）', url: 'https://docs.blender.org/manual/en/latest/', source: '官方文档' },
      { title: 'Unreal Engine 5 入门文档', url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-getting-started', source: '官方文档' },
    ],
  },
  '游戏原画师': {
    docs: [{ title: 'Unity Learn 官方学习平台', url: 'https://learn.unity.com/', source: '官方文档' }],
  },
  '色彩顾问': {
    books: [{ title: 'The Interaction of Color', author: 'Josef Albers', why: '色彩相互作用的经典实验与理论，适合培养色感' }],
  },
  '声音设计师': {
    docs: [{ title: 'Ableton Live 官方手册', url: 'https://www.ableton.com/en/manual/', source: '官方文档' }],
  },
  '策展人': {
    videos: [{ title: 'Khan Academy 西方艺术史入门', url: 'https://www.khanacademy.org/humanities/art-history/beginners-art-history', source: 'Khan Academy' }],
    docs: [{ title: 'ICOM 国际博物馆协会', url: 'https://icom.museum/', source: '行业组织' }],
  },
  '文创产品设计师': {
    books: [{ title: 'Universal Principles of Design', author: 'William Lidwell 等', why: '设计原则速查手册，适合将文化元素转化为产品' }],
  },
  '数字艺术家': {
    docs: [
      { title: 'Blender 官方手册（英文最新版）', url: 'https://docs.blender.org/manual/en/latest/', source: '官方文档' },
      { title: 'Processing 官方网站（创意编程）', url: 'https://processing.org/', source: '官方文档' },
    ],
  },
  '雕塑家': {
    books: [{ title: 'Art and Fear', author: 'David Bayles、Ted Orland', why: '讨论创作中的恐惧与坚持，适合长期艺术实践者' }],
  },
  '陶艺家': {
    books: [{ title: 'Art and Fear', author: 'David Bayles、Ted Orland', why: '讨论创作中的恐惧与坚持，适合长期手工创作' }],
  },
  '展示设计师': {
    docs: [{ title: 'SketchUp 官方教程（Learn SketchUp）', url: 'https://learn.sketchup.com/tutorials', source: '官方文档' }],
  },
  'Web设计师': {
    docs: [
      { title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn', source: '官方文档' },
      { title: 'W3C WCAG 无障碍指南', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', source: '官方文档' },
    ],
    books: [{ title: "Don't Make Me Think", author: 'Steve Krug', why: '网页可用性的经典入门，适合 Web 设计启蒙' }],
  },
  '数据可视化设计师': {
    videos: [
      { title: 'Coursera 数据可视化（Data Visualization）课程', url: 'https://www.coursera.org/learn/data-visualization', source: 'Coursera' },
      { title: 'edX 数据可视化（Data Visualization）课程', url: 'https://www.edx.org/learn/data-visualization', source: 'edX' },
    ],
    docs: [{ title: 'D3.js 官方网站', url: 'https://d3js.org/', source: '官方文档' }],
    books: [
      { title: 'Storytelling with Data', author: 'Cole Nussbaumer Knaflic', why: '用数据讲故事的实用指南，图表设计入门首选' },
      { title: 'The Visual Display of Quantitative Information', author: 'Edward Tufte', why: '数据可视化理论的奠基之作' },
    ],
  },
  '大屏数据可视化': {
    docs: [{ title: 'D3.js 官方网站', url: 'https://d3js.org/', source: '官方文档' }],
    books: [{ title: 'Storytelling with Data', author: 'Cole Nussbaumer Knaflic', why: '大屏叙事与图表选择的实践参考' }],
  },
  '游戏UI设计师': {
    docs: [
      { title: 'Unity Learn 官方学习平台', url: 'https://learn.unity.com/', source: '官方文档' },
      { title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' },
    ],
  },
  '设计系统工程师': {
    docs: [{ title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档', note: '学习设计 token 与组件体系的范例' }],
    books: [
      { title: 'Atomic Design', author: 'Brad Frost', why: '原子化组件体系的方法论，设计系统入门经典' },
      { title: 'Design Systems', author: 'Alla Kholmatova', why: '设计系统从搭建到治理的完整实践指南' },
    ],
  },
  '无障碍设计师': {
    docs: [
      { title: 'W3C WCAG 无障碍指南', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', source: '官方文档' },
      { title: 'The A11Y Project 无障碍资源', url: 'https://www.a11yproject.com/', source: '社区文档' },
    ],
  },
  '虚拟人形象设计师': {
    docs: [
      { title: 'Blender 官方手册（英文最新版）', url: 'https://docs.blender.org/manual/en/latest/', source: '官方文档' },
      { title: 'Unreal Engine 5 入门文档', url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-getting-started', source: '官方文档' },
    ],
  },
  '可持续设计顾问': {
    docs: [{ title: '埃伦·麦克阿瑟基金会（循环经济）', url: 'https://www.ellenmacarthurfoundation.org/', source: '官方文档' }],
    books: [{ title: 'Cradle to Cradle', author: 'William McDonough、Michael Braungart', why: '摇篮到摇篮的可持续设计理念，行业经典' }],
  },
  'B端产品设计师': {
    docs: [{ title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' }],
    books: [{ title: 'About Face: The Essentials of Interaction Design', author: 'Alan Cooper', why: '复杂业务系统的交互设计方法，适合 B 端场景' }],
  },
};
