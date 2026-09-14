"use client";

import * as React from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = React.PropsWithChildren<{
  attribute?: "class" | "data-theme";
  defaultTheme?: Theme;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}>;

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = React.createContext<ThemeContextValue | undefined>(
  undefined,
);

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeProvider({
  children,
  attribute = "data-theme",
  defaultTheme = "system",
  enableSystem = true,
  disableTransitionOnChange = false,
}: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<Theme>(() => {
    if (typeof window === "undefined") return defaultTheme;
    return (localStorage.getItem("theme") as Theme | null) ?? defaultTheme;
  });

  const applyTheme = React.useCallback(
    (nextTheme: Theme) => {
      const resolvedTheme =
        nextTheme === "system" && enableSystem ? getSystemTheme() : nextTheme;
      const root = document.documentElement;

      if (disableTransitionOnChange) {
        root.classList.add("disable-transitions");
      }

      if (attribute === "class") {
        root.classList.remove("light", "dark");
        root.classList.add(resolvedTheme);
      } else {
        root.setAttribute(attribute, resolvedTheme);
      }

      root.style.colorScheme = resolvedTheme;

      if (disableTransitionOnChange) {
        window.setTimeout(() => root.classList.remove("disable-transitions"), 0);
      }
    },
    [attribute, disableTransitionOnChange, enableSystem],
  );

  React.useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;
    const initialTheme = storedTheme ?? defaultTheme;
    applyTheme(initialTheme);
  }, [applyTheme, defaultTheme]);

  React.useEffect(() => {
    if (!enableSystem || theme !== "system") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => applyTheme("system");
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [applyTheme, enableSystem, theme]);

  const setTheme = (nextTheme: Theme) => {
    setThemeState(nextTheme);
    localStorage.setItem("theme", nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}