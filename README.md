# Tanstack Start テンプレート🏝️

## 概要

主な機能：
- 初期RDBスキーマとORM設定
- OAuth認証とメアドパスワード認証
- アプリ本体とDBの即デプロイ設定
- 自動マイグレーションとホスト先PaaS自動ビルドのCD（ステージングと本番の2環境）
- フルレスポンシブUI
- ダークモード
- 404と例外キャッチ
- アーキテクチャや実装方針を定義したドキュメントなど

## 使用技術

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL on [Neon DB](https://neon.com/)
- [Better Auth](https://www.better-auth.com/)
- [Netlify](https://www.netlify.com/)

## 📁 プロジェクトドキュメント構成

アーキテクチャや実装方針を明文化

1. 常にDBスキーマを唯一の情報源（Single Source of Truth）とし、エンティティ関連の多重定義と分散を防ぐ[SSOT戦略](https://github.com/200okmk/full-tanstack-starter/blob/main/docs/drizzle-zod-ssot.md)。具体的にはRDBスキーマからZodスキーマとTS型を自動生成して使いまわすもの
2. 親コンポーネントのUIレンダリングをブロックしない非同期データフェッチとキャッシュ設計、ディレクトリ設計、UI状態管理ソースとしてのクエリパラメータ活用などを定義した[`TanStack`運用戦略](https://github.com/200okmk/full-tanstack-starter/blob/main/docs/tanstack-router.md)
3. `本番`, `開発統合`, `各作業`の3層ブランチ構造に連動させた各環境自動ビルド[CD戦略](https://github.com/200okmk/full-tanstack-starter/blob/main/docs/gitflow-hosting-cd.md)
4. デザインシステム、アクセシビリティなどの[UI構築戦略](https://github.com/200okmk/full-tanstack-starter/blob/main/docs/ui.md)

```text
docs/
├── tanstack-router.mdc        # ルーティング、データフェッチ、SuspenseとストリーミングUI、Search ParamsなどTanStack Routerの運用について
├── drizzle-zod-ssot.mdc       # DrizzleスキーマをSSOTした一貫したデータアクセス戦略について
├── ui.mdc                     # Shadcn/uiエコシステム、Tailwind運用、アクセシビリテについて
├── gitflow-hosting-cd.mdc     # Gitflowブランチ運用、アプリ本体とDBのホスティング、CDについて
└── testing.mdc                # （未作成）Vitest テスト戦略
```

## ディレクトリ構造

あくまでパスやコンポーネント、エンティティはスターター例として実装

```
src/
├── routes/                   # 柔軟にMixed Flat and Directory Routes方式でファイルベースルーティングを行う（詳細はtanstack-router.mdcに定義）
│   ├── __root.tsx            # ルートレイアウト・グローバル設定
│   ├── index.tsx             # 認証保護なしのランディングホームページ
│   ├── (auth)/               # 認証関連専用のルートグループ
│   │   ├── route.tsx         # 認証レイアウト
│   │   ├── login.tsx         # ログインページ
│   │   └── signup.tsx        # サインアップページ
│   ├── dashboard/            # 認証保護下のパス例(/dashboardパス)
│   │   ├── route.tsx         # パスレイアウト
│   │   ├── index.tsx         # パスホーム
│   │   └── $userId.tsx       # 動的ユーザーページ
│   └── api/                  # API Route
│       └── auth/             # 認証関連
│           └── $.ts          # 認証API（Better Auth）
├── db/                      # 主にDrizzleORM関連
│   ├── schema.ts            # Drizzleスキーマ
│   ├── seed.ts              # DBシード
│   └── index.ts             # DBインスタンス設定
│── data-access/              # Drizzleスキーマで定義したEntity（テーブル）ごとにファイルを作成し、CRUD操作するServerFunctionsを定義する
│   ├── users.ts              # ユーザー関連CRUD
│   ├── comments.ts           # エンティティ関連CRUD
│   └── posts.tsx             # エンティティ関連CRUD
├── styles/                  # スタイリング関連
│   └── app.css              # プロジェクトの統一的なCSS
├── lib/                     # プロジェクト固有の再利用可能なコード
│   ├── middlewares.ts       # Tanstack StartのMiddleware
│   ├── auth.ts              # Better Auth設定ファイル
│   ├── auth-client.ts       # Better Authが提供する認証関連メソッド（signin, signoutなど）
│   └── utils.ts             # 一般的なユーティリティヘルパー関数
└── components/              # コンポーネント
    ├── ui/                  # 再利用可能でPrimitiveなUIコンポーネント群（主にShadcn/uiなどを直接配置）
    └── */**/*.tsx           # カスタムコンポーネント
```
