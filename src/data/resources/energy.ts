import type { CareerResourceSet } from '../career-resources';

export const energyResources: Record<string, CareerResourceSet> = {
  '光伏系统工程师': {
    videos: [{ title: '2.627 Fundamentals of Photovoltaics（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-627-fundamentals-of-photovoltaics-fall-2013/', source: 'MIT OCW', note: '英文，光伏电池原理与系统基础' }],
    docs: [
      { title: '北极星太阳能光伏网', url: 'https://guangfu.bjx.com.cn/', source: '行业社区', note: '光伏行业资讯与社区', kind: 'community' },
{ title: 'DOE 光伏技术（Photovoltaics）', url: 'https://www.energy.gov/eere/solar/photovoltaics', source: '官方文档' }],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Photovoltaic Solar Energy: From Fundamentals to Applications', author: 'Reinders 等', why: '光伏从原理到系统应用的系统教材' }],
  },
  '风电场运维工程师': {
    videos: [
      { title: '风电运维工程师：海上吃饭住宿怎么样', url: 'https://www.bilibili.com/video/BV1Qb411o74r', source: 'Bilibili', note: '海上风电运维实录' },
    ],
    docs: [
      { title: 'reddit · r/energy', url: 'https://www.reddit.com/r/energy/', source: '行业社区', note: '能源全球社区', kind: 'community' },
{ title: 'DOE 风能技术办公室（Wind Energy Technologies Office）', url: 'https://www.energy.gov/eere/wind/wind-energy-technologies-office', source: '官方文档' }],
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
{ title: 'Wind Energy Explained: Theory, Design and Application', author: 'Manwell, McGowan, Rogers', why: '风电原理、设计与运行的经典参考书' }],
  },
  '储能系统工程师': {
    videos: [{ title: '10.626 Electrochemical Energy Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '英文，电化学储能系统' }],
    docs: [
      { title: '中国储能网', url: 'https://www.escn.com.cn/', source: '行业社区', note: '储能行业门户社区', kind: 'community' },
{ title: 'DOE 储能（Energy Storage）', url: 'https://www.energy.gov/oe/energy-storage', source: '官方文档' }],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Battery Management Systems, Volume I: Battery Modeling', author: 'Gregory L. Plett', why: '电池建模与管理系统的入门专著' }],
  },
  '氢能研发工程师': {
    videos: [
      { title: '拆解燃料电池充电宝：新能源的工作原理', url: 'https://www.bilibili.com/video/BV1c4411B7uo', source: 'Bilibili', note: '燃料电池原理课' },
    ],
    docs: [
      { title: '国际能源网', url: 'https://www.in-en.com/', source: '行业社区', note: '能源行业资讯社区', kind: 'community' },

      { title: 'DOE 氢能与燃料电池技术办公室', url: 'https://www.energy.gov/eere/fuelcells/hydrogen-and-fuel-cell-technologies-office', source: '官方文档' },
      { title: 'DOE 制氢技术（Hydrogen Production）', url: 'https://www.energy.gov/eere/fuelcells/hydrogen-production', source: '官方文档' },
      { title: 'DOE 储氢技术（Hydrogen Storage）', url: 'https://www.energy.gov/eere/fuelcells/hydrogen-storage', source: '官方文档' },
    ],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'The Hydrogen Economy', author: 'Jeremy Rifkin', why: '氢能产业与能源转型的通俗读物' }],
  },
  '核电站操作员': {
    videos: [{ title: '22.06 Engineering of Nuclear Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/22-06-engineering-of-nuclear-systems-fall-2010/', source: 'MIT OCW', note: '英文，核系统工程基础' }],
    docs: [
      { title: 'reddit · r/nuclear', url: 'https://www.reddit.com/r/nuclear/', source: '行业社区', note: '核能全球社区', kind: 'community' },
{ title: 'DOE 核反应堆技术（Nuclear Reactor Technologies）', url: 'https://www.energy.gov/ne/nuclear-reactor-technologies', source: '官方文档' }],
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
{ title: 'Nuclear Reactor Engineering', author: 'Samuel Glasstone, Alexander Sesonske', why: '反应堆工程原理的经典教材' }],
  },
  '智能电网工程师': {
    videos: [
      { title: '国家电网笔试公开课：电力电子', url: 'https://www.bilibili.com/video/BV1f5411S75A', source: 'Bilibili', note: '电网基础系统课' },
    ],
    docs: [
      { title: '北极星电力网', url: 'https://news.bjx.com.cn/', source: '行业社区', note: '电力行业资讯与社区', kind: 'community' },
{ title: 'DOE 电网现代化与智能电网', url: 'https://www.energy.gov/oe/grid-modernization-and-smart-grid', source: '官方文档' }],
    books: [
      { title: '电力系统分析', author: '何仰赞', why: '电力系统的标准教材' },
{ title: 'Smart Grid: Technology and Applications', author: 'Janaka Ekanayake 等', why: '智能电网技术与应用的综合教材' }],
  },
  '碳资产管理师': {
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' }
    ],
    videos: [
      { title: '碳排放管理师精选课程', url: 'https://www.bilibili.com/video/BV1Q3411p7wj', source: 'Bilibili', note: '碳资产系统课' }
    ],
    docs: [
      { title: '能源经济学（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1473949178', source: '中国大学MOOC', note: '碳市场与能源经济核算' },

      { title: 'reddit · r/climate', url: 'https://www.reddit.com/r/climate/', source: '行业社区', note: '气候行动社区', kind: 'community' }
    ],
  },
  '节能工程师': {
    videos: [
      { title: '能源管理学习资料', url: 'https://www.bilibili.com/video/BV1Hh4y1z737', source: 'Bilibili', note: '能源管理系统课' },
    ],
    docs: [
      { title: 'reddit · r/climatechange', url: 'https://www.reddit.com/r/climatechange/', source: '行业社区', note: '节能降碳与气候行动社区', kind: 'community' },
{ title: 'DOE 建筑技术办公室（Building Technologies Office）', url: 'https://www.energy.gov/eere/buildings/building-technologies-office', source: '官方文档' }],
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
{ title: 'Energy Management Handbook', author: 'Wayne C. Turner', why: '能源管理与节能改造的实务手册' }],
  },
  '地热工程师': {
    videos: [
      { title: '温差发电到底能发多少电', url: 'https://www.bilibili.com/video/BV1tM4y1w7So', source: 'Bilibili', note: '热能发电原理课' },
    ],
    docs: [
      { title: 'reddit · r/geothermal', url: 'https://www.reddit.com/r/geothermal/', source: '行业社区', note: '地热能全球社区', kind: 'community' },

      { title: 'DOE 地热技术办公室（Geothermal Technologies Office）', url: 'https://www.energy.gov/eere/geothermal/geothermal-technologies-office', source: '官方文档' },
      { title: 'DOE 地热能基础（Geothermal Basics）', url: 'https://www.energy.gov/eere/geothermal/geothermal-basics', source: '官方文档' },
    ],
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
{ title: 'Geothermal Power Plants: Principles, Applications, Case Studies and Environmental Impact', author: 'Ronald DiPippo', why: '地热电站原理与工程案例的专著' }],
  },
  '生物质能工程师': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '新能源赛道：生物质能车结构介绍', url: 'https://www.bilibili.com/video/BV1w2P8eZEQu', source: 'Bilibili', note: '生物质能应用课' },
    ],
    docs: [
      { title: '中国新能源网', url: 'https://www.newenergy.org.cn/', source: '行业社区', note: '新能源综合社区', kind: 'community' },
{ title: 'DOE 生物能源技术办公室（Bioenergy Technologies Office）', url: 'https://www.energy.gov/eere/bioenergy/bioenergy-technologies-office', source: '官方文档' }],
  },
  '充电桩网络规划师': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
    ],
    videos: [{ title: '6.334 Power Electronics（MIT OCW）', url: 'https://ocw.mit.edu/courses/6-334-power-electronics-spring-2007/', source: 'MIT OCW', note: '英文，充电设备的功率电子基础' }],
    docs: [
      { title: 'reddit · r/electricvehicles', url: 'https://www.reddit.com/r/electricvehicles/', source: '行业社区', note: '电动车全球社区', kind: 'community' },
{ title: 'AFDC 充电基础设施（美国替代燃料数据中心）', url: 'https://afdc.energy.gov/fuels/electricity_infrastructure.html', source: '官方文档' }],
  },
  '海洋能研究员': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '潮汐发电怎么发', url: 'https://www.bilibili.com/video/BV1uV411a7PZ', source: 'Bilibili', note: '海洋能科普动画' },
    ],
    docs: [
      { title: '中国能源网', url: 'https://www.china5e.com/', source: '行业社区', note: '综合能源行业社区', kind: 'community' },
{ title: 'DOE 水电与海洋能技术办公室（Water Power Technologies Office）', url: 'https://www.energy.gov/eere/water/water-power-technologies-office', source: '官方文档' }],
  },
  '电力交易员': {
    videos: [
      { title: '电力交易员培训：电力市场化进程', url: 'https://www.bilibili.com/video/BV1BQd8BsEo9', source: 'Bilibili', note: '电力交易系统课' },
    ],
    docs: [
      { title: '索比光伏网', url: 'https://www.solarbe.com/', source: '行业社区', note: '光伏产业媒体与社区', kind: 'community' },
{ title: 'EIA 电力基础（Electricity Explained）', url: 'https://www.eia.gov/energyexplained/electricity/', source: '官方文档' }],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Power System Economics: Designing Markets for Electricity', author: 'Steven Stoft', why: '电力市场设计与定价机制的经典著作' }],
  },
  '能源审计师': {
    videos: [
      { title: '双碳背景下合同能源管理与节能服务', url: 'https://www.bilibili.com/video/BV11N4y1j73v', source: 'Bilibili', note: '合同能源管理课' },
    ],
    docs: [
      { title: '索比光伏网', url: 'https://www.solarbe.com/', source: '行业社区', note: '光伏产业媒体与社区', kind: 'community' },
{ title: 'DOE 建筑技术办公室（Building Technologies Office）', url: 'https://www.energy.gov/eere/buildings/building-technologies-office', source: '官方文档' }],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Energy Management Handbook', author: 'Wayne C. Turner', why: '能源审计与能效评估的实务参考' }],
  },
  '电动汽车电池工程师': {
    videos: [{ title: '10.626 Electrochemical Energy Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '英文，电池电化学基础' }],
    docs: [
      { title: 'reddit · r/electricvehicles', url: 'https://www.reddit.com/r/electricvehicles/', source: '行业社区', note: '电动车全球社区', kind: 'community' },
{ title: 'DOE 电池技术（Batteries）', url: 'https://www.energy.gov/eere/vehicles/batteries', source: '官方文档' }],
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
{ title: 'Battery Management Systems, Volume I: Battery Modeling', author: 'Gregory L. Plett', why: '动力电池建模与管理的专业参考' }],
  },
  '天然气工程师': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '中国燃气采购天然气长期协议的真相', url: 'https://www.bilibili.com/video/BV1XaaP6UEj6', source: 'Bilibili', note: '天然气市场认知' },
    ],
    docs: [
      { title: 'reddit · r/oilandgas', url: 'https://www.reddit.com/r/oilandgas/', source: '行业社区', note: '油气全球社区', kind: 'community' },
{ title: 'EIA 天然气基础（Natural Gas Explained）', url: 'https://www.eia.gov/energyexplained/natural-gas/', source: '官方文档' }],
  },
  '光伏电站项目经理': {
    videos: [
      { title: '为什么还要搞光热电站', url: 'https://www.bilibili.com/video/BV1meNyziEBa', source: 'Bilibili', note: '光热vs光伏原理' },
    ],
    docs: [
      { title: '北极星太阳能光伏网', url: 'https://guangfu.bjx.com.cn/', source: '行业社区', note: '光伏行业资讯与社区', kind: 'community' },
{ title: 'DOE 太阳能技术办公室（Solar Energy Technologies Office）', url: 'https://www.energy.gov/eere/solar/solar-energy-technologies-office', source: '官方文档' }],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Photovoltaic Solar Energy: From Fundamentals to Applications', author: 'Reinders 等', why: '光伏系统设计与项目落地的基础参考' }],
  },
  '能源政策研究员': {
    videos: [
      { title: '保姆级教学：从零开始学双碳', url: 'https://www.bilibili.com/video/BV1aP41167ne', source: 'Bilibili', note: '双碳政策入门课' },
    ],
    docs: [
      { title: 'reddit · r/climatechange', url: 'https://www.reddit.com/r/climatechange/', source: '行业社区', note: '能源与碳政策讨论社区', kind: 'community' },
{ title: '国家能源局', url: 'https://www.nea.gov.cn/', source: '官方文档', note: '中国能源政策与行业规划' }],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Sustainable Energy – Without the Hot Air', author: 'David J.C. MacKay', why: '用数据量化讨论能源选择的入门读物' }],
  },
  '碳中和咨询师': {
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '碳中和愿景下的能源转型：机遇与挑战', url: 'https://www.bilibili.com/video/BV1xU4y137p4', source: 'Bilibili', note: '碳中和咨询视野课' },
    ],
    docs: [
      { title: 'reddit · r/Environment', url: 'https://www.reddit.com/r/Environment/', source: '行业社区', note: '环境议题社区', kind: 'community' },

      { title: 'IPCC 政府间气候变化专门委员会', url: 'https://www.ipcc.ch/', source: '官方文档' },
      { title: 'GHG Protocol 温室气体核算体系', url: 'https://ghgprotocol.org/', source: '官方文档' },
    ],
  },
  'LNG工程师': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '动画演示液化天然气的生产过程', url: 'https://www.bilibili.com/video/BV1vs4117722', source: 'Bilibili', note: 'LNG工艺科普' },
    ],
    docs: [
      { title: 'reddit · r/oilandgas', url: 'https://www.reddit.com/r/oilandgas/', source: '行业社区', note: 'LNG讨论社区', kind: 'community' },
{ title: 'EIA 天然气基础（Natural Gas Explained）', url: 'https://www.eia.gov/energyexplained/natural-gas/', source: '官方文档' }],
  },
  '页岩气工程师': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '页岩气压裂：美国能源逆袭背后的传奇', url: 'https://www.bilibili.com/video/BV1Ckd8BhEjA', source: 'Bilibili', note: '页岩气技术课' },
    ],
    docs: [
      { title: 'reddit · r/oilandgas', url: 'https://www.reddit.com/r/oilandgas/', source: '行业社区', note: '页岩气讨论社区', kind: 'community' },
{ title: 'EIA 天然气基础（Natural Gas Explained）', url: 'https://www.eia.gov/energyexplained/natural-gas/', source: '官方文档' }],
  },
  '微电网工程师': {
    books: [
      { title: '电力系统分析', author: '何仰赞', why: '微电网并网的学科根基' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '分布式电源与微电网（北交大）', url: 'https://www.bilibili.com/video/BV1jk4y1R7EL', source: 'Bilibili', note: '微电网系统课' },
    ],
    docs: [
      { title: '中国新能源网', url: 'https://www.newenergy.org.cn/', source: '行业社区', note: '新能源综合社区', kind: 'community' },
{ title: 'DOE 电网系统（Grid Systems）', url: 'https://www.energy.gov/oe/grid-systems', source: '官方文档' }],
  },
  '压缩空气储能工程师': {
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
    ],
    videos: [
      { title: '什么是盐穴压缩空气储能', url: 'https://www.bilibili.com/video/BV1ud4y1F7Y2', source: 'Bilibili', note: '压缩空气储能原理' },
    ],
    docs: [
      { title: '中国储能网', url: 'https://www.escn.com.cn/', source: '行业社区', note: '储能行业门户社区', kind: 'community' },
{ title: 'DOE 储能（Energy Storage）', url: 'https://www.energy.gov/oe/energy-storage', source: '官方文档' }],
  },
  '电动汽车充电运营': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
    ],
    videos: [
      { title: '电工转行修充电桩：模块维修实务', url: 'https://www.bilibili.com/video/BV1zJT46fE3F', source: 'Bilibili', note: '充电桩技术实务' },
    ],
    docs: [
      { title: 'reddit · r/electricvehicles', url: 'https://www.reddit.com/r/electricvehicles/', source: '行业社区', note: '电动车全球社区', kind: 'community' },
{ title: 'AFDC 充电基础设施（美国替代燃料数据中心）', url: 'https://afdc.energy.gov/fuels/electricity_infrastructure.html', source: '官方文档' }],
  },
  '核废料处理工程师': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '原子弹秘史', author: '理查德·罗兹', why: '核能技术的起源叙事' },
    ],
    videos: [{ title: '22.02 Introduction to Applied Nuclear Physics（MIT OCW）', url: 'https://ocw.mit.edu/courses/22-02-introduction-to-applied-nuclear-physics-spring-2012/', source: 'MIT OCW', note: '英文，核物理与辐射基础' }],
    docs: [
      { title: 'reddit · r/nuclear', url: 'https://www.reddit.com/r/nuclear/', source: '行业社区', note: '核能全球社区', kind: 'community' },
{ title: 'NRC 美国核管理委员会', url: 'https://www.nrc.gov/', source: '官方文档', note: '核安全监管与放射性废物法规' }],
  },
  '虚拟电厂运营师': {
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
    ],
    videos: [
      { title: '虚拟电厂是何宝藏', url: 'https://www.bilibili.com/video/BV1Dx4y1h7ux', source: 'Bilibili', note: '虚拟电厂模式解析' },
    ],
    docs: [
      { title: '中国储能网', url: 'https://www.escn.com.cn/', source: '行业社区', note: '储能行业门户社区', kind: 'community' },

      { title: 'DOE 电网现代化与智能电网', url: 'https://www.energy.gov/oe/grid-modernization-and-smart-grid', source: '官方文档' },
      { title: 'DOE 电力办公室（Office of Electricity）', url: 'https://www.energy.gov/oe/office-electricity', source: '官方文档' },
    ],
  },
  '碳足迹核算师': {
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' }
    ],
    videos: [
      { title: 'ISO 14067产品碳足迹核算及案例实操', url: 'https://www.bilibili.com/video/BV12e411B7vd', source: 'Bilibili', note: '碳足迹核算标准课' }
    ],
    docs: [
      { title: '能源经济学（北京理工大学）', url: 'https://www.icourse163.org/course/BIT-1473949178', source: '中国大学MOOC', note: '碳市场与能源经济核算' },

      { title: '国际能源网', url: 'https://www.in-en.com/', source: '行业社区', note: '能源行业资讯社区', kind: 'community' }
    ],
  },
  '光热发电工程师': {
    videos: [
      { title: '为什么还要搞光热电站', url: 'https://www.bilibili.com/video/BV1meNyziEBa', source: 'Bilibili', note: '光热vs光伏原理' },
    ],
    docs: [
      { title: '北极星太阳能光伏网', url: 'https://guangfu.bjx.com.cn/', source: '行业社区', note: '光伏行业资讯与社区', kind: 'community' },
{ title: 'DOE 太阳能技术办公室（Solar Energy Technologies Office）', url: 'https://www.energy.gov/eere/solar/solar-energy-technologies-office', source: '官方文档' }],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Solar Engineering of Thermal Processes', author: 'John A. Duffie, William A. Beckman', why: '太阳能热利用工程的经典教材' }],
  },
  '潮汐能研究员': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: 'Student Energy：潮汐能', url: 'https://www.bilibili.com/video/BV1Vb411x7hd', source: 'Bilibili', note: '潮汐能国际科普' },
    ],
    docs: [
      { title: '中国能源网', url: 'https://www.china5e.com/', source: '行业社区', note: '综合能源行业社区', kind: 'community' },
{ title: 'DOE 水电与海洋能技术办公室（Water Power Technologies Office）', url: 'https://www.energy.gov/eere/water/water-power-technologies-office', source: '官方文档' }],
  },
  '电力市场分析师': {
    videos: [
      { title: '深度复盘：广西售电危机', url: 'https://www.bilibili.com/video/BV1zHpW6REgx', source: 'Bilibili', note: '售电市场实战复盘' },
    ],
    docs: [
      { title: '索比光伏网', url: 'https://www.solarbe.com/', source: '行业社区', note: '光伏产业媒体与社区', kind: 'community' },
{ title: 'EIA 电力基础（Electricity Explained）', url: 'https://www.eia.gov/energyexplained/electricity/', source: '官方文档' }],
    books: [
      { title: '碳中和经济学', author: '中金公司研究部', why: '碳中和的产业与政策逻辑' },
{ title: 'Power System Economics: Designing Markets for Electricity', author: 'Steven Stoft', why: '电力市场机制与经济分析的经典著作' }],
  },
  '生物燃料工程师': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '新能源赛道：生物质能车结构介绍', url: 'https://www.bilibili.com/video/BV1w2P8eZEQu', source: 'Bilibili', note: '生物质能应用课' },
    ],
    docs: [
      { title: 'reddit · r/Environment', url: 'https://www.reddit.com/r/Environment/', source: '行业社区', note: '生物质讨论社区', kind: 'community' },
{ title: 'DOE 生物能源技术办公室（Bioenergy Technologies Office）', url: 'https://www.energy.gov/eere/bioenergy/bioenergy-technologies-office', source: '官方文档' }],
  },
  '电力系统调度员': {
    videos: [
      { title: '国家电网电工技术课程', url: 'https://www.bilibili.com/video/BV1QG411s7ar', source: 'Bilibili', note: '电力系统基础课' },
    ],
    docs: [
      { title: '北极星电力网', url: 'https://news.bjx.com.cn/', source: '行业社区', note: '电力行业资讯与社区', kind: 'community' },
{ title: 'DOE 电力办公室（Office of Electricity）', url: 'https://www.energy.gov/oe/office-electricity', source: '官方文档' }],
    books: [
      { title: '电力系统分析', author: '何仰赞', why: '调度运行的学科根基' },
{ title: 'Power System Analysis and Design', author: 'J. Duncan Glover, Mulukutla S. Sarma, Thomas Overbye', why: '电力系统分析与运行的经典教材' }],
  },
  '燃气轮机工程师': {
    docs: [
      { title: '中国能源网', url: 'https://www.china5e.com/', source: '行业社区', note: '综合能源行业社区', kind: 'community' },

      { title: '工程热力学（电子科技大学）', url: 'https://www.icourse163.org/course/UESTC-1002535024', source: '中国大学MOOC', note: '燃气轮机热力循环的理论根基' },
    ],
    videos: [
      { title: '燃气联合循环电厂现场实拍：主要设备讲解', url: 'https://www.bilibili.com/video/BV1Cv4y1K7J5', source: 'Bilibili', note: '燃气轮机电厂实录' },
    ],
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
{ title: 'Gas Turbine Theory', author: 'H.I.H. Saravanamuttoo 等', why: '燃气轮机热力学与设计的经典教材' }],
  },
  '能源互联网工程师': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
    ],
    videos: [
      { title: '一条看懂绿电直连、微电网、虚拟电厂和源网荷储', url: 'https://www.bilibili.com/video/BV1ak9NBqE4g', source: 'Bilibili', note: '能源互联网全景课' },
    ],
    docs: [
      { title: '中国新能源网', url: 'https://www.newenergy.org.cn/', source: '行业社区', note: '新能源综合社区', kind: 'community' },
{ title: 'DOE 电网现代化与智能电网', url: 'https://www.energy.gov/oe/grid-modernization-and-smart-grid', source: '官方文档' }],
  },
  '海上风电工程师': {
    books: [
      { title: '能源与文明', author: '瓦茨拉夫·斯米尔', why: '能源史的宏观视野' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的宏观路线图' },
    ],
    videos: [
      { title: '风电运维工程师：海上吃饭住宿怎么样', url: 'https://www.bilibili.com/video/BV1Qb411o74r', source: 'Bilibili', note: '海上风电运维实录' },
    ],
    docs: [
      { title: 'reddit · r/energy', url: 'https://www.reddit.com/r/energy/', source: '行业社区', note: '能源全球社区', kind: 'community' },
{ title: 'DOE 海上风电研发（Offshore Wind R&D）', url: 'https://www.energy.gov/eere/wind/offshore-wind-research-and-development', source: '官方文档' }],
  },
};
