import type { CareerResourceSet } from '../career-resources';

export const medicalResources: Record<string, CareerResourceSet> = {
  '医学影像AI工程师': {
    videos: [{ title: 'AI for Medicine Specialization（DeepLearning.AI，医学影像与临床 AI）', url: 'https://www.coursera.org/specializations/ai-for-medicine', source: 'Coursera' }],
    docs: [
      { title: 'reddit · r/bioinformatics', url: 'https://www.reddit.com/r/bioinformatics/', source: '行业社区', note: '医学AI与生信交叉社区', kind: 'community' },
{ title: 'WHO 数字健康专题（医疗 AI 与数字化政策）', url: 'https://www.who.int/health-topics/digital-health', source: 'WHO' }],
    books: [
      { title: '深度学习', author: '伊恩·古德费洛', why: '医学影像AI的算法根基' },
{ title: '深度学习（Deep Learning）', author: 'Ian Goodfellow、Yoshua Bengio、Aaron Courville', why: '深度学习理论基石，医学影像模型的底层原理' }],
  },
  '全科医师': {
    videos: [{ title: 'Khan Academy 健康与医学专题（免费医学科普课程）', url: 'https://www.khanacademy.org/science/health-and-medicine', source: 'Khan Academy' }],
    docs: [
      { title: 'reddit · r/medicine', url: 'https://www.reddit.com/r/medicine/', source: '行业社区', note: '临床医生全球社区', kind: 'community' },
{ title: 'MedlinePlus（美国国家医学图书馆患者与临床参考）', url: 'https://medlineplus.gov/', source: '官方文档', note: '疾病与用药权威参考' }],
    books: [
      { title: '诊断学', author: '万学红', why: '问诊查体与临床思维的根基教材' },
{ title: '哈里森内科学（Harrison’s Principles of Internal Medicine）', author: 'Dennis L. Kasper 等（主编）', why: '内科学经典教材，全科诊疗思维的基础参考' }],
  },
  '康复治疗师': {
    videos: [
      { title: '《物理治疗学》+《作业治疗学》知识点精讲', url: 'https://www.bilibili.com/video/BV1yy4y1Z7mX', source: 'Bilibili', note: '康复治疗核心课程' },
    ],
    docs: [
      { title: 'reddit · r/PhysicalTherapy', url: 'https://www.reddit.com/r/PhysicalTherapy/', source: '行业社区', note: '物理治疗师全球社区', kind: 'community' },
{ title: 'WHO 功能、残疾和健康国际分类（ICF）', url: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health', source: 'WHO', note: '康复评估的国际标准框架' }],
    books: [
      { title: '康复医学', author: '黄晓琳', why: '康复医学的人卫标准教材' },
{ title: 'Physical Rehabilitation（物理康复学）', author: 'Susan B. O’Sullivan 等', why: '康复治疗领域的经典教材，覆盖评估与干预' }],
  },
  '生物信息学家': {
    videos: [{ title: 'Genomic Data Science Specialization（约翰霍普金斯大学，基因组数据科学）', url: 'https://www.coursera.org/specializations/genomic-data-science', source: 'Coursera' }],
    docs: [
      { title: '小木虫（科研社区）', url: 'https://muchong.com/', source: '行业社区', note: '生信与科研问答社区', kind: 'community' },

      { title: 'Bioconductor 官方网站（R 语言生物信息学工具包）', url: 'https://www.bioconductor.org/', source: '官方文档' },
      { title: 'Biopython 官方网站（Python 生物信息学工具）', url: 'https://biopython.org/', source: '官方文档' },
    ],
    books: [
      { title: '生物信息学', author: '樊龙江', why: '生信方法与应用的体系教材' },
{ title: 'Bioinformatics Algorithms（生物信息学算法）', author: 'Pavel Pevzner、Phillip Compeau', why: '用算法视角讲解序列分析，适合转行的编程背景者' }],
  },
  '口腔医生': {
    videos: [
      { title: '口腔解剖生理学', url: 'https://www.bilibili.com/video/BV1PK4y1g7SM', source: 'Bilibili', note: '口腔医学的解剖根基' },
    ],
    docs: [
      { title: 'reddit · r/dentistry', url: 'https://www.reddit.com/r/dentistry/', source: '行业社区', note: '牙医全球社区', kind: 'community' },
{ title: 'ADA 美国牙医协会官网', url: 'https://www.ada.org/', source: '官方文档' }],
    books: [
      { title: '口腔解剖生理学', author: '何三纲', why: '口腔医学的人卫根基教材' },
{ title: 'Carranza 临床牙周病学（Carranza’s Clinical Periodontology）', author: 'Michael G. Newman 等', why: '牙周病学经典教材，口腔临床基础必备' }],
  },
  '中医师': {
    videos: [
      { title: '中医基础理论（广州中医药大学·潘毅·全124讲）', url: 'https://www.bilibili.com/video/BV1RR4y147uY', source: 'Bilibili', note: '中医理论系统课' },
    ],
    docs: [
      { title: 'reddit · r/medicalschool', url: 'https://www.reddit.com/r/medicalschool/', source: '行业社区', note: '医学生社区', kind: 'community' },
{ title: '中华医学会官网', url: 'https://www.cma.org.cn/', source: '官方文档', note: '中华医学会，可查询相关指南与学术资源' }],
    books: [
      { title: '黄帝内经', author: '佚名（传统经典）', why: '中医理论根基，辨证论治思想的源头' },
      { title: '伤寒论', author: '张仲景', why: '经方体系的奠基之作，中医临床必读' },
    ],
  },
  '药学研发工程师': {
    books: [
      { title: '药理学', author: '朱依谆', why: '药物作用机制的人卫标准教材' },
      { title: '药学综合知识与技能', author: '国家药监局执业药师资格认证中心', why: '执业药师实务的官方教材' },
    ],
    videos: [
      { title: '药理学', url: 'https://www.bilibili.com/video/BV1bP4y1P76R', source: 'Bilibili', note: '药物作用机制的体系课' },
    ],
    docs: [
      { title: 'reddit · r/pharmres', url: 'https://www.reddit.com/r/pharmres/', source: '行业社区', note: '制药研发从业者社区', kind: 'community' },
{ title: 'ICH 人用药品注册技术要求国际协调会（药物研发指南）', url: 'https://www.ich.org/', source: '官方文档', note: '新药研发的国际指导原则' }],
  },
  '麻醉医师': {
    docs: [
      { title: 'reddit · r/anesthesiology', url: 'https://www.reddit.com/r/anesthesiology/', source: '行业社区', note: '麻醉科全球社区', kind: 'community' },

      { title: '生理学（河北医科大学）', url: 'https://www.icourse163.org/course/HEBYKDX-1461177170', source: '中国大学MOOC', note: '麻醉药理与循环呼吸的生理基础' },
    ],
    videos: [
      { title: '临床麻醉学（中南大学·郭曲练·42讲）', url: 'https://www.bilibili.com/video/BV1Rs411w75i', source: 'Bilibili', note: '麻醉系统课' },
    ],
    books: [
      { title: '麻醉学', author: '邓小明', why: '麻醉学的人卫标准教材' },
{ title: '米勒麻醉学（Miller’s Anesthesia）', author: 'Ronald D. Miller 等（主编）', why: '麻醉学权威参考书，覆盖药理、监测与临床管理' }],
  },
  '医学检验师': {
    books: [
      { title: '诊断学', author: '万学红', why: '实验室检查解读的根基教材' },
      { title: '病者生存', author: '沙龙·莫勒姆', why: '血液与遗传的演化视角科普' },
    ],
    videos: [
      { title: '临床生物化学检验（中南大学精品课）', url: 'https://www.bilibili.com/video/BV1YY4y1u7Ux', source: 'Bilibili', note: '检验核心课程' },
    ],
    docs: [
      { title: 'reddit · r/medlabprofessionals', url: 'https://www.reddit.com/r/medlabprofessionals/', source: '行业社区', note: '检验技师全球社区', kind: 'community' },
{ title: 'ADLM（美国临床化学与检验医学学会）官网', url: 'https://www.myadlm.org/', source: '官方文档' }],
  },
  '皮肤科医生': {
    videos: [
      { title: '皮肤病与性病学', url: 'https://www.bilibili.com/video/BV1PZ4y1m7wZ', source: 'Bilibili', note: '皮肤病系统课' },
    ],
    docs: [
      { title: 'reddit · r/dermatology', url: 'https://www.reddit.com/r/dermatology/', source: '行业社区', note: '皮肤科全球社区', kind: 'community' },
{ title: 'AAD 美国皮肤科学会官网', url: 'https://www.aad.org/', source: '官方文档' }],
    books: [
      { title: '皮肤性病学', author: '张学军', why: '皮肤科的人卫标准教材' },
{ title: 'Fitzpatrick 皮肤病学（Fitzpatrick’s Dermatology）', author: 'Klaus Wolff 等', why: '皮肤病学权威图谱与临床指南，诊断必备' }],
  },
  '儿科医生': {
    videos: [
      { title: '儿科学期末速成', url: 'https://www.bilibili.com/video/BV1t2mEBDEcR', source: 'Bilibili', note: '儿科系统速览' },
    ],
    docs: [
      { title: 'reddit · r/Healthcare', url: 'https://www.reddit.com/r/Healthcare/', source: '行业社区', note: '医疗行业社区', kind: 'community' },
{ title: 'AAP 美国儿科学会官网', url: 'https://www.aap.org/', source: '官方文档' }],
    books: [
      { title: '儿科学', author: '王卫平', why: '儿科的人卫标准教材' },
{ title: 'Nelson 儿科学（Nelson Textbook of Pediatrics）', author: 'Robert M. Kliegman 等（主编）', why: '儿科学经典大部头，覆盖各系统疾病' }],
  },
  '兽医': {
    videos: [
      { title: '执业兽医资格考试精讲', url: 'https://www.bilibili.com/video/BV1TTjC6LEX8', source: 'Bilibili', note: '兽医临床与预防科目' },
    ],
    docs: [
      { title: 'reddit · r/veterinary', url: 'https://www.reddit.com/r/veterinary/', source: '行业社区', note: '兽医全球社区', kind: 'community' },
{ title: 'AVMA 美国兽医协会官网', url: 'https://www.avma.org/', source: '官方文档' }],
    books: [
      { title: '兽医临床诊断学', author: '王小龙', why: '兽医诊断的权威教材' },
{ title: 'Merck 兽医手册（The Merck Veterinary Manual）', author: 'Merck（默克公司）', why: '兽医临床常用权威参考，覆盖多种动物疾病' }],
  },
  '急诊医学医师': {
    videos: [
      { title: '急救常识科普：一分钟学会急救', url: 'https://www.bilibili.com/video/BV1Mi4y1x7aK', source: 'Bilibili', note: '急救流程与操作' },
    ],
    docs: [
      { title: 'reddit · r/ems', url: 'https://www.reddit.com/r/ems/', source: '行业社区', note: '院前急救全球社区', kind: 'community' },
{ title: 'MedlinePlus（美国国家医学图书馆患者与临床参考）', url: 'https://medlineplus.gov/', source: '官方文档' }],
    books: [
      { title: '外科学', author: '陈孝平', why: '创伤与急症外科的人卫教材' },
{ title: 'Tintinalli 急诊医学（Tintinalli’s Emergency Medicine）', author: 'Judith E. Tintinalli 等（主编）', why: '急诊医学标准教科书，涵盖常见急危重症' }],
  },
  '遗传咨询师': {
    videos: [{ title: 'Genomic Data Science Specialization（基因组数据科学）', url: 'https://www.coursera.org/specializations/genomic-data-science', source: 'Coursera' }],
    docs: [
      { title: 'reddit · r/genetics', url: 'https://www.reddit.com/r/genetics/', source: '行业社区', note: '遗传学全球社区', kind: 'community' },
{ title: 'NSGC 美国遗传咨询师协会官网', url: 'https://www.nsgc.org/', source: '官方文档' }],
    books: [
      { title: '医学遗传学', author: '左伋', why: '遗传咨询的人卫教材' },
{ title: 'Emery 与 Rimoin 医学遗传学原理与实践（Emery and Rimoin’s Principles and Practice of Medical Genetics）', author: 'Peter Turnpenny、Sian Ellard（主编）', why: '医学遗传学权威教材，遗传咨询的理论基础' }],
  },
  '眼科医生': {
    videos: [
      { title: '眼科学（首都医科大学）', url: 'https://www.bilibili.com/video/BV1ja411q71Y', source: 'Bilibili', note: '眼科系统课' },
    ],
    docs: [
      { title: 'reddit · r/optometry', url: 'https://www.reddit.com/r/optometry/', source: '行业社区', note: '视光与眼科全球社区', kind: 'community' },
{ title: 'AAO 美国眼科学会官网', url: 'https://www.aao.org/', source: '官方文档' }],
    books: [
      { title: '眼科学', author: '杨培增', why: '眼科的人卫标准教材' },
{ title: 'Kanski 临床眼科学（Clinical Ophthalmology）', author: 'Jack J. Kanski、Brad Bowling', why: '眼科临床经典教材，涵盖各类眼病诊疗' }],
  },
  '康复医师': {
    videos: [
      { title: '康复治疗学到底是在学什么', url: 'https://www.bilibili.com/video/BV1ZT411A785', source: 'Bilibili', note: '康复专业与职业全景' },
    ],
    docs: [
      { title: 'reddit · r/epidemiology', url: 'https://www.reddit.com/r/epidemiology/', source: '行业社区', note: '流行病学社区', kind: 'community' },
{ title: 'WHO 功能、残疾和健康国际分类（ICF）', url: 'https://www.who.int/standards/classifications/international-classification-of-functioning-disability-and-health', source: 'WHO', note: '康复评估的国际标准框架' }],
    books: [
      { title: '康复医学', author: '黄晓琳', why: '康复医学的人卫标准教材' },
{ title: 'Physical Rehabilitation（物理康复学）', author: 'Susan B. O’Sullivan 等', why: '康复医学经典教材，覆盖功能评估与干预' }],
  },
  '放射技师': {
    docs: [
      { title: 'reddit · r/Radiology', url: 'https://www.reddit.com/r/Radiology/', source: '行业社区', note: '影像科与技师全球社区', kind: 'community' },

      { title: '健康评估（中山大学）', url: 'https://higher.smartedu.cn/course/67ad2cbf225d72705e160d7e', source: '智慧教育平台', note: '含 X 线与影像检查评估章节' },
    ],
    videos: [
      { title: '医学影像学（中山大学·孟悛非·全90讲）', url: 'https://www.bilibili.com/video/BV1d5411u768', source: 'Bilibili', note: '影像诊断系统课' },
    ],
    books: [
      { title: '医学影像学', author: '白人驹', why: '影像诊断的人卫标准教材' },
{ title: 'Squire 放射学基础（Squire’s Fundamentals of Radiology）', author: 'Robert A. Novelline', why: '放射学入门经典，影像成像原理讲解清楚' }],
  },
  '病理科医师': {
    videos: [
      { title: '病理学', url: 'https://www.bilibili.com/video/BV1JK4y1U7Az', source: 'Bilibili', note: '病理系统课' },
    ],
    docs: [
      { title: '健康界', url: 'https://www.cn-healthcare.com/', source: '行业社区', note: '医院管理与医疗资讯', kind: 'community' },
{ title: 'CAP 美国病理学家协会官网', url: 'https://www.cap.org/', source: '官方文档' }],
    books: [
      { title: '病理学', author: '王建枝', why: '病理学的人卫标准教材' },
{ title: 'Robbins 基础病理学（Robbins Basic Pathology）', author: 'Vinay Kumar 等', why: '病理学经典教材，疾病机制与组织形态系统讲解' }],
  },
  '医学影像科医师': {
    docs: [
      { title: 'reddit · r/Radiology', url: 'https://www.reddit.com/r/Radiology/', source: '行业社区', note: '影像科与技师全球社区', kind: 'community' },

      { title: '健康评估（中山大学）', url: 'https://higher.smartedu.cn/course/67ad2cbf225d72705e160d7e', source: '智慧教育平台', note: '含 X 线与影像检查评估章节' },
    ],
    videos: [
      { title: '医学影像学（中山大学·孟悛非·全90讲）', url: 'https://www.bilibili.com/video/BV1d5411u768', source: 'Bilibili', note: '影像诊断系统课' },
    ],
    books: [
      { title: '医学影像学', author: '白人驹', why: '影像诊断的人卫标准教材' },
{ title: 'Squire 放射学基础（Squire’s Fundamentals of Radiology）', author: 'Robert A. Novelline', why: '影像诊断入门经典，影像学基础必读' }],
  },
  '医学编辑': {
    books: [
      { title: '医学统计学', author: '李康', why: '医学科研统计的人卫教材' },
      { title: '循证医学', author: '李幼平', why: '证据医学的方法论教材' },
    ],
    videos: [
      { title: '医学统计学（第二军医大学·贺佳）', url: 'https://www.bilibili.com/video/BV11S4y1M7EG', source: 'Bilibili', note: '医学科研的统计方法课' },
    ],
    docs: [
      { title: 'ResearchGate', url: 'https://www.researchgate.net/', source: '行业社区', note: '全球科研交流平台', kind: 'community' },
{ title: 'ICMJE 国际医学期刊编辑委员会（投稿与伦理规范）', url: 'https://www.icmje.org/', source: '官方文档', note: '医学出版与投稿的国际规范' }],
  },
  '临床试验协调员': {
    books: [
      { title: '坏血', author: '约翰·卡雷鲁', why: '临床试验造假的警示实录' },
      { title: '众病之王：癌症传', author: '悉达多·穆克吉', why: '新药临床试验的历史脉络' },
    ],
    videos: [
      { title: '临床试验协调员（CRC）初级培训', url: 'https://www.bilibili.com/video/BV1f4RFBKEib', source: 'Bilibili', note: 'CRC 岗位实务' },
    ],
    docs: [
      { title: 'reddit · r/clinicalresearch', url: 'https://www.reddit.com/r/clinicalresearch/', source: '行业社区', note: '临床研究全球社区', kind: 'community' },
{ title: 'ICH 人用药品注册技术要求国际协调会（GCP 指南）', url: 'https://www.ich.org/', source: '官方文档', note: '临床试验质量管理的国际规范' }],
  },
  '听力学家': {
    videos: [
      { title: '医学基础【生理】', url: 'https://www.bilibili.com/video/BV1VukSYuEKR', source: 'Bilibili', note: '听觉与感官的生理基础' },
    ],
    docs: [
      { title: '生物谷', url: 'https://www.bioon.com/', source: '行业社区', note: '生命科学资讯', kind: 'community' },
{ title: 'ASHA 美国言语听力协会官网', url: 'https://www.asha.org/', source: '官方文档' }],
    books: [
      { title: '薄世宁医学通识讲义', author: '薄世宁', why: '临床认知的通识底座' },
{ title: 'Hearing Aids（助听器）', author: 'Harvey Dillon', why: '助听器与听力康复的权威专著，验配理论清晰' }],
  },
  '临床数据分析师': {
    books: [
      { title: '未来医疗', author: '埃里克·托普', why: '医疗数据化的方向判断' },
      { title: '医学统计学', author: '李康', why: '医疗数据分析的方法根基' },
    ],
    videos: [{ title: 'MIT 6.S897 Machine Learning for Healthcare（麻省理工，医疗机器学习）', url: 'https://ocw.mit.edu/courses/6-s897-machine-learning-for-healthcare-spring-2019/', source: 'MIT OCW', note: '全套课程资料免费' }],
    docs: [
      { title: 'reddit · r/psychology', url: 'https://www.reddit.com/r/psychology/', source: '行业社区', note: '心理学社区', kind: 'community' },
{ title: 'MIMIC 重症监护临床数据库（MIT 官方）', url: 'https://mimic.mit.edu/', source: '官方文档', note: '临床数据分析的公开数据源' }],
  },
  '感染控制医师': {
    books: [
      { title: '流行病学', author: '詹思延', why: '流行病学研究方法的人卫教材' },
      { title: '枪炮、病菌与钢铁', author: '贾雷德·戴蒙德', why: '传染病与人群健康的宏观视角' },
    ],
    videos: [
      { title: '流行病学（詹思延版教材领学）', url: 'https://www.bilibili.com/video/BV12F411J7SE', source: 'Bilibili', note: '流行病学全书讲解' },
    ],
    docs: [
      { title: 'reddit · r/epidemiology', url: 'https://www.reddit.com/r/epidemiology/', source: '行业社区', note: '流行病学全球社区', kind: 'community' },
{ title: 'CDC 感染控制官方专题（美国疾控中心）', url: 'https://www.cdc.gov/infection-control/', source: '官方文档' }],
  },
  '远程医疗运营': {
    books: [
      { title: '未来医疗', author: '埃里克·托普', why: '数字医疗的演进方向' },
      { title: '深度医疗', author: '埃里克·托普', why: 'AI与远程医疗的行业判断' },
    ],
    videos: [
      { title: '90秒看懂互联网医疗', url: 'https://www.bilibili.com/video/BV1D3411B7X8', source: 'Bilibili', note: '互联网医疗模式速览' },
    ],
    docs: [
      { title: 'reddit · r/PublicHealth', url: 'https://www.reddit.com/r/PublicHealth/', source: '行业社区', note: '公共卫生社区', kind: 'community' },
{ title: 'WHO 数字健康专题（远程医疗与数字化政策）', url: 'https://www.who.int/health-topics/digital-health', source: 'WHO' }],
  },
  '临床药学研究员': {
    books: [
      { title: '药理学', author: '朱依谆', why: '药物作用机制的人卫标准教材' },
      { title: '药学综合知识与技能', author: '国家药监局执业药师资格认证中心', why: '执业药师实务的官方教材' },
    ],
    videos: [
      { title: '生物药研发流程与解决方案', url: 'https://www.bilibili.com/video/BV1244y137LF', source: 'Bilibili', note: '新药研发全流程' },
    ],
    docs: [
      { title: 'reddit · r/pharmres', url: 'https://www.reddit.com/r/pharmres/', source: '行业社区', note: '制药研发从业者社区', kind: 'community' },
{ title: 'WHO 基本药物示范目录（Essential Medicines）专家委员会', url: 'https://www.who.int/groups/expert-committee-on-selection-and-use-of-essential-medicines', source: 'WHO', note: '临床用药选择的权威依据' }],
  },
  '医学写作专员': {
    books: [
      { title: '医学统计学', author: '李康', why: '医学科研统计的人卫教材' },
      { title: '循证医学', author: '李幼平', why: '证据医学的方法论教材' },
    ],
    videos: [
      { title: '循证医学', url: 'https://www.bilibili.com/video/BV1yE411P7DK', source: 'Bilibili', note: '证据分级与系统评价' },
    ],
    docs: [
      { title: 'reddit · r/Healthcare', url: 'https://www.reddit.com/r/Healthcare/', source: '行业社区', note: '医疗行业社区', kind: 'community' },
{ title: 'ICMJE 国际医学期刊编辑委员会（稿件与伦理规范）', url: 'https://www.icmje.org/', source: '官方文档' }],
  },
  '医院感染管理师': {
    books: [
      { title: '流行病学', author: '詹思延', why: '感染监测的方法学根基' },
      { title: '薄世宁医学通识讲义', author: '薄世宁', why: '临床流程认知的通识底座' },
    ],
    videos: [
      { title: '一张A4纸搞定流行病学全书逻辑', url: 'https://www.bilibili.com/video/BV1yu411q7X4', source: 'Bilibili', note: '感染监测的研究设计框架' },
    ],
    docs: [
      { title: '健康界', url: 'https://www.cn-healthcare.com/', source: '行业社区', note: '医院感染管理资讯', kind: 'community' },
{ title: 'CDC 感染控制官方专题（美国疾控中心）', url: 'https://www.cdc.gov/infection-control/', source: '官方文档' }],
  },
  '医疗大数据分析师': {
    books: [
      { title: '未来医疗', author: '埃里克·托普', why: '医疗数据化的方向判断' },
      { title: '医学统计学', author: '李康', why: '医疗数据分析的方法根基' },
    ],
    videos: [{ title: 'MIT 6.S897 Machine Learning for Healthcare（麻省理工，医疗机器学习）', url: 'https://ocw.mit.edu/courses/6-s897-machine-learning-for-healthcare-spring-2019/', source: 'MIT OCW', note: '全套课程资料免费' }],
    docs: [
      { title: 'reddit · r/nutrition', url: 'https://www.reddit.com/r/nutrition/', source: '行业社区', note: '营养社区', kind: 'community' },
{ title: 'MIMIC 重症监护临床数据库（MIT 官方）', url: 'https://mimic.mit.edu/', source: '官方文档' }],
  },
  '院前急救医师': {
    books: [
      { title: '外科学', author: '陈孝平', why: '创伤与急症外科的人卫教材' },
      { title: '默克家庭诊疗手册', author: '默克公司', why: '急救与常见病的权威参考' },
    ],
    videos: [
      { title: '急救常识科普：一分钟学会急救', url: 'https://www.bilibili.com/video/BV1Mi4y1x7aK', source: 'Bilibili', note: '急救流程与操作' },
    ],
    docs: [
      { title: 'reddit · r/ems', url: 'https://www.reddit.com/r/ems/', source: '行业社区', note: '院前急救全球社区', kind: 'community' },
{ title: 'AHA 心肺复苏与心血管急救指南（美国心脏协会）', url: 'https://cpr.heart.org/', source: '官方文档' }],
  },
  '循证医学研究员': {
    videos: [
      { title: '医学统计学（第二军医大学·贺佳）', url: 'https://www.bilibili.com/video/BV11S4y1M7EG', source: 'Bilibili', note: '医学科研的统计方法课' },
    ],
    docs: [
      { title: 'ResearchGate', url: 'https://www.researchgate.net/', source: '行业社区', note: '全球科研交流平台', kind: 'community' },
{ title: 'Cochrane Library（循证医学系统评价数据库）', url: 'https://www.cochranelibrary.com/', source: '官方文档' }],
    books: [
      { title: '医学统计学', author: '李康', why: '医学科研统计的人卫教材' },
{ title: '循证医学：临床实践与教学方法（Evidence-Based Medicine）', author: 'David L. Sackett 等', why: '循证医学奠基之作，证据评价方法讲解透彻' }],
  },
  '精神科医生': {
    videos: [
      { title: '从0开始，心理咨询全流程基础技术系统课', url: 'https://www.bilibili.com/video/BV1Ck4y1e71M', source: 'Bilibili', note: '咨询设置与基本技术' },
    ],
    docs: [
      { title: 'reddit · r/psychology', url: 'https://www.reddit.com/r/psychology/', source: '行业社区', note: '心理学讨论社区', kind: 'community' },
{ title: 'MedlinePlus（美国国家医学图书馆，精神健康与用药参考）', url: 'https://medlineplus.gov/', source: '官方文档' }],
    books: [
      { title: '心理咨询与治疗的理论及实践', author: '杰拉德·科里', why: '咨询流派与技术的体系化教材' },
{ title: 'Kaplan 与 Sadock 临床精神病学（Kaplan and Sadock’s Comprehensive Textbook of Psychiatry）', author: 'Benjamin J. Sadock 等', why: '精神病学综合教科书，诊断与治疗覆盖全面' }],
  },
  '老年病科医生': {
    books: [
      { title: '诊断学', author: '万学红', why: '问诊查体与临床思维的根基教材' },
      { title: '默克家庭诊疗手册', author: '默克公司', why: '全科视角的疾病诊疗权威参考' },
    ],
    videos: [
      { title: '诊断学基础', url: 'https://www.bilibili.com/video/BV1tV4y167JS', source: 'Bilibili', note: '临床问诊与查体的根基课' },
    ],
    docs: [
      { title: '丁香园（医者社区）', url: 'https://www.dxy.cn/', source: '行业社区', note: '国内医生聚集地，病例与指南讨论', kind: 'community' },
{ title: 'AGS 美国老年医学会官网', url: 'https://www.americangeriatrics.org/', source: '官方文档' }],
  },
  '肿瘤科医生': {
    videos: [
      { title: '病理学', url: 'https://www.bilibili.com/video/BV1JK4y1U7Az', source: 'Bilibili', note: '肿瘤的病理诊断根基' },
    ],
    docs: [
      { title: 'reddit · r/genetics', url: 'https://www.reddit.com/r/genetics/', source: '行业社区', note: '遗传社区', kind: 'community' },
{ title: 'NCCN 美国国家综合癌症网络临床实践指南', url: 'https://www.nccn.org/', source: '官方文档' }],
    books: [
      { title: '众病之王：癌症传', author: '悉达多·穆克吉', why: '癌症治疗史与肿瘤学思维必读' },
{ title: 'DeVita、Hellman 与 Rosenberg 肿瘤学原理与实践（Cancer: Principles and Practice of Oncology）', author: 'Vincent T. DeVita 等', why: '肿瘤学经典大部头，综合治疗体系完整' }],
  },
  '透析技师': {
    books: [
      { title: '外科学', author: '陈孝平', why: '体外循环与外科操作的人卫教材' },
      { title: '血液净化学', author: '王质刚', why: '透析技术的权威专著' },
    ],
    videos: [
      { title: '河南省血液净化专科培训', url: 'https://www.bilibili.com/video/BV1fFHXzUESx', source: 'Bilibili', note: '透析全程管理培训' },
    ],
    docs: [
      { title: 'reddit · r/PublicHealth', url: 'https://www.reddit.com/r/PublicHealth/', source: '行业社区', note: '公共卫生社区', kind: 'community' },
{ title: 'National Kidney Foundation 美国肾脏病基金会', url: 'https://www.kidney.org/', source: '官方文档' }],
  },
};
