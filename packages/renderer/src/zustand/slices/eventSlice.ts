import { StateCreator } from "zustand";
import { StoreSliceType } from "./slice";

export type EventSlice = {
  eventUrl: string;
  eventSlug: string;
  updateEventUrl: (newEventUrl: string) => void;
};

export const createEventSlice: StateCreator<
  StoreSliceType,
  [["zustand/immer", never]],
  [],
  EventSlice
> = (set) => ({
  eventUrl: "",
  eventSlug: "",
  updateEventUrl: (newEventUrl) =>
    set((state) => {
      state.eventUrl = newEventUrl;
      state.eventSlug = new URL(newEventUrl).pathname
        .split("/")
        .slice(1, 5)
        .join("/");
    }),
});
