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

このテンプレートでは、[Cursor Project Rules](https://docs.cursor.com/context/rules#project-rules)を活用して、TanStack エコシステムの開発ベストプラクティスを体系化・自動生成することに挑戦しています！

### 📁 Rule構成

```
.cursor/rules/
├── core/
│   └── tanstack-integration.mdc       # TanStack Start+Router+Query統合の核
├── routing/
│   ├── file-based-patterns.mdc        # ファイルベースルーティング基本パターン
│   └── authentication.mdc             # 認証・認可・保護ルート
├── data/
│   ├── server-functions.mdc           # createServerFn + バリデーション
│   └── database-operations.mdc        # Drizzle ORM + マイグレーション戦略
└── development/
    ├── project-structure.mdc          # ディレクトリ設計・命名規則
    └── workflow-automation.mdc        # Git戦略・CI/CD・ブランチビルド運用
```

### 🎯 各Ruleの適用戦略

| ファイル                   | 適用タイプ          | トリガー条件                 | 主な責務                                     |
| -------------------------- | ------------------- | ---------------------------- | -------------------------------------------- |
| `tanstack-integration.mdc` | **Always**          | 常時                         | React19+Compiler、型安全性、TanStack間連携   |
| `file-based-patterns.mdc`  | **Auto Attached**   | `src/routes/**/*.tsx`        | createFileRoute、loader、エラーハンドリング  |
| `authentication.mdc`       | **Auto Attached**   | `beforeLoad使用ファイル`     | 認証ガード、Better Auth統合、型安全なcontext |
| `server-functions.mdc`     | **Auto Attached**   | `createServerFn使用ファイル` | サーバー関数、zodバリデーション、型推論      |
| `database-operations.mdc`  | **Auto Attached**   | `src/lib/db/**/*.ts`         | Drizzle操作、トランザクション、スキーマ設計  |
| `project-structure.mdc`    | **Agent Requested** | プロジェクト構造相談時       | ディレクトリ設計、ファイル配置、命名規則     |
| `workflow-automation.mdc`  | **Agent Requested** | 開発ワークフロー相談時       | ブランチ戦略、マイグレーション判断基準       |

### 🔧 設定ファイルとの役割分担

#### ✅ **設定ファイルで管理される領域**

- **基本型安全性**: `tsconfig.json`の`strict: true`
- **コード品質**: `eslint.config.js`のルール設定
- **React 19最適化**: React Compiler設定

#### 🎯 **Ruleで補強される領域**

- **TanStack統合特有のパターン**: Route.useLoaderData()、createServerFn統合
- **React 19 + Compiler最適化**: 手動メモ化回避、関数宣言優先
- **プロジェクト固有の判断基準**: 認証フロー、データベース操作、ワークフロー

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

### 🚀 将来的な拡張例

プロジェクトの成長に合わせて、以下のような拡張が自然に行える構造になっています：

```
.cursor/rules/
├── core/                              # 基盤技術
│   ├── tanstack-integration.mdc       # 既存
│   └── react-patterns.mdc             # 🆕 React19固有パターンが複雑化時
├── routing/                           # ルーティング層
│   ├── file-based-patterns.mdc        # 既存
│   ├── authentication.mdc             # 既存
│   └── advanced-routing.mdc           # 🆕 仮想ルート、マスキング等
├── data/                              # データ層
│   ├── server-functions.mdc           # 既存
│   ├── database-operations.mdc        # 既存
│   └── caching-strategies.mdc         # 🆕 高度なキャッシュ戦略
├── testing/                           # 🆕 テスト層
│   ├── unit-testing.mdc              # Vitest + Testing Library
│   └── e2e-testing.mdc               # Playwright等
├── deployment/                        # 🆕 デプロイ層
│   ├── multi-platform.mdc            # Vercel、Cloudflare対応
│   └── monitoring.mdc                # Sentry、分析ツール
└── development/                       # 開発プロセス
    ├── project-structure.mdc          # 既存
    ├── workflow-automation.mdc        # 既存（notepad戦略含む）
    └── code-quality.mdc              # 🆕 ESLint拡張、コードレビュー基準
```

#### 拡張シナリオ例

- **testing/**: テスト戦略が複雑化（モック、MSW、視覚回帰テスト等）
- **deployment/**: マルチクラウド対応やEdge Computing活用
- **data/caching-strategies**: Redis統合、CDNキャッシュ、Service Worker等
- **core/react-patterns**: Suspense、Concurrent Features、Server Components対応

### 💡 Rule設計の利点

1. **論理的責務分離**: 各ファイルが独立した技術領域を担当
2. **適切な粒度**: 1ファイル100-200行程度の管理しやすいサイズ
3. **自然な拡張性**: 新機能は論理的な場所に追加される
4. **保守性**: 関連する変更は同じファイル内で完結
