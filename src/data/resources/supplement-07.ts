import type { CareerResourceSet } from '../career-resources';

export const supplementResources07: Record<string, CareerResourceSet> = {
  '基础设施融资经理': {
    books: [
      { title: '置身事内', author: '兰小欢', why: '地方基建投融资的底层逻辑' },
      { title: '供应链金融', author: '宋华', why: '基建产业链融资模式' },
    ],
    videos: [
      { title: '供应链金融', url: 'https://www.bilibili.com/video/BV1XBbVexELF', source: 'Bilibili', note: '基建产业链融资' },
    ],
    docs: [
      { title: 'reddit · r/Bogleheads', url: 'https://www.reddit.com/r/Bogleheads/', source: '行业社区', note: '指数化投资与长期配置社区', kind: 'community' },

      { title: '世界银行 PPP 知识中心（Public-Private Partnership）', url: 'https://ppp.worldbank.org/public-private-partnership/', source: '世界银行', note: '公私合营（PPP）项目的政策框架与案例资料' },
    ],
  },
  '设计讲师/培训师': {
    docs: [
      { title: 'reddit · r/calligraphy', url: 'https://www.reddit.com/r/calligraphy/', source: '行业社区', note: '书法社区', kind: 'community' },

      { title: '视觉传达设计1（字体·标志·版式）', url: 'https://www.icourse163.org/course/cid=1450090164', source: '中国大学MOOC', note: '可作为教学示范的课程结构' },
    ],
    videos: [
      { title: 'Learning How to Learn（如何学会学习）', url: 'https://www.coursera.org/learn/learning-how-to-learn', source: 'Coursera', note: '英文，学习方法与教学设计的认知基础' },
    ],
    books: [
      { title: '写给大家看的设计书', author: '罗宾·威廉姆斯', why: '设计教学的经典入门教材' },

      { title: '设计心理学（The Design of Everyday Things）', author: 'Don Norman', why: '设计原则的经典入门，便于向学员讲解设计思维' },
    ],
  },
};
