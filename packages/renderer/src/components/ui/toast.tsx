/* eslint-disable react-refresh/only-export-components */
import { toastMessage } from "@app/preload";
import { X } from "lucide-react";
import { useEffect } from "react";
import { toast } from "sonner";
import { Toaster } from "./sonner";

const sendToastMessage = (
  message: string | undefined,
  description: string | undefined,
) =>
  toast(message, {
    action: {
      label: <X />,
      onClick: () => {
        return;
      },
    },
    description: description,
  });

function Toast() {
  useEffect(() => {
    toastMessage((message, description) => {
      sendToastMessage(message, description);
    });
  });
  return <Toaster />;
}

export { Toast, sendToastMessage };
