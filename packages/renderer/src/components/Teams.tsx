import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { Tournament } from "@app/common";
import { useTeam } from "@renderer/hooks/use-team";
import { useSettingsStore } from "@renderer/zustand/store";
import { usePlayerFormFieldArrayContext } from "@renderer/hooks/use-player-form-field-array-context";
import { Button } from "./ui/button";
import { Field, FieldLabel } from "./ui/field";
import { Spinbox } from "./ui/spinbox";
import { Toggle } from "./ui/toggle";
import { Badge } from "lucide-react";
import Player from "./Player";
import { Input } from "./ui/input";
// import { useRef } from "react";

function Teams() {
  const { setValue } = useFormContext<Tournament>();
  const { swapGameData } = useTeam();
  const { fields, swap } = useFieldArray<Tournament>({ name: "teams" });
  const swapCharacters = useSettingsStore((state) => state.swap);
  const players = usePlayerFormFieldArrayContext();
  // const teamPanelRefs = useRef<HTMLDivElement[]>([]);

  return (
    <>
      <div className="flex gap-4 justify-center">
        <Button
          type="button"
          className="w-2/5"
          onClick={() => {
            swap(0, 1);
            swapCharacters(0, 1);
          }}
        >
          Swap Teams
        </Button>
        <Button
          type="button"
          className="w-2/5"
          onClick={() => {
            swapGameData(0, 1);
            swapCharacters(0, 1);
          }}
        >
          Swap characters
        </Button>
      </div>
      <div className="flex gap-1">
        {fields.map((team, teamNum) => (
          <div key={team.id} className="p-1 w-full">
            <Controller
              name={`teams.${teamNum}.name`}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="w-full py-2">
                  <Input
                    className="text-center"
                    {...field}
                    aria-invalid={fieldState.invalid}
                    id={`${teamNum}-name`}
                  />
                </Field>
              )}
            />

            <div className="flex items-end justify-evenly gap-2 pb-2">
              <Controller
                name={`teams.${teamNum}.score`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-fit">
                    <FieldLabel className="text-center flex justify-center">
                      Score
                    </FieldLabel>
                    <Spinbox
                      numberValue={field.value as number}
                      onChangeNumber={field.onChange}
                      min={0}
                      max={100}
                      {...field}
                    />
                  </Field>
                )}
              ></Controller>
              <Button
                type="button"
                className="px-8"
                onClick={() => setValue(`teams.${teamNum}.score`, 0)}
              >
                Reset Score
              </Button>
              <Controller
                name={`teams.${teamNum}.inLosers`}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="w-fit">
                    <Toggle
                      variant="outline"
                      name={field.name}
                      pressed={field.value as boolean}
                      onPressedChange={field.onChange}
                      aria-label={`Team ${teamNum + 1} toggle losers`}
                    >
                      <Badge className="group-data-[state=on]/toggle:fill-foreground" />{" "}
                      In Losers
                    </Toggle>
                  </Field>
                )}
              ></Controller>
            </div>
            <div className="flex flex-col gap-4 w-full">
              {players[teamNum].fields.map((player, playerNum) => (
                <Player
                  key={player.id}
                  teamNum={teamNum}
                  playerNum={playerNum}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default Teams;
