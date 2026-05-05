import { useFormContext } from "react-hook-form";
import { Tournament } from "@app/common";
import { usePlayerFormFieldArrayContext } from "./use-player-form-field-array-context";
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
  onSubmit,
  portToColor,
} from "@renderer/utils/helpers";
import { useSettingsStore } from "@renderer/zustand/store";

export function useSlippiDataHandler() {
  const { setValue, getValues, handleSubmit } = useFormContext<Tournament>();
  const teams = usePlayerFormFieldArrayContext();
  const shouldResetScore = useRef(false);
  const slippiRelayStatus = useSettingsStore(
    (state) => state.slippiRelayStatus,
  );
  // const slippiPlayers = useSettingsStore((state) => state.players);
  // const setSlippiPlayers = useSettingsStore((state) => state.setPlayers);
  useEffect(() => {
    onNewSlippiGameData((data) => {
      if (data.isTeams) {
        changeSetFormat("Doubles", teams);
        setValue("setFormat", "Doubles");
      } else {
        changeSetFormat("Singles", teams);
        setValue("setFormat", "Singles");
      }

      if (shouldResetScore.current) {
        for (let index = 0; index < getValues("teams").length; index++) {
          setValue(`teams.${index}.score`, 0);
        }
        shouldResetScore.current = false;
      }

      for (let i = 0; i < getValues("teams").length; i++) {
        for (
          let j = 0;
          j <
          Math.min(
            getValues(`teams.${i}.players`).length,
            data.players[i].length, // you can have 1 player on one team and 3 players on another, can't handle that right now in frontend, will do in a future update
          );
          j++
        ) {
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
      if (slippiRelayStatus !== "disabled") {
        handleSubmit(onSubmit)().catch((error) => console.log(error));
      }
    });
    return () => clearAllListeners("slippi:new-game-start-data");
  }, [getValues, handleSubmit, setValue, slippiRelayStatus, teams]);

  useEffect(() => {
    onNewSlippiGameEndData((winner) => {
      const winnerIndex = findSlippiWinner(winner.winners, getValues);
      const bestOf = getValues("bestOf");
      const scoreToBeat =
        bestOf % 2 === 0 ? bestOf / 2 + 1 : Math.ceil(bestOf / 2);
      if (winnerIndex !== undefined) {
        const newScore = getValues(`teams.${winnerIndex}.score`) + 1;
        setValue(`teams.${winnerIndex}.score`, newScore);

        // Set officially ended, new set
        if (newScore >= scoreToBeat) {
          send("obs/play-set-end-scenes").catch((reason) =>
            console.log(reason),
          );
          shouldResetScore.current = true; // flag to reset score, much more easier than going through every team and see if the score is greater than the score to beat
        } else {
          send("obs/play-game-end-scenes").catch((reason) =>
            console.log(reason),
          );
        }

        if (slippiRelayStatus !== "disabled") {
          handleSubmit(onSubmit)().catch((error) => console.log(error));
        }
      }
    });
    return () => clearAllListeners("slippi:new-game-end-data");
  }, [getValues, handleSubmit, setValue, slippiRelayStatus]);
}
