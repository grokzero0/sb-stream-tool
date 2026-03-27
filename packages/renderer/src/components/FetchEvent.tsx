import { useState } from "react";
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

function FetchEvent() {
  const savedEventUrl = useSettingsStore((state) => state.eventUrl);
  const update = useSettingsStore((state) => state.updateEventUrl);
  const [eventUrl, setEventUrl] = useState(savedEventUrl);
  // const apiKey = useSettingsStore((state) => state.apiKey);
  return (
    <Sheet>
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
          <Button type="button" onClick={() => update(eventUrl)}>
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
