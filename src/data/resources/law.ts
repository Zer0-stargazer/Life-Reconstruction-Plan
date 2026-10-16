import type { CareerResourceSet } from '../career-resources';

/**
 * 法律类职业自学资源（第 2 批重写，2026-10-12）
 *
 * 口径与 media.ts 一致：每个职业固定 5 份 ——
 *   1 视频 + 1 文档 + 1 论坛社区（kind: 'community'）+ 2 书籍
 *
 * 视频来源三类：
 *   - B 站具体 BV 号（全部经 api.bilibili.com/x/web-interface/view 逐条验证存在，
 *     不使用频道主页；罗翔/柏浪涛/李建伟/劳动仲裁/耶鲁合同法等）
 *   - 中国大学 MOOC（icourse163.org 课程页，搜索时逐条确认课程名与开课学校）
 *   - 官方智慧教育平台 / 点睛网公证学院 / 湘大超星等垂类课程入口
 *   - 少量 edX 课程页（沿用旧 law.ts 已验证条目）
 *
 * 共用约束：同一 URL 全站最多 3 个职业使用（脚本 SAME_URL_MAX=3）。
 * 已达上限未再使用：flk.npc.gov.cn(24)、www.cac.gov.cn(5)、www.court.gov.cn(4)、
 * www.gov.cn(6)、HarvardX Contract Law(3)、wenshu(3)、pkulaw(3)。
 */
export const lawResources: Record<string, CareerResourceSet> = {
  '律师': {
    videos: [
      { title: '26法考-柏浪涛刑法带读课（法考刑法系统带读）', url: 'https://www.bilibili.com/video/BV1rr2sBsEH6', source: 'B站', note: '法考刑法头部讲义式带读，练的就是律师的刑法内功' },
    ],
    docs: [
      { title: '12348 中国法网（公共法律服务网）', url: 'https://www.12348.gov.cn', source: '官方平台', note: '司法部公共法律服务门户：法规查询、案例、法律援助指引一站搞定' },
      { title: '知乎 · 法律话题', url: 'https://www.zhihu.com/topic/19550936', source: '法律社区', note: '法律从业者的日常讨论场，能看真实执业困惑与经验帖', kind: 'community' },
    ],
    books: [
      { title: '法治及其本土资源', author: '苏力', why: '理解中国法律如何真正在现实里运转的第一课，律师吃饭靠的就是这个缝隙感' },
      { title: '西窗法雨', author: '刘星', why: '短篇法律随笔，先把法律思维聊出兴趣，再谈专业' },
    ],
  },
  '合规师': {
    videos: [
      { title: '营商的法律智慧（暨南大学）', url: 'https://www.icourse163.org/learn/JNU-1466094227', source: '中国大学MOOC', note: '覆盖公司治理、合同、证券、破产、仲裁全链条，合规师的商法底盘' },
    ],
    docs: [
      { title: '威科先行法律信息库', url: 'https://law.wkinfo.com.cn', source: '威科先行', note: '法规、合规标准与实务文章检索，企业合规岗的日常工具' },
      { title: '智合', url: 'https://www.zhihe.com', source: '法律社区', note: '律所与法务圈的职业社区，合规岗位动态与行业风向', kind: 'community' },
    ],
    books: [
      { title: '企业合规基本理论', author: '陈瑞华', why: '把刑事合规、合规不起诉讲得最透，国内合规方法论的地基' },
      { title: 'ISO 37301:2021《合规管理体系 要求及使用指南》', author: '国际标准化组织（ISO）', why: '全球通行的合规管理体系标准，建体系就是照着它搭' },
    ],
  },
  '知识产权律师': {
    videos: [
      { title: 'PennX: Intellectual Property Law and Policy Part 1（宾大知识产权法与政策 第一部分）', url: 'https://www.edx.org/learn/intellectual-property/university-of-pennsylvania-intellectual-property-law-and-policy-part-1', source: 'edX', note: '英文，系统梳理知识产权制度' },
    ],
    docs: [
      { title: '国家知识产权局', url: 'https://www.cnipa.gov.cn', source: '官方文档', note: '专利、商标、地理标志政策法规第一手来源' },
      { title: '无讼', url: 'https://www.itslaw.com', source: '法律社区', note: '案例检索与律师社区，知产判例讨论氛围好', kind: 'community' },
    ],
    books: [
      { title: '知识产权基本问题', author: '吴汉东（主编）', why: '国内知识产权理论入门的权威教材' },
      { title: '知识产权法教程', author: '王迁', why: '著作权与知识产权实务案例结合最好的教程' },
    ],
  },
  '数据隐私官': {
    videos: [
      { title: '网络与人工智能法（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1473411163', source: '中国大学MOOC', note: '网络安全法、数据法、人工智能法一课打通，2.2 万人学过' },
    ],
    docs: [
      { title: '全国信息安全标准化技术委员会', url: 'https://www.tc260.org.cn', source: '官方标准', note: '个人信息安全规范等国标 originals，隐私合规的技术依据' },
      { title: 'IAPP（国际隐私专业协会）', url: 'https://iapp.org', source: '隐私社区', note: '全球隐私官的职业社区与认证体系，盯住国际合规趋势', kind: 'community' },
    ],
    books: [
      { title: 'Understanding Privacy（隐私的理解）', author: 'Daniel J. Solove', why: '隐私理论的经典框架，判断什么算隐私问题先靠它' },
      { title: '个人信息保护法理解与适用', author: '程啸', why: '个保法逐条解释 + 实务场景，中文世界最好用的个保法书' },
    ],
  },
  '法务总监': {
    videos: [
      { title: '【讲点黑话12】理解新《公司法》善意取得规则', url: 'https://www.bilibili.com/video/BV1p94y1T7XE', source: 'B站', note: '新公司法热点规则的白话拆解，法务总监管的就是这些红线' },
    ],
    docs: [
      { title: '中华全国律师协会', url: 'https://www.acla.org.cn', source: '行业协会', note: '律师行业规范与业务指引，外部律师管理看这里' },
      { title: '智合', url: 'https://www.zhihe.com', source: '法律社区', note: '法务总监的同行社区：团队搭建、外部顾问管理经验', kind: 'community' },
    ],
    books: [
      { title: '民商法实务技能手册', author: '高杉峻（主编）', why: '一线法务与律师的实操手册，合同、诉讼、内部管理全覆盖' },
      { title: '最高人民法院关于公司法司法解释（一～五）理解与适用', author: '最高人民法院民事审判第二庭', why: '公司治理争议的裁判口径，法务总监定规则的底气' },
    ],
  },
  '专利代理人': {
    videos: [
      { title: '专利法（中国计量大学）', url: 'https://www.icourse163.org/course/ZGJL-1459100163', source: '中国大学MOOC', note: '从申请文件撰写到审查与布局，专代考试与实务双对口' },
    ],
    docs: [
      { title: 'WIPO PCT 专利合作条约', url: 'https://www.wipo.int/pct/en/', source: 'WIPO', note: '国际专利申请制度官方页面，涉外代理必备' },
      { title: '无讼', url: 'https://www.itslaw.com', source: '法律社区', note: '专利无效与侵权判例的检索社区', kind: 'community' },
    ],
    books: [
      { title: '专利代理实务', author: '吴观乐（主编）', why: '专代实务从申请到答复审补的标准教材' },
      { title: '专利审查指南', author: '国家知识产权局', why: '审查员怎么审，代理人就得怎么写，案头必备' },
    ],
  },
  '劳动法律师': {
    videos: [
      { title: '劳动仲裁全流程', url: 'https://www.bilibili.com/video/BV1Rwp2eqEBE', source: 'B站', note: '执业律师亲讲仲裁程序全景，劳动法业务的地板课' },
    ],
    docs: [
      { title: '12348 中国法网（公共法律服务网）', url: 'https://www.12348.gov.cn', source: '官方平台', note: '劳动法规与法律援助入口，接案前摸清当事人可用资源' },
      { title: '知乎 · 法律话题', url: 'https://www.zhihu.com/topic/19550936', source: '法律社区', note: '劳动纠纷提问最密集的社区，一线问题库', kind: 'community' },
    ],
    books: [
      { title: '劳动法', author: '王全兴', why: '劳动法通说体系的代表教材，底子书' },
      { title: '劳动与社会保障法学', author: '黎建飞', why: '劳动法与社保联动讲，实务里最常交叉的地带' },
    ],
  },
  '刑事辩护律师': {
    videos: [
      { title: '2021罗翔讲刑法（合集，共87讲）', url: 'https://www.bilibili.com/video/BV1bU4y1s7Cr', source: 'B站', note: '法考刑法系统课，把罪名体系先立起来' },
    ],
    docs: [
      { title: '最高人民检察院 · 新闻发布会', url: 'https://www.spp.gov.cn/xwfbh/wsfbt/', source: '官方文档', note: '检察政策与典型案例发布，辩护思路的风向标' },
      { title: '无讼', url: 'https://www.itslaw.com', source: '法律社区', note: '刑事判例与辩护实务讨论的老牌社区', kind: 'community' },
    ],
    books: [
      { title: '刑事诉讼的前沿问题', author: '陈瑞华', why: '刑事程序与辩护理论的代表作' },
      { title: '刑事辩护的中国经验', author: '田文昌、陈瑞华', why: '两位一线对话刑辩实务，看老律师怎么办案' },
    ],
  },
  '公司法务': {
    videos: [
      { title: '李建伟合同编通则司法解释逐条精讲（44讲）', url: 'https://www.bilibili.com/video/BV17223BCE12', source: 'B站', note: '合同编逐条精讲，企业合同审查的底层功' },
    ],
    docs: [
      { title: '中国民商法律网', url: 'https://www.civillaw.com.cn', source: '学术网站', note: '民商法权威学术站，合同与公司争议的学理与判例参考' },
      { title: '智合', url: 'https://www.zhihe.com', source: '法律社区', note: '公司法务的职业社区，内部法务团队运营经验多', kind: 'community' },
    ],
    books: [
      { title: '公司法论', author: '施天涛', why: '公司法体系化讲解的代表教材' },
      { title: '民法思维：请求权基础理论体系', author: '王泽鉴', why: '请求权基础方法，处理公司法律问题想得清的前提' },
    ],
  },
  '知识产权顾问': {
    videos: [
      { title: '现代社会与知识产权（中国计量大学）', url: 'https://www.icourse163.org/learn/ZGJL-1458766163', source: '中国大学MOOC', note: '知识产权通识课，专利商标著作权与企业经营全景' },
    ],
    docs: [
      { title: 'WIPO Academy 知识产权学院', url: 'https://www.wipo.int/academy/en/', source: 'WIPO', note: '世界知识产权组织免费课程，国际视角补课' },
      { title: 'OpenLaw', url: 'https://www.openlaw.cn', source: '法律社区', note: '开放裁判文书社区，知产策略先看判例', kind: 'community' },
    ],
    books: [
      { title: '知识产权法教程', author: '王迁', why: '把著作权讲得最清楚的中文教程' },
      { title: '企业知识产权战略', author: '冯晓青', why: '顾问的价值在战略，这本书讲的就是怎么排布' },
    ],
  },
  '税法顾问': {
    videos: [
      { title: '中国税法：案例·原理·方法（暨南大学）', url: 'https://www.icourse163.org/course/JNU-1207451804', source: '中国大学MOOC', note: '从法学角度讲税法，涉税争议的原理课' },
    ],
    docs: [
      { title: '国家税务总局 · 政策法规', url: 'https://www.chinatax.gov.cn/chinatax/n810341/n810755/index.html', source: '官方文档', note: '税收政策与法规发布栏，答复口径以这里为准' },
      { title: '财新网', url: 'https://www.caixin.com', source: '财经社区', note: '税收政策报道与深度分析，政策窗口期先知', kind: 'community' },
    ],
    books: [
      { title: '财税法专题研究', author: '刘剑文', why: '财税法体系研究的代表作' },
      { title: '财税法学', author: '张守文（主编）', why: '把税法放进财税法整体框架理解的教材' },
    ],
  },
  '国际法律师': {
    videos: [
      { title: '耶鲁大学《美国合同法 I》（中英字幕，42讲）', url: 'https://www.bilibili.com/video/BV1kz421q7aF', source: 'B站', note: '国际商事交易绕不开普通法合同规则，双语名校课' },
    ],
    docs: [
      { title: 'WTO 争端解决 · 案件状态', url: 'https://www.wto.org/english/tratop_e/dispu_e/dispu_status_e.htm', source: 'WTO', note: '国际贸易争端案件动态一览，国际法律业务素材库' },
      { title: '豆瓣 · 法律小组', url: 'https://www.douban.com/group/law/', source: '法律社区', note: '法律人兴趣社区，国际法方向的书与经验讨论', kind: 'community' },
    ],
    books: [
      { title: '奥本海国际法', author: '詹宁斯、瓦茨（修订）', why: '国际法最经典的体系书，查争议问题的终极参考' },
      { title: '国际法', author: '白桂梅', why: '中文国际法教材里讲得清楚扎实的一本' },
    ],
  },
  '法律科技产品经理': {
    videos: [
      { title: "HarvardX: CS50 for Lawyers（哈佛法律人的计算机科学）", url: 'https://www.edx.org/learn/computer-science/harvard-university-cs50-s-computer-science-for-lawyers', source: 'edX', note: '英文，面向法律人的编程与计算思维' },
    ],
    docs: [
      { title: '北大法律信息网', url: 'https://www.chinalawinfo.com', source: '学术网站', note: '法规与文献数据库，理解法律数据长什么样' },
      { title: 'FreeBuf（网络安全行业门户）', url: 'https://www.freebuf.com', source: '技术社区', note: '安全与技术圈社区，法律科技产品要懂技术人的语言', kind: 'community' },
    ],
    books: [
      { title: 'Tomorrow\'s Lawyers（明日律师）', author: 'Richard Susskind', why: '讲解法律科技如何改变法律服务的经典著作' },
      { title: '代码2.0', author: '劳伦斯·莱斯格', why: '「代码即法律」的原点，法律科技的思想底座' },
    ],
  },
  '公证员': {
    videos: [
      { title: '公证学院（公证实务在线课程平台）', url: 'https://gongzheng.zfwx.com', source: '点睛网', note: '继承公证、现场监督公证、强制执行公证等实务课集中地' },
    ],
    docs: [
      { title: '12348 中国法网（公共法律服务网）', url: 'https://www.12348.gov.cn', source: '官方平台', note: '公证服务指引与法规查询，当事人咨询口径的对照面' },
      { title: '正义网（检察日报社）', url: 'https://www.jcrb.com', source: '法律社区', note: '法治新闻与评论社区，公证真实性争议的舆论面', kind: 'community' },
    ],
    books: [
      { title: '民法', author: '王利明', why: '公证的九成业务在民法，民事法律行为功底要硬' },
      { title: '公证与律师制度', author: '马宏俊', why: '公证制度与程序的体系教材' },
    ],
  },
  '法律翻译': {
    videos: [
      { title: '法律英语（西南政法大学）', url: 'https://www.icourse163.org/course/SWUPL-1466008174', source: '中国大学MOOC', note: '西政外语学院打造的法律英语课，术语与文风并重' },
    ],
    docs: [
      { title: 'WTO 争端解决（英文）', url: 'https://www.wto.org/english/tratop_e/dispu_e/dispu_e.htm', source: 'WTO', note: '英文法律文本与裁决的原始材料' },
      { title: '豆瓣 · 法律小组', url: 'https://www.douban.com/group/law/', source: '法律社区', note: '法律译者找语料与同行反馈的轻社区', kind: 'community' },
    ],
    books: [
      { title: '元照英美法词典', author: '薛波（主编）', why: '英美法术语的中文权威对照，翻译的地基工程' },
      { title: '非文学翻译理论与实践', author: '李长栓', why: '法律文本属于非文学翻译的方法论经典' },
    ],
  },
  '法律研究员': {
    videos: [
      { title: '26法学学硕【串讲带背】马工程法理学（杜洪波，8讲）', url: 'https://www.bilibili.com/video/BV1aZHrz3Ebp', source: 'B站', note: '法理学考点串讲，研究工作的理论地图' },
    ],
    docs: [
      { title: '北大法律信息网', url: 'https://www.chinalawinfo.com', source: '学术网站', note: '法学文献、期刊与法规数据库，研究工作的资料底座' },
      { title: '豆瓣 · 法律小组', url: 'https://www.douban.com/group/law/', source: '法律社区', note: '学术书评与研究选题灵感来源', kind: 'community' },
    ],
    books: [
      { title: '法治及其本土资源', author: '苏力', why: '中文法学研究范式转折点的代表作' },
      { title: '法学学位论文写作方法', author: '梁慧星', why: '研究写作的方法论，从选题到引注' },
    ],
  },
  '法律培训师': {
    videos: [
      { title: '【光明云说法·民法典专家谈】15分钟带你了解民法典', url: 'https://www.bilibili.com/video/BV18K4y1t7t2', source: 'B站', note: '官方普法微课范本，学怎么把法讲短讲明白' },
    ],
    docs: [
      { title: '中华全国律师协会', url: 'https://www.acla.org.cn', source: '行业协会', note: '继续教育与业务指引，培训内容的官方锚点' },
      { title: '正义网（检察日报社）', url: 'https://www.jcrb.com', source: '法律社区', note: '法治资讯与评论，培训案例的选题池', kind: 'community' },
    ],
    books: [
      { title: '西窗法雨', author: '刘星', why: '把法律讲得人人爱听的范本，培训师的文案库' },
      { title: '论法的精神', author: '孟德斯鸠', why: '讲法律思想绕不开的原典，课程深度的储备' },
    ],
  },
  '破产管理人': {
    videos: [
      { title: '破产法（北京师范大学，国家精品）', url: 'https://www.icourse163.org/course/BNU-1455027170', source: '中国大学MOOC', note: '重整、和解、清算三大程序 + 管理人制度，对口到岗位本身' },
    ],
    docs: [
      { title: '中华人民共和国最高人民法院 · 资讯', url: 'https://www.court.gov.cn/zixun.html', source: '官方文档', note: '最高法破产审判会议纪要与典型案发发布口' },
      { title: '法信', url: 'https://www.faxin.cn', source: '法律社区', note: '人民法院出版社的知识服务社区，破产裁判规则一站式检索', kind: 'community' },
    ],
    books: [
      { title: '破产法', author: '王欣新', why: '国内破产法通说教材的代表' },
      { title: '破产法论：解释与功能比较的视角', author: '许德风', why: '把破产法讲出体系与经济逻辑的口碑之作' },
    ],
  },
  '环境法律师': {
    videos: [
      { title: '生态环境法（中南财经政法大学）', url: 'https://www.icourse163.org/course/ZUEL-1465998176', source: '中国大学MOOC', note: '环境法体系 + 环境侵权与公益诉讼，业务内核全在这里' },
    ],
    docs: [
      { title: '生态环境部 · 业务工作之法规', url: 'https://www.mee.gov.cn/ywgz/fg/', source: '官方文档', note: '环境法规与执法动态发布栏' },
      { title: '中国庭审公开网', url: 'https://tingshen.court.gov.cn', source: '庭审社区', note: '环境公益诉讼庭审直播与回看，学代理思路最直观', kind: 'community' },
    ],
    books: [
      { title: '环境法学概要', author: '吕忠梅', why: '环境法体系化讲解的代表学者教材' },
      { title: '环境法学教程', author: '王灿发', why: '环境维权实务视角的环境法教程' },
    ],
  },
  '反垄断律师': {
    videos: [
      { title: 'Chinese Competition Law（上海交通大学，英文授课）', url: 'https://www.icourse163.org/course/-1463202164', source: '中国大学MOOC', note: '国内唯一英文讲中国反垄断法的课程，含欧盟美国比较' },
    ],
    docs: [
      { title: '国家市场监督管理总局', url: 'https://www.samr.gov.cn', source: '官方文档', note: '反垄断执法与经营者集中公告第一来源' },
      { title: '财新网', url: 'https://www.caixin.com', source: '财经社区', note: '反垄断执法报道最及时的财经媒体社区', kind: 'community' },
    ],
    books: [
      { title: '反垄断法', author: '王晓晔', why: '国内反垄断法体系的代表性教材' },
      { title: '反垄断法原理', author: '孔祥俊', why: '从裁判者视角理解反垄断规则的形成' },
    ],
  },
  '婚姻家事律师': {
    videos: [
      { title: '婚姻家庭法（中南财经政法大学）', url: 'https://www.icourse163.org/learn/ZUEL-1473667166', source: '中国大学MOOC', note: '结婚、财产、离婚、收养全流程，家事人才导向' },
    ],
    docs: [
      { title: '中国民商法律网', url: 'https://www.civillaw.com.cn', source: '学术网站', note: '婚姻家庭编学理与判例参考' },
      { title: '知乎 · 法律话题', url: 'https://www.zhihu.com/topic/19550936', source: '法律社区', note: '家事咨询真实问题最密集的社区', kind: 'community' },
    ],
    books: [
      { title: '婚姻法学', author: '巫昌祯', why: '婚姻家庭法领域的经典教材' },
      { title: '民法典婚姻家庭编司法解释理解与适用', author: '最高人民法院', why: '家事裁判口径，办案直接引用' },
    ],
  },
  '房地产律师': {
    videos: [
      { title: '房地产法学（西南政法大学）', url: 'https://www.chinaooc.com.cn/course/68bca1cb9d83483b4334748d', source: '智慧教育平台', note: '开发、征收、买卖、租赁、物业五大板块，西政三代学者接力讲' },
    ],
    docs: [
      { title: '中国政府网 · 国务院公报', url: 'https://www.gov.cn/gongbao/', source: '官方文档', note: '房地产调控政策与国务院文件原文' },
      { title: '中国庭审公开网', url: 'https://tingshen.court.gov.cn', source: '庭审社区', note: '房产纠纷庭审直播，看真实攻防', kind: 'community' },
    ],
    books: [
      { title: '房地产法', author: '符启林', why: '房地产法经典教材' },
      { title: '房地产法', author: '高富平', why: '从物权到开发流程的另一种体系视角' },
    ],
  },
  '体育法律师': {
    videos: [
      { title: '体育法学（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1470079161', source: '中国大学MOOC', note: '体育自治、赛事转播权、兴奋剂、体育仲裁全讲到' },
    ],
    docs: [
      { title: '中华人民共和国最高人民法院 · 资讯', url: 'https://www.court.gov.cn/zixun.html', source: '官方文档', note: '体育纠纷司法政策与典型案例发布' },
      { title: '澎湃新闻 · 法治频道', url: 'https://www.thepaper.cn/list_25440', source: '法治媒体', note: '体育争议事件的法治报道跟进', kind: 'community' },
    ],
    books: [
      { title: '国际体育仲裁研究', author: '黄世席', why: '体育仲裁制度的国内权威研究' },
      { title: '体育纠纷的多元化救济机制', author: '郭树理', why: '体育纠纷解决路径的体系研究' },
    ],
  },
  '娱乐法律师': {
    videos: [
      { title: '媒体娱乐法（湘潭大学）', url: 'https://mooc1.xtu.edu.cn/mooc-ans/nodedetailcontroller/visitnodedetail?courseId=220775569&knowledgeId=484421807', source: '湘潭大学慕课', note: '网络娱乐产业、平台合规、艺人经纪法律问题一课讲全' },
    ],
    docs: [
      { title: 'WIPO 伯尔尼公约', url: 'https://www.wipo.int/treaties/en/ip/berne/', source: 'WIPO', note: '国际版权保护的基础条约' },
      { title: '豆瓣电影', url: 'https://www.douban.com/movie', source: '影视社区', note: '影视行业风向与口碑场，娱乐法客户的生存环境', kind: 'community' },
    ],
    books: [
      { title: '著作权法', author: '王迁', why: '娱乐法的核心是版权，这本书是中文著作权第一教程' },
      { title: '娱乐法', author: '宋海燕', why: '把影视音乐产业的合同与版权实务讲透的稀缺中文书' },
    ],
  },
  '移民律师': {
    videos: [
      { title: '飞遍全球的法律航道（郑州航空工业管理学院）', url: 'https://www.icourse163.org/learn/ZZIA-1002922009', source: '中国大学MOOC', note: '民航与出入境法律制度，含机场出入境边检实务' },
    ],
    docs: [
      { title: '国家移民管理局', url: 'https://www.nia.gov.cn', source: '官方文档', note: '出入境政策、签证与居留规定官方发布口' },
      { title: '海外网（人民网旗下）', url: 'https://www.haiwainet.cn', source: '涉外社区', note: '海外华人与出入境话题的媒体社区，移民客户的语境场', kind: 'community' },
    ],
    books: [
      { title: '国际法', author: '王铁崖', why: '国籍、领土、外国人待遇的根基理论' },
      { title: '中华人民共和国出境入境管理法释义', author: '全国人大常委会法制工作委员会', why: '移民业务直接依据的法条逐条释义' },
    ],
  },
  '互联网法院法官助理': {
    videos: [
      { title: '人工智能与法律（西南政法大学）', url: 'https://www.icourse163.org/course/BIT-1473407163', source: '中国大学MOOC', note: 'AI 司法应用、在线纠纷解决，互联网法院工作的直接铺垫' },
    ],
    docs: [
      { title: '中华人民共和国最高人民法院 · 资讯', url: 'https://www.court.gov.cn/zixun.html', source: '官方文档', note: '互联网法院动态与在线诉讼规则发布' },
      { title: 'OpenLaw', url: 'https://www.openlaw.cn', source: '法律社区', note: '开放法律数据社区，线上裁判文书研究工具', kind: 'community' },
    ],
    books: [
      { title: '送法下乡：中国基层司法制度研究', author: '苏力', why: '理解司法制度如何真实运转的必读书' },
      { title: '代码2.0', author: '劳伦斯·莱斯格', why: '平台治理与代码规则的经典框架' },
    ],
  },
  '企业数据合规审计师': {
    videos: [
      { title: 'EdinburghX: Data Ethics, AI and Responsible Innovation', url: 'https://www.edx.org/learn/artificial-intelligence/the-university-of-edinburgh-data-ethics-ai-and-responsible-innovation', source: 'edX', note: '英文，数据伦理与合规思路' },
    ],
    docs: [
      { title: '国家标准全文公开系统', url: 'https://openstd.samr.gov.cn', source: '官方标准', note: '数据安全与个保国标原文免费查阅，审计依据就是这些标准' },
      { title: 'FreeBuf（网络安全行业门户）', url: 'https://www.freebuf.com', source: '技术社区', note: '数据安全事件与攻防动态，审计风险意识的来源', kind: 'community' },
    ],
    books: [
      { title: '隐私权的法律保护', author: '张新宝', why: '个人信息保护民事体系的奠基著作' },
      { title: 'Understanding Privacy（隐私的理解）', author: 'Daniel J. Solove', why: '给审计分类分级提供理论框架' },
    ],
  },
  '建设工程律师': {
    videos: [
      { title: '规划与建筑法（含建设工程合同专题）', url: 'https://www.icourse163.org/course/-1206432806', source: '中国大学MOOC', note: '黑白合同、挂靠、垫资、优先受偿权——建工争议的六大金刚全讲到' },
    ],
    docs: [
      { title: '法律图书馆', url: 'https://www.law-lib.com', source: '法规库', note: '建筑法、招投标法及大量规范性文件全文检索' },
      { title: '中国庭审公开网', url: 'https://tingshen.court.gov.cn', source: '庭审社区', note: '建工纠纷庭审直播，工程造价鉴定质证看真实过程', kind: 'community' },
    ],
    books: [
      { title: '最高人民法院建设工程施工合同司法解释理解与适用', author: '最高人民法院民事审判第一庭', why: '建工裁判口径的权威解释书' },
      { title: 'FIDIC 新版合同条件导读与解析', author: '张水波', why: '涉外工程合同的通用语言 FIDIC 的入门钥匙' },
    ],
  },
  '保险理赔律师': {
    videos: [
      { title: '保险学（山东大学）', url: 'https://www.icourse163.org/course/SDU-1449481168', source: '中国大学MOOC', note: '先懂保险怎么运转，才谈得上理赔争议代理' },
    ],
    docs: [
      { title: '威科先行 · 裁判文书库', url: 'https://law.wkinfo.com.cn/judgement-documents/list', source: '威科先行', note: '保险类裁判文书检索，理赔口径的实证库' },
      { title: '澎湃新闻 · 法治频道', url: 'https://www.thepaper.cn/list_25440', source: '法治媒体', note: '保险纠纷热点案件的报道与评论', kind: 'community' },
    ],
    books: [
      { title: '保险法', author: '樊启荣', why: '保险合同法的体系教材' },
      { title: '最高人民法院保险法司法解释理解与适用', author: '最高人民法院民事审判第二庭', why: '理赔争议的裁判规则全书' },
    ],
  },
  '海商法律师': {
    videos: [
      { title: '海商法（武汉大学，国家精品课）', url: 'https://www.icourses.cn/jpk/viewCharacterDetail.action?courseId=3243&sectionId=55720', source: '爱课程', note: '船舶物权、海上运输、碰撞、海难救助、海事赔偿全体系' },
    ],
    docs: [
      { title: 'WTO 争端解决 · 案件状态', url: 'https://www.wto.org/english/tratop_e/dispu_e/dispu_status_e.htm', source: 'WTO', note: '国际贸易与运输争端动态' },
      { title: '财新网', url: 'https://www.caixin.com', source: '财经社区', note: '航运与国际贸易新闻最密集的财经社区', kind: 'community' },
    ],
    books: [
      { title: '海商法专论', author: '司玉琢', why: '大连海事泰斗的体系专论，海商法深水区地图' },
      { title: '海商法教程', author: '郭瑜', why: '北京大学出版社的入门经典，先立框架' },
    ],
  },
  '税法筹划师': {
    videos: [
      { title: '税法（江西财经大学）', url: 'https://www.icourse163.org/course/JXUFE-1206650807', source: '中国大学MOOC', note: '以现行税收实体法为纲，实务导向的税法全课' },
    ],
    docs: [
      { title: '国家税务总局', url: 'https://www.chinatax.gov.cn', source: '官方文档', note: '税收政策与征管口径的唯一权威来源' },
      { title: '法信', url: 'https://www.faxin.cn', source: '法律社区', note: '涉税裁判规则与法条关联检索', kind: 'community' },
    ],
    books: [
      { title: '税法总论', author: '杨小强', why: '把税法的体系逻辑讲清楚的原理书' },
      { title: '税收筹划', author: '蔡昌', why: '合法节税的方法论与案例集' },
    ],
  },
  '数据出境合规顾问': {
    videos: [
      { title: '人工智能与法律（西南政法大学，智慧教育平台版）', url: 'https://higher.smartedu.cn/course/65bc1f7abb5c5a8025af73a6', source: '国家智慧教育平台', note: '数据治理与跨境规则的板块对口出境合规场景' },
    ],
    docs: [
      { title: '全国信息安全标准化技术委员会', url: 'https://www.tc260.org.cn', source: '官方标准', note: '数据出境安全评估与跨境流动相关国家标准发布口' },
      { title: 'IAPP（国际隐私专业协会）', url: 'https://iapp.org', source: '隐私社区', note: 'GDPR 等域外数据法动态第一站，出境合规要两头看', kind: 'community' },
    ],
    books: [
      { title: '个人信息保护法理解与适用', author: '程啸', why: '出境规则在个保法框架内讲解最透' },
      { title: '中华人民共和国数据安全法释义', author: '龙卫球（主编）', why: '数据安全法逐条释义，出境评估的法条根' },
    ],
  },
  '网络安全等级保护顾问': {
    videos: [
      { title: '网络与人工智能法（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1473411163', source: '中国大学MOOC', note: '网络安全法专章讲解，等保制度的法律框架' },
    ],
    docs: [
      { title: '国家标准全文公开系统', url: 'https://openstd.samr.gov.cn', source: '官方标准', note: 'GB/T 22239 等保基本要求等国标原文免费读' },
      { title: 'FreeBuf（网络安全行业门户）', url: 'https://www.freebuf.com', source: '技术社区', note: '等保测评实操讨论与技术工具分享的主阵地', kind: 'community' },
    ],
    books: [
      { title: '网络安全等级保护基本要求（GB/T 22239-2019）应用指南', author: '郭启全（主编）', why: '等保 2.0 核心起草人写的标准应用指南' },
      { title: '代码2.0', author: '劳伦斯·莱斯格', why: '理解网络空间治理逻辑的经典框架' },
    ],
  },
  '个人信息保护官': {
    videos: [
      { title: '【罗翔】好友列表中竟然潜伏着“文件传输助手”？——个保法问题', url: 'https://www.bilibili.com/video/BV1iF4m1j7W7', source: 'B站', note: '用真实场景把个保法问题讲活，合规沟通的话术起点' },
    ],
    docs: [
      { title: '全国信息安全标准化技术委员会', url: 'https://www.tc260.org.cn', source: '官方标准', note: '个人信息安全规范及实践指南的国标发布地' },
      { title: 'IAPP（国际隐私专业协会）', url: 'https://iapp.org', source: '隐私社区', note: '隐私官职业社区：认证、案例与监管动态', kind: 'community' },
    ],
    books: [
      { title: '个人信息保护法理解与适用', author: '程啸', why: '个保法逐条 + 案例，PIPO 日常翻的书' },
      { title: '隐私权的法律保护', author: '张新宝', why: '从隐私到个人信息的理论演进底图' },
    ],
  },
  '行政处罚复议律师': {
    videos: [
      { title: '行政法与行政诉讼法（四川大学，国家一流课程）', url: 'https://www.icourse163.org/course/-1207044801', source: '中国大学MOOC', note: '徐继敏教授主讲，行政执法与复议诉讼程序系统课' },
    ],
    docs: [
      { title: '国家市场监督管理总局', url: 'https://www.samr.gov.cn', source: '官方文档', note: '市监领域行政处罚与执法公示，复议业务的案源面' },
      { title: '正义网（检察日报社）', url: 'https://www.jcrb.com', source: '法律社区', note: '行政执法监督报道与评论，复议思路的素材库', kind: 'community' },
    ],
    books: [
      { title: '行政法学', author: '章剑生', why: '行政行为与程序的体系教材' },
      { title: '行政诉讼法', author: '应松年', why: '行政诉讼制度权威教材，复议诉讼衔接讲得清' },
    ],
  },
  '数据合规官': {
    videos: [
      { title: '网络与人工智能法（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1473411163', source: '中国大学MOOC', note: '网络安全法、数据法、AI 法，数据合规官的法律框架课' },
    ],
    docs: [
      { title: '国家标准全文公开系统', url: 'https://openstd.samr.gov.cn', source: '官方标准', note: '数据分类分级、重要数据识别等国标全文' },
      { title: 'OpenLaw', url: 'https://www.openlaw.cn', source: '法律社区', note: '数据合规相关裁判文书开放检索', kind: 'community' },
    ],
    books: [
      { title: '中华人民共和国数据安全法释义', author: '龙卫球（主编）', why: '数安法逐条释义，合规红线直接来源' },
      { title: 'Understanding Privacy（隐私的理解）', author: 'Daniel J. Solove', why: '合规背后隐私判断的理论底座' },
    ],
  },
  '算法合规顾问': {
    videos: [
      { title: '人工智能与法律（西南政法大学，智慧教育平台版）', url: 'https://higher.smartedu.cn/course/65bc1f7abb5c5a8025af73a6', source: '国家智慧教育平台', note: 'AI 宪法规制、自动化行政、算法监管章节直接对口' },
    ],
    docs: [
      { title: '法律图书馆', url: 'https://www.law-lib.com', source: '法规库', note: '算法推荐管理规定、深度合成规定等规范性文件全文' },
      { title: '法信', url: 'https://www.faxin.cn', source: '法律社区', note: '算法相关纠纷裁判规则检索', kind: 'community' },
    ],
    books: [
      { title: '算法霸权：数学杀伤性武器的威胁与不公', author: '凯西·奥尼尔', why: '算法歧视的公民视角，做算法审计先知道会伤害谁' },
      { title: '代码2.0', author: '劳伦斯·莱斯格', why: '「代码即规则」的源头，算法合规的思想原点' },
    ],
  },
  '出海法务': {
    videos: [
      { title: '国际经济法（上海交通大学）', url: 'https://www.icourse163.org/course/-1003642002', source: '中国大学MOOC', note: '贸易、投资、金融、税收、争端解决十一单元，出海法律全景图' },
    ],
    docs: [
      { title: 'WTO 争端解决 · 案件状态', url: 'https://www.wto.org/english/tratop_e/dispu_e/dispu_status_e.htm', source: 'WTO', note: '全球贸易监管与争端动态的官方窗口' },
      { title: '澎湃新闻 · 法治频道', url: 'https://www.thepaper.cn/list_25440', source: '法治媒体', note: '中国企业出海合规事件的法治报道跟进', kind: 'community' },
    ],
    books: [
      { title: '国际商法', author: '沈四宝', why: '国际商法体系教材，涉外合同与组织的根基' },
      { title: '国际贸易法', author: '韩立余', why: '贸易规则与 WTO 体系的中文权威教材' },
    ],
  },
  '知识产权运营师': {
    videos: [
      { title: '知识产权管理（电子科技大学）', url: 'https://www.icourse163.org/course/UESTC-1001997005', source: '中国大学MOOC', note: '从创造、管理到转化运用，运营岗的知识结构课' },
    ],
    docs: [
      { title: 'WIPO 知识产权条约', url: 'https://www.wipo.int/treaties/en/', source: 'WIPO', note: '国际条约框架，专利商标全球布局的游戏规则' },
      { title: 'IPRdaily（知识产权产业媒体）', url: 'https://www.iprdaily.cn', source: '知产社区', note: '知产运营与交易动态的专业社区，专利变资产的一线情报', kind: 'community' },
    ],
    books: [
      { title: '企业知识产权战略', author: '冯晓青', why: '把知产从权利变成经营策略的方法书' },
      { title: '知识产权基本问题', author: '吴汉东（主编）', why: '运营的前提是吃透权利本体' },
    ],
  },
};
