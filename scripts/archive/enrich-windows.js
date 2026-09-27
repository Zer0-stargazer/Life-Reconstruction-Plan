// 为所有窗口节点补充新字段：lockForceScore, remedyLevel, bestExecuteAge, executePhase, missType
const fs = require('fs');
const path = require('path');
// 项目根路径：本脚本位于 <root>/scripts/archive/，不依赖运行时的 cwd。
// （原脚本写死了扣子云端沙箱路径 /workspace/projects/...，本地无法运行）
const ROOT = path.resolve(__dirname, '..', '..');
const P = (p) => path.join(ROOT, p);
const content = fs.readFileSync(P('src/data/windows.ts'), 'utf8');

// 解析age范围获取中值
function parseAgeMid(age) {
  const parts = age.split('-');
  if (parts.length === 2) return (parseFloat(parts[0]) + parseFloat(parts[1])) / 2;
  const val = parseFloat(age);
  if (!isNaN(val)) return val;
  return 30;
}

// 根据age和status推断bestExecuteAge
function inferBestExecuteAge(w) {
  const age = w.age;
  const desc = w.description || '';
  const title = w.title || '';
  
  // 从description或title中提取更精确的窗口
  if (title.includes('视觉发育')) return '0-3个月';
  if (title.includes('母婴依恋')) return '0-6个月';
  if (title.includes('突触爆发')) return '0-8个月';
  if (title.includes('自主行走')) return '12-18个月';
  if (title.includes('语言爆发')) return '18-30个月';
  if (title.includes('第二语言') || title.includes('双语')) return '3-6岁';
  if (title.includes('身高冲刺')) return '12-14岁(女)/13-15岁(男)';
  if (title.includes('高考') || title.includes('大考')) return '17-18岁';
  if (title.includes('专业选择')) return '18岁高考志愿';
  if (title.includes('第一份工作') || title.includes('毕业就业')) return '21-23岁校招季';
  if (title.includes('购房') || title.includes('第一套房')) return '28-30岁(首付攒齐后)';
  if (title.includes('生育第一')) return '25-30岁(女)/28-35岁(男)';
  if (title.includes('体校选拔')) return '6-8岁';
  if (title.includes('音乐神童')) return '4-6岁开始';
  if (title.includes('竞赛选手')) return '14-17岁';
  if (title.includes('创业黄金')) return '22-25岁';
  if (title.includes('学术出道')) return '26-28岁';
  
  // 通用逻辑：取age范围的前1/3作为最佳执行期
  const parts = age.split('-');
  if (parts.length === 2) {
    const start = parseFloat(parts[0]);
    const end = parseFloat(parts[1]);
    if (!isNaN(start) && !isNaN(end)) {
      const span = end - start;
      const bestEnd = Math.round(start + span * 0.4);
      return `${start}-${bestEnd}岁`;
    }
  }
  return `${age}岁前期`;
}

// 根据tag和内容推断executePhase
function inferExecutePhase(w) {
  const tag = w.tag || '';
  const title = w.title || '';
  const desc = w.description || '';
  const age = w.age || '';
  const mid = parseAgeMid(age);
  
  if (mid < 3) return '被动接受期(父母主导)';
  if (mid < 6) return '引导体验期(父母引导+主动探索)';
  if (mid < 12) return '主动学习期(学校+家庭协同)';
  if (mid < 18) return '自主探索期(自我意识驱动)';
  if (mid < 25) return '试错验证期(低成本快速迭代)';
  if (mid < 35) return '全力执行期(资源+精力双高峰)';
  if (mid < 50) return '深耕巩固期(经验变现+防范风险)';
  if (mid < 65) return '转型传承期(输出为主+降低消耗)';
  return '整合接纳期(精神追求为主)';
}

// 根据lockedForce和内容推断lockForceScore (1-5)
function inferLockForceScore(w) {
  const lf = (w.lockedForce || '').toLowerCase();
  const desc = (w.description || '').toLowerCase();
  const title = (w.title || '').toLowerCase();
  
  let score = 3; // 默认中等
  
  // 强锁死关键词
  if (lf.includes('不可逆') || lf.includes('关闭') || desc.includes('不可逆') || desc.includes('错过不可逆')) score = 5;
  else if (lf.includes('极难改') || lf.includes('极难') || lf.includes('几乎不可能') || desc.includes('无法弥补')) score = 5;
  else if (lf.includes('双重约束') || lf.includes('硬性规定') || lf.includes('年龄限制')) score = 5;
  else if (lf.includes('难改变') || lf.includes('难改') || lf.includes('固化')) score = 4;
  else if (lf.includes('强制') || lf.includes('必须') || lf.includes('无法回避')) score = 4;
  else if (lf.includes('肌肉记忆') || lf.includes('习惯') && lf.includes('极难')) score = 4;
  else if (lf.includes('习惯') || lf.includes('自我强化') || lf.includes('自然衰减')) score = 3;
  else if (lf.includes('可重塑') || lf.includes('可训练') || lf.includes('可改变')) score = 2;
  else if (lf.includes('当前活跃') || lf.includes('尚未开启') || lf.includes('仍有机会')) score = 2;
  
  // 特殊加分
  if (title.includes('突触爆发') || title.includes('视觉发育') || title.includes('母婴依恋')) score = 5;
  if (title.includes('语言爆发') || title.includes('感统整合') || title.includes('第二语言窗口')) score = 5;
  if (title.includes('身高冲刺') || title.includes('体校选拔') || title.includes('音乐神童')) score = 5;
  if (title.includes('竞赛选手') || title.includes('高考') || title.includes('名校')) score = 5;
  if (title.includes('创业黄金期') || title.includes('校招') || title.includes('投行')) score = 4;
  if (title.includes('投资') && (title.includes('启蒙') || title.includes('体系'))) score = 3;
  
  // 精英窗口加1
  if (w.status === 'elite') score = Math.min(5, score + 1);
  
  return score;
}

// 根据remedyCost和内容推断remedyLevel
function inferRemedyLevel(w) {
  const rc = (w.remedyCost || '').toLowerCase();
  const lf = (w.lockedForce || '').toLowerCase();
  
  if (rc.includes('极高') || rc.includes('不可') || rc.includes('无法') || rc.includes('几乎不可能')) return 'irreversible';
  if (rc.includes('数年') || rc.includes('长期') || rc.includes('极难') || rc.includes('极高成本')) return 'extreme';
  if (rc.includes('困难') || rc.includes('2-3年') || rc.includes('2-5年') || rc.includes('代价高') || rc.includes('倍增')) return 'high';
  if (rc.includes('矫正') || rc.includes('修正') || rc.includes('需努力') || rc.includes('调整') || rc.includes('可降低')) return 'medium';
  if (rc.includes('仍有机会') || rc.includes('可补救') || rc.includes('较低') || rc.includes('容易')) return 'low';
  
  // 基于lockForceScore推算
  const score = inferLockForceScore(w);
  if (score >= 5) return 'irreversible';
  if (score >= 4) return 'extreme';
  if (score >= 3) return 'high';
  if (score >= 2) return 'medium';
  return 'low';
}

// 根据内容和status推断missType
function inferMissType(w) {
  const desc = (w.description || '').toLowerCase();
  const title = (w.title || '').toLowerCase();
  const lf = (w.lockedForce || '').toLowerCase();
  const rc = (w.remedyCost || '').toLowerCase();
  
  // permanent: 窗口永久关闭，无法弥补
  if (lf.includes('不可逆') || rc.includes('不可') || desc.includes('不可逆')) return 'permanent';
  if (title.includes('视觉发育') || title.includes('突触爆发') || title.includes('身高冲刺')) return 'permanent';
  if (title.includes('体校选拔') || title.includes('音乐神童') || title.includes('双语习得')) return 'permanent';
  if (lf.includes('关闭') || lf.includes('双重约束') || rc.includes('极高')) return 'permanent';
  
  // delayed: 延迟弥补，需要数年时间
  if (rc.includes('数年') || rc.includes('长期') || rc.includes('2-3年') || rc.includes('2-5年')) return 'delayed';
  if (title.includes('技能') || title.includes('习惯')) return 'delayed';
  
  // degraded: 可弥补但效果大打折扣
  if (rc.includes('上限') || rc.includes('天花板') || rc.includes('受限') || rc.includes('降低')) return 'degraded';
  if (title.includes('语言') || title.includes('数学') || title.includes('阅读')) return 'degraded';
  
  // narrowed: 错过后选择变窄
  if (rc.includes('窄') || rc.includes('限制') || rc.includes('减少') || rc.includes('变窄')) return 'narrowed';
  if (title.includes('窗口') || title.includes('机会')) return 'narrowed';
  
  // costly: 可弥补但代价极高
  if (rc.includes('代价') || rc.includes('成本高') || rc.includes('倍增') || rc.includes('更贵')) return 'costly';
  
  // 默认
  const score = inferLockForceScore(w);
  if (score >= 5) return 'permanent';
  if (score >= 4) return 'delayed';
  if (score >= 3) return 'degraded';
  return 'costly';
}

// 使用正则匹配每个节点并添加新字段
let result = content;

// 匹配节点模式: { id: N, age: '...', title: '...', description: '...', status: '...', tag: '...', lockedForce: '...', remedyCost: '...', planningStatus: '...', completionStatus: '...' }
const nodePattern = /\{ id: (\d+), age: '((?:[^'\\]|\\.)*)', title: '((?:[^'\\]|\\.)*)', description: '((?:[^'\\]|\\.)*)', status: '((?:[^'\\]|\\.)*)'(?:, tag: '((?:[^'\\]|\\.)*)')?, lockedForce: '((?:[^'\\]|\\.)*)', remedyCost: '((?:[^'\\]|\\.)*)', planningStatus: '((?:[^'\\]|\\.)*)', completionStatus: '((?:[^'\\]|\\.)*)' \}/g;

let match;
let replacements = [];
let count = 0;

while ((match = nodePattern.exec(content)) !== null) {
  const w = {
    id: parseInt(match[1]),
    age: match[2],
    title: match[3],
    description: match[4],
    status: match[5],
    tag: match[6] || '',
    lockedForce: match[7],
    remedyCost: match[8],
    planningStatus: match[9],
    completionStatus: match[10],
  };
  
  const lockForceScore = inferLockForceScore(w);
  const remedyLevel = inferRemedyLevel(w);
  const bestExecuteAge = inferBestExecuteAge(w);
  const executePhase = inferExecutePhase(w);
  const missType = inferMissType(w);
  
  // 在 completionStatus 后面插入新字段
  const original = match[0];
  const newStr = original.replace(
    /completionStatus: '((?:[^'\\]|\\.)*)' \}/,
    `completionStatus: '${w.completionStatus}', lockForceScore: ${lockForceScore}, remedyLevel: '${remedyLevel}', bestExecuteAge: '${bestExecuteAge}', executePhase: '${executePhase}', missType: '${missType}' }`
  );
  
  replacements.push({ original, newStr });
  count++;
}

// 按从后往前替换，避免偏移
for (let i = replacements.length - 1; i >= 0; i--) {
  result = result.replace(replacements[i].original, replacements[i].newStr);
}

// 同时更新已存在的 lockedForce 和 remedyCost 字段（之前是可选的，现在必须）
// 这些字段已经存在，不需要修改

fs.writeFileSync(P('src/data/windows.ts'), result);
console.log(`Updated ${count} window nodes with new fields`);

// 验证
const verifyContent = fs.readFileSync(P('src/data/windows.ts'), 'utf8');
const lockForceScoreCount = (verifyContent.match(/lockForceScore:/g) || []).length;
const remedyLevelCount = (verifyContent.match(/remedyLevel:/g) || []).length;
const bestExecuteAgeCount = (verifyContent.match(/bestExecuteAge:/g) || []).length;
const executePhaseCount = (verifyContent.match(/executePhase:/g) || []).length;
const missTypeCount = (verifyContent.match(/missType:/g) || []).length;
console.log(`Verification: lockForceScore=${lockForceScoreCount}, remedyLevel=${remedyLevelCount}, bestExecuteAge=${bestExecuteAgeCount}, executePhase=${executePhaseCount}, missType=${missTypeCount}`);
