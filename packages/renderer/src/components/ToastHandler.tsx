import { toastMessage } from "@app/preload";
import { X } from "lucide-react";
import { toast } from "sonner";

function ToastHandler() {
  toastMessage((message, description) => {
    console.log("ToastHandler")
    console.log(message)
    console.log(description)
    toast(message, {
      action: <X />,
      description: description,
    });
  });
  return <></>;
}

export default ToastHandler;
