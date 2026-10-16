import { defineConfig } from 'vitest/config';
import { fileURLToPath, URL } from 'node:url';

// 独立的 vitest 配置：vitest 优先读取 vitest.config.ts，从而不会加载 vite.config.ts
// （后者含 vinext / @cloudflare/vite-plugin，在 vitest 下转换会失败）。
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'node',
  },
  resolve: {
    alias: {
      // 与 tsconfig.json 的 paths "@/*" -> "./src/*" 保持一致
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
