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
import { createKeybindsSlice } from "./slices/keybindsSlice";

export const useSettingsStore = create<StoreSliceType>()(
  subscribeWithSelector(
    immer((...a) => ({
      ...createObsScenesSlice(...a),
      ...createStartggSlice(...a),
      ...createSlippiSlice(...a),
      ...createObsWebsocketSlice(...a),
      ...createEventSlice(...a),
      ...createKeybindsSlice(...a),
    })),
  ),
);

// https://github.com/pmndrs/zustand/discussions/676
send("startgg/get-api-key")
  .then((key) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    useSettingsStore.setState({ startggApiKey: key ?? "" });
  })
  .catch((reason) => console.log(reason));
