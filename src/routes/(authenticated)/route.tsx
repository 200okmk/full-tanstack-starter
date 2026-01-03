import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { setResponseStatus } from "@tanstack/react-start/server";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth-client";
import { authQueryOptions } from "~/queries/auth";

// 認証保護するルートは、この `~/(authenticated)/`ディレクトリ配下に配置していく。
export const Route = createFileRoute("/(authenticated)")({
  component: AuthenticatedLayout,
  beforeLoad: async ({ context: { queryClient }, location }) => {
    const sessionUser = await queryClient.ensureQueryData(authQueryOptions());
    if (!sessionUser) {
      setResponseStatus(401);
      throw redirect({ to: "/login", search: { redirect: location.href } });
    }
    return { sessionUser };
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
        routes/(authenticated)/route.tsx
      </pre>

      <div className="flex flex-col items-center gap-2">
        <p>{sessionUser?.name}</p>
        <Button type="button" asChild className="mb-2 w-fit" size="lg">
          <Link to="/dashboard">ダッシュボードへ</Link>
        </Button>
        <div className="text-center text-xs sm:text-sm">
          セッションユーザー:
          <pre className="max-w-screen overflow-x-auto px-2 text-start">
            {JSON.stringify(sessionUser, null, 2)}
          </pre>
        </div>

        <Button
          onClick={() => {
            void (async () => {
              await authClient.signOut();
              // Tanstack Queryのキャッシュを無効化
              await queryClient.invalidateQueries({ queryKey: ["session-user"] });
              await router.invalidate();
              void navigate({ to: "/login" });
            })();
          }}
          type="button"
          className="w-fit"
          variant="destructive"
          size="lg"
        >
          ログアウト
        </Button>
      </div>

      <div className="">
        <Outlet />
      </div>
    </div>
  );
}
