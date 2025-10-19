import { redirect } from "@tanstack/react-router";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

// https://tanstack.com/start/latest/docs/framework/react/middleware
// This is a sample middleware that you can use in your server functions.

/**
 * Server Function実行時に認証を行い、セッションユーザーをコンテキストに追加するミドルウェア
 */
export const authMiddleware = createMiddleware().server(async ({ next }) => {
  const request = getWebRequest()!;

  const session = await auth.api.getSession({
    headers: request.headers, // request.headersを直接渡す
    query: {
      // Cookie キャッシュからではなくデータベースからセッションを取得し、Cookie キャッシュも更新するように強制する（https://www.better-auth.com/docs/concepts/session-management#session-caching）
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
