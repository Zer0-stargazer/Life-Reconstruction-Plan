import type { CareerResourceSet } from '../career-resources';

export const educationResources: Record<string, CareerResourceSet> = {
  '在线教育创业者': {
    videos: [{ title: 'Entrepreneurship（Coursera 创业课程）', url: 'https://www.coursera.org/learn/entrepreneurship', source: 'Coursera' }],
    docs: [
      { title: 'reddit · r/edtech', url: 'https://www.reddit.com/r/edtech/', source: '行业社区', note: '教育科技全球社区', kind: 'community' },
{ title: '中华人民共和国教育部（教育政策与行业规范查询）', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
{ title: '精益创业', author: 'Eric Ries', why: '低成本验证产品假设，适合在线教育产品试错与迭代' }],
  },
  '教育科技产品经理': {
    videos: [
      { title: '产品经理案例分析：全面剖析在线教育行业', url: 'https://www.bilibili.com/video/BV1fb411x7Sq', source: 'Bilibili', note: '在线教育产品案例课' },
    ],
    docs: [
      { title: 'reddit · r/edtech', url: 'https://www.reddit.com/r/edtech/', source: '行业社区', note: '教育科技全球社区', kind: 'community' },
{ title: '国家中小学智慧教育平台（教育数字资源参考）', url: 'https://basic.smartedu.cn/', source: '官方文档' }],
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
{ title: '启示录：打造用户喜爱的科技产品', author: 'Marty Cagan', why: '硅谷产品方法论经典，适合从0到1设计学习类产品' }],
  },
  '特殊教育教师': {
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '个别化教育的经典指南' },
      { title: '正面管教', author: '简·尼尔森', why: '行为支持与正向引导的方法' }
    ],
    videos: [
      { title: '自闭症儿童语言沟通康复干预实操', url: 'https://www.bilibili.com/video/BV1Ha4y1x7nZ', source: 'Bilibili', note: '特教康复实操课' }
    ],
    docs: [
      { title: '走进特殊教育（豫章师范学院）', url: 'https://higher.smartedu.cn/course/630e90ad1fdc0303f43acc66', source: '国家高等教育智慧教育平台', note: '融合教育与个别化教育' },

      { title: 'reddit · r/SpecialEducation', url: 'https://www.reddit.com/r/SpecialEducation/', source: '行业社区', note: '特殊教育全球社区', kind: 'community' }
    ],
  },
  '职业培训师': {
    books: [
      { title: '演讲的力量', author: '克里斯·安德森', why: '公开表达的经典方法论' },
      { title: '学会提问', author: '尼尔·布朗', why: '批判性思维的入门经典' },
    ],
    docs: [
      { title: 'reddit · r/humanresources', url: 'https://www.reddit.com/r/humanresources/', source: '行业社区', note: '培训与人才发展社区', kind: 'community' },

      { title: '课程与教学论（陕西师范大学·一流课程）', url: 'https://www.icourse163.org/course/0401SNNU016-1205775805', source: '中国大学MOOC', note: '培训课程设计的教学论根基' },
    ],
    videos: [
      { title: 'TTT系列：培训的基本原理与培训师职业特征', url: 'https://www.bilibili.com/video/BV1p7411273C', source: 'Bilibili', note: 'TTT 培训师系统课' },
    ],
  },
  'STEM教育导师': {
    books: [
      { title: '终身幼儿园', author: '米切尔·雷斯尼克', why: '创造力教育的方法论（Scratch之父）' },
      { title: 'Python编程：从入门到实践', author: '埃里克·马瑟斯', why: '编程教学的标准入门书' },
    ],
    videos: [{ title: 'Khan Academy 计算机编程课程', url: 'https://www.khanacademy.org/computing/computer-programming', source: 'Khan Academy' }],
    docs: [
      { title: 'reddit · r/Parenting', url: 'https://www.reddit.com/r/Parenting/', source: '行业社区', note: '家庭教育社区', kind: 'community' },
{ title: 'Code.org 免费编程与计算机科学课程', url: 'https://code.org/', source: '官方文档' }],
  },
  '早教教师': {
    books: [
      { title: '正面管教', author: '简·尼尔森', why: '幼儿正向引导的经典' },
      { title: '童年的秘密', author: '玛丽亚·蒙台梭利', why: '蒙氏教育的理论原点' },
    ],
    docs: [
      { title: 'reddit · r/ECEProfessionals', url: 'https://www.reddit.com/r/ECEProfessionals/', source: '行业社区', note: '幼教从业者全球社区', kind: 'community' },

      { title: '学前教育学', url: 'https://www.icourse163.org/course/-1002527012', source: '中国大学MOOC', note: '学前教育专业的核心主干课' },
    ],
    videos: [{ title: 'Child Development（Coursera 儿童发展课程）', url: 'https://www.coursera.org/learn/child-development', source: 'Coursera' }],
  },
  '教育咨询师': {
    books: [
      { title: '人生设计课', author: '比尔·博内特', why: '斯坦福生涯设计方法论' },
      { title: '远见', author: '布莱恩·费瑟斯通豪', why: '职业生涯三阶段规划' },
    ],
    videos: [
      { title: '从零开始的日本留学说明书', url: 'https://www.bilibili.com/video/BV1DMQDYcEQ5', source: 'Bilibili', note: '留学申请全流程' },
    ],
    docs: [
      { title: 'reddit · r/gradadmissions', url: 'https://www.reddit.com/r/gradadmissions/', source: '行业社区', note: '研究生申请全球社区', kind: 'community' },
{ title: 'O*NET OnLine（美国职业信息数据库）', url: 'https://www.onetonline.org', source: '官方文档' }],
  },
  '家庭教师': {
    books: [
      { title: '非暴力沟通', author: '马歇尔·卢森堡', why: '亲子与家庭沟通的经典' },
      { title: '如何说孩子才会听，怎么听孩子才肯说', author: '阿黛尔·法伯', why: '亲子话术的实操经典' }
    ],
    videos: [{ title: 'Khan Academy（免费学科课程）', url: 'https://www.khanacademy.org/', source: 'Khan Academy' }],
    docs: [
      { title: '心理学（华南师范大学）', url: 'https://higher.smartedu.cn/course/630555451fdc0303f43ab860', source: '国家高等教育智慧教育平台', note: '发展心理与教育教学应用' },

      { title: 'reddit · r/instructionaldesign', url: 'https://www.reddit.com/r/instructionaldesign/', source: '行业社区', note: '教学设计社区', kind: 'community' }
    ],
  },
  '家庭教育指导师': {
    videos: [{ title: 'Child Development（Coursera 儿童发展课程）', url: 'https://www.coursera.org/learn/child-development', source: 'Coursera' }],
    docs: [
      { title: '心理学（华南师范大学）', url: 'https://higher.smartedu.cn/course/630555451fdc0303f43ab860', source: '国家高等教育智慧教育平台', note: '发展心理与教育教学应用' },

      { title: 'reddit · r/Professors', url: 'https://www.reddit.com/r/Professors/', source: '行业社区', note: '高校教师社区', kind: 'community' }
    ],
    books: [
      { title: '非暴力沟通', author: '马歇尔·卢森堡', why: '亲子与家庭沟通的经典' },
{ title: '正面管教', author: 'Jane Nelsen', why: '以尊重且坚定的方式与孩子沟通，家长指导入门经典' }],
  },
  '国际学校教师': {
    books: [
      { title: '英语教学法教程', author: '王蔷', why: '语言教学法的标准教材' },
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '课堂教学的经典指南' },
    ],
    videos: [{ title: 'edX 全部课程', url: 'https://www.edx.org/', source: 'edX' }],
    docs: [
      { title: 'reddit · r/TEFL', url: 'https://www.reddit.com/r/TEFL/', source: '行业社区', note: '英语教学全球社区', kind: 'community' },
{ title: 'UNESCO 教育专题（国际教育政策）', url: 'https://www.unesco.org/en/education', source: '官方文档' }],
  },
  '考研辅导老师': {
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '辅导教学的经典指南' },
      { title: '刻意练习', author: '安德斯·艾利克森', why: '高效训练设计的方法论' },
    ],
    videos: [{ title: '中国大学MOOC（公开课程库）', url: 'https://www.icourse163.org/', source: '中国大学MOOC' }],
    docs: [
      { title: 'reddit · r/Teachers', url: 'https://www.reddit.com/r/Teachers/', source: '行业社区', note: '中小学教师全球社区', kind: 'community' },
{ title: '中国教育考试网（研究生考试信息）', url: 'https://www.neea.edu.cn', source: '官方文档' }],
  },
  '学习教练': {
    docs: [
      { title: 'reddit · r/getdisciplined', url: 'https://www.reddit.com/r/getdisciplined/', source: '行业社区', note: '学习方法与自律社区', kind: 'community' },

      { title: '批判性思维（华中科技大学）', url: 'https://higher.smartedu.cn/course/690bbc735345b6821479951f', source: '智慧教育平台', note: '思维训练是学习指导的方法论根基' },
    ],
    videos: [{ title: 'Learning How to Learn（Coursera 学习方法课程）', url: 'https://www.coursera.org/learn/learning-how-to-learn', source: 'Coursera' }],
    books: [
      { title: '刻意练习', author: '安德斯·艾利克森', why: '教练式训练的科学根基' },
{ title: '学习之道', author: 'Barbara Oakley', why: '用认知科学解释学习方法，适合学习教练入门理论' }],
  },
  '教育博主': {
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
      { title: '精益创业', author: '埃里克·莱斯', why: '教育产品验证的方法论' },
    ],
    videos: [
      { title: '知识付费全链路拆解', url: 'https://www.bilibili.com/video/BV1sZBuYzEQw', source: 'Bilibili', note: '知识付费商业模式' },
    ],
    docs: [
      { title: '芥末堆（教育行业媒体）', url: 'https://www.jiemodui.com/', source: '行业社区', note: '教育产业资讯与行业社区', kind: 'community' },
{ title: 'TED 演讲平台（表达与内容参考）', url: 'https://www.ted.com', source: '官方文档' }],
  },
  '研学导师': {
    books: [
      { title: '追求理解的教学设计', author: '格兰特·威金斯', why: 'UbD 逆向设计的经典' },
      { title: '林间最后的小孩', author: '理查德·洛夫', why: '自然教育的奠基之作' },
    ],
    videos: [
      { title: '一个视频看懂 PBL 项目式学习', url: 'https://www.bilibili.com/video/BV1Sa411a7pg', source: 'Bilibili', note: 'PBL 方法论入门' },
    ],
    docs: [
      { title: 'reddit · r/museums', url: 'https://www.reddit.com/r/museums/', source: '行业社区', note: '博物馆教育社区', kind: 'community' },
{ title: 'National Geographic Education（自然与地理教育资源）', url: 'https://www.nationalgeographic.org/', source: '官方文档' }],
  },
  '少儿编程老师': {
    books: [
      { title: '终身幼儿园', author: '米切尔·雷斯尼克', why: '创造力教育的方法论（Scratch之父）' },
      { title: 'Python编程：从入门到实践', author: '埃里克·马瑟斯', why: '编程教学的标准入门书' },
    ],
    videos: [{ title: 'Khan Academy 计算机编程课程', url: 'https://www.khanacademy.org/computing/computer-programming', source: 'Khan Academy' }],
    docs: [
      { title: 'reddit · r/Parenting', url: 'https://www.reddit.com/r/Parenting/', source: '行业社区', note: '家庭教育社区', kind: 'community' },

      { title: 'Code.org 免费编程课程', url: 'https://code.org/', source: '官方文档' },
      { title: 'Python 官方教程', url: 'https://docs.python.org/3/tutorial/', source: '官方文档' },
    ],
  },
  'MBA考前辅导': {
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '辅导教学的经典指南' },
      { title: '刻意练习', author: '安德斯·艾利克森', why: '高效训练设计的方法论' },
    ],
    videos: [
      { title: '教案模版：教学设计怎么写', url: 'https://www.bilibili.com/video/BV1Wt4y1r7mX', source: 'Bilibili', note: '教案写作基本功' },
    ],
    docs: [
      { title: 'reddit · r/education', url: 'https://www.reddit.com/r/education/', source: '行业社区', note: '教育综合社区', kind: 'community' },
{ title: 'GMAT 官方（MBA 入学考试 mba.com）', url: 'https://www.mba.com/', source: '官方文档' }],
  },
  'K12辅导老师': {
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '辅导教学的经典指南' },
      { title: '刻意练习', author: '安德斯·艾利克森', why: '高效训练设计的方法论' },
    ],
    videos: [{ title: 'Khan Academy（K12 学科课程）', url: 'https://www.khanacademy.org/', source: 'Khan Academy' }],
    docs: [
      { title: 'reddit · r/Teachers', url: 'https://www.reddit.com/r/Teachers/', source: '行业社区', note: '中小学教师全球社区', kind: 'community' },
{ title: '中华人民共和国教育部', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
  },
  '托福/雅思培训师': {
    books: [
      { title: '英语教学法教程', author: '王蔷', why: '语言教学法的标准教材' },
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '课堂教学的经典指南' },
    ],
    videos: [
      { title: '北语对外汉语示范课：初级汉语综合课', url: 'https://www.bilibili.com/video/BV1ra411A7My', source: 'Bilibili', note: '语言课堂教学示范' },
    ],
    docs: [
      { title: 'reddit · r/languagelearning', url: 'https://www.reddit.com/r/languagelearning/', source: '行业社区', note: '语言学习全球社区', kind: 'community' },
{ title: 'ETS TOEFL 官方网站', url: 'https://www.ets.org/toefl.html', source: '官方文档' }],
  },
  '高考志愿规划师': {
    books: [
      { title: '人生设计课', author: '比尔·博内特', why: '斯坦福生涯设计方法论' },
      { title: '远见', author: '布莱恩·费瑟斯通豪', why: '职业生涯三阶段规划' },
    ],
    videos: [
      { title: '从零开始的日本留学说明书', url: 'https://www.bilibili.com/video/BV1DMQDYcEQ5', source: 'Bilibili', note: '留学申请全流程' },
    ],
    docs: [
      { title: 'reddit · r/gradadmissions', url: 'https://www.reddit.com/r/gradadmissions/', source: '行业社区', note: '研究生申请全球社区', kind: 'community' },
{ title: '中国教育考试网（高考政策与信息）', url: 'https://www.neea.edu.cn', source: '官方文档' }],
  },
  '儿童情商培训师': {
    books: [
      { title: '非暴力沟通', author: '马歇尔·卢森堡', why: '亲子与家庭沟通的经典' },
      { title: '如何说孩子才会听，怎么听孩子才肯说', author: '阿黛尔·法伯', why: '亲子话术的实操经典' },
    ],
    videos: [
      { title: 'BBC儿童哲学思维训练：什么决定我是我', url: 'https://www.bilibili.com/video/BV1uR4y1T7CU', source: 'Bilibili', note: '儿童哲学启蒙素材' },
    ],
    docs: [
      { title: 'reddit · r/homeschool', url: 'https://www.reddit.com/r/homeschool/', source: '行业社区', note: '家庭教学社区', kind: 'community' },
{ title: 'American Psychological Association（美国心理学会）', url: 'https://www.apa.org', source: '官方文档' }],
  },
  '青少儿编程讲师': {
    books: [
      { title: '终身幼儿园', author: '米切尔·雷斯尼克', why: '创造力教育的方法论（Scratch之父）' },
      { title: 'Python编程：从入门到实践', author: '埃里克·马瑟斯', why: '编程教学的标准入门书' },
    ],
    videos: [{ title: 'Khan Academy 计算机编程课程', url: 'https://www.khanacademy.org/computing/computer-programming', source: 'Khan Academy' }],
    docs: [
      { title: 'reddit · r/Parenting', url: 'https://www.reddit.com/r/Parenting/', source: '行业社区', note: '家庭教育社区', kind: 'community' },
{ title: 'Code.org 免费编程课程', url: 'https://code.org/', source: '官方文档' }],
  },
  '家庭教育讲师': {
    videos: [
      { title: 'BBC儿童哲学思维训练：什么决定我是我', url: 'https://www.bilibili.com/video/BV1uR4y1T7CU', source: 'Bilibili', note: '儿童哲学启蒙素材' }
    ],
    docs: [
      { title: '心理学（华南师范大学）', url: 'https://higher.smartedu.cn/course/630555451fdc0303f43ab860', source: '国家高等教育智慧教育平台', note: '发展心理与教育教学应用' },

      { title: 'reddit · r/Professors', url: 'https://www.reddit.com/r/Professors/', source: '行业社区', note: '高校教师社区', kind: 'community' }
    ],
    books: [
      { title: '非暴力沟通', author: '马歇尔·卢森堡', why: '亲子与家庭沟通的经典' },
{ title: '正面管教', author: 'Jane Nelsen', why: '家庭教育理念的经典入门，适合讲师备课参考' }],
  },
  '自然教育导师': {
    videos: [
      { title: '一个视频看懂 PBL 项目式学习', url: 'https://www.bilibili.com/video/BV1Sa411a7pg', source: 'Bilibili', note: 'PBL 方法论入门' },
    ],
    docs: [
      { title: 'reddit · r/instructionaldesign', url: 'https://www.reddit.com/r/instructionaldesign/', source: '行业社区', note: '教学设计社区', kind: 'community' },
{ title: 'National Geographic Education（自然教育资源）', url: 'https://www.nationalgeographic.org/', source: '官方文档' }],
    books: [
      { title: '追求理解的教学设计', author: '格兰特·威金斯', why: 'UbD 逆向设计的经典' },
{ title: '林间的最后一个孩子', author: 'Richard Louv', why: '提出“自然缺失症”概念，自然教育理念的奠基之作' }],
  },
  '教育公平研究员': {
    books: [
      { title: '人生设计课', author: '比尔·博内特', why: '斯坦福生涯设计方法论' },
      { title: '远见', author: '布莱恩·费瑟斯通豪', why: '职业生涯三阶段规划' },
    ],
    videos: [
      { title: '韩国留学申请全攻略（DIY）', url: 'https://www.bilibili.com/video/BV1vt4y1b7NK', source: 'Bilibili', note: '留学DIY实操' },
    ],
    docs: [
      { title: 'reddit · r/ApplyingToCollege', url: 'https://www.reddit.com/r/ApplyingToCollege/', source: '行业社区', note: '升学规划社区', kind: 'community' },

      { title: 'UNESCO 教育专题', url: 'https://www.unesco.org/en/education', source: '官方文档' },
      { title: 'OECD 教育专题（国际教育数据与政策）', url: 'https://www.oecd.org/en/topics/education.html', source: '官方文档' },
    ],
  },
  '高考改革研究员': {
    books: [
      { title: '人生设计课', author: '比尔·博内特', why: '斯坦福生涯设计方法论' },
      { title: '远见', author: '布莱恩·费瑟斯通豪', why: '职业生涯三阶段规划' }
    ],
    videos: [
      { title: '韩国留学申请全攻略（DIY）', url: 'https://www.bilibili.com/video/BV1vt4y1b7NK', source: 'Bilibili', note: '留学DIY实操' }
    ],
    docs: [
      { title: '课程与教学论（陕西师范大学）', url: 'https://higher.smartedu.cn/course/66df7d71711dc30c34c4e732', source: '国家高等教育智慧教育平台', note: '课程设计与教学评价原理' },

      { title: 'reddit · r/ApplyingToCollege', url: 'https://www.reddit.com/r/ApplyingToCollege/', source: '行业社区', note: '升学规划社区', kind: 'community' }
    ],
  },
  'AI教育应用研究员': {
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
      { title: '精益创业', author: '埃里克·莱斯', why: '教育产品验证的方法论' },
    ],
    videos: [
      { title: '30万粉知识付费变现近1000万', url: 'https://www.bilibili.com/video/BV1mFwjz5E6E', source: 'Bilibili', note: '知识IP变现案例' },
    ],
    docs: [
      { title: '芥末堆（教育行业媒体）', url: 'https://www.jiemodui.com/', source: '行业社区', note: '教育产业资讯与行业社区', kind: 'community' },
{ title: 'UNESCO 教育专题（AI 与教育政策）', url: 'https://www.unesco.org/en/education', source: '官方文档' }],
  },
  '语言康复治疗师': {
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '个别化教育的经典指南' },
      { title: '正面管教', author: '简·尼尔森', why: '行为支持与正向引导的方法' },
    ],
    videos: [
      { title: '自闭症儿童语言沟通康复干预实操', url: 'https://www.bilibili.com/video/BV1Ha4y1x7nZ', source: 'Bilibili', note: '特教康复实操课' },
    ],
    docs: [
      { title: 'reddit · r/SpecialEducation', url: 'https://www.reddit.com/r/SpecialEducation/', source: '行业社区', note: '特殊教育全球社区', kind: 'community' },
{ title: 'ASHA 美国言语听力协会（言语康复标准）', url: 'https://www.asha.org', source: '官方文档' }],
  },
  '批判性思维培训师': {
    docs: [
      { title: 'reddit · r/education', url: 'https://www.reddit.com/r/education/', source: '行业社区', note: '思维教育讨论社区', kind: 'community' },

      { title: '逻辑与批判性思维', url: 'https://www.icourse163.org/course/cid=1450791232', source: '中国大学MOOC', note: '论证分析与批判性思维训练课' },
    ],
    videos: [{ title: 'Computational Thinking for Problem Solving（Coursera）', url: 'https://www.coursera.org/learn/computational-thinking-problem-solving', source: 'Coursera' }],
    books: [
      { title: '学会提问', author: '尼尔·布朗', why: '批判性提问的经典框架' },
{ title: '思考，快与慢', author: 'Daniel Kahneman', why: '解释直觉与推理的双系统机制，批判性思维训练的心理基础' }],
  },
  '财商教育讲师': {
    docs: [
      { title: 'reddit · r/TEFL', url: 'https://www.reddit.com/r/TEFL/', source: '行业社区', note: '英语教学社区', kind: 'community' },

      { title: '钱小小理财记（深圳职业技术大学）', url: 'https://www.icourse163.org/course/SZPT-1464807175', source: '中国大学MOOC', note: '儿童财经素养的课程范本' },
    ],
    videos: [{ title: 'Financial Planning（Coursera 个人理财课程）', url: 'https://www.coursera.org/learn/financial-planning', source: 'Coursera' }],
    books: [
      { title: '小狗钱钱', author: '博多·舍费尔', why: '儿童财商教育的第一书' },
{ title: '穷爸爸富爸爸', author: 'Robert T. Kiyosaki', why: '财商启蒙的畅销入门读物，适合理解资产与负债思维' }],
  },
  'PBL项目制学习导师': {
    books: [
      { title: '追求理解的教学设计', author: '格兰特·威金斯', why: 'UbD 逆向设计的经典' },
      { title: '林间最后的小孩', author: '理查德·洛夫', why: '自然教育的奠基之作' },
    ],
    docs: [
      { title: 'reddit · r/museums', url: 'https://www.reddit.com/r/museums/', source: '行业社区', note: '博物馆教育社区', kind: 'community' },
{ title: 'Buck Institute for Education（项目式学习 PBL 权威机构）', url: 'https://www.bie.org/', source: '官方文档' }],
    videos: [{ title: 'Edutopia（项目式学习实践案例）', url: 'https://www.edutopia.org/', source: 'Edutopia' }],
  },
  '体育教练': {
    books: [
      { title: '运动训练学', author: '田麦久', why: '训练学的标准教材' },
      { title: '运动改造大脑', author: '约翰·瑞迪', why: '运动科学的科普经典' },
    ],
    videos: [
      { title: '800米/1000米攻略（体育硕士划重点）', url: 'https://www.bilibili.com/video/BV1CA41187FQ', source: 'Bilibili', note: '体能训练方法课' },
    ],
    docs: [
      { title: 'reddit · r/ECEProfessionals', url: 'https://www.reddit.com/r/ECEProfessionals/', source: '行业社区', note: '幼教社区', kind: 'community' },
{ title: 'ACSM 美国运动医学学会（运动科学标准）', url: 'https://www.acsm.org', source: '官方文档' }],
  },
  '美术教师': {
    docs: [
      { title: 'reddit · r/musiced', url: 'https://www.reddit.com/r/musiced/', source: '行业社区', note: '音乐教育全球社区', kind: 'community' },

      { title: '中学音乐教学论', url: 'https://www.icourse163.org/course/cid=1450387186', source: '中国大学MOOC', note: '音乐课程与教学法的学科教学论' },
    ],
    videos: [
      { title: '奥尔夫音乐整套课程', url: 'https://www.bilibili.com/video/BV11P4y1c7jP', source: 'Bilibili', note: '奥尔夫教学法实操' },
    ],
    books: [
      { title: '音乐教育的哲学', author: '贝内特·雷默', why: '音乐教育的理论经典' },
{ title: '艺术的故事', author: 'E. H. Gombrich', why: '西方艺术史经典通识读物，美术教学的常备参考' }],
  },
};
