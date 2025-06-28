# TanStack Rules Strategy - Complete Reconstruction Plan

## 問題の認識

### 現在の問題点

- 既存の `tanstack-integration.mdc` が理論的なベストプラクティスに偏りすぎて、実際に使用していくべきシンプルかつ合理的な実装パターンと乖離している。
- 汎用的なベストプラクティスが記載されているが、このTanstackテンプレートプロジェクトがすでに実装していた素晴らしい実装を反映していない。

### 根本原因

- このプロジェクトがすでに実装していたよく設計された統合パターンを考慮せずにネット上から参考にした設計をそのまま反映させた。
- テンプレートプロジェクトとして包括的・汎用的な性質が反映されていない。

## プロジェクトの前提条件

### 技術スタック

- **React19 + React Compiler** (React)
- **Shadcn/ui + Tailwind v4** (UIライブラリ、CSS)
- **TanStack Start** + **TanStack Router** + **TanStack Query**
- **Better Auth** (認証)
- **Drizzle ORM** (データベース)
- **Neon DB** (PostgreSQL)
- **Netlify** (デプロイ)

### プロジェクトの性質

- **テンプレートプロジェクト** - 複製されることを前提とした構造
- `~/components`, `~/routes` 配下のファイル数が少ないのはテンプレートプロジェクトだから
- `~/routes/dashboard` は認証保護されたパスの実装例
- 最新の公式ドキュメントが推奨する実用的なパターンと拡張性・一貫性を重視

### 既存の良く設計されたファイル

- `__root.tsx` - ルートレイアウトとコンテキスト設定
- `router.tsx` - ルーター設定
- `client.tsx` - クライアントサイド設定
- `ssr.tsx` - サーバーサイドレンダリング設定
- `api.ts` - API設定
- 認証ルート群
- `DefaultCatchBoundary.tsx` - エラーハンドリング

## 策定すべきRule群

### 1. TanStack Start Rule (`tanstack-start.mdc`)

#### 対象領域

- Server Functions (`createServerFn`)
- Middleware (認証、バリデーション、コンテキスト管理)
- SSR/Streaming戦略
- Static Server Functions
- No-JS対応
- API Routes設計

#### 主要項目

1. **Server Functions設計パターン**

   - `createServerFn`の適切な使用法
   - エラーハンドリング
   - 型安全性の確保
   - パフォーマンス最適化

2. **Middleware実装**

   - 認証ミドルウェア
   - バリデーションミドルウェア
   - コンテキスト管理
   - エラー処理

3. **SSR戦略**

   - ストリーミング
   - ハイドレーション
   - SEO対応
   - メタデータ管理

4. **API Routes**
   - ファイルベースAPI
   - RESTful設計
   - 認証統合
   - エラー応答

### 2. TanStack Router Rule (`tanstack-router.mdc`)

#### 対象領域

- ファイルベースルーティング
- Layout Routes
- Route Groups
- 認証ガード
- ナビゲーション
- 型安全ルーティング

#### 主要項目

1. **ファイル構造パターン**

   - `route.tsx` vs `index.tsx`の使い分け
   - `_layout.tsx`の活用
   - Route Groups `(auth)`パターン
   - Pathless Routes `_`プレフィックス

2. **認証統合**

   - `beforeLoad`での認証チェック
   - リダイレクト処理
   - 認証状態の管理
   - 保護されたルートの実装

3. **型安全性**

   - Route型の活用
   - パラメータの型定義
   - Search Paramsの型安全性
   - ナビゲーションの型チェック

4. **パフォーマンス**
   - Code Splitting
   - Lazy Loading
   - Preloading戦略

### 3. TanStack Integration Rule (`tanstack-integration.mdc`)

#### 対象領域

- 3つのライブラリの統合パターン
- Render-as-you-fetchパターンの徹底
- 最適なSuspense Boundariesとデータフェッチ、キャッシュ管理
- 認証フロー全体
- エラーハンドリング統合
- パフォーマンス最適化

#### 主要項目

1. **基本統合**

   - `routerWithQueryClient`設定
   - コンテキスト共有
   - 型安全性の確保

2. **Render-as-you-fetchパターンの徹底**

- `queryClient.prefetchQuery()` + `useSuspenseQuery()` の基本パターン
- Server-side streaming対応（TanStack Start + React 19）
- 認証保護ルートでの効率的なデータ先行取得
- 複数クエリの並列取得（waterfall回避）
- `useServerFn` + TanStack Queryの統合パターン

3. **最適なSuspense Boundariesとデータフェッチ、キャッシュ管理**

- Route-level vs Component-levelのSuspense境界設計
- `wrapInSuspense`オプションの適切な使用
- エラーバウンダリとの統合（`errorComponent`）
- ストリーミング対応のキャッシュ戦略

4. **認証統合**

   - Better Authとの統合
   - セッション管理
   - 認証状態の同期

5. **エラーハンドリング**

   - 統合エラーバウンダリ
   - 404処理
   - サーバーエラー処理

6. **パフォーマンス**
   - バンドルサイズ最適化
   - レンダリング最適化
   - ネットワーク最適化

## 各Ruleの設計原則

### 1. テンプレート対応

- 拡張可能性を考慮
- 一般的なパターンの提供
- カスタマイズポイントの明示

### 2. 公式ドキュメントや最新のベストプラクティスの踏襲

### 3. 一貫性重視

## 作業手順

### Phase 1: 詳細分析

1. 各ライブラリの高度な機能を調査
2. 現在のコードベースの詳細分析
3. 不足している実装パターンの特定

### Phase 2: Rule作成

1. 開発者が作成したいと言っているRuleを必ず一つずつだけ作成。複数同時には作成しない。

2. **推奨作成順序**（合理的な依存関係に基づく）：
   1. **TanStack Start Rule** (基盤となるサーバー関数・ミドルウェア)
   2. **TanStack Router Rule** (ルーティング・認証ガード)
   3. **TanStack Query Rule** (データフェッチ・キャッシュ)
   4. **TanStack Integration Rule** (統合パターン・Render-as-you-fetch)

### Phase 3: 検証・質疑応答・調整

1. 既存コードベースとの整合性確認
2. 開発者からの質疑応答に回答
3. 必要に応じた調整

## 成功指標

### 定量的指標

- 各Ruleが500行以下に収まること
- すでに作成してあるリンタールール `eslint.config.js` に違反していない。

### 定性的指標

- 開発時に実際に参照される内容
- 新しい開発者がすぐに理解できるように丁寧な解説
- テンプレートとして再利用可能
- `.cursor/rules/`配下に作成されている
- [Cursor Rules](https://docs.cursor.com/context/rules)にて定義されているRule Typeが適切

## 注意点

### 避けるべきこと

- 関連するRule間で不整合がある
- 汎用的すぎるベストプラクティス
- 1年半以上前のベストプラクティス

### 重視すべきこと

- 公式ドキュメントが推奨するパターン
- 関連ライブラリ間やそのライブラリ内でのパターンの一貫性
- 現時点でのこのテンプレプロジェクトにすでに作成された良い設計の設定ファイルに基づくこと
- 実用的な価値

---

**次のステップ**: このドキュメントを新しいチャットで読み込み、Phase 1の詳細分析から開始する
