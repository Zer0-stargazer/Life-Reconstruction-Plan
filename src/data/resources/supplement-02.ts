import type { CareerResourceSet } from '../career-resources';

export const supplementResources02: Record<string, CareerResourceSet> = {
  '商务洽谈翻译': {
    videos: [
      { title: '前FBI首席人质谈判代表的沟通策略', url: 'https://www.bilibili.com/video/BV1ts4y1w7vJ', source: 'Bilibili', note: '谈判心理学课' },
    ],
    docs: [
      { title: 'reddit · r/negotiation', url: 'https://www.reddit.com/r/negotiation/', source: '行业社区', note: '谈判技巧全球社区', kind: 'community' },

      { title: '中国国际贸易促进委员会', url: 'https://www.ccpit.org', source: '官方文档', note: '国际商务活动与展会信息' },
      { title: '商务部', url: 'https://www.mofcom.gov.cn', source: '官方文档', note: '对外贸易政策与法规' },
    ],
    books: [
      { title: '谈判力', author: '罗杰·费希尔', why: '哈佛谈判项目的经典' },
{ title: 'Getting to Yes（谈判力）', author: 'Roger Fisher, William Ury', why: '商务谈判领域的经典入门读物' }],
  },
  '渠道招商经理': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '渠道谈判的心理根基' },
      { title: '赢', author: '杰克·韦尔奇', why: '商业管理的通用经典' }
    ],
    videos: [
      { title: '品牌方招商加盟六步策略', url: 'https://www.bilibili.com/video/BV1B84y1m7GN', source: 'Bilibili', note: '招商体系搭建方法论' },


    ],
    docs: [
      { title: '市场营销（四川大学）', url: 'https://www.chinaooc.com.cn/course/67ad2f61225d72705e160e4a', source: '国家高等教育智慧教育平台', note: '渠道策略与营销组合经典课' },

      { title: 'reddit · r/smallbusiness', url: 'https://www.reddit.com/r/smallbusiness/', source: '行业社区', note: '小微企业社区', kind: 'community' }
    ],
  },
  '新零售运营': {
    books: [
      { title: '零售的哲学', author: '铃木敏文', why: '7-Eleven经营哲学' },
      { title: '一胜九败', author: '柳井正', why: '优衣库零售创业史' }
    ],
    videos: [
      { title: 'Content Marketing（内容营销）', url: 'https://www.coursera.org/learn/content-marketing', source: 'Coursera', note: '英文，内容运营与用户增长' }
    ],
    docs: [
      { title: '全渠道营销实务', url: 'https://www.icourse163.org/course/-1460870161', source: '中国大学MOOC', note: '新零售与全渠道构建系统课' },

      { title: 'reddit · r/retail', url: 'https://www.reddit.com/r/retail/', source: '行业社区', note: '零售从业全球社区', kind: 'community' }
    ],
  },
  '首席数据官': {
    books: [
      { title: '大数据时代', author: '维克托·迈尔-舍恩伯格', why: '大数据思维经典' },
      { title: '精益数据分析', author: '阿利斯泰尔·克罗尔', why: '数据驱动决策方法' },
    ],
    docs: [
      { title: 'reddit · r/dataengineering', url: 'https://www.reddit.com/r/dataengineering/', source: '行业社区', note: '数据工程社区', kind: 'community' },

      { title: '大数据分析与应用（北京交通大学）', url: 'https://higher.smartedu.cn/course/63fd325aaf1f1b5d3ecfd1b8', source: '智慧教育平台', note: '含数据治理与决策支持章节' },
    ],
    videos: [
      { title: 'edX Data Science 数据科学课程', url: 'https://www.edx.org/learn/data-science', source: 'edX', note: '英文，数据分析与数据驱动决策' },
    ],
  },
  '企业大学校长': {
    books: [
      { title: '上接战略 下接绩效', author: '田俊国', why: '企业大学与培训落地' },
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '教学设计的经典' },
    ],
    docs: [
      { title: 'HRoot · 企业大学与培训社区', url: 'https://www.hroot.com/', source: '行业社区', note: 'HR内容与活动平台', kind: 'community' },

      { title: '人力资源管理（四川大学）', url: 'https://www.icourse163.org/course/SCU-1002532009', source: '中国大学MOOC', note: '含培训与开发专章' },
    ],
    videos: [
      { title: 'edX Human Resources 人力资源课程', url: 'https://www.edx.org/learn/human-resources', source: 'edX', note: '英文，组织发展与人才培养' },
    ],
  },
  '办公室主任': {
    books: [
      { title: '卓有成效的管理者', author: '彼得·德鲁克', why: '管理者的永恒经典' },
      { title: '高效能人士的七个习惯', author: '史蒂芬·柯维', why: '职业化素养根基' },
    ],
    docs: [
      { title: 'reddit · r/management', url: 'https://www.reddit.com/r/management/', source: '行业社区', note: '行政管理者社区', kind: 'community' },

      { title: '组织行为学（四川大学）', url: 'https://higher.smartedu.cn/course/6986692295df98bb27d90d46', source: '智慧教育平台', note: '个体/群体/领导/组织文化的理论框架' },
    ],
    videos: [
      { title: 'edX Project Management 项目管理课程', url: 'https://www.edx.org/learn/project-management', source: 'edX', note: '英文，统筹协调与执行管理' },
    ],
  },
  '危机公关经理': {
    books: [
      { title: '舆论', author: '沃尔特·李普曼', why: '危机传播的思想根基' },
      { title: '沟通的艺术', author: '罗纳德·B·阿德勒', why: '危机沟通方法' },
    ],
    docs: [
      { title: 'reddit · r/PublicRelations', url: 'https://www.reddit.com/r/PublicRelations/', source: '行业社区', note: '公关从业社区', kind: 'community' },

      { title: '公共关系学：沟通公众的艺术', url: 'https://www.icourse163.org/course/ZGJL-1462426163', source: '中国大学MOOC', note: '含危机公共关系专章' },
    ],
    videos: [
      { title: 'edX Public Speaking 公开演讲课程', url: 'https://www.edx.org/learn/public-speaking', source: 'edX', note: '英文，危机时刻的对外表达' },
    ],
  },
  '董事会秘书': {
    books: [
      { title: '财务报表分析', author: '张新民', why: '信息披露的财务根基' },
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '投资者沟通的说服根基' },
    ],
    videos: [
      { title: '董秘实操全解：信息披露与市值管理', url: 'https://www.bilibili.com/video/BV1RwByBVEwm', source: 'Bilibili', note: '董秘系统课' },
    ],
    docs: [
      { title: 'reddit · r/Accounting', url: 'https://www.reddit.com/r/Accounting/', source: '行业社区', note: '信披财务讨论', kind: 'community' },

      { title: '中国证监会', url: 'https://www.csrc.gov.cn', source: '官方文档', note: '上市公司信息披露与监管规则' },
      { title: '上海证券交易所', url: 'https://www.sse.com.cn', source: '官方文档', note: '上市公司规范运作指引' },
      { title: '深圳证券交易所', url: 'https://www.szse.cn', source: '官方文档', note: '上市公司规范运作指引' },
    ],
  },
  '行政总监': {
    books: [
      { title: '卓有成效的管理者', author: '彼得·德鲁克', why: '管理者的永恒经典' },
      { title: '高效能人士的七个习惯', author: '史蒂芬·柯维', why: '职业化素养根基' },
    ],
    docs: [
      { title: 'reddit · r/leadership', url: 'https://www.reddit.com/r/leadership/', source: '行业社区', note: '领导力社区', kind: 'community' },

      { title: '组织行为学（四川大学）', url: 'https://higher.smartedu.cn/course/6986692295df98bb27d90d46', source: '智慧教育平台', note: '个体/群体/领导/组织文化的理论框架' },
    ],
    videos: [
      { title: 'edX Project Management 项目管理课程', url: 'https://www.edx.org/learn/project-management', source: 'edX', note: '英文，行政事务的统筹与流程管理' },
    ],
  },
  '企业文化经理': {
    docs: [
      { title: '中人网 · 企业文化社区', url: 'https://www.chinahrd.net/', source: '行业社区', note: '中国人力资源开发网', kind: 'community' },

      { title: '组织行为学（西北农林科技大学）', url: 'https://www.chinaooc.com.cn/course/67c78dc7225d72705e952658', source: '国家智慧教育平台', note: '含组织文化专章' },
    ],
    videos: [
      { title: 'edX Human Resources 人力资源课程', url: 'https://www.edx.org/learn/human-resources', source: 'edX', note: '英文，组织文化与员工体验' },
    ],
    books: [
      { title: '奈飞文化手册', author: '帕蒂·麦考德', why: '文化落地的实操经典' },
{ title: 'Corporate Culture and Performance（企业文化与经营业绩）', author: 'John P. Kotter, James L. Heskett', why: '研究企业文化如何影响经营结果的经典著作' }],
  },
  '投资关系经理': {
    books: [
      { title: '财务报表分析', author: '张新民', why: '信息披露的财务根基' },
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '投资者沟通的说服根基' },
    ],
    videos: [
      { title: 'edX Finance 金融课程', url: 'https://www.edx.org/learn/finance', source: 'edX', note: '英文，公司金融与资本市场基础' },
    ],
    docs: [
      { title: 'reddit · r/productivity', url: 'https://www.reddit.com/r/productivity/', source: '行业社区', note: '效率社区', kind: 'community' },

      { title: '中国证监会', url: 'https://www.csrc.gov.cn', source: '官方文档', note: '上市公司信息披露与投资者关系规则' },
      { title: '深圳证券交易所', url: 'https://www.szse.cn', source: '官方文档', note: '上市公司投资者关系相关规范' },
    ],
  },
  '矿山工程师': {
    books: [
      { title: '采矿学', author: '杜计平', why: '采矿专业的标准教材' },
      { title: '岩石力学', author: '蔡美峰', why: '矿山岩体工程的根基' },
    ],
    videos: [
      { title: '采矿学（中国矿业大学·精品课）', url: 'https://www.bilibili.com/video/BV1LG411g7ur', source: 'Bilibili', note: '采矿学系统课' },
    ],
    docs: [
      { title: 'reddit · r/mining', url: 'https://www.reddit.com/r/mining/', source: '行业社区', note: '矿业工程师全球社区', kind: 'community' },

      { title: '国家矿山安全监察局', url: 'https://www.chinamine-safety.gov.cn', source: '官方文档', note: '矿山安全监管政策与规范' },
    ],
  },
  '爆破工程师': {
    books: [
      { title: '采矿学', author: '杜计平', why: '采矿专业的标准教材' },
      { title: '岩石力学', author: '蔡美峰', why: '矿山岩体工程的根基' },
    ],
    videos: [
      { title: '采矿学（中国矿业大学·精品课）', url: 'https://www.bilibili.com/video/BV1LG411g7ur', source: 'Bilibili', note: '采矿学系统课' },
    ],
    docs: [
      { title: 'reddit · r/mining', url: 'https://www.reddit.com/r/mining/', source: '行业社区', note: '矿业工程师全球社区', kind: 'community' },

      { title: '国家矿山安全监察局', url: 'https://www.chinamine-safety.gov.cn', source: '官方文档', note: '爆破作业安全监管相关规范' },
    ],
  },
  '食品工程师': {
    books: [
      { title: '食品工艺学', author: '夏文水', why: '食品加工保藏的标准教材' },
      { title: '食品化学', author: '王璋', why: '食品成分变化的理论根基' },
    ],
    docs: [
      { title: 'reddit · r/foodscience', url: 'https://www.reddit.com/r/foodscience/', source: '行业社区', note: '食品科学全球社区', kind: 'community' },

      { title: '食品工艺学（福建农林大学·一流课程）', url: 'https://www.icourse163.org/course/FAFU-1002040002', source: '中国大学MOOC', note: '保藏/罐藏/腌制工艺的核心课' },
    ],
    videos: [
      { title: 'edX Food Science 食品科学课程', url: 'https://www.edx.org/learn/food-science', source: 'edX', note: '英文，食品加工与保藏原理' },
    ],
  },
  '养老规划师': {
    books: [
      { title: '最好的告别', author: '阿图·葛文德', why: '老年关怀与临终照护的必读经典' },
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '居家养老照护的理念之作' },
    ],
    videos: [
      { title: '养老护理员基础知识（初中高级·国家职业资格）', url: 'https://www.bilibili.com/video/BV1iSeFeuErF', source: 'Bilibili', note: '养老护理考证课' },
    ],
    docs: [
      { title: 'reddit · r/eldercare', url: 'https://www.reddit.com/r/eldercare/', source: '行业社区', note: '养老照护全球社区', kind: 'community' },

      { title: '中华人民共和国民政部', url: 'https://www.mca.gov.cn', source: '官方文档', note: '养老服务政策与标准' },
    ],
  },
  '保洁管理师': {
    books: [
      { title: '断舍离', author: '山下英子', why: '家务整理的理念根基' },
      { title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '居家整理的方法论' },
    ],
    videos: [
      { title: '家政课程（通铭教育）', url: 'https://www.bilibili.com/video/BV1rW411n7pu', source: 'Bilibili', note: '家政服务系统课' },
    ],
    docs: [
      { title: 'reddit · r/CleaningTips', url: 'https://www.reddit.com/r/CleaningTips/', source: '行业社区', note: '清洁收纳社区', kind: 'community' },

      { title: '中华人民共和国人力资源和社会保障部', url: 'https://www.mohrss.gov.cn', source: '官方文档', note: '国家职业技能标准与职业发布' },
    ],
  },
  // 2026-10-12 传媒类 5 个职业（纪录片导演 / 出版编辑 / 新闻编辑 / 解说员 / 有声书制作人）
  // 已迁到 resources/media.ts 重配专属资源，此处删除避免覆盖。
  '能源数字化产品经理': {
    books: [
      { title: '电力系统分析', author: '何仰赞', why: '电力系统的标准教材' },
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' }
    ],
    videos: [

      { title: 'edX Digital Transformation 数字化转型课程', url: 'https://www.edx.org/learn/digital-transformation', source: 'edX', note: '英文，数字化转型方法论' }
    ],
    docs: [
      { title: '北极星电力网', url: 'https://news.bjx.com.cn/', source: '行业社区', note: '电力行业资讯与社区', kind: 'community' },

      { title: '国家能源局', url: 'https://www.nea.gov.cn', source: '官方文档', note: '能源行业政策与数字化相关规划' }
    ],
  },
  '金融舆情分析师': {
    books: [
      { title: '乌合之众', author: '古斯塔夫·勒庞', why: '群体心理与舆论传播的经典' },
      { title: '置身事内', author: '兰小欢', why: '理解政策面舆情的语境' }
    ],
    videos: [
      { title: 'NLP 舆情分析实战', url: 'https://www.bilibili.com/video/BV15MMfzhEXR', source: 'Bilibili', note: '舆情数据挖掘系统课' },


    ],
    docs: [
      { title: '金融科技与互联网金融（江苏服务职业技术学院）', url: 'https://www.icourse163.org/course/JSSVC-1207056805', source: '中国大学MOOC', note: '金融科技业态与监管全景课' },

      { title: '新浪财经', url: 'https://finance.sina.com.cn/', source: '行业社区', note: '财经新闻与舆情监测面', kind: 'community' },

      { title: '网易财经', url: 'https://money.163.com/', source: '行业社区', note: '财经资讯与市场评论', kind: 'community' }
    ],
  },
  '医疗设备维修工程师': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '器械销售与客户沟通的方法论' },
      { title: '薄世宁医学通识讲义', author: '薄世宁', why: '理解临床需求场景的通识底座' },
    ],
    videos: [
      { title: '医疗器械产品注册思路及流程', url: 'https://www.bilibili.com/video/BV13C4y1H7Qa', source: 'Bilibili', note: '器械注册实务' },
    ],
    docs: [
      { title: 'reddit · r/biotech', url: 'https://www.reddit.com/r/biotech/', source: '行业社区', note: '生物科技行业社区', kind: 'community' },

      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn', source: '官方文档', note: '医疗器械注册与监管法规' },
    ],
  },
  '博物馆教育专员': {
    books: [
      { title: '追求理解的教学设计', author: '格兰特·威金斯', why: 'UbD 逆向设计的经典' },
      { title: '林间最后的小孩', author: '理查德·洛夫', why: '自然教育的奠基之作' },
    ],
    videos: [
      { title: '幼儿园项目活动与深度学习案例', url: 'https://www.bilibili.com/video/BV11C411n7yw', source: 'Bilibili', note: '项目制学习案例' },
    ],
    docs: [
      { title: 'reddit · r/humanresources', url: 'https://www.reddit.com/r/humanresources/', source: '行业社区', note: '培训与发展社区', kind: 'community' },

      { title: '中国国家博物馆', url: 'https://www.chnmuseum.cn', source: '官方文档', note: '国家级博物馆的教育活动与展览信息' },
      { title: '国家图书馆', url: 'https://www.nlc.cn', source: '官方文档', note: '文献与公共文化服务资源' },
    ],
  },
  '车载HMI设计师': {
    videos: [
      { title: 'edX UX Design 用户体验设计课程', url: 'https://www.edx.org/learn/ux-design', source: 'edX', note: '英文，交互与用户体验设计基础' },
    ],
    docs: [
      { title: 'reddit · r/typography', url: 'https://www.reddit.com/r/typography/', source: '行业社区', note: '字体社区', kind: 'community' },

      { title: 'W3C Web 可访问性倡议（WAI）', url: 'https://www.w3.org/WAI/', source: '官方文档', note: '界面可访问性设计规范' },
    ],
    books: [
      { title: 'About Face 4：交互设计精髓', author: '艾伦·库珀', why: '车载交互的目标导向方法' },
{ title: 'About Face: The Essentials of Interaction Design（交互设计精髓）', author: 'Alan Cooper 等', why: '交互设计方法的经典入门书' }],
  },
  'AIGC视觉设计师': {
    books: [
      { title: '艺术·设计的色彩构成', author: '朝仓直巳', why: '数字色彩体系的基础教材' },
      { title: '艺术·设计的平面构成', author: '朝仓直巳', why: '数字图形构成的基础教材' },
    ],
    docs: [
      { title: 'ArtStation', url: 'https://www.artstation.com/', source: '行业社区', note: '数字艺术与概念设计平台', kind: 'community' },

      { title: '产品设计与开发（SPOC）', url: 'https://www.icourse163.org/course/SAU-1462568166', source: '中国大学MOOC', note: '数字产品从概念到原型的流程' },
    ],
    videos: [
      { title: 'AI For Everyone（人人都懂 AI）', url: 'https://www.coursera.org/learn/ai-for-everyone', source: 'Coursera', note: '英文，AI 能力与应用边界的入门课' },
    ],
  },
  '智能硬件设计师': {
    docs: [
      { title: '普象网（工业设计社区）', url: 'https://www.puxiang.com/', source: '行业社区', note: '国内产品设计师社区', kind: 'community' },

      { title: '产品设计与工程（江南大学）', url: 'https://www.icourse163.org/course/-1460191162', source: '中国大学MOOC', note: '材料、工艺与结构的工程根基' },
    ],
    videos: [
      { title: 'edX UX Design 用户体验设计课程', url: 'https://www.edx.org/learn/ux-design', source: 'edX', note: '英文，面向产品的交互设计基础' },
    ],
    books: [
      { title: '设计心理学', author: '唐纳德·诺曼', why: '可用性与用户心智的设计经典' },
{ title: 'Designing Interactions（交互设计的设计）', author: 'Bill Moggridge', why: '交互设计先驱的经典著作，适合理解软硬件结合' }],
  },
  '政府关系经理': {
    books: [
      { title: '舆论', author: '沃尔特·李普曼', why: '公关传播的思想原典' },
      { title: '沟通的艺术', author: '罗纳德·B·阿德勒', why: '沟通学经典教材' },
    ],
    videos: [
      { title: '政府公关GR的常见误区和正确方法', url: 'https://www.bilibili.com/video/BV1BeMazZEjo', source: 'Bilibili', note: '政府关系实务课' },
    ],
    docs: [
      { title: 'reddit · r/PublicRelations', url: 'https://www.reddit.com/r/PublicRelations/', source: '行业社区', note: '公关从业全球社区', kind: 'community' },

      { title: '中国政府网', url: 'https://www.gov.cn', source: '官方文档', note: '国务院政策文件与政府信息公开' },
    ],
  },
  '海外市场拓展经理': {
    books: [
      { title: '世界是平的', author: '托马斯·弗里德曼', why: '出海的全球化框架' },
      { title: '别独自用餐', author: '基思·法拉奇', why: '海外人脉拓展' },
    ],
    videos: [
      { title: 'ToB海外销售真相：海外没有人情世故', url: 'https://www.bilibili.com/video/BV1MFaB6zEfB', source: 'Bilibili', note: '海外销售实务' },
    ],
    docs: [
      { title: 'reddit · r/business', url: 'https://www.reddit.com/r/business/', source: '行业社区', note: '商业社区', kind: 'community' },

      { title: '中国国际贸易促进委员会', url: 'https://www.ccpit.org', source: '官方文档', note: '境外展会与贸易促进信息' },
      { title: 'WTO 世界贸易组织', url: 'https://www.wto.org', source: 'WTO', note: '国际贸易规则与政策' },
    ],
  },
  '经销商管理经理': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '渠道谈判的心理根基' },
      { title: '赢', author: '杰克·韦尔奇', why: '商业管理的通用经典' }
    ],
    videos: [
      { title: 'edX Supply Chain Management 供应链管理课程', url: 'https://www.edx.org/learn/supply-chain-management', source: 'edX', note: '英文，渠道与供应链协同' }
    ],
    docs: [
      { title: '市场营销（四川大学）', url: 'https://www.chinaooc.com.cn/course/67ad2f61225d72705e160e4a', source: '国家高等教育智慧教育平台', note: '渠道策略与营销组合经典课' },

      { title: 'reddit · r/smallbusiness', url: 'https://www.reddit.com/r/smallbusiness/', source: '行业社区', note: '小微企业社区', kind: 'community' }
    ],
  },
};
