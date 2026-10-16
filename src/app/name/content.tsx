'use client';

import { scrollToEl } from '@/lib/motion';
import { AuthorNote } from '@/components/shared/author-note';
import { STORAGE_KEYS } from '@/lib/storage-keys';
import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { usePersistedState } from '@/hooks/use-persisted-state';
import { ModulePageHead } from '@/components/shared/module-page-head';
import { Sparkles, RotateCcw, Copy, Check, Star, Zap, X } from 'lucide-react';

const surnamePool = ['林', '陈', '李', '张', '王', '赵', '周', '吴', '郑', '孙', '钱', '沈', '韩', '杨', '朱', '许', '何', '吕', '范', '彭', '曹', '袁', '萧', '田', '董', '潘', '蔡', '戴', '余', '叶', '苏', '魏', '程', '方', '石', '姚', '谭', '廖', '邹', '熊'];

// 百家姓前100（常用姓氏快速选择）
const topSurnames = [
  '赵','钱','孙','李','周','吴','郑','王','冯','陈',
  '褚','卫','蒋','沈','韩','杨','朱','秦','尤','许',
  '何','吕','施','张','孔','曹','严','华','金','魏',
  '陶','姜','戚','谢','邹','喻','柏','水','窦','章',
  '云','苏','潘','葛','奚','范','彭','郎','鲁','韦',
  '昌','马','苗','凤','花','方','俞','任','袁','柳',
  '酆','鲍','史','唐','费','廉','岑','薛','雷','贺',
  '倪','汤','滕','殷','罗','毕','郝','邬','安','常',
  '乐','于','时','傅','皮','卞','齐','康','伍','余',
  '元','卜','顾','孟','平','黄','和','穆','萧','尹',
];

const nameStyles = [
  { value: 'classic', label: '古典', desc: '诗经楚辞风', icon: '📜' },
  { value: 'modern', label: '现代', desc: '简洁国际化', icon: '✦' },
  { value: 'nature', label: '自然', desc: '山水风物', icon: '⛰' },
  { value: 'strength', label: '力量', desc: '刚健掷地有声', icon: '⚔' },
  { value: 'poetic', label: '诗意', desc: '如梦如幻', icon: '☽' },
  { value: 'minimal', label: '极简', desc: '一字一名', icon: '一' },
];

type Tone = '阴平' | '阳平' | '上声' | '去声';

// 音：声调起伏的描述（音高走向）
const TONE_CONTOUR: Record<Tone, string> = {
  阴平: '高平 →',
  阳平: '中升 ↗',
  上声: '降升 ↘↗',
  去声: '全降 ↘',
};

interface CharEntry {
  ch: string;
  tone: Tone;
  form: string;    // 形：字的结构
  meaning: string; // 义：字义（人工精选，不含“了、已、也、上、下、左、右、二、三、未”）
}

// 人工精选字池：按风格分组，每个字都带声调、结构、字义
const charPool: Record<string, CharEntry[]> = {
  classic: [
    { ch: '若', tone: '阳平', form: '上下结构', meaning: '好像，如同' },
    { ch: '兮', tone: '阴平', form: '独体字', meaning: '楚辞中的语气词' },
    { ch: '雅', tone: '上声', form: '左右结构', meaning: '文雅，不俗' },
    { ch: '清', tone: '阴平', form: '左右结构', meaning: '水澄澈，不浊' },
    { ch: '素', tone: '去声', form: '上下结构', meaning: '本色，不加修饰' },
    { ch: '知', tone: '阴平', form: '左右结构', meaning: '懂得，明白' },
    { ch: '思', tone: '阴平', form: '上下结构', meaning: '思考，念想' },
    { ch: '怀', tone: '阳平', form: '左右结构', meaning: '胸怀，心中所念' },
  ],
  modern: [
    { ch: '子', tone: '上声', form: '独体字', meaning: '孩子，指有德才的人' },
    { ch: '安', tone: '阴平', form: '上下结构', meaning: '平静，安稳' },
    { ch: '初', tone: '阴平', form: '左右结构', meaning: '开始，起头' },
    { ch: '元', tone: '阳平', form: '独体字', meaning: '开始，根本' },
    { ch: '正', tone: '去声', form: '独体字', meaning: '不偏斜，合乎标准' },
    { ch: '平', tone: '阳平', form: '独体字', meaning: '平坦，平静' },
    { ch: '和', tone: '阳平', form: '左右结构', meaning: '和谐，平稳' },
  ],
  nature: [
    { ch: '溪', tone: '阴平', form: '左右结构', meaning: '山间的小河' },
    { ch: '岚', tone: '阳平', form: '左右结构', meaning: '山间的雾气' },
    { ch: '岳', tone: '去声', form: '上下结构', meaning: '高大的山' },
    { ch: '霖', tone: '阳平', form: '上下结构', meaning: '连绵的雨' },
    { ch: '沐', tone: '去声', form: '左右结构', meaning: '受水润泽，蒙受恩泽' },
    { ch: '枫', tone: '阴平', form: '左右结构', meaning: '枫树，秋天叶会变红' },
    { ch: '澄', tone: '阳平', form: '左右结构', meaning: '水清而不浑' },
    { ch: '霜', tone: '阴平', form: '上下结构', meaning: '秋冬的白色结晶' },
    { ch: '旭', tone: '去声', form: '左右结构', meaning: '初升的太阳' },
    { ch: '屿', tone: '上声', form: '左右结构', meaning: '海中的小岛' },
    { ch: '泉', tone: '阳平', form: '上下结构', meaning: '从地下涌出的水' },
    { ch: '萤', tone: '阳平', form: '上下结构', meaning: '萤火虫，夏夜的微光' },
  ],
  strength: [
    { ch: '锋', tone: '阴平', form: '左右结构', meaning: '刀剑的尖端' },
    { ch: '坚', tone: '阴平', form: '上下结构', meaning: '结实，不易动摇' },
    { ch: '铭', tone: '阳平', form: '左右结构', meaning: '刻在器物上，记在心里' },
    { ch: '磊', tone: '上声', form: '品字结构', meaning: '石头堆叠，光明磊落' },
    { ch: '鹏', tone: '阳平', form: '左右结构', meaning: '大鹏，传说中的大鸟' },
    { ch: '凌', tone: '阳平', form: '左右结构', meaning: '升高，超越' },
    { ch: '刚', tone: '阴平', form: '左右结构', meaning: '坚硬，有骨气' },
    { ch: '铸', tone: '去声', form: '左右结构', meaning: '熔化金属做成器物' },
    { ch: '镇', tone: '去声', form: '左右结构', meaning: '压住，安定' },
    { ch: '策', tone: '去声', form: '上下结构', meaning: '谋划，计策' },
  ],
  poetic: [
    { ch: '烟', tone: '阴平', form: '左右结构', meaning: '雾气，如轻纱' },
    { ch: '月', tone: '去声', form: '独体字', meaning: '月亮' },
    { ch: '云', tone: '阳平', form: '独体字', meaning: '天上的云' },
    { ch: '琴', tone: '阳平', form: '上下结构', meaning: '古琴，乐器' },
    { ch: '歌', tone: '阴平', form: '左右结构', meaning: '唱，歌曲' },
    { ch: '诗', tone: '阴平', form: '左右结构', meaning: '诗歌' },
    { ch: '韵', tone: '去声', form: '左右结构', meaning: '声律悦耳，韵味' },
  ],
  minimal: [
    { ch: '白', tone: '阳平', form: '独体字', meaning: '白色，纯粹' },
    { ch: '玄', tone: '阳平', form: '独体字', meaning: '深黑色，深远' },
    { ch: '空', tone: '阴平', form: '上下结构', meaning: '空灵，无所执' },
    { ch: '无', tone: '阳平', form: '独体字', meaning: '没有，无所牵绊' },
    { ch: '真', tone: '阴平', form: '上下结构', meaning: '真实，不虚假' },
    { ch: '明', tone: '阳平', form: '左右结构', meaning: '光亮，明白' },
    { ch: '静', tone: '去声', form: '左右结构', meaning: '安静，不躁' },
    { ch: '远', tone: '上声', form: '半包围结构', meaning: '距离长，志向高' },
  ],
};

// 第二字：男女倾向池（70% 概率取，兼顾性别感），另有通用池兜底
const genderCharPool: Record<string, CharEntry[]> = {
  male: [
    { ch: '轩', tone: '阴平', form: '左右结构', meaning: '气宇轩昂' },
    { ch: '宇', tone: '上声', form: '上下结构', meaning: '屋檐，天地空间' },
    { ch: '辰', tone: '阳平', form: '独体字', meaning: '时辰，星辰' },
    { ch: '昊', tone: '去声', form: '左右结构', meaning: '广大，天空' },
    { ch: '翔', tone: '阳平', form: '左右结构', meaning: '盘旋飞行' },
    { ch: '煜', tone: '去声', form: '左右结构', meaning: '明亮，光辉' },
    { ch: '泽', tone: '阳平', form: '左右结构', meaning: '恩惠，水草丰美' },
    { ch: '瑞', tone: '去声', form: '左右结构', meaning: '吉祥的征兆' },
    { ch: '诚', tone: '阳平', form: '左右结构', meaning: '真诚，不欺' },
    { ch: '钧', tone: '阴平', form: '左右结构', meaning: '分量重，有担当' },
  ],
  female: [
    { ch: '瑶', tone: '阳平', form: '左右结构', meaning: '美玉' },
    { ch: '琳', tone: '阳平', form: '左右结构', meaning: '美玉' },
    { ch: '妍', tone: '阳平', form: '左右结构', meaning: '美丽，秀雅' },
    { ch: '欣', tone: '阴平', form: '左右结构', meaning: '喜悦' },
    { ch: '悦', tone: '去声', form: '左右结构', meaning: '高兴，喜欢' },
    { ch: '慧', tone: '去声', form: '上下结构', meaning: '聪明，有智谋' },
    { ch: '婉', tone: '上声', form: '左右结构', meaning: '柔和，委婉' },
    { ch: '莹', tone: '阳平', form: '上下结构', meaning: '光洁明亮' },
    { ch: '晴', tone: '阳平', form: '左右结构', meaning: '晴朗，无云' },
    { ch: '婷', tone: '阳平', form: '左右结构', meaning: '姿态美好' },
  ],
};

const sharedCharPool: CharEntry[] = [
  { ch: '晨', tone: '阳平', form: '左右结构', meaning: '早晨' },
  { ch: '曦', tone: '阴平', form: '左右结构', meaning: '阳光' },
  { ch: '瑜', tone: '阳平', form: '左右结构', meaning: '美玉' },
  { ch: '晖', tone: '阴平', form: '左右结构', meaning: '阳光' },
];

interface GeneratedName {
  name: string;
  surname: string;
  given: string;
  style: string;
  chars: CharEntry[];
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateName(gender: string, style: string, fixedSurname?: string): GeneratedName {
  const surname = fixedSurname || pick(surnamePool);
  const isDouble = style === 'minimal' ? false : Math.random() > 0.35;

  const char1 = pick(charPool[style] || charPool.classic);
  const gPool = genderCharPool[gender];
  const char2 = gPool && Math.random() < 0.7 ? pick(gPool) : pick(sharedCharPool);

  const chars = isDouble ? [char1, char2] : [char1];
  const given = chars.map(c => c.ch).join('');

  return { name: surname + given, surname, given, style, chars };
}

export default function NamePage() {
  // 表单输入持久化：刷新后保留（原来是纯 useState，刷新即丢）
  const [gender, setGender] = usePersistedState<'male' | 'female'>(STORAGE_KEYS.nameGender, 'male');
  const [style, setStyle] = usePersistedState(STORAGE_KEYS.nameStyle, 'classic');
  const [surnameInput, setSurnameInput] = usePersistedState(STORAGE_KEYS.nameSurname, '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedResults, setDisplayedResults] = useState<GeneratedName[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [displayedChars, setDisplayedChars] = useState<Record<number, string>>({});
  const resultsRef = useRef<HTMLDivElement>(null);
  const typeIntervalsRef = useRef<ReturnType<typeof setInterval>[]>([]);
  const timeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // 卸载时清掉所有打字机 timeout / interval，避免对已卸载组件 setState
  useEffect(() => () => {
    timeoutsRef.current.forEach(clearTimeout);
    typeIntervalsRef.current.forEach(clearInterval);
  }, []);

  const handleGenerate = useCallback(() => {
    // 清掉上一轮可能还在跑的打字机 interval，避免旧结果污染新输出
    typeIntervalsRef.current.forEach(clearInterval);
    typeIntervalsRef.current = [];
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsGenerating(true);
    setDisplayedResults([]);
    setDisplayedChars({});

    // 取用户输入的姓氏（支持复姓，输入框限 2 字），为空则随机
    const fixedSurname = surnameInput.trim() || undefined;

    timeoutsRef.current.push(setTimeout(() => {
      const newResults: GeneratedName[] = [];
      for (let i = 0; i < 3; i++) {
        newResults.push(generateName(gender, style, fixedSurname));
      }
      setIsGenerating(false);

      // Typewriter effect: show one by one with character animation
      newResults.forEach((r, i) => {
        timeoutsRef.current.push(setTimeout(() => {
          setDisplayedResults(prev => [...prev, r]);
          // Typewriter for the name itself
          let charIdx = 0;
          const nameChars = r.name.split('');
          const typeInterval = setInterval(() => {
            if (charIdx < nameChars.length) {
              setDisplayedChars(prev => ({
                ...prev,
                [i]: nameChars.slice(0, charIdx + 1).join(''),
              }));
              charIdx++;
            } else {
              clearInterval(typeInterval);
            }
          }, 80);
          typeIntervalsRef.current.push(typeInterval);
        }, i * 300));
      });
    }, 500));
  }, [gender, style, surnameInput]);

  useEffect(() => {
    if (displayedResults.length > 0 && resultsRef.current) {
      scrollToEl(resultsRef.current, { offset: 64 });
    }
  }, [displayedResults.length]);

  // P0：卸载时清掉可能还在跑的打字机 interval（生成中切页时防 setState 泄漏）
  useEffect(() => () => {
    typeIntervalsRef.current.forEach(clearInterval);
    typeIntervalsRef.current = [];
  }, []);

  const handleCopy = async (name: string, idx: number) => {
    await navigator.clipboard.writeText(name);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header —— 编号/图标/提问统一从 module-identity 取 */}
      <ModulePageHead
        href="/name"
        title="起名灵感"
        desc="名字是别人对你的第一印象，也是你对自己的第一次定义。一个好名字不是迷信——它是心理学、社会学和传播学的交叉产物。"
        width="4xl"
      />

      <div className="max-w-6xl 2xl:max-w-[1400px] mx-auto px-6 sm:px-8 py-8">
        {/* Configuration */}
        <div className="space-y-6 mb-8">
          {/* Gender */}
          <div className="animate-fade-in-up stagger-2">
            <span id="name-gender-label" className="text-sm font-semibold text-foreground mb-3 block">性别</span>
            <div role="group" aria-labelledby="name-gender-label" className="flex gap-3">
              {[
                { value: 'male' as const, label: '男' },
                { value: 'female' as const, label: '女' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setGender(opt.value)}
                  aria-pressed={gender === opt.value}
                  className={cn(
                    'rounded-md border px-6 py-2.5 text-sm font-medium btn-press',
                    gender === opt.value
                      ? 'border-primary bg-primary/10 text-primary shadow-sm'
                      : 'border-border text-muted-foreground hover:bg-accent'
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Surname */}
          <div className="animate-fade-in-up stagger-2">
            <label htmlFor="name-surname" className="text-sm font-semibold text-foreground mb-3 block">姓氏</label>
            <div className="flex items-center gap-3 mb-3">
              <input
                id="name-surname"
                type="text"
                value={surnameInput}
                onChange={(e) => setSurnameInput(e.target.value.slice(0, 2))}
                placeholder="输入你的姓氏，留空则随机"
                className="w-48 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus-visible:border-ring transition-[color,border-color,box-shadow]"
              />
              {surnameInput && (
                <button
                  onClick={() => setSurnameInput('')}
                  aria-label="清空姓氏"
                  className="h-9 w-9 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
              {!surnameInput && (
                <span className="text-[11px] text-muted-foreground/70">留空将随机生成姓氏</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topSurnames.map(s => (
                <button
                  key={s}
                  onClick={() => setSurnameInput(s)}
                  className={cn(
                    'rounded-sm px-1.5 py-0.5 text-xs font-medium transition-colors',
                    surnameInput === s
                      ? 'bg-primary/10 text-primary shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Style */}
          <div className="animate-fade-in-up stagger-3">
            <span id="name-style-label" className="text-sm font-semibold text-foreground mb-3 block">风格</span>
            <div role="group" aria-labelledby="name-style-label" className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {nameStyles.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  aria-pressed={style === s.value}
                  className={cn(
                    'rounded-lg border p-3 text-left btn-press',
                    style === s.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm" aria-hidden="true">{s.icon}</span>
                    <span className={cn(
                      'text-sm font-semibold block',
                      style === s.value ? 'text-primary' : 'text-foreground'
                    )}>
                      {s.label}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{s.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <div className="animate-fade-in-up stagger-4">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={cn(
                'inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium btn-press',
                isGenerating
                  ? 'bg-muted text-muted-foreground cursor-wait'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              )}
            >
              {isGenerating ? (
                <>
                  <RotateCcw className="h-4 w-4 animate-spin" />
                  生成中...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  生成名字
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {displayedResults.length > 0 && (
          <div ref={resultsRef} className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground">起名灵感</h2>
            {displayedResults.map((result, idx) => (
              <div
                key={`${result.name}-${idx}`}
                className="rounded-lg border border-border bg-card p-5 transition-[color,background-color,border-color,box-shadow] animate-fade-in-up"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-serif font-bold text-foreground">
                      {displayedChars[idx] || ''}
                      {displayedChars[idx] && displayedChars[idx].length < result.name.length && (
                        <span className="animate-pulse text-primary">|</span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nameStyles.find(s => s.value === result.style)?.label}风格
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopy(result.name, idx)}
                    className={cn(
                      'p-1.5 rounded-md transition-colors',
                      copiedIdx === idx
                        ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    )}
                    title="复制名字"
                  >
                    {copiedIdx === idx ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {/* 音 / 形 / 义：仅三行 */}
                <div className="space-y-1.5 text-xs leading-relaxed">
                  <div className="flex gap-3">
                    <span className="w-4 shrink-0 font-semibold text-foreground">音</span>
                    <span className="text-muted-foreground">
                      {result.chars.map(c => `${c.tone}（${TONE_CONTOUR[c.tone]}）`).join(' · ')}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-4 shrink-0 font-semibold text-foreground">形</span>
                    <span className="text-muted-foreground">
                      {result.chars.map(c => c.form).join(' · ')}
                    </span>
                  </div>
                  <div className="flex gap-3">
                    <span className="w-4 shrink-0 font-semibold text-foreground">义</span>
                    <span className="text-muted-foreground">
                      {result.chars.map(c => `${c.ch}：${c.meaning}`).join(' · ')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Insights */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-foreground mb-4">名字的隐性力量</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs leading-relaxed">
            {[
              { term: '首因效应', en: 'FIRST IMPRESSION', text: '名字是别人认识你的第一个信号。', icon: <Zap className="h-3.5 w-3.5" />, tone: 'border-amber-500/25 bg-amber-500/[0.05] text-amber-600 dark:text-amber-400' },
              { term: '自我实现预言', en: 'SELF-FULFILLING', text: '名字会潜移默化地影响自我认知。叫坚强的人更容易表现出坚韧，叫雅静的人更容易内省。', icon: <Star className="h-3.5 w-3.5" />, tone: 'border-violet-500/25 bg-violet-500/[0.05] text-violet-600 dark:text-violet-400' },
              { term: '记忆锚点', en: 'MEMORY ANCHOR', text: '在信息过载的时代，一个容易记住的名字就是竞争优势。简洁、独特、有画面感的名字，传播成本最低。', icon: <Sparkles className="h-3.5 w-3.5" />, tone: 'border-sky-500/25 bg-sky-500/[0.05] text-sky-600 dark:text-sky-400' },
            ].map((insight) => (
              <div key={insight.en} className={cn('rounded-lg border p-4', insight.tone)}>
                <div className="flex items-center gap-2">
                  {insight.icon}
                  <span className="text-[11px] tracking-[0.18em] opacity-80">{insight.en}</span>
                </div>
                <p className="mt-2 font-semibold text-foreground">{insight.term}</p>
                <p className="mt-1 text-muted-foreground">{insight.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <AuthorNote module="name" />
    </div>
  );
}
