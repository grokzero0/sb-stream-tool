import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createObsScenesSlice } from "./slices/obsScenesSlice";
import { createStartggSlice } from "./slices/startggSlice";
import { StoreSliceType } from "./slices/slice";
import { send } from "@app/preload";
import { client } from "@/client";
import { HttpLink } from "@apollo/client";

export const useSettingsStore = create<StoreSliceType>()(
  immer((...a) => ({
    ...createObsScenesSlice(...a),
    ...createStartggSlice(...a),
  }))
);
// https://github.com/pmndrs/zustand/discussions/676
send("startgg/get-api-key").then((apiKey) => {
  useSettingsStore.setState({ apiKey: apiKey || "" });
  client.setLink(
    new HttpLink({
      uri: "https://api.start.gg/gql/alpha",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    })
  );
});
