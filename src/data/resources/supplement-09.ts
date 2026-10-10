import type { CareerResourceSet } from '../career-resources';

export const supplementResources09: Record<string, CareerResourceSet> = {
  '高级护士': {
    videos: [
      { title: 'edX 护理学课程合集（英文）', url: 'https://www.edx.org/learn/nursing', source: 'edX', note: '英文，护理学相关课程分类页' },
    ],
  },
  '高级全科医师': {
    videos: [
      { title: 'edX 医学课程合集（英文）', url: 'https://www.edx.org/learn/medicine', source: 'edX', note: '英文，临床医学相关课程分类页' },
    ],
  },
  '智能座舱体验设计师': {
    videos: [
      { title: 'Google UX Design Professional Certificate（Google 用户体验设计专业证书）', url: 'https://www.coursera.org/professional-certificates/google-ux-design', source: 'Coursera', note: '英文，用户体验设计全流程，可迁移到座舱交互' },
      { title: 'edX 交互设计课程合集（英文）', url: 'https://www.edx.org/learn/interaction-design', source: 'edX', note: '英文，人机交互设计基础' },
    ],
    books: [{ title: 'About Face 4：交互设计精髓', author: 'Alan Cooper、Robert Reimann、Dave Cronin、Christopher Noessel', why: '交互设计经典著作，适合理解复杂人机系统的设计方法' }],
  },
  '设计运营专家': {
    videos: [
      { title: 'edX 设计思维课程合集（英文）', url: 'https://www.edx.org/learn/design-thinking', source: 'edX', note: '英文，设计思维方法论与协作流程' },
    ],
    books: [{ title: '点石成金：Don\'t Make Me Think（第三版）', author: 'Steve Krug', why: '可用性设计入门经典，适合理解设计团队的运营与评审机制' }],
  },
  '本地生活运营': {
    videos: [
      { title: 'edX 运营管理课程合集（英文）', url: 'https://www.edx.org/learn/operations-management', source: 'edX', note: '英文，运营管理基础' },
    ],
  },
  '社群团购运营': {
    videos: [
      { title: 'edX 市场营销课程合集（英文）', url: 'https://www.edx.org/learn/marketing', source: 'edX', note: '英文，营销基础，可迁移到社群增长' },
    ],
  },
  '戏剧教育教师': {
    videos: [
      { title: 'edX 教育学课程合集（英文）', url: 'https://www.edx.org/learn/education', source: 'edX', note: '英文，教育学基础与教学设计' },
    ],
    books: [{ title: 'Improvisation for the Theater（即兴戏剧）', author: 'Viola Spolin', why: '戏剧教育即兴训练经典，适合课堂引导与戏剧游戏设计' }],
  },
};
