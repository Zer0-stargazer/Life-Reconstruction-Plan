import type { CareerResourceSet } from '../career-resources';

export const scienceResources: Record<string, CareerResourceSet> = {
  '材料科学家': {
    videos: [{ title: '3.091SC 固体化学导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/3-091sc-introduction-to-solid-state-chemistry-fall-2010/', source: 'MIT OCW' }],
    docs: [{ title: 'NIST 美国国家标准与技术研究院', url: 'https://www.nist.gov/', source: '官方文档' }],
    books: [{ title: 'Materials Science and Engineering: An Introduction', author: 'William D. Callister Jr.', why: '材料科学入门经典教材' }],
  },
  '基因编辑研究员': {
    videos: [{ title: '7.01SC 生物学基础（MIT OCW）', url: 'https://ocw.mit.edu/courses/7-01sc-fundamentals-of-biology-fall-2011/', source: 'MIT OCW' }],
    docs: [{ title: 'Nature 期刊（前沿研究）', url: 'https://www.nature.com/', source: '官方文档' }],
    books: [{ title: 'A Crack in Creation', author: 'Jennifer Doudna / Samuel Sternberg', why: 'CRISPR 发明者亲述基因编辑历程' }],
  },
  '计算生物学家': {
    videos: [{ title: '7.012 生物学导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/7-012-introduction-to-biology-fall-2004/', source: 'MIT OCW' }],
    docs: [{ title: 'NIH 美国国立卫生研究院', url: 'https://www.nih.gov/', source: '官方文档' }],
    books: [{ title: 'Biological Sequence Analysis', author: 'Richard Durbin 等', why: '生物序列分析的经典计算方法' }],
  },
  '认知科学家': {
    docs: [{ title: 'NSF 美国国家科学基金会', url: 'https://www.nsf.gov/', source: '官方文档' }],
    books: [{ title: 'How the Mind Works', author: 'Steven Pinker', why: '认知科学通俗而系统的入门读物' }],
  },
  '核物理学家': {
    docs: [{ title: 'IAEA 国际原子能机构', url: 'https://www.iaea.org/', source: '官方文档' }],
  },
  '海洋学家': {
    docs: [{ title: 'NOAA 美国国家海洋和大气管理局', url: 'https://www.noaa.gov/', source: '官方文档' }],
    books: [{ title: 'The Sea Around Us', author: 'Rachel Carson', why: '海洋科学的经典科普名著' }],
  },
  '考古学家': {
    books: [{ title: 'Archaeology: Theories, Methods and Practice', author: 'Colin Renfrew / Paul Bahn', why: '考古学理论与方法的标准教材' }],
  },
  '机器人学研究员': {
    videos: [{ title: '6.832 欠驱动机器人学（MIT OCW）', url: 'https://ocw.mit.edu/courses/6-832-underactuated-robotics-spring-2009/', source: 'MIT OCW' }],
    docs: [{ title: 'NSF 美国国家科学基金会', url: 'https://www.nsf.gov/', source: '官方文档' }],
    books: [{ title: 'Modern Robotics', author: 'Kevin M. Lynch / Frank C. Park', why: '机器人运动学与控制的系统教材' }],
  },
  '能源科学家': {
    books: [{ title: 'Sustainable Energy – Without the Hot Air', author: 'David J.C. MacKay', why: '用数据量化讨论可持续能源的入门读物' }],
  },
  '农业科学家': {
    docs: [{ title: 'FAO 联合国粮农组织', url: 'https://www.fao.org/home/en', source: '官方文档' }],
  },
  '药物化学家': {
    videos: [{ title: '5.111SC 化学科学原理（MIT OCW）', url: 'https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/', source: 'MIT OCW' }],
    docs: [{ title: 'NIH 美国国立卫生研究院', url: 'https://www.nih.gov/', source: '官方文档' }],
  },
  '合成生物学家': {
    videos: [{ title: '7.012 生物学导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/7-012-introduction-to-biology-fall-2004/', source: 'MIT OCW' }],
    docs: [{ title: 'Nature 期刊（前沿研究）', url: 'https://www.nature.com/', source: '官方文档' }],
    books: [{ title: 'Synthetic Biology: A Very Short Introduction', author: 'Jamie A. Davies', why: '合成生物学的简明入门' }],
  },
  '大气物理学家': {
    docs: [{ title: 'IPCC 政府间气候变化专门委员会', url: 'https://www.ipcc.ch/', source: '官方文档' }],
    books: [{ title: 'Atmospheric Science: An Introductory Survey', author: 'John M. Wallace / Peter V. Hobbs', why: '大气科学的标准入门教材' }],
  },
  '古生物学家': {
    docs: [{ title: 'Nature 期刊（前沿研究）', url: 'https://www.nature.com/', source: '官方文档' }],
    books: [{ title: 'Wonderful Life', author: 'Stephen Jay Gould', why: '寒武纪生命大爆发的经典科普' }],
  },
  '地震学家': {
    docs: [{ title: 'USGS 美国地质调查局地震项目', url: 'https://earthquake.usgs.gov/', source: '官方文档' }],
    books: [{ title: 'Earthquakes', author: 'Bruce A. Bolt', why: '地震学的经典入门教材' }],
  },
  '水文学家': {
    docs: [{ title: 'USGS 美国地质调查局', url: 'https://www.usgs.gov/', source: '官方文档' }],
  },
  '营养科学研究员': {
    docs: [{ title: 'NIH 美国国立卫生研究院', url: 'https://www.nih.gov/', source: '官方文档' }],
  },
  '理论物理学家': {
    videos: [{ title: '8.01SC 经典力学（MIT OCW）', url: 'https://ocw.mit.edu/courses/8-01sc-classical-mechanics-fall-2016/', source: 'MIT OCW' }],
    books: [{ title: 'The Theoretical Minimum', author: 'Leonard Susskind / George Hrabovsky', why: '从零理解理论物理的入门读物' }],
  },
  '化学生物学家': {
    videos: [{ title: '5.111SC 化学科学原理（MIT OCW）', url: 'https://ocw.mit.edu/courses/5-111sc-principles-of-chemical-science-fall-2014/', source: 'MIT OCW' }],
    docs: [{ title: 'Nature 期刊（前沿研究）', url: 'https://www.nature.com/', source: '官方文档' }],
  },
  '宇宙学家': {
    docs: [{ title: 'NASA 美国国家航空航天局', url: 'https://www.nasa.gov/', source: '官方文档' }],
    books: [{ title: 'Cosmos', author: 'Carl Sagan', why: '宇宙科学的经典科普名著' }],
  },
  '数据驱动材料发现': {
    docs: [{ title: 'NIST 美国国家标准与技术研究院', url: 'https://www.nist.gov/', source: '官方文档' }],
  },
  '脑机接口研究员': {
    videos: [{ title: '9.40 神经计算导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/9-40-introduction-to-neural-computation-spring-2018/', source: 'MIT OCW', note: '偏神经计算基础，与脑机接口相关' }],
    docs: [{ title: 'Nature 期刊（前沿研究）', url: 'https://www.nature.com/', source: '官方文档' }],
  },
  '古基因组学家': {
    docs: [{ title: 'Nature 期刊（前沿研究）', url: 'https://www.nature.com/', source: '官方文档' }],
    books: [{ title: 'Who We Are and How We Got Here', author: 'David Reich', why: '古DNA研究如何重写人类历史' }],
  },
  '计算神经科学家': {
    videos: [{ title: '9.40 神经计算导论（MIT OCW）', url: 'https://ocw.mit.edu/courses/9-40-introduction-to-neural-computation-spring-2018/', source: 'MIT OCW' }],
    docs: [{ title: 'NSF 美国国家科学基金会', url: 'https://www.nsf.gov/', source: '官方文档' }],
    books: [{ title: 'Theoretical Neuroscience', author: 'Peter Dayan / L.F. Abbott', why: '计算神经科学的经典教材' }],
  },
  '生物物理学家': {
    docs: [{ title: 'NSF 美国国家科学基金会', url: 'https://www.nsf.gov/', source: '官方文档' }],
    books: [{ title: 'Physical Biology of the Cell', author: 'Rob Phillips 等', why: '用物理视角理解细胞的经典教材' }],
  },
  '环境毒理学家': {
    docs: [{ title: 'NIH 美国国立卫生研究院', url: 'https://www.nih.gov/', source: '官方文档' }],
    books: [{ title: 'Silent Spring', author: 'Rachel Carson', why: '环境毒理研究的奠基性著作' }],
  },
  '法医人类学家': {
    books: [{ title: 'Written in Bone', author: 'Sue Black', why: '法医人类学家讲述骨骼鉴定的真实案例' }],
  },
};
