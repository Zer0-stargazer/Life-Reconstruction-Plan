import type { CareerResourceSet } from '../career-resources';

/**
 * 职业级专属学习资源 · 补充 11（2026-10-10）
 * 覆盖：服务、医疗、设计、教育、金融、法律、管理、传媒、商业销售。
 * 纪律同 career-resources.ts 头注释：只写实测可达的稳定页；书籍为真实可购书目，不标 ISBN。
 */
export const supplementResources11: Record<string, CareerResourceSet> = {
  /* ===== 服务 ===== */
  '宠物美容师': {
    docs: [{ title: 'edX 动物学课程合集', url: 'https://www.edx.org/learn/animal-health', source: 'edX', note: '动物健康与护理基础' }],
    books: [{ title: '狗狗美容师手册', author: '多位行业从业者', why: '宠物洗护与造型的实操指南（可选中文版宠物美容教程类书籍）' }],
  },
  '上门美甲师': {
    videos: [{ title: 'edX 美容课程合集', url: 'https://www.edx.org/learn/beauty', source: 'edX', note: '美容护理基础（英文）' }],
  },
  '医疗陪诊师': {
    docs: [
      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '就医流程与政策来源' },
      { title: '世界卫生组织', url: 'https://www.who.int/', source: 'WHO', note: '患者沟通与健康素养参考' },
    ],
  },
  '安宁疗护师': {
    docs: [
      { title: '世界卫生组织姑息治疗', url: 'https://www.who.int/health-topics/palliative-care', source: 'WHO', note: '姑息治疗与安宁疗护的国际框架' },
      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '安宁疗护试点与规范' },
    ],
    books: [{ title: '最好的告别', author: 'Atul Gawande', why: '理解生命末期照护与尊严的必读之作' }],
  },
  '适老化改造师': {
    docs: [
      { title: '世界卫生组织老龄化', url: 'https://www.who.int/health-topics/ageing', source: 'WHO', note: '积极老龄化与适老环境标准' },
      { title: '民政部', url: 'https://www.mca.gov.cn/', source: '民政部', note: '养老服务与适老化改造政策' },
    ],
  },
  '养老照护管理师': {
    docs: [
      { title: '民政部', url: 'https://www.mca.gov.cn/', source: '民政部', note: '养老机构管理与服务标准' },
      { title: '世界卫生组织老龄化', url: 'https://www.who.int/health-topics/ageing', source: 'WHO', note: '长期照护体系参考' },
    ],
    books: [{ title: '最好的告别', author: 'Atul Gawande', why: '照护决策与人文关怀的经典读本' }],
  },
  '宠物营养师': {
    docs: [
      { title: 'edX 动物健康课程合集', url: 'https://www.edx.org/learn/animal-health', source: 'edX', note: '动物营养与健康基础' },
      { title: '世界小动物兽医协会（WSAVA）', url: 'https://wsava.org/', source: 'WSAVA', note: '小动物营养与临床指南' },
    ],
  },
  '宠物摄影师': {
    docs: [{ title: 'edX 摄影课程合集', url: 'https://www.edx.org/learn/photography', source: 'edX', note: '摄影构图与用光基础' }],
  },
  '宠物善终服务师': {
    docs: [
      { title: 'WSAVA 临终关怀', url: 'https://wsava.org/', source: 'WSAVA', note: '宠物临终关怀与哀伤支持' },
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '哀伤辅导基础' },
    ],
  },
  '心理疏导师': {
    docs: [
      { title: '世界卫生组织心理健康', url: 'https://www.who.int/health-topics/mental-health', source: 'WHO', note: '心理健康服务框架' },
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '倾听与情绪支持基础' },
    ],
    books: [{ title: '心理咨询面谈技术', author: 'Kathryn Geldard、David Geldard', why: '倾听与回应的实操手册' }],
  },
  '睡眠管理师': {
    docs: [
      { title: 'Sleep Foundation', url: 'https://www.sleepfoundation.org/', source: 'Sleep Foundation', note: '睡眠科学与行为疗法科普' },
      { title: '世界卫生组织', url: 'https://www.who.int/', source: 'WHO', note: '睡眠与健康关系参考' },
    ],
    books: [{ title: '我们为什么要睡觉', author: 'Matthew Walker', why: '睡眠机制与干预的科普基石' }],
  },
  '生涯规划师': {
    docs: [
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '职业心理与测评基础' },
      { title: 'O*NET 职业信息网', url: 'https://www.onetonline.org/', source: 'O*NET', note: '职业能力与岗位要求数据库' },
    ],
    books: [{ title: '你的降落伞是什么颜色？', author: 'Richard N. Bolles', why: '生涯规划行业的经典入门' }],
  },
  '婚恋顾问': {
    docs: [
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '亲密关系心理学基础' },
      { title: 'Gottman Institute', url: 'https://www.gottman.com/', source: 'Gottman Institute', note: '伴侣关系研究的权威机构' },
    ],
    books: [{ title: '幸福的婚姻', author: 'John M. Gottman', why: '以研究为基础的亲密关系方法论' }],
  },
  '整理收纳咨询师': {
    docs: [{ title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '空间规划与人体工学基础' }],
    books: [{ title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '收纳方法论的代表作，行业认知起点' }],
  },
  '情绪健康教练': {
    docs: [
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '情绪科学基础' },
      { title: '世界卫生组织心理健康', url: 'https://www.who.int/health-topics/mental-health', source: 'WHO', note: '情绪与心理健康参考' },
    ],
    books: [{ title: '情绪：为什么情绪比认知更重要', author: 'Lisa Feldman Barrett', why: '情绪建构理论，教练方法的科学底座' }],
  },
  '正念/冥想导师': {
    docs: [
      { title: '牛津正念中心', url: 'https://www.oxfordmindfulness.org/', source: 'Oxford Mindfulness', note: '正念课程（MBCT）研发机构' },
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '注意与情绪基础' },
    ],
    books: [{ title: '多舛的生命', author: 'Jon Kabat-Zinn', why: '正念减压（MBSR）体系的奠基之作' }],
  },
  '体能训练师': {
    docs: [
      { title: 'edX 运动科学课程合集', url: 'https://www.edx.org/learn/sports', source: 'edX', note: '运动科学基础' },
      { title: 'NSCA 美国国家体能协会', url: 'https://www.nsca.com/', source: 'NSCA', note: '体能训练与认证体系' },
    ],
    books: [{ title: 'Essentials of Strength Training and Conditioning', author: 'NSCA', why: '体能训练的标准教材' }],
  },
  '宠物行为矫正师': {
    docs: [
      { title: 'WSAVA', url: 'https://wsava.org/', source: 'WSAVA', note: '行为医学与动物福利指南' },
      { title: 'edX 动物健康课程合集', url: 'https://www.edx.org/learn/animal-health', source: 'edX', note: '动物行为基础' },
    ],
  },
  '私域健康顾问': {
    docs: [
      { title: '世界卫生组织', url: 'https://www.who.int/', source: 'WHO', note: '健康促进与慢病管理参考' },
      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '国内健康管理政策与指南' },
    ],
  },

  /* ===== 医疗 ===== */
  '医美咨询师': {
    docs: [
      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '医疗美容服务管理规范' },
      { title: 'edX 医疗健康课程合集', url: 'https://www.edx.org/learn/healthcare', source: 'edX', note: '医美相关医学基础' },
    ],
  },
  '体检中心运营经理': {
    docs: [
      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '健康体检管理相关规定' },
      { title: 'edX 医疗健康课程合集', url: 'https://www.edx.org/learn/healthcare', source: 'edX', note: '健康管理基础' },
    ],
  },
  '高级康复治疗师': {
    docs: [
      { title: '世界卫生组织康复', url: 'https://www.who.int/health-topics/rehabilitation', source: 'WHO', note: '康复服务体系参考' },
      { title: 'edX 医学课程合集', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '康复医学基础' },
    ],
  },
  '体外循环灌注师': {
    docs: [
      { title: 'edX 医学课程合集', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '心血管与体外循环基础' },
      { title: '美国体外循环协会（AmSECT）', url: 'https://www.amsect.org/', source: 'AmSECT', note: '灌注师专业标准与培训' },
    ],
  },
  '高压氧治疗师': {
    docs: [
      { title: 'edX 医学课程合集', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '高压氧治疗适应证基础' },
      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '高压氧舱管理规范' },
    ],
  },
  '家庭健康管理师': {
    docs: [
      { title: '世界卫生组织', url: 'https://www.who.int/', source: 'WHO', note: '家庭与社区健康管理参考' },
      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '健康管理与慢病防治指南' },
    ],
    books: [{ title: '最好的告别', author: 'Atul Gawande', why: '家庭健康决策与临终照护的人文视角' }],
  },
  '医学事务专员': {
    docs: [
      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn/', source: 'NMPA', note: '药品与医学事务法规来源' },
      { title: 'edX 医学课程合集', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '临床与药学基础' },
    ],
  },
  '临床研究监查员': {
    docs: [
      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn/', source: 'NMPA', note: '药物临床试验质量管理规范（GCP）' },
      { title: '美国国立卫生研究院', url: 'https://www.nih.gov/', source: 'NIH', note: '临床研究方法与伦理' },
    ],
  },
  '基因检测解读师': {
    docs: [
      { title: '美国国立卫生研究院', url: 'https://www.nih.gov/', source: 'NIH', note: '基因组学与遗传咨询参考' },
      { title: 'edX 生物学课程合集', url: 'https://www.edx.org/learn/biology', source: 'edX', note: '遗传学基础' },
    ],
    books: [{ title: '基因组：人种自传23章', author: 'Matt Ridley', why: '理解基因检测与遗传解读的科普经典' }],
  },
  '视光师': {
    docs: [
      { title: '世界卫生组织视力', url: 'https://www.who.int/health-topics/vision', source: 'WHO', note: '全球视光与近视防控参考' },
      { title: 'edX 医学课程合集', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '视光学基础' },
    ],
  },
  '心理治疗师（线上）': {
    docs: [
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '心理治疗理论与伦理' },
      { title: '世界卫生组织心理健康', url: 'https://www.who.int/health-topics/mental-health', source: 'WHO', note: '远程心理服务参考' },
    ],
    books: [{ title: '心理咨询与治疗的理论及实践', author: 'Gerald Corey', why: '主流治疗流派的系统教材' }],
  },
  'AI药物发现研究员': {
    docs: [
      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: 'AI 制药与分子生成论文' },
      { title: 'edX 生物学课程合集', url: 'https://www.edx.org/learn/biology', source: 'edX', note: '药物化学与分子生物学基础' },
    ],
    books: [{ title: '药物化学', author: 'Graham L. Patrick', why: '分子设计与成药性基础' }],
  },
  '医疗器械法规专员': {
    docs: [
      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn/', source: 'NMPA', note: '医疗器械注册与法规来源' },
      { title: 'FDA 医疗器械', url: 'https://www.fda.gov/medical-devices', source: 'FDA', note: '器械上市与合规路径参考' },
    ],
  },
  '运动康复师': {
    docs: [
      { title: 'edX 运动科学课程合集', url: 'https://www.edx.org/learn/sports', source: 'edX', note: '运动康复与解剖基础' },
      { title: '美国运动医学会（ACSM）', url: 'https://www.acsm.org/', source: 'ACSM', note: '运动医学与康复标准' },
    ],
    books: [{ title: '运动损伤的预防与康复', author: '多位运动医学学者', why: '康复评估与训练方案参考' }],
  },
  '数字疗法产品经理': {
    docs: [
      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn/', source: 'NMPA', note: '数字疗法与软件医疗器械监管' },
      { title: 'edX 医疗健康课程合集', url: 'https://www.edx.org/learn/healthcare', source: 'edX', note: '临床干预与产品基础' },
    ],
  },

  /* ===== 设计 ===== */
  '纹身师': {
    docs: [{ title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '造型与视觉设计基础' }],
  },
  '银发产品设计师': {
    docs: [
      { title: '世界卫生组织老龄化', url: 'https://www.who.int/health-topics/ageing', source: 'WHO', note: '老龄用户需求参考' },
      { title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '以人为本的设计方法' },
    ],
    books: [{ title: '通用设计：包容性设计指南', author: '多位设计学者', why: '适老与包容设计的原则参考' }],
  },
  '无障碍设计专家': {
    docs: [
      { title: 'W3C 无障碍指南（WCAG）', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', source: 'W3C', note: '无障碍设计的国际标准' },
      { title: 'MDN 无障碍文档', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility', source: 'MDN', note: 'Web 无障碍实现指南' },
    ],
  },
  '服务设计师': {
    docs: [
      { title: 'Interaction Design Foundation', url: 'https://www.interaction-design.org/', source: 'IxDF', note: '服务设计与 UX 方法论' },
      { title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '设计思维与调研基础' },
    ],
    books: [{ title: '这就是服务设计思考', author: 'Marc Stickdorn 等', why: '服务设计方法与工具的系统读本' }],
  },
  '内容设计师': {
    docs: [
      { title: 'Google 技术写作课程', url: 'https://developers.google.com/tech-writing', source: 'Google', note: '清晰写作与信息架构' },
      { title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/', source: 'NN/g', note: '内容设计与 UX 写作研究' },
    ],
  },
  '提示词视觉设计师': {
    docs: [
      { title: 'Hugging Face 扩散模型课程', url: 'https://huggingface.co/learn/diffusion-course/unit0/1', source: 'Hugging Face', note: '生成式视觉模型原理与提示技巧' },
      { title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '视觉设计基础' },
    ],
  },
  '智能座舱交互设计师': {
    docs: [
      { title: 'Google UX 设计专业证书', url: 'https://www.coursera.org/professional-certificates/google-ux-design', source: 'Coursera', note: 'UX 全流程，可迁移到座舱交互' },
      { title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/', source: 'NN/g', note: '人机交互与安全相关研究' },
    ],
    books: [{ title: 'About Face 4：交互设计精髓', author: 'Alan Cooper 等', why: '复杂人机系统的交互设计经典' }],
  },
  '空间/展览设计师': {
    docs: [
      { title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '空间与展示设计基础' },
      { title: 'SketchUp 官方教程', url: 'https://learn.sketchup.com/tutorials', source: 'SketchUp', note: '空间建模与方案表达' },
    ],
  },
  '用户研究员': {
    docs: [
      { title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/', source: 'NN/g', note: '用户研究方法与案例' },
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '行为与认知基础' },
    ],
    books: [{ title: '洞察用户体验：用户研究方法与设计实践', author: 'Mike Kuniavsky 等', why: '用研方法与工具的系统手册' }],
  },

  /* ===== 教育 ===== */
  '驾校教练': {
    docs: [
      { title: '公安部交通管理局', url: 'https://www.mps.gov.cn/', source: '公安部', note: '驾驶培训与考试规范来源' },
      { title: '中国民用航空局', url: 'https://www.caac.gov.cn/', source: '民航局', note: '（如涉飞行培训）相关法规参考' },
    ],
  },
  '知识付费产品经理': {
    docs: [
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '教学设计与课程产品基础' },
      { title: 'Coursera 课程设计指南', url: 'https://www.coursera.org/learn/instructional-design', source: 'Coursera', note: '在线课程设计与交付' },
    ],
    books: [{ title: '刻意练习', author: 'Anders Ericsson、Robert Pool', why: '设计「让人真正学会」的课程内容' }],
  },
  'AI家教系统设计': {
    docs: [
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '教学法与自适应学习基础' },
      { title: 'Hugging Face 大模型课程', url: 'https://huggingface.co/learn/llm-course/chapter1/1', source: 'Hugging Face', note: '用 LLM 构建陪练与反馈' },
    ],
  },
  '数字素养讲师': {
    docs: [
      { title: '联合国教科文组织', url: 'https://www.unesco.org/', source: 'UNESCO', note: '数字素养与媒介素养框架' },
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '课程设计与讲授基础' },
    ],
  },
  '心理测评研究员': {
    docs: [
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '心理测量与统计基础' },
      { title: '美国心理学会（APA）', url: 'https://www.apa.org/', source: 'APA', note: '测评伦理与标准' },
    ],
    books: [{ title: '心理与教育测量', author: 'Robert M. Kaplan、Dennis P. Saccuzzo', why: '心理测量学的系统教材' }],
  },
  '学习设计师': {
    docs: [
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '教学设计（ISD）基础' },
      { title: 'Coursera 教学设计', url: 'https://www.coursera.org/learn/instructional-design', source: 'Coursera', note: '学习路径与评估设计' },
    ],
  },
  'AI教练/学习陪练': {
    docs: [
      { title: 'Hugging Face 大模型课程', url: 'https://huggingface.co/learn/llm-course/chapter1/1', source: 'Hugging Face', note: '用模型做个性化陪练' },
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '反馈与教学法基础' },
    ],
  },
  '求职陪跑教练': {
    docs: [
      { title: 'O*NET 职业信息网', url: 'https://www.onetonline.org/', source: 'O*NET', note: '岗位能力要求与职业信息' },
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '辅导与反馈方法' },
    ],
    books: [{ title: '你的降落伞是什么颜色？', author: 'Richard N. Bolles', why: '求职方法论与陪跑框架' }],
  },
  'AI职业转型顾问': {
    docs: [
      { title: 'O*NET 职业信息网', url: 'https://www.onetonline.org/', source: 'O*NET', note: '职业迁移与技能映射参考' },
      { title: '世界经济论坛未来就业报告', url: 'https://www.weforum.org/publications/', source: 'WEF', note: 'AI 对岗位结构影响的权威报告' },
    ],
  },
  '亲子沟通教练': {
    docs: [
      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '发展心理与沟通基础' },
      { title: '联合国儿童基金会', url: 'https://www.unicef.org/', source: 'UNICEF', note: '儿童发展与养育参考' },
    ],
    books: [{ title: '如何说孩子才会听，怎么听孩子才肯说', author: 'Adele Faber、Elaine Mazlish', why: '亲子沟通方法论的经典' }],
  },
  '特殊教育辅助师': {
    docs: [
      { title: '联合国教科文组织', url: 'https://www.unesco.org/', source: 'UNESCO', note: '融合教育与特殊需求框架' },
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '特殊教育教学法基础' },
    ],
  },
  '研学课程设计师': {
    docs: [
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '体验式学习与课程设计' },
      { title: '联合国教科文组织', url: 'https://www.unesco.org/', source: 'UNESCO', note: '研学与校外教育参考' },
    ],
  },

  /* ===== 金融 ===== */
  '链上数据分析师': {
    docs: [
      { title: 'Dune 文档', url: 'https://docs.dune.com/', source: 'Dune', note: '链上数据查询与分析平台' },
      { title: '以太坊开发者文档', url: 'https://ethereum.org/en/developers/docs/', source: 'ethereum.org', note: '链上数据模型基础' },
    ],
  },
  '央行数字货币研究员': {
    docs: [
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '中国人民银行', note: '数字人民币研究与政策来源' },
      { title: '国际清算银行（BIS）', url: 'https://www.bis.org/', source: 'BIS', note: 'CBDC 国际研究与报告' },
    ],
  },
  '跨境支付合规师': {
    docs: [
      { title: '国家外汇管理局', url: 'https://www.safe.gov.cn/', source: '外汇局', note: '跨境资金流动与合规政策' },
      { title: '金融行动特别工作组（FATF）', url: 'https://www.fatf-gafi.org/', source: 'FATF', note: '反洗钱与跨境合规国际标准' },
    ],
  },
  '数字资产管理师': {
    docs: [
      { title: '金融行动特别工作组（FATF）', url: 'https://www.fatf-gafi.org/', source: 'FATF', note: '虚拟资产监管建议' },
      { title: '中国人民银行', url: 'https://www.pbc.gov.cn/', source: '中国人民银行', note: '虚拟货币监管口径' },
    ],
  },
  '养老金融规划师': {
    docs: [
      { title: '人力资源和社会保障部', url: 'https://www.mohrss.gov.cn/', source: '人社部', note: '养老保险与个人养老金政策' },
      { title: '中国银行保险监督管理委员会', url: 'https://www.nfra.gov.cn/', source: '金融监管总局', note: '养老金融产品监管' },
    ],
    books: [{ title: '养老金投资与理财', author: '多位养老金融学者', why: '退休现金流规划的方法参考' }],
  },
  '家庭资产配置顾问': {
    docs: [
      { title: '中国证券监督管理委员会', url: 'https://www.csrc.gov.cn/', source: '证监会', note: '投资者适当性与产品监管' },
      { title: 'CFA 协会', url: 'https://www.cfainstitute.org/en/programs/cfa-program', source: 'CFA Institute', note: '资产配置与投资管理知识体系' },
    ],
    books: [{ title: '漫步华尔街', author: 'Burton G. Malkiel', why: '资产配置与长期投资的经典入门' }],
  },
  '消费金融风控师': {
    docs: [
      { title: '中国银行保险监督管理委员会', url: 'https://www.nfra.gov.cn/', source: '金融监管总局', note: '消费金融与风控监管政策' },
      { title: 'scikit-learn 用户指南', url: 'https://scikit-learn.org/stable/user_guide.html', source: 'scikit-learn', note: '风控建模与评分卡基础' },
    ],
  },
  '碳交易员': {
    docs: [
      { title: '全国碳排放权交易市场', url: 'https://www.cneeex.com/', source: '上海环境能源交易所', note: '碳配额交易规则与行情' },
      { title: 'GHG Protocol', url: 'https://ghgprotocol.org/', source: 'GHG Protocol', note: '碳核算与交易计量基础' },
    ],
  },

  /* ===== 法律 ===== */
  '数据合规官': {
    docs: [
      { title: '中国人大网 法律法规数据库', url: 'https://flk.npc.gov.cn', source: '全国人大', note: '数据安全法、个人信息保护法条文' },
      { title: '中国网信办', url: 'https://www.cac.gov.cn/', source: '国家网信办', note: '数据出境与合规政策来源' },
    ],
  },
  '算法合规顾问': {
    docs: [
      { title: '中国网信办', url: 'https://www.cac.gov.cn/', source: '国家网信办', note: '算法推荐管理规定与备案' },
      { title: '中国人大网 法律法规数据库', url: 'https://flk.npc.gov.cn', source: '全国人大', note: '算法与自动化决策相关法规' },
    ],
  },
  '出海法务': {
    docs: [
      { title: '中国人大网 法律法规数据库', url: 'https://flk.npc.gov.cn', source: '全国人大', note: '国内涉外法规基础' },
      { title: '商务部', url: 'https://www.mofcom.gov.cn/', source: '商务部', note: '对外投资与贸易政策来源' },
    ],
  },
  '知识产权运营师': {
    docs: [
      { title: '国家知识产权局', url: 'https://www.cnipa.gov.cn/', source: '国知局', note: '专利商标政策与数据库' },
      { title: '世界知识产权组织（WIPO）', url: 'https://www.wipo.int/', source: 'WIPO', note: '知识产权国际运营与许可' },
    ],
  },

  /* ===== 管理 ===== */
  '一人公司运营者': {
    docs: [
      { title: '国家税务总局', url: 'https://www.chinatax.gov.cn/', source: '税务总局', note: '个体工商户与小微企业税务' },
      { title: 'roadmap.sh', url: 'https://roadmap.sh/', source: 'roadmap.sh', note: '用工具与自动化替代团队职能' },
    ],
    books: [{ title: '小而美：持续盈利的经营法则', author: 'Paul Jarvis', why: '一人公司可持续经营的底层逻辑' }],
  },
  'ESG顾问': {
    docs: [
      { title: '可持续会计准则委员会（SASB）', url: 'https://sasb.ifrs.org/', source: 'SASB', note: '行业 ESG 披露标准' },
      { title: '全球报告倡议组织（GRI）', url: 'https://www.globalreporting.org/', source: 'GRI', note: '可持续发展报告标准' },
    ],
  },
  '双碳管理咨询师': {
    docs: [
      { title: 'GHG Protocol', url: 'https://ghgprotocol.org/', source: 'GHG Protocol', note: '企业碳核算与目标设定标准' },
      { title: '国际能源署', url: 'https://www.iea.org/', source: 'IEA', note: '减排路径与政策报告' },
    ],
  },
  '数据伦理官': {
    docs: [
      { title: '联合国教科文组织 AI 伦理', url: 'https://www.unesco.org/en/artificial-intelligence', source: 'UNESCO', note: 'AI 伦理建议书与框架' },
      { title: '中国网信办', url: 'https://www.cac.gov.cn/', source: '国家网信办', note: '数据与算法伦理政策来源' },
    ],
  },
  'AI产品伦理审查员': {
    docs: [
      { title: '联合国教科文组织 AI 伦理', url: 'https://www.unesco.org/en/artificial-intelligence', source: 'UNESCO', note: 'AI 伦理影响评估框架' },
      { title: 'OWASP LLM 应用十大风险', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', source: 'OWASP', note: 'AI 产品风险清单' },
    ],
  },
  '可持续供应链经理': {
    docs: [
      { title: '全球报告倡议组织（GRI）', url: 'https://www.globalreporting.org/', source: 'GRI', note: '供应链可持续披露标准' },
      { title: 'edX 供应链课程合集', url: 'https://www.edx.org/learn/supply-chain-management', source: 'edX', note: '供应链管理与风险基础' },
    ],
  },

  /* ===== 传媒 ===== */
  '个人IP运营': {
    docs: [
      { title: 'edX 市场营销课程合集', url: 'https://www.edx.org/learn/marketing', source: 'edX', note: '个人品牌与增长基础' },
      { title: 'edX 传播学课程合集', url: 'https://www.edx.org/learn/communication', source: 'edX', note: '传播与内容策略' },
    ],
    books: [{ title: '这就是营销', author: 'Seth Godin', why: '个人品牌与受众经营的底层逻辑' }],
  },
  'AI内容审校师': {
    docs: [
      { title: 'Poynter 事实核查', url: 'https://www.poynter.org/', source: 'Poynter', note: '事实核查与编辑标准' },
      { title: 'edX 传播学课程合集', url: 'https://www.edx.org/learn/communication', source: 'edX', note: '编辑与内容质量基础' },
    ],
  },
  '短视频编导': {
    docs: [
      { title: 'edX 传播学课程合集', url: 'https://www.edx.org/learn/communication', source: 'edX', note: '叙事与传播基础' },
      { title: 'edX 电影课程合集', url: 'https://www.edx.org/learn/film', source: 'edX', note: '视听语言与镜头基础' },
    ],
  },
  '音频节目编导': {
    docs: [{ title: 'edX 传播学课程合集', url: 'https://www.edx.org/learn/communication', source: 'edX', note: '音频叙事与采访基础' }],
  },
  '短剧编剧': {
    docs: [
      { title: 'edX 电影课程合集', url: 'https://www.edx.org/learn/film', source: 'edX', note: '剧作结构基础' },
      { title: 'edX 传播学课程合集', url: 'https://www.edx.org/learn/communication', source: 'edX', note: '短内容叙事与钩子' },
    ],
    books: [{ title: '故事：材质、结构、风格和银幕剧作的原理', author: 'Robert McKee', why: '剧作结构的经典教材' }],
  },
  'NFT/数字藏品策展': {
    docs: [
      { title: '以太坊开发者文档', url: 'https://ethereum.org/en/developers/docs/', source: 'ethereum.org', note: 'NFT 标准与应用基础' },
      { title: 'edX 艺术课程合集', url: 'https://www.edx.org/learn/art', source: 'edX', note: '策展与艺术史基础' },
    ],
  },
  '游戏本地化专家': {
    docs: [
      { title: '游戏本地化协会（IGDA）', url: 'https://igda.org/', source: 'IGDA', note: '本地化与行业标准参考' },
      { title: 'edX 语言学课程合集', url: 'https://www.edx.org/learn/linguistics', source: 'edX', note: '跨文化与翻译基础' },
    ],
  },
  '内容风控审核师': {
    docs: [
      { title: '中国网信办', url: 'https://www.cac.gov.cn/', source: '国家网信办', note: '内容审核相关规范' },
      { title: 'edX 传播学课程合集', url: 'https://www.edx.org/learn/communication', source: 'edX', note: '内容判断与伦理基础' },
    ],
  },
  '实时虚拟拍摄师': {
    docs: [
      { title: 'Unreal Engine 官方文档', url: 'https://dev.epicgames.com/documentation/', source: 'Epic Games', note: '实时引擎与虚拟制片管线' },
      { title: 'edX 电影课程合集', url: 'https://www.edx.org/learn/film', source: 'edX', note: '摄影与灯光基础' },
    ],
  },
  '短剧制片人': {
    docs: [
      { title: 'edX 电影课程合集', url: 'https://www.edx.org/learn/film', source: 'edX', note: '制片与剧作基础' },
      { title: 'edX 商业课程合集', url: 'https://www.edx.org/learn/business', source: 'edX', note: '项目与成本管理' },
    ],
  },

  /* ===== 商业销售 ===== */
  '跨境电商独立站运营': {
    docs: [
      { title: 'Shopify 学习中心', url: 'https://www.shopify.com/learn', source: 'Shopify', note: '独立站搭建与运营' },
      { title: 'Google 数字营销课程', url: 'https://skillshop.withgoogle.com/', source: 'Google', note: '投放与增长基础' },
    ],
    books: [{ title: '跨境电商运营实务', author: '多位行业从业者', why: '选品、投放与供应链的实操框架' }],
  },
  'AI出海运营': {
    docs: [
      { title: 'Google 数字营销课程', url: 'https://skillshop.withgoogle.com/', source: 'Google', note: '海外增长与投放' },
      { title: 'edX 市场营销课程合集', url: 'https://www.edx.org/learn/marketing', source: 'edX', note: '市场与本地化基础' },
    ],
  },
  'GEO专员': {
    docs: [
      { title: 'Google 搜索中心', url: 'https://developers.google.com/search', source: 'Google', note: '搜索与内容可见性基础' },
      { title: 'edX 市场营销课程合集', url: 'https://www.edx.org/learn/marketing', source: 'edX', note: '内容营销与可发现性' },
    ],
  },
  'AI直播运营': {
    docs: [
      { title: 'edX 市场营销课程合集', url: 'https://www.edx.org/learn/marketing', source: 'edX', note: '直播与投放基础' },
      { title: 'Hugging Face 音频课程', url: 'https://huggingface.co/learn/audio-course/chapter0/introduction', source: 'Hugging Face', note: '数字人语音与直播技术' },
    ],
  },
};
