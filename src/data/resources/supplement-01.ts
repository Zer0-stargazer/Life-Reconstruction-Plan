import type { CareerResourceSet } from '../career-resources';

export const supplementResources01: Record<string, CareerResourceSet> = {
  '融资租赁经理': {
    books: [
      { title: '供应链金融', author: '宋华', why: '租赁与供应链融资模式的系统著作' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '融资租赁的银行视角' },
    ],
    docs: [
      { title: 'reddit · r/dividends', url: 'https://www.reddit.com/r/dividends/', source: '行业社区', note: '股息与收益投资讨论', kind: 'community' },


      { title: '财务管理理论与案例（北京交通大学）', url: 'https://higher.smartedu.cn/course/6a8e17bab44e493c7638c5cf', source: '智慧教育平台', note: '租赁融资与财务决策的案例课' },
    ],
    videos: [
      { title: 'edX: Finance（金融专题）', url: 'https://www.edx.org/learn/finance', source: 'edX', note: '英文，金融与资本市场基础' },
    ],
  },
  '运动医学医师': {
    books: [
      { title: '康复医学', author: '黄晓琳', why: '康复医学的人卫标准教材' },
      { title: '物理治疗学', author: '燕铁斌', why: '运动治疗与物理因子的核心技术教材' },
    ],
    videos: [
      { title: 'Exercise Science（运动科学）', url: 'https://www.coursera.org/learn/exercise-science', source: 'Coursera', note: '英文，运动生理与训练基础' },
    ],
    docs: [
      { title: '医脉通', url: 'https://www.medlive.cn/', source: '行业社区', note: '指南与病例资源', kind: 'community' },

      { title: '美国运动医学学会 ACSM', url: 'https://www.acsm.org', source: 'ACSM', note: '运动医学指南与学术资源' },
    ],
  },
  '医疗器械销售': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '器械销售与客户沟通的方法论' },
      { title: '薄世宁医学通识讲义', author: '薄世宁', why: '理解临床需求场景的通识底座' }
    ],
    videos: [
      { title: '医疗器械销售实务干货', url: 'https://www.bilibili.com/video/BV18M4y1H7Hn', source: 'Bilibili', note: '器械销售技能实录' },


    ],
    docs: [
      { title: 'reddit · r/biotech', url: 'https://www.reddit.com/r/biotech/', source: '行业社区', note: '生物科技行业社区', kind: 'community' },

      { title: '国家药品监督管理局医疗器械', url: 'https://www.nmpa.gov.cn/ylqx/', source: '官方文档', note: '医疗器械注册与监管政策' }
    ],
  },
  '语言教师': {
    docs: [
      { title: 'reddit · r/languagelearning', url: 'https://www.reddit.com/r/languagelearning/', source: '行业社区', note: '语言学习全球社区', kind: 'community' },

      { title: '课程与教学论（陕西师范大学·一流课程）', url: 'https://www.icourse163.org/course/0401SNNU016-1205775805', source: '中国大学MOOC', note: '课程设计与教学方法的教师教育课' },
    ],
    videos: [
      { title: '北语对外汉语示范课：初级汉语综合课', url: 'https://www.bilibili.com/video/BV1ra411A7My', source: 'Bilibili', note: '语言课堂教学示范' },
    ],
    books: [
      { title: '英语教学法教程', author: '王蔷', why: '语言教学法的标准教材' },
{ title: 'How Languages Are Learned（语言是如何习得的）', author: 'Patsy Lightbown、Nina Spada', why: '第二语言习得理论入门，适合语言教学者' }],
  },
  '音乐教师': {
    books: [
      { title: '音乐教育的哲学', author: '贝内特·雷默', why: '音乐教育的理论经典' },
      { title: '艺术的故事', author: '贡布里希', why: '艺术史教学的通行读本' },
    ],
    docs: [
      { title: 'reddit · r/musiced', url: 'https://www.reddit.com/r/musiced/', source: '行业社区', note: '音乐教育全球社区', kind: 'community' },

      { title: '中学音乐教学论', url: 'https://www.icourse163.org/course/cid=1450387186', source: '中国大学MOOC', note: '音乐课程与教学法的学科教学论' },
    ],
    videos: [
      { title: 'edX: Music（音乐专题）', url: 'https://www.edx.org/learn/music', source: 'edX', note: '英文，音乐理论与表演基础' },
    ],
  },
  '公务员考试培训师': {
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '辅导教学的经典指南' },
      { title: '刻意练习', author: '安德斯·艾利克森', why: '高效训练设计的方法论' },
    ],
    videos: [
      { title: '教案模版：教学设计怎么写', url: 'https://www.bilibili.com/video/BV1Wt4y1r7mX', source: 'Bilibili', note: '教案写作基本功' },
    ],
    docs: [
      { title: 'reddit · r/education', url: 'https://www.reddit.com/r/education/', source: '行业社区', note: '教育综合社区', kind: 'community' },

      { title: '人力资源和社会保障部', url: 'https://www.mohrss.gov.cn', source: '官方文档', note: '公务员录用相关政策与公告' },
    ],
  },
  '导演/制片人': {
    books: [
      { title: '电影语言的语法', author: '丹尼尔·阿里洪', why: '镜头调度与剪辑的语法书' },
      { title: '故事：材质、结构、风格和银幕剧作的原理', author: '罗伯特·麦基', why: '叙事设计的行业圣经' },
    ],
    videos: [
      { title: 'edX: Film（电影专题）', url: 'https://www.edx.org/learn/film', source: 'edX', note: '英文，电影制作与叙事基础' },
    ],
    docs: [
      { title: 'reddit · r/filmmakers', url: 'https://www.reddit.com/r/filmmakers/', source: '行业社区', note: '导演与制片全球社区', kind: 'community' },

      { title: '文化和旅游部', url: 'https://www.mct.gov.cn', source: '官方文档', note: '文化产业与影视行业政策' },
    ],
  },
  '服装设计师': {
    books: [
      { title: '时装设计元素', author: '苏·珍妮·琼斯', why: '时装设计的体系入门书' },
      { title: '伯里曼人体结构绘画教学', author: '乔治·伯里曼', why: '服装效果图的人体根基' },
    ],
    docs: [
      { title: '花瓣网（灵感采集）', url: 'https://huaban.com/', source: '行业社区', note: '服装灵感图库采集', kind: 'community' },

      { title: '摄影基础（常州工学院）', url: 'https://higher.smartedu.cn/course/69a3692e95df98bb2773b223', source: '智慧教育平台', note: '服装摄影与效果图的影像表达' },
    ],
    videos: [
      { title: 'edX: Fashion（时尚专题）', url: 'https://www.edx.org/learn/fashion', source: 'edX', note: '英文，时尚产业与设计基础' },
    ],
  },
  '景观设计师': {
    books: [
      { title: '从概念到形式', author: '格兰特·里德', why: '景观方案落地的经典方法论' },
      { title: '设计结合自然', author: '伊恩·麦克哈格', why: '生态规划的开山之作' },
    ],
    docs: [
      { title: '谷德设计网', url: 'https://www.gooood.cn/', source: '行业社区', note: '景观与建筑一线案例社区', kind: 'community' },

      { title: 'ArchDaily 中文（建筑与景观案例库）', url: 'https://www.archdaily.cn/', source: '官方资料库', note: '一线景观项目与技术细节' },
    ],
    videos: [
      { title: 'edX: Architecture（建筑专题）', url: 'https://www.edx.org/learn/architecture', source: 'edX', note: '英文，空间设计基础，景观设计的相邻领域' },
    ],
  },
  '包装设计师': {
    books: [
      { title: '写给大家看的设计书', author: '罗宾·威廉姆斯', why: '包装信息层级与视觉原则' },
      { title: '设计中的设计', author: '原研哉', why: '包装再设计的思维范例' },
    ],
    docs: [
      { title: 'reddit · r/graphic_design', url: 'https://www.reddit.com/r/graphic_design/', source: '行业社区', note: '平面设计社区', kind: 'community' },

      { title: '产品设计（长安大学）', url: 'https://higher.smartedu.cn/course/62354d7c9906eace0490c990', source: '智慧教育平台', note: '含产品包装造型与图形设计章节' },
    ],
    videos: [
      { title: 'edX: Graphic Design（平面设计专题）', url: 'https://www.edx.org/learn/graphic-design', source: 'edX', note: '英文，视觉设计基础' },
    ],
  },
  '动态图形设计师': {
    books: [
      { title: '动画师生存手册', author: '理查德·威廉姆斯', why: '动效节奏的动画法则根基' },
      { title: '设计中的设计', author: '原研哉', why: '动效叙事的设计思维' },
    ],
    docs: [
      { title: 'Dribbble（设计作品社区）', url: 'https://dribbble.com/', source: '行业社区', note: '设计作品灵感平台', kind: 'community' },

      { title: '无纸动画（常州纺织服装职院）', url: 'https://higher.smartedu.cn/course/65fb6558bb5c5a8025c2f65e', source: '智慧教育平台', note: '原动画节奏与运动规律实训' },
    ],
    videos: [
      { title: 'edX: Graphic Design（平面设计专题）', url: 'https://www.edx.org/learn/graphic-design', source: 'edX', note: '英文，视觉设计基础，动态图形的前置知识' },
    ],
  },
  '儿童绘本画家': {
    books: [
      { title: '图画书：阅读与经典', author: '彭懿', why: '绘本阅读与创作的权威导读' },
      { title: '好绘本如何好', author: '郝广才', why: '绘本语言的拆解方法' },
    ],
    docs: [
      { title: '花瓣网（灵感采集）', url: 'https://huaban.com/', source: '行业社区', note: '绘本画面采集', kind: 'community' },

      { title: '摄影基础（国家一流课程）', url: 'https://www.icourse163.org/course/-1001958013', source: '中国大学MOOC', note: '画面叙事与构图的综合训练' },
    ],
    videos: [
      { title: 'edX: Graphic Design（平面设计专题）', url: 'https://www.edx.org/learn/graphic-design', source: 'edX', note: '英文，插画与视觉表达的基础' },
    ],
  },
  '鞋类设计师': {
    books: [
      { title: '工业设计史', author: '何人可', why: '制鞋工业与设计演进脉络' },
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '球鞋潮流与消费心理' },
    ],
    docs: [
      { title: 'Dribbble（设计作品社区）', url: 'https://dribbble.com/', source: '行业社区', note: '设计作品灵感平台', kind: 'community' },

      { title: '产品设计与开发（SPOC）', url: 'https://www.icourse163.org/course/SAU-1462568166', source: '中国大学MOOC', note: '鞋品开发流程与用户需求方法' },
    ],
    videos: [
      { title: 'edX: Fashion（时尚专题）', url: 'https://www.edx.org/learn/fashion', source: 'edX', note: '英文，时尚产品设计基础' },
    ],
  },
  '法律培训师': {
    videos: [
      { title: 'edX: Law（法律专题）', url: 'https://www.edx.org/learn/law', source: 'edX', note: '英文，法律基础课程' },
    ],
    docs: [
      { title: '法律职业伦理（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1471612169', source: '中国大学MOOC', note: '律师/法官/检察官职业伦理系统课' },
      { title: 'reddit · r/law', url: 'https://www.reddit.com/r/law/', source: '行业社区', note: '法律界综合讨论社区', kind: 'community' },
    ],
    books: [
      { title: '洞穴奇案', author: '彼得·萨伯', why: '法律思维训练的经典思想实验' },
      { title: '法治及其本土资源', author: '苏力', why: '理解中国法治语境的必读书' },
    ],
  },
  '直播带货运营': {
    books: [
      { title: '流量池', author: '杨飞', why: '直播带货的流量方法论' },
      { title: '超级转化率', author: '陈勇', why: '直播转化的实操' }
    ],
    docs: [
      { title: 'reddit · r/socialmedia', url: 'https://www.reddit.com/r/socialmedia/', source: '行业社区', note: '社媒直播讨论社区', kind: 'community' },

      { title: '电子商务理论与实务', url: 'https://www.icourse163.org/course/SZJM-1001754213', source: '中国大学MOOC', note: '含直播营销与平台运营模块' }
    ],
    videos: [
      { title: '直播话术实战训练营', url: 'https://www.bilibili.com/video/BV1Gu6zYrEX9', source: 'Bilibili', note: '直播话术与转化实战' },


    ],
  },
  '零售店长': {
    books: [
      { title: '零售的哲学', author: '铃木敏文', why: '7-Eleven经营哲学' },
      { title: '一胜九败', author: '柳井正', why: '优衣库零售创业史' },
    ],
    docs: [
      { title: 'reddit · r/retail', url: 'https://www.reddit.com/r/retail/', source: '行业社区', note: '零售从业全球社区', kind: 'community' },

      { title: '零售管理（首都经济贸易大学）', url: 'https://www.icourse163.org/course/CUEB-1207116816', source: '中国大学MOOC', note: '零售运营与门店管理的标准课程' },
    ],
    videos: [
      { title: 'edX: Retail（零售专题）', url: 'https://www.edx.org/learn/retail', source: 'edX', note: '英文，零售运营与门店管理' },
    ],
  },
  '医药销售': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '医药推广的说服根基' },
      { title: '别独自用餐', author: '基思·法拉奇', why: '人脉与客户关系' },
    ],
    videos: [
      { title: '医药代表新手上路：如何正确理解医药代表', url: 'https://www.bilibili.com/video/BV1vVJHzQEaw', source: 'Bilibili', note: '医药代表入行课' },
    ],
    docs: [
      { title: 'reddit · r/advertising', url: 'https://www.reddit.com/r/advertising/', source: '行业社区', note: '广告社区', kind: 'community' },

      { title: '国家药品监督管理局药品信息', url: 'https://www.nmpa.gov.cn/yaopin/ypjgdt/index.html', source: '官方文档', note: '药品监管与行业动态' },
    ],
  },
  '保险经纪人': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '保险营销的心理根基' },
      { title: '穷查理宝典', author: '查理·芒格', why: '风险与决策的智慧' },
    ],
    videos: [
      { title: 'edX: Insurance（保险专题）', url: 'https://www.edx.org/learn/insurance', source: 'edX', note: '英文，保险原理与风险管理' },
    ],
    docs: [
      { title: 'reddit · r/advertising', url: 'https://www.reddit.com/r/advertising/', source: '行业社区', note: '广告社区', kind: 'community' },

      { title: '国家金融监督管理总局', url: 'https://www.nfra.gov.cn', source: '官方文档', note: '保险监管政策与法规发布' },
    ],
  },
  '外贸业务员': {
    books: [
      { title: '世界是平的', author: '托马斯·弗里德曼', why: '外贸全球化的背景' },
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '外贸谈判说服' },
    ],
    videos: [
      { title: 'edX: International Trade（国际贸易专题）', url: 'https://www.edx.org/learn/international-trade', source: 'edX', note: '英文，国际贸易流程基础' },
    ],
    docs: [
      { title: 'reddit · r/business', url: 'https://www.reddit.com/r/business/', source: '行业社区', note: '商业社区', kind: 'community' },

      { title: '商务部', url: 'https://www.mofcom.gov.cn', source: '官方文档', note: '对外贸易政策与统计信息' },
    ],
  },
};
