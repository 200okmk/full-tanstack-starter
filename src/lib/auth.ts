import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/lib/db";

console.log("=== Auth Configuration ===");
console.log("URL:", process.env.URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

// Netlify Functions環境変数の詳細デバッグ
console.log("=== Netlify Functions Debug ===");
console.log("SITE_NAME:", process.env.SITE_NAME);
console.log("SITE_ID:", process.env.SITE_ID);
console.log("All env keys:", Object.keys(process.env).filter(key =>
  key.includes('URL') ||
  key.includes('DEPLOY') ||
  key.includes('NETLIFY') ||
  key.includes('CONTEXT') ||
  key.includes('SITE')
));

// 静的なauth設定
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
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