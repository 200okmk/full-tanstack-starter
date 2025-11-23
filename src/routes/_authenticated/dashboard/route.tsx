import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-10 rounded-md p-4 outline-2 outline-gray-200">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-bold md:text-4xl">Dashboard Layout</h2>
        <div className="flex items-center gap-2 max-sm:flex-col">
          This is a protected layout:
          <pre className="bg-card text-card-foreground rounded-md border p-1">
            routes/_authenticated/dashboard/route.tsx
          </pre>
        </div>

        <Button type="button" asChild className="w-fit" size="lg">
          <Link to="/">Back to index</Link>
        </Button>
      </div>

      <Outlet />
    </div>
  );
}
