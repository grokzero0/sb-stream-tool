import { Hotkey } from "@tanstack/react-hotkeys";
import { StoreSliceType } from "./slice";
import { StateCreator } from "zustand";

type Bind = "submit" | "home" | "score-up" | "score-down";

type Keybinds = Map<Bind, Hotkey>;

export type KeybindsSlice = {
  keybinds: Keybinds;
  updateKeys: (keysToUpdate: { bind: Bind; key: Hotkey }[]) => void;
};

export const createKeybindsSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  KeybindsSlice
> = (set) => ({
  keybinds: new Map<Bind, Hotkey>([
    ["home", "Escape"],
    ["submit", "Enter"],
    ["score-up", "ArrowUp"],
    ["score-down", "ArrowDown"],
  ]),
  updateKeys: (keysToUpdate) =>
    set((state) => {
      for (const key of keysToUpdate) {
        state.keybinds.set(key.bind, key.key);
      }
    }),
});
