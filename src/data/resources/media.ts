import type { CareerResourceSet } from '../career-resources';

export const mediaResources: Record<string, CareerResourceSet> = {
  '编剧': {
    docs: [{ title: '美国编剧工会（WGA）官网', url: 'https://www.wga.org/', source: '行业协会' }],
    books: [
      { title: '故事', author: 'Robert McKee', why: '剧作结构与人物塑造的经典教材，编剧入门首选' },
      { title: 'Screenplay: The Foundations of Screenwriting', author: 'Syd Field', why: '三幕结构理论的经典入门，剧本写作必读' },
    ],
  },
  '影视剧本医生': {
    books: [{ title: '故事', author: 'Robert McKee', why: '剧本结构诊断的理论基础，评估修改必读' }],
  },
  '数码编辑': {
    docs: [{ title: '36氪（科技与商业内容平台）', url: 'https://36kr.com/', source: '行业平台' }],
  },
  '播客制作人': {
    docs: [{ title: 'Apple Podcasts for Creators（官方创作者指南）', url: 'https://podcasters.apple.com/', source: '官方文档' }],
  },
  '播客主播': {
    docs: [{ title: 'Apple Podcasts for Creators（官方创作者指南）', url: 'https://podcasters.apple.com/', source: '官方文档' }],
  },
  '综艺节目编导': {
    docs: [{ title: '国家广播电视总局官网（节目内容监管规定）', url: 'https://www.nrta.gov.cn/', source: '监管机构' }],
  },
  '综艺节目主持人': {
    docs: [{ title: '国家广播电视总局官网（节目内容监管规定）', url: 'https://www.nrta.gov.cn/', source: '监管机构' }],
  },
  '数字营销专家': {
    videos: [
    ],
    books: [{ title: '疯传', author: 'Jonah Berger', why: '拆解内容为何被传播，数字营销策略的经典读物' }],
  },
  '知识博主': {
    docs: [{ title: '抖音创作者服务平台', url: 'https://creator.douyin.com/', source: '官方平台' }],
    books: [{ title: '如何阅读一本书', author: 'Mortimer J. Adler、Charles Van Doren', why: '深度阅读与理解的方法论，知识输出的底层能力' }],
  },
  'AI内容创作者': {
    videos: [{ title: 'Generative AI for Everyone（吴恩达，Coursera）', url: 'https://www.coursera.org/learn/generative-ai-for-everyone', source: 'Coursera', note: '非技术背景也能学的生成式 AI 入门' }],
  },
  '元宇宙内容创作者': {
    docs: [{ title: 'Blender 官方网站（开源 3D 创作软件）', url: 'https://www.blender.org/', source: '官方文档' }],
  },
  '书籍设计师': {
    books: [{ title: '写给大家看的设计书', author: 'Robin Williams', why: '排版与版面设计的入门经典，书籍装帧基本功' }],
  },
  '自媒体孵化经理': {
    videos: [{ title: 'Social Media Marketing（Coursera）', url: 'https://www.coursera.org/learn/social-media-marketing', source: 'Coursera' }],
    docs: [{ title: '虎嗅（商业与科技内容平台）', url: 'https://www.huxiu.com/', source: '行业平台' }],
  },
  '宣传片导演': {
    docs: [{ title: 'DaVinci Resolve 官方网站（专业剪辑与调色软件）', url: 'https://www.davinciresolve.com/', source: '官方文档' }],
  },
  '影视营销策划': {
    books: [{ title: '疯传', author: 'Jonah Berger', why: '内容传播机制的经典分析，影视宣发策划可借鉴' }],
  },
  'MCN机构运营': {
    docs: [{ title: '36氪（科技与商业内容平台）', url: 'https://36kr.com/', source: '行业平台' }],
  },
  '事实核查员': {
    docs: [{ title: 'Verification Handbook（在线事实核查手册）', url: 'https://verificationhandbook.com/', source: '行业手册' }],
    books: [{ title: 'The Elements of Journalism', author: 'Bill Kovach、Tom Rosenstiel', why: '新闻真实性与职业伦理的经典阐述，核查工作的底线' }],
  },
  '互动叙事设计师': {
    docs: [{ title: 'Ink 互动叙事语言官方文档（Inkle Studios）', url: 'https://www.inklestudios.com/ink/', source: '官方文档' }],
  },
  '虚拟制片师': {
    docs: [{ title: 'Unreal Engine 虚拟制片官方文档', url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-production-in-unreal-engine', source: '官方文档' }],
  },
  '舆情监测分析师': {
    docs: [{ title: '中国互联网络信息中心（CNNIC）官网，发布网络舆情与互联网发展报告', url: 'https://www.cnnic.net.cn/', source: '官方机构' }],
  },
};
