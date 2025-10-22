import { StateCreator } from "zustand";
import { StoreSliceType } from "./slice";
import { send } from "@app/preload";

export type StartggSlice = {
  apiKey: string;
  updateKey: (newApiKey: string) => void;
};
// https://github.com/pmndrs/zustand/discussions/676
export const createStartggSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  StartggSlice
> = (set) => ({
  apiKey: "",
  updateKey: (newApiKey) =>
    set((state) => {
      state.apiKey = newApiKey;
      send("startgg/update-api-key", newApiKey);
    }),
});
