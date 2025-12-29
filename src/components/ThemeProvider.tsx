import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";
import { createContext, use, useState } from "react";
import { z } from "zod";

export type Theme = "dark" | "light";

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
}

interface ThemeProviderState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const THEME_COOKIE_NAME = "ui-theme";

const initialState: ThemeProviderState = {
  theme: "dark",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

// Server Function: CookieからThemeを取得
export const getThemeCookie = createServerFn().handler(async () => {
  const theme = getCookie(THEME_COOKIE_NAME);
  // light以外はすべてdarkとして扱う（デフォルトdark）
  return (theme === "light" ? "light" : "dark") as Theme;
});

// Server Function: CookieにThemeを保存
export const setThemeCookie = createServerFn({ method: "POST" })
  .inputValidator(z.object({ theme: z.enum(["dark", "light"]) }))
  .handler(async ({ data }) => {
    setCookie(THEME_COOKIE_NAME, data.theme);
    return data.theme;
  });

export function ThemeProvider({ children, defaultTheme }: ThemeProviderProps) {
  const [themeState, setThemeState] = useState<Theme>(defaultTheme ?? "dark");

  const setTheme = (newTheme: Theme) => {
    // 1. DOM更新（即座に反映）
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);
    // 2. State更新
    setThemeState(newTheme);
    // 3. Cookie更新（非同期）
    setThemeCookie({ data: { theme: newTheme } });
  };

  return (
    <ThemeProviderContext value={{ theme: themeState, setTheme }}>
      {children}
    </ThemeProviderContext>
  );
}

export const useTheme = () => {
  const context = use(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme は ThemeProvider 内で使用してください");

  return context;
};
