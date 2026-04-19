import { useSettingsStore } from "@renderer/zustand/store";
import { Button } from "../ui/button";
import { send } from "@app/preload";

function FolderBrowser({ disabled }: { disabled: boolean }) {
  const savedDirectory = useSettingsStore((state) => state.directory);
  const update = useSettingsStore((state) => state.updateDirectory);

  return (
    <div className="flex items-center flex-col gap-4  border-2 border-cyan-200 rounded-sm p-4 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-center font-semibold text-xl">
          Connect to relay manually
        </h1>
        <h2 className="text-center">
          Note: This option is for those who are connecting to the console via
          Slippi Launcher, etc
        </h2>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-col gap-2">
          <h1 className="text-center font-semibold">Select target folder:</h1>
          <div className="flex gap-4 items-center justify-center ">
            <Button
              type="button"
              disabled={disabled}
              onClick={() => {
                send("file:openDialog")
                  .then((directory) => update(directory))
                  .catch((reason) => console.log(reason));
              }}
            >
              Browse
            </Button>
            <h1>
              {savedDirectory === ""
                ? "No directory selected."
                : savedDirectory}
            </h1>
          </div>
        </div>
        <div className="flex gap-2 w-full justify-center">
          <Button
            disabled={disabled}
            type="button"
            // className="w-full"
            onClick={() =>
              send("slippi:readFolder", savedDirectory).catch((reason) =>
                console.log(reason),
              )
            }
          >
            Save and start reading
          </Button>
          <Button
            type="button"
            onClick={() =>
              send("slippi:stopReadingFolder").catch((reason) =>
                console.log(reason),
              )
            }
            disabled={disabled}
          >
            Stop
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FolderBrowser;
