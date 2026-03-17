import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeMode = "auto" | "light" | "dark";
type ThemeContextValue = {
  dark: boolean;
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
  toggleDark: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    try {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("themeMode");
        if (stored === "dark" || stored === "light" || stored === "auto") return stored as ThemeMode;
      }
    } catch {}
    return "auto";
  });
  const [systemPrefersDark, setSystemPrefersDark] = useState<boolean>(() => {
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });
  const dark = mode === "dark" || (mode === "auto" && systemPrefersDark);

  useEffect(() => {
    try {
      localStorage.setItem("themeMode", mode);
    } catch {}
  }, [mode]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => setSystemPrefersDark(e.matches);
    try {
      mql.addEventListener("change", handler);
      return () => mql.removeEventListener("change", handler);
    } catch {
      // Safari fallback
      // @ts-ignore
      mql.addListener(handler);
      // @ts-ignore
      return () => mql.removeListener(handler);
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.classList.toggle("light", !dark);
  }, [dark]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      dark,
      mode,
      setMode: (m: ThemeMode) => setMode(m),
      toggleDark: () => setMode((prev) => (prev === "dark" ? "light" : "dark")),
    }),
    [dark, mode]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}
