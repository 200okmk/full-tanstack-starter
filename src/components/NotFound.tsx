import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export function NotFound() {
  return (
    <div className="space-y-2 p-2">
      <p>ページが見つかりません。</p>
      <p className="flex flex-wrap items-center gap-2">
        <Button type="button" onClick={() => window.history.back()}>
          戻る
        </Button>
        <Button asChild variant="secondary">
          <Link to="/">トップ</Link>
        </Button>
      </p>
    </div>
  );
}
