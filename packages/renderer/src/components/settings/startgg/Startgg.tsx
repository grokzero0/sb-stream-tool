import { send } from "@app/preload";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { useSettingsStore } from "@renderer/zustand/store";
import { useState } from "react";

function Startgg() {
  const savedApiKey = useSettingsStore((state) => state.startggApiKey);
  const update = useSettingsStore((state) => state.updateStartggApiKey);
  const [apiKey, setApiKey] = useState(savedApiKey);

  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-center font-semibold text-xl">
        Connect to Start.gg API
      </h1>
      <h2 className="text-center">
        Confused? See:{" "}
        <Button
          variant="link"
          className="text-md"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={() =>
            send("link/open", "https://developer.start.gg/docs/authentication/")
          }
        >
          https://developer.start.gg/docs/authentication/
        </Button>
      </h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update(apiKey).catch((reason) => console.log(reason));
        }}
      >
        <div className="flex flex-col gap-3">
          <Label>Start.gg API key</Label>
          <Input
            value={apiKey}
            onChange={(e) => setApiKey(e.currentTarget.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <Button className="w-full mt-2">Submit</Button>
          <Button
            type="button"
            className="w-full"
            onClick={() => setApiKey("")}
          >
            Clear
          </Button>
        </div>
      </form>
    </div>
  );
}

export default Startgg;
