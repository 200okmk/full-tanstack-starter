import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { setupRouterSsrQueryIntegration } from "@tanstack/react-router-ssr-query";

import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { DefaultNotFound } from "~/components/DefaultNotFound";
import { routeTree } from "./routeTree.gen";

export function getRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        // サーバー上でプリフェッチを行う場合は、各プリフェッチ呼び出しに特定の staleTime を渡す必要がないように、下記のTanStack Routerのデフォルト設定（”defaultPreloadStaleTime”）を上書きして 0 より大きく設定する（https://tanstack.com/query/latest/docs/framework/react/guides/prefetching#prefetchquery--prefetchinfinitequery）。
        staleTime: 1000 * 60, // 1分
        experimental_prefetchInRender: true, // React19のuse()APIに対応
      },
    },
  });

  const router = createRouter({
    routeTree,
    context: { queryClient, sessionUser: null },
    // ホバー時にプリロード
    defaultPreload: "intent",
    // 大前提としてデータキャッシュは統一的にTanstack Query側で管理する。このようにRouter側でのStale設定を0にすることで、毎回loaderが起動されるためQuery側のキャッシュに集約できるようにする。（https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#passing-all-loader-events-to-an-external-cache）
    defaultPreloadStaleTime: 0,
    defaultErrorComponent: DefaultCatchBoundary,
    defaultNotFoundComponent: DefaultNotFound,
    scrollRestoration: true,
    // Search Params の変化によるコンポーネントの再レンダリングを最小化するために統一的にStructural Sharingを有効にする（https://tanstack.com/router/latest/docs/framework/react/guide/render-optimizations#structural-sharing）。
    defaultStructuralSharing: true,
  });

  setupRouterSsrQueryIntegration({
    router,
    queryClient,
    handleRedirects: true,
    wrapQueryClient: true,
  });

  return router;
}
