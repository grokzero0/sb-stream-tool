import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { subscribeWithSelector } from "zustand/middleware";
import { createObsScenesSlice } from "./slices/obsScenesSlice";
import { createStartggSlice } from "./slices/startggSlice";
import { type StoreSliceType } from "./slices/slice";
import { createSlippiSlice } from "./slices/slippiSlice";
import { createObsWebsocketSlice } from "./slices/obsWebsocketSlice";
import { send } from "@app/preload";
import { createEventSlice } from "./slices/eventSlice";

export const useSettingsStore = create<StoreSliceType>()(
  subscribeWithSelector(
    immer((...a) => ({
      ...createObsScenesSlice(...a),
      ...createStartggSlice(...a),
      ...createSlippiSlice(...a),
      ...createObsWebsocketSlice(...a),
      ...createEventSlice(...a),
    })),
  ),
);

// https://github.com/pmndrs/zustand/discussions/676
send("startgg/get-api-key")
  .then((key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    useSettingsStore.setState({ apiKey: key ?? "" });
    console.log(key);
  })
  .catch((reason) => console.log(reason));
// then((apiKey) => {
//   useSettingsStore.setState({ apiKey: apiKey ?? '' })
// }
