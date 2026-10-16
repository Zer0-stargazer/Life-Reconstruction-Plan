import type { CareerResourceSet } from '../career-resources';

export const supplementResources06: Record<string, CareerResourceSet> = {
  '绘本阅读指导师': {
    books: [
      { title: '童年的秘密', author: '玛丽亚·蒙台梭利', why: '儿童发展观的理论根基' },
      { title: '如何说孩子才会听，怎么听孩子才肯说', author: '阿黛尔·法伯', why: '亲子沟通的经典话术' },
    ],
    docs: [
      { title: 'reddit · r/musiced', url: 'https://www.reddit.com/r/musiced/', source: '行业社区', note: '音乐教育社区', kind: 'community' },

      { title: '学前教育学', url: 'https://www.icourse163.org/course/-1002527012', source: '中国大学MOOC', note: '学前儿童发展与教育的理论根基' },
    ],
    videos: [
      { title: 'edX: Storytelling（故事讲述）', url: 'https://www.edx.org/learn/storytelling', source: 'edX', note: '英文，故事结构与讲述技巧，可迁移到绘本导读' },
    ],
  },
  '花艺设计师': {
    books: [
      { title: '贝蒂的色彩', author: '贝蒂·艾德华', why: '花束配色的感知训练' },
      { title: '设计中的设计', author: '原研哉', why: '花艺空间的美学思维' },
    ],
    docs: [
      { title: '花瓣网（灵感采集）', url: 'https://huaban.com/', source: '行业社区', note: '花艺灵感图库', kind: 'community' },

      { title: '花百科（花卉知识库）', url: 'https://www.huabaike.com/', source: '官方资料库', note: '花材知识与养护参考' },
    ],
    videos: [
      { title: '草月插花入门第一课【基本立真型盛花】', url: 'https://www.bilibili.com/video/BV1se4y1m7uW/', source: 'B站', note: '草月流基础盛花，适合零基础入门' },
    ],
  },
  '书法艺术家': {
    books: [
      { title: '中国书法史', author: '丛文俊', why: '书法史脉络的权威通史' },
      { title: '启功给你讲书法', author: '启功', why: '书法练习的门径之谈' },
    ],
    docs: [
      { title: 'reddit · r/calligraphy', url: 'https://www.reddit.com/r/calligraphy/', source: '行业社区', note: '书法全球社区', kind: 'community' },

      { title: '故宫博物院数字文物库（碑帖书画）', url: 'https://digicol.dpm.org.cn/', source: '官方资料库', note: '历代碑帖法书的高清原作' },
    ],
    videos: [
      { title: '【全集】《毛笔启蒙》书法初学者无障碍“入门攻略”', url: 'https://www.bilibili.com/video/BV1z44y177hF/', source: 'B站', note: '按课时讲解毛笔基本笔画，适合零基础' },
      { title: '【全集】教你零基础写一手漂亮字！最好的名家书法课', url: 'https://www.bilibili.com/video/BV1FV411o7U9/', source: 'B站', note: '共14讲，从笔画讲起，偏硬笔与基础练习' },
    ],
  },
  '奢侈品销售': {
    docs: [
      { title: 'reddit · r/Luxury', url: 'https://www.reddit.com/r/Luxury/', source: '行业社区', note: '奢侈品行业社区', kind: 'community' },

      { title: '消费者行为学（湖南大学）', url: 'https://www.icourse163.org/course/HNU-1205721820', source: '中国大学MOOC', note: '高净值客户消费心理的科学根基' },
    ],
    videos: [
      { title: 'HKPolyUx: Luxury Management（香港理工大学奢侈品管理）', url: 'https://www.edx.org/learn/business-administration/the-hong-kong-polytechnic-university-luxury-management-2', source: 'edX', note: '英文，偏酒店与旅游场景，可学习奢侈品客户与品牌逻辑' },
    ],
    books: [
      { title: '奢侈品战略', author: '让-诺埃尔·卡普费雷', why: '奢侈品营销的权威著作' },

      { title: 'Deluxe: How Luxury Lost Its Luster（奢侈的代价）', author: 'Dana Thomas', why: '梳理奢侈品行业的商业与品牌演变，适合入行前了解行业背景' },
    ],
  },
  '宠物寄养师': {
    books: [
      { title: '所罗门王的指环', author: '康拉德·洛伦茨', why: '动物行为观察的经典' },
      { title: '狗的家世', author: '康拉德·洛伦茨', why: '训犬与犬类心理的根基' },
    ],
    docs: [
      { title: 'reddit · r/dogtraining', url: 'https://www.reddit.com/r/dogtraining/', source: '行业社区', note: '训犬全球社区', kind: 'community' },

      { title: '动物行为学（华中农业大学）', url: 'https://higher.smartedu.cn/course/630556941fdc0303f43ab9a3', source: '智慧教育平台', note: '学习行为与通讯行为的理论根基' },
    ],
    videos: [
      { title: 'edX: Animal Behavior（动物行为）', url: 'https://www.edx.org/learn/animal-behavior', source: 'edX', note: '英文，理解动物行为基础，有助于照护与应急判断' },
    ],
  },
  // 2026-10-12 剧本杀作者 已迁到 resources/media.ts 重配专属资源，此处删除避免覆盖。
  '中西医结合医师': {
    docs: [
      { title: '梅斯医学', url: 'https://www.medsci.cn/', source: '行业社区', note: '医学前沿资讯', kind: 'community' },

      { title: '生理学（南京中医药大学）', url: 'https://higher.smartedu.cn/course/6a960464b44e493c7664e4e9', source: '智慧教育平台', note: '中西医结合的现代生理基础' },
    ],
    videos: [
      { title: '任之堂中医入门12讲', url: 'https://www.bilibili.com/video/BV1yP4y1e7Zy/', source: 'B站', note: '从阴阳、气化等基础概念入门，适合中医零基础' },
    ],
    books: [
      { title: '中医基础理论', author: '郑洪新', why: '中医理论的人卫标准教材' },

      { title: '中医基础理论（全国中医药行业高等教育规划教材）', author: '郑洪新（主编）', why: '中医理论体系的常用行业教材，适合建立基础框架' },
    ],
  },
  '安宁疗护医师': {
    docs: [
      { title: '生物谷', url: 'https://www.bioon.com/', source: '行业社区', note: '生命科学资讯', kind: 'community' },

      { title: '内科学（华中科技大学）', url: 'https://www.icourse163.org/course/HUST-1465832170', source: '中国大学MOOC', note: '慢病与老年共病的全程管理' },
    ],
    videos: [
      { title: 'Essentials of Palliative Care（姑息治疗基础）', url: 'https://www.coursera.org/learn/essentials-of-palliative-care', source: 'Coursera', note: '英文，斯坦福大学开设，姑息与安宁照护入门' },
      { title: 'What is Palliative Care?（什么是姑息治疗）', url: 'https://www.coursera.org/learn/what-is-palliative-care', source: 'Coursera', note: '英文，概念性入门，适合先建立整体认识' },
    ],
    books: [
      { title: '最好的告别', author: '阿图·葛文德', why: '临终关怀与医疗限度的经典' },

      { title: 'When Breath Becomes Air（当呼吸化为空气）', author: 'Paul Kalanithi', why: '一位神经外科医生面对生命终点的自述，理解临终关怀的人文视角' },
    ],
  },
  '营地教育导师': {
    books: [
      { title: '追求理解的教学设计', author: '格兰特·威金斯', why: 'UbD 逆向设计的经典' },
      { title: '林间最后的小孩', author: '理查德·洛夫', why: '自然教育的奠基之作' },
    ],
    docs: [
      { title: 'reddit · r/instructionaldesign', url: 'https://www.reddit.com/r/instructionaldesign/', source: '行业社区', note: '教学设计社区', kind: 'community' },

      { title: '比较学前教育（北京师范大学·一流课程）', url: 'https://www.icourse163.org/course/0401BNU088-1206418809', source: '中国大学MOOC', note: '国际体验教育与营地模式的视野根基' },
    ],
    videos: [
      { title: 'UBCx: STEM Outside（户外STEM教育）', url: 'https://www.edx.org/learn/stem/university-of-british-columbia-stem-outside', source: 'edX', note: '英文，以户外与社区场景开展教学，偏教育者视角' },
    ],
  },
  '会员运营经理': {
    books: [
      { title: '流量池', author: '杨飞', why: '私域流量的方法论之作' },
      { title: '超级转化率', author: '陈勇', why: '转化优化的实操手册' },
    ],
    docs: [
      { title: 'reddit · r/Entrepreneur', url: 'https://www.reddit.com/r/Entrepreneur/', source: '行业社区', note: '创业者社区', kind: 'community' },

      { title: '客户关系管理（重庆大学）', url: 'https://www.icourse163.org/course/CQU-1002531006', source: '中国大学MOOC', note: '会员运营与CRM的系统课程' },
    ],
    videos: [
      { title: 'Customer Relationship Management（客户关系管理）', url: 'https://www.edx.org/learn/customer-relationship-management', source: 'edX', note: '英文，客户分层与长期关系维护的基础方法' },
    ],
  },
  '数字遗产规划师': {
    books: [
      { title: '最好的告别', author: '阿图·葛文德', why: '理解生命终点的真实需求' },
      { title: '在熟悉的家中向世界道别', author: '上野千鹤子', why: '临终安排的服务范式' },
    ],
    docs: [
      { title: 'reddit · r/legaladvice', url: 'https://www.reddit.com/r/legaladvice/', source: '行业社区', note: '法律咨询社区', kind: 'community' },

      { title: '婚姻家庭法（黑龙江大学·一流课程）', url: 'https://www.chinaooc.com.cn/course/6a403aa886debac74e979af3', source: '国家智慧教育平台', note: '亲属与家庭财产制度的法律框架' },
    ],
    videos: [
      { title: 'Retirement and Estate Planning（退休与遗产规划）', url: 'https://www.coursera.org/learn/retirement-and-estate-planning', source: 'Coursera', note: '英文，Pearson 开设，讲解遗嘱、信托与受益人指定' },
    ],
  },
  '初级全科医师': {
    books: [
      { title: '诊断学', author: '万学红', why: '问诊查体与临床思维的根基教材' },
      { title: '默克家庭诊疗手册', author: '默克公司', why: '全科视角的疾病诊疗权威参考' },
    ],
    docs: [
      { title: 'reddit · r/veterinary', url: 'https://www.reddit.com/r/veterinary/', source: '行业社区', note: '兽医社区', kind: 'community' },

      { title: '内科学（华中科技大学）', url: 'https://www.icourse163.org/course/HUST-1465832170', source: '中国大学MOOC', note: '内科系统疾病的诊疗全框架' },
    ],
    videos: [
      { title: 'Patient-Centered Care Essentials（以患者为中心的照护基础）', url: 'https://www.coursera.org/learn/patient-centered-care-essentials', source: 'Coursera', note: '英文，以患者为中心的沟通与照护入门' },
    ],
  },
  '初级康复治疗师': {
    books: [
      { title: '康复医学', author: '黄晓琳', why: '康复医学的人卫标准教材' },
      { title: '物理治疗学', author: '燕铁斌', why: '运动治疗与物理因子的核心技术教材' },
    ],
    docs: [
      { title: 'reddit · r/PhysicalTherapy', url: 'https://www.reddit.com/r/PhysicalTherapy/', source: '行业社区', note: '物理治疗师全球社区', kind: 'community' },

      { title: '系统解剖学（武汉大学）', url: 'https://www.icourse163.org/course/whu-476001', source: '中国大学MOOC', note: '康复与运动系统的解剖根基' },
    ],
    videos: [
      { title: 'Managing Your Health: The Role of Physical Therapy and Exercise（物理治疗与运动在健康管理中的作用）', url: 'https://www.coursera.org/learn/physical-therapy-exercise', source: 'Coursera', note: '英文，多伦多大学开设，理解康复与运动的关系' },
    ],
  },
};
