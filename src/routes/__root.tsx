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
import { authQueryOptions, SessionUser } from "~/lib/auth/queries";
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
  }),
  component: RootComponent,
  errorComponent: (props) => {
    return (
      <RootDocument>
        <DefaultCatchBoundary {...props} />
      </RootDocument>
    );
  },
  notFoundComponent: NotFound,
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
    // ThemeProviderにて"dark"クラスを更新しているので、`suppressHydrationWarning`を使用してクライアント側のHydration警告を抑制
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
