import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard/")({
  component: DashboardIndex,
});

function DashboardIndex() {
  return (
    <div className="flex flex-col items-center gap-1">
      ダッシュボードindex page
      <pre className="bg-card text-card-foreground rounded-md border p-1">
        routes/_authenticated/dashboard/index.tsx
      </pre>
    </div>
  );
}
