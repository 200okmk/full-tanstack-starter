import { createAuthClient } from "better-auth/react";

console.log("=== Auth Client Configuration ===");
console.log("Environment:", typeof window === "undefined" ? "server" : "client");
console.log("NODE_ENV:", process.env.NODE_ENV);

// ローカル開発環境での baseURL 決定
const getClientBaseURL = (): string | undefined => {
  // サーバーサイドレンダリング時
  if (typeof window === "undefined") {
    if (process.env.NODE_ENV === "development") {
      return process.env.URL || "http://localhost:3000";
    }
    // SSR時はundefinedを返し、相対パスでAPIにアクセス
    return undefined;
  }

  // クライアントサイド時
  if (process.env.NODE_ENV === "development") {
    return process.env.VITE_BASE_URL || "http://localhost:3000";
  }

  // 本番環境のクライアントサイドでは相対パス
  return undefined;
};

const clientBaseURL = getClientBaseURL();
console.log("Final BaseURL:", clientBaseURL || "undefined (relative paths)");

export const authClient = createAuthClient({
  baseURL: clientBaseURL, // undefinedの場合は相対パスでAPIアクセス
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
