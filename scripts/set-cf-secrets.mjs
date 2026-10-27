#!/usr/bin/env node
/**
 * 把 .env.local 里的运行时变量推送到 Cloudflare Worker（lifesandbox）。
 *
 * 只打印变量名与结果，不打印值。
 * 用法（必须在项目根目录执行，脚本按 process.cwd() 读取 .env.local）：node scripts/set-cf-secrets.mjs
 * 需要先设置：$env:CLOUDFLARE_ACCOUNT_ID（或已用 wrangler login 且只有一个账号）
 *
 * 注意：NEXT_PUBLIC_* 是构建时内联的，不走这里；改了需要重新 pnpm deploy:vinext。
 */
import { readFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const WORKER = 'lifesandbox';
// 固定到 13003863769@163.com 的账号，避免 wrangler 在多账号间弹出交互选择
const ACCOUNT_ID = 'e82c9133691d53db2dd8aa0ebb47c7c6';
const ALLOW = [
  'SESSION_SECRET',
  'DEV_PASSWORD',
  'SUPABASE_URL',
  'SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'AI_API_URL',
  'AI_API_KEY',
  'AI_MODEL',
  'AI_THINKING',
  'AI_FALLBACK_URL',
  'AI_FALLBACK_KEY',
  'AI_FALLBACK_MODEL',
  'MAIL_PROVIDER',
  'RESEND_API_KEY',
  'MAIL_FROM',
  'TURNSTILE_SECRET_KEY',
];

const file = path.resolve(process.cwd(), '.env.local');
const vars = {};
for (const raw of readFileSync(file, 'utf8').split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith('#')) continue;
  const i = line.indexOf('=');
  if (i < 0) continue;
  const key = line.slice(0, i).trim();
  let val = line.slice(i + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  vars[key] = val;
}

function putSecret(key, value) {
  return new Promise((resolve) => {
    const child = spawn(
      `npx wrangler secret put ${key} --name ${WORKER}`,
      { shell: true, stdio: ['pipe', 'ignore', 'ignore'], env: { ...process.env, CLOUDFLARE_ACCOUNT_ID: ACCOUNT_ID } }
    );
    child.on('close', (code) => resolve(code === 0));
    child.stdin.end(value); // 不加换行，避免值末尾带 \n
  });
}

let ok = 0;
let fail = 0;
let skipped = 0;
for (const key of ALLOW) {
  const value = vars[key];
  if (!value) {
    console.log(`  - 跳过（本地为空）  ${key}`);
    skipped++;
    continue;
  }
  const done = await putSecret(key, value);
  console.log(`  ${done ? '✔' : '✘'} ${done ? '已写入' : '失败  '}  ${key}`);
  done ? ok++ : fail++;
}
console.log(`\n完成：成功 ${ok}，失败 ${fail}，跳过 ${skipped}`);
if (fail > 0) process.exitCode = 1;
