import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

// https://tanstack.com/start/latest/docs/framework/react/middleware
// This is a sample middleware that you can use in your server functions.

/**
 * 認証状態であることが必要なServer Functionに対して認証チェックを行い、セッション情報をコンテキストに追加するミドルウェア。認証状態でない場合はリダイレクトしてログイン画面に遷移する。
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getWebRequest()!;

  const session = await auth.api.getSession({
    headers: request.headers, // request.headersを直接渡す
    query: {
      // ミドルウェアとして厳格に認証状態を保証するため、Cookieキャッシュからではなくデータベースから直接セッションを取得する。Cookieキャッシュも更新される（https://www.better-auth.com/docs/concepts/session-management#session-caching）。
      disableCookieCache: true,
    },
  });

  if (!session) {
    throw redirect({
      to: "/auth/login",
      search: {
        redirect: request.url,
      },
    });
  }

  return next({ context: { sessionUser: session.user } });
});
