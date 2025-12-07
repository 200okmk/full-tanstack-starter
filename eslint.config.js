import react from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintConfigPrettier from "eslint-config-prettier";
import reactHooks from "eslint-plugin-react-hooks";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig({
  files: ["**/*.{ts,tsx}"],
  languageOptions: {
    parser: tseslint.parser,
    parserOptions: {
      // TypeScript APIを使用してルールの型情報を生成する。各ファイルに対して最も近いtsconfig.jsonが自動的に使用される（https://typescript-eslint.io/packages/parser#projectservice）。
      projectService: true,
      // `project: `オプションで指定された相対TSConfigパスのルートディレクトリを指定できる。これにより、ルート以外のディレクトリからESLintを実行しても、TSConfigが見つかるようになる（https://typescript-eslint.io/packages/parser#tsconfigrootdir）。
      tsconfigRootDir: import.meta.dirname,
    },
  },
  extends: [
    // JavaScriptのRecommended（https://eslint.org/docs/latest/rules/）
    js.configs.recommended,
    // TypeScriptのRecommended + 型チェック（https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/recommended-type-checked.ts）
    ...tseslint.configs.recommendedTypeChecked,
    // Stylisticとは、TypeScriptにおけるベストプラクティスとみなされるルールであるが、プログラムロジックには影響を与えない。これらのルールは一般的に、よりシンプルなコードパターンを強制することに重点が置かれている。
    // TypeScriptのStylistic + 型チェック（https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/eslintrc/stylistic-type-checked.ts）
    ...tseslint.configs.stylisticTypeChecked,
    // TanStack Query
    ...pluginQuery.configs["flat/recommended"],
    // TanStack Router
    ...pluginRouter.configs["flat/recommended"],
    // React Hooks（https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks）
    reactHooks.configs.flat.recommended,
    // React（https://www.eslint-react.xyz/docs/presets#typescript-specialized）
    react.configs["recommended-type-checked"],
    // Prettier統合 - フォーマットルールとの競合を回避。
    eslintConfigPrettier,
  ],
  // ルールの設定
  rules: {
    // === TanStack ===
    // throw redirect()は正常なパターンなのでオフ
    "@typescript-eslint/only-throw-error": "off",

    // === React Hooks ===

    // === TypeScript ルール ===
    // 未使用変数エラー - アンダースコアプレフィックスは許可（https://typescript-eslint.io/rules/no-unused-vars）
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      },
    ],
    // any型使用を警告レベル（完全禁止は現実的でない）
    "@typescript-eslint/no-explicit-any": "warn",

    // === 一般的な品質ルール ===
    // console.log使用制限（warn/errorのみ許可）
    "no-console": ["warn", { allow: ["warn", "error"] }],
    // const使用を強制
    "prefer-const": "error",
    // var使用を禁止
    "no-var": "error",
  },
  // グローバル除外設定 - ビルド成果物と自動生成ファイルを除外
  ignores: [
    "dist",
    ".wrangler",
    ".vercel",
    ".netlify",
    ".output",
    "build",
    "node_modules",
    "*.config.js",
    "routeTree.gen.ts", // TanStack Routerの自動生成ファイル
  ],
});
