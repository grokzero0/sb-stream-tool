import { useState } from "react";
import { useSettingsStore } from "../../../zustand/store";
import { send } from "@app/preload";
import { Label } from "@renderer/components/ui/label";
import { Input } from "@renderer/components/ui/input";
import { Button } from "@renderer/components/ui/button";

function WebsocketInputs() {
  const savedIp = useSettingsStore((state) => state.websocketIp);
  const savedPort = useSettingsStore((state) => state.websocketPort);
  const savedPassword = useSettingsStore((state) => state.websocketPassword);
  const update = useSettingsStore((state) => state.updateWebsocketSettings);

  const [ip, setIp] = useState(savedIp);
  const [port, setPort] = useState(savedPort);
  const [password, setPassword] = useState(savedPassword);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const websocketIp = ip.trim();
        const websocketPort = port.trim();
        const websocketPassword = password.trim();

        update(websocketIp, websocketPort, websocketPassword);

        send(
          "obs/connect",
          websocketIp,
          websocketPort,
          websocketPassword,
        ).catch((error) => console.log(error));
      }}
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-center font-semibold text-xl">
          Connect to the OBS Websocket
        </h1>
        <div className="flex flex-col gap-2">
          <Label>IP Address</Label>
          <Input
            placeholder="127.0.0.1"
            value={ip}
            onChange={(e) => setIp(e.currentTarget.value)}
          ></Input>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Port</Label>
          <Input
            type="number"
            placeholder="4455"
            value={port}
            onChange={(e) => setPort(e.currentTarget.value)}
          ></Input>
        </div>
        <div className="flex flex-col gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
          ></Input>
        </div>
        <Button>Connect</Button>
      </div>
    </form>
  );
}
export default WebsocketInputs;
