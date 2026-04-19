import { useSettingsStore } from "@renderer/zustand/store";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";

function Slippi() {
  const relayStatus = useSettingsStore((state) => state.relayStatus);
  const updateRelayStatus = useSettingsStore(
    (state) => state.updateRelayStatus,
  );

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <h1>Slippi Relay</h1>
      <RadioGroup
        value={relayStatus}
        onValueChange={(value) =>
          updateRelayStatus(value as typeof relayStatus)
        }
      >
        {/* <div>
            <RadioGroupItem value="direct" id="r1" />
            <Label htmlFor="r1">Connect via direct connection</Label>
          </div> */}
        <div className="flex items-center gap-3">
          <RadioGroupItem value="folder" id="r2" />
          <Label htmlFor="r2">Connect via folder</Label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem value="disabled" id="r3" />
          <Label htmlFor="r3">Disabled</Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export default Slippi;
