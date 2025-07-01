import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { oAuthProxy } from "better-auth/plugins";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/db";
import {
  accountsTable,
  sessionsTable,
  verificationTokensTable,
} from "~/db/schemas/auth.schema";
import { usersTable } from "~/db/schemas/public.schema";
import { getOAuthRedirectURL, getProductionURL } from "~/lib/utils";

const productionURL = getProductionURL();

// 静的なauth設定
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: usersTable,
      session: sessionsTable,
      account: accountsTable,
      verification: verificationTokensTable,
    },
  }),
  // process.env.URLを使用（Netlifyランタイムで安定して利用可能）
  baseURL: process.env.URL ?? "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      // Netlifyが自動ビルドしたプレビュー環境の場合は本番のURLへリダイレクトする
      redirectURL: getOAuthRedirectURL("github", productionURL),
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Netlifyが自動ビルドしたプレビュー環境の場合は本番のURLへリダイレクトする
      redirectURL: getOAuthRedirectURL("google", productionURL),
    },
  },
  plugins: [
    oAuthProxy(), // Netlifyプレビュー環境の動的URL上からもOAuth認証を可能にするために本番のURLへリダイレクトする
    reactStartCookies(), // For TanStack Start Cookie support
  ],
});
