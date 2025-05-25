import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/lib/db";

// Netlify環境変数の取得（TanStack Start対応）
function getBaseURL(): string {
  // 1. 通常の環境変数から取得を試行
  let baseURL = process.env.BASE_URL;

  // 2. Netlify.envが利用可能な場合（Netlify Functions環境）
  // @ts-expect-error Netlify global is only available in Netlify Functions runtime
  if (typeof globalThis !== 'undefined' && globalThis.Netlify?.env) {
    // @ts-expect-error Netlify.env.get is not typed but available in runtime
    baseURL = baseURL || globalThis.Netlify.env.get('BASE_URL');
  }

  // 3. Netlifyの自動変数から直接取得を試行
  if (!baseURL || baseURL.includes('${')) {
    // Deploy Preview環境の場合
    if (process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'branch-deploy') {
      baseURL = process.env.DEPLOY_PRIME_URL;
    } else if (process.env.CONTEXT === 'production') {
      baseURL = process.env.URL;
    }
  }

  // 4. 最終フォールバック（開発環境）
  if (!baseURL || baseURL.includes('${')) {
    if (process.env.NODE_ENV === 'development') {
      baseURL = 'http://localhost:3000';
    } else {
      throw new Error(`Invalid base URL configuration. BASE_URL: ${process.env.BASE_URL}, CONTEXT: ${process.env.CONTEXT}, DEPLOY_PRIME_URL: ${process.env.DEPLOY_PRIME_URL}, URL: ${process.env.URL}`);
    }
  }

  return baseURL;
}

// デバッグ用：環境変数の値を確認
const baseURL = getBaseURL();
console.log("Resolved BASE_URL:", baseURL);
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("CONTEXT:", process.env.CONTEXT);
console.log("DEPLOY_PRIME_URL:", process.env.DEPLOY_PRIME_URL);
console.log("URL:", process.env.URL);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  // 解決されたbaseURLを使用
  baseURL: baseURL,
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
