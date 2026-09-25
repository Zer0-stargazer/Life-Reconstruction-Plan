const fs = require('fs');
const diffMap = { none: 5, low: 4, medium: 3, high: 2 };

const silentCost = {
  red: (n) => ['缺少此红利需多付出3-5倍努力弥补','未能利用此优势者需额外5-10年追赶','错失此机会将导致该领域长期处于劣势','此红利的缺失使起步延迟5-10年','无此优势者在相关领域的天花板降低2-3级'][n%5],
  purple: (n) => ['此类事件若未准备可能5-10年积累归零','未设防时损失可能达总资产的30-50%','忽视此风险会让相关领域瞬间崩塌','此黑天鹅的沉默代价是5年以上的重建期','对此毫无预案的人恢复期超过3-5年'][n%5],
  blue: (n) => ['持续处于此风险中每年折损15-20%效能','此陷阱每年悄悄吞噬20%的时间和精力','不解决此问题5年后的差距将无法弥补','此风险若不化解将持续恶化','沉溺于此10年后回头看会后悔莫及'][n%5],
  cyan: (n) => ['忽视此暗门意味着错过一个10年的复利积累期','不掌握此技能在该领域永远有天花板','此路径若不走可能永远不会知道错过了什么','忽略此机会潜力只能发挥30-50%','不走此暗门5年后会在同一赛道上更卷'][n%5],
};
const copingStrategy = {
  red: (n) => ['主动创造有利条件最大化此红利效果','识别并把握红利窗口期及时行动','利用此优势建立长期竞争壁垒','在红利期积累资本为下一个周期做准备','将红利转化为可持续的能力和资源'][n%5],
  purple: (n) => ['提前建立应急预案和缓冲空间','设定预警信号提前布局降低损失','保持充足流动性和备选方案','建立系统性风险应对机制','定期压力测试确保抗冲击能力'][n%5],
  blue: (n) => ['觉察此风险的早期信号立即行动','用系统设计替代意志力来改变行为','设定明确边界限制此风险的侵蚀范围','通过认知重构从根本上改变思维模式','建立支持系统防止此风险再次发生'][n%5],
  cyan: (n) => ['从最小可行行动开始降低启动门槛','设定里程碑作为阶段性验证点','利用现有资源加速探索此暗门','在3-6个月内完成初步验证和迭代','通过持续小步快跑让收益逐步兑现'][n%5],
};
const coreAnalysis = {
  red: (n,name) => name+'是人生初始条件的核心变量，影响深远但可控性有限',
  purple: (n,name) => name+'是系统性的不可控变量，准备与预案是唯一对冲',
  blue: (n,name) => name+'是温水煮青蛙式的侵蚀，觉察即改变的开始',
  cyan: (n,name) => name+'是少数人知道且行动的路径，信息差本身就是壁垒',
};
const aiMulti = {
  red: (n) => ['经济学:初始禀赋决定起点;社会学:代际传递效应显著;心理学:自我效能感提升','经济学:先发优势形成壁垒;社会学:社会资本路径依赖;心理学:安全基地效应','经济学:资源集聚效应;心理学:正向期待塑造行为;社会学:网络效应放大优势','经济学:边际收益递增;心理学:习得性乐观;社会学:结构位置决定资源获取','经济学:复利效应在长期维度最为显著;心理学:控制感增强行动力;社会学:信任成本天然降低'][n%5],
  purple: (n) => ['风险分析:尾部风险不可忽视;行为学:恐慌反应放大损失;应对:建立安全边际','概率评估:虽低但损失巨大;心理影响:确认偏误延误应对;缓冲:分散风险对冲','概率视角:非线性损失特征;行为面:正常化偏误忽视信号;防御:保持流动性','风险面:系统性风险无人免疫;行为面:从众心理加剧波动;防御:预设退出机制','评估:相关性风险常被低估;心理:处置效应导致错误决策;策略:定期压力测试'][n%5],
  blue: (n) => ['认知分析:确认偏误固化错误;行为经济学:损失厌恶阻碍止损;破解:认知重构','认知偏误:锚定效应限制选择;行为模式:心理账户割裂决策;干预:系统设计替代意志力','思维陷阱:沉没成本锁定行为;行为惯性:双曲贴现偏好即时;退出策略:环境设计改变行为','认知:幸存者偏差误导决策;行为:禀赋效应高估已有;方案:同伴压力正向利用','诊断:可得性偏误扭曲判断;行为:羊群效应驱动从众;方案:自动化减少决策消耗'][n%5],
  cyan: (n) => ['机会分析:信息不对称区存在套利;行动:最小可行行动启动;价值:长期复利效应显著','机会面:认知差创造先发优势;执行面:迭代试错降低风险;价值面:能力迁移性强','发现:技术变革打开新窗口;执行:里程碑验证方向;价值:护城河随时间加深','逻辑:结构洞位置连接异质网络;路径:反馈循环加速学习;效应:反脆弱性增强','发现:逆向思维发现盲区;执行:系统性练习优于随机尝试;价值:越晚入场壁垒越高'][n%5],
};
const howToGrasp = {
  red: (n) => ['在最佳时机窗口内主动创造有利条件','关注关键指标变化识别红利启动信号','利用此红利的飞轮效应持续放大优势','在红利期内加速积累为下一个周期蓄力','将外在红利转化为内在可持续能力'][n%5],
  purple: (n) => ['提前建立应急预案保持充足缓冲','设定关键预警信号在风险积聚前行动','保持流动性始终有Plan B','用分散和对冲降低单一事件冲击','定期更新风险清单和应对预案'][n%5],
  blue: (n) => ['觉察此风险的早期信号立即采取行动','用系统设计替代意志力来改变行为模式','设定明确边界防止风险持续侵蚀','通过认知重构打破思维陷阱','建立支持系统确保改变可持续'][n%5],
  cyan: (n) => ['从最小可行行动开始今天迈出第一步','设定3个月里程碑验证方向','利用现有资源加速暗门探索','在6个月内完成初步验证和迭代','通过持续小步快跑让收益逐步兑现'][n%5],
};
const amplifySignal = {
  red: (n) => ['当关键指标出现正向变化时红利正在发挥作用','关注相关领域的趋势变化识别红利窗口','当你感觉做某事异常顺利时说明红利在累积','当机会开始主动找你时红利效应已经启动','当同龄人差距开始明显拉大时复利在兑现'][n%5],
  purple: (n) => ['关键先行指标出现异常时风险正在积聚','当同行业频繁出现类似事件时应当警觉','核心指标的异常波动可能是预警信号','当你注意到某些不寻常现象频繁出现时','当市场情绪过度乐观时往往是风险积聚期'][n%5],
  blue: (n) => ['当你发现自己在重复某种无效模式时已陷入风险','关键指标的持续下降是风险正在侵蚀的信号','当你的时间和精力投入产出比持续下降时','当身边人开始提醒你某个问题时需要认真对待','当你在某个领域长期没有进步时说明被卡住了'][n%5],
  cyan: (n) => ['当你发现一个大多数人忽视的有价值机会时暗门正在打开','关键指标的正向变化意味着此路径可行','当你能做到多数人做不到的事时暗门已被你掌握','当你在新领域快速获得正反馈时路径验证成功','当你开始收到此暗门相关的合作邀请时网络效应启动'][n%5],
};
const cashRhythm = {
  red: (n) => ['长期兑现:5-10年后红利效应充分显现','中期兑现:3-5年内可见明显优势','短期兑现:6-12个月内即可感受','超长期兑现:10年以上跨代际积累','中期兑现:2-3年形成竞争壁垒'][n%5],
  purple: (n) => ['突发性兑现:事件发生瞬间改变一切','短期冲击:事件后3-6个月最为关键','中期恢复:事件后2-3年进入新常态','长期重构:事件后5年以上完成重建','阶段性兑现:冲击-适应-重建三阶段'][n%5],
  blue: (n) => ['渐进性侵蚀:每年折损10-15%而不自知','中期显现:3-5年后差距变得不可忽视','长期代价:10年积累的损失极其惊人','短期可逆:现在行动仍可挽回大部分损失','加速性恶化:不处理则损失速度递增'][n%5],
  cyan: (n) => ['短期验证:3-6个月内可见初步成效','中期兑现:2-3年后开始产生超额回报','长期复利:5-10年以上复利效应爆炸式增长','持续兑现:越早启动收益越大','复合兑现:能力加资源加网络三重复利'][n%5],
};
const realCases = {
  red: (n) => ['小镇做题家通过高考进入一线城市30岁完成阶层跃迁','早期AI从业者当前薪资是传统IT的2.5倍','坚持跑步20年的人60岁时体能相当于不运动者的40岁','巴菲特每天阅读5小时称这是最重要的投资','马云遇孙正义6分钟拿到2000万美元投资'][n%5],
  purple: (n) => ['2008年金融危机让无数家庭财富归零也有人在低谷抄底暴富','教培行业双减一夜之间万亿市值蒸发','新冠疫情催生了远程办公和在线教育的爆发式增长','比特币从2万跌到3千又在2年后涨到6万','某创业者在融资失败后转型做咨询反而找到更适合自己的路'][n%5],
  blue: (n) => ['选错专业的人平均需要7年才能转行成功','信用卡债务滚雪球让很多人5年内无法翻身','拖延症患者平均每年浪费约600小时在无意义的焦虑上','消费主义让月入2万的人依然存不下钱','不体检的人发现癌症时往往已是晚期'][n%5],
  cyan: (n) => ['每天写1000字5年出7本书版税超过工资','从Python自学编程的人6个月后转行AI薪资翻倍','每月定投指数基金10年后年化收益8-10%','经营1000人社群的创作者年收入超百万','从修复小bug开始参与开源3年后成为项目核心维护者'][n%5],
};

// Read raw data
const rawData = JSON.parse(fs.readFileSync('/workspace/projects/scripts/luck-raw-fixed.json','utf8'));

const nodes = rawData.map(d => {
  const [id, name, cat, prob, imp, ctrl, desc, strat] = d;
  return {
    id, name, category: cat, probability: prob,
    impact: imp, controllability: ctrl,
    difficulty: diffMap[ctrl],
    silentCost: silentCost[cat](id),
    description: desc,
    strategy: strat,
    copingStrategy: copingStrategy[cat](id),
    coreAnalysis: coreAnalysis[cat](id, name),
    aiMultiAnalysis: aiMulti[cat](id),
    realCases: realCases[cat](id),
    howToGrasp: howToGrasp[cat](id),
    amplifySignal: amplifySignal[cat](id),
    cashRhythm: cashRhythm[cat](id),
  };
});

// Escape single quotes
const esc = s => s.replace(/'/g, "\\'");

let out = `// 运气节点数据 - ${nodes.length}个节点
// 参考 npcnpc.com 的运气模块

export type LuckCategory = 'red' | 'purple' | 'blue' | 'cyan';

export interface LuckNode {
  id: number;
  name: string;
  category: LuckCategory;
  probability: number;
  impact: 1 | 2 | 3 | 4 | 5;
  controllability: 'none' | 'low' | 'medium' | 'high';
  difficulty: 1 | 2 | 3 | 4 | 5;
  silentCost: string;
  description: string;
  strategy: string;
  copingStrategy: string;
  coreAnalysis: string;
  aiMultiAnalysis: string;
  realCases: string;
  howToGrasp: string;
  amplifySignal: string;
  cashRhythm: string;
}

export const LUCK_CATEGORY_CONFIG: Record<LuckCategory, { label: string; color: string; bgColor: string; borderColor: string }> = {
  red: { label: '红利', color: 'text-red-700 dark:text-red-400', bgColor: 'bg-red-50 dark:bg-red-950/30', borderColor: 'border-red-200 dark:border-red-800' },
  purple: { label: '黑天鹅', color: 'text-purple-700 dark:text-purple-400', bgColor: 'bg-purple-50 dark:bg-purple-950/30', borderColor: 'border-purple-200 dark:border-purple-800' },
  blue: { label: '风险', color: 'text-blue-700 dark:text-blue-400', bgColor: 'bg-blue-50 dark:bg-blue-950/30', borderColor: 'border-blue-200 dark:border-blue-800' },
  cyan: { label: '暗门', color: 'text-cyan-700 dark:text-cyan-400', bgColor: 'bg-cyan-50 dark:bg-cyan-950/30', borderColor: 'border-cyan-200 dark:border-cyan-800' },
};

export const luckNodes: LuckNode[] = [
`;

for (const n of nodes) {
  out += `  {
    id: ${n.id}, name: '${esc(n.name)}', category: '${n.category}' as LuckCategory, probability: ${n.probability},
    impact: ${n.impact} as const, controllability: '${n.controllability}' as const, difficulty: ${n.difficulty} as const,
    silentCost: '${esc(n.silentCost)}',
    description: '${esc(n.description)}',
    strategy: '${esc(n.strategy)}',
    copingStrategy: '${esc(n.copingStrategy)}',
    coreAnalysis: '${esc(n.coreAnalysis)}',
    aiMultiAnalysis: '${esc(n.aiMultiAnalysis)}',
    realCases: '${esc(n.realCases)}',
    howToGrasp: '${esc(n.howToGrasp)}',
    amplifySignal: '${esc(n.amplifySignal)}',
    cashRhythm: '${esc(n.cashRhythm)}',
  },\n`;
}

out += '];\n';

fs.writeFileSync('/workspace/projects/src/data/luck-nodes.ts', out);
console.log('Generated ' + nodes.length + ' luck nodes');
