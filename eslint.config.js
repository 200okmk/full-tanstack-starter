import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintConfigPrettier from "eslint-config-prettier";
import * as reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // グローバル除外設定 - ビルド成果物と自動生成ファイルを除外
  {
    ignores: [
      "dist/",
      ".vinxi/",
      ".wrangler/",
      ".vercel/",
      ".netlify/",
      ".output/",
      "build/",
      "node_modules/",
      "*.config.js",
      "routeTree.gen.ts", // TanStack Routerの自動生成ファイル
    ],
  },

  // TypeScript/React ファイル用の主要設定
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // TypeScript推奨設定 - 実用的なバランスの型安全性
      ...tseslint.configs.recommendedTypeChecked,
      // TypeScriptスタイル設定 - コードスタイルの一貫性を保証
      ...tseslint.configs.stylisticTypeChecked,
      // TanStack Query設定 - React Queryのベストプラクティス
      ...pluginQuery.configs["flat/recommended"],
      // TanStack Router設定 - 型安全なルーティング
      ...pluginRouter.configs["flat/recommended"],
      // Prettier統合 - フォーマットルールとの競合を回避
      eslintConfigPrettier,
    ],
    languageOptions: {
      ecmaVersion: "latest", // 最新のECMAScript構文サポート
      sourceType: "module", // ESモジュール形式
      parserOptions: {
        projectService: true, // TypeScriptパフォーマンス最適化
        tsconfigRootDir: import.meta.dirname, // tsconfig.jsonの基準ディレクトリ
        ecmaFeatures: {
          jsx: true, // JSX構文サポート
        },
      },
    },
    plugins: {
      "react-hooks": reactHooks, // React Hooksルールプラグイン
    },
    settings: {
      react: {
        version: "detect", // Reactバージョン自動検出
      },
    },
    rules: {
      // === Tanstack カスタムルール ===

      // === React Hooks ルール ===
      ...reactHooks.configs.recommended.rules, // React Hooksの推奨ルール
      "react-hooks/exhaustive-deps": "warn", // useEffectの依存配列チェック
      "react-hooks/react-compiler": "error", // React 19 Compiler最適化サポート

      // === 必要最小限のTypeScriptルール ===
      // 未使用変数エラー - アンダースコアプレフィックスは許可
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

      // === TanStack Router対応 ===
      // throw redirect()は正常なパターンなのでオフ
      "@typescript-eslint/only-throw-error": "off",

      // === 一般的な品質ルール ===
      // console.log使用制限（warn/errorのみ許可）
      "no-console": ["warn", { allow: ["warn", "error"] }],
      // const使用を強制
      "prefer-const": "error",
      // var使用を禁止
      "no-var": "error",
    },
  },

  // JavaScript ファイル用設定（設定ファイルなど）
  {
    files: ["**/*.{js,mjs,cjs}"],
    extends: [js.configs.recommended], // JavaScript推奨ルール
    languageOptions: {
      ecmaVersion: "latest", // 最新のECMAScript構文サポート
      sourceType: "module", // ESモジュール形式
    },
  },
);
