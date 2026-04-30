import { Hotkey } from "@tanstack/react-hotkeys";
import { StoreSliceType } from "./slice";
import { StateCreator } from "zustand";
import { Action } from "@app/common";
import { send } from "@app/preload";

type Shortcuts = Map<Action, Hotkey>;

export type Shortcut = { action: Action; hotkey: Hotkey };

export type ShortcutsSlice = {
  shortcuts: Shortcuts;
  updateKeys: (keysToUpdate: Shortcut[]) => void;
  resetShortcutsToDefault: () => void;
};

export const defaultShortcuts = new Map<Action, Hotkey>([
  ["home", "Escape"],
  ["submit", "Enter"],
  ["score-up", "ArrowUp"],
  ["score-down", "ArrowDown"],
]);

export const createShortcutsSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  ShortcutsSlice
> = (set) => ({
  shortcuts: defaultShortcuts,
  updateKeys: (keysToUpdate) => {
    set((state) => {
      for (const key of keysToUpdate) {
        state.shortcuts.set(key.action, key.hotkey);
      }
    });
    send("shortcuts/save-shortcuts", keysToUpdate).catch((error) =>
      console.log(error),
    );
  },
  resetShortcutsToDefault: () =>
    set((state) => (state.shortcuts = defaultShortcuts)),
});
