import { type StateCreator } from "zustand";
import { type StoreSliceType } from "./slice";
import { send } from "@app/preload";

export type StartggSlice = {
  apiKey: string;
  tournamentUrl: string;
  tournamentSlug: string;
  updateTournamentUrl: (newUrl: string) => void;
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
  tournamentUrl: "",
  tournamentSlug: "",
  updateTournamentUrl: (newUrl) =>
    set((state) => {
      state.tournamentUrl = newUrl;
      state.tournamentSlug = new URL(newUrl).pathname
        .split("/")
        .slice(1, 5)
        .join("/");
    }),
  updateKey: async (newApiKey) => {
    console.log("updateKey")
    set((state) => {
      state.apiKey = newApiKey;
    });
    await send("startgg/update-api-key", newApiKey);
  },
});
