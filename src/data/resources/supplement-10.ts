import type { CareerResourceSet } from '../career-resources';

/**
 * 职业级专属学习资源 · 补充 10（2026-10-10）
 * 覆盖：AI/科技、工程制造、能源、科研 共 47 个职业。
 * 纪律同 career-resources.ts 头注释：只写实测可达的稳定页（课程分类页 / 官方文档 / 权威机构）；
 * 书籍为真实可购书目，不标 ISBN。
 */
export const supplementResources10: Record<string, CareerResourceSet> = {
  /* ===== AI / 科技 ===== */

  /* ===== 工程制造 ===== */
  '低空经济运营师': {
    books: [
      { title: '航空航天概论', author: '贾玉红', why: '航空器的通识根基' },
      { title: 'GPS原理与接收机设计', author: '谢钢', why: '定位导航的技术根基' },
    ],
    videos: [
      { title: 'CAAC无人机教员口试知识点详细教学', url: 'https://www.bilibili.com/video/BV194Ny6cEs9', source: 'Bilibili', note: '无人机执照考证课' },
    ],
    docs: [
      { title: 'reddit · r/drones', url: 'https://www.reddit.com/r/drones/', source: '行业社区', note: '无人机全球社区', kind: 'community' },

      { title: '中国民用航空局', url: 'https://www.caac.gov.cn/', source: '民航局', note: '低空经济与无人机运营的政策来源' },
      { title: 'edX 工程学课程合集', url: 'https://www.edx.org/learn/engineering', source: 'edX', note: '航空与运营工程基础' },
    ],
  },
  '无人机飞手': {
    books: [
      { title: '航空航天概论', author: '贾玉红', why: '航空器的通识根基' },
      { title: 'GPS原理与接收机设计', author: '谢钢', why: '定位导航的技术根基' }
    ],
    videos: [
      { title: 'CAAC无人机教员口试知识点详细教学', url: 'https://www.bilibili.com/video/BV194Ny6cEs9', source: 'Bilibili', note: '无人机执照考证课' }
    ],
    docs: [
      { title: 'reddit · r/drones', url: 'https://www.reddit.com/r/drones/', source: '行业社区', note: '无人机全球社区', kind: 'community' },

      { title: '大疆创新开发者', url: 'https://developer.dji.com/', source: 'DJI', note: '主流机型操作与开发资料' }
    ],
  },
  '自动驾驶安全员': {
    books: [
      { title: '汽车理论', author: '余志生', why: '车辆动力学是安全评判的根基' },
      { title: '概率机器人', author: '塞巴斯蒂安·特龙', why: '自动驾驶感知与决策的经典' },
    ],
    videos: [
      { title: '成为自动驾驶安全员都需要具备什么条件？', url: 'https://www.bilibili.com/video/BV1iK4y1W7ps', source: 'Bilibili', note: '安全员岗位认知' },
    ],
    docs: [
      { title: 'reddit · r/SelfDrivingCars', url: 'https://www.reddit.com/r/SelfDrivingCars/', source: '行业社区', note: '自动驾驶全球社区', kind: 'community' },

      { title: 'edX 工程学课程合集', url: 'https://www.edx.org/learn/engineering', source: 'edX', note: '车辆与感知系统基础' },
      { title: 'NHTSA 自动驾驶', url: 'https://www.nhtsa.gov/vehicle-safety/automated-vehicles-safety', source: 'NHTSA', note: '自动驾驶安全分级与法规参考' },
    ],
  },
  '人形机器人运维师': {
    books: [
      { title: '机器人学导论', author: '约翰·克雷格', why: '人形机器人运动学的理论根基' },
      { title: '现代机器人学', author: '凯文·林奇', why: '全身动力学与规划的现代方法' },
    ],
    videos: [
      { title: 'Tibot 人形机器人教学视频', url: 'https://www.bilibili.com/video/BV1Yv411H7pv', source: 'Bilibili', note: '人形机器人整机教学' },
    ],
    docs: [
      { title: 'reddit · r/AskEngineers', url: 'https://www.reddit.com/r/AskEngineers/', source: '行业社区', note: '工程师问答社区', kind: 'community' },

      { title: 'ROS 官方文档', url: 'https://docs.ros.org/', source: 'ROS', note: '机器人系统部署与调试基础' },
      { title: 'edX 机器人学课程合集', url: 'https://www.edx.org/learn/robotics', source: 'edX', note: '机器人学通识' },
    ],
  },
  '电池热管理工程师': {
    books: [
      { title: '电池手册', author: '戴维·林登', why: '电池领域的权威工具书' },
      { title: '传热学', author: '杨世铭、陶文铨', why: '电池热管理的学科根基' }
    ],
    videos: [
      { title: '从零看懂锂电池制造工艺', url: 'https://www.bilibili.com/video/BV1i2RKBmEJG', source: 'Bilibili', note: '锂电制造全流程拆解' }
    ],
    docs: [
      { title: '电化学（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1206700860', source: '中国大学MOOC', note: '化学电源与电极过程动力学' },

      { title: 'reddit · r/EVs', url: 'https://www.reddit.com/r/EVs/', source: '行业社区', note: '电动车与动力电池社区', kind: 'community' }
    ],
  },
  '固态电池研发工程师': {
    books: [
      { title: '电池手册', author: '戴维·林登', why: '电池领域的权威工具书' },
      { title: '传热学', author: '杨世铭、陶文铨', why: '电池热管理的学科根基' },
    ],
    videos: [
      { title: '从零看懂锂电池制造工艺', url: 'https://www.bilibili.com/video/BV1i2RKBmEJG', source: 'Bilibili', note: '锂电制造全流程拆解' },
    ],
    docs: [
      { title: 'reddit · r/EVs', url: 'https://www.reddit.com/r/EVs/', source: '行业社区', note: '电动车与动力电池社区', kind: 'community' },

      { title: 'MIT OCW 电化学能源系统', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '固态电解质的电化学基础' },
      { title: 'edX 能源课程合集', url: 'https://www.edx.org/learn/energy', source: 'edX', note: '电池材料与系统课程' },
    ],
  },
  '无人机植保飞手': {
    books: [
      { title: '航空航天概论', author: '贾玉红', why: '航空器的通识根基' },
      { title: 'GPS原理与接收机设计', author: '谢钢', why: '定位导航的技术根基' },
    ],
    videos: [
      { title: 'CAAC无人机教员口试知识点详细教学', url: 'https://www.bilibili.com/video/BV194Ny6cEs9', source: 'Bilibili', note: '无人机执照考证课' },
    ],
    docs: [
      { title: 'reddit · r/drones', url: 'https://www.reddit.com/r/drones/', source: '行业社区', note: '无人机全球社区', kind: 'community' },

      { title: '中国民用航空局', url: 'https://www.caac.gov.cn/', source: '民航局', note: '植保作业的空域与执照要求' },
      { title: '大疆农业', url: 'https://ag.dji.com/', source: 'DJI 农业', note: '植保机作业规范与案例' },
    ],
  },
  '温室智能控制工程师': {
    books: [
      { title: '自动控制原理', author: '胡寿松', why: '温室环境控制的理论根基' },
      { title: '传感器与检测技术', author: '周杏鹏', why: '环境参数采集的标准教材' },
    ],
    videos: [
      { title: '温室大棚智能控制：proteus仿真+C代码', url: 'https://www.bilibili.com/video/BV1fcSgYdETd', source: 'Bilibili', note: '温室控制系统实训' },
    ],
    docs: [
      { title: 'reddit · r/ControlTheory', url: 'https://www.reddit.com/r/ControlTheory/', source: '行业社区', note: '自动控制讨论社区', kind: 'community' },

      { title: 'edX 工程学课程合集', url: 'https://www.edx.org/learn/engineering', source: 'edX', note: '自动控制与环控系统基础' },
      { title: 'edX 环境科学课程合集', url: 'https://www.edx.org/learn/environmental-science', source: 'edX', note: '设施农业与环境参数' },
    ],
  },
  '垂直农业技术员': {
    books: [
      { title: '垂直农场', author: '迪克森·德斯波米尔', why: '垂直农业的开山之作' },
      { title: '传热学', author: '杨世铭、陶文铨', why: '植物工厂环境调控的根基' },
    ],
    videos: [
      { title: '干货科普：什么是垂直农场', url: 'https://www.bilibili.com/video/BV1XT4y1U7ba', source: 'Bilibili', note: '垂直农业认知入门' },
    ],
    docs: [
      { title: 'reddit · r/verticalfarming', url: 'https://www.reddit.com/r/verticalfarming/', source: '行业社区', note: '垂直农业全球社区', kind: 'community' },

      { title: 'edX 农业课程合集', url: 'https://www.edx.org/learn/agriculture', source: 'edX', note: 'facilities 农业与作物生理基础' },
      { title: 'edX 环境科学课程合集', url: 'https://www.edx.org/learn/environmental-science', source: 'edX', note: '无土栽培与环控参数' },
    ],
  },
  '低空交通规划师': {
    books: [
      { title: '航空航天概论', author: '贾玉红', why: '航空器的通识根基' },
      { title: 'GPS原理与接收机设计', author: '谢钢', why: '定位导航的技术根基' },
    ],
    videos: [
      { title: '无人机农业植保应用技术', url: 'https://www.bilibili.com/video/BV1ZBPTz5ENw', source: 'Bilibili', note: '植保无人机实操' },
    ],
    docs: [
      { title: 'reddit · r/Agriculture', url: 'https://www.reddit.com/r/Agriculture/', source: '行业社区', note: '农业科技社区', kind: 'community' },

      { title: '中国民用航空局', url: 'https://www.caac.gov.cn/', source: '民航局', note: '空域规划与低空管理政策' },
      { title: 'FAA 无人机系统', url: 'https://www.faa.gov/uas/', source: 'FAA', note: '空域整合与 UTM 参考' },
    ],
  },

  /* ===== 能源 ===== */
  '绿氢工艺工程师': {
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' }
    ],
    videos: [
      { title: '拆解燃料电池充电宝：新能源的工作原理', url: 'https://www.bilibili.com/video/BV1c4411B7uo', source: 'Bilibili', note: '燃料电池原理课' }
    ],
    docs: [
      { title: '国际能源网', url: 'https://www.in-en.com/', source: '行业社区', note: '能源行业资讯社区', kind: 'community' },

      { title: 'IRENA 国际可再生能源署', url: 'https://www.irena.org/', source: 'IRENA', note: '绿氢产业报告与技术路线' }
    ],
  },
  '海缆运维工程师': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '风电运维工程师：海上吃饭住宿怎么样', url: 'https://www.bilibili.com/video/BV1Qb411o74r', source: 'Bilibili', note: '海上风电运维实录' },
    ],
    docs: [
      { title: 'reddit · r/energy', url: 'https://www.reddit.com/r/energy/', source: '行业社区', note: '能源全球社区', kind: 'community' },

      { title: 'edX 能源课程合集', url: 'https://www.edx.org/learn/energy', source: 'edX', note: '海上电力系统基础' },
      { title: '国际能源署', url: 'https://www.iea.org/', source: 'IEA', note: '海上风电与电网报告' },
    ],
  },
  '分布式能源聚合师': {
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '虚拟电厂：逻辑、产业和方向', url: 'https://www.bilibili.com/video/BV1CW4y1a7Uz', source: 'Bilibili', note: '能源IT与电力服务' },
    ],
    docs: [
      { title: 'reddit · r/climate', url: 'https://www.reddit.com/r/climate/', source: '行业社区', note: '气候社区', kind: 'community' },

      { title: '国际能源署', url: 'https://www.iea.org/', source: 'IEA', note: '分布式能源与需求响应报告' },
      { title: 'edX 能源课程合集', url: 'https://www.edx.org/learn/energy', source: 'edX', note: '电力市场与调度基础' },
    ],
  },
  '碳核算师': {
    videos: [
      { title: '企业、行业如何核算碳排放', url: 'https://www.bilibili.com/video/BV1mj411K73Z', source: 'Bilibili', note: '碳排放核算方法课' }
    ],
    docs: [
      { title: 'reddit · r/climate', url: 'https://www.reddit.com/r/climate/', source: '行业社区', note: '碳核算讨论社区', kind: 'community' },

      { title: '国家应对气候变化战略研究与国际合作中心', url: 'https://www.ncsc.org.cn/', source: 'NCSC', note: '国内碳核算与政策口径' }
    ],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Drawdown：最全面的碳中和解决方案', author: 'Paul Hawken', why: '减排路径与碳核算场景的系统读本' }],
  },
  'CCUS工程师': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
    ],
    videos: [
      { title: '碳捕捉与碳封存', url: 'https://www.bilibili.com/video/BV1hj411h79K', source: 'Bilibili', note: 'CCUS技术原理' },
    ],
    docs: [
      { title: 'Carbon Brief · 碳与能源政策媒体', url: 'https://www.carbonbrief.org/', source: '行业社区', note: '全球碳议题深度报道', kind: 'community' },

      { title: '国际能源署 CCUS', url: 'https://www.iea.org/energy-system/carbon-capture-utilisation-and-storage', source: 'IEA', note: '碳捕集利用与封存技术综述' },
      { title: 'MIT OCW 能源课程', url: 'https://ocw.mit.edu/', source: 'MIT OCW', note: '化工与地质封存基础' },
    ],
  },

  /* ===== 科研 ===== */
  '合成生物工艺工程师': {
    books: [
      { title: '生命的未来', author: '克雷格·文特尔', why: '合成生物的工程化愿景' },
      { title: '上帝的手术刀：基因编辑', author: '王立铭', why: '基因工程工具全景' }
    ],
    videos: [
      { title: '2 小时入门合成生物学', url: 'https://www.bilibili.com/video/BV1uM4m1X7D6', source: 'Bilibili', note: '合成生物学系统课' }
    ],
    docs: [
      { title: 'reddit · r/syntheticbiology', url: 'https://www.reddit.com/r/syntheticbiology/', source: '行业社区', note: '合成生物工程讨论社区', kind: 'community' },

      { title: 'edX 生物学课程合集', url: 'https://www.edx.org/learn/biology', source: 'edX', note: '合成生物学与分子基础' }
    ],
  },
  'AI for Science研究员': {
    videos: [
      { title: '4 分钟了解什么是 AI for Science', url: 'https://www.bilibili.com/video/BV1c44y1c7hJ', source: 'Bilibili', note: 'AI4S 全景速览' },
    ],
    docs: [
      { title: 'reddit · r/science', url: 'https://www.reddit.com/r/science/', source: '行业社区', note: '综合科学研究社区', kind: 'community' },

      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: 'AI4Science 论文主阵地' },
      { title: 'Nature', url: 'https://www.nature.com/', source: 'Nature', note: 'AI 驱动的科学发现报道与研究' },
    ],
    books: [
      { title: '科学革命的结构', author: '托马斯·库恩', why: '理解科研范式更替' },
{ title: '深度学习', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '科学计算中深度学习方法的数学底座' }],
  },
};
