import { StateCreator } from "zustand";
import { StoreSliceType } from "./slice";

export type ZustandStateSlice = {
  isIpcHydrated: boolean;
  setIsIpcHydrated: (isIpcHydrated: boolean) => void;
};

export const createZustandStateSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  ZustandStateSlice
> = (set) => ({
  isIpcHydrated: false,
  setIsIpcHydrated: (isIpcHydrated) =>
    set((state) => (state.isIpcHydrated = isIpcHydrated)),
});
