import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { send } from "@app/preload";
import { useState } from "react";

function WebsocketInputs() {
  const [ip, setIp] = useState("");
  const [port, setPort] = useState("");
  const [password, setPassword] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send("obs/connect", ip, port, password)
      }}
    >
      <div className="flex flex-col gap-3">
        <h1 className="text-center font-semibold text-xl">Connect to OBS</h1>
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