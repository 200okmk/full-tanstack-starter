import { createAuthClient } from "better-auth/react";

console.log("=== Auth Client Configuration ===");
console.log("Environment:", typeof window === "undefined" ? "server" : "client");
console.log("NODE_ENV:", process.env.NODE_ENV);

// ローカル開発環境での baseURL 決定
const getClientBaseURL = (): string | undefined => {
  // 開発環境では明示的なURL指定
  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  // 本番環境では相対パス（undefinedを返す）
  return undefined;
};

const clientBaseURL = getClientBaseURL();
console.log("Final BaseURL:", clientBaseURL || "undefined (relative paths)");

export const authClient = createAuthClient({
  baseURL: clientBaseURL, // undefinedの場合は相対パスでAPIアクセス
});

export const { signIn, signUp, signOut, useSession, getSession } = authClient;
