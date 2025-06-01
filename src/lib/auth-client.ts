import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // 開発環境のみbaseURLを指定、本番は同一ドメインなので不要
  ...(process.env.NODE_ENV === "development" && {
    baseURL: "http://localhost:3000"
  }),
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;