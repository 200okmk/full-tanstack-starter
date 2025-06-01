import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/lib/db";
import { usersTable } from "~/lib/db/schemas/public.schema";
import {
  sessionsTable,
  accountsTable,
  verificationTokensTable
} from "~/lib/db/schemas/auth.schema";

console.log("=== Auth Configuration ===");
console.log("URL:", process.env.URL);
console.log("NODE_ENV:", process.env.NODE_ENV);


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
  baseURL: process.env.URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  emailAndPassword: {
    enabled: true,
  },
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
  plugins: [
    reactStartCookies(), // For TanStack Start Cookie support
  ],
});
