import { StateCreator } from "zustand";
import { StoreSliceType } from "./slice";
import { send } from "@app/preload";
import { client } from "@/client";
import { HttpLink } from "@apollo/client";

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
      console.log("new api key");
      state.apiKey = newApiKey;
      client.setLink(
        new HttpLink({
          uri: "https://api.start.gg/gql/alpha",
          headers: {
            Authorization: `Bearer ${newApiKey}`,
            "Content-Type": "application/json",
          },
        })
      );
      send("startgg/update-api-key", newApiKey);
    }),
});
