import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs));
}

/**
 * ローカル開発環境かどうかを判定
 */
export const isLocalEnvironment = (): boolean => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  }
  return process.env.NODE_ENV === 'development';
}

/**
 * Netlifyプレビュー環境かどうかを判定
 * Deploy Preview: deploy-preview-{PR番号}--{サイト名}.netlify.app
 * Branch Deploy: {ブランチ名}--{サイト名}.netlify.app (プロダクション以外)
 */
export const isNetlifyPreviewEnvironment = (url: string = process.env.URL || ''): boolean => {
  if (!url) return false;

  // Deploy Preview パターンの検出
  if (url.includes('deploy-preview-')) {
    return true;
  }

  // Branch Deploy パターンの検出
  // netlify.appドメインで、かつ--が含まれている（ブランチデプロイ）
  if (url.includes('.netlify.app') && url.includes('--')) {
    // プロダクションURL（--が含まれないパターン）ではない場合
    const domain = url.replace(/^https?:\/\//, '');
    const parts = domain.split('--');
    // プロダクションの場合は {サイト名}.netlify.app の形式なので--は含まれない
    // ブランチデプロイの場合は {ブランチ名}--{サイト名}.netlify.app の形式
    return parts.length > 1;
  }

  return false;
}

/**
 * プロダクション環境かどうかを判定
 */
export const isProductionEnvironment = (url: string = process.env.URL || ''): boolean => {
  return !isLocalEnvironment() && !isNetlifyPreviewEnvironment(url);
}

/**
 * OAuth認証用のリダイレクトURLを生成
 * プレビュー環境の場合はプロダクションURLを使用（OAuth Proxyのため）
 * それ以外は現在のURLを使用
 */
export const getOAuthRedirectURL = (provider: string, productionUrl: string): string => {
  const currentUrl = process.env.URL || 'http://localhost:3000';

  if (isNetlifyPreviewEnvironment(currentUrl)) {
    // プレビュー環境ではプロダクションURLを使用（OAuth Proxyが処理）
    return `${productionUrl}/api/auth/callback/${provider}`;
  }

  // ローカル・プロダクション環境では現在のURLを使用
  return `${currentUrl}/api/auth/callback/${provider}`;
}

// プロダクション環境のURL（プロキシサーバーとして使用）
// process.env.URLパターンからプロダクションURLを推定
export const getProductionURL = (): string => {
  const currentUrl = process.env.URL || 'http://localhost:3000';

  // 既にプロダクションURLの形式の場合はそのまま使用
  if (!currentUrl.includes('--') && currentUrl.includes('.netlify.app')) {
    return currentUrl;
  }

  // プレビュー環境の場合、サイト名を抽出してプロダクションURLを構築
  if (currentUrl.includes('.netlify.app')) {
    const domain = currentUrl.replace(/^https?:\/\//, '');
    const siteName = domain.split('--').pop()?.replace('.netlify.app', '');
    if (siteName) {
      return `https://${siteName}.netlify.app`;
    }
  }

  // フォールバック（環境変数で明示的に指定されている場合）
  return process.env.PRODUCTION_URL || currentUrl;
}
