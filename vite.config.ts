/// <reference types="vitest/config" />

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  build: {
    minify: "esbuild",
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
      exclude: ["src/main.ts", "src/*.d.ts"],
    },
  },
});
