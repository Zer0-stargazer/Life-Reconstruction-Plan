import type { CareerResourceSet } from '../career-resources';

export const engineeringResources: Record<string, CareerResourceSet> = {
  '工业机器人工程师': {
    videos: [
      { title: '2.12 Introduction to Robotics（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/', source: 'MIT OCW', note: '英文，机器人运动学与控制基础' },
    ],
    docs: [
      { title: 'reddit · r/robotics', url: 'https://www.reddit.com/r/robotics/', source: '行业社区', note: '机器人工程师全球社区', kind: 'community' },

      { title: 'ROS Humble 官方文档', url: 'https://docs.ros.org/en/humble/index.html', source: '官方文档' },
      { title: 'ROS-Industrial 官网', url: 'https://rosindustrial.org/', source: '官方文档', note: '工业机器人的 ROS 扩展' },
    ],
    books: [
      { title: '机器人学导论', author: '约翰·克雷格', why: '机器人运动学与控制的标准教材' },

      { title: 'Introduction to Robotics: Mechanics and Control', author: 'John J. Craig', why: '机器人运动学、动力学与控制的经典入门教材' },
    ],
  },
  '质量控制工程师': {
    videos: [
      { title: '质量检测与质量体系精讲', url: 'https://www.bilibili.com/video/BV1YxYK6xEyA', source: 'Bilibili', note: '质量检测标准与体系' },


    ],
    docs: [
      { title: 'reddit · r/SixSigma', url: 'https://www.reddit.com/r/SixSigma/', source: '行业社区', note: '六西格玛与质量全球社区', kind: 'community' },

      { title: 'NIST/SEMATECH 工程统计手册', url: 'https://www.itl.nist.gov/div898/handbook/', source: '官方文档', note: '统计过程控制（SPC）权威参考' }
    ],
    books: [
      { title: 'Introduction to Statistical Quality Control', author: 'Douglas C. Montgomery', why: '统计质量控制与SPC的标准教材' },
      { title: "Juran's Quality Handbook", author: 'Joseph M. Juran 等', why: '全面质量管理领域的经典工具书' }
    ],
  },
  '自动化工程师': {
    videos: [
      { title: '2.004 Dynamics and Control II（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-004-dynamics-and-control-ii-spring-2008/', source: 'MIT OCW', note: '英文，系统动力学与反馈控制' },
    ],
    docs: [
      { title: 'reddit · r/PLC', url: 'https://www.reddit.com/r/PLC/', source: '行业社区', note: 'PLC 工程师全球社区', kind: 'community' },

      { title: 'Siemens TIA Portal 产品页', url: 'https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html', source: '官方文档', note: 'PLC 编程与自动化组态平台' },
      { title: 'ISA（国际自动化协会）', url: 'https://www.isa.org/', source: '行业协会' },
    ],
    books: [
      { title: '自动控制原理', author: '胡寿松', why: '自控领域的标准教材' },

      { title: 'Modern Control Engineering', author: 'Katsuhiko Ogata', why: '现代控制理论的经典教材，覆盖经典与状态空间方法' },
    ],
  },
  '制造工艺工程师': {
    videos: [
      { title: '2.854 Introduction to Manufacturing Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', source: 'MIT OCW', note: '英文，生产流程与制造系统' },
    ],
    docs: [
      { title: 'reddit · r/manufacturing', url: 'https://www.reddit.com/r/manufacturing/', source: '行业社区', note: '制造工艺全球社区', kind: 'community' },

      { title: 'ASME 美国机械工程师协会', url: 'https://www.asme.org/', source: '行业协会', note: '机械制造相关标准与规范' },
    ],
    books: [
      { title: '机械制造工艺学', author: '王先逵', why: '制造工艺的标准教材' },

      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '制造工艺（切削、成形、连接等）的系统性教材' },
    ],
  },
  '智能制造规划师': {
    books: [
      { title: '丰田生产方式', author: '大野耐一', why: '精益生产的原点之书' },
      { title: '精益思想', author: '詹姆斯·沃麦克', why: '精益五原则的奠基之作' },
    ],
    videos: [
      { title: '2.854 Introduction to Manufacturing Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', source: 'MIT OCW', note: '英文，制造系统规划与布局' },
    ],
    docs: [
      { title: 'reddit · r/leanmanufacturing', url: 'https://www.reddit.com/r/leanmanufacturing/', source: '行业社区', note: '精益生产全球社区', kind: 'community' },

      { title: 'Siemens TIA Portal 产品页', url: 'https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html', source: '官方文档', note: '工厂自动化与数字化平台' },
    ],
  },
  '锂电池工程师': {
    books: [
      { title: '电池手册', author: '戴维·林登', why: '电池领域的权威工具书' },
      { title: '传热学', author: '杨世铭、陶文铨', why: '电池热管理的学科根基' }
    ],
    videos: [
      { title: '锂离子电池基础课程', url: 'https://www.bilibili.com/video/BV1wh4y1871N', source: 'Bilibili', note: '锂电池原理与工艺' },


    ],
    docs: [
      { title: 'reddit · r/batteries', url: 'https://www.reddit.com/r/batteries/', source: '行业社区', note: '电池技术全球社区', kind: 'community' },

      { title: 'Battery University 电池知识库', url: 'https://batteryuniversity.com/', source: '行业资料', note: '锂电池化学与应用的通俗参考' }
    ],
  },
  '光伏工程师': {
    videos: [
      { title: 'CAD光伏设计全套施工图零基础教程', url: 'https://www.bilibili.com/video/BV1zSJgztExy', source: 'Bilibili', note: '光伏设计师实操课' },
    ],
    docs: [
      { title: 'reddit · r/solar', url: 'https://www.reddit.com/r/solar/', source: '行业社区', note: '光伏从业者全球社区', kind: 'community' },

      { title: 'PVEducation 光伏教育网', url: 'https://www.pveducation.org/', source: '行业资料', note: '太阳能电池原理与光伏系统' },
    ],
    books: [
      { title: '工程热力学', author: '沈维道', why: '光电转换背后热功转换的根基' },

      { title: 'Solar Energy Engineering: Processes and Systems', author: 'Soteris A. Kalogirou', why: '太阳能发电工程的系统性教材' },
    ],
  },
  '风电工程师': {
    docs: [
      { title: 'reddit · r/AskEngineers', url: 'https://www.reddit.com/r/AskEngineers/', source: '行业社区', note: '工程师问答社区', kind: 'community' },

      { title: '工程热力学（上海交大·一流课程）', url: 'https://www.icourse163.org/course/UESTC-1002535024', source: '中国大学MOOC', note: '风能-电能转换的能量分析根基' },
    ],
    videos: [
      { title: '风电运维工作人员一天实录', url: 'https://www.bilibili.com/video/BV1Ut4y1n7xy', source: 'Bilibili', note: '风电运维职业实景' },
    ],
    books: [
      { title: '工程热力学', author: '沈维道', why: '风能-机械能-电能转换的理论根基' },

      { title: 'Wind Energy Explained', author: 'James F. Manwell, Jon G. McGowan, Anthony L. Rogers', why: '风力发电原理与系统设计的标准入门书' },
    ],
  },
  '新能源工程师': {
    docs: [
      { title: 'reddit · r/renewableenergy', url: 'https://www.reddit.com/r/renewableenergy/', source: '行业社区', note: '可再生能源全球社区', kind: 'community' },

      { title: '新能源工学基础（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1472073161', source: '中国大学MOOC', note: '光伏/风电/水电/核能的新能源全景课' },
    ],
    videos: [
      { title: '光伏入门基础知识（尚瑞新能源）', url: 'https://www.bilibili.com/video/BV1kW4y1F7dE', source: 'Bilibili', note: '光伏与新能源入门' },
    ],
    books: [
      { title: '工程热力学', author: '沈维道', why: '能源动力类第一经典教材' },

      { title: 'Solar Energy Engineering: Processes and Systems', author: 'Soteris A. Kalogirou', why: '新能源（太阳能）工程的系统性教材' },
    ],
  },
  '数控编程工程师': {
    docs: [
      { title: 'reddit · r/Machinists', url: 'https://www.reddit.com/r/Machinists/', source: '行业社区', note: '机加工技师全球社区', kind: 'community' },

      { title: '数控加工技术', url: 'https://www.icourse163.org/course/-1001795010', source: '中国大学MOOC', note: '数控原理/插补/编程/机床结构的骨干课' },
    ],
    videos: [
      { title: '数控车床编程基础教程', url: 'https://www.bilibili.com/video/BV1AdXKB9E7z', source: 'Bilibili', note: '数控编程入门' },
    ],
    books: [
      { title: '机械制造工艺学', author: '王先逵', why: '切削加工与工艺规程的根基' },

      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '数控加工与切削工艺的基础参考' },
    ],
  },
  '精益生产工程师': {
    docs: [
      { title: 'reddit · r/leanmanufacturing', url: 'https://www.reddit.com/r/leanmanufacturing/', source: '行业社区', note: '精益生产全球社区', kind: 'community' },

      { title: '基础工业工程（北京交通大学）', url: 'https://higher.smartedu.cn/course/64b1d09fd190d2a6beeef3fa', source: '智慧教育平台', note: '程序分析/动作研究/产线平衡的精益根基' },
    ],
    videos: [
      { title: '精益生产核心课程全套真人讲解', url: 'https://www.bilibili.com/video/BV1hA411G7tB', source: 'Bilibili', note: '精益生产系统课' },
    ],
    books: [
      { title: 'Lean Thinking', author: 'James P. Womack, Daniel T. Jones', why: '精益思想的经典著作，阐述价值流与持续改进' },
      { title: '丰田生产方式', author: '大野耐一', why: '精益生产方式的源头著作' },
    ],
  },
  '复合材料工程师': {
    docs: [
      { title: 'reddit · r/materials', url: 'https://www.reddit.com/r/materials/', source: '行业社区', note: '材料科学全球社区', kind: 'community' },

      { title: '材料科学基础（北京理工大学）', url: 'https://www.icourse163.org/course/-1449368162', source: '中国大学MOOC', note: '含金属基/聚合物基/陶瓷基复合材料章节' },
    ],
    videos: [
      { title: '3.11 Mechanics of Materials（MIT OCW）', url: 'https://ocw.mit.edu/courses/3-11-mechanics-of-materials-fall-1999/', source: 'MIT OCW', note: '英文，材料力学基础，复合材料分析的前置课程' },
    ],
    books: [
      { title: '材料科学基础', author: '胡赓祥', why: '复合材料性能的材料学根基' },

      { title: 'Composite Materials: Science and Engineering', author: 'Krishan K. Chawla', why: '复合材料的成分、力学与制造工艺的经典教材' },
    ],
  },
  '汽车工程师': {
    videos: [
      { title: '如何成为一名合格的底盘工程师', url: 'https://www.bilibili.com/video/BV1Bg411e7Y6', source: 'Bilibili', note: '底盘工程师职业课' },
    ],
    docs: [
      { title: 'reddit · r/FSAE', url: 'https://www.reddit.com/r/FSAE/', source: '行业社区', note: '大学生方程式与汽车工程社区', kind: 'community' },

      { title: 'SAE International（国际汽车工程师学会）', url: 'https://www.sae.org/', source: '行业协会', note: '汽车工程标准与技术文献' },
    ],
    books: [
      { title: '汽车构造', author: '陈家瑞', why: '汽车专业的构造经典教材' },

      { title: 'Fundamentals of Vehicle Dynamics', author: 'Thomas D. Gillespie', why: '车辆动力学的经典入门教材' },
    ],
  },
  '电气工程师': {
    docs: [
      { title: 'reddit · r/electricians', url: 'https://www.reddit.com/r/electricians/', source: '行业社区', note: '电气工程师全球社区', kind: 'community' },

      { title: '电器控制与PLC技术', url: 'https://www.icourse163.org/course/-1003735006', source: '中国大学MOOC', note: '电气工程师的强弱电结合骨干课' },
    ],
    videos: [
      { title: '6.002 Circuits and Electronics（MIT OCW）', url: 'https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/', source: 'MIT OCW', note: '英文，电路与电子学基础' },
    ],
    books: [
      { title: '电路', author: '邱关源', why: '电气专业的第一经典教材' },

      { title: 'Introduction to Electric Circuits', author: 'Richard C. Dorf, James A. Svoboda', why: '电路分析的标准入门教材' },
    ],
  },
  '暖通工程师': {
    videos: [
      { title: 'ANSYS Fluent案例：暖通空调HVAC', url: 'https://www.bilibili.com/video/BV1Q64y1U7Rx', source: 'Bilibili', note: '暖通仿真实操' },
    ],
    docs: [
      { title: 'reddit · r/HVAC', url: 'https://www.reddit.com/r/HVAC/', source: '行业社区', note: '暖通工程师全球社区', kind: 'community' },

      { title: 'ASHRAE（美国采暖制冷空调工程师学会）', url: 'https://www.ashrae.org/', source: '行业协会', note: '暖通空调设计标准与手册' },
    ],
    books: [
      { title: '传热学', author: '杨世铭、陶文铨', why: '暖通空调的传热学根基' },

      { title: 'Fundamentals of Heat and Mass Transfer', author: 'Frank P. Incropera, David P. DeWitt', why: '传热与传质原理，是暖通设计的理论基础' },
    ],
  },
  '制冷工程师': {
    videos: [
      { title: 'ANSYS Fluent案例：暖通空调HVAC', url: 'https://www.bilibili.com/video/BV1Q64y1U7Rx', source: 'Bilibili', note: '暖通仿真实操' },
    ],
    docs: [
      { title: 'reddit · r/HVAC', url: 'https://www.reddit.com/r/HVAC/', source: '行业社区', note: '暖通工程师全球社区', kind: 'community' },

      { title: 'ASHRAE（美国采暖制冷空调工程师学会）', url: 'https://www.ashrae.org/', source: '行业协会', note: '制冷与空调标准与手册' },
    ],
    books: [
      { title: '传热学', author: '杨世铭、陶文铨', why: '暖通空调的传热学根基' },

      { title: 'Fundamentals of Heat and Mass Transfer', author: 'Frank P. Incropera, David P. DeWitt', why: '传热原理，是制冷系统设计的理论基础' },
    ],
  },
  '焊接工程师': {
    books: [
      { title: '焊接手册', author: '中国机械工程学会焊接学会', why: '焊接领域的权威工具书' },
      { title: '金属工艺学', author: '邓文英', why: '焊接工艺的工科经典教材' },
    ],
    videos: [
      { title: '金工基础课之焊接', url: 'https://www.bilibili.com/video/BV1mY411g7Rx', source: 'Bilibili', note: '焊接工艺基础课' },
    ],
    docs: [
      { title: 'reddit · r/Welding', url: 'https://www.reddit.com/r/Welding/', source: '行业社区', note: '焊接技师全球社区', kind: 'community' },

      { title: 'AWS 美国焊接学会', url: 'https://www.aws.org/', source: '行业协会', note: '焊接工艺标准与认证' },
    ],
  },
  '铸造工程师': {
    docs: [
      { title: 'reddit · r/metallurgy', url: 'https://www.reddit.com/r/metallurgy/', source: '行业社区', note: '冶金与铸造全球社区', kind: 'community' },

      { title: '材料科学基础（SPOC·郑州大学）', url: 'https://www.icourse163.org/course/ZZU-1461269163', source: '中国大学MOOC', note: '凝固结晶与相图——铸造的理论根基' },
    ],
    videos: [
      { title: '铸造工艺全解析', url: 'https://www.bilibili.com/video/BV1ui4y137Y1', source: 'Bilibili', note: '铸造工艺系统认知' },
    ],
    books: [
      { title: '材料科学基础', author: '胡赓祥', why: '凝固与相变的标准教材' },

      { title: 'Castings', author: 'John Campbell', why: '铸造凝固、缺陷与工艺控制的经典专著' },
    ],
  },
  '测绘工程师': {
    docs: [
      { title: 'reddit · r/surveying', url: 'https://www.reddit.com/r/surveying/', source: '行业社区', note: '测绘师全球社区', kind: 'community' },

      { title: '测绘学概论（武汉大学·6院士主讲）', url: 'https://www.icourse163.org/course/cid=1449565165', source: '中国大学MOOC', note: '测绘学科的全景导论课' },
    ],
    videos: [
      { title: '超详细的RTK/GPS零基础教学', url: 'https://www.bilibili.com/video/BV1XX4y1B73F', source: 'Bilibili', note: 'RTK 测量实操课' },
    ],
    books: [
      { title: '测绘学概论', author: '宁津生', why: '测绘学科的经典导论教材' },

      { title: 'Elementary Surveying: An Introduction to Geomatics', author: 'Charles D. Ghilani, Paul R. Wolf', why: '测量与地理信息的标准入门教材' },
    ],
  },
  '水利工程师': {
    docs: [
      { title: 'reddit · r/civilengineering', url: 'https://www.reddit.com/r/civilengineering/', source: '行业社区', note: '土木水利全球社区', kind: 'community' },

      { title: '水利工程施工（北京理工大学/大连理工）', url: 'https://www.icourse163.org/course/BIT-1002245012', source: '中国大学MOOC', note: '导流/爆破/基础处理的施工主干课' },
    ],
    videos: [
      { title: '2.25 Advanced Fluid Mechanics（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/', source: 'MIT OCW', note: '英文，流体力学进阶，水利工程的理论基础' },
    ],
    books: [
      { title: '水力学', author: '吴持恭', why: '水利专业第一经典教材' },

      { title: 'Fundamentals of Fluid Mechanics', author: 'Bruce R. Munson 等', why: '流体力学基础教材，适合水利工程入门' },
    ],
  },
  '精密制造工程师': {
    videos: [
      { title: '在瑞士制造数百万个微型精密零件的CNC工厂', url: 'https://www.bilibili.com/video/BV1LM4y1E7XU', source: 'Bilibili', note: '精密制造工厂实景' },
    ],
    docs: [
      { title: 'reddit · r/Machinists', url: 'https://www.reddit.com/r/Machinists/', source: '行业社区', note: '精密加工技师社区', kind: 'community' },

      { title: 'ASME 美国机械工程师协会', url: 'https://www.asme.org/', source: '行业协会', note: '精密机械设计与制造标准' },
    ],
    books: [
      { title: '精密与超精密加工技术', author: '袁哲俊', why: '精密加工领域的权威教材' },

      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '精密加工工艺与制造原理的系统教材' },
    ],
  },
  '表面处理工程师': {
    docs: [
      { title: 'reddit · r/metallurgy', url: 'https://www.reddit.com/r/metallurgy/', source: '行业社区', note: '表面处理与冶金社区', kind: 'community' },

      { title: '材料科学基础（北京理工大学）', url: 'https://www.icourse163.org/course/-1449368162', source: '中国大学MOOC', note: '材料结构与表面行为的理论根基' },
    ],
    videos: [
      { title: '材料表面工程之电镀：什么是电镀', url: 'https://www.bilibili.com/video/BV1QALx6cE5Y', source: 'Bilibili', note: '电镀原理入门' },
    ],
    books: [
      { title: '材料科学基础', author: '胡赓祥', why: '表面与界面科学的教材根基' },

      { title: 'Materials Science and Engineering: An Introduction', author: 'William D. Callister Jr.', why: '材料科学基础，表面处理工艺的理论前提' },
    ],
  },
  '粉末冶金工程师': {
    docs: [
      { title: 'reddit · r/metallurgy', url: 'https://www.reddit.com/r/metallurgy/', source: '行业社区', note: '粉末冶金讨论社区', kind: 'community' },

      { title: '材料科学基础（北京理工大学）', url: 'https://www.icourse163.org/course/-1449368162', source: '中国大学MOOC', note: '粉末成形与烧结的材料学根基' },
    ],
    videos: [
      { title: '三分钟了解粉末冶金', url: 'https://www.bilibili.com/video/BV1pw411G7g4', source: 'Bilibili', note: '粉末冶金工艺速览' },
    ],
    books: [
      { title: '材料科学基础', author: '胡赓祥', why: '粉末冶金相变与组织的根基' },

      { title: 'Materials Science and Engineering: An Introduction', author: 'William D. Callister Jr.', why: '材料结构与性能基础，粉末冶金的理论前提' },
    ],
  },
  '无损检测工程师': {
    books: [
      { title: '材料科学基础', author: '胡赓祥', why: '缺陷与组织的材料学根基' },
      { title: '金属工艺学', author: '邓文英', why: '加工缺陷来源的工艺根基' },
    ],
    videos: [
      { title: '无损检测基础知识（一）', url: 'https://www.bilibili.com/video/BV1CxDGY3E7i', source: 'Bilibili', note: '无损检测系统入门' },
    ],
    docs: [
      { title: 'reddit · r/NDT', url: 'https://www.reddit.com/r/NDT/', source: '行业社区', note: '无损检测全球社区', kind: 'community' },

      { title: 'ASNT 美国无损检测学会', url: 'https://www.asnt.org/', source: '行业协会', note: '无损检测方法与人员认证' },
    ],
  },
  '半导体工艺工程师': {
    videos: [
      { title: 'B站最全最细的半导体工艺全套教程', url: 'https://www.bilibili.com/video/BV1RviqBDEC3', source: 'Bilibili', note: '芯片制造工艺系统课' },
    ],
    docs: [
      { title: 'reddit · r/chipdesign', url: 'https://www.reddit.com/r/chipdesign/', source: '行业社区', note: '半导体工艺与设计全球社区', kind: 'community' },

      { title: 'SEMI 国际半导体产业协会', url: 'https://www.semi.org/', source: '行业协会', note: '半导体制造标准与产业资料' },
    ],
    books: [
      { title: '半导体物理学', author: '刘恩科', why: '半导体领域的标准教材' },

      { title: 'Semiconductor Manufacturing Technology', author: 'Michael Quirk, Julian Serda', why: '半导体制造工艺（光刻、刻蚀、薄膜等）的入门教材' },
    ],
  },
  '3D打印工程师': {
    books: [
      { title: '3D打印：从想象到现实', author: '胡迪·利普森', why: '增材制造的科普经典' },
      { title: '创客：新工业革命', author: '克里斯·安德森', why: '桌面制造与创客运动的全景' },
    ],
    videos: [
      { title: '0基础自学3D打印建模教程（拓竹）', url: 'https://www.bilibili.com/video/BV1xA4tzuE58', source: 'Bilibili', note: '3D 打印建模入门' },
    ],
    docs: [
      { title: 'reddit · r/3Dprinting', url: 'https://www.reddit.com/r/3Dprinting/', source: '行业社区', note: '3D 打印全球社区', kind: 'community' },

      { title: 'Prusa 3D 打印官方帮助中心', url: 'https://help.prusa3d.com/', source: '官方文档', note: '熔丝成型（FDM）打印与切片设置' },
    ],
  },
  '安全工程师': {
    books: [
      { title: '安全学原理', author: '张景林、林柏泉', why: '安全学科的主干教材' },
      { title: '安全生产法律法规', author: '中国安全生产科学研究院', why: '注安考试官方法规教材' },
    ],
    videos: [
      { title: '注册安全工程师：报名条件/备考/含金量', url: 'https://www.bilibili.com/video/BV13o2FBME8N', source: 'Bilibili', note: '注安证书全景认知' },
    ],
    docs: [
      { title: 'reddit · r/OSHA', url: 'https://www.reddit.com/r/OSHA/', source: '行业社区', note: '职业安全全球社区', kind: 'community' },

      { title: 'OSHA 美国职业安全与健康管理局', url: 'https://www.osha.gov/', source: '官方文档', note: '职业安全法规与标准' },
      { title: 'NFPA 美国消防协会', url: 'https://www.nfpa.org/', source: '行业协会', note: '消防与工业安全标准（如 NFPA 系列）' },
    ],
  },
  '齿轮工程师': {
    docs: [
      { title: 'reddit · r/MechanicalEngineering', url: 'https://www.reddit.com/r/MechanicalEngineering/', source: '行业社区', note: '机械工程全球社区', kind: 'community' },

      { title: '机械设计（中国矿业大学·一流课程）', url: 'https://www.icourse163.org/course/CUMT004-1001755361', source: '中国大学MOOC', note: '齿轮/轴承/轴系设计的骨干课' },
    ],
    videos: [
      { title: '从零开始学齿轮：最细最全齿轮精讲', url: 'https://www.bilibili.com/video/BV1Z5Lb6JEcK', source: 'Bilibili', note: '齿轮设计系统课' },
    ],
    books: [
      { title: '机械设计', author: '濮良贵', why: '齿轮轴承设计的标准教材' },

      { title: "Shigley's Mechanical Engineering Design", author: 'Richard G. Budynas, J. Keith Nisbett', why: '机械设计经典教材，包含齿轮与轴承设计' },
    ],
  },
  '轴承工程师': {
    docs: [
      { title: 'reddit · r/MechanicalEngineering', url: 'https://www.reddit.com/r/MechanicalEngineering/', source: '行业社区', note: '机械工程全球社区', kind: 'community' },

      { title: '机械设计（中国矿业大学·一流课程）', url: 'https://www.icourse163.org/course/CUMT004-1001755361', source: '中国大学MOOC', note: '齿轮/轴承/轴系设计的骨干课' },
    ],
    videos: [
      { title: '从零开始学齿轮：最细最全齿轮精讲', url: 'https://www.bilibili.com/video/BV1Z5Lb6JEcK', source: 'Bilibili', note: '齿轮设计系统课' },
    ],
    books: [
      { title: '机械设计', author: '濮良贵', why: '齿轮轴承设计的标准教材' },

      { title: "Shigley's Mechanical Engineering Design", author: 'Richard G. Budynas, J. Keith Nisbett', why: '机械设计经典教材，包含滚动轴承选型与校核' },
    ],
  },
  '注塑模具工程师': {
    docs: [
      { title: 'reddit · r/engineering', url: 'https://www.reddit.com/r/engineering/', source: '行业社区', note: '综合工程社区', kind: 'community' },

      { title: '塑料模设计（常州机电职院·一流课程）', url: 'https://www.icourse163.org/course/CZMEC-1206661801', source: '中国大学MOOC', note: '注射模设计的专业核心课' },
    ],
    videos: [
      { title: '注塑系统从入门到精通', url: 'https://www.bilibili.com/video/BV1xtqJBxEUK', source: 'Bilibili', note: '注塑工艺系统课' },
    ],
    books: [
      { title: '机械设计手册', author: '成大先', why: '模具结构与标准件查询工具书' },

      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '成形工艺基础，注塑工艺原理的系统参考' },
    ],
  },
  '初级工业机器人工程师': {
    videos: [
      { title: '2.12 Introduction to Robotics（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/', source: 'MIT OCW', note: '英文，机器人运动学与控制基础' },
    ],
    docs: [
      { title: 'reddit · r/robotics', url: 'https://www.reddit.com/r/robotics/', source: '行业社区', note: '机器人工程师全球社区', kind: 'community' },

      { title: 'ROS Humble 官方文档', url: 'https://docs.ros.org/en/humble/index.html', source: '官方文档' },
    ],
    books: [
      { title: '机器人学导论', author: '约翰·克雷格', why: '机器人运动学与控制的标准教材' },

      { title: 'Introduction to Robotics: Mechanics and Control', author: 'John J. Craig', why: '机器人运动学、动力学与控制的经典入门教材' },
    ],
  },
  '高级工业机器人工程师': {
    videos: [
      { title: '工业机器人技术基础（完）', url: 'https://www.bilibili.com/video/BV1C7411K7HP', source: 'Bilibili', note: '工业机器人原理系统课' },
    ],
    docs: [
      { title: 'reddit · r/AskEngineers', url: 'https://www.reddit.com/r/AskEngineers/', source: '行业社区', note: '工程师问答社区', kind: 'community' },

      { title: 'ROS-Industrial 官网', url: 'https://rosindustrial.org/', source: '官方文档', note: '工业机器人的 ROS 扩展' },
    ],
    books: [
      { title: '机器人学导论', author: '约翰·克雷格', why: '机器人运动学与控制的标准教材' },

      { title: 'Introduction to Robotics: Mechanics and Control', author: 'John J. Craig', why: '机器人运动学、动力学与控制的经典教材' },
    ],
  },
  '初级新能源工程师': {
    docs: [
      { title: 'reddit · r/renewableenergy', url: 'https://www.reddit.com/r/renewableenergy/', source: '行业社区', note: '可再生能源全球社区', kind: 'community' },

      { title: '新能源工学基础（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1472073161', source: '中国大学MOOC', note: '光伏/风电/水电/核能的新能源全景课' },
    ],
    videos: [
      { title: '光伏入门基础知识（尚瑞新能源）', url: 'https://www.bilibili.com/video/BV1kW4y1F7dE', source: 'Bilibili', note: '光伏与新能源入门' },
    ],
    books: [
      { title: '工程热力学', author: '沈维道', why: '能源动力类第一经典教材' },

      { title: 'Solar Energy Engineering: Processes and Systems', author: 'Soteris A. Kalogirou', why: '新能源（太阳能）工程的系统性教材' },
    ],
  },
  '高级新能源工程师': {
    docs: [
      { title: 'reddit · r/renewableenergy', url: 'https://www.reddit.com/r/renewableenergy/', source: '行业社区', note: '可再生能源全球社区', kind: 'community' },

      { title: '新能源工学基础（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1472073161', source: '中国大学MOOC', note: '光伏/风电/水电/核能的新能源全景课' },
    ],
    videos: [
      { title: '光伏入门基础知识（尚瑞新能源）', url: 'https://www.bilibili.com/video/BV1kW4y1F7dE', source: 'Bilibili', note: '光伏与新能源入门' },
    ],
    books: [
      { title: '工程热力学', author: '沈维道', why: '能源动力类第一经典教材' },

      { title: 'Wind Energy Explained', author: 'James F. Manwell, Jon G. McGowan, Anthony L. Rogers', why: '可再生能源发电系统设计的标准参考' },
    ],
  },
  '初级半导体工艺工程师': {
    videos: [
      { title: 'B站最全最细的半导体工艺全套教程', url: 'https://www.bilibili.com/video/BV1RviqBDEC3', source: 'Bilibili', note: '芯片制造工艺系统课' },
    ],
    docs: [
      { title: 'reddit · r/chipdesign', url: 'https://www.reddit.com/r/chipdesign/', source: '行业社区', note: '半导体工艺与设计全球社区', kind: 'community' },

      { title: 'SEMI 国际半导体产业协会', url: 'https://www.semi.org/', source: '行业协会', note: '半导体制造标准与产业资料' },
    ],
    books: [
      { title: '半导体物理学', author: '刘恩科', why: '半导体领域的标准教材' },

      { title: 'Semiconductor Manufacturing Technology', author: 'Michael Quirk, Julian Serda', why: '半导体制造工艺的入门教材' },
    ],
  },
  '高级半导体工艺工程师': {
    docs: [
      { title: 'reddit · r/chipdesign', url: 'https://www.reddit.com/r/chipdesign/', source: '行业社区', note: '半导体工艺与设计全球社区', kind: 'community' },

      { title: '微电子工艺（哈尔滨工业大学）', url: 'https://www.icourse163.org/course/HIT-154002', source: '中国大学MOOC', note: '外延/氧化/光刻/刻蚀单项工艺全解' },
    ],
    videos: [
      { title: 'B站最全最细的半导体工艺全套教程', url: 'https://www.bilibili.com/video/BV1RviqBDEC3', source: 'Bilibili', note: '芯片制造工艺系统课' },
    ],
    books: [
      { title: '半导体物理学', author: '刘恩科', why: '半导体领域的标准教材' },

      { title: 'Semiconductor Manufacturing Technology', author: 'Michael Quirk, Julian Serda', why: '半导体工艺细节（光刻、刻蚀、薄膜）的系统参考' },
    ],
  },
  '初级3D打印工程师': {
    books: [
      { title: '3D打印：从想象到现实', author: '胡迪·利普森', why: '增材制造的科普经典' },
      { title: '创客：新工业革命', author: '克里斯·安德森', why: '桌面制造与创客运动的全景' },
    ],
    videos: [
      { title: '0基础自学3D打印建模教程（拓竹）', url: 'https://www.bilibili.com/video/BV1xA4tzuE58', source: 'Bilibili', note: '3D 打印建模入门' },
    ],
    docs: [
      { title: 'reddit · r/3Dprinting', url: 'https://www.reddit.com/r/3Dprinting/', source: '行业社区', note: '3D 打印全球社区', kind: 'community' },

      { title: 'Prusa 3D 打印官方帮助中心', url: 'https://help.prusa3d.com/', source: '官方文档', note: 'FDM 打印与切片设置' },
    ],
  },
  '高级3D打印工程师': {
    books: [
      { title: '3D打印：从想象到现实', author: '胡迪·利普森', why: '增材制造的科普经典' },
      { title: '创客：新工业革命', author: '克里斯·安德森', why: '桌面制造与创客运动的全景' },
    ],
    videos: [
      { title: '0基础自学3D打印建模教程（拓竹）', url: 'https://www.bilibili.com/video/BV1xA4tzuE58', source: 'Bilibili', note: '3D 打印建模入门' },
    ],
    docs: [
      { title: 'reddit · r/3Dprinting', url: 'https://www.reddit.com/r/3Dprinting/', source: '行业社区', note: '3D 打印全球社区', kind: 'community' },

      { title: 'Prusa 3D 打印官方帮助中心', url: 'https://help.prusa3d.com/', source: '官方文档', note: 'FDM 打印与切片设置' },
    ],
  },
  '初级质量控制工程师': {
    videos: [
      { title: '质量管理学（中国计量大学·国家级精品课·全114讲）', url: 'https://www.bilibili.com/video/BV1F44y1n79r', source: 'Bilibili', note: '质量管理系统课' },
    ],
    docs: [
      { title: 'reddit · r/SixSigma', url: 'https://www.reddit.com/r/SixSigma/', source: '行业社区', note: '六西格玛与质量全球社区', kind: 'community' },

      { title: 'NIST/SEMATECH 工程统计手册', url: 'https://www.itl.nist.gov/div898/handbook/', source: '官方文档', note: '统计过程控制（SPC）权威参考' },
    ],
    books: [
      { title: '朱兰质量手册', author: '约瑟夫·朱兰', why: '质量管理的圣经级手册' },

      { title: 'Introduction to Statistical Quality Control', author: 'Douglas C. Montgomery', why: '统计质量控制与SPC的标准教材' },
    ],
  },
  '高级质量控制工程师': {
    docs: [
      { title: 'reddit · r/SixSigma', url: 'https://www.reddit.com/r/SixSigma/', source: '行业社区', note: '六西格玛与质量全球社区', kind: 'community' },

      { title: '质量管理与可靠性（东北大学）', url: 'https://www.icourse163.org/course/NEU-1461794176', source: '中国大学MOOC', note: '质量策划/控制/可靠性的专业课' },
    ],
    videos: [
      { title: '质量管理学（中国计量大学·国家级精品课·全114讲）', url: 'https://www.bilibili.com/video/BV1F44y1n79r', source: 'Bilibili', note: '质量管理系统课' },
    ],
    books: [
      { title: '朱兰质量手册', author: '约瑟夫·朱兰', why: '质量管理的圣经级手册' },

      { title: "Juran's Quality Handbook", author: 'Joseph M. Juran 等', why: '全面质量管理领域的经典工具书' },
    ],
  },
  '初级自动化工程师': {
    books: [
      { title: '自动控制原理', author: '胡寿松', why: '自控领域的标准教材' },
      { title: '电气控制与PLC应用技术', author: '张运刚', why: 'PLC 工程应用的入门经典' },
    ],
    videos: [
      { title: '西门子1200PLC视频教程零基础到PLC工程师', url: 'https://www.bilibili.com/video/BV1sE4m1d7bj', source: 'Bilibili', note: 'PLC 系统课（百万播放）' },
    ],
    docs: [
      { title: 'reddit · r/PLC', url: 'https://www.reddit.com/r/PLC/', source: '行业社区', note: 'PLC 工程师全球社区', kind: 'community' },

      { title: 'Siemens TIA Portal 产品页', url: 'https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html', source: '官方文档', note: 'PLC 编程与自动化组态平台' },
    ],
  },
  '高级自动化工程师': {
    docs: [
      { title: 'reddit · r/PLC', url: 'https://www.reddit.com/r/PLC/', source: '行业社区', note: 'PLC 工程师全球社区', kind: 'community' },

      { title: '电器控制与PLC技术', url: 'https://www.icourse163.org/course/-1003735006', source: '中国大学MOOC', note: '低压电器+PLC 编程的骨干课程' },
    ],
    videos: [
      { title: '2.004 Dynamics and Control II（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-004-dynamics-and-control-ii-spring-2008/', source: 'MIT OCW', note: '英文，系统动力学与反馈控制' },
    ],
    books: [
      { title: '自动控制原理', author: '胡寿松', why: '自控领域的标准教材' },

      { title: 'Modern Control Engineering', author: 'Katsuhiko Ogata', why: '现代控制理论的经典教材' },
    ],
  },
  '初级安全工程师': {
    books: [
      { title: '安全学原理', author: '张景林、林柏泉', why: '安全学科的主干教材' },
      { title: '安全生产法律法规', author: '中国安全生产科学研究院', why: '注安考试官方法规教材' },
    ],
    videos: [
      { title: '注册安全工程师：报名条件/备考/含金量', url: 'https://www.bilibili.com/video/BV13o2FBME8N', source: 'Bilibili', note: '注安证书全景认知' },
    ],
    docs: [
      { title: 'reddit · r/OSHA', url: 'https://www.reddit.com/r/OSHA/', source: '行业社区', note: '职业安全全球社区', kind: 'community' },

      { title: 'OSHA 美国职业安全与健康管理局', url: 'https://www.osha.gov/', source: '官方文档', note: '职业安全法规与标准' },
    ],
  },
  '高级安全工程师': {
    books: [
      { title: '安全学原理', author: '张景林、林柏泉', why: '安全学科的主干教材' },
      { title: '安全生产法律法规', author: '中国安全生产科学研究院', why: '注安考试官方法规教材' },
    ],
    videos: [
      { title: '注册安全工程师：报名条件/备考/含金量', url: 'https://www.bilibili.com/video/BV13o2FBME8N', source: 'Bilibili', note: '注安证书全景认知' },
    ],
    docs: [
      { title: 'reddit · r/OSHA', url: 'https://www.reddit.com/r/OSHA/', source: '行业社区', note: '职业安全全球社区', kind: 'community' },

      { title: 'NFPA 美国消防协会', url: 'https://www.nfpa.org/', source: '行业协会', note: '消防与工业安全标准' },
    ],
  },
  '初级制造工艺工程师': {
    docs: [
      { title: 'reddit · r/manufacturing', url: 'https://www.reddit.com/r/manufacturing/', source: '行业社区', note: '制造工艺全球社区', kind: 'community' },

      { title: '机械制造技术基础（西安交通大学）', url: 'https://www.icourse163.org/course/XJTU-1206502808', source: '中国大学MOOC', note: '切削/机床/夹具/工艺规程的骨干课' },
    ],
    videos: [
      { title: '2.854 Introduction to Manufacturing Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', source: 'MIT OCW', note: '英文，生产流程与制造系统' },
    ],
    books: [
      { title: '机械制造工艺学', author: '王先逵', why: '制造工艺的标准教材' },

      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '制造工艺（切削、成形、连接等）的系统教材' },
    ],
  },
  '高级制造工艺工程师': {
    books: [
      { title: '机械制造工艺学', author: '王先逵', why: '制造工艺的标准教材' },
      { title: '机械设计手册', author: '成大先', why: '机械工程师案头工具书' },
    ],
    videos: [
      { title: '疯狂机械：铸造技术的基本工艺流程', url: 'https://www.bilibili.com/video/BV1SP411Q71y', source: 'Bilibili', note: '制造工艺流程认知' },
    ],
    docs: [
      { title: 'reddit · r/engineering', url: 'https://www.reddit.com/r/engineering/', source: '行业社区', note: '综合工程社区', kind: 'community' },

      { title: 'ASME 美国机械工程师协会', url: 'https://www.asme.org/', source: '行业协会', note: '机械制造相关标准与规范' },
    ],
  },
  '初级锂电池工程师': {
    books: [
      { title: '电池手册', author: '戴维·林登', why: '电池领域的权威工具书' },
      { title: '传热学', author: '杨世铭、陶文铨', why: '电池热管理的学科根基' },
    ],
    videos: [
      { title: '从零看懂锂电池制造工艺', url: 'https://www.bilibili.com/video/BV1i2RKBmEJG', source: 'Bilibili', note: '锂电制造全流程拆解' },
    ],
    docs: [
      { title: 'reddit · r/batteries', url: 'https://www.reddit.com/r/batteries/', source: '行业社区', note: '电池技术全球社区', kind: 'community' },

      { title: 'Battery University 电池知识库', url: 'https://batteryuniversity.com/', source: '行业资料', note: '锂电池化学与应用的通俗参考' },
    ],
  },
  '高级锂电池工程师': {
    books: [
      { title: '电池手册', author: '戴维·林登', why: '电池领域的权威工具书' },
      { title: '传热学', author: '杨世铭、陶文铨', why: '电池热管理的学科根基' }
    ],
    docs: [
      { title: 'reddit · r/batteries', url: 'https://www.reddit.com/r/batteries/', source: '行业社区', note: '电池技术全球社区', kind: 'community' },

      { title: '储能原理与技术（福建师范大学）', url: 'https://www.icourse163.org/course/FJNU-1206412806', source: '中国大学MOOC', note: '电池储能原理的系统课程' }
    ],
    videos: [
      { title: '锂离子电池基础课程', url: 'https://www.bilibili.com/video/BV1wh4y1871N', source: 'Bilibili', note: '进阶前夯实电池原理' },


    ],
  },
  '初级光伏工程师': {
    books: [
      { title: '工程热力学', author: '沈维道', why: '光电转换背后热功转换的根基' },
      { title: '传热学', author: '杨世铭、陶文铨', why: '组件散热与电站热设计的必修课' },
    ],
    videos: [
      { title: 'CAD光伏设计全套施工图零基础教程', url: 'https://www.bilibili.com/video/BV1zSJgztExy', source: 'Bilibili', note: '光伏设计师实操课' },
    ],
    docs: [
      { title: 'reddit · r/solar', url: 'https://www.reddit.com/r/solar/', source: '行业社区', note: '光伏从业者全球社区', kind: 'community' },

      { title: 'PVEducation 光伏教育网', url: 'https://www.pveducation.org/', source: '行业资料', note: '太阳能电池原理与光伏系统' },
    ],
  },
  '高级光伏工程师': {
    docs: [
      { title: 'reddit · r/solar', url: 'https://www.reddit.com/r/solar/', source: '行业社区', note: '光伏从业者全球社区', kind: 'community' },

      { title: '工程热力学（上海交大·一流课程）', url: 'https://www.icourse163.org/course/UESTC-1002535024', source: '中国大学MOOC', note: '光伏系统热设计与能量转换根基' },
    ],
    videos: [
      { title: 'CAD光伏设计全套施工图零基础教程', url: 'https://www.bilibili.com/video/BV1zSJgztExy', source: 'Bilibili', note: '光伏设计师实操课' },
    ],
    books: [
      { title: '工程热力学', author: '沈维道', why: '光电转换背后热功转换的根基' },

      { title: 'Solar Energy Engineering: Processes and Systems', author: 'Soteris A. Kalogirou', why: '太阳能发电工程的系统性教材' },
    ],
  },
};
