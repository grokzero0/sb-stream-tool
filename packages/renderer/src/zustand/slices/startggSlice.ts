import { type StateCreator } from "zustand";
import { type StoreSliceType } from "./slice";
import { send } from "@app/preload";

export type StartggSlice = {
  startggApiKey: string;
  updateStartggApiKey: (newApiKey: string) => void;
};

// https://github.com/pmndrs/zustand/discussions/676
export const createStartggSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  StartggSlice
> = (set) => ({
  startggApiKey: "",
  updateStartggApiKey: (newApiKey) => {
    set((state) => {
      state.startggApiKey = newApiKey;
    });
    send("startgg/update-api-key", newApiKey).catch((error) =>
      console.log(error),
    );
  },
});
