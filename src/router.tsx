import { QueryClient } from "@tanstack/react-query";
import { createRouter as createTanStackRouter } from "@tanstack/react-router";
import { routerWithQueryClient } from "@tanstack/react-router-with-query";

import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { routeTree } from "./routeTree.gen";

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        // サーバー上でプリフェッチを行う場合は、各プリフェッチ呼び出しに特定の staleTime を渡す必要がないように、TanStack Routerのデフォルト設定（下記 ”defaultPreloadStaleTime”）を上書きして 0 より大きく設定する（https://tanstack.com/query/latest/docs/framework/react/guides/prefetching#prefetchquery--prefetchinfinitequery）。
        staleTime: 1000 * 60, // 1 minute
        experimental_prefetchInRender: true, // React19のuse()APIに対応
      },
    },
  });

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient, sessionUser: null },
      // ホバー時にプリロード
      defaultPreload: "intent",
      // 大前提としてデータキャッシュは統一的にTanstack Query側で管理する。このようにRouter側でのStale設定を0にすることで、毎回loaderが起動されるためQuery側のキャッシュに集約できるようにする。（https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache）
      defaultPreloadStaleTime: 0,
      defaultErrorComponent: DefaultCatchBoundary,
      defaultNotFoundComponent: NotFound,
      scrollRestoration: true,
      defaultStructuralSharing: true,
    }),
    queryClient,
  );
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
