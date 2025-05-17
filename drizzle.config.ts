import type { Config } from "drizzle-kit";

export default {
  out: "./drizzle",
  schema: "./src/lib/db/schemas/index.ts",
  // drizzle-kit push コマンドを実行するときに、出力された SQL ステートメントを実行するかどうかを確認するプロンプトが表示される
  strict: true,
  dialect: "postgresql",
  casing: "snake_case",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config;
