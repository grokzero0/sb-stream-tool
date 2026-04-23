import { useFieldArray } from "react-hook-form";
import { Tournament } from "@app/common";
import { useTeam } from "@renderer/hooks/use-team";
import { useSettingsStore } from "@renderer/zustand/store";
import { Button } from "./ui/button";
import Team from "./Team";

function Teams() {
  // const { setValue } = useFormContext<Tournament>();
  const { swapGameData } = useTeam(); // react-hook-form's form state
  const { fields, swap } = useFieldArray<Tournament>({ name: "teams" });
  const swapCharacters = useSettingsStore((state) => state.swap); // zustands character state
  // const players = usePlayerFormFieldArrayContext();
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
          <Team key={team.id} teamNum={teamNum} />
        ))}
      </div>
    </>
  );
}

export default Teams;
