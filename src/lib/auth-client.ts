import { createAuthClient } from "better-auth/react";

// TanStack StartでのbaseURL解決（SSR/クライアント両対応）
function getClientBaseURL(): string {
  // 1. ブラウザ環境では現在のoriginを使用（最も確実）
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }

  // 2. SSR環境での処理
  // TanStack StartのSSR時は、リクエストコンテキストから取得するのが理想的だが、
  // auth-clientは静的に初期化されるため、環境変数から推測する必要がある
  if (typeof process !== 'undefined' && process.env) {
    // Netlifyの自動変数から取得を試行
    if (process.env.CONTEXT === 'deploy-preview' || process.env.CONTEXT === 'branch-deploy') {
      const url = process.env.DEPLOY_PRIME_URL;
      if (url && !url.includes('${')) {
        return url;
      }
    } else if (process.env.CONTEXT === 'production') {
      const url = process.env.URL;
      if (url && !url.includes('${')) {
        return url;
      }
    }

    // BASE_URL環境変数が正しく設定されている場合
    if (process.env.BASE_URL && !process.env.BASE_URL.includes('${')) {
      return process.env.BASE_URL;
    }
  }

  // 3. 最終フォールバック
  // SSR時にbaseURLが解決できない場合は相対パスを使用
  // クライアントサイドでハイドレーション時に正しいoriginが設定される
  return '';
}

const baseURL = getClientBaseURL();

// デバッグ用ログ（開発環境のみ）
if (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') {
  console.log('Auth Client BaseURL:', baseURL);
  console.log('Environment:', typeof window !== 'undefined' ? 'browser' : 'server');
}

const authClient = createAuthClient({
  baseURL: baseURL,
});

export default authClient;
