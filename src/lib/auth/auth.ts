import { betterAuth, BetterAuthPlugin } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";

import { db } from "~/db";
import {
  accountsTable,
  sessionsTable,
  usersTable,
  verificationTokensTable,
} from "~/db/schema";

// 静的なauth設定
export const auth = betterAuth({
  // process.env.URLを使用（Netlifyランタイムで動的に取得可能）
  baseURL: process.env.URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  session: {
    // DBへのリクエスト回数を減らすための、セッションのキャッシュ設定（https://www.better-auth.com/docs/concepts/session-management#session-caching）。
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5分間
    },
    // セッションが使用され、updateAge に達すると、セッションの有効期限は現在時刻に expiresIn 値を加えた値に延長される（https://www.better-auth.com/docs/concepts/session-management#session-expiration）。
    expiresIn: 60 * 60 * 24 * 30, // 30日間（デフォルトは7日間）
    updateAge: 60 * 60 * 24, // 1日ごとにセッションを更新する
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationTokensTable,
    },
  }),
  plugins: [
    // Netlifyプレビュー環境の動的URL上からもOAuth認証を可能にするために本番のURLへリダイレクトする。
    oAuthProxy(),
    // plugins内では必ず最後にこれを配置する（https://www.better-auth.com/docs/integrations/tanstack#usage-tips）。
    tanstackStartCookies() as unknown as BetterAuthPlugin,
  ],
  // OAuth認証プロバイダーの設定
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // メールアドレスとパスワード認証。デフォルトでは暗黙的に false。
  emailAndPassword: {
    enabled: true,
  },
});
