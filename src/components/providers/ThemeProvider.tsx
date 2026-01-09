"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getInitialTheme(): Theme {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return "light";
  }
  const existingTheme = document.documentElement.dataset.theme;
  if (existingTheme === "dark" || existingTheme === "light") {
    return existingTheme;
  }
  const storedTheme = window.localStorage.getItem("theme");
  if (storedTheme === "dark" || storedTheme === "light") {
    return storedTheme;
  }
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return prefersDark ? "dark" : "light";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  const applyThemeToDom = useCallback((nextTheme: Theme) => {
    if (typeof document === "undefined") {
      return;
    }
    const root = document.documentElement;
    const body = document.body;
    const isDark = nextTheme === "dark";
    root.classList.toggle("dark", isDark);
    root.classList.toggle("light", !isDark);
    root.dataset.theme = nextTheme;
    if (body) {
      body.dataset.theme = nextTheme;
      body.classList.toggle("dark", isDark);
      body.classList.toggle("light", !isDark);
    }
    window.localStorage.setItem("theme", nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextTheme = prev === "dark" ? "light" : "dark";
      applyThemeToDom(nextTheme);
      return nextTheme;
    });
  }, [applyThemeToDom]);

  const setThemeManually = useCallback(
    (nextTheme: Theme) => {
      applyThemeToDom(nextTheme);
      setThemeState(nextTheme);
    },
    [applyThemeToDom]
  );

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
      setTheme: setThemeManually,
    }),
    [theme, toggleTheme, setThemeManually]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
