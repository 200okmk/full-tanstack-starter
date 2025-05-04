import react from "@eslint-react/eslint-plugin";
import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import pluginRouter from "@tanstack/eslint-plugin-router";
import eslintConfigPrettier from "eslint-config-prettier";
import * as reactHooks from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default tseslint.config(
  {
    ignores: ["dist", ".vinxi", ".wrangler", ".vercel", ".netlify", ".output", "build/"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // eslint official recommended JavaScript rules
      js.configs.recommended,
      // eslint official recommended TypeScript rules
      ...tseslint.configs.recommended,
      // configures eslint to work with prettier
      eslintConfigPrettier,
      // Tanstack official recommended react-query rules
      ...pluginQuery.configs["flat/recommended"],
      // Tanstack official recommended react-router rules
      ...pluginRouter.configs["flat/recommended"],
    ],
  },
  // for react hooks
  reactHooks.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    // for react with typescript checks
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        project: "./tsconfig.json",
        tsconfigRootDir: import.meta.dirname,
      },
    },
    ...react.configs["recommended-type-checked"],
  },
  {
    // for custom rules
    rules: {
      // You can override any rules here
      "react-hooks/react-compiler": "warn",
    },
  },
);
