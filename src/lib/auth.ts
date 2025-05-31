import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/lib/db";

console.log("=== Environment Variables Debug ===");
console.log("URL:", process.env.URL);
console.log("NODE_ENV:", process.env.NODE_ENV);

// 静的なauth設定に変更
export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // process.env.URLを使用（Netlifyランタイムで利用可能）
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

console.log("=== BetterAuth Configuration ===");
console.log("BaseURL:", process.env.URL || "http://localhost:3000");
console.log("Secret available:", !!process.env.BETTER_AUTH_SECRET);
console.log(
  "GitHub credentials available:",
  !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
);
console.log(
  "Google credentials available:",
  !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
);
