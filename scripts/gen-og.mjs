/**
 * og.png 重生成：1200×630 社交分享图（纸底 + 墨字 + 朱红点缀，与新 logo 同源）
 * 用法：node scripts/gen-og.mjs
 * 文字排版与 scripts/icon-src/gen-og.html 保持一致；中文依赖系统衬线字体
 * （Noto Serif SC / Source Han Serif SC / 宋体），生成后请目检。
 */
import sharp from 'sharp';

const W = 1200, H = 630;
const PAPER = '#faf6ee', INK = '#1f1915', RED = '#b2392b', GREY = '#8a7f74', HAIR = '#dcd6cf';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <rect width="${W}" height="${H}" fill="${PAPER}"/>

  <!-- 右上水印：刻度环 -->
  <g transform="translate(1080 120)" opacity="0.07">
    <circle r="230" fill="none" stroke="${INK}" stroke-width="3"/>
    <circle r="150" fill="none" stroke="${INK}" stroke-width="3"/>
    <circle r="70" fill="none" stroke="${INK}" stroke-width="3"/>
    <g stroke="${INK}" stroke-width="4">
      <line x1="0" y1="-230" x2="0" y2="-186"/><line x1="0" y1="230" x2="0" y2="186"/>
      <line x1="-230" y1="0" x2="-186" y2="0"/><line x1="230" y1="0" x2="186" y2="0"/>
    </g>
  </g>

  <!-- 顶部：logo + kicker -->
  <g transform="translate(84 74)">
    <svg width="66" height="66" viewBox="0 0 40 40">
      <rect width="40" height="40" rx="9" fill="${PAPER}" stroke="${HAIR}" stroke-width="1"/>
      <path d="M24 29.5 C 29 30, 33 31.2, 36 32.5" fill="none" stroke="#35302b" stroke-width="2.6" stroke-linecap="round" opacity="0.38"/>
      <path d="M4.5 27.5 H16.5" fill="none" stroke="#35302b" stroke-width="3.6" stroke-linecap="round" opacity="0.55"/>
      <rect x="17" y="22.5" width="8" height="8" rx="1.6" fill="none" stroke="${RED}" stroke-width="2.8"/>
      <path d="M25.5 26 C 30 25.2, 32.5 18.5, 35 10.5" fill="none" stroke="${RED}" stroke-width="3.4" stroke-linecap="round"/>
      <circle cx="34.9" cy="10" r="2.6" fill="${RED}"/>
    </svg>
    <text x="100" y="42" font-family="'Noto Serif SC','Source Han Serif SC','SimSun',serif" font-size="19" letter-spacing="10" fill="${GREY}">A PERSONAL DECISION ATLAS</text>
    <text x="980" y="42" font-family="'Noto Serif SC','Source Han Serif SC','SimSun',serif" font-size="19" letter-spacing="10" fill="${GREY}">VOL. 01</text>
  </g>

  <!-- 主标题 -->
  <text x="84" y="278" font-family="'Noto Serif SC','Source Han Serif SC','SimSun',serif" font-size="112" font-weight="700" fill="${INK}" letter-spacing="4">人生沙盘</text>
  <g transform="translate(84 318)">
    <rect width="64" height="3" fill="${RED}"/>
    <text x="88" y="9" font-family="'Noto Serif SC','Source Han Serif SC','SimSun',serif" font-size="17" letter-spacing="10" fill="${RED}">LIFE SANDBOX</text>
  </g>

  <!-- 引言 -->
  <text x="84" y="432" font-family="'Noto Serif SC','Source Han Serif SC','SimSun',serif" font-size="13" letter-spacing="9" fill="#a99f93">FATE &#183; LUCK &#183; EFFORT</text>
  <text x="84" y="486" font-family="'Noto Serif SC','Source Han Serif SC','SimSun',serif" font-size="27" fill="${INK}" opacity="0.85">命是你拿到的牌，运是你出牌的时机，努力是你出牌的方式。</text>

  <!-- 页脚 -->
  <g transform="translate(84 556)">
    <line x1="0" y1="0" x2="${W - 168}" y2="0" stroke="${HAIR}" stroke-width="1"/>
    <text x="0" y="34" font-family="'Noto Serif SC','Source Han Serif SC','SimSun',serif" font-size="18" fill="#6a615b">不是算命，是算概率</text>
    <text x="830" y="34" font-family="'Noto Serif SC','Source Han Serif SC','SimSun',serif" font-size="18" fill="#6a615b">七个模块 &#183; 一条时间轴</text>
  </g>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile('public/og.png');
console.log('✓ public/og.png');
