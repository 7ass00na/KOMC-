import { defineConfig, globalIgnores } from "eslint/config";
import js from "@eslint/js";

const eslintConfig = defineConfig([
  js.configs.recommended,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Project-specific ignores
    "coverage/**",
    "e2e/**",
    "playwright.config.*",
    "test-results/**",
    "types/playwright-shim.d.ts",
  ]),
]);

export default eslintConfig;
