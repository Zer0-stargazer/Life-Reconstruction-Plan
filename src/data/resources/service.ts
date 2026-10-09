import type { CareerResourceSet } from '../career-resources';

export const serviceResources: Record<string, CareerResourceSet> = {
  '健身教练': {
    videos: [{ title: 'Nutrition 营养学课程（edX）', url: 'https://www.edx.org/learn/nutrition', source: 'edX', note: '营养基础，配合训练指导使用' }],
    docs: [
      { title: 'O*NET 职业档案：Exercise Trainers and Group Fitness Instructors', url: 'https://www.onetonline.org/link/summary/39-9031.00', source: '美国劳工部 O*NET' },
      { title: 'ACSM 教育资源', url: 'https://www.acsm.org/education-resources', source: '美国运动医学学会', note: '运动科学权威机构' },
    ],
    books: [{ title: 'Starting Strength（力量训练基础）', author: 'Mark Rippetoe', why: '经典力量训练入门著作，讲解基础动作' }],
  },
  '月嫂/育婴师': {
    videos: [{ title: 'Nursing 护理学课程（edX）', url: 'https://www.edx.org/learn/nursing', source: 'edX', note: '护理基础知识' }],
    docs: [
      { title: 'O*NET 职业档案：Childcare Workers', url: 'https://www.onetonline.org/link/summary/39-9011.00', source: '美国劳工部 O*NET' },
      { title: 'HealthyChildren.org 儿童健康指南', url: 'https://www.healthychildren.org/English/Pages/default.aspx', source: '美国儿科学会', note: '婴幼儿护理权威指南' },
    ],
    books: [{ title: 'What to Expect the First Year', author: 'Heidi Murkoff', why: '从孕期到一岁的婴儿护理参考' }],
  },
  '家政服务师': {
    docs: [{ title: '人力资源和社会保障部官网', url: 'https://www.mohrss.gov.cn', source: '人社部', note: '查询国家职业技能标准与培训信息' }],
  },
  '职业规划师': {
    videos: [{ title: 'Career Development 职业发展课程（edX）', url: 'https://www.edx.org/learn/career-development', source: 'edX' }],
    docs: [
      { title: 'O*NET 职业档案：Educational, Guidance, and Career Counselors', url: 'https://www.onetonline.org/link/summary/21-1012.00', source: '美国劳工部 O*NET' },
      { title: 'NCDA 全国职业发展协会', url: 'https://www.ncda.org/aws/NCDA/pt/sp/home_page', source: 'NCDA' },
    ],
    books: [
      { title: 'Designing Your Life（设计你的人生）', author: 'Bill Burnett, Dave Evans', why: '用设计思维规划职业与生活，适合入门' },
      { title: 'What Color Is Your Parachute?', author: 'Richard N. Bolles', why: '职业转型与求职指导的经典读物' },
    ],
  },
  '皮肤管理师': {
    docs: [{ title: 'O*NET 职业档案：Skincare Specialists', url: 'https://www.onetonline.org/link/summary/39-5094.00', source: '美国劳工部 O*NET' }],
  },
  '宠物行为训练师': {
    docs: [{ title: 'O*NET 职业档案：Animal Trainers', url: 'https://www.onetonline.org/link/summary/39-2011.00', source: '美国劳工部 O*NET' }],
    books: [{ title: 'The Other End of the Leash', author: 'Patricia B. McConnell', why: '从动物行为学角度理解人与狗的沟通' }],
  },
  '餐饮店长': {
    videos: [{ title: 'Hospitality Management 酒店与餐饮管理课程（edX）', url: 'https://www.edx.org/learn/hospitality-management', source: 'edX' }],
    docs: [{ title: 'O*NET 职业档案：Food Service Managers', url: 'https://www.onetonline.org/link/summary/11-9051.00', source: '美国劳工部 O*NET' }],
    books: [{ title: 'Setting the Table', author: 'Danny Meyer', why: '餐厅款待与团队管理的实战经验' }],
  },
  '礼仪培训师': {
    videos: [{ title: 'Your body language may shape who you are（TED）', url: 'https://www.ted.com/talks/amy_cuddy_your_body_language_may_shape_who_you_are', source: 'TED', note: '肢体语言与自信表达' }],
  },
  '教练（运动/生活）': {
    docs: [{ title: 'ICF 国际教练联盟', url: 'https://www.icf.org', source: 'ICF', note: '教练认证与职业标准' }],
    books: [{ title: 'The Coaching Habit', author: 'Michael Bungay Stanier', why: '用简短提问开展教练式对话' }],
  },
  '按摩理疗师': {
    videos: [{ title: 'Anatomy 人体解剖学课程（edX）', url: 'https://www.edx.org/learn/anatomy', source: 'edX', note: '人体结构基础' }],
    docs: [
      { title: 'O*NET 职业档案：Massage Therapists', url: 'https://www.onetonline.org/link/summary/31-9011.00', source: '美国劳工部 O*NET' },
      { title: 'AMTA 美国按摩治疗协会', url: 'https://www.amtamassage.org', source: 'AMTA' },
    ],
    books: [{ title: 'Trail Guide to the Body', author: 'Andrew Biel', why: '实用的肌肉骨骼解剖入门手册' }],
  },
  '导游': {
    docs: [
      { title: '中华人民共和国文化和旅游部', url: 'https://www.mct.gov.cn', source: '文化和旅游部' },
      { title: 'O*NET 职业档案：Tour Guides and Escorts', url: 'https://www.onetonline.org/link/summary/39-7011.00', source: '美国劳工部 O*NET' },
    ],
  },
  '发型师': {
    docs: [{ title: 'O*NET 职业档案：Hairdressers, Hairstylists, and Cosmetologists', url: 'https://www.onetonline.org/link/summary/39-5012.00', source: '美国劳工部 O*NET' }],
  },
  '化妆师': {
    docs: [{ title: 'O*NET 职业档案：Makeup Artists, Theatrical and Performance', url: 'https://www.onetonline.org/link/summary/39-5091.00', source: '美国劳工部 O*NET' }],
  },
  '宠物医生': {
    docs: [{ title: 'O*NET 职业档案：Veterinarians', url: 'https://www.onetonline.org/link/summary/29-1131.00', source: '美国劳工部 O*NET' }],
  },
  '家庭医生': {
    docs: [
      { title: 'O*NET 职业档案：Family Medicine Physicians', url: 'https://www.onetonline.org/link/summary/29-1215.00', source: '美国劳工部 O*NET' },
      { title: 'AAFP 美国家庭医师学会', url: 'https://www.aafp.org', source: 'AAFP' },
    ],
  },
  '特殊儿童康复师': {
    docs: [{ title: 'Autism Speaks 自闭症官方资源', url: 'https://www.autismspeaks.org', source: 'Autism Speaks' }],
    books: [{ title: 'The Explosive Child', author: 'Ross W. Greene', why: '理解挑战性行为并与家庭协作干预' }],
  },
  '整理收纳顾问': {
    books: [{ title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '以"心动法则"重建居家与生活秩序' }],
  },
  '收纳整理师': {
    books: [{ title: '怦然心动的人生整理魔法', author: '近藤麻理惠', why: '以"心动法则"重建居家与生活秩序' }],
  },
  '代际沟通顾问': {
    videos: [{ title: 'Psychology 心理学课程（edX）', url: 'https://www.edx.org/learn/psychology', source: 'edX', note: '人际与心理学基础' }],
    books: [{ title: 'Crucial Conversations（关键对话）', author: 'Kerry Patterson 等', why: '处理高压与分歧情境下的沟通' }],
  },
  '睡眠健康顾问': {
    docs: [{ title: 'Sleep Hygiene 睡眠卫生指南', url: 'https://www.sleepfoundation.org/sleep-hygiene', source: 'Sleep Foundation' }],
    books: [{ title: 'Why We Sleep', author: 'Matthew Walker', why: '系统解释睡眠的科学机制与改善方法' }],
  },
  '年夜饭厨师': {
    docs: [{ title: 'O*NET 职业档案：Chefs and Head Cooks', url: 'https://www.onetonline.org/link/summary/35-1011.00', source: '美国劳工部 O*NET' }],
  },
  '婚恋匹配师': {
    books: [{ title: 'Attached（依恋心理学）', author: 'Amir Levine, Rachel Heller', why: '用依恋理论理解亲密关系的模式' }],
  },
  '生活管家': {
    docs: [{ title: 'O*NET 职业档案：Concierges', url: 'https://www.onetonline.org/link/summary/39-6012.00', source: '美国劳工部 O*NET' }],
  },
};
