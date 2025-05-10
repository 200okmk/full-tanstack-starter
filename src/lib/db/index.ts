import { drizzle as drizzlePg } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";

import * as schema from "./schema";

// DBの型定義
type Database = PostgresJsDatabase<typeof schema> | NeonHttpDatabase<typeof schema>;

// ローカル開発環境用のDB接続
const createLocalDb = (): PostgresJsDatabase<typeof schema> => {
  const pgDriver = postgres(process.env.DATABASE_URL as string);
  return drizzlePg({ client: pgDriver, schema, casing: "snake_case" });
};

// プレビュー/本番環境用のDB接続
const createNeonDb = (): NeonHttpDatabase<typeof schema> => {
  const sql = neon(process.env.DATABASE_URL as string);
  return drizzleNeon({ client: sql, schema, casing: "snake_case" });
};

// 環境に応じたDBインスタンスを生成
export const db: Database = process.env.NODE_ENV === "development"
  ? createLocalDb()
  : createNeonDb();
