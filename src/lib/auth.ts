import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { reactStartCookies } from "better-auth/react-start";
import { getWebRequest } from "@tanstack/react-start/server";

import { db } from "~/lib/db";

// TanStack Start + Netlify環境でのbaseURL動的解決
function getBaseURL(): string {
  // デバッグ用：環境変数を確認
  console.log("=== Environment Variables Debug ===");
  console.log("BASE_URL:", process.env.BASE_URL);
  console.log("CONTEXT:", process.env.CONTEXT);
  console.log("DEPLOY_PRIME_URL:", process.env.DEPLOY_PRIME_URL);
  console.log("URL:", process.env.URL);
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("NETLIFY:", process.env.NETLIFY);

  // 1. リクエストヘッダーからの動的取得（最優先）
  try {
    const webRequest = getWebRequest();
    if (webRequest) {
      const { headers } = webRequest;
      const host = headers.get('host');
      const protocol = headers.get('x-forwarded-proto') || 'https';

      if (host) {
        const dynamicBaseURL = `${protocol}://${host}`;
        console.log("=== Dynamic baseURL from request headers:", dynamicBaseURL, "===");
        return dynamicBaseURL;
      }
    }
  } catch (error) {
    console.log("getWebRequest not available (likely static initialization):", error);
  }

  // 2. 環境変数からの取得（フォールバック）
  let baseURL = process.env.BASE_URL;

  // 3. Netlify.envが利用可能な場合
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

  // 4. Netlifyの自動変数から直接取得を試行（Functions環境では利用不可）
  if (!baseURL || baseURL.includes('${')) {
    console.log("BASE_URL contains template or is undefined, trying auto variables...");

    // Deploy Preview環境の場合
    if (process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'branch-deploy') {
      const deployPrimeURL = process.env.DEPLOY_PRIME_URL;
      // 環境変数が正しく展開されている場合のみ使用
      if (deployPrimeURL && !deployPrimeURL.includes('${')) {
        baseURL = deployPrimeURL;
        console.log("Using DEPLOY_PRIME_URL:", baseURL);
      }
    } else if (process.env.CONTEXT === 'production') {
      const productionURL = process.env.URL;
      if (productionURL && !productionURL.includes('${')) {
        baseURL = productionURL;
        console.log("Using URL:", baseURL);
      }
    } else {
      // CONTEXTが設定されていない場合、URLから推測
      const currentURL = process.env.URL;
      if (currentURL && currentURL.includes('--') && !currentURL.includes('${')) {
        // プレビュー環境のURL形式の場合
        baseURL = currentURL;
        console.log("Inferred preview URL:", baseURL);
      } else if (currentURL && !currentURL.includes('${')) {
        // 本番環境のURL
        baseURL = currentURL;
        console.log("Using production URL:", baseURL);
      }
    }
  }

  // 5. 最終フォールバック（開発環境）
  if (!baseURL || baseURL.includes('${')) {
    if (process.env.NODE_ENV === 'development') {
      baseURL = 'http://localhost:3000';
      console.log("Using development fallback:", baseURL);
    } else {
      console.error("=== FAILED TO RESOLVE BASE_URL ===");
      console.error("All available env vars:", Object.keys(process.env).filter(key =>
        key.includes('URL') || key.includes('NETLIFY') || key.includes('CONTEXT')
      ).map(key => `${key}: ${process.env[key]}`));

      // より詳細なエラーメッセージ
      const errorDetails = {
        BASE_URL: process.env.BASE_URL,
        CONTEXT: process.env.CONTEXT,
        DEPLOY_PRIME_URL: process.env.DEPLOY_PRIME_URL,
        URL: process.env.URL,
        NODE_ENV: process.env.NODE_ENV,
        NETLIFY: process.env.NETLIFY
      };

      throw new Error(`Invalid base URL configuration. Environment details: ${JSON.stringify(errorDetails, null, 2)}`);
    }
  }

  console.log("=== Final resolved BASE_URL:", baseURL, "===");
  return baseURL;
}

// BetterAuth設定を関数として定義（動的baseURL対応）
function createAuth() {
  try {
    const baseURL = getBaseURL();

    console.log("=== BetterAuth Configuration ===");
    console.log("BaseURL:", baseURL);
    console.log("Secret available:", !!process.env.BETTER_AUTH_SECRET);
    console.log("GitHub credentials available:", !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET));
    console.log("Google credentials available:", !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET));

    return betterAuth({
      database: drizzleAdapter(db, {
        provider: "pg",
      }),
      // 動的に解決されたbaseURLを使用
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
  } catch (error) {
    console.error("=== BetterAuth Initialization Error ===");
    console.error("Error:", error);
    console.error("Environment variables:", {
      BASE_URL: process.env.BASE_URL,
      BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET ? '[SET]' : '[NOT SET]',
      DATABASE_URL: process.env.DATABASE_URL ? '[SET]' : '[NOT SET]',
      NODE_ENV: process.env.NODE_ENV,
    });
    throw error;
  }
}

// 動的にBetterAuthインスタンスを作成
export const auth = createAuth();
