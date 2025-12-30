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
import {
  getThemeFromCookie,
  ThemeProvider,
  type Theme,
} from "~/components/ThemeProvider";
import { Toaster } from "~/components/ui/sonner";
import { authQueryOptions, type SessionUser } from "~/queries/auth";
import appCss from "~/styles/app.css?url";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
  sessionUser: SessionUser;
}>()({
  beforeLoad: async ({ context: { queryClient } }) => {
    // 一般的にランディングページではログインユーザーを必要としないため、awaitせずにプリフェッチのみを行っている。
    // 認証保護されたルートは、~/routes/_authenticated/ 配下に配置していく。
    queryClient.prefetchQuery(authQueryOptions());

    // SSR時にCookieからThemeを取得し、ThemeProviderの初期値として使用。初回のみ実行。子ルートナビゲーションでは再実行されない
    const theme = await getThemeFromCookie();
    return { theme };
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
    // FOUCの防止のため、HTMLパース時に即座にテーマクラスを適用するブロッキングスクリプト。(Flash of Unstyled Content: 選択したダーク・ライトテーマをクライアントサイドで初期適用する際の一瞬のちらつき)
    scripts: [
      {
        id: "theme-init",
        children: `(function(){var t=document.cookie.match(/ui-theme=([^;]+)/);t=t?t[1]:"dark";document.documentElement.classList.add(t)})();`,
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
  // beforeLoadで取得したthemeをRoute.contextから参照
  const { theme } = Route.useRouteContext();

  return (
    // ブロッキングスクリプトにて"dark"/"light"クラスを更新しているので、`suppressHydrationWarning`を使用してHydration警告を抑制
    <html lang="ja" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="bg-background mx-auto p-4">
        <ThemeProvider initialTheme={theme as Theme}>
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
