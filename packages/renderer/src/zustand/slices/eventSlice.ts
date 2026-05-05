import { StateCreator } from "zustand";
import { StoreSliceType } from "./slice";
import { send } from "@app/preload";

export type EventSlice = {
  eventUrl: string;
  eventSlug: string;
  updateEventUrl: (newEventUrl: string, newEventSlug: string) => void;
};

export const createEventSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  EventSlice
> = (set) => ({
  eventUrl: "",
  eventSlug: "",
  updateEventUrl: (newEventUrl, newEventSlug) => {
    set((state) => {
      state.eventUrl = newEventUrl;
      state.eventSlug = newEventSlug;
    });
    send("startgg/save-tournament-url", newEventUrl).catch((error) =>
      console.log(error),
    );
  },
});
