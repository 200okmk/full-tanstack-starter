import {
  ErrorComponent,
  type ErrorComponentProps,
  Link,
  useRouter,
  useRouterState,
} from "@tanstack/react-router";
import { Button } from "./ui/button";

export function DefaultCatchBoundary({ error }: Readonly<ErrorComponentProps>) {
  const router = useRouter();
  const { location } = useRouterState();

  const isInAuthPages: boolean = ["/login", "/signup"].includes(location.pathname);

  console.error("エラーが発生しました:", error);

  return (
    <div className="flex min-w-0 flex-1 flex-col items-center justify-center gap-6 p-4">
      <ErrorComponent error={error} />
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          onClick={() => {
            // キャッシュ無効化のメソッドなのでPromise戻り値を明示的に無視して良い
            void router.invalidate();
          }}
        >
          再読み込み
        </Button>
        {isInAuthPages ? (
          <Button asChild variant="secondary">
            <Link to="/">トップ</Link>
          </Button>
        ) : (
          <Button asChild variant="secondary">
            <Link to="/dashboard">ダッシュボード</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
