/**
 * 人生卡片：纯函数层（编号 / 计数 / 三项重点 / SVG 字符串）。
 *
 * 口径与 /me 完全一致（src/app/me/content.tsx 的 parseAgeRange + classify）：
 * - 年龄落在窗口区间内 → 开启；剩余年数 ≤ 5 且非「N+」→ 即将关闭（urgent）
 * - 「正在开启」计数 = open + urgent（含已表态的，即客观总数）；「即将关闭」= urgent
 * /me 里这两个函数是私有的且该文件不在本批改动范围，故此处原样镜像；改口径需两处同步。
 *
 * 卡片不含姓名 / 昵称：输入类型里根本没有这类字段。
 */

import { lifeWindows } from '@/data/windows';
import { WINDOW_DENSITY, type DensityBucket } from '@/data/window-density';

export const CARD_W = 1080;
export const CARD_H = 1350;

/* ---------- 窗口分类（镜像 /me） ---------- */

export function parseAgeRange(age: string): { start: number; end: number } {
  const trimmed = age.trim();
  if (trimmed.endsWith('+')) {
    const start = parseInt(trimmed, 10);
    return { start: Number.isNaN(start) ? 0 : start, end: 200 };
  }
  const parts = trimmed.split('-').map((n) => parseInt(n, 10));
  if (parts.length === 2 && !Number.isNaN(parts[0]) && !Number.isNaN(parts[1])) {
    return { start: parts[0], end: parts[1] };
  }
  const single = parts[0];
  return { start: Number.isNaN(single) ? 0 : single, end: Number.isNaN(single) ? 0 : single };
}

export type CardWindowState = 'open' | 'urgent' | 'missed' | 'future';

export interface ClassifiedLite {
  id: number;
  title: string;
  state: CardWindowState;
  yearsLeft?: number;
  lockForceScore: number;
}

export interface CardWindowInput {
  id: number;
  age: string;
  title: string;
  lockForceScore?: number;
}

export function classifyWindows(age: number, windows: readonly CardWindowInput[] = lifeWindows): ClassifiedLite[] {
  return windows.map((w) => {
    const range = parseAgeRange(w.age);
    let state: CardWindowState;
    let yearsLeft: number | undefined;
    if (age >= range.start && age <= range.end) {
      yearsLeft = range.end - age;
      state = range.end >= 200 || yearsLeft > 5 ? 'open' : 'urgent';
    } else if (range.end < age) {
      state = 'missed';
    } else {
      state = 'future';
    }
    return { id: w.id, title: w.title, state, yearsLeft, lockForceScore: w.lockForceScore ?? 0 };
  });
}

/** 开启 / 即将关闭 计数（与 /me 顶部读数同口径） */
export function countWindows(age: number, windows?: readonly CardWindowInput[]): { open: number; urgent: number } {
  const list = classifyWindows(age, windows);
  let open = 0;
  let urgent = 0;
  for (const w of list) {
    if (w.state === 'open' || w.state === 'urgent') open += 1;
    if (w.state === 'urgent') urgent += 1;
  }
  return { open, urgent };
}

/* ---------- 三项重点 ---------- */

function clip(text: string, max: number): string {
  const chars = Array.from(text.trim());
  return chars.length > max ? chars.slice(0, max - 1).join('') + '…' : chars.join('');
}

/**
 * 取前三：用户标记「正在做」的窗口 → 命运报告的下一个窗口 → 即将关闭里最紧急的
 * （剩余年数少者在前，同年按锁死力高者在前）。去重，最多 3 条。
 */
export function pickHighlights(opts: {
  age: number;
  doingTitles?: readonly string[];
  destinyNextWindow?: string | null;
  windows?: readonly CardWindowInput[];
}): string[] {
  const out: string[] = [];
  const push = (t: string | null | undefined) => {
    const s = (t ?? '').trim();
    if (!s || out.includes(s) || out.length >= 3) return;
    out.push(s);
  };
  for (const t of opts.doingTitles ?? []) push(t);
  push(opts.destinyNextWindow);
  if (out.length < 3) {
    const urgent = classifyWindows(opts.age, opts.windows)
      .filter((w) => w.state === 'urgent')
      .sort((a, b) => (a.yearsLeft ?? 99) - (b.yearsLeft ?? 99) || b.lockForceScore - a.lockForceScore || a.id - b.id);
    for (const w of urgent) push(w.title);
  }
  return out.slice(0, 3);
}

/* ---------- 编号 / 日期 ---------- */

const pad2 = (n: number) => String(n).padStart(2, '0');

export function formatYmd(d: Date): string {
  return `${d.getFullYear()}${pad2(d.getMonth() + 1)}${pad2(d.getDate())}`;
}

/** FNV-1a 32 位，取 4 位大写十六进制 */
export function hash4(input: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return (h & 0xffff).toString(16).toUpperCase().padStart(4, '0');
}

/** 编号：NO.{yyyymmdd}-{hash4}；hash 由日期 + 年龄 + 两个计数决定，同一状态同一天编号稳定 */
export function lifeCardNumber(date: Date, age: number, open: number, urgent: number): string {
  const ymd = formatYmd(date);
  return `NO.${ymd}-${hash4(`${ymd}|${age}|${open}|${urgent}`)}`;
}

/* ---------- SVG ---------- */

export interface LifeCardData {
  age: number;
  open: number;
  urgent: number;
  highlights: string[];
  date: Date;
  host: string;
  /** 内嵌字体族（CSS font-family 值） */
  serifFamily?: string;
  monoFamily?: string;
  density?: readonly DensityBucket[];
}

export const CARD_COLORS = {
  paper: '#f7f3ea',
  ink: '#1f1b16',
  primary: '#b2392b',
  accent: '#2f5d62',
} as const;

const DEFAULT_SERIF = '"Noto Serif SC","Songti SC","STSong","SimSun","Source Han Serif SC",serif';
const DEFAULT_MONO = 'ui-monospace,Consolas,Menlo,monospace';

export function escapeXml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/** 把 font-family 值放进 XML 属性（内部双引号 → 单引号后转义） */
function fam(v: string): string {
  return escapeXml(v.replace(/"/g, "'"));
}

export function buildLifeCardSvg(data: LifeCardData): string {
  const { paper, ink, primary, accent } = CARD_COLORS;
  const serif = fam(data.serifFamily?.trim() ? `${data.serifFamily}, ${DEFAULT_SERIF}` : DEFAULT_SERIF);
  const mono = fam(data.monoFamily?.trim() || DEFAULT_MONO);
  const density = data.density ?? WINDOW_DENSITY;
  const age = Math.max(0, Math.min(100, Math.round(data.age)));
  const no = lifeCardNumber(data.date, age, data.open, data.urgent);
  const yyyy = String(data.date.getFullYear());
  const md = `${pad2(data.date.getMonth() + 1)}·${pad2(data.date.getDate())}`;

  const X0 = 80;
  const X1 = 1000;
  const axisY = 700;
  const xOf = (a: number) => X0 + ((X1 - X0) * a) / 100;
  const maxTotal = Math.max(1, ...density.map((b) => b.total));

  const bars = density
    .map((b) => {
      const h = Math.round((b.total / maxTotal) * 120);
      if (h <= 0) return '';
      const x = xOf(b.from) + 2;
      const w = xOf(b.to + 1) - xOf(b.from) - 4;
      const here = age >= b.from && age <= b.to;
      return `<rect x="${x.toFixed(1)}" y="${axisY - h}" width="${w.toFixed(1)}" height="${h}" fill="${here ? primary : ink}" fill-opacity="${here ? 0.28 : 0.13}"/>`;
    })
    .join('');

  let ticks = '';
  for (let a = 0; a <= 100; a += 10) {
    const x = xOf(a);
    ticks += `<line x1="${x}" y1="${axisY}" x2="${x}" y2="${axisY + 12}" stroke="${ink}" stroke-opacity="0.5" stroke-width="2"/>`;
    ticks += `<text x="${x}" y="${axisY + 40}" text-anchor="middle" font-family="${mono}" font-size="16" fill="${ink}" fill-opacity="0.55">${a}</text>`;
  }

  const nowX = xOf(age);
  const rows = data.highlights
    .slice(0, 3)
    .map((t, i) => {
      const y = 1040 + i * 64;
      return (
        `<text x="${X0}" y="${y}" font-family="${mono}" font-size="18" letter-spacing="3" fill="${primary}">0${i + 1}</text>` +
        `<text x="${X0 + 64}" y="${y + 2}" font-family="${serif}" font-size="30" font-weight="600" fill="${ink}">${escapeXml(clip(t, 13))}</text>` +
        `<line x1="${X0}" y1="${y + 22}" x2="640" y2="${y + 22}" stroke="${ink}" stroke-opacity="0.12" stroke-width="1"/>`
      );
    })
    .join('');

  const host = escapeXml(data.host || 'life-sandbox');

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CARD_W}" height="${CARD_H}" viewBox="0 0 ${CARD_W} ${CARD_H}">` +
    `<rect width="${CARD_W}" height="${CARD_H}" fill="${paper}"/>` +
    `<rect x="32" y="32" width="${CARD_W - 64}" height="${CARD_H - 64}" fill="none" stroke="${ink}" stroke-opacity="0.14" stroke-width="1"/>` +
    // L1 页眉：方印 + 标题 + 编号
    `<g id="lc-header">` +
    `<g transform="translate(${X0} 84) scale(1.4)"><rect width="40" height="40" rx="3" fill="${primary}"/>` +
    `<path d="M28.4 10.0 A13 13 0 1 1 13.5 8.7" fill="none" stroke="${paper}" stroke-width="1.5" stroke-linecap="round"/>` +
    `<circle cx="28.4" cy="10.0" r="1.6" fill="${paper}"/>` +
    `<rect x="15.2" y="14.2" width="9.6" height="5" fill="none" stroke="${paper}" stroke-width="1.3"/>` +
    `<rect x="13.4" y="20.6" width="13.2" height="5.4" fill="none" stroke="${paper}" stroke-width="1.3"/></g>` +
    `<text x="${X0 + 76}" y="116" font-family="${serif}" font-size="32" font-weight="700" fill="${ink}">人生沙盘</text>` +
    `<text x="${X0 + 76}" y="140" font-family="${mono}" font-size="14" letter-spacing="4" fill="${ink}" fill-opacity="0.6">LIFE SANDBOX · 人生卡片</text>` +
    `<text x="${X1}" y="116" text-anchor="end" font-family="${mono}" font-size="18" letter-spacing="3" fill="${ink}" fill-opacity="0.7">${escapeXml(no)}</text>` +
    `<line x1="${X0}" y1="186" x2="${X1}" y2="186" stroke="${ink}" stroke-opacity="0.2" stroke-width="1"/>` +
    `</g>` +
    // L2 年龄
    `<g id="lc-age">` +
    `<text x="${X0}" y="262" font-family="${mono}" font-size="20" letter-spacing="8" fill="${ink}" fill-opacity="0.55">AGE</text>` +
    `<text x="${X0 - 6}" y="470" font-family="${serif}" font-size="220" font-weight="700" fill="${ink}">${age}<tspan font-size="48" font-weight="600" dx="14" fill-opacity="0.7">岁</tspan></text>` +
    `</g>` +
    // L3 时间轴 + 密度剪影 + 当前位置
    `<g id="lc-timeline">` +
    bars +
    `<line x1="${X0}" y1="${axisY}" x2="${X1}" y2="${axisY}" stroke="${ink}" stroke-opacity="0.5" stroke-width="2"/>` +
    ticks +
    `<line x1="${nowX}" y1="${axisY - 150}" x2="${nowX}" y2="${axisY}" stroke="${primary}" stroke-width="3"/>` +
    `<circle cx="${nowX}" cy="${axisY - 150}" r="7" fill="${paper}" stroke="${primary}" stroke-width="3"/>` +
    `</g>` +
    // L4 两个计数
    `<g id="lc-counts">` +
    `<line x1="${X0}" y1="792" x2="${X1}" y2="792" stroke="${ink}" stroke-opacity="0.2" stroke-width="1"/>` +
    `<line x1="540" y1="824" x2="540" y2="920" stroke="${ink}" stroke-opacity="0.2" stroke-width="1"/>` +
    `<text x="${X0}" y="900" font-family="${serif}" font-size="88" font-weight="700" fill="${accent}">${data.open}</text>` +
    `<text x="${X0 + 200}" y="872" font-family="${serif}" font-size="26" font-weight="600" fill="${ink}">正在开启</text>` +
    `<text x="${X0 + 200}" y="900" font-family="${mono}" font-size="14" letter-spacing="5" fill="${ink}" fill-opacity="0.55">OPENING</text>` +
    `<text x="580" y="900" font-family="${serif}" font-size="88" font-weight="700" fill="${primary}">${data.urgent}</text>` +
    `<text x="780" y="872" font-family="${serif}" font-size="26" font-weight="600" fill="${ink}">即将关闭</text>` +
    `<text x="780" y="900" font-family="${mono}" font-size="14" letter-spacing="5" fill="${ink}" fill-opacity="0.55">CLOSING</text>` +
    `</g>` +
    // L5 三项重点
    `<g id="lc-focus">` +
    `<text x="${X0}" y="984" font-family="${mono}" font-size="14" letter-spacing="6" fill="${ink}" fill-opacity="0.55">FOCUS · 三项重点</text>` +
    rows +
    `</g>` +
    // L6 日期印（描边，-6°）
    `<g id="lc-stamp" transform="translate(868 1146) rotate(-6)">` +
    `<rect x="-92" y="-62" width="184" height="124" rx="3" fill="none" stroke="${primary}" stroke-width="4"/>` +
    `<rect x="-83" y="-53" width="166" height="106" rx="1" fill="none" stroke="${primary}" stroke-width="1.5"/>` +
    `<text x="0" y="-8" text-anchor="middle" font-family="${mono}" font-size="34" letter-spacing="4" fill="${primary}">${yyyy}</text>` +
    `<text x="0" y="38" text-anchor="middle" font-family="${mono}" font-size="34" letter-spacing="4" fill="${primary}">${md}</text>` +
    `</g>` +
    // L7 页脚
    `<g id="lc-footer">` +
    `<line x1="${X0}" y1="1252" x2="${X1}" y2="1252" stroke="${ink}" stroke-opacity="0.2" stroke-width="1"/>` +
    `<text x="${X0}" y="1292" font-family="${serif}" font-size="20" letter-spacing="2" fill="${ink}" fill-opacity="0.6">${host} · 不是算命，是算概率</text>` +
    `</g>` +
    `</svg>`
  );
}
