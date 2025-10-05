import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { signOut } from "~/lib/auth-client";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
  beforeLoad: ({ context }) => {
    if (!context.sessionUser) {
      throw redirect({
        to: "/auth/login",
      });
    }
    return { sessionUser: context.sessionUser };
  },
});

function AuthenticatedLayout() {
  const { queryClient, sessionUser } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();

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
              await router.invalidate();
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
