import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

// セッションユーザーを取得するServer Function
export const getSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  return session?.user ?? null;
});

export const authClient = createAuthClient({
  // 開発環境のみbaseURLを指定、本番は同一ドメインなので不要
  ...(process.env.NODE_ENV === "development" && {
    baseURL: "http://localhost:3000",
  }),
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
