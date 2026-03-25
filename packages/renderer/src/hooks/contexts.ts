import { createContext } from "react";
import type { ThemeProviderState } from "../types/theme";

export const PlayerFormFieldArrayContext = createContext<unknown[]>([]);

export const ThemeProviderContext = createContext<ThemeProviderState>({
  theme: "system",
  setTheme: () => null,
});
