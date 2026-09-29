'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { cn } from '@/lib/utils';
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

const charPool: Record<string, string[]> = {
  classic: ['之', '若', '兮', '如', '予', '亦', '尔', '以', '其', '斯', '言', '思', '雅', '清', '如', '怀', '素', '知', '言', '予'],
  modern: ['一', '子', '可', '安', '然', '之', '若', '予', '了', '由', '也', '已', '凡', '未', '予', '初', '元', '正', '平', '和'],
  nature: ['溪', '岚', '岳', '霖', '沐', '枫', '桐', '澜', '澄', '霜', '旭', '岚', '潮', '屿', '谷', '崖', '渊', '泉', '萤', '雁'],
  strength: ['锋', '坚', '铭', '铮', '磊', '鹏', '啸', '凌', '毅', '刚', '威', '震', '铸', '砺', '钧', '镇', '乾', '坤', '策', '略'],
  poetic: ['梦', '烟', '霜', '月', '云', '风', '影', '笛', '琴', '歌', '语', '诗', '画', '韵', '弦', '吟', '咏', '赋', '辞', '章'],
  minimal: ['一', '二', '三', '白', '玄', '素', '空', '无', '真', '虚', '明', '静', '清', '远', '深', '高', '上', '下', '左', '右'],
};

const secondCharPool = ['瑞', '泽', '晨', '曦', '岚', '瑜', '琳', '瑶', '琪', '轩', '逸', '辰', '昊', '宇', '翔', '然', '晖', '煜', '嘉', '慧', '思', '雅', '文', '博', '明', '远', '清', '晗', '妍', '欣', '悦', '宁', '和', '谦', '诚'];

interface GeneratedName {
  name: string;
  surname: string;
  given: string;
  style: string;
  analysis: string;
  score: number;
  dimensions: { label: string; value: number }[];
}

function generateName(gender: string, style: string, fixedSurname?: string): GeneratedName {
  const surname = fixedSurname || surnamePool[Math.floor(Math.random() * surnamePool.length)];
  const isDouble = style === 'minimal' ? false : Math.random() > 0.35;

  const pool = charPool[style] || charPool.classic;
  const char1 = pool[Math.floor(Math.random() * pool.length)];
  const char2 = secondCharPool[Math.floor(Math.random() * secondCharPool.length)];
  const given = isDouble ? char1 + char2 : char1;
  const name = surname + given;

  const analyses: Record<string, string[]> = {
    classic: [
      `「${given}」取自古典雅韵，暗含文化底蕴。端庄而不失灵动，兼具书卷气与时代感。读音平仄相间，朗朗上口。`,
      `「${given}」源出诗词意境，兼具音律之美与意蕴之深。如一盏清茶，初见平淡，细品有味。`,
    ],
    modern: [
      `「${given}」极简现代，笔画利落。在信息过载的时代，简洁就是力量——3秒内被记住，10年后也不过时。`,
      `「${given}」符合当代审美：少即是多。国际化发音友好，视觉上干净清爽。`,
    ],
    nature: [
      `「${given}」融入自然意象，天人合一。自带画面感，听者如临其境，人与自然和谐共生。`,
      `「${given}」取意山川风物，有天人感应的哲学内涵。让人联想到自然之美，宁静深远。`,
    ],
    strength: [
      `「${given}」刚健有力，掷地有声。自带气场，适合需要建立权威感的场合——名字就是你给人的第一印象。`,
      `「${given}」力量感十足，阳刚中正。在社交场合自带加分，容易获得信任与尊重。`,
    ],
    poetic: [
      `「${given}」诗意盎然，如梦如幻。此名自带文学气质，适合追求精神世界丰富的人。`,
      `「${given}」如一首小令，含蓄而优美。在平凡中见深意，在简单中见韵味。`,
    ],
    minimal: [
      `「${given}」极简至一字，大道至简。单字名在视觉和听觉上都有最强的辨识度，记忆成本最低。`,
      `「${given}」一字千钧。单字名的优势在于极简——越短的名字，传播效率越高。`,
    ],
  };

  const analysisArr = analyses[style] || analyses.classic;
  const analysis = analysisArr[Math.floor(Math.random() * analysisArr.length)];
  const score = Math.floor(Math.random() * 20) + 78;

  // Generate sub-dimensions
  const dimensions = [
    { label: '音律', value: Math.floor(Math.random() * 25) + 75 },
    { label: '意境', value: Math.floor(Math.random() * 25) + 75 },
    { label: '辨识度', value: Math.floor(Math.random() * 25) + 75 },
    { label: '传播力', value: Math.floor(Math.random() * 25) + 75 },
  ];

  return { name, surname, given, style, analysis, score, dimensions };
}

export default function NamePage() {
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [style, setStyle] = useState('classic');
  const [surnameInput, setSurnameInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [displayedResults, setDisplayedResults] = useState<GeneratedName[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [displayedChars, setDisplayedChars] = useState<Record<number, string>>({});
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGenerate = useCallback(() => {
    setIsGenerating(true);
    setDisplayedResults([]);
    setDisplayedChars({});

    // 取用户输入的姓氏（trim后取第一个字），为空则随机
    const fixedSurname = surnameInput.trim() ? surnameInput.trim().charAt(0) : undefined;

    setTimeout(() => {
      const newResults: GeneratedName[] = [];
      for (let i = 0; i < 3; i++) {
        newResults.push(generateName(gender, style, fixedSurname));
      }
      setIsGenerating(false);

      // Typewriter effect: show one by one with character animation
      newResults.forEach((r, i) => {
        setTimeout(() => {
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
        }, i * 300);
      });
    }, 500);
  }, [gender, style]);

  useEffect(() => {
    if (displayedResults.length > 0 && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [displayedResults.length]);

  const handleCopy = async (name: string, idx: number) => {
    await navigator.clipboard.writeText(name);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const getScoreColor = (score: number) => {
    if (score >= 92) return 'text-primary';
    if (score >= 85) return 'text-green-600 dark:text-green-400';
    return 'text-amber-600 dark:text-amber-400';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card grain-texture">
        <div className="relative max-w-3xl mx-auto px-6 sm:px-8 py-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
              <span className="font-mono text-[10px] tracking-[0.2em] text-primary/70 shrink-0">MODULE · 01</span>
              <span className="h-px flex-1 bg-border" />
              <span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">GENERATOR</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-foreground tracking-tight leading-tight mb-3 animate-fade-in-up stagger-1">名字：人生第一张牌</h1>
            <p className="text-sm text-muted-foreground max-w-xl leading-relaxed animate-fade-in-up stagger-2">
              名字是别人对你的第一印象，也是你对自己的第一次定义。
              一个好名字不是迷信——它是心理学、社会学和传播学的交叉产物。
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 sm:px-8 py-8">
        {/* Configuration */}
        <div className="space-y-6 mb-8">
          {/* Gender */}
          <div className="animate-fade-in-up stagger-2">
            <label className="text-sm font-semibold text-foreground mb-3 block">性别</label>
            <div className="flex gap-3">
              {[
                { value: 'male' as const, label: '男' },
                { value: 'female' as const, label: '女' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setGender(opt.value)}
                  className={cn(
                    'rounded-md border px-6 py-2.5 text-sm font-medium transition-all btn-press',
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
            <label className="text-sm font-semibold text-foreground mb-3 block">姓氏</label>
            <div className="flex items-center gap-3 mb-3">
              <input
                type="text"
                value={surnameInput}
                onChange={(e) => setSurnameInput(e.target.value.slice(0, 2))}
                placeholder="输入你的姓氏，留空则随机"
                className="w-48 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              {surnameInput && (
                <button
                  onClick={() => setSurnameInput('')}
                  className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
              {!surnameInput && (
                <span className="text-[10px] text-muted-foreground/50">留空将随机生成姓氏</span>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {topSurnames.map(s => (
                <button
                  key={s}
                  onClick={() => setSurnameInput(s)}
                  className={cn(
                    'rounded-sm px-1.5 py-0.5 text-xs font-medium transition-all',
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
            <label className="text-sm font-semibold text-foreground mb-3 block">风格</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {nameStyles.map(s => (
                <button
                  key={s.value}
                  onClick={() => setStyle(s.value)}
                  className={cn(
                    'rounded-lg border p-3 text-left transition-all btn-press',
                    style === s.value
                      ? 'border-primary bg-primary/5 shadow-sm'
                      : 'border-border hover:bg-accent'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{s.icon}</span>
                    <span className={cn(
                      'text-sm font-semibold block',
                      style === s.value ? 'text-primary' : 'text-foreground'
                    )}>
                      {s.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{s.desc}</span>
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
                'inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-medium transition-all active:scale-[0.98] btn-press',
                isGenerating
                  ? 'bg-muted text-muted-foreground cursor-wait'
                  : 'bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md'
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
            <h2 className="text-sm font-semibold text-foreground">生成结果</h2>
            {displayedResults.map((result, idx) => (
              <div
                key={`${result.name}-${idx}`}
                className="rounded-lg border border-border bg-card p-5 transition-all hover:shadow-md animate-fade-in-up"
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
                  <div className="flex items-center gap-3">
                    {/* Score display */}
                    <div className="flex items-center gap-1.5">
                      <Star className="h-3.5 w-3.5 text-primary/40" />
                      <span className={cn('text-sm font-mono font-semibold tabular-nums', getScoreColor(result.score))}>
                        {result.score}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopy(result.name, idx)}
                      className={cn(
                        'p-1.5 rounded-md transition-all',
                        copiedIdx === idx
                          ? 'bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                      )}
                      title="复制名字"
                    >
                      {copiedIdx === idx ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Score bar */}
                <div className="mb-3">
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary/40 transition-all duration-700 progress-shimmer"
                      style={{ width: `${result.score}%` }}
                    />
                  </div>
                </div>

                {/* Dimension scores */}
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {result.dimensions.map((dim, di) => (
                    <div key={di} className="text-center">
                      <div className="text-[10px] text-muted-foreground mb-0.5">{dim.label}</div>
                      <div className="text-xs font-mono font-semibold text-foreground tabular-nums">{dim.value}</div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 mb-3 text-xs text-muted-foreground">
                  <span>姓：{result.surname}</span>
                  <span>名：{result.given}</span>
                  <span>笔画：{result.given.length}字</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{result.analysis}</p>
              </div>
            ))}
          </div>
        )}

        {/* Insights */}
        <div className="mt-12 border-t border-border pt-8">
          <h2 className="text-sm font-semibold text-foreground mb-4">名字的隐性力量</h2>
          <div className="space-y-3 text-xs leading-relaxed">
            {[
              { term: '首因效应', text: '名字是别人认识你的第一个信号。研究显示，名字的好感度会影响面试通过率、社交接受度甚至法律判决。', icon: <Zap className="h-3.5 w-3.5 text-primary" /> },
              { term: '自我实现预言', text: '名字会潜移默化地影响自我认知。叫坚强的人更容易表现出坚韧，叫雅静的人更容易内省。', icon: <Star className="h-3.5 w-3.5 text-primary" /> },
              { term: '记忆锚点', text: '在信息过载的时代，一个容易记住的名字就是竞争优势。简洁、独特、有画面感的名字，传播成本最低。', icon: <Sparkles className="h-3.5 w-3.5 text-primary" /> },
            ].map((insight, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-md bg-muted/30">
                <div className="mt-0.5 shrink-0">{insight.icon}</div>
                <div>
                  <span className="text-foreground font-semibold">{insight.term}</span>
                  <span className="text-muted-foreground ml-1">{insight.text}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
