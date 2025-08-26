import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useLazyQuery } from "@apollo/client/react";
import { SetEntrantsDocument } from "@/lib/queries.generated";
import { useFormContext } from "react-hook-form";

function Query() {
  const [setID, setSetID] = useState("");
  // const [isSetIDEmpty, setIsSetIDEmpty] = useState(false);
  const [isNullSetID, setIsNullSetID] = useState(false);
  const [getData, { loading, error }] = useLazyQuery(SetEntrantsDocument);
  const [open, setOpen] = useState(false);
  const { setValue, getValues } = useFormContext()

  const handleClick = async () => {
    if (setID === "") {
      return;
    }
    console.log("Getting data from api");
    console.log(setID);
    getData({ variables: { setId: setID } }).then(({ data }) => {
      setIsNullSetID(false);
      console.log(data);
      setValue("name", data?.set?.event?.tournament?.name)
      for (let i = 0; i < getValues("teams").length; i++) {
        for (let j = 0; j < getValues(`teams.${i}.players`).length; j++) {
          setValue(`teams.${i}.players.${j}.info`, {
            teamName: data?.set?.slots?.[i]?.entrant?.participants?.[j]?.prefix ?? '',
            playerTag: data?.set?.slots?.[i]?.entrant?.participants?.[j]?.gamerTag ?? '',
            pronouns: data?.set?.slots?.[i]?.entrant?.participants?.[j]?.user?.genderPronoun ?? '',
            twitter:
              data?.set?.slots?.[i]?.entrant?.participants?.[j]?.user?.authorizations?.[0]
                ?.externalUsername ?? ''
          }
          )
        }
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          Automatically fill in player data from a set
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Fill in player data from a set</DialogTitle>
          <DialogDescription>
            Type in the set ID of the set you want to fetch (the numbers at the
            end of the set URL)
          </DialogDescription>
        </DialogHeader>
        <div>
          <Label className="mb-1">Set ID</Label>
          <Input
            value={setID}
            onChange={(e) => setSetID(e.currentTarget.value)}
          />
        </div>
        {loading && (
          <p>Fetching information from set {setID}, please wait...</p>
        )}
        {isNullSetID && <p>Not valid Set ID, try again</p>}
        {error && <p>An error occurred, please try again later</p>}
        <Button type="button" onClick={handleClick}>
          Fetch Data
        </Button>
      </DialogContent>
    </Dialog>
  );
}

export default Query;