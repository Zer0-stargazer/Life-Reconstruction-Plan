// 实测工具：连接 headless Chrome，测量页面横向溢出与元素几何。
// 用法：node scripts/icon-src/measure.mjs <url> <width> <height>
import { spawn } from 'node:child_process';

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const url = process.argv[2] || 'http://localhost:5000/';
const W = Number(process.argv[3] || 390);
const H = Number(process.argv[4] || 900);
const PORT = 9333 + (W % 100);

const proc = spawn(CHROME, [
  '--headless=new', '--disable-gpu', `--remote-debugging-port=${PORT}`,
  `--window-size=${W},${H}`, '--hide-scrollbars', '--no-first-run',
  '--user-data-dir=' + process.env.TEMP + '/cdp-measure', 'about:blank',
], { stdio: 'ignore' });

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getWs() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      const j = await r.json();
      const page = j.find((t) => t.type === 'page' && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch {}
    await sleep(200);
  }
  throw new Error('chrome not ready');
}

const ws = new WebSocket(await getWs());
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res) => { const i = ++id; pending.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
ws.addEventListener('message', (e) => {
  const m = JSON.parse(e.data);
  if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); }
});
await new Promise((r) => ws.addEventListener('open', r));

await send('Page.enable');
await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', {
  width: W, height: H, deviceScaleFactor: 1, mobile: true,
});
await send('Page.navigate', { url });
await sleep(4000);

const expr = `(() => {
  const vw = window.innerWidth;
  const out = { vw, docW: document.documentElement.scrollWidth, overflow: [] };
  const clippedByAncestor = (el) => {
    let p = el.parentElement;
    while (p && p !== document.body) {
      const s = getComputedStyle(p);
      if (s.overflowX === 'hidden' || s.overflowX === 'clip' || s.overflow === 'hidden') return true;
      p = p.parentElement;
    }
    return false;
  };
  for (const el of document.querySelectorAll('body *')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const right = Math.round(r.right);
    if (right > vw + 1 && !clippedByAncestor(el)) {
      out.overflow.push({
        tag: el.tagName.toLowerCase(),
        cls: (el.className && el.className.toString().slice(0, 64)) || '',
        right, width: Math.round(r.width),
        text: (el.textContent || '').trim().slice(0, 22),
      });
    }
  }
  out.overflow = out.overflow.slice(0, 14);
  out.sections = [...document.querySelectorAll('section')].map((el) => {
    const r = el.getBoundingClientRect();
    return { top: Math.round(r.top + window.scrollY), h: Math.round(r.height),
             head: (el.textContent || '').trim().slice(0, 16) };
  });
  const mq = document.querySelector('.home-marquee');
  if (mq) {
    const wrap = mq.closest('div');
    const r = (wrap || mq).getBoundingClientRect();
    out.marqueeTop = Math.round(r.top + window.scrollY);
    out.marqueeH = Math.round(r.height);
  }
  return JSON.stringify(out);
})()`;

const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
if (res.error) console.error('CDP error:', JSON.stringify(res.error));
console.log(res.result?.result?.value ?? JSON.stringify(res));

const shotPath = process.argv[5];
if (shotPath) {
  // 先滚动一遍触发 reveal/ScrollTrigger，否则整页截图里未进视口的元素常驻透明
  await send('Runtime.evaluate', {
    expression: `(async () => {
      const step = Math.round(window.innerHeight * 0.8);
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
      await new Promise((r) => setTimeout(r, 600));
    })()`,
    awaitPromise: true,
  });
  await send('Emulation.setDeviceMetricsOverride', {
    width: W, height: H, deviceScaleFactor: 1, mobile: true,
  });
  const beyond = !shotPath.includes('viewport');
  const shot = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: beyond });
  const { writeFileSync } = await import('node:fs');
  writeFileSync(shotPath, Buffer.from(shot.result.data, 'base64'));
  console.log('screenshot ->', shotPath);
}
ws.close();
proc.kill();
process.exit(0);
