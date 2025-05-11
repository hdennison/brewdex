/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    minify: "esbuild",
  },
  esbuild: {
    jsxFactory: "h",
    jsxFragment: "Fragment",
    jsxInject: `import { h, Fragment } from '@/lib/jsx/jsx-runtime'`,
  },
  resolve: {
    alias: { "@": "/src" },
    extensions: [".ts", ".tsx", ".js", ".jsx"],
  },
  test: {
    globals: true,
    browser: {
      enabled: true,
      provider: "playwright",
      instances: [{ browser: "chromium", headless: true }],
    },
    include: ["src/**/*.test.{ts,tsx}"],
    coverage: {
      include: ["src/**/*"],
      exclude: ["src/main.tsx", "src/*.d.ts", "src/**/types.ts"],
    },
  },
});
