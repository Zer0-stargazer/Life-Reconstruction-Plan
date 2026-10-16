import type { CareerResourceSet } from '../career-resources';

export const designResources: Record<string, CareerResourceSet> = {
  '品牌策划师': {
    videos: [{ title: 'edX 设计思维（Design Thinking）课程', url: 'https://www.edx.org/learn/design-thinking', source: 'edX' }],
    docs: [
      { title: '数英网（数字媒体行业社区）', url: 'https://www.digitaling.com/', source: '行业社区', note: '品牌营销案例主阵地', kind: 'community' },
{ title: 'Figma 官方资源库（设计教程与模板）', url: 'https://www.figma.com/resource-library/', source: '官方文档' }],
    books: [
      { title: 'Designing Brand Identity', author: 'Alina Wheeler', why: '品牌识别从策略到落地的完整流程，适合系统入门' },
      { title: '设计中的设计', author: '原研哉', why: '理解设计理念与洞察，有助于提炼品牌灵魂' },
    ],
  },
  'UI/UX设计师': {
    videos: [
      { title: '全B站最用心的UI设计零基础全集（GenJi）', url: 'https://www.bilibili.com/video/BV1k34y1m7Ly', source: 'Bilibili', note: 'UI 设计系统课' },

    ],
    docs: [
      { title: 'reddit · r/UI_Design', url: 'https://www.reddit.com/r/UI_Design/', source: '行业社区', note: 'UI 设计全球社区', kind: 'community' },

      { title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' },
      { title: 'Apple Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/', source: '官方文档' },
    ],
    books: [
      { title: "Don't Make Me Think", author: 'Steve Krug', why: '可用性设计入门经典，篇幅短、案例直观' },
      { title: 'About Face: The Essentials of Interaction Design', author: 'Alan Cooper', why: '交互设计方法论的经典著作，覆盖用户目标与行为设计' },
    ],
  },
  '初级UI/UX设计师': {
    videos: [
      { title: '全B站最用心的UI设计零基础全集（GenJi）', url: 'https://www.bilibili.com/video/BV1k34y1m7Ly', source: 'Bilibili', note: 'UI 设计系统课' }
    ],
    docs: [
      { title: '人机交互与用户体验设计（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1466990164', source: '中国大学MOOC', note: '以用户为中心的交互设计方法' },

      { title: 'reddit · r/UI_Design', url: 'https://www.reddit.com/r/UI_Design/', source: '行业社区', note: 'UI 设计全球社区', kind: 'community' }
    ],
    books: [
      { title: '写给大家看的设计书', author: '罗宾·威廉姆斯', why: '亲密对齐重复对比四大原则的入门经典' },
{ title: "Don't Make Me Think", author: 'Steve Krug', why: '可用性设计入门经典，适合作为起点' }],
  },
  '高级UI/UX设计师': {
    videos: [
      { title: '全B站最用心的UI设计零基础全集（GenJi）', url: 'https://www.bilibili.com/video/BV1k34y1m7Ly', source: 'Bilibili', note: 'UI 设计系统课' },
    ],
    books: [
      { title: '写给大家看的设计书', author: '罗宾·威廉姆斯', why: '亲密对齐重复对比四大原则的入门经典' },
{ title: 'About Face: The Essentials of Interaction Design', author: 'Alan Cooper', why: '深入交互设计方法论，适合进阶与体系化思考' }],
    docs: [
      { title: 'reddit · r/UI_Design', url: 'https://www.reddit.com/r/UI_Design/', source: '行业社区', note: 'UI 设计全球社区', kind: 'community' },
{ title: 'Apple Human Interface Guidelines', url: 'https://developer.apple.com/design/human-interface-guidelines/', source: '官方文档' }],
  },
  '独立游戏制作人': {
    videos: [
      { title: 'Unity Essentials 学习路径（官方）', url: 'https://learn.unity.com/pathway/unity-essentials', source: 'Unity Learn' },
    ],
    docs: [
      { title: 'reddit · r/gamedev', url: 'https://www.reddit.com/r/gamedev/', source: '行业社区', note: '独立游戏开发全球社区', kind: 'community' },
{ title: 'Godot 官方文档（稳定版）', url: 'https://docs.godotengine.org/en/stable/', source: '官方文档', note: '开源引擎，适合小团队' }],
    books: [
      { title: '游戏设计艺术', author: '杰西·谢尔', why: '独立游戏设计的透镜体系' },
{ title: 'The Art of Game Design: A Book of Lenses', author: 'Jesse Schell', why: '游戏设计思维框架，适合独立制作人建立设计判断' }],
  },
  '室内设计师': {
    videos: [
      { title: '室内设计零基础入门（八年设计总监亲授）', url: 'https://www.bilibili.com/video/BV1mx411d7Zn', source: 'Bilibili', note: '室内设计实务课' },
    ],
    docs: [
      { title: 'reddit · r/InteriorDesign', url: 'https://www.reddit.com/r/InteriorDesign/', source: '行业社区', note: '室内设计全球社区', kind: 'community' },
{ title: 'SketchUp 官方教程（Learn SketchUp）', url: 'https://learn.sketchup.com/tutorials', source: '官方文档' }],
    books: [
      { title: '室内设计资料集', author: '张绮曼', why: '室内设计的工具书级资料集' },
{ title: 'Interior Design Illustrated', author: 'Francis D. K. Ching', why: '空间与平面表达的图解经典，适合建立基础功' }],
  },
  '初级室内设计师': {
    books: [
      { title: '室内设计资料集', author: '张绮曼', why: '室内设计的工具书级资料集' },
      { title: '设计中的设计', author: '原研哉', why: '设计思维与日常美学' },
    ],
    videos: [
      { title: '室内设计零基础入门（八年设计总监亲授）', url: 'https://www.bilibili.com/video/BV1mx411d7Zn', source: 'Bilibili', note: '室内设计实务课' },
    ],
    docs: [
      { title: 'reddit · r/InteriorDesign', url: 'https://www.reddit.com/r/InteriorDesign/', source: '行业社区', note: '室内设计全球社区', kind: 'community' },
{ title: 'SketchUp 官方教程（Learn SketchUp）', url: 'https://learn.sketchup.com/tutorials', source: '官方文档' }],
  },
  '高级室内设计师': {
    docs: [
      { title: 'reddit · r/InteriorDesign', url: 'https://www.reddit.com/r/InteriorDesign/', source: '行业社区', note: '室内设计全球社区', kind: 'community' },

      { title: 'ArchDaily 中文（室内设计案例）', url: 'https://www.archdaily.cn/', source: '官方资料库', note: '室内项目案例与技术细节' },
    ],
    videos: [
      { title: '室内设计零基础入门（八年设计总监亲授）', url: 'https://www.bilibili.com/video/BV1mx411d7Zn', source: 'Bilibili', note: '室内设计实务课' },
    ],
    books: [
      { title: '室内设计资料集', author: '张绮曼', why: '室内设计的工具书级资料集' },
{ title: 'Interior Design Illustrated', author: 'Francis D. K. Ching', why: '空间表达与图纸语言的权威参考，适合深化专业能力' }],
  },
  '工业设计师': {
    videos: [
      { title: 'Rhino 犀牛工业产品建模系统教程', url: 'https://www.bilibili.com/video/BV1vf421S7rF', source: 'Bilibili', note: '工业设计建模主力工具' }
    ],
    docs: [
      { title: '设计概论', url: 'https://www.icourse163.org/course/-1003632007', source: '中国大学MOOC', note: '产品设计、环境设计全景导论' },

      { title: 'reddit · r/industrialdesign', url: 'https://www.reddit.com/r/industrialdesign/', source: '行业社区', note: '工业设计全球社区', kind: 'community' }
    ],
    books: [
      { title: '设计心理学', author: '唐纳德·诺曼', why: '可用性与用户心智的设计经典' },
{ title: 'The Design of Everyday Things', author: 'Don Norman', why: '从用户与物的关系理解产品设计，工业设计必读' }],
  },
  '初级工业设计师': {
    videos: [
      { title: 'Rhino 犀牛工业产品建模系统教程', url: 'https://www.bilibili.com/video/BV1vf421S7rF', source: 'Bilibili', note: '工业设计建模主力工具' },
    ],
    docs: [
      { title: 'reddit · r/industrialdesign', url: 'https://www.reddit.com/r/industrialdesign/', source: '行业社区', note: '工业设计全球社区', kind: 'community' },
{ title: 'SketchUp 官方教程（Learn SketchUp）', url: 'https://learn.sketchup.com/tutorials', source: '官方文档' }],
    books: [
      { title: '设计心理学', author: '唐纳德·诺曼', why: '可用性与用户心智的设计经典' },
{ title: 'The Design of Everyday Things', author: 'Don Norman', why: '建立产品设计的基本判断，适合入门' }],
  },
  '高级工业设计师': {
    docs: [
      { title: 'reddit · r/industrialdesign', url: 'https://www.reddit.com/r/industrialdesign/', source: '行业社区', note: '工业设计全球社区', kind: 'community' },

      { title: '产品设计与工程（江南大学）', url: 'https://www.icourse163.org/course/-1460191162', source: '中国大学MOOC', note: '材料、工艺与结构的工程根基' },
    ],
    videos: [
      { title: 'Rhino 犀牛工业产品建模系统教程', url: 'https://www.bilibili.com/video/BV1vf421S7rF', source: 'Bilibili', note: '工业设计建模主力工具' },
    ],
    books: [
      { title: '设计心理学', author: '唐纳德·诺曼', why: '可用性与用户心智的设计经典' },
{ title: 'The Design of Everyday Things', author: 'Don Norman', why: '用户心理与产品交互的深度思考，适合进阶' }],
  },
  '交互设计师': {
    videos: [
      { title: 'Figma 零基础完全入门教程', url: 'https://www.bilibili.com/video/BV1LDUWBjEPD', source: 'Bilibili', note: '协作设计工具系统课' },
    ],
    docs: [
      { title: 'reddit · r/UXDesign', url: 'https://www.reddit.com/r/UXDesign/', source: '行业社区', note: 'UX 设计全球社区', kind: 'community' },

      { title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' },
      { title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn', source: '官方文档', note: '了解前端实现边界' },
    ],
    books: [
      { title: 'Designing Interfaces', author: 'Jenifer Tidwell', why: '交互模式的经典总结，可直接用于设计决策' },
      { title: 'The Design of Everyday Things', author: 'Don Norman', why: '交互设计的心智模型入门，理解用户行为' },
    ],
  },
  '初级交互设计师': {
    docs: [
      { title: 'reddit · r/UXDesign', url: 'https://www.reddit.com/r/UXDesign/', source: '行业社区', note: 'UX 设计全球社区', kind: 'community' },

      { title: '产品设计与工程（江南大学）', url: 'https://www.icourse163.org/course/-1460191162', source: '中国大学MOOC', note: '含用户调查与研究方法的工业设计课' },
    ],
    videos: [
      { title: 'Figma 零基础完全入门教程', url: 'https://www.bilibili.com/video/BV1LDUWBjEPD', source: 'Bilibili', note: '协作设计工具系统课' },
    ],
    books: [
      { title: 'About Face 4：交互设计精髓', author: '艾伦·库珀', why: '交互设计目标导向方法论的权威' },
{ title: 'The Design of Everyday Things', author: 'Don Norman', why: '建立交互设计的基础思维' }],
  },
  '高级交互设计师': {
    videos: [
      { title: 'Figma 零基础完全入门教程', url: 'https://www.bilibili.com/video/BV1LDUWBjEPD', source: 'Bilibili', note: '协作设计工具系统课' }
    ],
    books: [
      { title: 'About Face 4：交互设计精髓', author: '艾伦·库珀', why: '交互设计目标导向方法论的权威' },
{ title: 'Designing Interfaces', author: 'Jenifer Tidwell', why: '系统梳理交互模式，适合进阶与方法沉淀' }],
    docs: [
      { title: 'UI及交互技术（南京邮电大学）', url: 'https://higher.smartedu.cn/course/6a8f6b9ab44e493c76401fec', source: '国家高等教育智慧教育平台', note: '用户研究到可用性测试全流程' },

      { title: 'reddit · r/UXDesign', url: 'https://www.reddit.com/r/UXDesign/', source: '行业社区', note: 'UX 设计全球社区', kind: 'community' }
    ],
  },
  '字体设计师': {
    docs: [
      { title: 'reddit · r/typography', url: 'https://www.reddit.com/r/typography/', source: '行业社区', note: '字体设计全球社区', kind: 'community' },

      { title: '视觉传达设计1（字体·标志·版式）', url: 'https://www.icourse163.org/course/cid=1450090164', source: '中国大学MOOC', note: '字体设计原则与创意表现专项' },
    ],
    videos: [
      { title: '100个字体设计练习与8种字体设计技巧', url: 'https://www.bilibili.com/video/BV1gq4y147nx', source: 'Bilibili', note: '字体设计方法课' },
    ],
    books: [
      { title: 'Thinking with Type', author: 'Ellen Lupton', why: '字体与版式的实用入门，理解字形与信息传达' },
      { title: 'The Elements of Typographic Style', author: 'Robert Bringhurst', why: '字体排印的权威规范，适合深入研究' },
    ],
  },
  '3D建模师': {
    books: [
      { title: '色彩与光线', author: '詹姆斯·格尔尼', why: '渲染光影的绘画理论根基' },
      { title: '艺术与视知觉', author: '鲁道夫·阿恩海姆', why: '视觉感知与形态心理的经典' },
    ],
    videos: [
      { title: 'Blender 零基础入门教程（Kurt）', url: 'https://www.bilibili.com/video/BV14u41147YH', source: 'Bilibili', note: '中文区新手必刷 Blender 课' },
    ],
    docs: [
      { title: 'reddit · r/blender', url: 'https://www.reddit.com/r/blender/', source: '行业社区', note: 'Blender 全球社区', kind: 'community' },

      { title: 'Blender 官方手册（英文最新版）', url: 'https://docs.blender.org/manual/en/latest/', source: '官方文档' },
      { title: 'Unreal Engine 5 入门文档', url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-getting-started', source: '官方文档' },
    ],
  },
  '游戏原画师': {
    books: [
      { title: '色彩与光线', author: '詹姆斯·格尔尼', why: '原画光色的行业必读' },
      { title: '伯里曼人体结构绘画教学', author: '乔治·伯里曼', why: '角色造型的人体结构根基' },
    ],
    videos: [
      { title: '从萌新到职业原画师学习之路', url: 'https://www.bilibili.com/video/BV1Qa4y1p7FF', source: 'Bilibili', note: '原画职业系统课' },
    ],
    docs: [
      { title: 'ArtStation', url: 'https://www.artstation.com/', source: '行业社区', note: '游戏原画作品主阵地', kind: 'community' },
{ title: 'Unity Learn 官方学习平台', url: 'https://learn.unity.com/', source: '官方文档' }],
  },
  '色彩顾问': {
    docs: [
      { title: 'reddit · r/learnart', url: 'https://www.reddit.com/r/learnart/', source: '行业社区', note: '色彩练习讨论社区', kind: 'community' },

      { title: '中国色（传统色配色库）', url: 'https://www.zhongguose.com/', source: '官方资料库', note: '中国传统色色值与配色参考' },
    ],
    videos: [
      { title: '我知道你想学色彩！颜色基础', url: 'https://www.bilibili.com/video/BV1hs411S7di', source: 'Bilibili', note: '色彩基础课' },
    ],
    books: [
      { title: '贝蒂的色彩', author: '贝蒂·艾德华', why: '色彩感知与配色的系统训练' },
{ title: 'The Interaction of Color', author: 'Josef Albers', why: '色彩相互作用的经典实验与理论，适合培养色感' }],
  },
  '声音设计师': {
    books: [
      { title: '声音设计：电影中语言、音乐和音响的表现力', author: '大卫·索斯申', why: '声音设计的体系教材' },
      { title: '认识电影', author: '路易斯·贾内梯', why: '声音在视听语言中的角色' },
    ],
    videos: [
      { title: '新手也能学会的音效设计', url: 'https://www.bilibili.com/video/BV17D4y167tQ', source: 'Bilibili', note: '音效设计入门' },
    ],
    docs: [
      { title: 'Behance（Adobe 作品社区）', url: 'https://www.behance.net/', source: '行业社区', note: '全球设计作品平台', kind: 'community' },
{ title: 'Ableton Live 官方手册', url: 'https://www.ableton.com/en/manual/', source: '官方文档' }],
  },
  '策展人': {
    books: [
      { title: '艺术的故事', author: '贡布里希', why: '策展人必备的艺术史底盘' },
      { title: '策展人手册', author: '阿德莉安·乔治', why: '策展实务的流程手册' },
    ],
    videos: [{ title: 'Khan Academy 西方艺术史入门', url: 'https://www.khanacademy.org/humanities/art-history/beginners-art-history', source: 'Khan Academy' }],
    docs: [
      { title: 'reddit · r/ArtFundamentals', url: 'https://www.reddit.com/r/ArtFundamentals/', source: '行业社区', note: '艺术与展览讨论社区', kind: 'community' },
{ title: 'ICOM 国际博物馆协会', url: 'https://icom.museum/', source: '行业组织' }],
  },
  '文创产品设计师': {
    docs: [
      { title: 'Behance（Adobe 作品社区）', url: 'https://www.behance.net/', source: '行业社区', note: '全球设计作品平台', kind: 'community' },

      { title: '故宫博物院（文物图库与文创参考）', url: 'https://www.dpm.org.cn/', source: '官方资料库', note: '文物纹样与文创开发的官方图源' },
    ],
    videos: [
      { title: '产品设计与开发：故宫文创', url: 'https://www.bilibili.com/video/BV1cbQDYmE5n', source: 'Bilibili', note: '文创产品开发案例' },
    ],
    books: [
      { title: '设计中的设计', author: '原研哉', why: '日常物再设计的文创思维' },
{ title: 'Universal Principles of Design', author: 'William Lidwell 等', why: '设计原则速查手册，适合将文化元素转化为产品' }],
  },
  '数字艺术家': {
    books: [
      { title: '艺术·设计的色彩构成', author: '朝仓直巳', why: '数字色彩体系的基础教材' },
      { title: '艺术·设计的平面构成', author: '朝仓直巳', why: '数字图形构成的基础教材' },
    ],
    videos: [
      { title: 'GA词条：数字艺术 Digital Art', url: 'https://www.bilibili.com/video/BV16q4y1r71L', source: 'Bilibili', note: '数字艺术概念与谱系' },
    ],
    docs: [
      { title: 'ArtStation', url: 'https://www.artstation.com/', source: '行业社区', note: '数字艺术与概念设计平台', kind: 'community' },

      { title: 'Blender 官方手册（英文最新版）', url: 'https://docs.blender.org/manual/en/latest/', source: '官方文档' },
      { title: 'Processing 官方网站（创意编程）', url: 'https://processing.org/', source: '官方文档' },
    ],
  },
  '雕塑家': {
    docs: [
      { title: 'reddit · r/sculpture', url: 'https://www.reddit.com/r/sculpture/', source: '行业社区', note: '雕塑全球社区', kind: 'community' },

      { title: '故宫博物院数字文物库（雕塑文物）', url: 'https://digicol.dpm.org.cn/', source: '官方资料库', note: '历代彩塑石雕的高清原作' },
    ],
    videos: [
      { title: '传统雕塑实践（全15讲）', url: 'https://www.bilibili.com/video/BV1xZ4y1W7x6', source: 'Bilibili', note: '传统雕塑工艺课' },
    ],
    books: [
      { title: '中国雕塑史', author: '梁思成', why: '中国雕塑的学术通史' },
{ title: 'Art and Fear', author: 'David Bayles、Ted Orland', why: '讨论创作中的恐惧与坚持，适合长期艺术实践者' }],
  },
  '陶艺家': {
    docs: [
      { title: 'reddit · r/pottery', url: 'https://www.reddit.com/r/pottery/', source: '行业社区', note: '陶艺全球社区', kind: 'community' },

      { title: '故宫博物院数字文物库（陶瓷器物）', url: 'https://digicol.dpm.org.cn/', source: '官方资料库', note: '历代陶瓷器型与釉色原作' },
    ],
    videos: [
      { title: '泥塑塑形与开脸技法', url: 'https://www.bilibili.com/video/BV1hZ421N7WR', source: 'Bilibili', note: '陶塑造型基本功' },
    ],
    books: [
      { title: '中国陶瓷史', author: '中国硅酸盐学会', why: '陶瓷史的权威通史' },
{ title: 'Art and Fear', author: 'David Bayles、Ted Orland', why: '讨论创作中的恐惧与坚持，适合长期手工创作' }],
  },
  '展示设计师': {
    books: [
      { title: '室内设计资料集', author: '张绮曼', why: '室内设计的工具书级资料集' },
      { title: '设计中的设计', author: '原研哉', why: '设计思维与日常美学' }
    ],
    videos: [
      { title: '室内设计全套教程（全168集）', url: 'https://www.bilibili.com/video/BV1xgz1Y3EHZ', source: 'Bilibili', note: '室内设计长线课程' }
    ],
    docs: [
      { title: '设计概论', url: 'https://www.icourse163.org/course/-1003632007', source: '中国大学MOOC', note: '产品设计、环境设计全景导论' },

      { title: '谷德设计网', url: 'https://www.gooood.cn/', source: '行业社区', note: '建筑与室内一线项目案例库', kind: 'community' }
    ],
  },
  'Web设计师': {
    videos: [
      { title: '黑马pink老师：HTML5+CSS3 零基础入门', url: 'https://www.bilibili.com/video/BV14J4114768', source: 'Bilibili', note: '网页实现的技术根基' },
    ],
    docs: [
      { title: 'reddit · r/web_design', url: 'https://www.reddit.com/r/web_design/', source: '行业社区', note: '网页设计全球社区', kind: 'community' },

      { title: 'MDN Web 开发学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn', source: '官方文档' },
      { title: 'W3C WCAG 无障碍指南', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', source: '官方文档' },
    ],
    books: [
      { title: '点石成金', author: '史蒂夫·克鲁克', why: '网页可用性的常识经典' },
{ title: "Don't Make Me Think", author: 'Steve Krug', why: '网页可用性的经典入门，适合 Web 设计启蒙' }],
  },
  '数据可视化设计师': {
    videos: [
      { title: 'Coursera 数据可视化（Data Visualization）课程', url: 'https://www.coursera.org/learn/data-visualization', source: 'Coursera' },
      { title: 'edX 数据可视化（Data Visualization）课程', url: 'https://www.edx.org/learn/data-visualization', source: 'edX' },
    ],
    docs: [
      { title: 'Dribbble（设计作品社区）', url: 'https://dribbble.com/', source: '行业社区', note: '设计作品灵感平台', kind: 'community' },
{ title: 'D3.js 官方网站', url: 'https://d3js.org/', source: '官方文档' }],
    books: [
      { title: 'Storytelling with Data', author: 'Cole Nussbaumer Knaflic', why: '用数据讲故事的实用指南，图表设计入门首选' },
      { title: 'The Visual Display of Quantitative Information', author: 'Edward Tufte', why: '数据可视化理论的奠基之作' },
    ],
  },
  '大屏数据可视化': {
    videos: [
      { title: '一键制作数据图表动画全流程教程', url: 'https://www.bilibili.com/video/BV1MywuzwEkY', source: 'Bilibili', note: '数据图表动效制作' },
    ],
    docs: [
      { title: 'reddit · r/learnart', url: 'https://www.reddit.com/r/learnart/', source: '行业社区', note: '绘画学习社区', kind: 'community' },
{ title: 'D3.js 官方网站', url: 'https://d3js.org/', source: '官方文档' }],
    books: [
      { title: '用数据讲故事', author: '科尔·努斯鲍默·纳夫利克', why: '商业图表表达的经典' },
{ title: 'Storytelling with Data', author: 'Cole Nussbaumer Knaflic', why: '大屏叙事与图表选择的实践参考' }],
  },
  '游戏UI设计师': {
    books: [
      { title: '游戏设计艺术', author: '杰西·谢尔', why: '游戏体验设计的透镜方法论' },
      { title: '点石成金', author: '史蒂夫·克鲁克', why: '界面易用性的常识根基' }
    ],
    videos: [
      { title: '呆呆教你如何入门游戏UI（控件和图标）', url: 'https://www.bilibili.com/video/BV1Vt4y1e7Q8', source: 'Bilibili', note: '游戏 GUI 专项课' }
    ],
    docs: [
      { title: 'reddit · r/learnart', url: 'https://www.reddit.com/r/learnart/', source: '行业社区', note: '绘画学习社区', kind: 'community' },

      { title: 'Unity Learn 官方学习平台', url: 'https://learn.unity.com/', source: '官方文档' }
    ],
  },
  '设计系统工程师': {
    videos: [
      { title: '交互设计零基础入门教程', url: 'https://www.bilibili.com/video/BV1W64y1B77L', source: 'Bilibili', note: '交互理念与实训' }
    ],
    docs: [
      { title: 'UI及交互技术（南京邮电大学）', url: 'https://higher.smartedu.cn/course/6a8f6b9ab44e493c76401fec', source: '国家高等教育智慧教育平台', note: '用户研究到可用性测试全流程' },

      { title: 'UI中国', url: 'https://www.ui.cn/', source: '行业社区', note: '国内 UI/UX 作品社区', kind: 'community' }
    ],
    books: [
      { title: 'Atomic Design', author: 'Brad Frost', why: '原子化组件体系的方法论，设计系统入门经典' },
      { title: 'Design Systems', author: 'Alla Kholmatova', why: '设计系统从搭建到治理的完整实践指南' }
    ],
  },
  '无障碍设计师': {
    books: [
      { title: '点石成金', author: '史蒂夫·克鲁克', why: '可访问的可用性常识' },
      { title: '设计的法则', author: '威廉·立德威尔', why: '通用设计的原理手册' },
    ],
    videos: [
      { title: '无障碍设计：给世界多点包容和温暖', url: 'https://www.bilibili.com/video/BV1tg41137EL', source: 'Bilibili', note: '无障碍设计项目思路' },
    ],
    docs: [
      { title: 'ArchDaily 中文（建筑与景观案例库）', url: 'https://www.archdaily.cn/', source: '行业社区', note: '建筑景观案例库', kind: 'community' },

      { title: 'W3C WCAG 无障碍指南', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', source: '官方文档' },
      { title: 'The A11Y Project 无障碍资源', url: 'https://www.a11yproject.com/', source: '社区文档' },
    ],
  },
  '虚拟人形象设计师': {
    books: [
      { title: '色彩与光线', author: '詹姆斯·格尔尼', why: '渲染光影的绘画理论根基' },
      { title: '艺术与视知觉', author: '鲁道夫·阿恩海姆', why: '视觉感知与形态心理的经典' },
    ],
    videos: [
      { title: 'Blender 零基础入门教程（Kurt）', url: 'https://www.bilibili.com/video/BV14u41147YH', source: 'Bilibili', note: '中文区新手必刷 Blender 课' },
    ],
    docs: [
      { title: 'reddit · r/blender', url: 'https://www.reddit.com/r/blender/', source: '行业社区', note: 'Blender 全球社区', kind: 'community' },

      { title: 'Blender 官方手册（英文最新版）', url: 'https://docs.blender.org/manual/en/latest/', source: '官方文档' },
      { title: 'Unreal Engine 5 入门文档', url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/unreal-engine-5-getting-started', source: '官方文档' },
    ],
  },
  '可持续设计顾问': {
    videos: [
      { title: 'SketchUp 草图大师零基础到精通', url: 'https://www.bilibili.com/video/BV1PecqeuEnC', source: 'Bilibili', note: '产品与空间快速建模' },
    ],
    docs: [
      { title: '普象网（工业设计社区）', url: 'https://www.puxiang.com/', source: '行业社区', note: '国内产品设计师社区', kind: 'community' },
{ title: '埃伦·麦克阿瑟基金会（循环经济）', url: 'https://www.ellenmacarthurfoundation.org/', source: '官方文档' }],
    books: [
      { title: '设计心理学', author: '唐纳德·诺曼', why: '可用性与用户心智的设计经典' },
{ title: 'Cradle to Cradle', author: 'William McDonough、Michael Braungart', why: '摇篮到摇篮的可持续设计理念，行业经典' }],
  },
  'B端产品设计师': {
    videos: [
      { title: 'UI设计从零基础入门到精通', url: 'https://www.bilibili.com/video/BV1KT4y1E7tV', source: 'Bilibili', note: 'UI 全流程课程' },
    ],
    docs: [
      { title: 'reddit · r/Design', url: 'https://www.reddit.com/r/Design/', source: '行业社区', note: '综合设计讨论社区', kind: 'community' },
{ title: 'Material Design 3 官方指南', url: 'https://m3.material.io/', source: '官方文档' }],
    books: [
      { title: '写给大家看的设计书', author: '罗宾·威廉姆斯', why: '亲密对齐重复对比四大原则的入门经典' },
{ title: 'About Face: The Essentials of Interaction Design', author: 'Alan Cooper', why: '复杂业务系统的交互设计方法，适合 B 端场景' }],
  },
};
