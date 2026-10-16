import type { CareerResourceSet } from '../career-resources';

/**
 * 职业级专属学习资源 · 补充 11（2026-10-10）
 * 覆盖：服务、医疗、设计、教育、金融、法律、管理、传媒、商业销售。
 * 纪律同 career-resources.ts 头注释：只写实测可达的稳定页；书籍为真实可购书目，不标 ISBN。
 */
export const supplementResources11: Record<string, CareerResourceSet> = {
  /* ===== 服务 ===== */
  '宠物美容师': {
    videos: [
      { title: '宠物美容公开课（职业技能）', url: 'https://www.bilibili.com/video/BV14T4y1P7RA', source: 'Bilibili', note: '宠物美容系统课' },
    ],
    docs: [
      { title: 'reddit · r/doggrooming', url: 'https://www.reddit.com/r/doggrooming/', source: '行业社区', note: '宠物美容全球社区', kind: 'community' },
{ title: 'edX 动物学课程合集', url: 'https://www.edx.org/learn/animal-health', source: 'edX', note: '动物健康与护理基础' }],
    books: [
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '动物行为的科普经典' },
{ title: '狗狗美容师手册', author: '多位行业从业者', why: '宠物洗护与造型的实操指南（可选中文版宠物美容教程类书籍）' }],
  },
  '上门美甲师': {
    books: [
      { title: '皮肤的秘密', author: '耶尔·阿德勒', why: '甲面与手部护理的皮肤学根基' },
      { title: '现代礼仪', author: '袁涤非', why: '上门服务的礼仪标准' },
    ],
    docs: [
      { title: 'reddit · r/Nails', url: 'https://www.reddit.com/r/Nails/', source: '行业社区', note: '美甲师社区', kind: 'community' },

      { title: '现代礼仪（湖南大学·国家精品）', url: 'https://www.icourse163.org/course/hnu-20005', source: '中国大学MOOC', note: '上门服务的职业礼仪规范' },
    ],
    videos: [{ title: 'edX 美容课程合集', url: 'https://www.edx.org/learn/beauty', source: 'edX', note: '美容护理基础（英文）' }],
  },
  '医疗陪诊师': {
    books: [
      { title: '最好的告别', author: '阿图·葛文德', why: '老年关怀与临终照护的必读经典' },
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '居家养老照护的理念之作' },
    ],
    videos: [
      { title: '养老护理员基础知识（初中高级·国家职业资格）', url: 'https://www.bilibili.com/video/BV1iSeFeuErF', source: 'Bilibili', note: '养老护理考证课' },
    ],
    docs: [
      { title: 'reddit · r/eldercare', url: 'https://www.reddit.com/r/eldercare/', source: '行业社区', note: '养老照护全球社区', kind: 'community' },

      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '就医流程与政策来源' },
      { title: '世界卫生组织', url: 'https://www.who.int/', source: 'WHO', note: '患者沟通与健康素养参考' },
    ],
  },
  '安宁疗护师': {
    videos: [
      { title: '养老护理岗前培训必备技能', url: 'https://www.bilibili.com/video/BV17XdzB2Ea4', source: 'Bilibili', note: '护理技能岗前课' }
    ],
    docs: [
      { title: 'reddit · r/pets', url: 'https://www.reddit.com/r/pets/', source: '行业社区', note: '宠物社区', kind: 'community' },

      { title: '世界卫生组织姑息治疗', url: 'https://www.who.int/health-topics/palliative-care', source: 'WHO', note: '姑息治疗与安宁疗护的国际框架' }
    ],
    books: [
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '居家养老照护的理念之作' },
{ title: '最好的告别', author: 'Atul Gawande', why: '理解生命末期照护与尊严的必读之作' }],
  },
  '适老化改造师': {
    books: [
      { title: '最好的告别', author: '阿图·葛文德', why: '老年关怀与临终照护的必读经典' },
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '居家养老照护的理念之作' },
    ],
    videos: [
      { title: '养老护理岗前培训必备技能', url: 'https://www.bilibili.com/video/BV17XdzB2Ea4', source: 'Bilibili', note: '护理技能岗前课' },
    ],
    docs: [
      { title: 'reddit · r/declutter', url: 'https://www.reddit.com/r/declutter/', source: '行业社区', note: '整理收纳社区', kind: 'community' },

      { title: '世界卫生组织老龄化', url: 'https://www.who.int/health-topics/ageing', source: 'WHO', note: '积极老龄化与适老环境标准' },
      { title: '民政部', url: 'https://www.mca.gov.cn/', source: '民政部', note: '养老服务与适老化改造政策' },
    ],
  },
  '养老照护管理师': {
    videos: [
      { title: '养老护理岗前培训必备技能', url: 'https://www.bilibili.com/video/BV17XdzB2Ea4', source: 'Bilibili', note: '护理技能岗前课' },
    ],
    docs: [
      { title: 'reddit · r/declutter', url: 'https://www.reddit.com/r/declutter/', source: '行业社区', note: '整理收纳社区', kind: 'community' },

      { title: '民政部', url: 'https://www.mca.gov.cn/', source: '民政部', note: '养老机构管理与服务标准' },
      { title: '世界卫生组织老龄化', url: 'https://www.who.int/health-topics/ageing', source: 'WHO', note: '长期照护体系参考' },
    ],
    books: [
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '居家养老照护的理念之作' },
{ title: '最好的告别', author: 'Atul Gawande', why: '照护决策与人文关怀的经典读本' }],
  },
  '宠物营养师': {
    books: [
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '动物习性观察的经典' },
      { title: '狗的家世', author: '康拉德·洛伦茨', why: '宠物饮食行为的理解' },
    ],
    videos: [
      { title: '宠物营养中级班（全23集）', url: 'https://www.bilibili.com/video/BV1Ub4vzeEfU', source: 'Bilibili', note: '宠物营养系统课' },
    ],
    docs: [
      { title: 'reddit · r/pets', url: 'https://www.reddit.com/r/pets/', source: '行业社区', note: '宠物营养讨论社区', kind: 'community' },

      { title: 'edX 动物健康课程合集', url: 'https://www.edx.org/learn/animal-health', source: 'edX', note: '动物营养与健康基础' },
      { title: '世界小动物兽医协会（WSAVA）', url: 'https://wsava.org/', source: 'WSAVA', note: '小动物营养与临床指南' },
    ],
  },
  '宠物摄影师': {
    books: [
      { title: '论摄影', author: '苏珊·桑塔格', why: '摄影美学的思想经典' },
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '理解动物习性的拍摄根基' },
    ],
    videos: [
      { title: '宠物摄影深耕教学：从零开始全方位实战', url: 'https://www.bilibili.com/video/BV1sR9UBEEbc', source: 'Bilibili', note: '宠物摄影系统课' },
    ],
    docs: [
      { title: 'reddit · r/pets', url: 'https://www.reddit.com/r/pets/', source: '行业社区', note: '宠物摄影讨论社区', kind: 'community' },
{ title: 'edX 摄影课程合集', url: 'https://www.edx.org/learn/photography', source: 'edX', note: '摄影构图与用光基础' }],
  },
  '宠物善终服务师': {
    books: [
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '临终陪伴服务的范式参考' },
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '人与动物情感联结的经典' }
    ],
    videos: [
      { title: '宠物殡葬行业揭秘', url: 'https://www.bilibili.com/video/BV1iJ4m1G7kJ', source: 'Bilibili', note: '宠物殡葬行业认知' }
    ],
    docs: [
      { title: 'reddit · r/Petloss', url: 'https://www.reddit.com/r/Petloss/', source: '行业社区', note: '宠物离世抚慰社区', kind: 'community' },

      { title: 'WSAVA 临终关怀', url: 'https://wsava.org/', source: 'WSAVA', note: '宠物临终关怀与哀伤支持' }
    ],
  },
  '心理疏导师': {
    videos: [
      { title: '如何提供有效安慰', url: 'https://www.bilibili.com/video/BV1TRYz6yEE1', source: 'Bilibili', note: '心理疏导实务课' }
    ],
    docs: [
      { title: 'reddit · r/Meditation', url: 'https://www.reddit.com/r/Meditation/', source: '行业社区', note: '正念冥想全球社区', kind: 'community' },

      { title: '世界卫生组织心理健康', url: 'https://www.who.int/health-topics/mental-health', source: 'WHO', note: '心理健康服务框架' }
    ],
    books: [
      { title: '被讨厌的勇气', author: '岸见一郎', why: '阿德勒心理学的对话经典' },
{ title: '心理咨询面谈技术', author: 'Kathryn Geldard、David Geldard', why: '倾听与回应的实操手册' }],
  },
  '睡眠管理师': {
    videos: [
      { title: '30分钟美军睡眠法引导', url: 'https://www.bilibili.com/video/BV1touPzAE7g', source: 'Bilibili', note: '睡眠放松引导' }
    ],
    docs: [
      { title: 'reddit · r/sleep', url: 'https://www.reddit.com/r/sleep/', source: '行业社区', note: '睡眠健康社区', kind: 'community' },

      { title: 'Sleep Foundation', url: 'https://www.sleepfoundation.org/', source: 'Sleep Foundation', note: '睡眠科学与行为疗法科普' }
    ],
    books: [
      { title: '被讨厌的勇气', author: '岸见一郎', why: '情绪与人际课题的心理根基' },
{ title: '我们为什么要睡觉', author: 'Matthew Walker', why: '睡眠机制与干预的科普基石' }],
  },
  '生涯规划师': {
    videos: [
      { title: '生涯规划：没目标/无规划怎么办（框框的B站大学）', url: 'https://www.bilibili.com/video/BV1vP4y1A7K4', source: 'Bilibili', note: '生涯规划全景课' }
    ],
    docs: [
      { title: 'reddit · r/careerguidance', url: 'https://www.reddit.com/r/careerguidance/', source: '行业社区', note: '职业规划全球社区', kind: 'community' },

      { title: 'O*NET 职业信息网', url: 'https://www.onetonline.org/', source: 'O*NET', note: '职业能力与岗位要求数据库' }
    ],
    books: [
      { title: '人生设计课', author: '比尔·博内特', why: '斯坦福生涯设计方法论' },
{ title: '你的降落伞是什么颜色？', author: 'Richard N. Bolles', why: '生涯规划行业的经典入门' }],
  },
  '婚恋顾问': {
    videos: [
      { title: '绘画治疗在婚恋中的咨询应用', url: 'https://www.bilibili.com/video/BV1HM411t7es', source: 'Bilibili', note: '婚恋咨询技术课' }
    ],
    docs: [
      { title: 'reddit · r/relationship_advice', url: 'https://www.reddit.com/r/relationship_advice/', source: '行业社区', note: '亲密关系社区', kind: 'community' },

      { title: 'Gottman Institute', url: 'https://www.gottman.com/', source: 'Gottman Institute', note: '伴侣关系研究的权威机构' }
    ],
    books: [
      { title: '亲密关系', author: '罗兰·米勒', why: '婚恋心理的科学经典' },
{ title: '幸福的婚姻', author: 'John M. Gottman', why: '以研究为基础的亲密关系方法论' }],
  },
  '整理收纳咨询师': {
    videos: [
      { title: '美好生活从整理开始（正统理论与实操）', url: 'https://www.bilibili.com/video/BV1xZ4y1j7qV', source: 'Bilibili', note: '收纳整理系统课' },
    ],
    docs: [
      { title: 'reddit · r/konmari', url: 'https://www.reddit.com/r/konmari/', source: '行业社区', note: '近藤麻理惠整理法社区', kind: 'community' },
{ title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '空间规划与人体工学基础' }],
    books: [
      { title: '断舍离', author: '山下英子', why: '整理收纳的理念经典' },
{ title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '收纳方法论的代表作，行业认知起点' }],
  },
  '情绪健康教练': {
    videos: [
      { title: '如何提供有效安慰', url: 'https://www.bilibili.com/video/BV1TRYz6yEE1', source: 'Bilibili', note: '心理疏导实务课' }
    ],
    docs: [
      { title: 'reddit · r/Meditation', url: 'https://www.reddit.com/r/Meditation/', source: '行业社区', note: '正念冥想全球社区', kind: 'community' },

      { title: '世界卫生组织心理健康', url: 'https://www.who.int/health-topics/mental-health', source: 'WHO', note: '情绪与心理健康参考' }
    ],
    books: [
      { title: '被讨厌的勇气', author: '岸见一郎', why: '阿德勒心理学的对话经典' },
{ title: '情绪：为什么情绪比认知更重要', author: 'Lisa Feldman Barrett', why: '情绪建构理论，教练方法的科学底座' }],
  },
  '正念/冥想导师': {
    videos: [
      { title: '如何提供有效安慰', url: 'https://www.bilibili.com/video/BV1TRYz6yEE1', source: 'Bilibili', note: '心理疏导实务课' }
    ],
    docs: [
      { title: 'reddit · r/Meditation', url: 'https://www.reddit.com/r/Meditation/', source: '行业社区', note: '正念冥想全球社区', kind: 'community' },

      { title: '牛津正念中心', url: 'https://www.oxfordmindfulness.org/', source: 'Oxford Mindfulness', note: '正念课程（MBCT）研发机构' }
    ],
    books: [
      { title: '被讨厌的勇气', author: '岸见一郎', why: '阿德勒心理学的对话经典' },
{ title: '多舛的生命', author: 'Jon Kabat-Zinn', why: '正念减压（MBSR）体系的奠基之作' }],
  },
  '体能训练师': {
    videos: [
      { title: '国职教练：健身教练职业能力考试初级课程', url: 'https://www.bilibili.com/video/BV19P4y1o7Wb', source: 'Bilibili', note: '国职考证系统课' },
    ],
    docs: [
      { title: 'reddit · r/personaltraining', url: 'https://www.reddit.com/r/personaltraining/', source: '行业社区', note: '私教全球社区', kind: 'community' },

      { title: 'edX 运动科学课程合集', url: 'https://www.edx.org/learn/sports', source: 'edX', note: '运动科学基础' },
      { title: 'NSCA 美国国家体能协会', url: 'https://www.nsca.com/', source: 'NSCA', note: '体能训练与认证体系' },
    ],
    books: [
      { title: '运动训练学', author: '田麦久', why: '训练学的标准教材' },
{ title: 'Essentials of Strength Training and Conditioning', author: 'NSCA', why: '体能训练的标准教材' }],
  },
  '宠物行为矫正师': {
    books: [
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '动物行为观察的经典' },
      { title: '狗的家世', author: '康拉德·洛伦茨', why: '训犬与犬类心理的根基' },
    ],
    videos: [
      { title: '艾美奖训犬大师布兰登·麦克米伦大师课', url: 'https://www.bilibili.com/video/BV1PW4y1R7Dh', source: 'Bilibili', note: '训犬大师课' },
    ],
    docs: [
      { title: 'reddit · r/dogtraining', url: 'https://www.reddit.com/r/dogtraining/', source: '行业社区', note: '训犬全球社区', kind: 'community' },

      { title: 'WSAVA', url: 'https://wsava.org/', source: 'WSAVA', note: '行为医学与动物福利指南' },
      { title: 'edX 动物健康课程合集', url: 'https://www.edx.org/learn/animal-health', source: 'edX', note: '动物行为基础' },
    ],
  },
  '私域健康顾问': {
    books: [
      { title: '我们为什么要睡觉', author: '马修·沃克', why: '睡眠科学的权威之作' },
      { title: '被讨厌的勇气', author: '岸见一郎', why: '情绪与人际课题的心理根基' }
    ],
    videos: [
      { title: '30分钟美军睡眠法引导', url: 'https://www.bilibili.com/video/BV1touPzAE7g', source: 'Bilibili', note: '睡眠放松引导' }
    ],
    docs: [
      { title: '护理学导论（西安交通大学）', url: 'https://www.chinaooc.com.cn/course/68b368cad5f9b8b6cf89e0e7', source: '国家高等教育智慧教育平台', note: '护理理论体系与临床应用' },

      { title: 'reddit · r/sleep', url: 'https://www.reddit.com/r/sleep/', source: '行业社区', note: '睡眠健康社区', kind: 'community' }
    ],
  },

  /* ===== 医疗 ===== */
  '医美咨询师': {
    books: [
      { title: '皮肤性病学', author: '张学军', why: '医美咨询的皮肤科学根基' },
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '咨询沟通与信任建立的方法' },
    ],
    videos: [
      { title: '皮肤检测实验室深扒医美项目', url: 'https://www.bilibili.com/video/BV1vK4y1R7kb', source: 'Bilibili', note: '医美项目与皮肤科学' },
    ],
    docs: [
      { title: 'reddit · r/dermatology', url: 'https://www.reddit.com/r/dermatology/', source: '行业社区', note: '皮肤科全球社区', kind: 'community' },

      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '医疗美容服务管理规范' },
      { title: 'edX 医疗健康课程合集', url: 'https://www.edx.org/learn/healthcare', source: 'edX', note: '医美相关医学基础' },
    ],
  },
  '体检中心运营经理': {
    books: [
      { title: '默克家庭诊疗手册', author: '默克公司', why: '体检解读与健康评估的权威参考' },
      { title: '中国居民膳食指南', author: '中国营养学会', why: '健康干预建议的权威依据' },
    ],
    videos: [
      { title: '诊断学基础', url: 'https://www.bilibili.com/video/BV1tV4y167JS', source: 'Bilibili', note: '体检评估的问诊查体根基' },
    ],
    docs: [
      { title: '健康界', url: 'https://www.cn-healthcare.com/', source: '行业社区', note: '体检中心运营资讯', kind: 'community' },

      { title: '国家卫生健康委员会', url: 'https://www.nhc.gov.cn/', source: '国家卫健委', note: '健康体检管理相关规定' },
      { title: 'edX 医疗健康课程合集', url: 'https://www.edx.org/learn/healthcare', source: 'edX', note: '健康管理基础' },
    ],
  },
  '高级康复治疗师': {
    books: [
      { title: '康复医学', author: '黄晓琳', why: '康复医学的人卫标准教材' },
      { title: '物理治疗学', author: '燕铁斌', why: '运动治疗与物理因子的核心技术教材' }
    ],
    videos: [
      { title: '《物理治疗学》+《作业治疗学》知识点精讲', url: 'https://www.bilibili.com/video/BV1yy4y1Z7mX', source: 'Bilibili', note: '康复治疗核心课程' }
    ],
    docs: [
      { title: 'reddit · r/PhysicalTherapy', url: 'https://www.reddit.com/r/PhysicalTherapy/', source: '行业社区', note: '物理治疗师全球社区', kind: 'community' },

      { title: '世界卫生组织康复', url: 'https://www.who.int/health-topics/rehabilitation', source: 'WHO', note: '康复服务体系参考' }
    ],
  },
  '体外循环灌注师': {
    books: [
      { title: '外科学', author: '陈孝平', why: '体外循环与外科操作的人卫教材' },
      { title: '血液净化学', author: '王质刚', why: '透析技术的权威专著' },
    ],
    videos: [
      { title: '河南省血液净化专科培训', url: 'https://www.bilibili.com/video/BV1fFHXzUESx', source: 'Bilibili', note: '透析全程管理培训' },
    ],
    docs: [
      { title: '生物谷', url: 'https://www.bioon.com/', source: '行业社区', note: '生命科学资讯', kind: 'community' },

      { title: 'edX 医学课程合集', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '心血管与体外循环基础' },
      { title: '美国体外循环协会（AmSECT）', url: 'https://www.amsect.org/', source: 'AmSECT', note: '灌注师专业标准与培训' },
    ],
  },
  '高压氧治疗师': {
    books: [
      { title: '康复医学', author: '黄晓琳', why: '康复医学的人卫标准教材' },
      { title: '物理治疗学', author: '燕铁斌', why: '运动治疗与物理因子的核心技术教材' }
    ],
    videos: [
      { title: '康复治疗学到底是在学什么', url: 'https://www.bilibili.com/video/BV1ZT411A785', source: 'Bilibili', note: '康复专业与职业全景' }
    ],
    docs: [
      { title: '医学神经生物学（苏州大学）', url: 'https://higher.smartedu.cn/course/6500e6f6374ed23bd755fca3', source: '国家高等教育智慧教育平台', note: '神经系统结构与功能系统课' },

      { title: 'reddit · r/medicalschool', url: 'https://www.reddit.com/r/medicalschool/', source: '行业社区', note: '医学生社区', kind: 'community' }
    ],
  },
  '家庭健康管理师': {
    videos: [
      { title: '营养学（北京大学精品课）', url: 'https://www.bilibili.com/video/BV1SqsqezEA2', source: 'Bilibili', note: '营养学系统课' }
    ],
    docs: [
      { title: '护理学导论（西安交通大学）', url: 'https://www.chinaooc.com.cn/course/68b368cad5f9b8b6cf89e0e7', source: '国家高等教育智慧教育平台', note: '护理理论体系与临床应用' },

      { title: 'reddit · r/nutrition', url: 'https://www.reddit.com/r/nutrition/', source: '行业社区', note: '营养学全球社区', kind: 'community' }
    ],
    books: [
      { title: '营养学：概念与争论', author: '弗朗西斯·辛泽薇', why: '营养科学框架的经典教材' },
{ title: '最好的告别', author: 'Atul Gawande', why: '家庭健康决策与临终照护的人文视角' }],
  },
  '医学事务专员': {
    books: [
      { title: '医学统计学', author: '李康', why: '医学科研统计的人卫教材' },
      { title: '循证医学', author: '李幼平', why: '证据医学的方法论教材' },
    ],
    videos: [
      { title: '循证医学', url: 'https://www.bilibili.com/video/BV1yE411P7DK', source: 'Bilibili', note: '证据分级与系统评价' },
    ],
    docs: [
      { title: 'reddit · r/Healthcare', url: 'https://www.reddit.com/r/Healthcare/', source: '行业社区', note: '医疗行业社区', kind: 'community' },

      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn/', source: 'NMPA', note: '药品与医学事务法规来源' },
      { title: 'edX 医学课程合集', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '临床与药学基础' },
    ],
  },
  '临床研究监查员': {
    books: [
      { title: '坏血', author: '约翰·卡雷鲁', why: '临床试验造假的警示实录' },
      { title: '众病之王：癌症传', author: '悉达多·穆克吉', why: '新药临床试验的历史脉络' },
    ],
    videos: [
      { title: '临床试验协调员（CRC）初级培训', url: 'https://www.bilibili.com/video/BV1f4RFBKEib', source: 'Bilibili', note: 'CRC 岗位实务' },
    ],
    docs: [
      { title: 'reddit · r/clinicalresearch', url: 'https://www.reddit.com/r/clinicalresearch/', source: '行业社区', note: '临床研究全球社区', kind: 'community' },

      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn/', source: 'NMPA', note: '药物临床试验质量管理规范（GCP）' },
      { title: '美国国立卫生研究院', url: 'https://www.nih.gov/', source: 'NIH', note: '临床研究方法与伦理' },
    ],
  },
  '基因检测解读师': {
    videos: [
      { title: '医学遗传学（哈尔滨医科大学·傅松滨·32讲）', url: 'https://www.bilibili.com/video/BV1W64y1o75j', source: 'Bilibili', note: '医学遗传系统课' },
    ],
    docs: [
      { title: 'reddit · r/genetics', url: 'https://www.reddit.com/r/genetics/', source: '行业社区', note: '遗传学全球社区', kind: 'community' },

      { title: '美国国立卫生研究院', url: 'https://www.nih.gov/', source: 'NIH', note: '基因组学与遗传咨询参考' },
      { title: 'edX 生物学课程合集', url: 'https://www.edx.org/learn/biology', source: 'edX', note: '遗传学基础' },
    ],
    books: [
      { title: '医学遗传学', author: '左伋', why: '遗传咨询的人卫教材' },
{ title: '基因组：人种自传23章', author: 'Matt Ridley', why: '理解基因检测与遗传解读的科普经典' }],
  },
  '视光师': {
    books: [
      { title: '眼科学', author: '杨培增', why: '眼科的人卫标准教材' },
      { title: '薄世宁医学通识讲义', author: '薄世宁', why: '临床认知的通识底座' }
    ],
    videos: [
      { title: '眼科学（首都医科大学）', url: 'https://www.bilibili.com/video/BV1ja411q71Y', source: 'Bilibili', note: '眼科系统课' }
    ],
    docs: [
      { title: 'reddit · r/optometry', url: 'https://www.reddit.com/r/optometry/', source: '行业社区', note: '视光与眼科全球社区', kind: 'community' },

      { title: '世界卫生组织视力', url: 'https://www.who.int/health-topics/vision', source: 'WHO', note: '全球视光与近视防控参考' }
    ],
  },
  '心理治疗师（线上）': {
    videos: [
      { title: '从0开始，心理咨询全流程基础技术系统课', url: 'https://www.bilibili.com/video/BV1Ck4y1e71M', source: 'Bilibili', note: '咨询设置与基本技术' }
    ],
    docs: [
      { title: 'reddit · r/psychology', url: 'https://www.reddit.com/r/psychology/', source: '行业社区', note: '心理学讨论社区', kind: 'community' },

      { title: '世界卫生组织心理健康', url: 'https://www.who.int/health-topics/mental-health', source: 'WHO', note: '远程心理服务参考' }
    ],
    books: [
      { title: '登天的感觉', author: '岳晓东', why: '心理咨询案例的通俗入门' },
{ title: '心理咨询与治疗的理论及实践', author: 'Gerald Corey', why: '主流治疗流派的系统教材' }],
  },
  'AI药物发现研究员': {
    videos: [
      { title: '药物研发行业与专业路径', url: 'https://www.bilibili.com/video/BV1mo4y1Q7JP', source: 'Bilibili', note: 'AI制药的行业背景' },
    ],
    docs: [
      { title: 'reddit · r/bioinformatics', url: 'https://www.reddit.com/r/bioinformatics/', source: '行业社区', note: 'AI制药交叉社区', kind: 'community' },

      { title: 'arXiv 预印本库', url: 'https://arxiv.org/', source: 'arXiv', note: 'AI 制药与分子生成论文' },
      { title: 'edX 生物学课程合集', url: 'https://www.edx.org/learn/biology', source: 'edX', note: '药物化学与分子生物学基础' },
    ],
    books: [
      { title: '基因传', author: '悉达多·穆克吉', why: '基因组学与药物靶点的叙事' },
{ title: '药物化学', author: 'Graham L. Patrick', why: '分子设计与成药性基础' }],
  },
  '医疗器械法规专员': {
    books: [
      { title: '影响力', author: '罗伯特·西奥迪尼', why: '器械销售与客户沟通的方法论' },
      { title: '薄世宁医学通识讲义', author: '薄世宁', why: '理解临床需求场景的通识底座' },
    ],
    videos: [
      { title: '医疗器械产品注册思路及流程', url: 'https://www.bilibili.com/video/BV13C4y1H7Qa', source: 'Bilibili', note: '器械注册实务' },
    ],
    docs: [
      { title: 'reddit · r/biotech', url: 'https://www.reddit.com/r/biotech/', source: '行业社区', note: '生物科技行业社区', kind: 'community' },

      { title: '国家药品监督管理局', url: 'https://www.nmpa.gov.cn/', source: 'NMPA', note: '医疗器械注册与法规来源' },
      { title: 'FDA 医疗器械', url: 'https://www.fda.gov/medical-devices', source: 'FDA', note: '器械上市与合规路径参考' },
    ],
  },
  '运动康复师': {
    videos: [
      { title: '《物理治疗学》+《作业治疗学》知识点精讲', url: 'https://www.bilibili.com/video/BV1yy4y1Z7mX', source: 'Bilibili', note: '康复治疗核心课程' },
    ],
    docs: [
      { title: '医脉通', url: 'https://www.medlive.cn/', source: '行业社区', note: '指南与病例资源', kind: 'community' },

      { title: 'edX 运动科学课程合集', url: 'https://www.edx.org/learn/sports', source: 'edX', note: '运动康复与解剖基础' },
      { title: '美国运动医学会（ACSM）', url: 'https://www.acsm.org/', source: 'ACSM', note: '运动医学与康复标准' },
    ],
    books: [
      { title: '康复医学', author: '黄晓琳', why: '康复医学的人卫标准教材' },
{ title: '运动损伤的预防与康复', author: '多位运动医学学者', why: '康复评估与训练方案参考' }],
  },
  '数字疗法产品经理': {
    books: [
      { title: '未来医疗', author: '埃里克·托普', why: '数字医疗的演进方向' },
      { title: '深度医疗', author: '埃里克·托普', why: 'AI与远程医疗的行业判断' }
    ],
    videos: [
      { title: '90秒看懂互联网医疗', url: 'https://www.bilibili.com/video/BV1D3411B7X8', source: 'Bilibili', note: '互联网医疗模式速览' }
    ],
    docs: [
      { title: 'reddit · r/PublicHealth', url: 'https://www.reddit.com/r/PublicHealth/', source: '行业社区', note: '公共卫生社区', kind: 'community' },

      { title: 'edX 医疗健康课程合集', url: 'https://www.edx.org/learn/healthcare', source: 'edX', note: '临床干预与产品基础' }
    ],
  },

  /* ===== 设计 ===== */
  '纹身师': {
    books: [
      { title: '艺术的故事', author: '贡布里希', why: '身体图像的文化脉络' },
      { title: '写给大家看的设计书', author: '罗宾·威廉姆斯', why: '纹身图案的构图原则' }
    ],
    videos: [
      { title: '纹身教学基础教程', url: 'https://www.bilibili.com/video/BV1nE411x7HG', source: 'Bilibili', note: '纹身机与线条基础' }
    ],
    docs: [
      { title: '设计概论（湖南大学）', url: 'https://higher.smartedu.cn/course/62354d7c9906eace0490c7e1', source: '国家高等教育智慧教育平台', note: '问题驱动与创意驱动的设计思维' },

      { title: 'reddit · r/tattoos', url: 'https://www.reddit.com/r/tattoos/', source: '行业社区', note: '纹身全球社区', kind: 'community' }
    ],
  },
  '银发产品设计师': {
    videos: [
      { title: 'SketchUp 草图大师零基础到精通', url: 'https://www.bilibili.com/video/BV1PecqeuEnC', source: 'Bilibili', note: '产品与空间快速建模' }
    ],
    docs: [
      { title: '普象网（工业设计社区）', url: 'https://www.puxiang.com/', source: '行业社区', note: '国内产品设计师社区', kind: 'community' },

      { title: '世界卫生组织老龄化', url: 'https://www.who.int/health-topics/ageing', source: 'WHO', note: '老龄用户需求参考' }
    ],
    books: [
      { title: '设计心理学', author: '唐纳德·诺曼', why: '可用性与用户心智的设计经典' },
{ title: '通用设计：包容性设计指南', author: '多位设计学者', why: '适老与包容设计的原则参考' }],
  },
  '无障碍设计专家': {
    books: [
      { title: '点石成金', author: '史蒂夫·克鲁克', why: '可访问的可用性常识' },
      { title: '设计的法则', author: '威廉·立德威尔', why: '通用设计的原理手册' },
    ],
    videos: [
      { title: '无障碍设计：给世界多点包容和温暖', url: 'https://www.bilibili.com/video/BV1tg41137EL', source: 'Bilibili', note: '无障碍设计项目思路' },
    ],
    docs: [
      { title: 'reddit · r/web_design', url: 'https://www.reddit.com/r/web_design/', source: '行业社区', note: '网页设计社区', kind: 'community' },

      { title: 'W3C 无障碍指南（WCAG）', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/', source: 'W3C', note: '无障碍设计的国际标准' },
      { title: 'MDN 无障碍文档', url: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility', source: 'MDN', note: 'Web 无障碍实现指南' },
    ],
  },
  '服务设计师': {
    videos: [
      { title: '交互设计零基础入门教程', url: 'https://www.bilibili.com/video/BV1W64y1B77L', source: 'Bilibili', note: '交互理念与实训' },
    ],
    docs: [
      { title: 'UI中国', url: 'https://www.ui.cn/', source: '行业社区', note: '国内 UI/UX 作品社区', kind: 'community' },

      { title: 'Interaction Design Foundation', url: 'https://www.interaction-design.org/', source: 'IxDF', note: '服务设计与 UX 方法论' },
      { title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '设计思维与调研基础' },
    ],
    books: [
      { title: 'About Face 4：交互设计精髓', author: '艾伦·库珀', why: '交互设计目标导向方法论的权威' },
{ title: '这就是服务设计思考', author: 'Marc Stickdorn 等', why: '服务设计方法与工具的系统读本' }],
  },
  '内容设计师': {
    books: [
      { title: '写给大家看的设计书', author: '罗宾·威廉姆斯', why: '亲密对齐重复对比四大原则的入门经典' },
      { title: 'About Face 4：交互设计精髓', author: '艾伦·库珀', why: '交互与界面设计的体系教材' },
    ],
    videos: [
      { title: 'UI设计从零基础入门到精通', url: 'https://www.bilibili.com/video/BV1KT4y1E7tV', source: 'Bilibili', note: 'UI 全流程课程' },
    ],
    docs: [
      { title: 'reddit · r/Design', url: 'https://www.reddit.com/r/Design/', source: '行业社区', note: '综合设计讨论社区', kind: 'community' },

      { title: 'Google 技术写作课程', url: 'https://developers.google.com/tech-writing', source: 'Google', note: '清晰写作与信息架构' },
      { title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/', source: 'NN/g', note: '内容设计与 UX 写作研究' },
    ],
  },
  '提示词视觉设计师': {
    books: [
      { title: '艺术·设计的色彩构成', author: '朝仓直巳', why: '数字色彩体系的基础教材' },
      { title: '艺术·设计的平面构成', author: '朝仓直巳', why: '数字图形构成的基础教材' },
    ],
    videos: [
      { title: 'GA词条：数字艺术 Digital Art', url: 'https://www.bilibili.com/video/BV16q4y1r71L', source: 'Bilibili', note: '数字艺术概念与谱系' },
    ],
    docs: [
      { title: 'UI中国', url: 'https://www.ui.cn/', source: '行业社区', note: '国内 UI 设计社区', kind: 'community' },

      { title: 'Hugging Face 扩散模型课程', url: 'https://huggingface.co/learn/diffusion-course/unit0/1', source: 'Hugging Face', note: '生成式视觉模型原理与提示技巧' },
      { title: 'edX 设计课程合集', url: 'https://www.edx.org/learn/design', source: 'edX', note: '视觉设计基础' },
    ],
  },
  '智能座舱交互设计师': {
    videos: [
      { title: 'HMI基础系统课程（最新案例全覆盖）', url: 'https://www.bilibili.com/video/BV1UMGnzDEDG', source: 'Bilibili', note: '车载 HMI 入门系统课' },
    ],
    docs: [
      { title: 'reddit · r/blender', url: 'https://www.reddit.com/r/blender/', source: '行业社区', note: 'Blender 社区', kind: 'community' },

      { title: 'Google UX 设计专业证书', url: 'https://www.coursera.org/professional-certificates/google-ux-design', source: 'Coursera', note: 'UX 全流程，可迁移到座舱交互' },
      { title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/', source: 'NN/g', note: '人机交互与安全相关研究' },
    ],
    books: [
      { title: '设计心理学', author: '唐纳德·诺曼', why: '驾驶场景的可用性原则' },
{ title: 'About Face 4：交互设计精髓', author: 'Alan Cooper 等', why: '复杂人机系统的交互设计经典' }],
  },
  '空间/展览设计师': {
    books: [
      { title: '室内设计资料集', author: '张绮曼', why: '室内设计的工具书级资料集' },
      { title: '设计中的设计', author: '原研哉', why: '设计思维与日常美学' }
    ],
    videos: [
      { title: '室内设计全套教程（全168集）', url: 'https://www.bilibili.com/video/BV1xgz1Y3EHZ', source: 'Bilibili', note: '室内设计长线课程' }
    ],
    docs: [
      { title: '设计概论', url: 'https://www.icourse163.org/course/-1003632007', source: '中国大学MOOC', note: '产品设计、环境设计全景导论' },

      { title: '谷德设计网', url: 'https://www.gooood.cn/', source: '行业社区', note: '建筑与室内一线项目案例库', kind: 'community' }
    ],
  },
  '用户研究员': {
    videos: [
      { title: '前腾讯用户研究专家手把手教你做用户研究', url: 'https://www.bilibili.com/video/BV1gh41187VM', source: 'Bilibili', note: '用研方法与实战' }
    ],
    docs: [
      { title: 'reddit · r/UXResearch', url: 'https://www.reddit.com/r/UXResearch/', source: '行业社区', note: '用户研究全球社区', kind: 'community' },

      { title: 'Nielsen Norman Group', url: 'https://www.nngroup.com/articles/', source: 'NN/g', note: '用户研究方法与案例' }
    ],
    books: [
      { title: '用户体验要素', author: '杰西·詹姆斯·加瑞特', why: '体验分层模型的原点书' },
{ title: '洞察用户体验：用户研究方法与设计实践', author: 'Mike Kuniavsky 等', why: '用研方法与工具的系统手册' }],
  },

  /* ===== 教育 ===== */
  '驾校教练': {
    books: [
      { title: '运动训练学', author: '田麦久', why: '训练学的标准教材' },
      { title: '运动改造大脑', author: '约翰·瑞迪', why: '运动科学的科普经典' }
    ],
    videos: [
      { title: '800米/1000米攻略（体育硕士划重点）', url: 'https://www.bilibili.com/video/BV1CA41187FQ', source: 'Bilibili', note: '体能训练方法课' }
    ],
    docs: [
      { title: 'reddit · r/languagelearning', url: 'https://www.reddit.com/r/languagelearning/', source: '行业社区', note: '语言学习社区', kind: 'community' },

      { title: '公安部交通管理局', url: 'https://www.mps.gov.cn/', source: '公安部', note: '驾驶培训与考试规范来源' }
    ],
  },
  '知识付费产品经理': {
    videos: [
      { title: '产品经理案例分析：全面剖析在线教育行业', url: 'https://www.bilibili.com/video/BV1fb411x7Sq', source: 'Bilibili', note: '在线教育产品案例课' }
    ],
    docs: [
      { title: 'reddit · r/elearning', url: 'https://www.reddit.com/r/elearning/', source: '行业社区', note: '在线教育全球社区', kind: 'community' },

      { title: 'Coursera 课程设计指南', url: 'https://www.coursera.org/learn/instructional-design', source: 'Coursera', note: '在线课程设计与交付' }
    ],
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
{ title: '刻意练习', author: 'Anders Ericsson、Robert Pool', why: '设计「让人真正学会」的课程内容' }],
  },
  'AI家教系统设计': {
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
      { title: '精益创业', author: '埃里克·莱斯', why: '教育产品验证的方法论' },
    ],
    videos: [
      { title: '知识付费全链路拆解', url: 'https://www.bilibili.com/video/BV1sZBuYzEQw', source: 'Bilibili', note: '知识付费商业模式' },
    ],
    docs: [
      { title: 'reddit · r/elearning', url: 'https://www.reddit.com/r/elearning/', source: '行业社区', note: '在线教育全球社区', kind: 'community' },

      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '教学法与自适应学习基础' },
      { title: 'Hugging Face 大模型课程', url: 'https://huggingface.co/learn/llm-course/chapter1/1', source: 'Hugging Face', note: '用 LLM 构建陪练与反馈' },
    ],
  },
  '数字素养讲师': {
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
      { title: '精益创业', author: '埃里克·莱斯', why: '教育产品验证的方法论' }
    ],
    videos: [
      { title: '知识付费全链路拆解', url: 'https://www.bilibili.com/video/BV1sZBuYzEQw', source: 'Bilibili', note: '知识付费商业模式' }
    ],
    docs: [
      { title: 'reddit · r/elearning', url: 'https://www.reddit.com/r/elearning/', source: '行业社区', note: '在线教育全球社区', kind: 'community' },

      { title: '联合国教科文组织', url: 'https://www.unesco.org/', source: 'UNESCO', note: '数字素养与媒介素养框架' }
    ],
  },
  '心理测评研究员': {
    videos: [
      { title: '心理测量学', url: 'https://www.bilibili.com/video/BV1En7BzNEek', source: 'Bilibili', note: '心理测评理论课' }
    ],
    docs: [
      { title: 'reddit · r/AcademicPsychology', url: 'https://www.reddit.com/r/AcademicPsychology/', source: '行业社区', note: '心理学学术社区', kind: 'community' },

      { title: '美国心理学会（APA）', url: 'https://www.apa.org/', source: 'APA', note: '测评伦理与标准' }
    ],
    books: [
      { title: '思考，快与慢', author: '丹尼尔·卡尼曼', why: '测量背后认知科学的根基' },
{ title: '心理与教育测量', author: 'Robert M. Kaplan、Dennis P. Saccuzzo', why: '心理测量学的系统教材' }],
  },
  '学习设计师': {
    books: [
      { title: '翻转课堂的可汗学院', author: '萨尔曼·可汗', why: '在线教育的模式经典' },
      { title: '精益创业', author: '埃里克·莱斯', why: '教育产品验证的方法论' },
    ],
    videos: [
      { title: '30万粉知识付费变现近1000万', url: 'https://www.bilibili.com/video/BV1mFwjz5E6E', source: 'Bilibili', note: '知识IP变现案例' },
    ],
    docs: [
      { title: '芥末堆（教育行业媒体）', url: 'https://www.jiemodui.com/', source: '行业社区', note: '教育产业资讯与行业社区', kind: 'community' },

      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '教学设计（ISD）基础' },
      { title: 'Coursera 教学设计', url: 'https://www.coursera.org/learn/instructional-design', source: 'Coursera', note: '学习路径与评估设计' },
    ],
  },
  'AI教练/学习陪练': {
    books: [
      { title: '刻意练习', author: '安德斯·艾利克森', why: '教练式训练的科学根基' },
      { title: '学习之道', author: '乔希·维茨金', why: '学习方法的经典自述' },
    ],
    videos: [
      { title: '如何炼成超强学习能力', url: 'https://www.bilibili.com/video/BV16T4y1k7dB', source: 'Bilibili', note: '学习方法底层规律' },
    ],
    docs: [
      { title: 'reddit · r/getdisciplined', url: 'https://www.reddit.com/r/getdisciplined/', source: '行业社区', note: '学习方法与自律社区', kind: 'community' },

      { title: 'Hugging Face 大模型课程', url: 'https://huggingface.co/learn/llm-course/chapter1/1', source: 'Hugging Face', note: '用模型做个性化陪练' },
      { title: 'edX 教育学课程合集', url: 'https://www.edx.org/learn/education', source: 'edX', note: '反馈与教学法基础' },
    ],
  },
  '求职陪跑教练': {
    videos: [
      { title: '如何炼成超强学习能力', url: 'https://www.bilibili.com/video/BV16T4y1k7dB', source: 'Bilibili', note: '学习方法底层规律' }
    ],
    docs: [
      { title: 'reddit · r/getdisciplined', url: 'https://www.reddit.com/r/getdisciplined/', source: '行业社区', note: '学习方法与自律社区', kind: 'community' },

      { title: 'O*NET 职业信息网', url: 'https://www.onetonline.org/', source: 'O*NET', note: '岗位能力要求与职业信息' }
    ],
    books: [
      { title: '刻意练习', author: '安德斯·艾利克森', why: '教练式训练的科学根基' },
{ title: '你的降落伞是什么颜色？', author: 'Richard N. Bolles', why: '求职方法论与陪跑框架' }],
  },
  'AI职业转型顾问': {
    books: [
      { title: '刻意练习', author: '安德斯·艾利克森', why: '教练式训练的科学根基' },
      { title: '学习之道', author: '乔希·维茨金', why: '学习方法的经典自述' },
    ],
    videos: [
      { title: '如何炼成超强学习能力', url: 'https://www.bilibili.com/video/BV16T4y1k7dB', source: 'Bilibili', note: '学习方法底层规律' },
    ],
    docs: [
      { title: 'reddit · r/careerguidance', url: 'https://www.reddit.com/r/careerguidance/', source: '行业社区', note: '职业规划全球社区', kind: 'community' },

      { title: 'O*NET 职业信息网', url: 'https://www.onetonline.org/', source: 'O*NET', note: '职业迁移与技能映射参考' },
      { title: '世界经济论坛未来就业报告', url: 'https://www.weforum.org/publications/', source: 'WEF', note: 'AI 对岗位结构影响的权威报告' },
    ],
  },
  '亲子沟通教练': {
    videos: [
      { title: 'BBC儿童哲学思维训练：什么决定我是我', url: 'https://www.bilibili.com/video/BV1uR4y1T7CU', source: 'Bilibili', note: '儿童哲学启蒙素材' },
    ],
    docs: [
      { title: 'reddit · r/homeschool', url: 'https://www.reddit.com/r/homeschool/', source: '行业社区', note: '家庭教学社区', kind: 'community' },

      { title: 'edX 心理学课程合集', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '发展心理与沟通基础' },
      { title: '联合国儿童基金会', url: 'https://www.unicef.org/', source: 'UNICEF', note: '儿童发展与养育参考' },
    ],
    books: [
      { title: '非暴力沟通', author: '马歇尔·卢森堡', why: '亲子与家庭沟通的经典' },
{ title: '如何说孩子才会听，怎么听孩子才肯说', author: 'Adele Faber、Elaine Mazlish', why: '亲子沟通方法论的经典' }],
  },
  '特殊教育辅助师': {
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '个别化教育的经典指南' },
      { title: '正面管教', author: '简·尼尔森', why: '行为支持与正向引导的方法' }
    ],
    videos: [
      { title: '自闭症儿童语言沟通康复干预实操', url: 'https://www.bilibili.com/video/BV1Ha4y1x7nZ', source: 'Bilibili', note: '特教康复实操课' }
    ],
    docs: [
      { title: 'reddit · r/SpecialEducation', url: 'https://www.reddit.com/r/SpecialEducation/', source: '行业社区', note: '特殊教育全球社区', kind: 'community' },

      { title: '联合国教科文组织', url: 'https://www.unesco.org/', source: 'UNESCO', note: '融合教育与特殊需求框架' }
    ],
  },
  '研学课程设计师': {
    books: [
      { title: '追求理解的教学设计', author: '格兰特·威金斯', why: 'UbD 逆向设计的经典' },
      { title: '林间最后的小孩', author: '理查德·洛夫', why: '自然教育的奠基之作' }
    ],
    videos: [
      { title: '一个视频看懂 PBL 项目式学习', url: 'https://www.bilibili.com/video/BV1Sa411a7pg', source: 'Bilibili', note: 'PBL 方法论入门' }
    ],
    docs: [
      { title: 'reddit · r/museums', url: 'https://www.reddit.com/r/museums/', source: '行业社区', note: '博物馆教育社区', kind: 'community' },

      { title: '联合国教科文组织', url: 'https://www.unesco.org/', source: 'UNESCO', note: '研学与校外教育参考' }
    ],
  },

  /* ===== 金融 ===== */
  '链上数据分析师': {
    books: [
      { title: '精通比特币', author: '安德烈亚斯·安东诺普洛斯', why: '区块链与链上数据的技术原理' },
      { title: '货币未来：从金本位到区块链', author: '赛费迪安·阿米斯', why: '数字资产的货币学框架' },
    ],
    videos: [
      { title: '数字资产与区块链基础概念', url: 'https://www.bilibili.com/video/BV14t411176s', source: 'Bilibili', note: '链上资产入门课' },
    ],
    docs: [
      { title: 'reddit · r/CryptoCurrency', url: 'https://www.reddit.com/r/CryptoCurrency/', source: '行业社区', note: '加密资产讨论社区', kind: 'community' },


      { title: 'Dune 文档', url: 'https://docs.dune.com/', source: 'Dune', note: '链上数据查询与分析平台' },
      { title: '以太坊开发者文档', url: 'https://ethereum.org/en/developers/docs/', source: 'ethereum.org', note: '链上数据模型基础' },
    ],
  },
  '央行数字货币研究员': {
    books: [
      { title: '精通比特币', author: '安德烈亚斯·安东诺普洛斯', why: '区块链与链上数据的技术原理' },
      { title: '货币未来：从金本位到区块链', author: '赛费迪安·阿米斯', why: '数字资产的货币学框架' }
    ],
    videos: [
      { title: '数字资产与区块链基础概念', url: 'https://www.bilibili.com/video/BV14t411176s', source: 'Bilibili', note: '链上资产入门课' }
    ],
    docs: [
      { title: 'reddit · r/CryptoCurrency', url: 'https://www.reddit.com/r/CryptoCurrency/', source: '行业社区', note: '加密资产讨论社区', kind: 'community' },

      { title: '国际清算银行（BIS）', url: 'https://www.bis.org/', source: 'BIS', note: 'CBDC 国际研究与报告' }
    ],
  },
  '跨境支付合规师': {
    books: [
      { title: '支付战争', author: '埃里克·杰克逊', why: 'PayPal 早期支付创业实录' },
      { title: '银行4.0', author: '布雷特·金', why: '支付与银行服务的数字化演进' },
    ],
    videos: [
      { title: '尚硅谷：微信支付&支付宝支付开发', url: 'https://www.bilibili.com/video/BV1US4y1D77m', source: 'Bilibili', note: '支付系统技术实现' },
    ],
    docs: [
      { title: '智通财经', url: 'https://www.zhitongcaijing.com/', source: '行业社区', note: '港股与全球市场资讯', kind: 'community' },

      { title: '东方财富股吧', url: 'https://guba.eastmoney.com/', source: '行业社区', note: '个股与市场讨论', kind: 'community' },

      { title: '国家外汇管理局', url: 'https://www.safe.gov.cn/', source: '外汇局', note: '跨境资金流动与合规政策' },
      { title: '金融行动特别工作组（FATF）', url: 'https://www.fatf-gafi.org/', source: 'FATF', note: '反洗钱与跨境合规国际标准' },
    ],
  },
  '数字资产管理师': {
    books: [
      { title: '精通比特币', author: '安德烈亚斯·安东诺普洛斯', why: '区块链与链上数据的技术原理' },
      { title: '货币未来：从金本位到区块链', author: '赛费迪安·阿米斯', why: '数字资产的货币学框架' }
    ],
    videos: [
      { title: '数字资产与区块链基础概念', url: 'https://www.bilibili.com/video/BV14t411176s', source: 'Bilibili', note: '链上资产入门课' }
    ],
    docs: [
      { title: 'reddit · r/CryptoCurrency', url: 'https://www.reddit.com/r/CryptoCurrency/', source: '行业社区', note: '加密资产讨论社区', kind: 'community' },


      { title: '金融行动特别工作组（FATF）', url: 'https://www.fatf-gafi.org/', source: 'FATF', note: '虚拟资产监管建议' }
    ],
  },
  '养老金融规划师': {
    videos: [
      { title: 'CFP理财规划师：理财规划原理', url: 'https://www.bilibili.com/video/BV1pb4y1L7cj', source: 'Bilibili', note: '理财规划职业标准' }
    ],
    docs: [
      { title: 'reddit · r/FinancialPlanning', url: 'https://www.reddit.com/r/FinancialPlanning/', source: '行业社区', note: '个人财务规划讨论', kind: 'community' },


      { title: '人力资源和社会保障部', url: 'https://www.mohrss.gov.cn/', source: '人社部', note: '养老保险与个人养老金政策' }
    ],
    books: [
      { title: '漫步华尔街', author: '马尔基尔', why: '生命周期资产配置的理性框架' },
{ title: '养老金投资与理财', author: '多位养老金融学者', why: '退休现金流规划的方法参考' }],
  },
  '家庭资产配置顾问': {
    videos: [
      { title: 'CFP理财规划师：理财规划原理', url: 'https://www.bilibili.com/video/BV1pb4y1L7cj', source: 'Bilibili', note: '理财规划职业标准' }
    ],
    docs: [
      { title: 'reddit · r/FinancialPlanning', url: 'https://www.reddit.com/r/FinancialPlanning/', source: '行业社区', note: '个人财务规划讨论', kind: 'community' },

      { title: 'CFA 协会', url: 'https://www.cfainstitute.org/en/programs/cfa-program', source: 'CFA Institute', note: '资产配置与投资管理知识体系' }
    ],
    books: [
      { title: '聪明的投资者', author: '格雷厄姆', why: '客户资产配置的价值根基' },
{ title: '漫步华尔街', author: 'Burton G. Malkiel', why: '资产配置与长期投资的经典入门' }],
  },
  '消费金融风控师': {
    books: [
      { title: '手把手教你读财报', author: '唐朝', why: '从财报识别借款主体真实成色' },
      { title: '商业银行管理', author: '彼得·罗斯', why: '银行信贷与资产负债管理教材' }
    ],
    videos: [
      { title: '半佛：如何科学理解征信', url: 'https://www.bilibili.com/video/BV1kh411n7b9', source: 'Bilibili', note: '征信体系科普' }
    ],
    docs: [
      { title: 'reddit · r/CRedit', url: 'https://www.reddit.com/r/CRedit/', source: '行业社区', note: '个人信用专门社区', kind: 'community' },

      { title: 'scikit-learn 用户指南', url: 'https://scikit-learn.org/stable/user_guide.html', source: 'scikit-learn', note: '风控建模与评分卡基础' }
    ],
  },
  '碳交易员': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳经济的技术与商业全景' },
      { title: '置身事内', author: '兰小欢', why: '理解中国政策驱动型碳市场' },
    ],
    videos: [
      { title: '保姆级教学：从零开始学双碳', url: 'https://www.bilibili.com/video/BV1aP41167ne', source: 'Bilibili', note: '双碳体系入门' },
    ],
    docs: [
      { title: '第一财经', url: 'https://www.yicai.com/', source: '行业社区', note: '双碳与绿色金融资讯', kind: 'community' },

      { title: '第一财经', url: 'https://www.yicai.com/', source: '行业社区', note: '双碳与绿色金融资讯', kind: 'community' },

      { title: '全国碳排放权交易市场', url: 'https://www.cneeex.com/', source: '上海环境能源交易所', note: '碳配额交易规则与行情' },
      { title: 'GHG Protocol', url: 'https://ghgprotocol.org/', source: 'GHG Protocol', note: '碳核算与交易计量基础' },
    ],
  },

  /* ===== 法律 ===== */
  '数据合规官': {
    videos: [
      { title: '数据合规全实务应用手册', url: 'https://www.bilibili.com/video/BV1fT411J7yv', source: 'Bilibili', note: '体系搭建、文书拟定、数据跨境全流程' },
    ],
    docs: [
      { title: '中国人大网 法律法规数据库', url: 'https://flk.npc.gov.cn', source: '全国人大', note: '数据安全法、个人信息保护法条文' },
      { title: '中国网信办', url: 'https://www.cac.gov.cn/', source: '国家网信办', note: '数据出境与合规政策来源' },
      { title: 'reddit · r/privacy', url: 'https://www.reddit.com/r/privacy/', source: '行业社区', note: '隐私与数据保护讨论社区', kind: 'community' },
    ],
    books: [
      { title: '个人信息保护法理解与适用', author: '程啸', why: '数据合规核心法条的权威释义' },
      { title: '监控资本主义时代', author: '肖莎娜·祖博夫', why: '理解数据经济的深层逻辑' },
    ],
  },
  '算法合规顾问': {
    videos: [
      { title: '不被算法裹挟的自由', url: 'https://www.bilibili.com/video/BV1thp76sE54', source: 'Bilibili', note: '算法治理与用户权利科普' }
    ],
    docs: [

      { title: '中国人大网 法律法规数据库', url: 'https://flk.npc.gov.cn', source: '全国人大', note: '算法与自动化决策相关法规' },
      { title: 'reddit · r/PrivacyGuides', url: 'https://www.reddit.com/r/PrivacyGuides/', source: '行业社区', note: '隐私技术与合规实践社区', kind: 'community' }
    ],
    books: [
      { title: '算法霸权：数学杀伤性武器的威胁', author: '凯西·奥尼尔', why: '算法伦理与监管的经典批判' },
      { title: '黑箱社会：控制金钱和信息的数据法则', author: '弗兰克·帕斯奎尔', why: '算法透明度问题的源头著作' }
    ],
  },
  '出海法务': {
    videos: [
      { title: '中企出海内部合规调查（华政律商特训班）', url: 'https://www.bilibili.com/video/BV154421Q7U1', source: 'Bilibili', note: '出海合规实务课' },
    ],
    docs: [
      { title: '中国人大网 法律法规数据库', url: 'https://flk.npc.gov.cn', source: '全国人大', note: '国内涉外法规基础' },
      { title: '商务部', url: 'https://www.mofcom.gov.cn/', source: '商务部', note: '对外投资与贸易政策来源' },
      { title: 'reddit · r/lawyers', url: 'https://www.reddit.com/r/lawyers/', source: '行业社区', note: '执业律师专业社区', kind: 'community' },
    ],
    books: [
      { title: '世界是平的', author: '托马斯·弗里德曼', why: '全球化商业语境的经典叙述' },
      { title: '贸易的冲突：美国贸易政策200年', author: '道格拉斯·欧文', why: '理解涉外贸易规则的深层逻辑' },
    ],
  },
  '知识产权运营师': {
    videos: [
      { title: '知识产权法（西南政法大学）', url: 'https://www.bilibili.com/video/BV1Af4y137A3', source: 'Bilibili', note: '国家精品课全程录像' },
    ],
    docs: [
      { title: '国家知识产权局', url: 'https://www.cnipa.gov.cn/', source: '国知局', note: '专利商标政策与数据库' },
      { title: '世界知识产权组织（WIPO）', url: 'https://www.wipo.int/', source: 'WIPO', note: '知识产权国际运营与许可' },
      { title: 'reddit · r/Patents', url: 'https://www.reddit.com/r/Patents/', source: '行业社区', note: '专利与知识产权讨论社区', kind: 'community' },
    ],
    books: [
      { title: '知识产权法', author: '王迁', why: '国内知识产权法权威教材' },
      { title: '知识产权法的经济结构', author: '威廉·兰德斯、理查德·波斯纳', why: '知产运营的经济分析经典' },
    ],
  },

  /* ===== 管理 ===== */
  '一人公司运营者': {
    videos: [
      { title: '自由职业真相：不上班到底应该怎么活', url: 'https://www.bilibili.com/video/BV1NGunzMEWK', source: 'Bilibili', note: '自由职业全景' },
    ],
    docs: [
      { title: 'reddit · r/startups', url: 'https://www.reddit.com/r/startups/', source: '行业社区', note: '初创公司社区', kind: 'community' },

      { title: '国家税务总局', url: 'https://www.chinatax.gov.cn/', source: '税务总局', note: '个体工商户与小微企业税务' },
      { title: 'roadmap.sh', url: 'https://roadmap.sh/', source: 'roadmap.sh', note: '用工具与自动化替代团队职能' },
    ],
    books: [
      { title: '精益创业', author: '埃里克·莱斯', why: '创业方法论' },
{ title: '小而美：持续盈利的经营法则', author: 'Paul Jarvis', why: '一人公司可持续经营的底层逻辑' }],
  },
  'ESG顾问': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳经济的框架之作' },
      { title: '蓝色经济', author: '冈特·鲍利', why: '可持续商业的经典' },
    ],
    videos: [
      { title: '10分钟快速入门ESG', url: 'https://www.bilibili.com/video/BV18Ck3YaE6H', source: 'Bilibili', note: 'ESG入门课' },
    ],
    docs: [
      { title: 'reddit · r/sustainability', url: 'https://www.reddit.com/r/sustainability/', source: '行业社区', note: 'ESG与可持续社区', kind: 'community' },

      { title: '可持续会计准则委员会（SASB）', url: 'https://sasb.ifrs.org/', source: 'SASB', note: '行业 ESG 披露标准' },
      { title: '全球报告倡议组织（GRI）', url: 'https://www.globalreporting.org/', source: 'GRI', note: '可持续发展报告标准' },
    ],
  },
  '双碳管理咨询师': {
    books: [
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '碳中和的技术路线图' },
      { title: '蓝色经济', author: '冈特·鲍利', why: '可持续商业模式' },
    ],
    videos: [
      { title: '中国为什么一定要走碳中和之路', url: 'https://www.bilibili.com/video/BV1GY4y1N7Gu', source: 'Bilibili', note: '碳中和战略认知' },
    ],
    docs: [
      { title: 'reddit · r/climatechange', url: 'https://www.reddit.com/r/climatechange/', source: '行业社区', note: '气候行动社区', kind: 'community' },

      { title: 'GHG Protocol', url: 'https://ghgprotocol.org/', source: 'GHG Protocol', note: '企业碳核算与目标设定标准' },
      { title: '国际能源署', url: 'https://www.iea.org/', source: 'IEA', note: '减排路径与政策报告' },
    ],
  },
  '数据伦理官': {
    books: [
      { title: '算法霸权', author: '凯西·奥尼尔', why: '算法伦理的经典' },
      { title: '人工智能简史', author: '尼克', why: 'AI伦理的技术背景' },
    ],
    videos: [
      { title: '《中华人民共和国个人信息保护法》解读', url: 'https://www.bilibili.com/video/BV1ZH4y1D7bb', source: 'Bilibili', note: '数据合规系统课' },
    ],
    docs: [
      { title: 'reddit · r/datascience', url: 'https://www.reddit.com/r/datascience/', source: '行业社区', note: '数据科学社区', kind: 'community' },

      { title: '联合国教科文组织 AI 伦理', url: 'https://www.unesco.org/en/artificial-intelligence', source: 'UNESCO', note: 'AI 伦理建议书与框架' },
      { title: '中国网信办', url: 'https://www.cac.gov.cn/', source: '国家网信办', note: '数据与算法伦理政策来源' },
    ],
  },
  'AI产品伦理审查员': {
    books: [
      { title: '算法霸权', author: '凯西·奥尼尔', why: '算法公平的经典' },
      { title: '人工智能简史', author: '尼克', why: 'AI伦理的技术脉络' },
    ],
    videos: [
      { title: '买卖个人信息最高判7年：《个人信息保护法》施行', url: 'https://www.bilibili.com/video/BV1qv411T7GR', source: 'Bilibili', note: '数据合规认知' },
    ],
    docs: [
      { title: 'reddit · r/artificial', url: 'https://www.reddit.com/r/artificial/', source: '行业社区', note: 'AI伦理讨论社区', kind: 'community' },

      { title: '联合国教科文组织 AI 伦理', url: 'https://www.unesco.org/en/artificial-intelligence', source: 'UNESCO', note: 'AI 伦理影响评估框架' },
      { title: 'OWASP LLM 应用十大风险', url: 'https://owasp.org/www-project-top-10-for-large-language-model-applications/', source: 'OWASP', note: 'AI 产品风险清单' },
    ],
  },
  '可持续供应链经理': {
    books: [
      { title: '从摇篮到摇篮', author: '威廉·麦克唐纳', why: '循环经济的经典' },
      { title: '气候经济与人类未来', author: '比尔·盖茨', why: '零碳转型的框架' },
    ],
    videos: [
      { title: '《供应链管理》第一讲：供应链管理导论', url: 'https://www.bilibili.com/video/BV1sd4y137Gs', source: 'Bilibili', note: '供应链框架课' },
    ],
    docs: [
      { title: 'reddit · r/sustainability', url: 'https://www.reddit.com/r/sustainability/', source: '行业社区', note: '可持续发展社区', kind: 'community' },

      { title: '全球报告倡议组织（GRI）', url: 'https://www.globalreporting.org/', source: 'GRI', note: '供应链可持续披露标准' },
      { title: 'edX 供应链课程合集', url: 'https://www.edx.org/learn/supply-chain-management', source: 'edX', note: '供应链管理与风险基础' },
    ],
  },

  /* ===== 传媒 ===== */
  // 2026-10-12 原 10 个传媒职业（个人IP运营 / AI内容审校师 / 短视频编导 / 音频节目编导 / 短剧编剧 /
  // NFT数字藏品策展 / 游戏本地化专家 / 内容风控审核师 / 实时虚拟拍摄师 / 短剧制片人）此前只有
  // "edX 传播学课程合集"这类笼统入口，已全部迁到 resources/media.ts 重配 5 份专属资源，此处删除避免覆盖。

  /* ===== 商业销售 ===== */
  '跨境电商独立站运营': {
    videos: [
      { title: 'Shopify独立站从0手把手教程', url: 'https://www.bilibili.com/video/BV13N4y1H75T', source: 'Bilibili', note: '独立站建站运营全流程' },
    ],
    docs: [
      { title: 'reddit · r/shopify', url: 'https://www.reddit.com/r/shopify/', source: '行业社区', note: '独立站卖家全球社区', kind: 'community' },

      { title: 'Shopify 学习中心', url: 'https://www.shopify.com/learn', source: 'Shopify', note: '独立站搭建与运营' },
      { title: 'Google 数字营销课程', url: 'https://skillshop.withgoogle.com/', source: 'Google', note: '投放与增长基础' },
    ],
    books: [
      { title: '长尾理论', author: '克里斯·安德森', why: '独立站选品与流量逻辑' },
{ title: '跨境电商运营实务', author: '多位行业从业者', why: '选品、投放与供应链的实操框架' }],
  },
  'AI出海运营': {
    books: [
      { title: '世界是平的', author: '托马斯·弗里德曼', why: '出海的全球化框架' },
      { title: '别独自用餐', author: '基思·法拉奇', why: '海外人脉拓展' },
    ],
    videos: [
      { title: 'ToB海外销售真相：海外没有人情世故', url: 'https://www.bilibili.com/video/BV1MFaB6zEfB', source: 'Bilibili', note: '海外销售实务' },
    ],
    docs: [
      { title: 'reddit · r/jobs', url: 'https://www.reddit.com/r/jobs/', source: '行业社区', note: '求职社区', kind: 'community' },

      { title: 'Google 数字营销课程', url: 'https://skillshop.withgoogle.com/', source: 'Google', note: '海外增长与投放' },
      { title: 'edX 市场营销课程合集', url: 'https://www.edx.org/learn/marketing', source: 'edX', note: '市场与本地化基础' },
    ],
  },
  'GEO专员': {
    books: [
      { title: '精益数据分析', author: '阿利斯泰尔·克罗尔', why: '搜索流量的量化思维' },
      { title: '增长黑客', author: '范冰', why: '流量增长方法论' },
    ],
    videos: [
      { title: '零基础GEO优化教程：AI搜索排名优化', url: 'https://www.bilibili.com/video/BV15pKU65EDt', source: 'Bilibili', note: 'GEO系统课' },
    ],
    docs: [
      { title: 'reddit · r/SEO', url: 'https://www.reddit.com/r/SEO/', source: '行业社区', note: '搜索优化全球社区', kind: 'community' },

      { title: 'Google 搜索中心', url: 'https://developers.google.com/search', source: 'Google', note: '搜索与内容可见性基础' },
      { title: 'edX 市场营销课程合集', url: 'https://www.edx.org/learn/marketing', source: 'edX', note: '内容营销与可发现性' },
    ],
  },
  'AI直播运营': {
    books: [
      { title: '流量池', author: '杨飞', why: '直播带货的流量方法论' },
      { title: '超级转化率', author: '陈勇', why: '直播转化的实操' },
    ],
    videos: [
      { title: '直播带货怎么做：直播自然流打法教程', url: 'https://www.bilibili.com/video/BV1zo1VBDEcL', source: 'Bilibili', note: '直播带货打法课' },
    ],
    docs: [
      { title: 'reddit · r/socialmedia', url: 'https://www.reddit.com/r/socialmedia/', source: '行业社区', note: '社媒直播讨论社区', kind: 'community' },

      { title: 'edX 市场营销课程合集', url: 'https://www.edx.org/learn/marketing', source: 'edX', note: '直播与投放基础' },
      { title: 'Hugging Face 音频课程', url: 'https://huggingface.co/learn/audio-course/chapter0/introduction', source: 'Hugging Face', note: '数字人语音与直播技术' },
    ],
  },
};
