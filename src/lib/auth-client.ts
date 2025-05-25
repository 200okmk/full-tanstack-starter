import { createAuthClient } from "better-auth/react";

// TanStack StartでのbaseURL解決（SSR/クライアント両対応）
function getClientBaseURL(): string {
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

  // 3. 最終フォールバック
  // SSR時にbaseURLが解決できない場合は相対パスを使用
  // クライアントサイドでハイドレーション時に正しいoriginが設定される
  console.log('Auth Client BaseURL (SSR - fallback): empty string (relative paths)');
  return '';
}

// 動的にAuthClientを作成する関数
function createDynamicAuthClient() {
  const baseURL = getClientBaseURL();

  // デバッグ用ログ
  console.log('=== Auth Client Configuration ===');
  console.log('Environment:', typeof window !== 'undefined' ? 'browser' : 'server');
  console.log('Final BaseURL:', baseURL);

  return createAuthClient({
    baseURL: baseURL,
  });
}

// 初期化時にAuthClientを作成
const authClient = createDynamicAuthClient();

// ブラウザ環境でのハイドレーション後に再初期化
if (typeof window !== 'undefined') {
  // ハイドレーション後にbaseURLを再確認
  const currentOrigin = window.location.origin;
  console.log('Browser hydration - current origin:', currentOrigin);

  // もしSSR時とブラウザ時でbaseURLが異なる場合は警告
  const ssrBaseURL = getClientBaseURL();
  if (ssrBaseURL && ssrBaseURL !== currentOrigin) {
    console.warn('BaseURL mismatch between SSR and browser:', {
      ssr: ssrBaseURL,
      browser: currentOrigin
    });
  }
}

export default authClient;
