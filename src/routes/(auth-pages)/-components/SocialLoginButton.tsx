import { useMutation } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "~/components/ui/button";
import authClient from "~/lib/auth-client";

interface SocialLoginButtonProps {
  provider: string;
  icon: React.ReactNode;
  callbackURL: string;
  disabled?: boolean;
}

export function SocialLoginButton({
  provider,
  icon,
  callbackURL,
  disabled,
}: SocialLoginButtonProps) {
  const providerLabel =
    provider === "google"
      ? "Google"
      : // プロバイダーの最初の文字を大文字にし、残りの文字を小文字にする
        provider.charAt(0).toUpperCase() + provider.slice(1);

  const socialLoginMutation = useMutation({
    mutationFn: async () =>
      await authClient.signIn.social(
        {
          provider,
          callbackURL,
        },
        {
          onError: ({ error }) => {
            toast.error(`${providerLabel}でのログインに失敗しました。`, {
              description: error.message,
            });
            console.error(error);
          },
        },
      ),
  });

  return (
    <Button
      variant="outline"
      className="w-full"
      type="button"
      disabled={
        socialLoginMutation.isSuccess || socialLoginMutation.isPending || disabled
      }
      onClick={() => socialLoginMutation.mutate()}
    >
      {socialLoginMutation.isPending ? (
        <>
          <LoaderCircle className="animate-spin" />
          ログイン中...
        </>
      ) : (
        <>
          {icon}
          {providerLabel}でログイン
        </>
      )}
    </Button>
  );
}
