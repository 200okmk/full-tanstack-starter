import { useMutation } from "@tanstack/react-query";
import { ClientOnly, createFileRoute, Link } from "@tanstack/react-router";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { useTheme } from "~/components/ThemeProvider";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { GithubDark } from "~/components/ui/svgs/githubDark";
import { GithubLight } from "~/components/ui/svgs/githubLight";
import { Google } from "~/components/ui/svgs/google";
import authClient from "~/lib/auth-client";
import { SocialLoginButton } from "./-components/SocialLoginButton";

export const Route = createFileRoute("/(auth-pages)/login")({
  validateSearch: z.object({
    // ログイン成功後、直前にいたページにユーザーを戻してあげるための`redirect` Search Paramを検証
    redirect: z.string().optional(),
  }),
  component: LoginForm,
});

function LoginForm() {
  // defaultRedirectUrlは定数として事前に設定しておいたリダイレクト先(デフォルトでは `/dashboard`)
  const { defaultRedirectUrl } = Route.useRouteContext();
  const search = Route.useSearch();
  const { theme } = useTheme();

  const emailLoginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) =>
      await authClient.signIn.email(
        {
          ...data,
          callbackURL: search.redirect ?? defaultRedirectUrl,
        },
        {
          onError: ({ error }) => {
            toast.error("ログインに失敗しました。", {
              description: error.message,
            });
          },
        },
      ),
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (emailLoginMutation.isPending) return;

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    if (!email || !password) return;

    emailLoginMutation.mutate({ email, password });
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <h1 className="text-xl font-bold">ログイン</h1>
          <div className="flex flex-col gap-5">
            <div className="grid gap-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="hello@example.com"
                readOnly={emailLoginMutation.isPending}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                name="password"
                type="password"
                readOnly={emailLoginMutation.isPending}
                required
              />
            </div>
            <Button
              type="submit"
              className="mt-2 w-full"
              size="lg"
              disabled={emailLoginMutation.isPending}
            >
              {emailLoginMutation.isPending && <LoaderCircle className="animate-spin" />}
              {emailLoginMutation.isPending ? "ログイン中..." : "ログイン"}
            </Button>
          </div>
          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              または
            </span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <SocialLoginButton
              provider="google"
              callbackURL={search.redirect ?? defaultRedirectUrl}
              disabled={emailLoginMutation.isPending}
              icon={<Google />}
            />
            <SocialLoginButton
              provider="github"
              callbackURL={search.redirect ?? defaultRedirectUrl}
              disabled={emailLoginMutation.isPending}
              icon={
                <ClientOnly>
                  {theme === "dark" ? <GithubDark /> : <GithubLight />}
                </ClientOnly>
              }
            />
          </div>
        </div>
      </form>

      <div className="text-center text-sm">
        アカウントをお持ちでない方は{" "}
        <Link to="/signup" className="underline underline-offset-4">
          新規登録
        </Link>
      </div>
    </div>
  );
}
