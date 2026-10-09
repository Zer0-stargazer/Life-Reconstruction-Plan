import type { CareerResourceSet } from '../career-resources';

export const energyResources: Record<string, CareerResourceSet> = {
  '光伏系统工程师': {
    videos: [{ title: '2.627 Fundamentals of Photovoltaics（MIT OCW）', url: 'https://ocw.mit.edu/courses/2-627-fundamentals-of-photovoltaics-fall-2013/', source: 'MIT OCW', note: '英文，光伏电池原理与系统基础' }],
    docs: [{ title: 'DOE 光伏技术（Photovoltaics）', url: 'https://www.energy.gov/eere/solar/photovoltaics', source: '官方文档' }],
    books: [{ title: 'Photovoltaic Solar Energy: From Fundamentals to Applications', author: 'Reinders 等', why: '光伏从原理到系统应用的系统教材' }],
  },
  '风电场运维工程师': {
    docs: [{ title: 'DOE 风能技术办公室（Wind Energy Technologies Office）', url: 'https://www.energy.gov/eere/wind/wind-energy-technologies-office', source: '官方文档' }],
    books: [{ title: 'Wind Energy Explained: Theory, Design and Application', author: 'Manwell, McGowan, Rogers', why: '风电原理、设计与运行的经典参考书' }],
  },
  '储能系统工程师': {
    videos: [{ title: '10.626 Electrochemical Energy Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '英文，电化学储能系统' }],
    docs: [{ title: 'DOE 储能（Energy Storage）', url: 'https://www.energy.gov/oe/energy-storage', source: '官方文档' }],
    books: [{ title: 'Battery Management Systems, Volume I: Battery Modeling', author: 'Gregory L. Plett', why: '电池建模与管理系统的入门专著' }],
  },
  '氢能研发工程师': {
    docs: [
      { title: 'DOE 氢能与燃料电池技术办公室', url: 'https://www.energy.gov/eere/fuelcells/hydrogen-and-fuel-cell-technologies-office', source: '官方文档' },
      { title: 'DOE 制氢技术（Hydrogen Production）', url: 'https://www.energy.gov/eere/fuelcells/hydrogen-production', source: '官方文档' },
      { title: 'DOE 储氢技术（Hydrogen Storage）', url: 'https://www.energy.gov/eere/fuelcells/hydrogen-storage', source: '官方文档' },
    ],
    books: [{ title: 'The Hydrogen Economy', author: 'Jeremy Rifkin', why: '氢能产业与能源转型的通俗读物' }],
  },
  '核电站操作员': {
    videos: [{ title: '22.06 Engineering of Nuclear Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/22-06-engineering-of-nuclear-systems-fall-2010/', source: 'MIT OCW', note: '英文，核系统工程基础' }],
    docs: [{ title: 'DOE 核反应堆技术（Nuclear Reactor Technologies）', url: 'https://www.energy.gov/ne/nuclear-reactor-technologies', source: '官方文档' }],
    books: [{ title: 'Nuclear Reactor Engineering', author: 'Samuel Glasstone, Alexander Sesonske', why: '反应堆工程原理的经典教材' }],
  },
  '智能电网工程师': {
    docs: [{ title: 'DOE 电网现代化与智能电网', url: 'https://www.energy.gov/oe/grid-modernization-and-smart-grid', source: '官方文档' }],
    books: [{ title: 'Smart Grid: Technology and Applications', author: 'Janaka Ekanayake 等', why: '智能电网技术与应用的综合教材' }],
  },
  '碳资产管理师': {
    docs: [
      { title: 'GHG Protocol 温室气体核算体系', url: 'https://ghgprotocol.org/', source: '官方文档', note: '企业碳核算的国际标准' },
      { title: 'IPCC 政府间气候变化专门委员会', url: 'https://www.ipcc.ch/', source: '官方文档' },
    ],
  },
  '节能工程师': {
    docs: [{ title: 'DOE 建筑技术办公室（Building Technologies Office）', url: 'https://www.energy.gov/eere/buildings/building-technologies-office', source: '官方文档' }],
    books: [{ title: 'Energy Management Handbook', author: 'Wayne C. Turner', why: '能源管理与节能改造的实务手册' }],
  },
  '地热工程师': {
    docs: [
      { title: 'DOE 地热技术办公室（Geothermal Technologies Office）', url: 'https://www.energy.gov/eere/geothermal/geothermal-technologies-office', source: '官方文档' },
      { title: 'DOE 地热能基础（Geothermal Basics）', url: 'https://www.energy.gov/eere/geothermal/geothermal-basics', source: '官方文档' },
    ],
    books: [{ title: 'Geothermal Power Plants: Principles, Applications, Case Studies and Environmental Impact', author: 'Ronald DiPippo', why: '地热电站原理与工程案例的专著' }],
  },
  '生物质能工程师': {
    docs: [{ title: 'DOE 生物能源技术办公室（Bioenergy Technologies Office）', url: 'https://www.energy.gov/eere/bioenergy/bioenergy-technologies-office', source: '官方文档' }],
  },
  '充电桩网络规划师': {
    videos: [{ title: '6.334 Power Electronics（MIT OCW）', url: 'https://ocw.mit.edu/courses/6-334-power-electronics-spring-2007/', source: 'MIT OCW', note: '英文，充电设备的功率电子基础' }],
    docs: [{ title: 'AFDC 充电基础设施（美国替代燃料数据中心）', url: 'https://afdc.energy.gov/fuels/electricity_infrastructure.html', source: '官方文档' }],
  },
  '海洋能研究员': {
    docs: [{ title: 'DOE 水电与海洋能技术办公室（Water Power Technologies Office）', url: 'https://www.energy.gov/eere/water/water-power-technologies-office', source: '官方文档' }],
  },
  '电力交易员': {
    docs: [{ title: 'EIA 电力基础（Electricity Explained）', url: 'https://www.eia.gov/energyexplained/electricity/', source: '官方文档' }],
    books: [{ title: 'Power System Economics: Designing Markets for Electricity', author: 'Steven Stoft', why: '电力市场设计与定价机制的经典著作' }],
  },
  '能源审计师': {
    docs: [{ title: 'DOE 建筑技术办公室（Building Technologies Office）', url: 'https://www.energy.gov/eere/buildings/building-technologies-office', source: '官方文档' }],
    books: [{ title: 'Energy Management Handbook', author: 'Wayne C. Turner', why: '能源审计与能效评估的实务参考' }],
  },
  '电动汽车电池工程师': {
    videos: [{ title: '10.626 Electrochemical Energy Systems（MIT OCW）', url: 'https://ocw.mit.edu/courses/10-626-electrochemical-energy-systems-spring-2014/', source: 'MIT OCW', note: '英文，电池电化学基础' }],
    docs: [{ title: 'DOE 电池技术（Batteries）', url: 'https://www.energy.gov/eere/vehicles/batteries', source: '官方文档' }],
    books: [{ title: 'Battery Management Systems, Volume I: Battery Modeling', author: 'Gregory L. Plett', why: '动力电池建模与管理的专业参考' }],
  },
  '天然气工程师': {
    docs: [{ title: 'EIA 天然气基础（Natural Gas Explained）', url: 'https://www.eia.gov/energyexplained/natural-gas/', source: '官方文档' }],
  },
  '光伏电站项目经理': {
    docs: [{ title: 'DOE 太阳能技术办公室（Solar Energy Technologies Office）', url: 'https://www.energy.gov/eere/solar/solar-energy-technologies-office', source: '官方文档' }],
    books: [{ title: 'Photovoltaic Solar Energy: From Fundamentals to Applications', author: 'Reinders 等', why: '光伏系统设计与项目落地的基础参考' }],
  },
  '能源政策研究员': {
    docs: [{ title: '国家能源局', url: 'https://www.nea.gov.cn/', source: '官方文档', note: '中国能源政策与行业规划' }],
    books: [{ title: 'Sustainable Energy – Without the Hot Air', author: 'David J.C. MacKay', why: '用数据量化讨论能源选择的入门读物' }],
  },
  '碳中和咨询师': {
    docs: [
      { title: 'IPCC 政府间气候变化专门委员会', url: 'https://www.ipcc.ch/', source: '官方文档' },
      { title: 'GHG Protocol 温室气体核算体系', url: 'https://ghgprotocol.org/', source: '官方文档' },
    ],
  },
  'LNG工程师': {
    docs: [{ title: 'EIA 天然气基础（Natural Gas Explained）', url: 'https://www.eia.gov/energyexplained/natural-gas/', source: '官方文档' }],
  },
  '页岩气工程师': {
    docs: [{ title: 'EIA 天然气基础（Natural Gas Explained）', url: 'https://www.eia.gov/energyexplained/natural-gas/', source: '官方文档' }],
  },
  '微电网工程师': {
    docs: [{ title: 'DOE 电网系统（Grid Systems）', url: 'https://www.energy.gov/oe/grid-systems', source: '官方文档' }],
  },
  '压缩空气储能工程师': {
    docs: [{ title: 'DOE 储能（Energy Storage）', url: 'https://www.energy.gov/oe/energy-storage', source: '官方文档' }],
  },
  '电动汽车充电运营': {
    docs: [{ title: 'AFDC 充电基础设施（美国替代燃料数据中心）', url: 'https://afdc.energy.gov/fuels/electricity_infrastructure.html', source: '官方文档' }],
  },
  '核废料处理工程师': {
    videos: [{ title: '22.02 Introduction to Applied Nuclear Physics（MIT OCW）', url: 'https://ocw.mit.edu/courses/22-02-introduction-to-applied-nuclear-physics-spring-2012/', source: 'MIT OCW', note: '英文，核物理与辐射基础' }],
    docs: [{ title: 'NRC 美国核管理委员会', url: 'https://www.nrc.gov/', source: '官方文档', note: '核安全监管与放射性废物法规' }],
  },
  '虚拟电厂运营师': {
    docs: [
      { title: 'DOE 电网现代化与智能电网', url: 'https://www.energy.gov/oe/grid-modernization-and-smart-grid', source: '官方文档' },
      { title: 'DOE 电力办公室（Office of Electricity）', url: 'https://www.energy.gov/oe/office-electricity', source: '官方文档' },
    ],
  },
  '碳足迹核算师': {
    docs: [
      { title: 'GHG Protocol 温室气体核算体系', url: 'https://ghgprotocol.org/', source: '官方文档', note: '碳足迹核算的核心标准' },
      { title: 'IPCC 政府间气候变化专门委员会', url: 'https://www.ipcc.ch/', source: '官方文档' },
    ],
  },
  '光热发电工程师': {
    docs: [{ title: 'DOE 太阳能技术办公室（Solar Energy Technologies Office）', url: 'https://www.energy.gov/eere/solar/solar-energy-technologies-office', source: '官方文档' }],
    books: [{ title: 'Solar Engineering of Thermal Processes', author: 'John A. Duffie, William A. Beckman', why: '太阳能热利用工程的经典教材' }],
  },
  '潮汐能研究员': {
    docs: [{ title: 'DOE 水电与海洋能技术办公室（Water Power Technologies Office）', url: 'https://www.energy.gov/eere/water/water-power-technologies-office', source: '官方文档' }],
  },
  '电力市场分析师': {
    docs: [{ title: 'EIA 电力基础（Electricity Explained）', url: 'https://www.eia.gov/energyexplained/electricity/', source: '官方文档' }],
    books: [{ title: 'Power System Economics: Designing Markets for Electricity', author: 'Steven Stoft', why: '电力市场机制与经济分析的经典著作' }],
  },
  '生物燃料工程师': {
    docs: [{ title: 'DOE 生物能源技术办公室（Bioenergy Technologies Office）', url: 'https://www.energy.gov/eere/bioenergy/bioenergy-technologies-office', source: '官方文档' }],
  },
  '电力系统调度员': {
    docs: [{ title: 'DOE 电力办公室（Office of Electricity）', url: 'https://www.energy.gov/oe/office-electricity', source: '官方文档' }],
    books: [{ title: 'Power System Analysis and Design', author: 'J. Duncan Glover, Mulukutla S. Sarma, Thomas Overbye', why: '电力系统分析与运行的经典教材' }],
  },
  '燃气轮机工程师': {
    books: [{ title: 'Gas Turbine Theory', author: 'H.I.H. Saravanamuttoo 等', why: '燃气轮机热力学与设计的经典教材' }],
  },
  '能源互联网工程师': {
    docs: [{ title: 'DOE 电网现代化与智能电网', url: 'https://www.energy.gov/oe/grid-modernization-and-smart-grid', source: '官方文档' }],
  },
  '海上风电工程师': {
    docs: [{ title: 'DOE 海上风电研发（Offshore Wind R&D）', url: 'https://www.energy.gov/eere/wind/offshore-wind-research-and-development', source: '官方文档' }],
  },
};
