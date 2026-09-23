import { Link, createFileRoute } from "@tanstack/react-router";
import ThemeToggle from "~/components/ThemeToggle";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-10 p-2">
      <div className="flex flex-col items-center gap-8">
        <h1 className="text-3xl font-bold md:text-4xl">Full-TanStack Template</h1>
        <div className="flex items-center gap-2 max-md:flex-col">
          <p className="text-center">
            ここは認証保護されていないランディングホームページです
          </p>
          <pre className="bg-card text-card-foreground rounded-md border p-1">
            ~/routes/index.tsx
          </pre>
        </div>
        <div className="flex items-center gap-2 max-md:flex-col">
          <Link to="/dashboard" className="text-center underline">
            認証保護されたページへ遷移
          </Link>
          <pre className="bg-card text-card-foreground un rounded-md border p-1">
            ~/routes/_authenticated/dashboard/index.tsx
          </pre>
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <ThemeToggle />
        <a
          className="text-muted-foreground hover:text-foreground underline"
          href="https://github.com/200okmk/full-tanstack-starter"
          target="_blank"
          rel="noreferrer noopener"
        >
          200okmk/full-tanstack-starter
        </a>
      </div>
    </div>
  );
}
