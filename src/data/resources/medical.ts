import type { CareerResourceSet } from '../career-resources';

export const medicalResources: Record<string, CareerResourceSet> = {
  '医学影像AI工程师': {
    videos: [{ title: 'AI for Medicine Specialization（DeepLearning.AI，医学影像与临床 AI）', url: 'https://www.coursera.org/specializations/ai-for-medicine', source: 'Coursera' }],
    docs: [{ title: 'WHO 数字健康专题（医疗 AI 与数字化政策）', url: 'https://www.who.int/health-topics/digital-health', source: 'WHO' }],
    books: [{ title: '深度学习（Deep Learning）', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '深度学习理论基石，医学影像模型的底层原理' }],
  },
  '全科医师': {
    videos: [{ title: 'Khan Academy 健康与医学专题（免费医学科普课程）', url: 'https://www.khanacademy.org/science/health-and-medicine', source: 'Khan Academy' }],
    docs: [{ title: 'MedlinePlus（美国国家医学图书馆患者与临床参考）', url: 'https://medlineplus.gov/', source: '官方文档', note: '疾病与用药权威参考' }],
    books: [{ title: '哈里森内科学（Harrison’s Principles of Internal Medicine）', author: 'Dennis L. Kasper 等（主编）', why: '内科学经典教材，全科诊疗思维的基础参考' }],
  },
  '康复治疗师': {
    docs: [{ title: 'WHO 功能、残疾和健康国际分类（ICF）', url: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health', source: 'WHO', note: '康复评估的国际标准框架' }],
    books: [{ title: 'Physical Rehabilitation（物理康复学）', author: 'Susan B. O’Sullivan 等', why: '康复治疗领域的经典教材，覆盖评估与干预' }],
  },
  '生物信息学家': {
    videos: [{ title: 'Genomic Data Science Specialization（约翰霍普金斯大学，基因组数据科学）', url: 'https://www.coursera.org/specializations/genomic-data-science', source: 'Coursera' }],
    docs: [
      { title: 'Bioconductor 官方网站（R 语言生物信息学工具包）', url: 'https://www.bioconductor.org/', source: '官方文档' },
      { title: 'Biopython 官方网站（Python 生物信息学工具）', url: 'https://biopython.org/', source: '官方文档' },
    ],
    books: [{ title: 'Bioinformatics Algorithms（生物信息学算法）', author: 'Pavel Pevzner、Phillip Compeau', why: '用算法视角讲解序列分析，适合转行的编程背景者' }],
  },
  '口腔医生': {
    docs: [{ title: 'ADA 美国牙医协会官网', url: 'https://www.ada.org/', source: '官方文档' }],
    books: [{ title: 'Carranza 临床牙周病学（Carranza’s Clinical Periodontology）', author: 'Michael G. Newman 等', why: '牙周病学经典教材，口腔临床基础必备' }],
  },
  '中医师': {
    docs: [{ title: '中华医学会官网', url: 'https://www.cma.org.cn/', source: '官方文档', note: '中华医学会，可查询相关指南与学术资源' }],
    books: [
      { title: '黄帝内经', author: '佚名（传统经典）', why: '中医理论根基，辨证论治思想的源头' },
      { title: '伤寒论', author: '张仲景', why: '经方体系的奠基之作，中医临床必读' },
    ],
  },
  '药学研发工程师': {
    docs: [{ title: 'ICH 人用药品注册技术要求国际协调会（药物研发指南）', url: 'https://www.ich.org/', source: '官方文档', note: '新药研发的国际指导原则' }],
  },
  '麻醉医师': {
    books: [{ title: '米勒麻醉学（Miller’s Anesthesia）', author: 'Ronald D. Miller 等（主编）', why: '麻醉学权威参考书，覆盖药理、监测与临床管理' }],
  },
  '医学检验师': {
    docs: [{ title: 'ADLM（美国临床化学与检验医学学会）官网', url: 'https://www.myadlm.org/', source: '官方文档' }],
  },
  '皮肤科医生': {
    docs: [{ title: 'AAD 美国皮肤科学会官网', url: 'https://www.aad.org/', source: '官方文档' }],
    books: [{ title: 'Fitzpatrick 皮肤病学（Fitzpatrick’s Dermatology）', author: 'Klaus Wolff 等', why: '皮肤病学权威图谱与临床指南，诊断必备' }],
  },
  '儿科医生': {
    docs: [{ title: 'AAP 美国儿科学会官网', url: 'https://www.aap.org/', source: '官方文档' }],
    books: [{ title: 'Nelson 儿科学（Nelson Textbook of Pediatrics）', author: 'Robert M. Kliegman 等（主编）', why: '儿科学经典大部头，覆盖各系统疾病' }],
  },
  '兽医': {
    docs: [{ title: 'AVMA 美国兽医协会官网', url: 'https://www.avma.org/', source: '官方文档' }],
    books: [{ title: 'Merck 兽医手册（The Merck Veterinary Manual）', author: 'Merck（默克公司）', why: '兽医临床常用权威参考，覆盖多种动物疾病' }],
  },
  '急诊医学医师': {
    docs: [{ title: 'MedlinePlus（美国国家医学图书馆患者与临床参考）', url: 'https://medlineplus.gov/', source: '官方文档' }],
    books: [{ title: 'Tintinalli 急诊医学（Tintinalli’s Emergency Medicine）', author: 'Judith E. Tintinalli 等（主编）', why: '急诊医学标准教科书，涵盖常见急危重症' }],
  },
  '遗传咨询师': {
    videos: [{ title: 'Genomic Data Science Specialization（基因组数据科学）', url: 'https://www.coursera.org/specializations/genomic-data-science', source: 'Coursera' }],
    docs: [{ title: 'NSGC 美国遗传咨询师协会官网', url: 'https://www.nsgc.org/', source: '官方文档' }],
    books: [{ title: 'Emery 与 Rimoin 医学遗传学原理与实践（Emery and Rimoin’s Principles and Practice of Medical Genetics）', author: 'Peter Turnpenny、Sian Ellard（主编）', why: '医学遗传学权威教材，遗传咨询的理论基础' }],
  },
  '眼科医生': {
    docs: [{ title: 'AAO 美国眼科学会官网', url: 'https://www.aao.org/', source: '官方文档' }],
    books: [{ title: 'Kanski 临床眼科学（Clinical Ophthalmology）', author: 'Jack J. Kanski、Brad Bowling', why: '眼科临床经典教材，涵盖各类眼病诊疗' }],
  },
  '康复医师': {
    docs: [{ title: 'WHO 功能、残疾和健康国际分类（ICF）', url: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health', source: 'WHO', note: '康复评估的国际标准框架' }],
    books: [{ title: 'Physical Rehabilitation（物理康复学）', author: 'Susan B. O’Sullivan 等', why: '康复医学经典教材，覆盖功能评估与干预' }],
  },
  '放射技师': {
    books: [{ title: 'Squire 放射学基础（Squire’s Fundamentals of Radiology）', author: 'Robert A. Novelline', why: '放射学入门经典，影像成像原理讲解清楚' }],
  },
  '病理科医师': {
    docs: [{ title: 'CAP 美国病理学家协会官网', url: 'https://www.cap.org/', source: '官方文档' }],
    books: [{ title: 'Robbins 基础病理学（Robbins Basic Pathology）', author: 'Vinay Kumar 等', why: '病理学经典教材，疾病机制与组织形态系统讲解' }],
  },
  '医学影像科医师': {
    books: [{ title: 'Squire 放射学基础（Squire’s Fundamentals of Radiology）', author: 'Robert A. Novelline', why: '影像诊断入门经典，影像学基础必读' }],
  },
  '医学编辑': {
    docs: [{ title: 'ICMJE 国际医学期刊编辑委员会（投稿与伦理规范）', url: 'https://www.icmje.org/', source: '官方文档', note: '医学出版与投稿的国际规范' }],
  },
  '临床试验协调员': {
    docs: [{ title: 'ICH 人用药品注册技术要求国际协调会（GCP 指南）', url: 'https://www.ich.org/', source: '官方文档', note: '临床试验质量管理的国际规范' }],
  },
  '听力学家': {
    docs: [{ title: 'ASHA 美国言语听力协会官网', url: 'https://www.asha.org/', source: '官方文档' }],
    books: [{ title: 'Hearing Aids（助听器）', author: 'Harvey Dillon', why: '助听器与听力康复的权威专著，验配理论清晰' }],
  },
  '临床数据分析师': {
    videos: [{ title: 'MIT 6.S897 Machine Learning for Healthcare（麻省理工，医疗机器学习）', url: 'https://ocw.mit.edu/courses/6-s897-machine-learning-for-healthcare-spring-2019/', source: 'MIT OCW', note: '全套课程资料免费' }],
    docs: [{ title: 'MIMIC 重症监护临床数据库（MIT 官方）', url: 'https://mimic.mit.edu/', source: '官方文档', note: '临床数据分析的公开数据源' }],
  },
  '感染控制医师': {
    docs: [{ title: 'CDC 感染控制官方专题（美国疾控中心）', url: 'https://www.cdc.gov/infection-control/', source: '官方文档' }],
  },
  '远程医疗运营': {
    docs: [{ title: 'WHO 数字健康专题（远程医疗与数字化政策）', url: 'https://www.who.int/health-topics/digital-health', source: 'WHO' }],
  },
  '临床药学研究员': {
    docs: [{ title: 'WHO 基本药物示范目录（Essential Medicines）专家委员会', url: 'https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines', source: 'WHO', note: '临床用药选择的权威依据' }],
  },
  '医学写作专员': {
    docs: [{ title: 'ICMJE 国际医学期刊编辑委员会（稿件与伦理规范）', url: 'https://www.icmje.org/', source: '官方文档' }],
  },
  '医院感染管理师': {
    docs: [{ title: 'CDC 感染控制官方专题（美国疾控中心）', url: 'https://www.cdc.gov/infection-control/', source: '官方文档' }],
  },
  '医疗大数据分析师': {
    videos: [{ title: 'MIT 6.S897 Machine Learning for Healthcare（麻省理工，医疗机器学习）', url: 'https://ocw.mit.edu/courses/6-s897-machine-learning-for-healthcare-spring-2019/', source: 'MIT OCW', note: '全套课程资料免费' }],
    docs: [{ title: 'MIMIC 重症监护临床数据库（MIT 官方）', url: 'https://mimic.mit.edu/', source: '官方文档' }],
  },
  '院前急救医师': {
    docs: [{ title: 'AHA 心肺复苏与心血管急救指南（美国心脏协会）', url: 'https://cpr.heart.org/', source: '官方文档' }],
  },
  '循证医学研究员': {
    docs: [{ title: 'Cochrane Library（循证医学系统评价数据库）', url: 'https://www.cochranelibrary.com/', source: '官方文档' }],
    books: [{ title: '循证医学：临床实践与教学方法（Evidence-Based Medicine）', author: 'David L. Sackett 等', why: '循证医学奠基之作，证据评价方法讲解透彻' }],
  },
  '精神科医生': {
    docs: [{ title: 'MedlinePlus（美国国家医学图书馆，精神健康与用药参考）', url: 'https://medlineplus.gov/', source: '官方文档' }],
    books: [{ title: 'Kaplan 与 Sadock 临床精神病学（Kaplan and Sadock’s Comprehensive Textbook of Psychiatry）', author: 'Benjamin J. Sadock 等', why: '精神病学综合教科书，诊断与治疗覆盖全面' }],
  },
  '老年病科医生': {
    docs: [{ title: 'AGS 美国老年医学会官网', url: 'https://www.americangeriatrics.org/', source: '官方文档' }],
  },
  '肿瘤科医生': {
    docs: [{ title: 'NCCN 美国国家综合癌症网络临床实践指南', url: 'https://www.nccn.org/', source: '官方文档' }],
    books: [{ title: 'DeVita、Hellman 与 Rosenberg 肿瘤学原理与实践（Cancer: Principles and Practice of Oncology）', author: 'Vincent T. DeVita 等', why: '肿瘤学经典大部头，综合治疗体系完整' }],
  },
  '透析技师': {
    docs: [{ title: 'National Kidney Foundation 美国肾脏病基金会', url: 'https://www.kidney.org/', source: '官方文档' }],
  },
};
