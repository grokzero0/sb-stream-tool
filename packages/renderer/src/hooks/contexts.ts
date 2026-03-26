import { createContext } from "react";
import type { ThemeProviderState } from "../types/theme";
import { UseFieldArrayReturn } from "react-hook-form";

export const PlayerFormFieldArrayContext = createContext<UseFieldArrayReturn[]>(
  [],
);

export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});
