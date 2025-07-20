# [フルスタック Tanstack Starter🏝️]()

フルスタックTypeScript/ReactフレームワークのTanstack Startを素早く立ち上げ、デプロイするためのテンプレート

## 使用技術

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL on [Neon DB](https://neon.com/)
- [Better Auth](https://www.better-auth.com/)
- deployed on [Netlify](https://www.netlify.com/)

## アーキテクチャ

### プロジェクト構造

```
src/
├── routes/                   # 柔軟にMixed Flat and Directory Routes方式でファイルベースルーティングを行う（tanstack-router.mdcに定義）
│   ├── __root.tsx            # ルートレイアウト・グローバル設定
│   ├── index.tsx             # ホームページ
│   ├── (auth)/               # 認証関連のルートグループ
│   │   ├── route.tsx         # 認証レイアウト
│   │   ├── login.tsx         # ログインページ
│   │   └── signup.tsx        # サインアップページ
│   ├── dashboard/            # ルーティング例(/dashboardパス)
│   │   ├── route.tsx         # ダッシュボードレイアウト
│   │   ├── index.tsx         # ダッシュボードホーム
│   │   └── $userId.tsx       # 動的ユーザーページ
│   └── api/                  # API ルート
│       └── auth/
│           └── $.ts          # 認証API（Better Auth）
├── server/                   # Drizzleスキーマで定義したEntityごとのサーバー関数を格納
│   ├── users.ts              # ユーザー関連
│   ├── comments.ts           # コメント関連
│   └── posts.tsx             # ポスト関連
├── db/                      # Drizzle
│   ├── schema.ts            # DBスキーマ
│   ├── index.ts             # DBインスタンス設定
├── lib/                     # 共通ライブラリ
│   ├── middleware/          # Tanstack StartのMiddleware
│   ├── auth.ts              # Better Auth設定ファイル
│   └── utils.ts             # 一般的なユーティリティヘルパー関数
└── components/              # 再利用可能コンポーネント
    ├── ui/                  # カスタムコンポーネント作成時の元になるPrimitiveなUIコンポーネント群
    └── **.tsx               # カスタムコンポーネント
```

## Project Rules

このテンプレートでは、[Cursor Project Rules](https://docs.cursor.com/context/rules#project-rules)を活用して、TanStack エコシステムの開発ベストプラクティスを体系化・自動生成することに挑戦しています。

### 📁 Rule構成

```text
.cursor/rules/
├── react.mdc                     # React 19 + Compiler 原則
├── tanstack-integration.mdc      # TanStack エコシステム統合
├── tanstack-start.mdc            # TanStack Start機能関連
├── tanstack-router.mdc           # TanStack Router機能関連
├── project-architecture.mdc      # プロジェクト構造・設計原則
├── drizzle-zod.mdc                # Drizzle ORM + drizzle-zod統合
├── ui.mdc                         # Tailwind v4 + shadcn/ui + アクセシビリティ
├── typescript.mdc                 # TypeScript/JavaScript 規約
└── testing.mdc                    # Vitest テスト戦略
```

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

## 🔐 Better Auth + Drizzle ORM による認証基盤

### 実装済み基盤

- ✅ サインイン・サインアップフォーム、サインアウトボタン
- ✅ OAuth認証（Google, GitHub）
- ✅ Email/Password認証
- ✅ PostgreSQL + Drizzle ORM でのセッション管理
- ✅ TanStack Router Context統合
- ✅ Server Functions認証ミドルウェア

### 📋 開発フロー

#### **Better Auth設定変更時**

```bash
# Better Auth CLI でスキーマ更新
pnpm auth:generate

# 新しいマイグレーション生成・適用
pnpm db generate
pnpm db migrate
```

#### **アプリケーションスキーマ変更時**

```bash
# 通常のDrizzle Kit操作
pnpm db generate     # マイグレーション生成
pnpm db migrate      # ローカルDB適用
```

### 🏗️ Single Schema Strategy

すべてのエンティティ設計定義とそれに依存するZodスキーマ生成とTS型生成を `src/db/schema.ts` で一元管理（詳細は`drizzle-zod.mdc`ルールを参照）：

- Better Auth認証テーブル
- アプリケーションテーブル
- リレーション定義
- Zodスキーマ生成
- TS型生成

### 🚀 本番デプロイ

GitHub Actions により以下が自動実行：

- プレビュー環境: develop ブランチ → Neon development DB
- 本番環境: main ブランチ → Neon production DB
