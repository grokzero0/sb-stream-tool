import { useFormContext } from "react-hook-form";
import { Tournament } from "@app/common";
import { usePlayerFormFieldArrayContext } from "./use-player-form-field-array-context";
import { useSettingsStore } from "@renderer/zustand/store";
import { useEffect, useRef } from "react";
import {
  clearAllListeners,
  onNewSlippiGameData,
  onNewSlippiGameEndData,
  send,
} from "@app/preload";
import {
  changeSetFormat,
  findSlippiWinner,
  portToColor,
} from "@renderer/utils/helpers";

export function useSlippiDataHandler() {
  const { setValue, getValues } = useFormContext<Tournament>();
  const teams = usePlayerFormFieldArrayContext();
  const slippiPlayers = useSettingsStore((state) => state.players);
  const setSlippiPlayers = useSettingsStore((state) => state.setPlayers);
  useEffect(() => {
    onNewSlippiGameData((data) => {
      setSlippiPlayers(data.players);
      if (data.isTeams) {
        changeSetFormat("Doubles", teams);
        setValue("setFormat", "Doubles");
      } else {
        changeSetFormat("Singles", teams);
        setValue("setFormat", "Singles");
      }
      for (let i = 0; i < getValues("teams").length; i++) {
        for (let j = 0; j < getValues(`teams.${i}.players`).length; j++) {
          setValue(`teams.${i}.players.${j}.gameInfo`, {
            character: data.players[i][j].character,
            altCostume: data.players[i][j].color,
            port: portToColor[data.players[i][j].port],
          });
        }
      }
      send("obs/play-game-start-scenes").catch((reason) =>
        console.log(`game-start-scenes-error: ${reason}`),
      );
    });
    return () => clearAllListeners("slippi:new-game-start-data");
  }, []);

  useEffect(() => {
    onNewSlippiGameEndData((winner) => {
      const winnerIndex = findSlippiWinner(
        slippiPlayers,
        winner.isTeams,
        winner.winner,
      );
    });
  });
}
