/* eslint-disable no-useless-escape */
import { useRef, useState } from "react";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useSettingsStore } from "@renderer/zustand/store";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useHydratedState } from "@renderer/hooks/use-hydrated-state";
import { resolveEventUrl } from "@renderer/platform/registry";

function FetchEvent() {
  const savedEventUrl = useSettingsStore((state) => state.eventUrl);
  const update = useSettingsStore((state) => state.updateEventUrl);
  const [eventUrl, setEventUrl] = useHydratedState(savedEventUrl);
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);

  // const apiKey = useSettingsStore((state) => state.apiKey);
  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button type="button" className="w-full">
          Set Tournament
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Set Tournament</SheetTitle>
          <SheetDescription>
            Type in the start.gg event url (url will have /event after it){" "}
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <Label className="pb-1">Event URL</Label>
          <Input
            value={eventUrl}
            onChange={(e) => setEventUrl(e.currentTarget.value)}
          ></Input>
        </div>
        <SheetFooter>
          {statusMessage}
          <Button
            type="button"
            onClick={() => {
              const eventId = resolveEventUrl(eventUrl);
              if (eventId === null) {
                setStatusMessage("Invalid Start.gg URL");
                return;
              }
              setStatusMessage(`Applying event ${eventUrl}...`);
              update(eventId.url, eventId.id);
              setStatusMessage(`Applied event ${eventUrl}!`);
              clearTimeout(timeoutRef.current);
              timeoutRef.current = setTimeout(() => {
                setStatusMessage("");
                setSheetOpen(false);
              }, 2000);
            }}
          >
            Update URL
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default FetchEvent;
