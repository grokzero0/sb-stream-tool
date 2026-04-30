import { type StateCreator } from "zustand";
import { type StoreSliceType } from "./slice";
import type {
  SlippiPlayer,
  SlippiRelayStatus,
  SlippiRelaySettings,
} from "@app/common";
import { send } from "@app/preload";

export type SlippiRelaySlice = {
  slippiRelayStatus: SlippiRelayStatus;
  slippiRelayDirectory: string;
  slippiRelayIp: string;
  slippiRelayPort: string;
  players: SlippiPlayer[][];
  slippiRelayAutoupload: boolean;
  setPlayers: (newData: SlippiPlayer[][]) => void;
  swapCharacters: (firstIndex: number, secondIndex: number) => void;
  updateSlippiRelayStatus: (newRelayStatus: SlippiRelayStatus) => void;
  updateSlippiRelayDirectory: (newDirectory: string) => void;
};

// https://github.com/pmndrs/zustand/discussions/676
export const createSlippiSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  SlippiRelaySlice
> = (set, get) => ({
  slippiRelayStatus: "disabled",
  slippiRelayDirectory: "",
  slippiRelayIp: "",
  slippiRelayPort: "",
  // consoleConnection: false,
  players: [] as SlippiPlayer[][],
  slippiRelayAutoupload: false,
  setPlayers: (newData) =>
    set((state) => {
      state.players = newData;
    }),
  swapCharacters: (firstIndex, secondIndex) =>
    set((state) => {
      if (
        firstIndex >= state.players.length ||
        firstIndex < 0 ||
        secondIndex >= state.players.length ||
        secondIndex < 0
      ) {
        return;
      }
      const first = state.players[firstIndex];
      state.players[firstIndex] = state.players[secondIndex];
      state.players[secondIndex] = first;
    }),
  updateSlippiRelayDirectory: (newDirectory: string) => {
    set((state) => {
      state.slippiRelayDirectory = newDirectory;
    });
    send("slippi-relay/save-settings", {
      relayStatus: get().slippiRelayStatus,
      directory: newDirectory,
      ip: get().slippiRelayIp,
      port: get().slippiRelayPort,
    } as SlippiRelaySettings).catch((error) => console.log(error));
  },
  updateSlippiRelayStatus: (newRelayStatus: SlippiRelayStatus) => {
    set((state) => {
      state.slippiRelayStatus = newRelayStatus;
    });
    if (newRelayStatus === "disabled") {
      send("slippi-relay/save-settings", {
        relayStatus: newRelayStatus,
        directory: get().slippiRelayDirectory,
        ip: get().slippiRelayIp,
        port: get().slippiRelayPort,
      } as SlippiRelaySettings).catch((error) => console.log(error));
    }
  },
  updateSlippiRelayAutoupload: (enabled: boolean) =>
    set((state) => {
      state.slippiRelayAutoupload = enabled;
    }),
});
