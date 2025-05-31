import { createAuthClient } from "better-auth/react";

// クライアントサイドでのbaseURL決定（最適化版）
const getClientBaseURL = (): string => {
  // 開発環境：NetlifyのURL環境変数を優先、フォールバックでlocalhost
  if (process.env.NODE_ENV === "development") {
    return process.env.URL || "http://localhost:3000";
  }

  // 本番・プレビュー環境：windowのoriginを使用（同一ドメインの場合）
  const baseURL = typeof window !== "undefined" ? window.location.origin : "";
  return baseURL;
};


export const authClient = createAuthClient({
  baseURL: getClientBaseURL(),
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;

console.log("=== Auth Client Configuration ===");
console.log("Environment:", typeof window === "undefined" ? "server" : "client");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("baseURL:", getClientBaseURL());