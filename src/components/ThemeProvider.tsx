import { ScriptOnce } from "@tanstack/react-router";
import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";

type Theme = "dark" | "light" | "system";
const MEDIA = "(prefers-color-scheme: dark)";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// （https://ui.shadcn.com/docs/dark-mode/vite, https://github.com/pacocoursey/next-themes/blob/main/next-themes/src/index.tsx）
export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () =>
      (typeof window !== "undefined"
        ? (localStorage.getItem(storageKey) as Theme)
        : null) || defaultTheme,
  );

  // OSのダークモード設定変更に対応するコールバック
  const handleMediaQuery = useCallback(
    (e: MediaQueryListEvent | MediaQueryList) => {
      // theme === "system"の場合のみ動作（明示的にlight/darkを選択済みなら無視）
      if (theme !== "system") return;
      const root = window.document.documentElement;
      const targetTheme = e.matches ? "dark" : "light";
      // OSの設定（e.matches）に応じて<html>要素のクラスを更新
      if (!root.classList.contains(targetTheme)) {
        root.classList.remove("light", "dark");
        root.classList.add(targetTheme);
      }
    },
    [theme],
  );

  // OSダークモード設定の変更イベント監視
  useEffect(() => {
    // matchMediaでOSのカラースキーム設定を監視
    const media = window.matchMedia(MEDIA);

    // 初回マウント時にも現在のOS設定を適用
    media.addEventListener("change", handleMediaQuery);
    handleMediaQuery(media);

    return () => media.removeEventListener("change", handleMediaQuery);
  }, [handleMediaQuery]);

  // theme state変更時のDOM更新とlocalStorage同期
  useEffect(() => {
    const root = window.document.documentElement;

    let targetTheme: string;

    // "system"の場合: localStorageを削除し、OSの設定に従ってクラスを決定
    if (theme === "system") {
      localStorage.removeItem(storageKey);
      targetTheme = window.matchMedia(MEDIA).matches ? "dark" : "light";
    } else {
      // "light"/"dark"の場合: localStorageに保存し、そのテーマをクラスに適用
      localStorage.setItem(storageKey, theme);
      targetTheme = theme;
    }

    // 対象のテーマがすでに適用されていない場合のみ更新（パフォーマンス最適化）
    if (!root.classList.contains(targetTheme)) {
      root.classList.remove("light", "dark");
      root.classList.add(targetTheme);
    }
  }, [theme, storageKey]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
    }),
    [theme],
  );

  // SSR時のテーマフラッシュ（FOUC: Flash of Unstyled Content）防止
  return (
    <ThemeProviderContext {...props} value={value}>
      {/* ScriptOnceでHTMLがレンダリングされる前に同期的にテーマクラスを適用。Reactのハイドレーション前に実行されるため、初期表示時のチラつきを防止 */}
      <ScriptOnce>
        {`document.documentElement.classList.toggle(
            'dark',
            localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
            )`}
      </ScriptOnce>
      {children}
    </ThemeProviderContext>
  );
}

// テーマコンテキストを取得するためのカスタムフック
export const useTheme = () => {
  // React 19のuse()フックを使用してコンテキストを取得
  const context = use(ThemeProviderContext);

  // ThemeProvider外で使用された場合はエラーを投げる
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};
