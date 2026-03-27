import { type StateCreator } from "zustand";
import { type StoreSliceType } from "./slice";
import { send } from "@app/preload";

export type StartggSlice = {
  startggApiKey: string;
  updateStartggApiKey: (newApiKey: string) => Promise<void>;
};

// https://github.com/pmndrs/zustand/discussions/676
export const createStartggSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  StartggSlice
> = (set) => ({
  startggApiKey: "",
  updateStartggApiKey: async (newApiKey) => {
    console.log("updateKey");
    set((state) => {
      state.startggApiKey = newApiKey;
    });
    await send("startgg/update-api-key", newApiKey);
  },
});
