#!/usr/bin/env node
// 把 Noto Serif SC 的 woff2 分片下载到 public/fonts/noto-serif-sc/，并生成 src/app/fonts.css。
// 用法：node scripts/fetch-fonts.mjs
// 仅需 Node 内置 fetch，无额外依赖。只在需要更新字体时手动运行一次，产物提交进仓库。
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "fonts", "noto-serif-sc");
const CSS_OUT = path.join(ROOT, "src", "app", "fonts.css");
const CSS_URL =
  "https://fonts.googleapis.com/css2?family=Noto+Serif+SC:wght@400;600;700&display=swap";
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const RETRIES = 3; // 失败后最多再重试 3 次
const CONCURRENCY = 6;
const FAMILY = "Noto Serif SC Local";

async function withRetry(label, fn) {
  let lastErr;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (attempt < RETRIES) {
        console.warn(`[重试 ${attempt + 1}/${RETRIES}] ${label}: ${err.message}`);
        await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
      }
    }
  }
  throw new Error(`${label} 失败（已重试 ${RETRIES} 次）: ${lastErr.message}`);
}

// 解析 Google Fonts 返回的 CSS：每个 @font-face 对应一个 unicode-range 分片
function parseFontFaces(css) {
  const faces = [];
  const re = /(?:\/\*\s*([^*]*?)\s*\*\/\s*)?@font-face\s*\{([^}]*)\}/g;
  let m;
  while ((m = re.exec(css))) {
    const body = m[2];
    const weight = body.match(/font-weight:\s*(\d+)/)?.[1];
    const style = body.match(/font-style:\s*(\w+)/)?.[1] ?? "normal";
    const range = body.match(/unicode-range:\s*([^;]+);/)?.[1]?.trim();
    const url = body.match(/src:\s*url\((https:[^)]+)\)\s*format\(['"]?woff2['"]?\)/)?.[1];
    if (!weight || !range || !url) {
      throw new Error(`无法解析的 @font-face 片段: ${body.trim().slice(0, 200)}`);
    }
    faces.push({ weight, style, range, url, subset: m[1] ?? "" });
  }
  return faces;
}

async function main() {
  const css = await withRetry("获取字体 CSS", async () => {
    const res = await fetch(CSS_URL, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  });
  const faces = parseFontFaces(css);
  if (faces.length === 0) throw new Error("未解析到任何 @font-face，Google 返回格式可能变化");

  // 先全部下载到内存，成功后才替换旧目录，避免网络失败时把已有字体删光
  const counters = {};
  const plan = faces.map((f) => {
    counters[f.weight] = (counters[f.weight] ?? 0) + 1;
    const file = `w${f.weight}-${String(counters[f.weight]).padStart(3, "0")}.woff2`;
    return { ...f, file };
  });

  const buffers = new Array(plan.length);
  for (let i = 0; i < plan.length; i += CONCURRENCY) {
    await Promise.all(
      plan.slice(i, i + CONCURRENCY).map(async (f, j) => {
        buffers[i + j] = await withRetry(`下载 ${f.file}`, async () => {
          const res = await fetch(f.url, { headers: { "User-Agent": UA } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const buf = Buffer.from(await res.arrayBuffer());
          if (buf.subarray(0, 4).toString("latin1") !== "wOF2") {
            throw new Error("返回内容不是 woff2");
          }
          return buf;
        });
      }),
    );
    console.log(`已下载 ${Math.min(i + CONCURRENCY, plan.length)}/${plan.length}`);
  }

  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });
  let totalBytes = 0;
  for (let i = 0; i < plan.length; i++) {
    await writeFile(path.join(OUT_DIR, plan[i].file), buffers[i]);
    totalBytes += buffers[i].length;
  }

  const date = new Date().toISOString().slice(0, 10);
  const header = `/*
 * Noto Serif SC（思源宋体 简体中文）自托管字体声明。由 scripts/fetch-fonts.mjs 生成，请勿手改。
 * 来源：Google Fonts（https://fonts.google.com/noto/specimen/Noto+Serif+SC），woff2 分片已下载到 public/fonts/noto-serif-sc/。
 * 许可证：SIL Open Font License 1.1（https://openfontlicense.org）
 * 生成命令：node scripts/fetch-fonts.mjs
 * 生成日期：${date}
 */
`;
  const rules = plan.map((f) => {
    const comment = f.subset ? `/* ${f.subset} */\n` : "";
    return `${comment}@font-face {
  font-family: '${FAMILY}';
  font-style: ${f.style};
  font-weight: ${f.weight};
  font-display: swap;
  src: url('/fonts/noto-serif-sc/${f.file}') format('woff2');
  unicode-range: ${f.range};
}`;
  });
  await writeFile(CSS_OUT, header + rules.join("\n") + "\n", "utf8");

  console.log(`完成：${plan.length} 个 woff2 文件，总计 ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`输出：${path.relative(ROOT, OUT_DIR)}/ 与 ${path.relative(ROOT, CSS_OUT)}`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
