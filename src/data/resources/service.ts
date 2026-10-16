import type { CareerResourceSet } from '../career-resources';

export const serviceResources: Record<string, CareerResourceSet> = {
  '健身教练': {
    videos: [{ title: 'Nutrition 营养学课程（edX）', url: 'https://www.edx.org/learn/nutrition', source: 'edX', note: '营养基础，配合训练指导使用' }],
    docs: [
      { title: 'reddit · r/personaltraining', url: 'https://www.reddit.com/r/personaltraining/', source: '行业社区', note: '私教全球社区', kind: 'community' },

      { title: 'O*NET 职业档案：Exercise Trainers and Group Fitness Instructors', url: 'https://www.onetonline.org/link/summary/39-9031.00', source: '美国劳工部 O*NET' },
      { title: 'ACSM 教育资源', url: 'https://www.acsm.org/education-resources', source: '美国运动医学学会', note: '运动科学权威机构' },
    ],
    books: [
      { title: '运动训练学', author: '田麦久', why: '训练学的标准教材' },
{ title: 'Starting Strength（力量训练基础）', author: 'Mark Rippetoe', why: '经典力量训练入门著作，讲解基础动作' }],
  },
  '月嫂/育婴师': {
    videos: [{ title: 'Nursing 护理学课程（edX）', url: 'https://www.edx.org/learn/nursing', source: 'edX', note: '护理基础知识' }],
    docs: [
      { title: 'reddit · r/NewParents', url: 'https://www.reddit.com/r/NewParents/', source: '行业社区', note: '新手父母社区', kind: 'community' },

      { title: 'O*NET 职业档案：Childcare Workers', url: 'https://www.onetonline.org/link/summary/39-9011.00', source: '美国劳工部 O*NET' },
      { title: 'HealthyChildren.org 儿童健康指南', url: 'https://www.healthychildren.org/English/Pages/default.aspx', source: '美国儿科学会', note: '婴幼儿护理权威指南' },
    ],
    books: [
      { title: '美国儿科学会育儿百科', author: '美国儿科学会', why: '育儿照护的权威工具书' },
{ title: 'What to Expect the First Year', author: 'Heidi Murkoff', why: '从孕期到一岁的婴儿护理参考' }],
  },
  '家政服务师': {
    books: [
      { title: '断舍离', author: '山下英子', why: '家务整理的理念根基' },
      { title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '居家整理的方法论' }
    ],
    videos: [
      { title: '家政课程（通铭教育）', url: 'https://www.bilibili.com/video/BV1rW411n7pu', source: 'Bilibili', note: '家政服务系统课' }
    ],
    docs: [
      { title: '学前教育原理（陕西师范大学）', url: 'https://www.chinaooc.com.cn/course/6a6a7c70b44e493c768fc309', source: '国家高等教育智慧教育平台', note: '学前教育理论与园所实务' },

      { title: 'reddit · r/CleaningTips', url: 'https://www.reddit.com/r/CleaningTips/', source: '行业社区', note: '清洁收纳社区', kind: 'community' }
    ],
  },
  '职业规划师': {
    videos: [{ title: 'Career Development 职业发展课程（edX）', url: 'https://www.edx.org/learn/career-development', source: 'edX' }],
    docs: [
      { title: 'reddit · r/careerguidance', url: 'https://www.reddit.com/r/careerguidance/', source: '行业社区', note: '职业规划全球社区', kind: 'community' },

      { title: 'O*NET 职业档案：Educational, Guidance, and Career Counselors', url: 'https://www.onetonline.org/link/summary/21-1012.00', source: '美国劳工部 O*NET' },
      { title: 'NCDA 全国职业发展协会', url: 'https://www.ncda.org/aws/NCDA/pt/sp/home_page', source: 'NCDA' },
    ],
    books: [
      { title: 'Designing Your Life（设计你的人生）', author: 'Bill Burnett, Dave Evans', why: '用设计思维规划职业与生活，适合入门' },
      { title: 'What Color Is Your Parachute?', author: 'Richard N. Bolles', why: '职业转型与求职指导的经典读物' },
    ],
  },
  '皮肤管理师': {
    books: [
      { title: '皮肤的秘密', author: '耶尔·阿德勒', why: '皮肤科学的科普经典' },
      { title: '现代礼仪', author: '袁涤非', why: '服务形象与礼仪的标准教材' },
    ],
    videos: [
      { title: '皮肤管理中心培训第一课：皮肤分类', url: 'https://www.bilibili.com/video/BV1LF41137EM', source: 'Bilibili', note: '皮肤管理实务课' },
    ],
    docs: [
      { title: 'reddit · r/MakeupAddiction', url: 'https://www.reddit.com/r/MakeupAddiction/', source: '行业社区', note: '美妆社区', kind: 'community' },
{ title: 'O*NET 职业档案：Skincare Specialists', url: 'https://www.onetonline.org/link/summary/39-5094.00', source: '美国劳工部 O*NET' }],
  },
  '宠物行为训练师': {
    videos: [
      { title: '艾美奖训犬大师布兰登·麦克米伦大师课', url: 'https://www.bilibili.com/video/BV1PW4y1R7Dh', source: 'Bilibili', note: '训犬大师课' },
    ],
    docs: [
      { title: 'reddit · r/dogtraining', url: 'https://www.reddit.com/r/dogtraining/', source: '行业社区', note: '训犬全球社区', kind: 'community' },
{ title: 'O*NET 职业档案：Animal Trainers', url: 'https://www.onetonline.org/link/summary/39-2011.00', source: '美国劳工部 O*NET' }],
    books: [
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '动物行为观察的经典' },
{ title: 'The Other End of the Leash', author: 'Patricia B. McConnell', why: '从动物行为学角度理解人与狗的沟通' }],
  },
  '餐饮店长': {
    videos: [{ title: 'Hospitality Management 酒店与餐饮管理课程（edX）', url: 'https://www.edx.org/learn/hospitality-management', source: 'edX' }],
    docs: [
      { title: 'reddit · r/KitchenConfidential', url: 'https://www.reddit.com/r/KitchenConfidential/', source: '行业社区', note: '餐饮从业者全球社区', kind: 'community' },
{ title: 'O*NET 职业档案：Food Service Managers', url: 'https://www.onetonline.org/link/summary/11-9051.00', source: '美国劳工部 O*NET' }],
    books: [
      { title: '食物与厨艺', author: '哈洛德·马基', why: '烹饪科学的权威著作' },
{ title: 'Setting the Table', author: 'Danny Meyer', why: '餐厅款待与团队管理的实战经验' }],
  },
  '礼仪培训师': {
    books: [
      { title: '现代礼仪', author: '袁涤非', why: '礼仪教学的标准教材' },
      { title: '沟通的艺术', author: '罗纳德·B·阿德勒', why: '言谈礼仪背后的沟通学' },
    ],
    docs: [
      { title: 'reddit · r/etiquette', url: 'https://www.reddit.com/r/etiquette/', source: '行业社区', note: '礼仪规范讨论社区', kind: 'community' },

      { title: '现代礼仪（湖南大学·国家精品）', url: 'https://www.icourse163.org/course/hnu-20005', source: '中国大学MOOC', note: '礼仪培训的母本课程（八大模块）' },
    ],
    videos: [{ title: 'Your body language may shape who you are（TED）', url: 'https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are', source: 'TED', note: '肢体语言与自信表达' }],
  },
  '教练（运动/生活）': {
    videos: [
      { title: '国职教练：健身教练职业能力考试初级课程', url: 'https://www.bilibili.com/video/BV19P4y1o7Wb', source: 'Bilibili', note: '国职考证系统课' },
    ],
    docs: [
      { title: 'reddit · r/personaltraining', url: 'https://www.reddit.com/r/personaltraining/', source: '行业社区', note: '私教全球社区', kind: 'community' },
{ title: 'ICF 国际教练联盟', url: 'https://www.icf.org', source: 'ICF', note: '教练认证与职业标准' }],
    books: [
      { title: '运动训练学', author: '田麦久', why: '训练学的标准教材' },
{ title: 'The Coaching Habit', author: 'Michael Bungay Stanier', why: '用简短提问开展教练式对话' }],
  },
  '按摩理疗师': {
    videos: [{ title: 'Anatomy 人体解剖学课程（edX）', url: 'https://www.edx.org/learn/anatomy', source: 'edX', note: '人体结构基础' }],
    docs: [
      { title: 'reddit · r/fitness', url: 'https://www.reddit.com/r/fitness/', source: '行业社区', note: '健身全球社区', kind: 'community' },

      { title: 'O*NET 职业档案：Massage Therapists', url: 'https://www.onetonline.org/link/summary/31-9011.00', source: '美国劳工部 O*NET' },
      { title: 'AMTA 美国按摩治疗协会', url: 'https://www.amtamassage.org', source: 'AMTA' },
    ],
    books: [
      { title: '运动训练学', author: '田麦久', why: '训练学的标准教材' },
{ title: 'Trail Guide to the Body', author: 'Andrew Biel', why: '实用的肌肉骨骼解剖入门手册' }],
  },
  '导游': {
    books: [
      { title: '徐霞客游记', author: '徐霞客', why: '中国旅行观察的原典' },
      { title: '文化苦旅', author: '余秋雨', why: '人文讲解的文化底蕴' },
    ],
    videos: [
      { title: '零基础搞定旅游英语（94课）', url: 'https://www.bilibili.com/video/BV11e411R74N', source: 'Bilibili', note: '导游英语实务' },
    ],
    docs: [
      { title: 'reddit · r/travel', url: 'https://www.reddit.com/r/travel/', source: '行业社区', note: '旅游行业社区', kind: 'community' },

      { title: '中华人民共和国文化和旅游部', url: 'https://www.mct.gov.cn', source: '文化和旅游部' },
      { title: 'O*NET 职业档案：Tour Guides and Escorts', url: 'https://www.onetonline.org/link/summary/39-7011.00', source: '美国劳工部 O*NET' },
    ],
  },
  '发型师': {
    books: [
      { title: '皮肤的秘密', author: '耶尔·阿德勒', why: '皮肤科学的科普经典' },
      { title: '现代礼仪', author: '袁涤非', why: '服务形象与礼仪的标准教材' },
    ],
    videos: [
      { title: '皮肤管理中心培训第一课：皮肤分类', url: 'https://www.bilibili.com/video/BV1LF41137EM', source: 'Bilibili', note: '皮肤管理实务课' },
    ],
    docs: [
      { title: 'reddit · r/MakeupAddiction', url: 'https://www.reddit.com/r/MakeupAddiction/', source: '行业社区', note: '美妆社区', kind: 'community' },
{ title: 'O*NET 职业档案：Hairdressers, Hairstylists, and Cosmetologists', url: 'https://www.onetonline.org/link/summary/39-5012.00', source: '美国劳工部 O*NET' }],
  },
  '化妆师': {
    books: [
      { title: '皮肤的秘密', author: '耶尔·阿德勒', why: '皮肤科学的科普经典' },
      { title: '现代礼仪', author: '袁涤非', why: '服务形象与礼仪的标准教材' },
    ],
    videos: [
      { title: '皮肤管理中心培训第一课：皮肤分类', url: 'https://www.bilibili.com/video/BV1LF41137EM', source: 'Bilibili', note: '皮肤管理实务课' },
    ],
    docs: [
      { title: 'reddit · r/MakeupAddiction', url: 'https://www.reddit.com/r/MakeupAddiction/', source: '行业社区', note: '美妆社区', kind: 'community' },
{ title: 'O*NET 职业档案：Makeup Artists, Theatrical and Performance', url: 'https://www.onetonline.org/link/summary/39-5091.00', source: '美国劳工部 O*NET' }],
  },
  '宠物医生': {
    books: [
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '动物行为与健康的观察根基' },
      { title: '狗的家世', author: '康拉德·洛伦茨', why: '人宠关系的科学理解' },
    ],
    videos: [
      { title: '想成为一名宠物医生，你需要做什么？', url: 'https://www.bilibili.com/video/BV1mSNrzZE5Y', source: 'Bilibili', note: '宠物医生入行路径' },
    ],
    docs: [
      { title: 'reddit · r/AskVet', url: 'https://www.reddit.com/r/AskVet/', source: '行业社区', note: '兽医问答社区', kind: 'community' },
{ title: 'O*NET 职业档案：Veterinarians', url: 'https://www.onetonline.org/link/summary/29-1131.00', source: '美国劳工部 O*NET' }],
  },
  '家庭医生': {
    books: [
      { title: '默克家庭医学手册', author: '默克研究实验室', why: '家庭医学的权威工具书' },
      { title: '最好的告别', author: '阿图·葛文德', why: '全生命周期医疗关怀的经典' },
    ],
    videos: [
      { title: '价值导向的基层医疗转型：家庭医生的核心作用', url: 'https://www.bilibili.com/video/BV1FqCeBMEVC', source: 'Bilibili', note: '家庭医生体系认知' },
    ],
    docs: [
      { title: 'reddit · r/FamilyMedicine', url: 'https://www.reddit.com/r/FamilyMedicine/', source: '行业社区', note: '家庭医学社区', kind: 'community' },

      { title: 'O*NET 职业档案：Family Medicine Physicians', url: 'https://www.onetonline.org/link/summary/29-1215.00', source: '美国劳工部 O*NET' },
      { title: 'AAFP 美国家庭医师学会', url: 'https://www.aafp.org', source: 'AAFP' },
    ],
  },
  '特殊儿童康复师': {
    videos: [
      { title: '言语障碍康复训练', url: 'https://www.bilibili.com/video/BV1Dp3C6iEvm', source: 'Bilibili', note: '康复训练实操课' },
    ],
    docs: [
      { title: 'reddit · r/slp', url: 'https://www.reddit.com/r/slp/', source: '行业社区', note: '言语康复社区', kind: 'community' },
{ title: 'Autism Speaks 自闭症官方资源', url: 'https://www.autismspeaks.org', source: 'Autism Speaks' }],
    books: [
      { title: '给教师的建议', author: '苏霍姆林斯基', why: '个别化教育的经典指南' },
{ title: 'The Explosive Child', author: 'Ross W. Greene', why: '理解挑战性行为并与家庭协作干预' }],
  },
  '整理收纳顾问': {
    docs: [
      { title: 'reddit · r/konmari', url: 'https://www.reddit.com/r/konmari/', source: '行业社区', note: '近藤麻理惠整理法社区', kind: 'community' },

      { title: '家庭整理与收纳（湖北商贸学院）', url: 'https://www.icourse163.org/course/HBSX-1470933168', source: '中国大学MOOC', note: '全屋空间整理收纳的系统课程' },
    ],
    videos: [
      { title: '美好生活从整理开始（正统理论与实操）', url: 'https://www.bilibili.com/video/BV1xZ4y1j7qV', source: 'Bilibili', note: '收纳整理系统课' },
    ],
    books: [
      { title: '断舍离', author: '山下英子', why: '整理收纳的理念经典' },
{ title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '以"心动法则"重建居家与生活秩序' }],
  },
  '收纳整理师': {
    docs: [
      { title: 'reddit · r/konmari', url: 'https://www.reddit.com/r/konmari/', source: '行业社区', note: '近藤麻理惠整理法社区', kind: 'community' },

      { title: '家庭整理与收纳（湖北商贸学院）', url: 'https://www.icourse163.org/course/HBSX-1470933168', source: '中国大学MOOC', note: '全屋空间整理收纳的系统课程' },
    ],
    videos: [
      { title: '美好生活从整理开始（正统理论与实操）', url: 'https://www.bilibili.com/video/BV1xZ4y1j7qV', source: 'Bilibili', note: '收纳整理系统课' },
    ],
    books: [
      { title: '断舍离', author: '山下英子', why: '整理收纳的理念经典' },
{ title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '以"心动法则"重建居家与生活秩序' }],
  },
  '代际沟通顾问': {
    docs: [
      { title: 'reddit · r/declutter', url: 'https://www.reddit.com/r/declutter/', source: '行业社区', note: '整理收纳社区', kind: 'community' },

      { title: '老年护理（武汉大学）', url: 'https://www.icourse163.org/course/WHU-1470408196', source: '中国大学MOOC', note: '老年综合评估与照护的系统课程' },
    ],
    videos: [{ title: 'Psychology 心理学课程（edX）', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '人际与心理学基础' }],
    books: [
      { title: '最好的告别', author: '阿图·葛文德', why: '老年关怀与临终照护的必读经典' },
{ title: 'Crucial Conversations（关键对话）', author: 'Kerry Patterson 等', why: '处理高压与分歧情境下的沟通' }],
  },
  '睡眠健康顾问': {
    videos: [
      { title: '30分钟美军睡眠法引导', url: 'https://www.bilibili.com/video/BV1touPzAE7g', source: 'Bilibili', note: '睡眠放松引导' },
    ],
    docs: [
      { title: 'reddit · r/sleep', url: 'https://www.reddit.com/r/sleep/', source: '行业社区', note: '睡眠健康社区', kind: 'community' },
{ title: 'Sleep Hygiene 睡眠卫生指南', url: 'https://www.sleepfoundation.org/sleep-hygiene', source: 'Sleep Foundation' }],
    books: [
      { title: '我们为什么要睡觉', author: '马修·沃克', why: '睡眠科学的权威之作' },
{ title: 'Why We Sleep', author: 'Matthew Walker', why: '系统解释睡眠的科学机制与改善方法' }],
  },
  '年夜饭厨师': {
    books: [
      { title: '食物与厨艺', author: '哈洛德·马基', why: '烹饪原理的科学根基' },
      { title: '随园食单', author: '袁枚', why: '中式菜肴美学的古典经典' },
    ],
    videos: [
      { title: '中式烹调技术培训教程', url: 'https://www.bilibili.com/video/BV1iJ411W7Qp', source: 'Bilibili', note: '烹调系统课' },
    ],
    docs: [
      { title: 'reddit · r/Cooking', url: 'https://www.reddit.com/r/Cooking/', source: '行业社区', note: '烹饪全球社区', kind: 'community' },
{ title: 'O*NET 职业档案：Chefs and Head Cooks', url: 'https://www.onetonline.org/link/summary/35-1011.00', source: '美国劳工部 O*NET' }],
  },
  '婚恋匹配师': {
    docs: [
      { title: 'reddit · r/relationship_advice', url: 'https://www.reddit.com/r/relationship_advice/', source: '行业社区', note: '亲密关系社区', kind: 'community' },

      { title: '婚姻家庭法（黑龙江大学·一流课程）', url: 'https://www.chinaooc.com.cn/course/6a403aa886debac74e979af3', source: '国家智慧教育平台', note: '婚姻家庭制度的法律框架' },
    ],
    videos: [
      { title: '绘画治疗在婚恋中的咨询应用', url: 'https://www.bilibili.com/video/BV1HM411t7es', source: 'Bilibili', note: '婚恋咨询技术课' },
    ],
    books: [
      { title: '亲密关系', author: '罗兰·米勒', why: '婚恋心理的科学经典' },
{ title: 'Attached（依恋心理学）', author: 'Amir Levine, Rachel Heller', why: '用依恋理论理解亲密关系的模式' }],
  },
  '生活管家': {
    books: [
      { title: '断舍离', author: '山下英子', why: '家务整理的理念根基' },
      { title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '居家整理的方法论' },
    ],
    videos: [
      { title: '家政课程（通铭教育）', url: 'https://www.bilibili.com/video/BV1rW411n7pu', source: 'Bilibili', note: '家政服务系统课' },
    ],
    docs: [
      { title: 'reddit · r/CleaningTips', url: 'https://www.reddit.com/r/CleaningTips/', source: '行业社区', note: '清洁收纳社区', kind: 'community' },
{ title: 'O*NET 职业档案：Concierges', url: 'https://www.onetonline.org/link/summary/39-6012.00', source: '美国劳工部 O*NET' }],
  },
};
