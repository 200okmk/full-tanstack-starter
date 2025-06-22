# TanStack Rules Strategy - Complete Reconstruction Plan

## 問題の認識

### 現在の問題点

- 既存の `tanstack-integration.mdc` が理論的なベストプラクティスに偏りすぎて、実際に使用していくべきシンプルかつ合理的な実装パターンと乖離している。
- 汎用的なベストプラクティスが記載されているが、このTanstackテンプレートプロジェクトがすでに実装していた素晴らしい実装を反映していない

### 根本原因

- プロジェクトがすでに実装していたよく設計された統合パターンが考慮せずにネット上から参考にした設計をそのまま反映させた。
- テンプレートプロジェクトとして包括的・汎用的な性質が反映されていない

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
- 公式ドキュメントが推奨する実用的なパターンと一貫性を重視

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

### 3. TanStack Query Rule (`tanstack-query.mdc`)

#### 対象領域

- データフェッチング戦略
- Mutations管理
- キャッシュ戦略
- エラーハンドリング
- Optimistic Updates
- Server State管理

#### 主要項目

1. **クエリ設計パターン**

   - `useQuery`の効果的な使用
   - Key設計戦略
   - Stale Time設定
   - Cache Time管理

2. **Mutations**

   - `useMutation`パターン
   - Optimistic Updates
   - エラー処理
   - 成功時の処理

3. **キャッシュ管理**

   - Invalidation戦略
   - Background Refetch
   - Manual Updates
   - Garbage Collection

4. **サーバー状態管理**
   - Server State vs Client State
   - 同期戦略
   - コンフリクト解決

### 4. TanStack Integration Rule (`tanstack-integration.mdc`)

#### 対象領域

- 3つのライブラリの統合パターン
- 認証フロー全体
- エラーハンドリング統合
- パフォーマンス最適化

#### 主要項目

1. **基本統合**

   - `routerWithQueryClient`設定
   - コンテキスト共有
   - 型安全性の確保

2. **認証統合**

   - Better Authとの統合
   - セッション管理
   - 認証状態の同期

3. **エラーハンドリング**

   - 統合エラーバウンダリ
   - 404処理
   - サーバーエラー処理

4. **パフォーマンス**
   - バンドルサイズ最適化
   - レンダリング最適化
   - ネットワーク最適化

## 各Ruleの設計原則

### 1. 実装ベース

- 既存のコードベースの実際のパターンを分析
- 理論的ではなく実用的なアドバイス
- プロジェクト固有の実装を反映

### 2. テンプレート対応

- 拡張可能性を考慮
- 一般的なパターンの提供
- カスタマイズポイントの明示

### 3. 段階的複雑性

- 基本パターンから開始
- 高度な機能への段階的な導入
- 複雑性の理由を明示

### 4. 実用性重視

- 開発時に実際に役立つ内容
- コピー&ペーストで使える例
- トラブルシューティング情報

## 作業手順

### Phase 1: 詳細分析

1. 各ライブラリの高度な機能を調査
2. 現在のコードベースの詳細分析
3. 不足している実装パターンの特定

### Phase 2: Rule作成

1. TanStack Start Rule
2. TanStack Router Rule
3. TanStack Query Rule
4. TanStack Integration Rule

### Phase 3: 検証・調整

1. 既存コードベースとの整合性確認
2. 実用性の検証
3. 必要に応じた調整

## 成功指標

### 定量的指標

- 各Ruleが500行以下に収まること
- 実際のコードベースのパターンを80%以上カバー
- コピー&ペースト可能な例が各Ruleに10個以上

### 定性的指標

- 開発時に実際に参照される内容
- 新しい開発者がすぐに理解できる
- テンプレートとして再利用可能

## 注意点

### 避けるべきこと

- 理論的すぎる内容
- 実装されていない高度な機能の詳述
- 汎用的すぎるベストプラクティス

### 重視すべきこと

- 実際の実装パターン
- プロジェクト固有の制約
- 段階的な学習曲線
- 実用的な価値

---

**次のステップ**: このドキュメントを新しいチャットで読み込み、Phase 1の詳細分析から開始する
