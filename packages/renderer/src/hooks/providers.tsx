import { useEffect, useMemo, useState, type ReactNode } from "react";
import { useFieldArray } from "react-hook-form";
import { PlayerFormFieldArrayContext, ThemeProviderContext } from "./contexts";
import type { Theme, ThemeProviderProps } from "@renderer/types/theme";

export function PlayerFormFieldArrayProvider({
  children,
  ...props
}: {
  children: ReactNode;
}) {
  const teamOne = useFieldArray({ name: "teams.0.players" });
  const teamTwo = useFieldArray({ name: "teams.1.players" });
  const teams = useMemo(() => [teamOne, teamTwo], [teamOne, teamTwo]);
  return (
    <PlayerFormFieldArrayContext {...props} value={teams}>
      {children}
    </PlayerFormFieldArrayContext>
  );
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "vite-ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme,
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme);
      setTheme(theme);
    },
  };

  return (
    <ThemeProviderContext {...props} value={value}>
      {children}
    </ThemeProviderContext>
  );
}
