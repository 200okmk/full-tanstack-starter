import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getWebRequest } from "@tanstack/react-start/server";
import { Button } from "~/components/ui/button";
import { auth } from "~/lib/auth";
import { signOut } from "~/lib/auth-client";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
}

const getSessionUser = createServerFn({ method: "GET" }).handler(async () => {
  const { headers } = getWebRequest()!;
  const session = await auth.api.getSession({ headers });

  return session?.user ?? null;
});

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context }) => {
    const sessionUser = await context.queryClient.ensureQueryData<SessionUser | null>({
      queryKey: ["session-user"],
      queryFn: () => getSessionUser(),
    });

    if (!sessionUser) {
      throw redirect({
        to: "/auth/login",
      });
    }

    return { sessionUser };
  },
});

function AuthenticatedLayout() {
  const { queryClient, sessionUser } = Route.useRouteContext();
  const navigate = useNavigate();

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 rounded-md p-4 outline-2 outline-gray-200">
      <h1 className="text-2xl font-bold md:text-4xl">認証保護 Layout</h1>
      <pre className="bg-card text-card-foreground rounded-md border p-1">
        routes/_authenticated/route.tsx
      </pre>

      <div className="flex flex-col items-center gap-2">
        <p>Welcome back, {sessionUser.name}!</p>
        <Button type="button" asChild className="mb-2 w-fit" size="lg">
          <Link to="/dashboard">Go to Dashboard</Link>
        </Button>
        <div className="text-center text-xs sm:text-sm">
          Session user:
          <pre className="max-w-screen overflow-x-auto px-2 text-start">
            {JSON.stringify(sessionUser, null, 2)}
          </pre>
        </div>

        <Button
          onClick={() => {
            void (async () => {
              await signOut();
              // Tanstack Queryのキャッシュを無効化
              await queryClient.invalidateQueries({ queryKey: ["session-user"] });
              void navigate({ to: "/auth/login" });
            })();
          }}
          type="button"
          className="w-fit"
          variant="destructive"
          size="lg"
        >
          Sign out
        </Button>
      </div>

      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
