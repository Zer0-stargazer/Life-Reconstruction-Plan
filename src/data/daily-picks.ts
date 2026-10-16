/**
 * 「今日一页」候选池：从 laws / windows 里挑出的 60 条，只含摘要级内容。
 *
 * 为什么单独一个文件：首页访客可见，不能为了显示一条摘要把整份 laws / windows
 * （合计约 1MB）打进公开 bundle。内容均取自对应数据文件原文的标题与首句，未改写事实。
 * 增删候选只改这里；dailyPick 以本地日期为种子，同一天所有人看到同一条。
 */
export interface DailyPick {
  id: string;
  title: string;
  summary: string;
  /** 所属模块路由（访客点击会被登录门拦下，这正是引导） */
  href: '/laws' | '/windows';
}

export const DAILY_PICKS: readonly DailyPick[] = [
  { id: "law-mc-01", title: "大宗超强上升浪", summary: "原油/矿产等基础物质牛市，推高全球成本", href: "/laws" },
  { id: "win-1", title: "专业选择", summary: "选专业≈选赛道，4年后的就业市场可能已翻天覆地", href: "/windows" },
  { id: "law-mc-10", title: "地缘格局重塑", summary: "世界从单极走向多极，规则重写", href: "/laws" },
  { id: "win-16", title: "人脉质变期", summary: "从「认识人」到「被人需要」，社交资本开始产生回报", href: "/windows" },
  { id: "law-mc-19", title: "代际财富固化", summary: "贫富差距从「收入差距」升级为「资产差距」", href: "/laws" },
  { id: "win-32", title: "收入峰值期", summary: "大多数人的一生收入高峰出现在35-45岁，之后增长放缓或下降", href: "/windows" },
  { id: "law-mc-28", title: "太空经济破晓", summary: "商业航天降低进入太空成本100倍", href: "/laws" },
  { id: "win-47", title: "空巢适应", summary: "子女离家，重新面对「两个人的世界」，婚姻质量接受考验", href: "/windows" },
  { id: "law-bd-01", title: "25岁: 前额叶巅峰", summary: "前额叶皮层最终发育完全", href: "/laws" },
  { id: "win-62", title: "生命回顾", summary: "Erikson 的「完整 vs 绝望」——对一生的整合性评价", href: "/windows" },
  { id: "law-bd-10", title: "50岁: 关节全面退化启动", summary: "关节软骨磨损累积到临界点", href: "/laws" },
  { id: "win-77", title: "资本原始积累", summary: "从「出卖时间」到「资本运作」的跨越，杠杆率的质变", href: "/windows" },
  { id: "law-bd-21", title: "37岁: 肠道菌群多样性下降", summary: "肠道菌群多样性开始减少", href: "/laws" },
  { id: "win-92", title: "思维模式奠基", summary: "成长型vs固定型思维分野", href: "/windows" },
  { id: "law-bd-35", title: "75岁: 认知退化高风险期", summary: "阿尔茨海默等神经退行性疾病风险急剧上升", href: "/laws" },
  { id: "win-107", title: "健康习惯定型", summary: "饮食运动作息模式固化", href: "/windows" },
  { id: "law-mb-09", title: "慢性焦虑背景噪音", summary: "持续性低度焦虑像后台程序消耗CPU", href: "/laws" },
  { id: "win-123", title: "育儿观念形成", summary: "从被养育到养育者", href: "/windows" },
  { id: "law-mb-18", title: "拖延-自责恶性循环", summary: "拖延→自责→焦虑→更多拖延", href: "/laws" },
  { id: "win-138", title: "心理健康维护", summary: "中年抑郁风险上升", href: "/windows" },
  { id: "law-mt-27", title: "比较性疲劳", summary: "持续的社会比较导致慢性心理疲劳", href: "/laws" },
  { id: "win-153", title: "兴趣爱好培育", summary: "为退休后时间做准备", href: "/windows" },
  { id: "law-sv-10", title: "社交僵尸关系", summary: "维持大量无实质价值的关系——点赞之交、5 年没联系的「朋友」", href: "/laws" },
  { id: "win-199", title: "生命回顾整合", summary: "Erikson最后阶段：完整vs绝望", href: "/windows" },
  { id: "law-sv-19", title: "职场站队消耗", summary: "被迫在派系斗争中选边站", href: "/laws" },
  { id: "win-214", title: "长期关系建立", summary: "建立稳定的亲密关系或深度友谊", href: "/windows" },
  { id: "law-sv-28", title: "被需要成瘾", summary: "通过被别人需要来确认自己的价值", href: "/laws" },
  { id: "win-230", title: "技能不可替代性", summary: "在AI时代建立不可替代的核心技能组合", href: "/windows" },
  { id: "law-hc-01", title: "硬核英语直读神经回路", summary: "600天持续英文输入后，大脑建立绕过母语中转的直达通路", href: "/laws" },
  { id: "win-245", title: "退休财务验证", summary: "验证退休储蓄是否足够支撑退休生活", href: "/windows" },
  { id: "law-hc-19", title: "长期压力皮质醇损伤", summary: "持续高压 3 年以上，海马体体积缩小 14%", href: "/laws" },
  { id: "win-261", title: "编程思维窗口", summary: "计算思维和逻辑推理的敏感期", href: "/windows" },
  { id: "law-ht-28", title: "拒绝的习惯", summary: "每个「是」都在对其他事说「不」", href: "/laws" },
  { id: "win-291", title: "人才培养能力", summary: "从自我发展到培养他人", href: "/windows" },
  { id: "law-bs-01", title: "AI毁灭性职业替代", summary: "你的整个职业赛道在5年内可能被AI替代", href: "/laws" },
  { id: "win-306", title: "代际和解", summary: "与父母/子女深层和解", href: "/windows" },
  { id: "law-bs-10", title: "父母重疾倒计时", summary: "65岁以上父母重疾概率>50%", href: "/laws" },
  { id: "win-321", title: "家庭财务规划", summary: "为家庭建立全面的财务规划", href: "/windows" },
  { id: "law-bs-19", title: "重大误判导致人生偏移", summary: "选错专业、城市、伴侣或赛道，一个关键误判可能让人偏离最优路径 10-20 年", href: "/laws" },
  { id: "win-336", title: "投资风险再校准", summary: "50 岁后投资的第一问，是「跌三成我还睡得着吗」", href: "/windows" },
  { id: "law-we-02", title: "消费升级锁定", summary: "收入增加后消费同步升级", href: "/laws" },
  { id: "win-351", title: "心理资本积累", summary: "自信/希望/乐观/韧性的系统积累", href: "/windows" },
  { id: "law-we-11", title: "教育投资回报不确定", summary: "MBA、留学、高端培训动辄 30-100 万，回报远没有宣传的那么确定", href: "/laws" },
  { id: "win-382", title: "35岁职业转折点", summary: "互联网/科技行业35岁危机真实存在", href: "/windows" },
  { id: "law-wf-35", title: "物价结构性上涨", summary: "食品、教育、医疗价格的涨幅远超CPI", href: "/laws" },
  { id: "win-397", title: "育儿决策窗口", summary: "核心考量是经济基础与育儿分工", href: "/windows" },
  { id: "law-cc-08", title: "线性外推认知偏差", summary: "认为未来是现在的线性延续", href: "/laws" },
  { id: "win-412", title: "大厂vs创业公司选择", summary: "25-30 岁建议在大厂与创业公司之间轮换体验", href: "/windows" },
  { id: "law-cc-17", title: "权威崇拜认知让渡", summary: "「专家说的」「领导要求的」——放弃独立思考，让权威替你决定", href: "/laws" },
  { id: "win-427", title: "公积金利用最大化", summary: "公积金不是死钱", href: "/windows" },
  { id: "law-cg-28", title: "从众效应陷阱", summary: "大家都在做的事，你就跟着做", href: "/laws" },
  { id: "win-457", title: "密码管理器使用", summary: "还在用同一个密码或简单密码的用户，数据泄露只是时间问题", href: "/windows" },
  { id: "law-sv-01", title: "致命吸血原生家庭", summary: "不仅掠夺现金流为兄弟买单，更用道德绑架强杀你的翻身机会", href: "/laws" },
  { id: "win-472", title: "帕累托法则(80/20)", summary: "80%的结果来自20%的努力", href: "/windows" },
  { id: "law-hc-10", title: "吸烟累积性心血管损伤", summary: "每支烟缩短11分钟寿命", href: "/laws" },
  { id: "win-487", title: "个人数据资产化", summary: "你的数据正被拿来训练模型、做画像，而你一分钱没拿到", href: "/windows" },
  { id: "law-wf-22", title: "子女教育金缺口", summary: "教育支出增长速度超过收入增长速度", href: "/laws" },
  { id: "win-442", title: "近视矫正手术(LASIK/SMILE)", summary: "近视手术不是每个人都适合", href: "/windows" },
  { id: "law-bs-28", title: "子女教育意外", summary: "特殊教育需求、留学变故、择校失败，教育支出可能远超预期", href: "/laws" },
  { id: "win-367", title: "大学英语六级(CET-6)", summary: "通过四级后可报考六级，词汇量6000", href: "/windows" },
];

/** 本地日期 yyyy-mm-dd */
export function localDateKey(d: Date = new Date()): string {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

/** 以日期字符串为种子（FNV-1a）确定性选出一条 */
export function dailyPick(dateKey: string = localDateKey()): DailyPick {
  let h = 2166136261;
  for (let i = 0; i < dateKey.length; i++) {
    h ^= dateKey.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return DAILY_PICKS[(h >>> 0) % DAILY_PICKS.length];
}
