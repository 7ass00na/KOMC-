import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: [],
    coverage: process.env.CI === "true"
      ? {
          provider: "v8",
          reporter: ["text", "html", "lcov"],
          thresholds: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
          },
        }
      : { enabled: false, provider: "v8", reporter: ["text"] },
    pool: "threads",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
