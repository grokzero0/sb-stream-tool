// import { usePlayerFormFieldArrayContext } from "@renderer/hooks/use-player-form-field-array-context";
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
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";

function SetQuery() {
  const [setId, setSetId] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const handleClick = () => {
    setStatusMessage("");
    if (setId === "") {
      setStatusMessage("Please type in a set ID");
      return;
    }
  };
  //   const teams = usePlayerFormFieldArrayContext();
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button>Get a specific set</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Set Query</SheetTitle>
          <SheetDescription>
            Get a specific set's information (players, etc)
          </SheetDescription>
        </SheetHeader>
        <div className="p-1">
          <Label>Set ID</Label>
          <Input
            value={setId}
            onChange={(e) => setSetId(e.currentTarget.value)}
          />
        </div>
        {statusMessage}
        <SheetFooter>
          <Button type="button" onClick={handleClick}>
            Save changes
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
export default SetQuery;
