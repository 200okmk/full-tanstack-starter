import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.URL ?? "http://localhost:3000",
});
