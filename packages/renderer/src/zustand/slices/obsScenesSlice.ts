import { type StateCreator } from "zustand";
import { type StoreSliceType } from "./slice";
import { send } from "@app/preload";
import { ObsSceneSettings } from "@app/common";

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
  updateScenes: (newGameStartScenes, newGameEndScenes, newSetEndScenes) => {
    set((state) => {
      state.gameStartScenes = newGameStartScenes;
      state.gameEndScenes = newGameEndScenes;
      state.setEndScenes = newSetEndScenes;
    });
    const allScenes = [] as ObsSceneSettings;
    newGameStartScenes.forEach((scene) =>
      allScenes.push({ type: "game-start", scene: scene }),
    );
    newGameEndScenes.forEach((scene) =>
      allScenes.push({ type: "game-end", scene: scene }),
    );
    newSetEndScenes.forEach((scene) =>
      allScenes.push({ type: "set-end", scene: scene }),
    );
    send("obs/save-scenes", allScenes).catch((error) => console.log(error));
  },
});
