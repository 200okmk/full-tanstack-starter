import { createAPIFileRoute } from "@tanstack/react-start/api";
import { auth } from "~/lib/auth";

export const APIRoute = createAPIFileRoute("/api/auth/$")({
  GET: async ({ request }: { request: Request }) => {
    return auth.handler(request);
  },
  POST: async ({ request }: { request: Request }) => {
    return auth.handler(request);
  },
});
