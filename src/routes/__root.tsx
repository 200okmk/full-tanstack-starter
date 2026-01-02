/// <reference types="vite/client" />
import type { QueryClient } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { DefaultCatchBoundary } from "~/components/DefaultCatchBoundary";
import { NotFound } from "~/components/NotFound";
import { ThemeProvider } from "~/components/ThemeProvider";
import { Toaster } from "~/components/ui/sonner";
import { authQueryOptions, type SessionUser } from "~/queries/auth";
import appCss from "~/styles/app.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  sessionUser: SessionUser;
}>()({
  beforeLoad: ({ context: { queryClient } }) => {
    // 一般的にランディングページではログインユーザーを必要としないため、awaitせずにプリフェッチのみを行っている。
    // 認証保護されたルートは、~/routes/_authenticated/ 配下に配置していく。
    queryClient.prefetchQuery(authQueryOptions());
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "TanStack Starter: Netlify Neon",
      },
      {
        name: "description",
        content: "TanStack Start 🏝️ をNetlifyとNeonDBにデプロイするためのテンプレート",
      },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        // FOUCを防止するためのブロッキングスクリプト。（Flash of Unstyled Content: 選択したダーク・ライトテーマをクライアントサイドで適用する際の一瞬のちらつき）
        // ReactのHydration前にlocalStorageから直接テーマを読み取り、<html>要素にクラスを適用する。
        children: `(function(){try{var t=localStorage.getItem("ui-theme");document.documentElement.classList.add(t==="light"||t==="dark"?t:"dark")}catch(e){document.documentElement.classList.add("dark")}})();`,
      },
    ],
  }),
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: () => <NotFound />,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { readonly children: React.ReactNode }) {
  return (
    // ブロッキングスクリプトにて"dark"/"light"クラスを更新しているので、SSR時とHydration時のDOMに差異が生じるのは意図的なもの。そのため`suppressHydrationWarning`を使用して警告を抑制している。
    <html lang="ja" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background mx-auto p-4">
        <ThemeProvider>
          {children}
          <Toaster richColors />
        </ThemeProvider>

        <ReactQueryDevtools buttonPosition="bottom-left" />
        <TanStackRouterDevtools position="bottom-right" />
        {/* クライアントサイド JavaScript をすべて読み込むためのタグ */}
        <Scripts />
      </body>
    </html>
  );
}
