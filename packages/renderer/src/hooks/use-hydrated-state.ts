import { Dispatch, SetStateAction, useState } from "react";

// a variant of usestate where the initial passed value can be changed (instead of frozen as soon as its defined) until the internal state changes (input value change, etc)
export function useHydratedState<T>(
  initialSavedState: T,
): [T, Dispatch<SetStateAction<T>>, () => void] {
  const [hydratedState, setHydratedState] = useState<T | undefined>(undefined);

  const state = hydratedState === undefined ? initialSavedState : hydratedState;

  // wrapper so the exposed setter takes SetStateAction<T> (not T | undefined)
  // fixes the setstate with previous state bug (e.g. internal state has undefined map initially -> previous value is empty map -> set state based on that previous map -> returns the new map with the empty map value set to the new value)
  const setState: Dispatch<SetStateAction<T>> = (value) => {
    if (typeof value === "function") {
      const updater = value as (prev: T) => T;
      setHydratedState((prev) =>
        updater(prev === undefined ? initialSavedState : prev),
      );
    } else {
      setHydratedState(value);
    }
  };

  const reset = () => setHydratedState(undefined);

  return [state, setState, reset];
}
