import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, getSession } = createAuthClient({
  baseURL: import.meta.env.VITE_BASE_URL,
});
