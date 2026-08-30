import { send } from "@app/preload";
import { Button } from "../ui/button";
import { SlippiRelayConfig } from "@app/common";

function ConsoleConnection() {
  return (
    <div className="flex items-center flex-col gap-4 border-t-2 p-4 w-full">
      <div className="flex flex-col gap-2">
        <h1 className="text-center font-semibold text-xl">
          Connect to a Wii relay
        </h1>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <Button type="button" onClick={() => {send("slippi-relay/start", {
          type: "console",
          ip: "192.168.1.164",
          port: 1667
        } as SlippiRelayConfig)}}>Connect</Button>
        <Button type="button">Disconnect</Button>
      </div>
    </div>
  );
}

export default ConsoleConnection;
