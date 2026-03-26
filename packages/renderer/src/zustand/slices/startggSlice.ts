import { type StateCreator } from "zustand";
import { type StoreSliceType } from "./slice";
import { send } from "@app/preload";

export type StartggSlice = {
  apiKey: string;
  updateKey: (newApiKey: string) => Promise<void>;
};

// https://github.com/pmndrs/zustand/discussions/676
export const createStartggSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  StartggSlice
> = (set) => ({
  apiKey: "",
  updateKey: async (newApiKey) => {
    console.log("updateKey");
    set((state) => {
      state.apiKey = newApiKey;
    });
    await send("startgg/update-api-key", newApiKey);
  },
});
