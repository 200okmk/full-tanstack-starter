import type { Config } from "drizzle-kit";

export default {
  // マイグレーションファイルの出力ディレクトリ
  out: "./migrations",

  // スキーマ定義ファイルのパス（テーブル定義を含むファイル）
  schema: "./src/db/schemas/index.ts",

  // drizzle-kit push コマンドを実行するときに、出力された SQL ステートメントを実行するかどうかを確認するプロンプトが表示される
  strict: true,

  // 使用するデータベースの方言（PostgreSQL、MySQL、SQLiteなど）
  dialect: "postgresql",

  // テーブル名やカラム名のケーシング変換（camelCase -> snake_case）
  casing: "snake_case",

  // データベース接続情報
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },

  // マイグレーション関連の設定
  migrations: {
    // マイグレーション履歴を記録するテーブル名
    table: "__drizzle_migrations",
    // マイグレーションテーブルを作成するスキーマ
    schema: "drizzle",
  },

  // 操作対象スキーマのフィルタ（将来のauth、user、publicなど複数スキーマ対応のため削除）
  // schemaFilter: "public", // コメントアウト：マルチスキーマ対応のため
} satisfies Config;
