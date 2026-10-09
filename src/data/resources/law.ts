import type { CareerResourceSet } from '../career-resources';

export const lawResources: Record<string, CareerResourceSet> = {
  '知识产权律师': {
    videos: [
      { title: 'PennX: Intellectual Property Law and Policy Part 1（宾大知识产权法与政策 第一部分）', url: 'https://www.edx.org/learn/intellectual-property/university-of-pennsylvania-intellectual-property-law-and-policy-part-1', source: 'edX', note: '英文，系统梳理知识产权制度' },
      { title: 'PennX: Intellectual Property Law and Policy Part 2（宾大知识产权法与政策 第二部分）', url: 'https://www.edx.org/learn/intellectual-property/university-of-pennsylvania-intellectual-property-law-and-policy-part-2', source: 'edX', note: '英文，延续第一部分' },
    ],
    docs: [
      { title: '国家知识产权局', url: 'https://www.cnipa.gov.cn', source: '官方文档', note: '专利、商标等政策与法规入口' },
      { title: 'WIPO Academy 知识产权学院', url: 'https://www.wipo.int/academy/en/', source: 'WIPO', note: '世界知识产权组织免费课程' },
    ],
    books: [{ title: '知识产权基本问题', author: '吴汉东（主编）', why: '国内知识产权理论入门的常用教材' }],
  },
  '数据隐私官': {
    videos: [
      { title: 'EdinburghX: Data Ethics, AI and Responsible Innovation', url: 'https://www.edx.org/learn/artificial-intelligence/the-university-of-edinburgh-data-ethics-ai-and-responsible-innovation', source: 'edX', note: '英文，数据伦理与负责任创新' },
    ],
    docs: [
      { title: '国家互联网信息办公室', url: 'https://www.cac.gov.cn', source: '官方文档', note: '数据安全与个人信息保护政策' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询《个人信息保护法》等原文' },
    ],
    books: [{ title: 'Understanding Privacy（隐私的理解）', author: 'Daniel J. Solove', why: '隐私理论经典，帮助理解隐私保护的核心逻辑' }],
  },
  '法务总监': {
    videos: [
      { title: 'HarvardX: Contract Law: From Trust to Promise to Contract', url: 'https://www.edx.org/learn/business-law/harvard-university-contract-law-from-trust-to-promise-to-contract', source: 'edX', note: '英文，合同法基础' },
    ],
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询公司法、合同法等法规原文' },
      { title: '北大法宝', url: 'https://www.pkulaw.com', source: '北大法宝', note: '法规、案例与法律文献检索（商业数据库）' },
    ],
  },
  '公司法务': {
    videos: [
      { title: 'HarvardX: Contract Law: From Trust to Promise to Contract', url: 'https://www.edx.org/learn/business-law/harvard-university-contract-law-from-trust-to-promise-to-contract', source: 'edX', note: '英文，合同法基础' },
    ],
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询公司法等法规原文' },
      { title: '北大法宝', url: 'https://www.pkulaw.com', source: '北大法宝', note: '法规与案例检索（商业数据库）' },
    ],
  },
  '刑事辩护律师': {
    docs: [
      { title: '中国裁判文书网', url: 'https://wenshu.court.gov.cn', source: '官方文档', note: '检索刑事判决书，学习辩护思路' },
      { title: '最高人民检察院', url: 'https://www.spp.gov.cn', source: '官方文档', note: '检察机关发布的案件与政策' },
    ],
    books: [{ title: '刑事诉讼的前沿问题', author: '陈瑞华', why: '刑事程序与辩护理论的代表作' }],
  },
  '知识产权顾问': {
    videos: [
      { title: 'PennX: Intellectual Property Law and Policy Part 1（宾大知识产权法与政策 第一部分）', url: 'https://www.edx.org/learn/intellectual-property/university-of-pennsylvania-intellectual-property-law-and-policy-part-1', source: 'edX', note: '英文，知识产权制度概览' },
    ],
    docs: [
      { title: '国家知识产权局', url: 'https://www.cnipa.gov.cn', source: '官方文档', note: '专利、商标等政策入口' },
      { title: 'WIPO PCT 专利合作条约', url: 'https://www.wipo.int/pct/en/', source: 'WIPO', note: '国际专利申请制度官方页面' },
      { title: 'WIPO Academy 知识产权学院', url: 'https://www.wipo.int/academy/en/', source: 'WIPO', note: '免费知识产权课程' },
    ],
  },
  '税法顾问': {
    docs: [
      { title: '国家税务总局', url: 'https://www.chinatax.gov.cn', source: '官方文档', note: '税收政策与法规发布' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询税收相关法律原文' },
    ],
  },
  '法律科技产品经理': {
    videos: [
      { title: 'HarvardX: CS50 for Lawyers（哈佛法律人的计算机科学）', url: 'https://www.edx.org/learn/computer-science/harvard-university-cs50-s-computer-science-for-lawyers', source: 'edX', note: '英文，面向法律人的编程与计算思维' },
    ],
    docs: [
      { title: '中国法院网', url: 'https://www.court.gov.cn', source: '官方文档', note: '了解智慧法院等司法信息化场景' },
    ],
    books: [{ title: 'Tomorrow\'s Lawyers（明日律师）', author: 'Richard Susskind', why: '讲解法律科技如何改变法律服务的经典著作' }],
  },
  '法律研究员': {
    docs: [
      { title: '中国裁判文书网', url: 'https://wenshu.court.gov.cn', source: '官方文档', note: '法律实证研究的一手裁判材料' },
      { title: '北大法宝', url: 'https://www.pkulaw.com', source: '北大法宝', note: '法规、案例与学术文献检索（商业数据库）' },
    ],
    books: [{ title: '送法下乡', author: '苏力', why: '从基层司法实践切入的法社会学经典' }],
  },
  '法律翻译': {
    docs: [
      { title: 'WTO 争端解决（英文）', url: 'https://www.wto.org/english/tratop_e/dispu_e/dispu_e.htm', source: 'WTO', note: '英文法律文本与裁决的原始材料' },
      { title: 'WIPO 知识产权条约（英文）', url: 'https://www.wipo.int/treaties/en/', source: 'WIPO', note: '国际条约英文原文' },
    ],
  },
  '破产管理人': {
    docs: [
      { title: '中国法院网', url: 'https://www.court.gov.cn', source: '官方文档', note: '查询最高法破产相关司法解释与案例发布' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询《企业破产法》原文' },
    ],
  },
  '环境法律师': {
    docs: [
      { title: '生态环境部业务工作', url: 'https://www.mee.gov.cn/ywgz/', source: '官方文档', note: '环境政策与执法信息' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询《环境保护法》等原文' },
    ],
  },
  '反垄断律师': {
    docs: [
      { title: '国家市场监督管理总局', url: 'https://www.samr.gov.cn', source: '官方文档', note: '反垄断执法与经营者集中公告' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询《反垄断法》原文' },
    ],
    books: [{ title: '反垄断法', author: '王晓晔', why: '国内反垄断法体系的代表性教材' }],
  },
  '婚姻家事律师': {
    docs: [
      { title: '中国法院网', url: 'https://www.court.gov.cn', source: '官方文档', note: '查阅婚姻家庭类典型案例' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询《民法典》婚姻家庭编原文' },
    ],
    books: [{ title: '婚姻法学', author: '巫昌祯', why: '婚姻家庭法领域的经典教材' }],
  },
  '房地产律师': {
    videos: [
      { title: 'HarvardX: Contract Law: From Trust to Promise to Contract', url: 'https://www.edx.org/learn/business-law/harvard-university-contract-law-from-trust-to-promise-to-contract', source: 'edX', note: '英文，合同法基础，房产交易合同必备' },
    ],
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询城市房地产管理法等原文' },
      { title: '中国政府网', url: 'https://www.gov.cn', source: '官方文档', note: '房地产政策与国务院文件' },
    ],
  },
  '体育法律师': {
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询体育法等相关法规原文' },
      { title: '中国政府网公报', url: 'https://www.gov.cn/gongbao/', source: '官方文档', note: '国务院公报与政策文件' },
    ],
  },
  '娱乐法律师': {
    videos: [
      { title: 'BerkleeX: Copyright Law in the Music Business', url: 'https://www.edx.org/learn/music-business/berklee-college-of-music-copyright-law-in-the-music-business', source: 'edX', note: '英文，音乐版权法与产业实务' },
    ],
    docs: [
      { title: 'WIPO 伯尔尼公约', url: 'https://www.wipo.int/treaties/en/ip/berne/', source: 'WIPO', note: '国际版权保护的基础条约' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询著作权法等原文' },
    ],
  },
  '移民律师': {
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询出入境管理相关法律原文' },
      { title: '中国政府网', url: 'https://www.gov.cn', source: '官方文档', note: '出入境与签证政策发布' },
    ],
  },
  '互联网法院法官助理': {
    docs: [
      { title: '中国裁判文书网', url: 'https://wenshu.court.gov.cn', source: '官方文档', note: '检索互联网案件裁判文书' },
      { title: '中国法院网', url: 'https://www.court.gov.cn', source: '官方文档', note: '了解互联网法院的发布与案例' },
    ],
  },
  '企业数据合规审计师': {
    videos: [
      { title: 'EdinburghX: Data Ethics, AI and Responsible Innovation', url: 'https://www.edx.org/learn/artificial-intelligence/the-university-of-edinburgh-data-ethics-ai-and-responsible-innovation', source: 'edX', note: '英文，数据伦理与合规思路' },
    ],
    docs: [
      { title: '国家互联网信息办公室', url: 'https://www.cac.gov.cn', source: '官方文档', note: '数据安全与合规政策' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询数据安全法等原文' },
    ],
  },
  '建设工程律师': {
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询建筑法、招标投标法等原文' },
      { title: '中国政府网', url: 'https://www.gov.cn', source: '官方文档', note: '工程建设政策与国务院文件' },
    ],
  },
  '保险理赔律师': {
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询保险法原文' },
      { title: '中国政府网', url: 'https://www.gov.cn', source: '官方文档', note: '保险监管政策发布' },
    ],
  },
  '海商法律师': {
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询海商法原文' },
      { title: 'WTO 争端解决（英文）', url: 'https://www.wto.org/english/tratop_e/dispu_e/dispu_e.htm', source: 'WTO', note: '国际贸易争端的英文原始材料' },
    ],
  },
  '税法筹划师': {
    docs: [
      { title: '国家税务总局', url: 'https://www.chinatax.gov.cn', source: '官方文档', note: '税收政策与法规发布' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询税收法律原文' },
    ],
  },
  '数据出境合规顾问': {
    docs: [
      { title: '国家互联网信息办公室', url: 'https://www.cac.gov.cn', source: '官方文档', note: '数据出境安全评估等政策发布' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询数据安全法、个人信息保护法原文' },
    ],
  },
  '网络安全等级保护顾问': {
    videos: [
      { title: 'IBM Cybersecurity Compliance and System Administration', url: 'https://www.edx.org/learn/cybersecurity/ibm-cybersecurity-compliance-and-system-administration', source: 'edX', note: '英文，网络安全合规与系统管理' },
    ],
    docs: [
      { title: '国家互联网信息办公室', url: 'https://www.cac.gov.cn', source: '官方文档', note: '网络安全政策与等保相关文件' },
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询网络安全法原文' },
    ],
  },
  '个人信息保护官': {
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询《个人信息保护法》原文' },
      { title: '国家互联网信息办公室', url: 'https://www.cac.gov.cn', source: '官方文档', note: '个人信息保护政策与规范发布' },
    ],
    books: [{ title: 'Understanding Privacy（隐私的理解）', author: 'Daniel J. Solove', why: '从理论层面理解个人信息保护的边界' }],
  },
  '行政处罚复议律师': {
    docs: [
      { title: '国家法律法规数据库', url: 'https://flk.npc.gov.cn', source: '官方文档', note: '查询行政处罚法、行政复议法原文' },
      { title: '中国政府网', url: 'https://www.gov.cn', source: '官方文档', note: '行政法规与政策文件' },
    ],
  },
};
