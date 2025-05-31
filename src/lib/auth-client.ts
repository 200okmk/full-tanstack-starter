import { createAuthClient } from "better-auth/react";

console.log("=== Auth Client Configuration ===");
console.log("Environment:", typeof window === "undefined" ? "server" : "client");
console.log("NODE_ENV:", process.env.NODE_ENV);

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

const clientBaseURL = getClientBaseURL();
console.log("clientBaseURL:", clientBaseURL);

export const authClient = createAuthClient({
  baseURL: clientBaseURL,
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
