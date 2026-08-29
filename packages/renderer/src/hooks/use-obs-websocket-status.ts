import { onObsConnectionStatusChange } from "@app/preload";
import { useEffect, useState } from "react";

export function useObsWebsocketStatus() {
  const [obsWebsocketStatus, setObsWebsocketStatus] = useState<
    "connected" | "disconnected" | "error"
  >("disconnected");

  useEffect(() => {
    onObsConnectionStatusChange((status) => {
      setObsWebsocketStatus(status);
    });
  }, []);

  return { obsWebsocketStatus };
}
