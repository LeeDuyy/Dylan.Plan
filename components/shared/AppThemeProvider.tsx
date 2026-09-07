"use client";

import { App as AntdApp, ConfigProvider, theme } from "antd";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

const STORAGE_KEY = "dylan-plan-next-dashboard-v2";

type ThemeContextValue = {
  dark: boolean;
  toggle: () => void;
};

export const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useAppTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useAppTheme must be used inside AppThemeProvider");
  }
  return value;
}

export function AppThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { dark?: boolean };
        setDark(Boolean(parsed.dark));
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    if (hydrated) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ dark }));
    }
  }, [dark, hydrated]);

  const contextValue = useMemo<ThemeContextValue>(
    () => ({
      dark,
      toggle: () => setDark((value) => !value)
    }),
    [dark]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <ConfigProvider
        theme={{
          algorithm: dark ? theme.darkAlgorithm : theme.defaultAlgorithm,
          token: {
            colorPrimary: "#6c55f5",
            borderRadius: 14,
            colorSuccess: "#178f61",
            colorWarning: "#b86b00",
            colorError: "#c64545",
            colorInfo: "#2674c9",
            fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
          }
        }}
      >
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}
