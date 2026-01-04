import { queryOptions } from "@tanstack/react-query";

import { createServerFn } from "@tanstack/react-start";
import { getRequest, setResponseHeader } from "@tanstack/react-start/server";
import { auth } from "~/lib/auth";

export type SessionUser = Awaited<ReturnType<typeof getSessionUser>>;

export const getSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const session = await auth.api.getSession({
    headers: getRequest().headers,
    returnHeaders: true,
  });

  // セッション有効期限の延長、Cookieキャッシュの更新などのため、Set-Cookie ヘッダーをTanStack Startのレスポンスヘッダー（クライアント）に転送する。
  const cookies = session.headers?.getSetCookie();
  if (cookies?.length) {
    setResponseHeader("Set-Cookie", cookies);
  }

  return session.response?.user || null;
});

// セッションユーザーを取得するには、queryClientにて毎回この authQueryOptions を呼び出してTanstack Queryのキャッシュを使用する。
export const authQueryOptions = () =>
  queryOptions({
    queryKey: ["session-user"],
    queryFn: () => getSessionUser(),
  });
