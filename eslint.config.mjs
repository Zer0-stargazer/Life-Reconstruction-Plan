import nextTs from 'eslint-config-next/typescript';
import nextVitals from 'eslint-config-next/core-web-vitals';
import { defineConfig, globalIgnores } from 'eslint/config';

const syntaxRules = [
  {
    selector: 'JSXOpeningElement[name.name="head"]',
    message:
      '禁止使用 head 标签，优先使用 metadata。三方 CSS、字体等资源可以在 globals.css 中顶部通过 @import 引入或者使用 next/font；preload, preconnect, dns-prefetch 通过 ReactDOM 的 preload、preconnect、dns-prefetch 方法引入；json-ld 可阅读 https://nextjs.org/docs/app/guides/json-ld',
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'no-restricted-syntax': ['error', ...syntaxRules],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    '.next*/**', // .next.old / .next.prev / .next.bak-* 等构建残留
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Build artifacts:
    'server.js',
    'dist/**',
    '.cloudflare/**', // Cloudflare / vinext 构建产物（.gitignore 已忽略）
    '.vinext/**', // vinext 构建产物（.gitignore 已忽略）
    '.rsbuild/**', // 与 .gitignore 对齐
    'coverage/**', // 测试覆盖率报告（.gitignore 已忽略）
    '_tmp_*/**', // pnpm 安装期临时目录（.gitignore 已忽略）
    '.temp/**', // 与 .gitignore 对齐（.gitignore 已忽略）
    // Script files (CommonJS):
    'scripts/**/*.js',
    'scripts/**/*.ts',
    // 临时脚本目录（已 gitignore）：一次性数据批处理脚本，不参与质量门禁
    '.tmp/**',
  ]),
]);

export default eslintConfig;
