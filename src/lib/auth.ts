import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/lib/db";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // このファイルでは省略可能。デプロイしたプラットフォームのダッシュボードには設定必須
  baseURL: process.env.BETTER_AUTH_URL,
  // このファイルでは省略可能。デプロイしたプラットフォームのダッシュボードには設定必須
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
