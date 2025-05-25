import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";

import { db } from "~/lib/db";

// Netlify環境変数の取得（TanStack Start対応）
function getBaseURL(): string {
  // デバッグ用：すべての環境変数を確認
  console.log("=== Environment Variables Debug ===");
  console.log("BASE_URL:", process.env.BASE_URL);
  console.log("CONTEXT:", process.env.CONTEXT);
  console.log("DEPLOY_PRIME_URL:", process.env.DEPLOY_PRIME_URL);
  console.log("URL:", process.env.URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("NETLIFY:", process.env.NETLIFY);

  // 1. 通常の環境変数から取得を試行
  let baseURL = process.env.BASE_URL;

  // 2. Netlify.envが利用可能な場合（Netlify Functions環境）
  try {
    // @ts-expect-error Netlify global is only available in Netlify Functions runtime
    if (typeof globalThis !== 'undefined' && globalThis.Netlify?.env) {
      // @ts-expect-error Netlify.env.get is not typed but available in runtime
      const netlifyBaseURL = globalThis.Netlify.env.get('BASE_URL');
      console.log("Netlify.env BASE_URL:", netlifyBaseURL);
      baseURL = baseURL || netlifyBaseURL;
    }
  } catch (error) {
    console.log("Netlify.env not available:", error);
  }

  // 3. Netlifyの自動変数から直接取得を試行
  if (!baseURL || baseURL.includes('${')) {
    console.log("BASE_URL contains template or is undefined, trying auto variables...");

    // Deploy Preview環境の場合
    if (process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'branch-deploy') {
      baseURL = process.env.DEPLOY_PRIME_URL;
      console.log("Using DEPLOY_PRIME_URL:", baseURL);
    } else if (process.env.CONTEXT === 'production') {
      baseURL = process.env.URL;
      console.log("Using URL:", baseURL);
    } else {
      // CONTEXTが設定されていない場合、URLから推測
      const currentURL = process.env.URL;
      if (currentURL && currentURL.includes('--')) {
        // プレビュー環境のURL形式の場合
        baseURL = currentURL;
        console.log("Inferred preview URL:", baseURL);
      } else if (currentURL) {
        // 本番環境のURL
        baseURL = currentURL;
        console.log("Using production URL:", baseURL);
      }
    }
  }

  // 4. 最終フォールバック（開発環境）
  if (!baseURL || baseURL.includes('${')) {
    if (process.env.NODE_ENV === 'development') {
      baseURL = 'http://localhost:3000';
      console.log("Using development fallback:", baseURL);
    } else {
      console.error("=== FAILED TO RESOLVE BASE_URL ===");
      console.error("All available env vars:", Object.keys(process.env).filter(key =>
        key.includes('URL') || key.includes('NETLIFY') || key.includes('CONTEXT')
      ).map(key => `${key}: ${process.env[key]}`));

      throw new Error(`Invalid base URL configuration. BASE_URL: ${process.env.BASE_URL}, CONTEXT: ${process.env.CONTEXT}, DEPLOY_PRIME_URL: ${process.env.DEPLOY_PRIME_URL}, URL: ${process.env.URL}`);
    }
  }

  console.log("=== Final resolved BASE_URL:", baseURL, "===");
  return baseURL;
}

// デバッグ用：環境変数の値を確認
const baseURL = getBaseURL();

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
