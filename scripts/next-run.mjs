#!/usr/bin/env node
/**
 * 跨平台启动 Next.js，并让端口遵守 $PORT。
 *
 * 背景：原脚本写死 `next dev -p 5000`，部署到会注入 $PORT 的平台时
 * 服务会绑到错误端口。这里本地默认仍是 5000，但 $PORT 优先。
 */
import { spawn } from 'node:child_process';
import path from 'node:path';

const mode = process.argv[2] === 'start' ? 'start' : 'dev';
const port = process.env.PORT || '5000';
const nextBin = path.resolve(process.cwd(), 'node_modules/next/dist/bin/next');

const child = spawn(process.execPath, [nextBin, mode, '-p', port], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
  } else {
    process.exit(code ?? 0);
  }
});

for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => child.kill(sig));
}
