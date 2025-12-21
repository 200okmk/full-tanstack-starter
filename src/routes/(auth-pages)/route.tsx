import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { authQueryOptions } from "~/queries/auth";

export const Route = createFileRoute("/(auth-pages)")({
  component: RouteComponent,
  beforeLoad: async ({ context: { queryClient } }) => {
    const DEFAULT_REDIRECT_URL = "/dashboard";

    const sessionUser = await queryClient.ensureQueryData({
      ...authQueryOptions(),
      revalidateIfStale: true,
    });
    // セッションユーザーが存在する場合はデフォルトのリダイレクト先へ
    if (sessionUser) {
      redirect({
        to: DEFAULT_REDIRECT_URL,
      });
    }
    // `/(auth-pages)`配下でDEFAULT_REDIRECT_URLを使い回すためにcontextに含める
    return {
      defaultRedirectUrl: DEFAULT_REDIRECT_URL,
    };
  },
});

function RouteComponent() {
  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
