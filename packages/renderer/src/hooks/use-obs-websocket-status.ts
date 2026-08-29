import { ObsConnectionStatus } from "@app/common";
import { onObsConnectionStatusChange } from "@app/preload";
import { useEffect, useState } from "react";

export function useObsWebsocketStatus() {
  const [obsWebsocketStatus, setObsWebsocketStatus] =
    useState<ObsConnectionStatus>("disconnected");

  useEffect(() => {
    onObsConnectionStatusChange((status) => {
      setObsWebsocketStatus(status);
    });
  }, []);

  return { obsWebsocketStatus };
}
