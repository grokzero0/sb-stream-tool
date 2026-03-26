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
import { useSettingsStore } from "@renderer/zustand/store";
import { SetEntrantsDocument } from "@renderer/utils/queries.generated";
import { useLazyQuery } from "@apollo/client/react";
import { useFormContext } from "react-hook-form";
import { Tournament } from "@app/common";
function SetQuery() {
  const [setId, setSetId] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [getData, { loading, error }] = useLazyQuery(SetEntrantsDocument);
  const apiKey = useSettingsStore((state) => state.apiKey);
  const { setValue } = useFormContext<Tournament>();
  const handleClick = async () => {
    setStatusMessage("");
    if (setId === "") {
      setStatusMessage("Please type in a set ID");
      return;
    }

    const { data } = await getData({ variables: { setId: setId } });

    if (!data) {
      setStatusMessage("No information found");
      return;
    }

    setStatusMessage(`Set ${setId} found! Applying information...`);
    setValue("name", data.set?.event?.tournament?.name ?? "")
  };
  //   const teams = usePlayerFormFieldArrayContext();
  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(open) => {
        setStatusMessage("");
        setSheetOpen(open);
      }}
    >
      <SheetTrigger asChild>
        <Button disabled={!apiKey || apiKey === ""}>Get a specific set</Button>
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
        {loading && <h2>Getting Set {setId}'s information, please wait...</h2>}
        {error && <h2>An error has occurred:{error.message}</h2>}
        <SheetFooter>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
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
