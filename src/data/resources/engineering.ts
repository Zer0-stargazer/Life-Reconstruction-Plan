import type { CareerResourceSet } from '../career-resources';

export const engineeringResources: Record<string, CareerResourceSet> = {
  '工业机器人工程师': {
    videos: [
      { title: '2.12 Introduction to Robotics（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/', source: 'MIT OCW', note: '英文，机器人运动学与控制基础' },
    ],
    docs: [
      { title: 'ROS Humble 官方文档', url: 'https://docs.ros.org/en/humble/index.html', source: '官方文档' },
      { title: 'ROS-Industrial 官网', url: 'https://rosindustrial.org/', source: '官方文档', note: '工业机器人的 ROS 扩展' },
    ],
    books: [
      { title: 'Introduction to Robotics: Mechanics and Control', author: 'John J. Craig', why: '机器人运动学、动力学与控制的经典入门教材' },
    ],
  },
  '质量控制工程师': {
    videos: [
      { title: '2.854 Introduction to Manufacturing Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', source: 'MIT OCW', note: '英文，制造系统与质量管理' },
    ],
    docs: [
      { title: 'NIST/SEMATECH 工程统计手册', url: 'https://www.itl.nist.gov/div898/handbook/', source: '官方文档', note: '统计过程控制（SPC）权威参考' },
    ],
    books: [
      { title: 'Introduction to Statistical Quality Control', author: 'Douglas C. Montgomery', why: '统计质量控制与SPC的标准教材' },
      { title: "Juran's Quality Handbook", author: 'Joseph M. Juran 等', why: '全面质量管理领域的经典工具书' },
    ],
  },
  '自动化工程师': {
    videos: [
      { title: '2.004 Dynamics and Control II（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-004-dynamics-and-control-ii-spring-2008/', source: 'MIT OCW', note: '英文，系统动力学与反馈控制' },
    ],
    docs: [
      { title: 'Siemens TIA Portal 产品页', url: 'https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html', source: '官方文档', note: 'PLC 编程与自动化组态平台' },
      { title: 'ISA（国际自动化协会）', url: 'https://www.isa.org/', source: '行业协会' },
    ],
    books: [
      { title: 'Modern Control Engineering', author: 'Katsuhiko Ogata', why: '现代控制理论的经典教材，覆盖经典与状态空间方法' },
    ],
  },
  '制造工艺工程师': {
    videos: [
      { title: '2.854 Introduction to Manufacturing Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', source: 'MIT OCW', note: '英文，生产流程与制造系统' },
    ],
    docs: [
      { title: 'ASME 美国机械工程师协会', url: 'https://www.asme.org/', source: '行业协会', note: '机械制造相关标准与规范' },
    ],
    books: [
      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '制造工艺（切削、成形、连接等）的系统性教材' },
    ],
  },
  '智能制造规划师': {
    videos: [
      { title: '2.854 Introduction to Manufacturing Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', source: 'MIT OCW', note: '英文，制造系统规划与布局' },
    ],
    docs: [
      { title: 'Siemens TIA Portal 产品页', url: 'https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html', source: '官方文档', note: '工厂自动化与数字化平台' },
    ],
  },
  '锂电池工程师': {
    videos: [
      { title: '10.626 Electrochemical Energy Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '英文，电化学储能原理，涵盖电池' },
    ],
    docs: [
      { title: 'Battery University 电池知识库', url: 'https://batteryuniversity.com/', source: '行业资料', note: '锂电池化学与应用的通俗参考' },
    ],
  },
  '光伏工程师': {
    docs: [
      { title: 'PVEducation 光伏教育网', url: 'https://www.pveducation.org/', source: '行业资料', note: '太阳能电池原理与光伏系统' },
    ],
    books: [
      { title: 'Solar Energy Engineering: Processes and Systems', author: 'Soteris A. Kalogirou', why: '太阳能发电工程的系统性教材' },
    ],
  },
  '风电工程师': {
    books: [
      { title: 'Wind Energy Explained', author: 'James F. Manwell, Jon G. McGowan, Anthony L. Rogers', why: '风力发电原理与系统设计的标准入门书' },
    ],
  },
  '新能源工程师': {
    books: [
      { title: 'Solar Energy Engineering: Processes and Systems', author: 'Soteris A. Kalogirou', why: '新能源（太阳能）工程的系统性教材' },
    ],
  },
  '数控编程工程师': {
    books: [
      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '数控加工与切削工艺的基础参考' },
    ],
  },
  '精益生产工程师': {
    books: [
      { title: 'Lean Thinking', author: 'James P. Womack, Daniel T. Jones', why: '精益思想的经典著作，阐述价值流与持续改进' },
      { title: '丰田生产方式', author: '大野耐一', why: '精益生产方式的源头著作' },
    ],
  },
  '复合材料工程师': {
    videos: [
      { title: '3.11 Mechanics of Materials（MIT OCW）', url: 'https://ocw.mit.edu/courses/3-11-mechanics-of-materials-fall-1999/', source: 'MIT OCW', note: '英文，材料力学基础，复合材料分析的前置课程' },
    ],
    books: [
      { title: 'Composite Materials: Science and Engineering', author: 'Krishan K. Chawla', why: '复合材料的成分、力学与制造工艺的经典教材' },
    ],
  },
  '汽车工程师': {
    docs: [
      { title: 'SAE International（国际汽车工程师学会）', url: 'https://www.sae.org/', source: '行业协会', note: '汽车工程标准与技术文献' },
    ],
    books: [
      { title: 'Fundamentals of Vehicle Dynamics', author: 'Thomas D. Gillespie', why: '车辆动力学的经典入门教材' },
    ],
  },
  '电气工程师': {
    videos: [
      { title: '6.002 Circuits and Electronics（MIT OCW）', url: 'https://ocw.mit.edu/courses/6-002-circuits-and-electronics-spring-2007/', source: 'MIT OCW', note: '英文，电路与电子学基础' },
    ],
    books: [
      { title: 'Introduction to Electric Circuits', author: 'Richard C. Dorf, James A. Svoboda', why: '电路分析的标准入门教材' },
    ],
  },
  '暖通工程师': {
    docs: [
      { title: 'ASHRAE（美国采暖制冷空调工程师学会）', url: 'https://www.ashrae.org/', source: '行业协会', note: '暖通空调设计标准与手册' },
    ],
    books: [
      { title: 'Fundamentals of Heat and Mass Transfer', author: 'Frank P. Incropera, David P. DeWitt', why: '传热与传质原理，是暖通设计的理论基础' },
    ],
  },
  '制冷工程师': {
    docs: [
      { title: 'ASHRAE（美国采暖制冷空调工程师学会）', url: 'https://www.ashrae.org/', source: '行业协会', note: '制冷与空调标准与手册' },
    ],
    books: [
      { title: 'Fundamentals of Heat and Mass Transfer', author: 'Frank P. Incropera, David P. DeWitt', why: '传热原理，是制冷系统设计的理论基础' },
    ],
  },
  '焊接工程师': {
    docs: [
      { title: 'AWS 美国焊接学会', url: 'https://www.aws.org/', source: '行业协会', note: '焊接工艺标准与认证' },
    ],
  },
  '铸造工程师': {
    books: [
      { title: 'Castings', author: 'John Campbell', why: '铸造凝固、缺陷与工艺控制的经典专著' },
    ],
  },
  '测绘工程师': {
    books: [
      { title: 'Elementary Surveying: An Introduction to Geomatics', author: 'Charles D. Ghilani, Paul R. Wolf', why: '测量与地理信息的标准入门教材' },
    ],
  },
  '水利工程师': {
    videos: [
      { title: '2.25 Advanced Fluid Mechanics（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-25-advanced-fluid-mechanics-fall-2013/', source: 'MIT OCW', note: '英文，流体力学进阶，水利工程的理论基础' },
    ],
    books: [
      { title: 'Fundamentals of Fluid Mechanics', author: 'Bruce R. Munson 等', why: '流体力学基础教材，适合水利工程入门' },
    ],
  },
  '精密制造工程师': {
    docs: [
      { title: 'ASME 美国机械工程师协会', url: 'https://www.asme.org/', source: '行业协会', note: '精密机械设计与制造标准' },
    ],
    books: [
      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '精密加工工艺与制造原理的系统教材' },
    ],
  },
  '表面处理工程师': {
    books: [
      { title: 'Materials Science and Engineering: An Introduction', author: 'William D. Callister Jr.', why: '材料科学基础，表面处理工艺的理论前提' },
    ],
  },
  '粉末冶金工程师': {
    books: [
      { title: 'Materials Science and Engineering: An Introduction', author: 'William D. Callister Jr.', why: '材料结构与性能基础，粉末冶金的理论前提' },
    ],
  },
  '无损检测工程师': {
    docs: [
      { title: 'ASNT 美国无损检测学会', url: 'https://www.asnt.org/', source: '行业协会', note: '无损检测方法与人员认证' },
    ],
  },
  '半导体工艺工程师': {
    docs: [
      { title: 'SEMI 国际半导体产业协会', url: 'https://www.semi.org/', source: '行业协会', note: '半导体制造标准与产业资料' },
    ],
    books: [
      { title: 'Semiconductor Manufacturing Technology', author: 'Michael Quirk, Julian Serda', why: '半导体制造工艺（光刻、刻蚀、薄膜等）的入门教材' },
    ],
  },
  '3D打印工程师': {
    docs: [
      { title: 'Prusa 3D 打印官方帮助中心', url: 'https://help.prusa3d.com/', source: '官方文档', note: '熔丝成型（FDM）打印与切片设置' },
    ],
  },
  '安全工程师': {
    docs: [
      { title: 'OSHA 美国职业安全与健康管理局', url: 'https://www.osha.gov/', source: '官方文档', note: '职业安全法规与标准' },
      { title: 'NFPA 美国消防协会', url: 'https://www.nfpa.org/', source: '行业协会', note: '消防与工业安全标准（如 NFPA 系列）' },
    ],
  },
  '齿轮工程师': {
    books: [
      { title: "Shigley's Mechanical Engineering Design", author: 'Richard G. Budynas, J. Keith Nisbett', why: '机械设计经典教材，包含齿轮与轴承设计' },
    ],
  },
  '轴承工程师': {
    books: [
      { title: "Shigley's Mechanical Engineering Design", author: 'Richard G. Budynas, J. Keith Nisbett', why: '机械设计经典教材，包含滚动轴承选型与校核' },
    ],
  },
  '注塑模具工程师': {
    books: [
      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '成形工艺基础，注塑工艺原理的系统参考' },
    ],
  },
  '初级工业机器人工程师': {
    videos: [
      { title: '2.12 Introduction to Robotics（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-12-introduction-to-robotics-fall-2005/', source: 'MIT OCW', note: '英文，机器人运动学与控制基础' },
    ],
    docs: [
      { title: 'ROS Humble 官方文档', url: 'https://docs.ros.org/en/humble/index.html', source: '官方文档' },
    ],
    books: [
      { title: 'Introduction to Robotics: Mechanics and Control', author: 'John J. Craig', why: '机器人运动学、动力学与控制的经典入门教材' },
    ],
  },
  '高级工业机器人工程师': {
    docs: [
      { title: 'ROS-Industrial 官网', url: 'https://rosindustrial.org/', source: '官方文档', note: '工业机器人的 ROS 扩展' },
    ],
    books: [
      { title: 'Introduction to Robotics: Mechanics and Control', author: 'John J. Craig', why: '机器人运动学、动力学与控制的经典教材' },
    ],
  },
  '初级新能源工程师': {
    books: [
      { title: 'Solar Energy Engineering: Processes and Systems', author: 'Soteris A. Kalogirou', why: '新能源（太阳能）工程的系统性教材' },
    ],
  },
  '高级新能源工程师': {
    books: [
      { title: 'Wind Energy Explained', author: 'James F. Manwell, Jon G. McGowan, Anthony L. Rogers', why: '可再生能源发电系统设计的标准参考' },
    ],
  },
  '初级半导体工艺工程师': {
    docs: [
      { title: 'SEMI 国际半导体产业协会', url: 'https://www.semi.org/', source: '行业协会', note: '半导体制造标准与产业资料' },
    ],
    books: [
      { title: 'Semiconductor Manufacturing Technology', author: 'Michael Quirk, Julian Serda', why: '半导体制造工艺的入门教材' },
    ],
  },
  '高级半导体工艺工程师': {
    books: [
      { title: 'Semiconductor Manufacturing Technology', author: 'Michael Quirk, Julian Serda', why: '半导体工艺细节（光刻、刻蚀、薄膜）的系统参考' },
    ],
  },
  '初级3D打印工程师': {
    docs: [
      { title: 'Prusa 3D 打印官方帮助中心', url: 'https://help.prusa3d.com/', source: '官方文档', note: 'FDM 打印与切片设置' },
    ],
  },
  '高级3D打印工程师': {
    docs: [
      { title: 'Prusa 3D 打印官方帮助中心', url: 'https://help.prusa3d.com/', source: '官方文档', note: 'FDM 打印与切片设置' },
    ],
  },
  '初级质量控制工程师': {
    docs: [
      { title: 'NIST/SEMATECH 工程统计手册', url: 'https://www.itl.nist.gov/div898/handbook/', source: '官方文档', note: '统计过程控制（SPC）权威参考' },
    ],
    books: [
      { title: 'Introduction to Statistical Quality Control', author: 'Douglas C. Montgomery', why: '统计质量控制与SPC的标准教材' },
    ],
  },
  '高级质量控制工程师': {
    books: [
      { title: "Juran's Quality Handbook", author: 'Joseph M. Juran 等', why: '全面质量管理领域的经典工具书' },
    ],
  },
  '初级自动化工程师': {
    docs: [
      { title: 'Siemens TIA Portal 产品页', url: 'https://www.siemens.com/global/en/products/automation/industry-software/automation-software/tia-portal.html', source: '官方文档', note: 'PLC 编程与自动化组态平台' },
    ],
  },
  '高级自动化工程师': {
    videos: [
      { title: '2.004 Dynamics and Control II（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-004-dynamics-and-control-ii-spring-2008/', source: 'MIT OCW', note: '英文，系统动力学与反馈控制' },
    ],
    books: [
      { title: 'Modern Control Engineering', author: 'Katsuhiko Ogata', why: '现代控制理论的经典教材' },
    ],
  },
  '初级安全工程师': {
    docs: [
      { title: 'OSHA 美国职业安全与健康管理局', url: 'https://www.osha.gov/', source: '官方文档', note: '职业安全法规与标准' },
    ],
  },
  '高级安全工程师': {
    docs: [
      { title: 'NFPA 美国消防协会', url: 'https://www.nfpa.org/', source: '行业协会', note: '消防与工业安全标准' },
    ],
  },
  '初级制造工艺工程师': {
    videos: [
      { title: '2.854 Introduction to Manufacturing Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-854-introduction-to-manufacturing-systems-fall-2016/', source: 'MIT OCW', note: '英文，生产流程与制造系统' },
    ],
    books: [
      { title: 'Fundamentals of Modern Manufacturing', author: 'Mikell P. Groover', why: '制造工艺（切削、成形、连接等）的系统教材' },
    ],
  },
  '高级制造工艺工程师': {
    docs: [
      { title: 'ASME 美国机械工程师协会', url: 'https://www.asme.org/', source: '行业协会', note: '机械制造相关标准与规范' },
    ],
  },
  '初级锂电池工程师': {
    docs: [
      { title: 'Battery University 电池知识库', url: 'https://batteryuniversity.com/', source: '行业资料', note: '锂电池化学与应用的通俗参考' },
    ],
  },
  '高级锂电池工程师': {
    videos: [
      { title: '10.626 Electrochemical Energy Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '英文，电化学储能原理' },
    ],
  },
  '初级光伏工程师': {
    docs: [
      { title: 'PVEducation 光伏教育网', url: 'https://www.pveducation.org/', source: '行业资料', note: '太阳能电池原理与光伏系统' },
    ],
  },
  '高级光伏工程师': {
    books: [
      { title: 'Solar Energy Engineering: Processes and Systems', author: 'Soteris A. Kalogirou', why: '太阳能发电工程的系统性教材' },
    ],
  },
};
