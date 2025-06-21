# [フルスタック Tanstack Starter🏝️]()

フルスタックTypeScript/ReactフレームワークのTanstack Startを素早く立ち上げ、デプロイするためのテンプレート

## 使用技術

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL on [Neon DB](https://neon.com/)
- [Better Auth](https://www.better-auth.com/)
- deployed on [Netlify](https://www.netlify.com/)

## Project Rules

このテンプレートでは、[Cursor Project Rules](https://docs.cursor.com/context/rules#project-rules)を活用して、TanStack エコシステムの開発ベストプラクティスを体系化・自動生成することに挑戦しています。

### 📁 Rule構成

```text
.cursor/rules/
├── tanstack-integration.mdc      # TanStack エコシステム統合（核）
├── react.mdc                     # React 19 + Compiler 原則（核）
├── project-architecture.mdc      # プロジェクト構造・設計原則（核）
├── authentication.mdc             # Better Auth 認証認可戦略
├── database.mdc                   # Drizzle ORM + PostgreSQL戦略
├── ui-components.mdc              # Tailwind + shadcn/ui デザイン
├── typescript.mdc                 # TypeScript/JavaScript 規約
├── development-workflow.mdc       # ESLint + Git + ブランチ戦略
├── testing.mdc                    # Vitest テスト戦略
└── deployment.mdc                 # Netlify + Neon インフラ運用
```

### 🎯 各Ruleの適用戦略

| ルール                     | 適用タイプ          | 適用条件                                                                             | 主な責務                                                        |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------- |
| `tanstack-integration.mdc` | **Auto Attached**   | `src/routes/**/*.tsx`<br/>`src/router.tsx`<br/>`src/ssr.tsx`                         | Start+Router+Query統合パターン<br/>サーバー機能・ストリーミング |
| `react.mdc`                | **Auto Attached**   | `src/**/*.tsx`<br/>`src/**/*.ts`                                                     | React 19 + Compiler原則<br/>Suspense/use API活用                |
| `project-architecture.mdc` | **Auto Attached**   | `src/**/*`<br/>`*.config.*`<br/>`package.json`                                       | ディレクトリ構造・命名規則<br/>設計原則・拡張戦略               |
| `authentication.mdc`       | **Auto Attached**   | `src/lib/auth*.ts`<br/>`src/routes/(auth)/**/*.tsx`<br/>`src/lib/middleware/**/*.ts` | Better Auth認証フロー<br/>認可・セキュリティ戦略                |
| `database.mdc`             | **Auto Attached**   | `src/lib/db/**/*.ts`<br/>`drizzle.config.ts`<br/>`src/lib/schemas/**/*.ts`           | Drizzle ORM最適化<br/>マイグレーション戦略                      |
| `ui-components.mdc`        | **Auto Attached**   | `src/components/**/*.tsx`<br/>`src/lib/styles/**/*.css`                              | Tailwind + shadcn/ui<br/>デザインシステム一貫性                 |
| `typescript.mdc`           | **Agent Requested** | 必要時適用                                                                           | 型安全性・コード品質向上<br/>最適化パターン                     |
| `development-workflow.mdc` | **Agent Requested** | 必要時適用                                                                           | ESLint設定・Git戦略<br/>CI/CD・ブランチ運用                     |
| `testing.mdc`              | **Agent Requested** | 必要時適用                                                                           | Vitest テスト設計<br/>品質保証戦略                              |
| `deployment.mdc`           | **Agent Requested** | 必要時適用                                                                           | Netlify + Neon運用<br/>インフラ最適化                           |

### 🚀 ブランチビルド運用戦略

#### 開発環境（feature/fix → develop）

- **DB**: Docker Compose PostgreSQL + `drizzle-kit push`
- **開発フロー**: 個人ブランチでの高速イテレーション

#### プレビュー環境（develop）

- **ビルド**: Netlify自動デプロイ（プレビュー用環境変数）
- **DB**: GitHub Actions → Neon development子ブランチへマイグレーション適用

#### 本番環境（main）

- **ビルド**: Netlify Production デプロイ（本番用環境変数）
- **DB**: GitHub Actions → Neon production-dbへマイグレーション適用
