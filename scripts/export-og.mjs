// 用 sharp 把 assets/og.svg 渲染为 public/og.png（1200x630）
import sharp from 'sharp';
import { readFileSync, writeFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = readFileSync(join(root, 'assets', 'og.svg'));
const out = join(root, 'public', 'og.png');

const buf = await sharp(svg, { density: 144 })
  .resize(1200, 630, { fit: 'fill' })
  .png({ compressionLevel: 9, palette: true, quality: 90 })
  .toBuffer();
writeFileSync(out, buf);
console.log(`og.png ${buf.length} bytes (${(statSync(out).size / 1024).toFixed(1)} KB)`);
