import type { CareerResourceSet } from '../career-resources';

export const gapResourcesA: Record<string, CareerResourceSet> = {
  '流媒体工程师': {
    docs: [
      { title: 'FFmpeg 官方文档', url: 'https://ffmpeg.org/documentation.html', source: '官方文档', note: '音视频编解码、转封装与流处理的权威工具手册' },
      { title: 'RFC 8216：HTTP Live Streaming（HLS）', url: 'https://datatracker.ietf.org/doc/html/rfc8216', source: 'IETF', note: 'Apple HLS 协议的正式规范' },
      { title: 'DASH-IF 官网', url: 'https://dashif.org/', source: 'DASH-IF', note: 'MPEG-DASH 行业联盟，提供实现指南与一致性资料' },
    ],
  },
  '对日软件开发': {
    docs: [
      { title: 'IPA 独立行政法人情报处理推进机构 · 资格考试', url: 'https://www.ipa.go.jp/shiken/index.html', source: '官方文档', note: '日本信息技术资格考试（基本情报、应用情报等）官方页面，适合对日 IT 从业者对标' },
    ],
  },
  '支付系统工程师': {
    videos: [
      { title: 'edX: FinTech（金融科技）', url: 'https://www.edx.org/learn/fintech', source: 'edX', note: '英文，金融科技与支付基础概念概览' },
    ],
    docs: [
      { title: 'PCI SSC 文档库', url: 'https://www.pcisecuritystandards.org/document_library/', source: 'PCI SSC', note: '支付卡行业数据安全标准（PCI DSS）等官方规范' },
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn', source: '官方文档', note: '支付结算管理办法与支付机构监管政策入口' },
    ],
  },
  '系统集成工程师': {
    videos: [
      { title: 'MIT OCW 6.033：Computer System Engineering（计算机系统工程）', url: 'https://ocw.mit.edu/courses/6-033-computer-system-engineering-spring-2018/', source: 'MIT OCW', note: '英文，系统架构与可靠性设计的经典课程' },
    ],
    docs: [
      { title: '全国计算机技术与软件专业技术资格（水平）考试', url: 'https://www.ruankao.org.cn/', source: '官方文档', note: '软考官网，系统集成项目管理等考试信息' },
    ],
  },
  '留学规划师': {
    docs: [
      { title: '中国留学服务网（教育部留学服务中心）', url: 'https://www.cscse.edu.cn/', source: '官方文档', note: '留学政策、学历认证与院校信息的官方入口' },
      { title: 'ETS TOEFL 官方页面', url: 'https://www.ets.org/toefl.html', source: 'ETS', note: '托福考试官方信息，规划语言成绩时参考' },
    ],
  },
  '园林设计师': {
    docs: [
      { title: '中国风景园林学会', url: 'https://www.chsla.org.cn/', source: '行业协会', note: '行业标准、学术活动与从业资讯' },
      { title: '住房和城乡建设部', url: 'https://www.mohurd.gov.cn', source: '官方文档', note: '城市绿地与园林相关规范、政策入口' },
    ],
  },
  '珠宝设计师': {
    docs: [
      { title: 'GIA 美国宝石学院', url: 'https://www.gia.edu/', source: 'GIA', note: '宝石学与钻石分级的权威机构，学习材质知识的起点' },
    ],
  },
  '房地产经纪人': {
    docs: [
      { title: '住房和城乡建设部', url: 'https://www.mohurd.gov.cn', source: '官方文档', note: '房地产交易与经纪行业管理政策入口（信息较宽泛，需自行筛选）' },
    ],
  },
  '二手车评估师': {
    docs: [
      { title: '商务部', url: 'https://www.mofcom.gov.cn', source: '官方文档', note: '二手车流通与交易政策入口（页面较宽泛，需自行检索）' },
    ],
  },
  '茶艺师': {
    docs: [
      { title: '人力资源和社会保障部', url: 'https://www.mohrss.gov.cn', source: '官方文档', note: '国家职业技能标准与职业资格信息入口（需自行检索“茶艺师”）' },
    ],
  },
  '家教平台运营': {
    docs: [
      { title: '教育部', url: 'https://www.moe.gov.cn', source: '官方文档', note: '校外培训与课外辅导相关政策入口，运营前必须了解合规要求' },
    ],
  },
  '技术布道师': {
    docs: [
      { title: 'MDN Web 文档 · 学习区（中文）', url: 'https://developer.mozilla.org/zh-CN/docs/Learn', source: 'MDN', note: '前端与 Web 技术的权威中文教程，技术内容输出的基础素材' },
    ],
  },
  '元宇宙架构师': {
    docs: [
      { title: 'Metaverse Standards Forum（元宇宙标准论坛）', url: 'https://metaverse-standards.org/', source: '行业标准', note: '元宇宙互操作性与标准化的行业组织' },
      { title: 'Khronos glTF 3D 资产格式规范', url: 'https://www.khronos.org/gltf/', source: 'Khronos', note: '3D 资产传输的主流开放标准，元宇宙场景常用格式' },
    ],
  },
  '直播电商操盘手': {
    docs: [
      { title: '商务部', url: 'https://www.mofcom.gov.cn', source: '官方文档', note: '电子商务与直播电商相关政策入口（页面较宽泛，需自行检索）' },
    ],
  },
  '初级生物信息学家': {
    videos: [
      { title: 'Coursera: Bioinformatics Specialization（生物信息学专项课程）', url: 'https://www.coursera.org/specializations/bioinformatics', source: 'Coursera', note: '英文，从序列分析到基因组学的系统入门' },
      { title: 'edX: Bioinformatics（生物信息学）', url: 'https://www.edx.org/learn/bioinformatics', source: 'edX', note: '英文，生物信息学基础概念与工具' },
      { title: 'Coursera: DNA Sequencing（DNA 测序）', url: 'https://www.coursera.org/learn/dna-sequencing', source: 'Coursera', note: '英文，测序数据的生物学背景与分析思路' },
    ],
    books: [
      { title: 'Bioinformatics Algorithms: An Active Learning Approach（生物信息学算法：主动学习方法）', author: 'Phillip Compeau、Pavel Pevzner', why: '从算法角度讲解生物信息学，适合编程背景的入门者' },
    ],
  },
  '高级生物信息学家': {
    videos: [
      { title: 'Coursera: Bioinformatics Specialization（生物信息学专项课程）', url: 'https://www.coursera.org/specializations/bioinformatics', source: 'Coursera', note: '英文，可作为进阶前的系统复习' },
      { title: 'edX: Bioinformatics（生物信息学）', url: 'https://www.edx.org/learn/bioinformatics', source: 'edX', note: '英文，复习基础概念' },
    ],
    books: [
      { title: 'Bioinformatics Algorithms: An Active Learning Approach（生物信息学算法：主动学习方法）', author: 'Phillip Compeau、Pavel Pevzner', why: '算法层面的深入理解，适合进阶研究与工具开发' },
    ],
  },
};
