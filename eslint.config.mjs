import js from "@eslint/js";
import nextPlugin from "@next/eslint-plugin-next";
import { defineConfig, globalIgnores } from "eslint/config";
import jsxA11y from "eslint-plugin-jsx-a11y-x";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

const eslintConfig = defineConfig([
  js.configs.recommended,
  ...tseslint.configs.recommended,
  nextPlugin.configs["core-web-vitals"],
  reactHooks.configs.flat.recommended,
  jsxA11y.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  globalIgnores([
    ".next/**",
    ".open-next/**",
    ".playwright-cli/**",
    ".wrangler/**",
    // 工作流引擎的草稿与运行产物（.zcode/，运行日志本身已被其内层 .gitignore 忽略），
    // 属会话工具输出，不属于本仓库 lint 管辖。
    ".zcode/**",
    "output/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "playwright-report/**",
    "test-results/**",
    // 逐字节保留的第三方滚动引擎与 scroll-craft 构建工作区，不属于本仓库 lint 管辖。
    "public/cstd-scroll/scrollcraft.js",
    "scrollcraft/**",
  ]),
]);

export default eslintConfig;
