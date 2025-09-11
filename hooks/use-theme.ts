import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const THEME_KEY = "app-theme";

export const useTheme = () => {
  const [currentTheme, setCurrentTheme] = useState<Theme>("system");

  const applyTheme = (theme: Theme) => {
    const root = window.document.documentElement;

    // Remove all theme classes
    root.classList.remove(
      "light",
      "dark",
      "bubblegum",
      "claude",
      "supabase",
      "system"
    );

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };

  const initializeTheme = () => {
    const storedTheme = (localStorage.getItem(THEME_KEY) as Theme) || "system";
    setCurrentTheme(storedTheme);
    applyTheme(storedTheme);
  };

  const updateTheme = (theme: Theme) => {
    localStorage.setItem(THEME_KEY, theme);
    setCurrentTheme(theme);
    applyTheme(theme);
  };

  // Listen system preference change if "system" is active
  useEffect(() => {
    initializeTheme();

    if (currentTheme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => applyTheme("system");

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [currentTheme]);

  return {
    initializeTheme,
    updateTheme,
    currentTheme,
  };
};
