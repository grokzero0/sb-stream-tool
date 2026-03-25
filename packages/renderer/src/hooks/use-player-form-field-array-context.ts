import { use } from "react";
import { PlayerFormFieldArrayContext } from "./contexts";

export function usePlayerFormFieldArrayContext() {
  const context = use(PlayerFormFieldArrayContext);

  if (context === undefined || context.length == 0) {
    throw new Error(
      "usePlayerFormFieldArrayContext must be used within a PlayerFormFieldArrayProvider",
    );
  }

  return context;
}
