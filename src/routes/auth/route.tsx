import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: RouteComponent,
  beforeLoad: ({ context }) => {
    const DEFAULT_REDIRECT_URL = "/dashboard";
    // セッションユーザーが存在する場合はデフォルトのリダイレクト先へ
    if (context.sessionUser) {
      redirect({
        to: DEFAULT_REDIRECT_URL,
      });
    }
    // `/auth`配下でDEFAULT_REDIRECT_URLを使い回すためにcontextに含める
    return {
      redirectUrl: DEFAULT_REDIRECT_URL,
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
