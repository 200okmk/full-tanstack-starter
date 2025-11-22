# [Tanstack Start テンプレート🏝️]()

フルスタックReactフレームワークのTanstack Startを下記の技術スタックで立ち上げ、Netlifyにデプロイするためのテンプレート

## 使用技術

- [React 19](https://react.dev) + [React Compiler](https://react.dev/learn/react-compiler)
- TanStack [Start](https://tanstack.com/start/latest) + [Router](https://tanstack.com/router/latest) + [Query](https://tanstack.com/query/latest)
- [Tailwind CSS v4](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- [Drizzle ORM](https://orm.drizzle.team/) + PostgreSQL on [Neon DB](https://neon.com/)
- [Better Auth](https://www.better-auth.com/)
- deployed on [Netlify](https://www.netlify.com/)

## ディレクトリ構造

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

## 📁 Rule構成

```text
.cursor/rules/
├── tanstack-router.mdc        # ルーティング、データフェッチ、SuspenseとストリーミングUI、Search ParamsなどTanStack Routerの運用について
├── drizzle-zod-ssot.mdc       # DrizzleスキーマをSSOTした一貫したデータアクセス戦略について
├── ui.mdc                     # Shadcn/uiエコシステム、Tailwind運用、アクセシビリテについて
├── gitflow-hosting-cd.mdc     # Gitflowブランチ運用、アプリ本体とDBのホスティング、CDについて
└── testing.mdc                # （未実装）Vitest テスト戦略
```
