import type { Config } from "drizzle-kit";

export default {
  // マイグレーションファイルの出力ディレクトリ
  out: "./src/lib/db/migrations",

  // スキーマ定義ファイルのパス（テーブル定義を含むファイル）
  schema: "./src/lib/db/schemas/index.ts",

  // drizzle-kit push コマンドを実行するときに、出力された SQL ステートメントを実行するかどうかを確認するプロンプトが表示される
  strict: true,

  // 使用するデータベースの方言（PostgreSQL、MySQL、SQLiteなど）
  dialect: "postgresql",

  // テーブル名やカラム名のケーシング変換（camelCase -> snake_case）
  casing: "snake_case",

  // データベース接続情報
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
