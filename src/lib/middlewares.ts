import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import {
  getRequest,
  setResponseHeader,
  setResponseStatus,
} from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

/**
 * 認証済み状態を必要とするServer Functionの実行時に認証チェックを行い、セッション情報をコンテキストに追加するミドルウェア。認証状態でない場合はリダイレクトしてログイン画面に遷移する(https://tanstack.com/start/latest/docs/framework/react/guide/middleware)。
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    returnHeaders: true,
    query: {
      // ミドルウェアとして厳格に認証状態を保証するため、Cookieキャッシュからではなくデータベースから直接セッションを取得する。Cookieキャッシュも更新される（https://www.better-auth.com/docs/concepts/session-management#session-caching）。
      disableCookieCache: true,
    },
  });

  // セッション有効期限の延長、Cookieキャッシュの更新などのため、Set-Cookie ヘッダーをTanStack Startのレスポンスヘッダー（クライアント）に転送する。
  const cookies = session.headers?.getSetCookie();
  if (cookies?.length) {
    setResponseHeader("Set-Cookie", cookies);
  }

  // この認証ミドルウェアの本体部分。
  if (!session.response?.user) {
    setResponseStatus(401);
    // 認証状態でない場合はリダイレクトしてログイン画面に遷移する。
    throw redirect({
      to: "/login",
      // ログイン後に元のページに戻れるようにリダイレクト先を保存。
      search: {
        redirect: getRequest().url,
      },
    });
  }

  return next({ context: { sessionUser: session.response?.user } });
});
