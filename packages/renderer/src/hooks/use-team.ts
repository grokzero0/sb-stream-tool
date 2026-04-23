import { Tournament } from "@app/common";
import { useFormContext } from "react-hook-form";

export function useTeam() {
  const { setValue, getValues } = useFormContext<Tournament>();

  const swapTeamInfo = (firstIndex: number, secondIndex: number): void => {
    const arr = [
      getValues([
        `teams.${firstIndex}.name`,
        `teams.${firstIndex}.score`,
        `teams.${firstIndex}.inLosers`,
      ]),
      getValues([
        `teams.${secondIndex}.name`,
        `teams.${secondIndex}.score`,
        `teams.${secondIndex}.inLosers`,
      ]),
    ];
    const first = arr[0];
    arr[0] = arr[1];
    arr[1] = first;
    setValue(`teams.${firstIndex}.name`, arr[0][0]);
    setValue(`teams.${firstIndex}.score`, arr[0][1]);
    setValue(`teams.${firstIndex}.inLosers`, arr[0][2]);

    setValue(`teams.${secondIndex}.name`, arr[1][0]);
    setValue(`teams.${secondIndex}.score`, arr[1][1]);
    setValue(`teams.${secondIndex}.inLosers`, arr[1][2]);
  };

  const swapGameInfo = (firstIndex: number, secondIndex: number): void => {
    if (
      getValues(`teams.${firstIndex}.players`).length !==
      getValues(`teams.${secondIndex}.players`).length
    ) {
      // console.log(
      //   `${getValues(`teams.${firstIndex}.players`).length}, ${getValues(`teams.${secondIndex}.players`)}`,
      // );
      return;
    }

    for (let i = 0; i < getValues(`teams.${firstIndex}.players`).length; i++) {
      const first = getValues(`teams.${firstIndex}.players.${i}.gameInfo`);
      setValue(
        `teams.${firstIndex}.players.${i}.gameInfo`,
        getValues(`teams.${secondIndex}.players.${i}.gameInfo`),
      );
      setValue(`teams.${secondIndex}.players.${i}.gameInfo`, first);
    }
  };

  return { swapTeamInfo, swapGameInfo };
}
