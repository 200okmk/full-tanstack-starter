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

## 🔐 BetterAuth + DrizzleORMによる認証認可実装

本プロジェクトでは、Better AuthとDrizzle ORMを活用したDBベースのセッション管理を採用しています。

### 実装済み基盤

- ✅ サインイン・サインアップフォーム、サインアウトボタン
- ✅ OAuth認証（Google, GitHub）
- ✅ Email/Password認証
- ✅ PostgreSQL + Drizzleでのセッション管理
- ✅ TanStack Router Context統合によるユーザーセッション取得
- ✅ Server Functions認証ミドルウェア

### 🛠️ Better Auth CLI活用

#### 定期実行推奨コマンド

```bash
# スキーマ同期（Better Authアップデート時）
npx @better-auth/cli@latest generate

# DB migration適用
npx @better-auth/cli@latest migrate

# 新しいSecret key生成
npx @better-auth/cli@latest secret
```

### 📚 関連Cursor Rules

認証関連の実装パターンは以下のルールに分散して記載：

- `@tanstack-router.mdc`: 認証ガード・Route Context統合
- `@tanstack-start.mdc`: Server Functions認証ミドルウェア
- `@tanstack-integration.mdc`: 認証状態管理・キャッシング戦略
