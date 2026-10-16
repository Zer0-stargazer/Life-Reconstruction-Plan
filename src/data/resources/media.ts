import type { CareerResourceSet } from '../career-resources';

/**
 * 传媒类 · 45 个职业，每个职业 5 份专属资源。
 *
 * 2026-10-12 第二次重写（四类保底版）。主人核对后指出：书和文档是够了，
 * 但"视频教程"只有 7 条、"论坛"一条都没有——而资源面板第二组标题本来
 * 就叫「文档与论坛」。主人定的标准：**维持 5 份，四类各保底 1 条**。
 *
 * 本批口径：
 * - 每人固定 5 份 = 1 视频 + 1 文档 + 1 论坛社区 + 2 书籍
 * - 论坛条目带 kind: 'community'，页面单独渲染成一组，不再和文档混在一起
 * - 视频 B站一律给具体 BV 号（用官方 view 接口逐条验真，标题/日期/P 数都对过），
 *   不给"搜一下就有"的频道主页——本机 curl 拿到的 space 页全是验证码壳页，验不了
 * - 链接必须是能直接打开就学的具体页面，不用平台首页、不用搜索页
 * - 同一条链接最多 3 个职业共用（脚本会卡这条线）
 */
export const mediaResources: Record<string, CareerResourceSet> = {
  // ================= 内容创作与自媒体 =================
  '内容创作者/KOL': {
    videos: [
      { title: '想做UP主？B站最强入门指南！【保姆级教学】', url: 'https://www.bilibili.com/video/BV1Up2aBSEPF/', source: 'B站', note: '封面、标题、弹幕互动到转型话术，起号全流程一次讲完' },
    ],
    docs: [
      { title: '新榜（内容产业与 KOL 数据平台）', url: 'https://www.newrank.cn/', source: '行业平台', note: '看头部账号的真实数据，选题前先摸清赛道' },
      { title: '知乎创作者中心', url: 'https://www.zhihu.com/creator', source: '创作者社区', note: '长图文的流量逻辑与评论区运营，同行都在这里复盘', kind: 'community' },
    ],
    books: [
      { title: '爆款文案', author: '关健明', why: '把"怎么写才有人点"拆成可复制的句式训练' },
      { title: '疯传', author: 'Jonah Berger', why: '拆解内容为何被传播，六条社交货币原则' },
    ],
  },
  '视频剪辑师': {
    videos: [
      { title: '达芬奇 DaVinci Resolve 从入门到精通（32 集）', url: 'https://www.bilibili.com/video/BV1Bz421i7tv/', source: 'B站', note: '剪辑与调色两条线都讲，免费软件零成本上手' },
    ],
    docs: [
      { title: 'DaVinci Resolve 官方培训（Blackmagic Design）', url: 'https://www.blackmagicdesign.com/products/davinciresolve/training', source: '官方培训', note: '官方免费培训教材 + 项目文件，可考认证' },
      { title: '剪映创作社区', url: 'https://www.capcut.cn/', source: '创作者社区', note: '模板、热门玩法与同行的成片拆解，手机端剪辑主阵地', kind: 'community' },
    ],
    books: [
      { title: '剪辑的语法', author: '罗伊·汤普森、克里斯托弗·鲍恩', why: '剪辑的通用规则手册，图例极多，零基础可读' },
      { title: '眨眼之间：电影剪辑的奥秘', author: '沃尔特·默奇', why: '剪辑大师谈节奏与情绪，建立剪辑审美' },
    ],
  },
  '新媒体运营': {
    videos: [
      { title: '新媒体运营全域课程（起号/私域/变现/矩阵，28 集）', url: 'https://www.bilibili.com/video/BV1SFF6zyEAi/', source: 'B站', note: '从平台选择到矩阵搭建，运营动作逐个过' },
    ],
    docs: [
      { title: '巨量算数（短视频与直播内容趋势）', url: 'https://trendinsight.oceanengine.com/', source: '官方平台', note: '查关键词热度与人群画像，判断选题值不值得做' },
      { title: '人人都是产品经理（运营与增长社区）', url: 'https://www.woshipm.com/', source: '运营社区', note: '运营案例拆解，能直接抄结构', kind: 'community' },
    ],
    books: [
      { title: '从零开始做运营', author: '张亮', why: '把运营拆成内容、活动、用户三块，入门地图' },
      { title: '增长黑客', author: 'Sean Ellis、Morgan Brown', why: '用数据验证运营动作是否真的有效' },
    ],
  },
  '编剧': {
    videos: [
      { title: '18分钟彻底理解电影剧本结构：剧作学习最重要的第一课', url: 'https://www.bilibili.com/video/BV1as4y1K7p8/', source: 'B站', note: '把结构的本质一次讲清，看完就能照着搭自己的故事' },
    ],
    docs: [
      { title: '美国编剧工会（WGA）官网', url: 'https://www.wga.org/', source: '行业协会', note: '行业合同、署名规则与编剧权益，职业化必读' },
      { title: '中国作家网', url: 'https://www.chinawriter.com.cn/', source: '作家社区', note: '作协主办的创作讨论与作品发布，中文写作的一线现场', kind: 'community' },
    ],
    books: [
      { title: '故事：材质、结构、风格和银幕剧作的原理', author: 'Robert McKee', why: '剧作结构圣经，讲清冲突与转折的底层机制' },
      { title: '电影剧本写作基础', author: 'Syd Field', why: '三幕结构的经典入门，附范例与练习' },
    ],
  },
  '纪录片导演': {
    videos: [
      { title: '央视导演教你高效制作分镜头脚本（纪录片与宣传片）', url: 'https://www.bilibili.com/video/BV1x1421f7mM/', source: 'B站', note: '分镜脚本贯穿拍前到后期，导演的基本功' },
    ],
    docs: [
      { title: '国际纪录片协会（IDA）', url: 'https://www.documentary.org/', source: '行业协会', note: '纪录片制作资源、行业访谈与案例库' },
      { title: '新片场', url: 'https://www.xinpianchang.com/', source: '影视创作社区', note: '大量真实成片与创作人复盘，看别人怎么拍的', kind: 'community' },
    ],
    books: [
      { title: '纪录片导论', author: 'Bill Nichols', why: '纪录片的六种模式与伦理边界，理论根基' },
      { title: '拍摄纪录片', author: 'Michael Rabiger', why: '从选题、拍摄到剪辑的全流程实操手册' },
    ],
  },
  '出版编辑': {
    videos: [
      { title: '出书顺序不要弄反了！8个关键出书流程', url: 'https://www.bilibili.com/video/BV1NsFNzrEyR/', source: 'B站', note: '从选题到书号的完整链路，入行先建立全局感' },
    ],
    docs: [
      { title: '国家新闻出版署（出版资质与选题管理）', url: 'https://www.nppa.gov.cn/', source: '监管机构', note: '书号、CIP 与选题报批规则，入行先懂' },
      { title: '豆瓣小组', url: 'https://www.douban.com/group/explore', source: '兴趣社区', note: '读书与出版相关小组，看真实读者在意什么', kind: 'community' },
    ],
    books: [
      { title: '编辑人的世界', author: 'Gerald Gross 编', why: '三十余位资深编辑亲述，编辑职业的全景读本' },
      { title: '老猫学出版', author: '陈颖青', why: '从选题到印数的出版实务，中文语境、极实用' },
    ],
  },
  '新闻记者': {
    videos: [
      { title: '成为一名记者：报道新闻！（专项课程，密歇根州立大学）', url: 'https://www.coursera.org/specializations/become-a-journalist', source: 'Coursera', note: '从什么算新闻到采访、成稿、分发，五门课连成一条线' },
    ],
    docs: [
      { title: 'Poynter（新闻实务与伦理培训）', url: 'https://www.poynter.org/', source: '行业机构', note: '采访技巧、核查方法与伦理案例，持续更新' },
      { title: '界面新闻', url: 'https://www.jiemian.com/', source: '新闻社区', note: '原创新闻的选题与写法范本，每天更新的一线现场', kind: 'community' },
    ],
    books: [
      { title: '哈佛非虚构写作课：怎样讲好一个故事', author: '马克·克雷默、温迪·考尔 编', why: '五十余位非虚构作者谈采写，可直接照做' },
      { title: '华尔街日报是如何讲故事的', author: '威廉·E.布隆代尔', why: '把枯燥信息写成有吸引力的报道，逐条讲方法' },
    ],
  },
  '数码编辑': {
    videos: [
      { title: '产品视频拍摄教学：如何拍出大片感的 B-roll 转场', url: 'https://www.bilibili.com/video/BV1aA41177ff/', source: 'B站', note: '数码评测的视频质感，靠的就是这些 B-roll 与转场' },
    ],
    docs: [
      { title: 'IT之家（数码资讯与首发评测）', url: 'https://www.ithome.com/', source: '行业媒体', note: '新品信息的第一落点，写稿素材的原始出处' },
      { title: '数字尾巴', url: 'https://www.dgtle.com/', source: '数码社区', note: '真实用户的购机与使用讨论，评测选题的来源', kind: 'community' },
    ],
    books: [
      { title: '文案训练手册', author: 'Joseph Sugarman', why: '广告文案的逐句拆解训练，短文案基本功' },
      { title: '风格的要素', author: 'Strunk & White', why: '英文写作的小册子，中文写作同样受用' },
    ],
  },
  '播客制作人': {
    videos: [
      { title: '卧室录音/直播 如何获得干净清晰的人声', url: 'https://www.bilibili.com/video/BV1Yc2jBSEDu/', source: 'B站', note: '设备、摆位到效果器链路，解决"听着不专业"' },
    ],
    docs: [
      { title: 'Audacity 官方手册', url: 'https://manual.audacityteam.org/', source: '官方文档', note: '免费录音剪辑软件，从降噪到导出全流程' },
      { title: '小宇宙', url: 'https://www.xiaoyuzhoufm.com/', source: '播客社区', note: '中文播客主阵地，看头部节目的选题与评论区', kind: 'community' },
    ],
    books: [
      { title: '声音设计：电影中语言、音乐和音响的表现力', author: 'David Sonnenschein', why: '声音如何影响情绪，播客听觉设计的方法论' },
      { title: '混音指南', author: 'Bobby Owsinski', why: '人声与背景音的平衡，把节目做出专业听感' },
    ],
  },
  '新闻编辑': {
    videos: [
      { title: '怎样像新闻主播那样表达？跟着康辉金句练习吧！', url: 'https://www.bilibili.com/video/BV1Et411c7sj/', source: 'B站', note: '稿件要读得出来才发得出去——新闻语言的口语化与节奏训练' },
    ],
    docs: [
      { title: '国家新闻出版署（记者证与编辑规范）', url: 'https://www.nppa.gov.cn/', source: '监管机构', note: '新闻采编规范与资质要求，把关的依据' },
      { title: '今日热榜', url: 'https://tophub.today/', source: '热点聚合社区', note: '全网各平台热点的聚合页，选题会的每日必看', kind: 'community' },
    ],
    books: [
      { title: '新闻编辑学', author: '蔡雯', why: '国内新闻编辑标准教材，选题、审稿、版面全覆盖' },
      { title: '新闻的十大基本原则', author: 'Bill Kovach、Tom Rosenstiel', why: '编辑判断的伦理底座，改稿时的取舍依据' },
    ],
  },
  '综艺节目编导': {
    videos: [
      { title: '现代视听节目编导与制作（哈尔滨师范大学）', url: 'https://www.icourse163.org/course/HRBNU-1002937002', source: '中国大学MOOC', note: '从节目策划到成片制作的系统课，编导的全流程' },
    ],
    docs: [
      { title: '国家广播电视总局（节目备案与内容监管）', url: 'https://www.nrta.gov.cn/', source: '监管机构', note: '综艺备案、审核红线与播出规范' },
      { title: '豆瓣电影', url: 'https://movie.douban.com/', source: '影视社区', note: '综艺口碑与观众真实反馈，复盘时最诚实的样本', kind: 'community' },
    ],
    books: [
      { title: '电视文艺节目策划与创作', author: '吴保和', why: '上戏编导教材，综艺/真人秀/谈话节目逐类拆解' },
      { title: '娱乐至死', author: 'Neil Postman', why: '理解综艺所处的媒介环境与它的社会代价' },
    ],
  },
  '数字营销专家': {
    videos: [
      { title: 'Google 数字营销与电子商务（职业证书，8 门课）', url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce', source: 'Coursera', note: 'Google 出品，从渠道到分析到电商的完整体系' },
    ],
    docs: [
      { title: 'Google 数字车库（免费营销与数据分析课程）', url: 'https://learndigital.withgoogle.com/digitalgarage', source: 'Google', note: '官方免费课程，含结业认证' },
      { title: '36氪', url: 'https://36kr.com/', source: '商业社区', note: '新品牌与增长案例的一手报道，看别人怎么打市场', kind: 'community' },
    ],
    books: [
      { title: '营销管理', author: 'Philip Kotler', why: '营销的系统教科书，建立完整框架再谈技巧' },
      { title: '定位', author: 'Al Ries、Jack Trout', why: '如何在用户心智里占一个位置' },
    ],
  },
  '知识博主': {
    videos: [
      { title: '个人UP怎么做科普视频？我的工作流程分享', url: 'https://www.bilibili.com/video/BV1ka411N7ds/', source: 'B站', note: '从选题到成片的真实工作流，一个人也能稳定产出' },
    ],
    docs: [
      { title: '视听传播原理（中国人民大学）', url: 'https://www.icourse163.org/course/RUC-1473666161', source: '中国大学MOOC', note: '传播与视听表达的原理课，知识内容的理论底子' },
      { title: '知乎创作者中心', url: 'https://www.zhihu.com/creator', source: '创作者社区', note: '长回答的流量逻辑与选题参考', kind: 'community' },
    ],
    books: [
      { title: '如何阅读一本书', author: 'Mortimer J. Adler、Charles Van Doren', why: '输入质量决定输出质量，知识博主的底层能力' },
      { title: '卡片笔记写作法', author: 'Sönke Ahrens', why: '把零散阅读变成可复用素材库的方法' },
    ],
  },
  'AI内容创作者': {
    videos: [
      { title: 'Generative AI for Everyone（吴恩达）', url: 'https://www.coursera.org/learn/generative-ai-for-everyone', source: 'Coursera', note: '非技术背景可学的生成式 AI 入门' },
    ],
    docs: [
      { title: 'Hugging Face Learn（免费 AI 课程与模型实践）', url: 'https://huggingface.co/learn', source: '官方文档', note: '边跑模型边学，含提示词与智能体课程' },
      { title: '机核网（游戏与流行文化社区）', url: 'https://www.gcores.com/', source: '文化社区', note: 'AI 创作在垂类内容里的真实讨论与作品', kind: 'community' },
    ],
    books: [
      { title: 'AI 未来进行式', author: '李开复、陈楸帆', why: '理解 AI 能做什么、边界在哪，选题判断用得上' },
      { title: '人工智能：现代方法', author: 'Stuart Russell、Peter Norvig', why: 'AI 领域标准教材，需要时按章节查' },
    ],
  },
  '自媒体孵化经理': {
    videos: [
      { title: '博主新手村速通：我扒了52个真实案例，破解起号常见9大问题', url: 'https://www.bilibili.com/video/BV1fiLu6YEZE/', source: 'B站', note: '孵化新人会遇到的问题，这里按真实案例逐个拆' },
    ],
    docs: [
      { title: '新榜（内容产业与 KOL 数据平台）', url: 'https://www.newrank.cn/', source: '行业平台', note: '找号、看号、判断一个号值不值得签' },
      { title: '36氪', url: 'https://36kr.com/', source: '商业社区', note: 'MCN 与内容产业的商业模式报道', kind: 'community' },
    ],
    books: [
      { title: '增长黑客', author: 'Sean Ellis、Morgan Brown', why: '孵化就是做增长，用实验而不是感觉' },
      { title: '爆款文案', author: '关健明', why: '教达人写"有人点"的标题与开头' },
    ],
  },
  'MCN机构运营': {
    videos: [
      { title: '蜂群文化CEO莫力洋：从内容生产到商业变现，MCN的N种商业形态', url: 'https://www.bilibili.com/video/BV16Q4y1Z7sH/', source: 'B站', note: '头部 MCN 掌门人讲商业模型，行业视角一手' },
    ],
    docs: [
      { title: '巨量算数（短视频与直播内容趋势）', url: 'https://trendinsight.oceanengine.com/', source: '官方平台', note: '选赛道、定人设前的数据依据' },
      { title: '抖音创作者服务平台', url: 'https://creator.douyin.com/', source: '创作者社区', note: '签约、数据与商单规则，机构运营的后台', kind: 'community' },
    ],
    books: [
      { title: '增长黑客', author: 'Sean Ellis、Morgan Brown', why: '把达人孵化当增长项目来管' },
      { title: '营销管理', author: 'Philip Kotler', why: '商单定价与品牌合作的系统框架' },
    ],
  },
  '个人IP运营': {
    videos: [
      { title: '很真诚，普通人怎么做自媒体呢？', url: 'https://www.bilibili.com/video/BV11d8RztEZd/', source: 'B站', note: '从目标、赛道到心态，把"做自己"讲成可执行的动作' },
    ],
    docs: [
      { title: '小红书创作服务平台', url: 'https://creator.xiaohongshu.com/', source: '官方平台', note: '笔记数据与选题灵感，个人 IP 起步常选' },
      { title: '什么值得买（消费内容社区）', url: 'https://www.smzdm.com/', source: '消费社区', note: '消费决策内容的样本库，看真实用户在意什么', kind: 'community' },
    ],
    books: [
      { title: '这就是营销', author: 'Seth Godin', why: '个人品牌不是包装，是"为谁解决什么问题"' },
      { title: '影响力', author: 'Robert Cialdini', why: '说服与信任的六条原理，理解涨粉的本质' },
    ],
  },
  '短视频编导': {
    videos: [
      { title: '为什么要运镜？五个技巧教你掌握运镜思维！', url: 'https://www.bilibili.com/video/BV1Wx4y1H7QB/', source: 'B站', note: '五种基础运镜背后的方法，短片镜头语言的起点' },
    ],
    docs: [
      { title: '抖音创作者服务平台', url: 'https://creator.douyin.com/', source: '官方平台', note: '创作学院里的分镜、脚本与完播率优化课' },
      { title: '哔哩哔哩创作中心', url: 'https://member.bilibili.com/', source: '创作者社区', note: '中长视频后台数据与创作学院，算法偏好在这里', kind: 'community' },
    ],
    books: [
      { title: '剪辑的语法', author: '罗伊·汤普森、克里斯托弗·鲍恩', why: '短片的镜头衔接与节奏规则，图例直观' },
      { title: '故事：材质、结构、风格和银幕剧作的原理', author: 'Robert McKee', why: '几十秒也要有冲突与转折，底层逻辑不变' },
    ],
  },

  // ================= 播客与声音 =================
  '播客主播': {
    videos: [
      { title: '腹式呼吸法：发声练习（十五）', url: 'https://www.bilibili.com/video/BV1iS4y1B7LY/', source: 'B站', note: '口播撑得住时长，先从气息控制练起' },
    ],
    docs: [
      { title: 'Apple Podcasts for Creators（创作者指南）', url: 'https://podcasters.apple.com/', source: '官方文档', note: '单人口播的设备建议与上线规范' },
      { title: '喜马拉雅（音频创作者社区）', url: 'https://www.ximalaya.com/', source: '音频社区', note: '中文音频最大的消费场，看同类节目的评论区', kind: 'community' },
    ],
    books: [
      { title: '演讲的力量', author: 'Chris Anderson', why: 'TED 掌门人讲如何让听众愿意听完' },
      { title: '即兴演讲', author: 'Judith Humphrey', why: '不写稿也能讲得有条理，口播类节目必备' },
    ],
  },
  '音频节目编导': {
    videos: [
      { title: 'Pro Tools 软件入门教程（基础功能 + 原厂效果器，75 集）', url: 'https://www.bilibili.com/video/BV1mgZHYZEmf/', source: 'B站', note: '从建工程到母带的完整链路，行业主流 DAW' },
    ],
    docs: [
      { title: 'iZotope 学习中心', url: 'https://www.izotope.com/en/learn', source: '官方教程', note: '响度标准、人声处理与母带，成片质感关键' },
      { title: '蜻蜓 FM（音频内容社区）', url: 'https://www.qingting.fm/', source: '音频社区', note: '广播剧与音频节目的另一个消费场', kind: 'community' },
    ],
    books: [
      { title: '声音设计：电影中语言、音乐和音响的表现力', author: 'David Sonnenschein', why: '声音如何引导注意力，编导的听觉叙事基础' },
      { title: '混音指南', author: 'Bobby Owsinski', why: '多轨素材做成统一听感的成品' },
    ],
  },
  '有声书制作人': {
    videos: [
      { title: 'Copyright Law in the Music Business（伯克利音乐学院）', url: 'https://www.edx.org/learn/music-business/berklee-college-of-music-copyright-law-in-the-music-business', source: 'edX', note: '有声书涉及音乐与录音版权，官方系统课' },
    ],
    docs: [
      { title: '国家版权局（著作权登记与合同规范）', url: 'https://www.ncac.gov.cn/', source: '官方机构', note: '改编权、录制权与邻接权，签约前必读' },
      { title: '喜马拉雅（有声书主阵地）', url: 'https://www.ximalaya.com/', source: '音频社区', note: '头部有声书的演播风格与听众反馈', kind: 'community' },
    ],
    books: [
      { title: '声音设计：电影中语言、音乐和音响的表现力', author: 'David Sonnenschein', why: '旁白的语气与停顿如何影响听感' },
      { title: '混音指南', author: 'Bobby Owsinski', why: '把多轨素材做成统一听感的成品' },
    ],
  },
  '解说员': {
    videos: [
      { title: '北京人艺冯远征亲身示范：怎样练习绕口令和吐字发声？', url: 'https://www.bilibili.com/video/BV1YS4y1e7hE/', source: 'B站', note: '职业剧团的吐字发声基本功，跟练就能用' },
    ],
    docs: [
      { title: '国家广播电视总局（节目语言规范与内容管理）', url: 'https://www.nrta.gov.cn/', source: '监管机构', note: '解说词的用语规范与红线，先懂规则再开口' },
      { title: '小宇宙', url: 'https://www.xiaoyuzhoufm.com/', source: '播客社区', note: '解说类与闲聊类节目的现场感样本', kind: 'community' },
    ],
    books: [
      { title: '中国播音学', author: '张颂', why: '国内播音主持理论奠基之作，发声与表达的根本' },
      { title: '实用播音教程（普通话语音与播音发声）', author: '中国传媒大学播音主持艺术学院 编', why: '播音专业教材，逐项练气息、口腔与吐字' },
    ],
  },
  '综艺节目主持人': {
    videos: [
      { title: '专业主持人说话发音技巧【松下巴 去喉音】', url: 'https://www.bilibili.com/video/BV18D421W7JK/', source: 'B站', note: '上镜状态的声音问题，多数出在下巴和喉部' },
    ],
    docs: [
      { title: '视听语言（中国传媒大学）', url: 'https://higher.smartedu.cn/course/67abdb7e225d72705e0fb09d', source: '国家智慧教育平台', note: '懂镜头语言，主持才不是念稿机器' },
      { title: '豆瓣电影', url: 'https://movie.douban.com/', source: '影视社区', note: '综艺口碑与观众视角，看观众为什么买账', kind: 'community' },
    ],
    books: [
      { title: '蔡康永的说话之道', author: '蔡康永', why: '把"会说话"拆成可练的日常动作，入门最轻松' },
      { title: '演讲的艺术', author: '斯蒂芬·卢卡斯', why: '美国高校公共演讲标准教材，控场与结构训练' },
    ],
  },
  '体育赛事解说员': {
    videos: [
      { title: '说话找不到思路，反应总是慢半拍？三个高效训练方法', url: 'https://www.bilibili.com/video/BV1tW4y1T7YY/', source: 'B站', note: '解说最值钱的是即时组织语言的能力，可练' },
    ],
    docs: [
      { title: '国际奥委会官方网站', url: 'https://www.olympics.com/', source: '官方机构', note: '各项目规则与赛事数据，解说备稿的数据底座' },
      { title: '机核网（体育与游戏文化社区）', url: 'https://www.gcores.com/', source: '文化社区', note: '赛事与电竞解说的行业讨论，从业者聚集', kind: 'community' },
    ],
    books: [
      { title: '体育播音艺术', author: '汤姆·海德里克', why: '43 年解说经验的职业手册，含试听带制作' },
      { title: '体育解说理论与实践教程', author: '薛文婷、李晶 等', why: '中传教材，从历史到十余个项目的实操拆解' },
    ],
  },

  // ================= 影视与视频 =================
  '宣传片导演': {
    videos: [
      { title: '油管大神 Sam Newton「4K 独立电影制作：将普通视频变成电影」', url: 'https://www.bilibili.com/video/BV1Ab4y1N7G1/', source: 'B站', note: '小团队把片子拍出电影感的分步指南，宣传片直接可用' },
    ],
    docs: [
      { title: '视听语言（中国传媒大学）', url: 'https://higher.smartedu.cn/course/67abdb7e225d72705e0fb09d', source: '国家智慧教育平台', note: '景别、机位与声音语言，导演的看家本领' },
      { title: '新片场', url: 'https://www.xinpianchang.com/', source: '影视创作社区', note: '商业宣传片的一线作品库，看报价背后的做法', kind: 'community' },
    ],
    books: [
      { title: '电影镜头设计', author: 'Steven D. Katz', why: '分镜与调度的手册，宣传片方案必备' },
      { title: '导演功课', author: 'David Mamet', why: '薄薄一本讲清"镜头要说什么"，去掉花架子' },
    ],
  },
  '虚拟制片师': {
    videos: [
      { title: '虚拟制作——LED 数字虚拟拍摄技术解析', url: 'https://www.bilibili.com/video/BV1QK4y1R721/', source: 'B站', note: '导演现场讲解虚拟拍摄的跟踪、置景与灯光要点' },
    ],
    docs: [
      { title: 'Unreal Engine 虚拟制片官方文档', url: 'https://dev.epicgames.com/documentation/en-us/unreal-engine/virtual-production-in-unreal-engine', source: '官方文档', note: 'LED 虚拟棚的官方全流程说明' },
      { title: 'Unreal 官方论坛', url: 'https://forums.unrealengine.com/', source: '开发者社区', note: '引擎问题的第一求助地，虚拟制片专版活跃', kind: 'community' },
    ],
    books: [
      { title: '实时渲染', author: 'Tomas Akenine-Möller 等', why: '实时图形的经典教材，理解引擎性能取舍' },
      { title: '电影摄影：理论与实践', author: 'Blain Brown', why: '虚拟棚里的布光与传统摄影同源，先懂光' },
    ],
  },
  '实时虚拟拍摄师': {
    videos: [
      { title: '虚幻引擎 UE5 影视制作大师班：电影级 3D 环境与虚拟制片（26 集）', url: 'https://www.bilibili.com/video/BV1PjjeztEzE/', source: 'B站', note: '绿幕、相机跟踪到实时合成的完整影视管线' },
    ],
    docs: [
      { title: 'Unreal Engine 官方文档', url: 'https://dev.epicgames.com/documentation/', source: '官方文档', note: '查相机内 VFX、时间码同步等具体功能' },
      { title: 'BlenderNation（Blender 社区）', url: 'https://blendernation.com/', source: '创作者社区', note: '3D 资产与实时渲染的行业动态与作品', kind: 'community' },
    ],
    books: [
      { title: '电影摄影：理论与实践', author: 'Blain Brown', why: '现场判断曝光与色温的基本功' },
      { title: '电影镜头设计', author: 'Steven D. Katz', why: '虚拟场景里的机位与运动设计' },
    ],
  },
  '互动叙事设计师': {
    videos: [
      { title: 'Game Design 专项课程（加州艺术学院 CalArts）', url: 'https://www.coursera.org/specializations/game-design', source: 'Coursera', note: '从叙事到机制的分支与选择设计' },
    ],
    docs: [
      { title: 'Ink 互动叙事语言官方文档（Inkle Studios）', url: 'https://www.inklestudios.com/ink/', source: '官方文档', note: '写分支叙事最实用的脚本语言，附在线练习' },
      { title: 'indienova（独立游戏与叙事设计社区）', url: 'https://indienova.com/', source: '开发者社区', note: '叙事机制与关卡设计的一线讨论，独立开发者聚集', kind: 'community' },
    ],
    books: [
      { title: '游戏设计艺术', author: 'Jesse Schell', why: '游戏设计的百透镜，含叙事与选择的专门章节' },
      { title: '游戏剧本怎么写', author: '佐佐木智广', why: '从企划书到分支与结局，写起来就有章法' },
    ],
  },
  '元宇宙内容创作者': {
    videos: [
      { title: 'Blender 4.0 零基础入门教程（82 集，已完结）', url: 'https://www.bilibili.com/video/BV11H4y1P7RV/', source: 'B站', note: '建模、材质、灯光到动画的全流程案例课' },
    ],
    docs: [
      { title: 'Blender 官方教程', url: 'https://www.blender.org/support/tutorials/', source: '官方教程', note: '官方出品的系列教程，跟着做最稳' },
      { title: 'BlenderNation', url: 'https://blendernation.com/', source: '创作者社区', note: '全球 Blender 作品与教程的聚合社区', kind: 'community' },
    ],
    books: [
      { title: '实时渲染', author: 'Tomas Akenine-Möller 等', why: '虚拟场景要跑得动，先懂渲染的性能账' },
      { title: '游戏设计艺术', author: 'Jesse Schell', why: '虚拟世界里什么让人愿意待下去' },
    ],
  },
  '短剧编剧': {
    videos: [
      { title: '新手要怎么开始入行写短剧剧本？', url: 'https://www.bilibili.com/video/BV11N4y1f7n2/', source: 'B站', note: '格式、过稿标准到下笔方法，入行第一步' },
    ],
    docs: [
      { title: '国家广播电视总局（微短剧备案与内容审核）', url: 'https://www.nrta.gov.cn/', source: '监管机构', note: '微短剧备案与内容红线，投稿前必看' },
      { title: '新片场', url: 'https://www.xinpianchang.com/', source: '影视创作社区', note: '短剧成片与创作人复盘，看什么结构能留人', kind: 'community' },
    ],
    books: [
      { title: '微短剧创作', author: '武瑶', why: '中传教师所著，讲爆点先行与单集吸引力' },
      { title: '救猫咪：电影编剧宝典', author: 'Blake Snyder', why: '15 节拍表压缩后正好适配短剧结构' },
    ],
  },
  '短剧制片人': {
    videos: [
      { title: '爆火短剧行业背后的秘密', url: 'https://www.bilibili.com/video/BV1ZtHsejE2o/', source: 'B站', note: '产能、成本与分账逻辑，制片视角的行业全景' },
    ],
    docs: [
      { title: '灯塔专业版（票房与热度数据平台）', url: 'https://ys.endata.cn/', source: '行业平台', note: '剧集热度与受众画像，立项前的市场依据' },
      { title: '知乎创作者中心', url: 'https://www.zhihu.com/creator', source: '创作者社区', note: '行业内幕与项目复盘的长文聚集地', kind: 'community' },
    ],
    books: [
      { title: '短剧的门道：行业入门与实践指南', author: '陈柯、短剧内行人', why: '从策划调研到发行变现的全链条实操' },
      { title: '独立制片：从构思到发行的全程指导', author: 'Christine Vachon', why: '小成本预算怎么排、剧组怎么搭' },
    ],
  },
  '影视营销策划': {
    videos: [
      { title: '百万人参与宣发：从看电影到"玩"电影，《热辣滚烫》的"发疯"之路', url: 'https://www.bilibili.com/video/BV1pC411s7Sk/', source: 'B站', note: '现象级宣发案例的机制拆解，可迁移的打法' },
    ],
    docs: [
      { title: '猫眼专业版（票房与观众数据）', url: 'https://pro.maoyan.com/', source: '行业平台', note: '想看指数与预售，宣发节奏的量化依据' },
      { title: '虎嗅（商业与科技内容平台）', url: 'https://www.huxiu.com/', source: '商业社区', note: '影视营销与文娱商业的深度复盘', kind: 'community' },
    ],
    books: [
      { title: '疯传', author: 'Jonah Berger', why: '预告片与话题的传播机制，六条可操作原则' },
      { title: '定位', author: 'Al Ries、Jack Trout', why: '一部片只讲一个卖点，宣发物料取舍依据' },
    ],
  },
  '影视剧本医生': {
    videos: [
      { title: '30天从白纸到完整剧本：我的剧本创作全过程拆解', url: 'https://www.bilibili.com/video/BV1nCntzJE32/', source: 'B站', note: '知道剧本是怎么写出来的，才知道往哪儿改' },
    ],
    docs: [
      { title: '美国编剧工会（WGA）官网', url: 'https://www.wga.org/', source: '行业协会', note: '剧本修改的署名与报酬规则，接活前先看' },
      { title: '中国作家网', url: 'https://www.chinawriter.com.cn/', source: '作家社区', note: '创作讨论与改稿经验的一线现场', kind: 'community' },
    ],
    books: [
      { title: '故事写作大师班', author: 'John Truby', why: '22 步故事结构，逐项对照找漏洞' },
      { title: '编剧的艺术', author: 'Lajos Egri', why: '从人物前提判断故事是否成立' },
    ],
  },

  // ================= 事实、数据与治理 =================
  '事实核查员': {
    videos: [
      { title: '如何识别假新闻？', url: 'https://www.bilibili.com/video/BV1bv411a76J/', source: 'B站', note: '用真实案例练"判断信息真假"的基本动作' },
    ],
    docs: [
      { title: 'Verification Handbook（在线事实核查手册）', url: 'https://verificationhandbook.com/', source: '行业手册', note: '突发与用户生成内容的核实流程，免费在线' },
      { title: '界面新闻', url: 'https://www.jiemian.com/', source: '新闻社区', note: '官方通报与辟谣的第一落点，核实的对照源', kind: 'community' },
    ],
    books: [
      { title: '新闻的十大基本原则', author: 'Bill Kovach、Tom Rosenstiel', why: '核查工作的伦理底线与判断标准' },
      { title: '事实：用数据思考，避免情绪化决策', author: '汉斯·罗斯林', why: '训练不被情绪与直觉带偏的思考习惯' },
    ],
  },
  '数据新闻记者': {
    videos: [
      { title: 'Visualization for Data Journalism（数据新闻可视化，伊利诺伊大学）', url: 'https://www.coursera.org/learn/visualization-for-data-journalism', source: 'Coursera', note: '从数据到新闻图表的完整流程' },
    ],
    docs: [
      { title: 'Data Journalism Handbook（数据新闻手册，在线免费）', url: 'https://datajournalism.com/', source: '在线手册', note: '数据新闻的经典手册，案例与工具都在' },
      { title: 'Kaggle Discussions（数据科学社区）', url: 'https://www.kaggle.com/discussions', source: '数据社区', note: '数据清洗与可视化的实战讨论，问题都有人答', kind: 'community' },
    ],
    books: [
      { title: '用数据讲故事', author: 'Cole Nussbaumer Knaflic', why: '图表选择与标注的实操规范，含前后对比' },
      { title: 'The Truthful Art（真实的数据可视化）', author: 'Alberto Cairo', why: '如何不撒谎地把数据讲清楚' },
    ],
  },
  '舆情监测分析师': {
    videos: [
      { title: 'Python 爬取微博话题评论：情感分析、词云与词频', url: 'https://www.bilibili.com/video/BV1R8411m7KK/', source: 'B站', note: '舆情监测的技术底座，跑通一遍就懂原理' },
    ],
    docs: [
      { title: 'Python 数据爬取与可视化（南华大学）', url: 'https://www.icourse163.org/course/NHDX-1463126169', source: '中国大学MOOC', note: '爬取、清洗到可视化的系统课，免费可学' },
      { title: '今日热榜', url: 'https://tophub.today/', source: '热点聚合社区', note: '全网热点的实时聚合，舆情的哨点', kind: 'community' },
    ],
    books: [
      { title: '舆论', author: 'Walter Lippmann', why: '拟态环境概念的源头，理解舆情为何失真' },
      { title: '沉默的螺旋：舆论——我们的社会皮肤', author: 'Elisabeth Noelle-Neumann', why: '意见气候如何形成，解释"刷屏"现象' },
    ],
  },
  '内容风控审核师': {
    videos: [
      { title: '开盒挂人、煽动地域对立…网络戾气的七类行为', url: 'https://www.bilibili.com/video/BV1D94y1n74U/', source: 'B站', note: '中央网信办专项行动划出的七类红线，审核的判定清单' },
    ],
    docs: [
      { title: '中国网信办（内容治理政策与规范）', url: 'https://www.cac.gov.cn/', source: '监管机构', note: '内容生态治理规定与处置案例，审核标准来源' },
      { title: '界面新闻', url: 'https://www.jiemian.com/', source: '新闻社区', note: '处置通报与治理动态的原文出处', kind: 'community' },
    ],
    books: [
      { title: 'Behind the Screen（屏幕之后：社交媒体阴影里的内容审核）', author: 'Sarah T. Roberts', why: '内容审核行业的真实田野研究，理解这份工作' },
      { title: '传播学教程', author: '郭庆光', why: '传播机制与效果的标准教材，判断风险的基础' },
    ],
  },
  'AI内容审校师': {
    videos: [
      { title: '人类，你该如何分辨一个视频是不是由 AI 生成的？', url: 'https://www.bilibili.com/video/BV1D3ddBmEZi/', source: 'B站', note: 'AI 内容的破绽清单，审校的眼力从这来' },
    ],
    docs: [
      { title: 'Poynter（新闻实务与伦理培训）', url: 'https://www.poynter.org/', source: '行业机构', note: '审校判断标准与 AI 生成内容的核验方法' },
      { title: '少数派 Matrix（数字生活原创社区）', url: 'https://sspai.com/matrix', source: '创作者社区', note: 'AI 工具与检测方法的实测讨论', kind: 'community' },
    ],
    books: [
      { title: '后真相时代', author: '赫克托·麦克唐纳', why: '识别选择性叙述与误导性表述的实操指南' },
      { title: '算法霸权：数学杀伤性武器的威胁', author: 'Cathy O\'Neil', why: '理解算法会怎样系统性产出偏见与错误内容' },
    ],
  },
  'AI配音工程师': {
    videos: [
      { title: 'AI For Everyone（人人学 AI，吴恩达）', url: 'https://www.coursera.org/learn/ai-for-everyone', source: 'Coursera', note: '先建立 AI 能力边界的整体认知' },
    ],
    docs: [
      { title: 'Hugging Face Learn（免费 AI 课程与模型实践）', url: 'https://huggingface.co/learn', source: '官方文档', note: '音频模型直接下载跑通，含语音处理课程' },
      { title: '蜻蜓 FM（音频内容社区）', url: 'https://www.qingting.fm/', source: '音频社区', note: '合成语音上线后的真实听感反馈', kind: 'community' },
    ],
    books: [
      { title: '深度学习', author: 'Ian Goodfellow 等', why: '花书，需要查原理时的权威参考' },
      { title: '声音设计：电影中语言、音乐和音响的表现力', author: 'David Sonnenschein', why: '合成的声音要服务情绪，先懂听觉设计' },
    ],
  },
  '游戏本地化专家': {
    videos: [
      { title: '网络游戏设计与开发（复旦大学，专项课程）', url: 'https://www.coursera.org/specializations/wangluo-youxi-sheji-kaifa', source: 'Coursera', note: '游戏产业、策划与引擎开发的全景，本地化前先懂游戏' },
    ],
    docs: [
      { title: 'GALA（全球化与本地化协会）', url: 'https://www.gala-global.org/', source: '行业协会', note: '本地化行业术语、流程与质量标准的来源' },
      { title: 'IGDA（国际游戏开发者协会）', url: 'https://igda.org/', source: '开发者社区', note: '本地化专委会与行业标准的讨论', kind: 'community' },
    ],
    books: [
      { title: 'The Game Localization Handbook', author: 'Heather Maxwell Chandler', why: '游戏本地化的流程手册，含测试与交付规范' },
      { title: 'Game Localization', author: 'Minako O\'Hagan、Carmen Mangiron', why: '本地化中的文化适配与翻译策略研究' },
    ],
  },
  '书籍设计师': {
    videos: [
      { title: '排版 60 集：零基础掌握版式基本功（50 集）', url: 'https://www.bilibili.com/video/BV1oPHgeiEgb/', source: 'B站', note: '纯文字也能排出好版面，书装的基本功' },
    ],
    docs: [
      { title: 'Adobe InDesign 官方教程', url: 'https://helpx.adobe.com/indesign/tutorials.html', source: '官方文档', note: '排版与印前工具的官方教程，边做边学' },
      { title: '站酷 ZCOOL（设计师社区）', url: 'https://www.zcool.com.cn/', source: '设计社区', note: '书籍装帧作品与同行点评，审美靠这里养', kind: 'community' },
    ],
    books: [
      { title: '平面设计中的网格系统', author: 'Josef Müller-Brockmann', why: '版面网格的经典，解决内文排得乱的问题' },
      { title: '写给大家看的设计书', author: 'Robin Williams', why: '亲密性、对齐、重复、对比四原则，零基础可读' },
    ],
  },

  // ================= 内容消费与垂类创作者 =================
  '美食博主': {
    videos: [
      { title: '通透食物拍法：两个长明灯配合自然光拍摄', url: 'https://www.bilibili.com/video/BV1rC4y1q7Vk/', source: 'B站', note: '侧逆光拍食物的硬技巧，照做就出效果' },
    ],
    docs: [
      { title: '优设 UISDC（设计与摄影教程）', url: 'https://www.uisdc.com/', source: '设计学习平台', note: '美食摄影与摆盘的成体系教程' },
      { title: '站酷 ZCOOL（设计师社区）', url: 'https://www.zcool.com.cn/', source: '创作者社区', note: '美食摄影作品与商业案例的同行讨论', kind: 'community' },
    ],
    books: [
      { title: '鱼翅与花椒', author: '扶霞·邓洛普', why: '写食物最好的中文范本之一，学怎么把味道写成文字' },
      { title: '食物与厨艺', author: '哈洛德·马基', why: '食材与烹饪原理的权威科普，内容专业度来源' },
    ],
  },
  '旅游博主': {
    videos: [
      { title: '20种万能手机运镜技巧，新手旅行必备（手机云台运镜教程）', url: 'https://www.bilibili.com/video/BV1Ab42177ty/', source: 'B站', note: '旅拍运镜的组合套路，一部手机就能照做' },
    ],
    docs: [
      { title: '穷游网（出境自助游社区与攻略）', url: 'https://www.qyer.com/', source: '行业平台', note: '攻略的结构与信息颗粒度，照着写就不会空' },
      { title: '马蜂窝（旅游攻略与社区）', url: 'https://www.mafengwo.cn/', source: '旅游社区', note: '热门目的地的游记讨论，找选题空位', kind: 'community' },
    ],
    books: [
      { title: '背包十年', author: '小鹏', why: '中文旅行写作的畅销范本，第一部分人怎么写' },
      { title: '孤独星球旅行指南系列', author: 'Lonely Planet 编辑部', why: '目的地信息的专业写法与编排标准' },
    ],
  },

  // ================= 策展与新兴方向 =================
  'NFT/数字藏品策展': {
    videos: [
      { title: '你必须知道的 10 大 NFT（上）：CryptoPunks、NBA Topshot 与 Hashmasks', url: 'https://www.bilibili.com/video/BV1m34y1E7o1/', source: 'B站', note: '经典项目逐个拆，策展先看懂里程碑' },
    ],
    docs: [
      { title: '以太坊开发者文档', url: 'https://ethereum.org/en/developers/docs/', source: '官方文档', note: '理解链上确权与铸造机制，策展的底层' },
      { title: '站酷 ZCOOL（数字艺术社区）', url: 'https://www.zcool.com.cn/', source: '创作者社区', note: '数字艺术与藏品的创作者聚集地，国内生态样本', kind: 'community' },
    ],
    books: [
      { title: '精通以太坊', author: 'Andreas M. Antonopoulos、Gavin Wood', why: '技术与机制的系统讲解，判断项目真伪' },
      { title: '无限机器：以太坊的诞生', author: 'Camila Russo', why: '理解数字藏品生态从哪来、为什么火' },
    ],
  },
  '剧本杀作者': {
    videos: [
      { title: 'Script Writing（剧本写作，Coursera）', url: 'https://www.coursera.org/learn/script-writing', source: 'Coursera', note: '剧本格式与场景推进的通用训练' },
    ],
    docs: [
      { title: '国家新闻出版署（桌游与剧本出版规范）', url: 'https://www.nppa.gov.cn/', source: '监管机构', note: '剧本作为出版物发行时的资质与内容规范' },
      { title: 'indienova（独立游戏与桌游设计社区）', url: 'https://indienova.com/', source: '开发者社区', note: '叙事机制与规则设计的同行讨论', kind: 'community' },
    ],
    books: [
      { title: '剧本杀创作十讲', author: '冯现冬、陈威、谢京春', why: '十讲式教程，含诡计设计与主持人手册写法' },
      { title: '故事：材质、结构、风格和银幕剧作的原理', author: 'Robert McKee', why: '本子好不好玩，根子还是在故事结构' },
    ],
  },
};
