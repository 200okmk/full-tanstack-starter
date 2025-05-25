import { createAuthClient } from "better-auth/react";

// TanStack StartでのbaseURL解決（SSR/クライアント両対応）
function getClientBaseURL(): string | undefined {
  // 1. ブラウザ環境では現在のoriginを使用（最も確実）
  if (typeof window !== 'undefined') {
    const baseURL = window.location.origin;
    console.log('Auth Client BaseURL (browser):', baseURL);
    return baseURL;
  }

  // 2. SSR環境での処理
  if (typeof process !== 'undefined' && process.env) {
    console.log('Auth Client SSR environment variables:');
    console.log('  CONTEXT:', process.env.CONTEXT);
    console.log('  DEPLOY_PRIME_URL:', process.env.DEPLOY_PRIME_URL);
    console.log('  URL:', process.env.URL);
    console.log('  BASE_URL:', process.env.BASE_URL);

    // Netlifyの自動変数から取得を試行
    if (process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'branch-deploy') {
      const url = process.env.DEPLOY_PRIME_URL;
      if (url && !url.includes('${')) {
        console.log('Auth Client BaseURL (SSR - preview):', url);
        return url;
      }
    } else if (process.env.CONTEXT === 'production') {
      const url = process.env.URL;
      if (url && !url.includes('${')) {
        console.log('Auth Client BaseURL (SSR - production):', url);
        return url;
      }
    }

    // BASE_URL環境変数が正しく設定されている場合
    if (process.env.BASE_URL && !process.env.BASE_URL.includes('${')) {
      console.log('Auth Client BaseURL (SSR - env):', process.env.BASE_URL);
      return process.env.BASE_URL;
    }

    // 開発環境のフォールバック
    if (process.env.NODE_ENV === 'development') {
      const devURL = 'http://localhost:3000';
      console.log('Auth Client BaseURL (SSR - dev):', devURL);
      return devURL;
    }
  }

  // 3. SSR環境での最終フォールバック
  // undefinedを返してBetterAuthに相対パスを使用させる
  console.log('Auth Client BaseURL (SSR - fallback): undefined (relative paths)');
  return undefined;
}

// AuthClientを作成
const baseURL = getClientBaseURL();

console.log('=== Auth Client Configuration ===');
console.log('Environment:', typeof window !== 'undefined' ? 'browser' : 'server');
console.log('Final BaseURL:', baseURL);

const authClient = createAuthClient({
  baseURL: baseURL,
});

export default authClient;
