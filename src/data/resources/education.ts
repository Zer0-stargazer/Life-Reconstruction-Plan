import type { CareerResourceSet } from '../career-resources';

export const educationResources: Record<string, CareerResourceSet> = {
  '在线教育创业者': {
    videos: [{ title: 'Entrepreneurship（Coursera 创业课程）', url: 'https://www.coursera.org/learn/entrepreneurship', source: 'Coursera' }],
    docs: [{ title: '中华人民共和国教育部（教育政策与行业规范查询）', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
    books: [{ title: '精益创业', author: 'Eric Ries', why: '低成本验证产品假设，适合在线教育产品试错与迭代' }],
  },
  '教育科技产品经理': {
    docs: [{ title: '国家中小学智慧教育平台（教育数字资源参考）', url: 'https://basic.smartedu.cn/', source: '官方文档' }],
    books: [{ title: '启示录：打造用户喜爱的科技产品', author: 'Marty Cagan', why: '硅谷产品方法论经典，适合从0到1设计学习类产品' }],
  },
  '特殊教育教师': {
    docs: [{ title: '中华人民共和国教育部（特殊教育政策与文件）', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
  },
  '职业培训师': {
  },
  'STEM教育导师': {
    videos: [{ title: 'Khan Academy 计算机编程课程', url: 'https://www.khanacademy.org/computing/computer-programming', source: 'Khan Academy' }],
    docs: [{ title: 'Code.org 免费编程与计算机科学课程', url: 'https://code.org/', source: '官方文档' }],
  },
  '早教教师': {
    videos: [{ title: 'Child Development（Coursera 儿童发展课程）', url: 'https://www.coursera.org/learn/child-development', source: 'Coursera' }],
  },
  '教育咨询师': {
    docs: [{ title: 'O*NET OnLine（美国职业信息数据库）', url: 'https://www.onetonline.org', source: '官方文档' }],
  },
  '家庭教师': {
    videos: [{ title: 'Khan Academy（免费学科课程）', url: 'https://www.khanacademy.org/', source: 'Khan Academy' }],
    docs: [{ title: '中华人民共和国教育部', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
  },
  '家庭教育指导师': {
    videos: [{ title: 'Child Development（Coursera 儿童发展课程）', url: 'https://www.coursera.org/learn/child-development', source: 'Coursera' }],
    docs: [{ title: '中华人民共和国教育部', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
    books: [{ title: '正面管教', author: 'Jane Nelsen', why: '以尊重且坚定的方式与孩子沟通，家长指导入门经典' }],
  },
  '国际学校教师': {
    videos: [{ title: 'edX 全部课程', url: 'https://www.edx.org/', source: 'edX' }],
    docs: [{ title: 'UNESCO 教育专题（国际教育政策）', url: 'https://www.unesco.org/en/education', source: '官方文档' }],
  },
  '考研辅导老师': {
    videos: [{ title: '中国大学MOOC（公开课程库）', url: 'https://www.icourse163.org/', source: '中国大学MOOC' }],
    docs: [{ title: '中国教育考试网（研究生考试信息）', url: 'https://www.neea.edu.cn', source: '官方文档' }],
  },
  '学习教练': {
    videos: [{ title: 'Learning How to Learn（Coursera 学习方法课程）', url: 'https://www.coursera.org/learn/learning-how-to-learn', source: 'Coursera' }],
    books: [{ title: '学习之道', author: 'Barbara Oakley', why: '用认知科学解释学习方法，适合学习教练入门理论' }],
  },
  '教育博主': {
    docs: [{ title: 'TED 演讲平台（表达与内容参考）', url: 'https://www.ted.com', source: '官方文档' }],
  },
  '研学导师': {
    docs: [{ title: 'National Geographic Education（自然与地理教育资源）', url: 'https://www.nationalgeographic.org/', source: '官方文档' }],
  },
  '少儿编程老师': {
    videos: [{ title: 'Khan Academy 计算机编程课程', url: 'https://www.khanacademy.org/computing/computer-programming', source: 'Khan Academy' }],
    docs: [
      { title: 'Code.org 免费编程课程', url: 'https://code.org/', source: '官方文档' },
      { title: 'Python 官方教程', url: 'https://docs.python.org/3/tutorial/', source: '官方文档' },
    ],
  },
  'MBA考前辅导': {
    docs: [{ title: 'GMAT 官方（MBA 入学考试 mba.com）', url: 'https://www.mba.com/', source: '官方文档' }],
  },
  'K12辅导老师': {
    videos: [{ title: 'Khan Academy（K12 学科课程）', url: 'https://www.khanacademy.org/', source: 'Khan Academy' }],
    docs: [{ title: '中华人民共和国教育部', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
  },
  '托福/雅思培训师': {
    docs: [{ title: 'ETS TOEFL 官方网站', url: 'https://www.ets.org/toefl.html', source: '官方文档' }],
  },
  '高考志愿规划师': {
    docs: [{ title: '中国教育考试网（高考政策与信息）', url: 'https://www.neea.edu.cn', source: '官方文档' }],
  },
  '儿童情商培训师': {
    docs: [{ title: 'American Psychological Association（美国心理学会）', url: 'https://www.apa.org', source: '官方文档' }],
  },
  '青少儿编程讲师': {
    videos: [{ title: 'Khan Academy 计算机编程课程', url: 'https://www.khanacademy.org/computing/computer-programming', source: 'Khan Academy' }],
    docs: [{ title: 'Code.org 免费编程课程', url: 'https://code.org/', source: '官方文档' }],
  },
  '家庭教育讲师': {
    docs: [{ title: '中华人民共和国教育部', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
    books: [{ title: '正面管教', author: 'Jane Nelsen', why: '家庭教育理念的经典入门，适合讲师备课参考' }],
  },
  '自然教育导师': {
    docs: [{ title: 'National Geographic Education（自然教育资源）', url: 'https://www.nationalgeographic.org/', source: '官方文档' }],
    books: [{ title: '林间的最后一个孩子', author: 'Richard Louv', why: '提出“自然缺失症”概念，自然教育理念的奠基之作' }],
  },
  '教育公平研究员': {
    docs: [
      { title: 'UNESCO 教育专题', url: 'https://www.unesco.org/en/education', source: '官方文档' },
      { title: 'OECD 教育专题（国际教育数据与政策）', url: 'https://www.oecd.org/en/topics/education.html', source: '官方文档' },
    ],
  },
  '高考改革研究员': {
    docs: [{ title: '中华人民共和国教育部（考试招生政策）', url: 'https://www.moe.gov.cn/', source: '官方文档' }],
  },
  'AI教育应用研究员': {
    docs: [{ title: 'UNESCO 教育专题（AI 与教育政策）', url: 'https://www.unesco.org/en/education', source: '官方文档' }],
  },
  '语言康复治疗师': {
    docs: [{ title: 'ASHA 美国言语听力协会（言语康复标准）', url: 'https://www.asha.org', source: '官方文档' }],
  },
  '批判性思维培训师': {
    videos: [{ title: 'Computational Thinking for Problem Solving（Coursera）', url: 'https://www.coursera.org/learn/computational-thinking-problem-solving', source: 'Coursera' }],
    books: [{ title: '思考，快与慢', author: 'Daniel Kahneman', why: '解释直觉与推理的双系统机制，批判性思维训练的心理基础' }],
  },
  '财商教育讲师': {
    videos: [{ title: 'Financial Planning（Coursera 个人理财课程）', url: 'https://www.coursera.org/learn/financial-planning', source: 'Coursera' }],
    books: [{ title: '穷爸爸富爸爸', author: 'Robert T. Kiyosaki', why: '财商启蒙的畅销入门读物，适合理解资产与负债思维' }],
  },
  'PBL项目制学习导师': {
    docs: [{ title: 'Buck Institute for Education（项目式学习 PBL 权威机构）', url: 'https://www.bie.org/', source: '官方文档' }],
    videos: [{ title: 'Edutopia（项目式学习实践案例）', url: 'https://www.edutopia.org/', source: 'Edutopia' }],
  },
  '体育教练': {
    docs: [{ title: 'ACSM 美国运动医学学会（运动科学标准）', url: 'https://www.acsm.org', source: '官方文档' }],
  },
  '美术教师': {
    books: [{ title: '艺术的故事', author: 'E. H. Gombrich', why: '西方艺术史经典通识读物，美术教学的常备参考' }],
  },
};
