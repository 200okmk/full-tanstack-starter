import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/lib/db";

// デバッグ用：環境変数の値を確認
console.log("BASE_URL:", process.env.BASE_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // BASE_URL環境変数を使用（Netlifyダッシュボードで設定）
  baseURL: process.env.BASE_URL,
  // BETTER_AUTH_SECRET環境変数を使用（Netlifyダッシュボードで設定）
  secret: process.env.BETTER_AUTH_SECRET,

  // https://www.better-auth.com/docs/integrations/tanstack#usage-tips
  // make sure this is the last plugin in the array
  plugins: [reactStartCookies()],

  // https://www.better-auth.com/docs/concepts/session-management#session-caching
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  // https://www.better-auth.com/docs/concepts/oauth
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

  // https://www.better-auth.com/docs/authentication/email-password
  emailAndPassword: {
    enabled: true,
  },
});
