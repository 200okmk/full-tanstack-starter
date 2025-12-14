import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, getSession } = createAuthClient({
  baseURL: process.env.URL ?? "http://localhost:3000",
});
