import { createAuthClient } from "better-auth/react";

const authClient = createAuthClient({
  baseURL: process.env.URL ?? "http://localhost:3000",
});

export default authClient;
