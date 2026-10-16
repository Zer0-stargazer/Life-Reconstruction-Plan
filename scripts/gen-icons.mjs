/**
 * 图标生成：SVG（内联，与 scripts/icon-src/gen-icon.html 同源）→ PNG + favicon.ico
 * 用法：node scripts/gen-icons.mjs
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { writeFileSync } from 'node:fs';

const PAPER = '#faf6ee';
const INK = '#35302b';
const RED = '#b2392b';
const DARK_BG = '#211d19';
const DARK_INK = '#e8e6df';
const DARK_RED = '#e2674f';

const fullSvg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${s}" height="${s}">
  <rect x="0" y="0" width="40" height="40" rx="9" fill="${PAPER}"/>
  <path d="M24 29.5 C 29 30, 33 31.2, 36 32.5" fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round" opacity="0.38"/>
  <path d="M4.5 27.5 H16.5" fill="none" stroke="${INK}" stroke-width="3.6" stroke-linecap="round" opacity="0.55"/>
  <rect x="17" y="22.5" width="8" height="8" rx="1.6" fill="none" stroke="${RED}" stroke-width="2.8"/>
  <path d="M25.5 26 C 30 25.2, 32.5 18.5, 35 10.5" fill="none" stroke="${RED}" stroke-width="3.4" stroke-linecap="round"/>
  <circle cx="34.9" cy="10" r="2.6" fill="${RED}"/>
</svg>`;

const compactSvg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" width="${s}" height="${s}">
  <rect x="0" y="0" width="40" height="40" rx="9" fill="${PAPER}"/>
  <path d="M4 27.5 H16" fill="none" stroke="${INK}" stroke-width="4.6" stroke-linecap="round" opacity="0.6"/>
  <rect x="16.6" y="22" width="8.8" height="8.8" rx="1.8" fill="none" stroke="${RED}" stroke-width="3.6"/>
  <path d="M25.8 26.2 C 30.5 25.4, 32.8 18.5, 35.4 10" fill="none" stroke="${RED}" stroke-width="4.2" stroke-linecap="round"/>
  <circle cx="35.2" cy="9.4" r="3" fill="${RED}"/>
</svg>`;

const maskableSvg = (s) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="${s}" height="${s}">
  <rect x="0" y="0" width="512" height="512" fill="${DARK_BG}"/>
  <g transform="translate(256 256) scale(8) translate(-20 -20)">
    <path d="M24 29.5 C 29 30, 33 31.2, 36 32.5" fill="none" stroke="${DARK_INK}" stroke-width="2.6" stroke-linecap="round" opacity="0.38"/>
    <path d="M4.5 27.5 H16.5" fill="none" stroke="${DARK_INK}" stroke-width="3.6" stroke-linecap="round" opacity="0.55"/>
    <rect x="17" y="22.5" width="8" height="8" rx="1.6" fill="none" stroke="${DARK_RED}" stroke-width="2.8"/>
    <path d="M25.5 26 C 30 25.2, 32.5 18.5, 35 10.5" fill="none" stroke="${DARK_RED}" stroke-width="3.4" stroke-linecap="round"/>
    <circle cx="34.9" cy="10" r="2.6" fill="${DARK_RED}"/>
  </g>
</svg>`;

const render = async (svg, out) => {
  await sharp(Buffer.from(svg)).png().toFile(out);
  console.log('✓', out);
};

// PWA / manifest 图标
await render(fullSvg(192), 'public/icon-192.png');
await render(fullSvg(512), 'public/icon-512.png');
await render(maskableSvg(512), 'public/icon-maskable-512.png');
await render(fullSvg(180), 'public/apple-icon.png');

// favicon 源 PNG（紧凑版，小尺寸更清晰）
await render(compactSvg(16), 'scripts/icon-src/f16.png');
await render(compactSvg(32), 'scripts/icon-src/f32.png');
await render(compactSvg(48), 'scripts/icon-src/f48.png');

// favicon.ico（16/32/48 合成）
const ico = await pngToIco([
  'scripts/icon-src/f16.png',
  'scripts/icon-src/f32.png',
  'scripts/icon-src/f48.png',
]);
writeFileSync('public/favicon.ico', ico);
console.log('✓ public/favicon.ico');
console.log('\n全部图标已更新（纸/墨/朱红 品牌三色版）');
