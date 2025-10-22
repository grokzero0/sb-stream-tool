import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettingsStore } from "@/lib/store/store";
import { useState } from "react";

function Startgg() {
  const savedApiKey = useSettingsStore((state) => state.apiKey);
  const update = useSettingsStore((state) => state.updateKey);
  const [apiKey, setApiKey] = useState(savedApiKey);
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center font-semibold text-xl">Connect to Start.gg API</h1>
      <h2 className="text-center font-semibold text-sm">Note: You MUST do this in order to automatically get player information from a specific set</h2>
      <form
      onSubmit={(e) => {
        e.preventDefault();
        update(apiKey);
      }}
    >
      <div className="flex flex-col gap-3">
        <Label>Start.gg API key</Label>
        <Input
          value={apiKey}
          onChange={(e) => setApiKey(e.currentTarget.value)}
        />
      </div>
      <Button>Submit</Button>
    </form>
    </div>
    
  );
}
export default Startgg;
