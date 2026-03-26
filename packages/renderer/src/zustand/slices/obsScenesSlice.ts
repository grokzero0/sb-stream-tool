import { type StateCreator } from "zustand";
import { type StoreSliceType } from "./slice";

export type ObsScene = {
  scene: string;
  start: number;
};

export type ObsScenesSlice = {
  gameStartScenes: ObsScene[];
  gameEndScenes: ObsScene[];
  setEndScenes: ObsScene[];
  updateScenes: (
    newGameStartScenes: ObsScene[],
    newGameEndScenes: ObsScene[],
    newSetEndScenes: ObsScene[],
  ) => void;
};

export const createObsScenesSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  ObsScenesSlice
> = (set) => ({
  gameStartScenes: [],
  gameEndScenes: [],
  setEndScenes: [],
  updateScenes: (newGameStartScenes, newGameEndScenes, newSetEndScenes) =>
    set((state) => {
      state.gameStartScenes = newGameStartScenes;
      state.gameEndScenes = newGameEndScenes;
      state.setEndScenes = newSetEndScenes;
    }),
});
