import { type StateCreator } from "zustand";
import { type StoreSliceType } from "./slice";
import { send } from "@app/preload";

export type ObsWebsocketSlice = {
  websocketIp: string;
  websocketPort: string;
  websocketPassword: string;
  updateWebsocketSettings: (
    newIp: string,
    newPort: string,
    newPassword: string,
  ) => void;
};
export const createObsWebsocketSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  ObsWebsocketSlice
> = (set) => ({
  websocketIp: "127.0.0.1",
  websocketPort: "4455",
  websocketPassword: "",
  updateWebsocketSettings: (newIp, newPort, newPassword) => {
    set((state) => {
      state.websocketIp = newIp;
      state.websocketPort = newPort;
      state.websocketPassword = newPassword;
    });
    send("obs/save-websocket-settings", { ip: newIp, port: newPort }).catch(
      (error) => console.log(error),
    );
  },
});
