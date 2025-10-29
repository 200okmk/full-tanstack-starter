import { relations } from "drizzle-orm";
import { boolean, integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";
import { createSchemaFactory } from "drizzle-zod";
import { z } from "zod";

// ===========================================================================
// Schema Factory設定（`drizzle-zod`ライブラリによってDrizzleスキーマ全体に適用される統一的なルール。型強制coerceの自動適用など）
// ===========================================================================
const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({
    coerce: {
      date: true, // 日付型（文字列→Date）
      number: true, //数値型（文字列→数値）
      boolean: true, // ブール値の（"true"→true）
    },
    // インポートした拡張インスタンスを使用する場合
    // zodInstance: z,
  });

// ===========================================================================
// テーブル定義（認証関連のテーブルを切り出す複数スキーマ構成ができなかったため、1つのPublicスキーマ内にすべてのテーブルを定義している）
// ===========================================================================
// 命名規則: テーブルオブジェクト名はエンティティ複数形＋Table（`{entities}Table`）にし、各カラムのプロパティ名は`createdAt`のようにcamelCaseにする。一方、DB上の実テーブル名（pgTableの第1引数）は` verification_tokens`のように複数形snake_caseにし、各カラム名は単数系snake_caseにする。

// 認証関連
// ユーザー定義
export const usersTable = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const sessionsTable = pgTable("sessions", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
});

export const accountsTable = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

export const verificationTokensTable = pgTable("verification_tokens", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// アプリ本体関連
// 投稿
export const postsTable = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// コメント
export const commentsTable = pgTable("comments", {
  id: serial("id").primaryKey(),
  content: text("content").notNull(),
  postId: integer("post_id").references(() => postsTable.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// ===========================================================================
// リレーション定義
// ===========================================================================
// 命名規則：リレーションオブジェクト名はエンティティ複数形＋Relations（`{entities}Relations`）にする。

// 認証関連
export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
  accounts: many(accountsTable),
  posts: many(postsTable),
}));

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const accountsRelations = relations(accountsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [accountsTable.userId],
    references: [usersTable.id],
  }),
}));

// アプリ本体
export const postsRelations = relations(postsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id],
  }),
  comments: many(commentsTable),
}));

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id],
  }),
}));

// ===========================================================================
// Zodスキーマ定義（`drizzle-zod`ライブラリから生成）
// ===========================================================================
// 命名規則：各スキーマ名は `userSelectSchema`のように`{entity}{Operation}Schema`にする。
// 詳細は[drizzle-zodのドキュメント](https://orm.drizzle.team/docs/zod)を参照。

// users
export const userSelectSchema = createSelectSchema(usersTable);
export const userInsertSchema = createInsertSchema(usersTable, {
  name: (schema) => schema.min(1, "名前は必須です").max(100, "名前は100文字以内"),
  email: z.email("有効なメールアドレスを入力してください"),
});
export const userUpdateSchema = createUpdateSchema(usersTable);

// posts
export const postSelectSchema = createSelectSchema(postsTable);
export const postInsertSchema = createInsertSchema(postsTable, {
  title: (schema) => schema.min(1, "タイトルは必須").max(200, "タイトルは200文字以内"),
  content: (schema) =>
    schema.min(1, "コンテンツは必須").max(5000, "コンテンツは5000文字以内"),
});
export const postUpdateSchema = createUpdateSchema(postsTable);

// comments
export const commentSelectSchema = createSelectSchema(commentsTable);
export const commentInsertSchema = createInsertSchema(commentsTable, {
  content: (schema) =>
    schema.min(1, "コメント内容は必須").max(1000, "コメントは1000文字以内"),
});
export const commentUpdateSchema = createUpdateSchema(commentsTable);

// ===========================================================================
// TS型定義（上記のZodスキーマ定義から生成）
// ===========================================================================
// 命名規則：READ（SELECT）用のTS型名は `User`のように`{Entity}`にし, それ以外のTS型名は`{Entity}{Operation}`にする。

// users
export type User = z.infer<typeof userSelectSchema>;
export type UserCreate = z.infer<typeof userInsertSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

// sessions
export type Session = typeof sessionsTable.$inferSelect;
export type NewSession = typeof sessionsTable.$inferInsert;

// accounts
export type Account = typeof accountsTable.$inferSelect;
export type NewAccount = typeof accountsTable.$inferInsert;

// verificationTokens
export type VerificationToken = typeof verificationTokensTable.$inferSelect;
export type NewVerificationToken = typeof verificationTokensTable.$inferInsert;

// posts
export type Post = z.infer<typeof postSelectSchema>;
export type PostCreate = z.infer<typeof postInsertSchema>;
export type PostUpdate = z.infer<typeof postUpdateSchema>;

// comments
export type Comment = z.infer<typeof commentSelectSchema>;
export type CommentCreate = z.infer<typeof commentInsertSchema>;
export type CommentUpdate = z.infer<typeof commentUpdateSchema>;
