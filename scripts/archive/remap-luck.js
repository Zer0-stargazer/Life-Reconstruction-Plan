const fs = require('fs');
const path = require('path');
// 项目根路径：本脚本位于 <root>/scripts/archive/，不依赖运行时的 cwd。
// （原脚本写死了扣子云端沙箱路径 /workspace/projects/...，本地无法运行）
const ROOT = path.resolve(__dirname, '..', '..');
const P = (p) => path.join(ROOT, p);
const raw = JSON.parse(fs.readFileSync(P('scripts/archive/luck-raw-fixed.json'),'utf8'));

// 最终分类逻辑（参照 npcnpc.com）：
// 红-人际吸血: 消耗你的人际关系（人际负面）
// 紫-人生天坑: 击穿人生的事件 + 行为暗坑（事件/行为负面）
// 蓝-人际杠杆: 放大你收益的人际关系（人际正面）
// 青-命运暗门: 改变命运的事件/天赋/主动选择（事件正面）

const remap = {
  // ============================
  // 红-人际吸血 (人际负面)
  // ============================
  '原生家庭创伤': 'red',
  '错误婚姻': 'red',
  '婚变': 'red',
  '社交失误': 'red',
  '信任错人': 'red',
  '人际关系消耗': 'red',
  '无效社交': 'red',
  '人际关系单薄': 'red',
  '过度依赖他人评价': 'red',
  '缺乏边界感': 'red',
  '取悦型人格': 'red',
  '忽视人脉维护': 'red',
  '忽视长期关系经营': 'red',
  '社交恐惧': 'red',
  '职场性骚扰': 'red',
  '亲友借钱不还': 'red',
  '创业合伙人背叛': 'red',
  '职场背锅': 'red',
  '核心员工离职': 'red',
  '遭遇网络暴力': 'red',
  '关键人依赖': 'red',
  '过度承诺': 'red',
  '过度内卷': 'red',       // 人际竞争消耗
  '羊群效应': 'red',       // 被群体裹挟
  '比较心理': 'red',       // 人际比较消耗
  '商业合作崩盘': 'red',   // 人际关系崩塌
  '公众舆论反转': 'red',   // 群体性人际攻击
  '遇到骗子': 'red',       // 被人欺骗
  '知识产权纠纷': 'red',   // 人际/商业纠纷
  '供应链断裂': 'red',     // 商业人际断裂
  '被诬告冤案': 'red',     // 被人陷害

  // ============================
  // 蓝-人际杠杆 (人际正面)
  // ============================
  '遇到好老师': 'blue',
  '遇到人生伴侣': 'blue',
  '父母开明支持': 'blue',
  '贵人相助': 'blue',
  '遇到好上司': 'blue',
  '校友网络': 'blue',
  '家庭和睦': 'blue',
  '社交天赋': 'blue',
  '兄弟姐妹互助': 'blue',
  '与未来领袖同窗': 'blue',
  '父母教育水平高': 'blue',
  '童年安全感充足': 'blue',
  '少年遇良师益友': 'blue',
  '文化资本传承': 'blue',
  '偶遇行业大佬': 'blue',
  '导师网络': 'blue',
  '人脉弱连接': 'blue',
  '学会谈判': 'blue',
  '学会拒绝': 'blue',
  '建立信任网络': 'blue',
  '社区运营能力': 'blue',
  '跨文化沟通': 'blue',
  '影响力杠杆': 'blue',
  '性格外向开朗': 'blue',   // 人际性格优势

  // ============================
  // 紫-人生天坑 (事件负面 + 行为暗坑)
  // ============================
  // 纯事件天坑（不可控/半可控的灾难）
  '意外继承': 'purple',
  '重大疾病': 'purple',
  '自然灾害': 'purple',
  '政策剧变': 'purple',
  '中彩票': 'purple',
  '家人突遭变故': 'purple',
  '金融风暴': 'purple',
  '战争动乱': 'purple',
  '裁员潮': 'purple',
  '全球疫情': 'purple',
  '资产泡沫破裂': 'purple',
  '身份被盗': 'purple',
  '创业失败': 'purple',
  '投资暴雷': 'purple',
  '交通事故': 'purple',
  '平台封号': 'purple',
  '货币贬值': 'purple',
  '数据泄露': 'purple',
  '意外怀孕': 'purple',
  '股灾': 'purple',
  '地震火灾损失': 'purple',
  '行业监管收紧': 'purple',
  '退休后政策风险': 'purple',
  '汇率剧烈波动': 'purple',
  '天降横祸': 'purple',
  '被公司收购': 'purple',
  '人工智能替代': 'purple',
  '移民政策突变': 'purple',
  '遗产纠纷': 'purple',
  '学术造假被发现': 'purple',
  '社会运动骚乱': 'purple',
  '能源危机': 'purple',
  '食品安全事故': 'purple',
  '隐私大规模泄露': 'purple',
  '房产被征收': 'purple',
  '子女教育意外': 'purple',
  '老龄化加速': 'purple',
  '法律纠纷': 'purple',
  '技术颠覆': 'purple',
  // 行为暗坑（可控的慢性消耗）
  '选错专业': 'purple',
  '入错行业': 'purple',
  '城市选择失误': 'purple',
  '上瘾行为': 'purple',
  '消费陷阱': 'purple',
  '信息茧房': 'purple',
  '拖延症': 'purple',
  '过度焦虑': 'purple',
  '过度依赖单一收入': 'purple',
  '自我设限': 'purple',
  '职场政治失败': 'purple',
  '过度负债': 'purple',
  '精神健康问题': 'purple',
  '缺乏紧急储蓄': 'purple',
  '无保险裸奔': 'purple',
  '忽视体检': 'purple',
  '冒名顶替综合征': 'purple',
  '过度完美主义': 'purple',
  '沉没成本陷阱': 'purple',
  '知识焦虑': 'purple',
  '过度工作倦怠': 'purple',
  '缺乏目标感': 'purple',
  '决策疲劳': 'purple',
  '缺乏复利意识': 'purple',
  '舒适区停滞': 'purple',
  '忽视软技能': 'purple',
  '缺乏财务知识': 'purple',
  '职业规划缺失': 'purple',
  '过度规划不行动': 'purple',
  '忽视心理健康': 'purple',
  '网络沉迷': 'purple',
  '负面自我对话': 'purple',
  '过度消费升级': 'purple',
  '职业倦怠无出口': 'purple',
  '忽视法律知识': 'purple',
  '情绪化消费': 'purple',
  '忽视体检报告异常': 'purple',
  '无第二技能': 'purple',
  '过度节俭不投资': 'purple',
  '忽视牙齿健康': 'purple',
  '缺乏写作能力': 'purple',
  '时间管理混乱': 'purple',
  '忽视知识产权': 'purple',
  '无遗嘱传承规划': 'purple',
  '手机依赖症': 'purple',
  '忽视口碑建设': 'purple',
  '过度依赖外卖快食': 'purple',
  '缺乏应急方案': 'purple',

  // ============================
  // 青-命运暗门 (事件正面 + 天赋 + 主动选择)
  // ============================
  // 先天/事件红利
  '出生在发达地区': 'cyan',
  '踩中技术浪潮': 'cyan',
  '基因天赋': 'cyan',
  '健康体质': 'cyan',
  '入学择校顺利': 'cyan',
  '出国留学': 'cyan',
  '买房时机': 'cyan',
  '副业变现': 'cyan',
  '行业红利期': 'cyan',
  '经济上行周期': 'cyan',
  '找到天赋领域': 'cyan',
  '抗挫折体质': 'cyan',
  '第一桶金': 'cyan',
  '时区优势': 'cyan',
  '天赋被识别': 'cyan',
  '关键时刻的选择': 'cyan',
  '免费的优质教育': 'cyan',
  '性别优势窗口': 'cyan',
  '出生顺序优势': 'cyan',
  '语言天赋': 'cyan',
  '容貌优势': 'cyan',
  '家庭财富基础': 'cyan',
  '直觉型决策力': 'cyan',
  '成长型思维': 'cyan',
  '情绪稳定性': 'cyan',
  '创造力天赋': 'cyan',
  '复利型思维': 'cyan',
  '高考发挥超常': 'cyan',
  '重要比赛获奖': 'cyan',
  '正确的第一份工作': 'cyan',
  '数字原生代优势': 'cyan',
  '双语家庭环境': 'cyan',
  '早慧与少年成名': 'cyan',
  '关键签证绿卡': 'cyan',
  '身体健康基因': 'cyan',
  '家族企业继承': 'cyan',
  '政府政策红利': 'cyan',
  '优质社区环境': 'cyan',
  '兄弟姐妹少负担轻': 'cyan',
  '义务教育质量好': 'cyan',
  '身体素质突出': 'cyan',
  '数学逻辑天赋': 'cyan',
  '艺术感知力': 'cyan',
  '商业直觉': 'cyan',
  '逆境中的转折机遇': 'cyan',
  '早期正反馈': 'cyan',
  '意外发现': 'cyan',
  '一次关键面试': 'cyan',
  '网络爆红': 'cyan',
  '突然获得社会关注': 'cyan',
  '突发性政策红利': 'cyan',
  '突然被提拔': 'cyan',
  // 习惯/技能（主动行为）
  '良好的阅读习惯': 'cyan',
  '运动习惯': 'cyan',
  '早期理财启蒙': 'cyan',
  '健康的睡眠习惯': 'cyan',
  // 主动选择/暗门
  '间隔年': 'cyan',
  '跨界转型': 'cyan',
  '留学后留下': 'cyan',
  '小众赛道': 'cyan',
  '写作输出': 'cyan',
  '开源贡献': 'cyan',
  '数据思维': 'cyan',
  '公众演讲': 'cyan',
  '冥想正念': 'cyan',
  '复盘习惯': 'cyan',
  '双语能力': 'cyan',
  '财务复利': 'cyan',
  '个人IP': 'cyan',
  '创业低谷反弹': 'cyan',
  '异国婚姻': 'cyan',
  '二次创业': 'cyan',
  '远程工作': 'cyan',
  '数字游民': 'cyan',
  '学会编程': 'cyan',
  '建立个人知识库': 'cyan',
  '被动收入构建': 'cyan',
  '海外资产配置': 'cyan',
  '业余写作出版': 'cyan',
  '天使投资': 'cyan',
  '退休规划前置': 'cyan',
  'AI工具精通': 'cyan',
  '设计思维': 'cyan',
  '视频创作能力': 'cyan',
  '系统思考': 'cyan',
  '自学方法论': 'cyan',
  '量化投资': 'cyan',
  '极简生活': 'cyan',
  '侧业思维': 'cyan',
  '内容创作': 'cyan',
  '时间套利': 'cyan',
  '地理套利': 'cyan',
  '注意力管理': 'cyan',
  '情绪套利': 'cyan',
  '第二大脑': 'cyan',
  '逆向工程': 'cyan',
  '习惯堆叠': 'cyan',
  '个人实验': 'cyan',
  '睡眠优化': 'cyan',
  '认知多样性': 'cyan',
  '身份多元化': 'cyan',
  '微小习惯': 'cyan',
  '决策日志': 'cyan',
  '价值投资思维': 'cyan',
  '反馈系统': 'cyan',
  '对标学习': 'cyan',
  '信息套利': 'cyan',
  '终身学习者心态': 'cyan',
};

// 生成重新映射后的数据
const remapped = raw.map(d => {
  const [id, name, cat, prob, imp, ctrl, desc, strat] = d;
  const newCat = remap[name] || cat;
  return [id, name, newCat, prob, imp, ctrl, desc, strat];
});

// 统计
const counts = { red: 0, purple: 0, blue: 0, cyan: 0 };
remapped.forEach(d => counts[d[2]]++);

console.log('Final category counts:');
console.log(`  红-人际吸血: ${counts.red}`);
console.log(`  紫-人生天坑: ${counts.purple}`);
console.log(`  蓝-人际杠杆: ${counts.blue}`);
console.log(`  青-命运暗门: ${counts.cyan}`);

// 检查未映射的节点
const unmapped = remapped.filter(d => !remap[d[1]]);
if (unmapped.length > 0) {
  console.log('\n⚠️ Unmapped nodes (keeping old category):');
  unmapped.forEach(d => console.log(`  ${d[1]}: ${d[2]}`));
}

// 输出
for (const cat of ['red', 'purple', 'blue', 'cyan']) {
  const names = remapped.filter(d => d[2] === cat).map(d => d[1]);
  console.log(`\n${cat} (${names.length}): ${names.join(', ')}`);
}

fs.writeFileSync(P('scripts/archive/luck-raw-remapped.json'), JSON.stringify(remapped, null, 2));
console.log('\nSaved');
