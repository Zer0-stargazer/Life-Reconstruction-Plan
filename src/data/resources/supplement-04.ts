import type { CareerResourceSet } from '../career-resources';

export const supplementResources04: Record<string, CareerResourceSet> = {
  '留学规划师': {
    books: [
      { title: '人生设计课', author: '比尔·博内特', why: '斯坦福生涯设计方法论' },
      { title: '远见', author: '布莱恩·费瑟斯通豪', why: '职业生涯三阶段规划' },
    ],
    videos: [
      { title: '从零开始的日本留学说明书', url: 'https://www.bilibili.com/video/BV1DMQDYcEQ5', source: 'Bilibili', note: '留学申请全流程' },
    ],
    docs: [
      { title: 'reddit · r/gradadmissions', url: 'https://www.reddit.com/r/gradadmissions/', source: '行业社区', note: '研究生申请全球社区', kind: 'community' },

      { title: '中国留学服务网（教育部留学服务中心）', url: 'https://www.cscse.edu.cn/', source: '官方文档', note: '留学政策、学历认证与院校信息的官方入口' },
      { title: 'ETS TOEFL 官方页面', url: 'https://www.ets.org/toefl.html', source: 'ETS', note: '托福考试官方信息，规划语言成绩时参考' },
    ],
  },
  '园林设计师': {
    books: [
      { title: '从概念到形式', author: '格兰特·里德', why: '景观方案落地的经典方法论' },
      { title: '设计结合自然', author: '伊恩·麦克哈格', why: '生态规划的开山之作' },
    ],
    videos: [
      { title: '景观彩平基础系统教程', url: 'https://www.bilibili.com/video/BV1Cq4y1W7CK', source: 'Bilibili', note: '景观彩图表现基本功' },
    ],
    docs: [
      { title: 'Behance（Adobe 作品社区）', url: 'https://www.behance.net/', source: '行业社区', note: '全球设计作品平台', kind: 'community' },

      { title: '中国风景园林学会', url: 'https://www.chsla.org.cn/', source: '行业协会', note: '行业标准、学术活动与从业资讯' },
      { title: '住房和城乡建设部', url: 'https://www.mohurd.gov.cn', source: '官方文档', note: '城市绿地与园林相关规范、政策入口' },
    ],
  },
  '珠宝设计师': {
    books: [
      { title: '艺术·设计的立体构成', author: '朝仓直巳', why: '首饰立体形态的基础训练' },
      { title: '色彩与光线', author: '詹姆斯·格尔尼', why: '宝石光泽与质感的表现理论' },
    ],
    videos: [
      { title: '零基础自学珠宝设计入门到精通', url: 'https://www.bilibili.com/video/BV1Aq4y1X71P', source: 'Bilibili', note: '珠宝手绘设计课' },
    ],
    docs: [
      { title: 'reddit · r/graphic_design', url: 'https://www.reddit.com/r/graphic_design/', source: '行业社区', note: '平面设计社区', kind: 'community' },

      { title: 'GIA 美国宝石学院', url: 'https://www.gia.edu/', source: 'GIA', note: '宝石学与钻石分级的权威机构，学习材质知识的起点' },
    ],
  },
  '房地产经纪人': {
    books: [
      { title: '销售中的心理学', author: '博恩·崔西', why: '经纪人的销售心理' },
      { title: '谈判力', author: '罗杰·费希尔', why: '带看与议价的谈判框架' },
    ],
    videos: [
      { title: '30天从入门新人到销售精英：房产中介系列', url: 'https://www.bilibili.com/video/BV1rD4y1S7Jo', source: 'Bilibili', note: '房产中介成长课' },
    ],
    docs: [
      { title: 'reddit · r/realtors', url: 'https://www.reddit.com/r/realtors/', source: '行业社区', note: '房产经纪全球社区', kind: 'community' },

      { title: '住房和城乡建设部', url: 'https://www.mohurd.gov.cn', source: '官方文档', note: '房地产交易与经纪行业管理政策入口（信息较宽泛，需自行筛选）' },
    ],
  },
  '二手车评估师': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '二手车销售心理' },
      { title: '认识商业', author: '尼克尔斯', why: '汽车流通的商业通识' },
    ],
    videos: [
      { title: '二手车评估师继续教育培训', url: 'https://www.bilibili.com/video/BV12a411A7jY', source: 'Bilibili', note: '二手车评估考证课' },
    ],
    docs: [
      { title: 'reddit · r/askcarsales', url: 'https://www.reddit.com/r/askcarsales/', source: '行业社区', note: '汽车销售问答社区', kind: 'community' },

      { title: '商务部', url: 'https://www.mofcom.gov.cn', source: '官方文档', note: '二手车流通与交易政策入口（页面较宽泛，需自行检索）' },
    ],
  },
  '茶艺师': {
    books: [
      { title: '茶经', author: '陆羽', why: '茶文化的原典' },
      { title: '茶之书', author: '冈仓天心', why: '茶道美学的经典' }
    ],
    videos: [
      { title: '茶艺教程（全15讲）', url: 'https://www.bilibili.com/video/BV1KP411V7eH', source: 'Bilibili', note: '茶艺系统课' }
    ],
    docs: [
      { title: '茶艺（宁波城市职业技术学院）', url: 'https://higher.smartedu.cn/course/66e615f9711dc30c34e2eb24', source: '国家高等教育智慧教育平台', note: '茶艺师职业等级考核对接课' },

      { title: 'reddit · r/tea', url: 'https://www.reddit.com/r/tea/', source: '行业社区', note: '茶文化全球社区', kind: 'community' }
    ],
  },
  '家教平台运营': {
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育模式的经典' },
      { title: '精益创业', author: '埃里克·莱斯', why: '平台冷启动的方法论' },
    ],
    videos: [
      { title: '直播运营零基础入门课', url: 'https://www.bilibili.com/video/BV1T4WVeKEtr', source: 'Bilibili', note: '平台流量运营入门' },
    ],
    docs: [
      { title: 'reddit · r/fitness', url: 'https://www.reddit.com/r/fitness/', source: '行业社区', note: '健身社区', kind: 'community' },

      { title: '教育部', url: 'https://www.moe.gov.cn', source: '官方文档', note: '校外培训与课外辅导相关政策入口，运营前必须了解合规要求' },
    ],
  },
  '直播电商操盘手': {
    books: [
      { title: '流量池', author: '杨飞', why: '直播带货的流量方法论' },
      { title: '超级转化率', author: '陈勇', why: '直播转化的实操' }
    ],
    videos: [
      { title: '直播带货怎么做：直播自然流打法教程', url: 'https://www.bilibili.com/video/BV1zo1VBDEcL', source: 'Bilibili', note: '直播带货打法课' }
    ],
    docs: [
      { title: '新媒体电商（直播与社群运营）', url: 'https://www.icourse163.org/course/detail.htm?cid=1206624824', source: '中国大学MOOC', note: '直播电商与社群转化实操' },

      { title: 'reddit · r/socialmedia', url: 'https://www.reddit.com/r/socialmedia/', source: '行业社区', note: '社媒直播讨论社区', kind: 'community' }
    ],
  },
  '初级生物信息学家': {
    docs: [
      { title: '小木虫（科研社区）', url: 'https://muchong.com/', source: '行业社区', note: '生信与科研问答社区', kind: 'community' },

      { title: '生物信息学（山东大学）', url: 'https://www.icourse163.org/course/SDU-1001907001', source: '中国大学MOOC', note: '国家精品生信课，序列到组学全流程' },
    ],
    videos: [
      { title: 'Coursera: Bioinformatics Specialization（生物信息学专项课程）', url: 'https://www.coursera.org/specializations/bioinformatics', source: 'Coursera', note: '英文，从序列分析到基因组学的系统入门' },
      { title: 'edX: Bioinformatics（生物信息学）', url: 'https://www.edx.org/learn/bioinformatics', source: 'edX', note: '英文，生物信息学基础概念与工具' },
      { title: 'Coursera: DNA Sequencing（DNA 测序）', url: 'https://www.coursera.org/learn/dna-sequencing', source: 'Coursera', note: '英文，测序数据的生物学背景与分析思路' },
    ],
    books: [
      { title: '生物信息学', author: '樊龙江', why: '生信方法与应用的体系教材' },

      { title: 'Bioinformatics Algorithms: An Active Learning Approach（生物信息学算法：主动学习方法）', author: 'Phillip Compeau、Pavel Pevzner', why: '从算法角度讲解生物信息学，适合编程背景的入门者' },
    ],
  },
  '高级生物信息学家': {
    docs: [
      { title: '小木虫（科研社区）', url: 'https://muchong.com/', source: '行业社区', note: '生信与科研问答社区', kind: 'community' },

      { title: '生物信息学（山东大学）', url: 'https://www.icourse163.org/course/SDU-1001907001', source: '中国大学MOOC', note: '国家精品生信课，序列到组学全流程' },
    ],
    videos: [
      { title: 'Coursera: Bioinformatics Specialization（生物信息学专项课程）', url: 'https://www.coursera.org/specializations/bioinformatics', source: 'Coursera', note: '英文，可作为进阶前的系统复习' },
      { title: 'edX: Bioinformatics（生物信息学）', url: 'https://www.edx.org/learn/bioinformatics', source: 'edX', note: '英文，复习基础概念' },
    ],
    books: [
      { title: '生物信息学', author: '樊龙江', why: '生信方法与应用的体系教材' },

      { title: 'Bioinformatics Algorithms: An Active Learning Approach（生物信息学算法：主动学习方法）', author: 'Phillip Compeau、Pavel Pevzner', why: '算法层面的深入理解，适合进阶研究与工具开发' },
    ],
  },
};
