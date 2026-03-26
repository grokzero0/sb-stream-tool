import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { useSettingsStore } from "@renderer/zustand/store";

function FetchEvent() {
  const savedEventUrl = useSettingsStore((state) => state.eventUrl);
  const update = useSettingsStore((state) => state.updateEventUrl);
  const [eventUrl, setEventUrl] = useState(savedEventUrl);
  const [dialogOpen, setDialogOpen] = useState(false);
  const apiKey = useSettingsStore((state) => state.apiKey);
  return (
    <Dialog open={dialogOpen} onOpenChange={(open) => setDialogOpen(open)}>
      <DialogTrigger asChild>
        <Button disabled={apiKey === ""} className="w-full mb-1">
          Set Tournament
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Event URL</DialogTitle>
          <DialogDescription>
            Type in the Start.gg event url (has the /event/ after it)
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label>Event URL</Label>
          <Input
            value={eventUrl}
            onChange={(e) => setEventUrl(e.currentTarget.value)}
          />
        </div>
        <Button
          type="button"
          onClick={() => {
            update(eventUrl);
            setDialogOpen(false);
          }}
        >
          Update
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default FetchEvent;
