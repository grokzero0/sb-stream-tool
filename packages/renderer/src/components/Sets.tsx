/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { useSettingsStore } from "@/lib/store/store";
import { useLazyQuery } from "@apollo/client/react";
import { EventSetsDocument } from "@/lib/queries.generated";
import { SetEntry, SetTableEntry } from "@/lib/types/tournament";
import { filterSets } from "@/lib/utils";
import { DataTable } from "./ui/data-table";
import { columns } from "@/lib/types/columns";
import { useFormContext } from "react-hook-form";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function Sets() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const savedTournamentSlug = useSettingsStore((state) => state.tournamentSlug);
  const currentTournamentSlug = useRef("");
  const [getData, { loading, error }] = useLazyQuery(EventSetsDocument);
  const requestsMade = useRef(0);
  const [sets, setSets] = useState([] as SetEntry[]);
  const [numPages, setNumPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedSet, setSelectedSet] = useState() as any;
  const { setValue, getValues } = useFormContext();
  const setData = sets.map((set) => {
    return {
      stream: set.stream,
      matchName: set.matchName,
      firstGroupName: set.firstGroup.name,
      secondGroupName: set.secondGroup.name,
    };
  }) as SetTableEntry[];
  console.log(selectedSet);
  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={async (open) => {
        setDialogOpen(open);
        if (
          open == false ||
          savedTournamentSlug === "" ||
          currentTournamentSlug.current === savedTournamentSlug
        ) {
          return;
        }
        currentTournamentSlug.current = savedTournamentSlug;
        if (requestsMade.current >= 80) {
          await sleep(60000);
          requestsMade.current = 0;
        }
        const { data } = await getData({
          variables: { eventSlug: savedTournamentSlug, page: 1, perPage: 50 },
        });
        requestsMade.current += 1;
        if (data) {
          setSets(filterSets(data));
          setCurrentPage(1);
          const pages = data.event!.sets!.pageInfo!.totalPages!;
          setNumPages(pages);
          for (let i = 2; i <= pages; i++) {
            if (requestsMade.current >= 80) {
              await sleep(60000);
              requestsMade.current = 0;
            }
            const { data } = await getData({
              variables: {
                eventSlug: savedTournamentSlug,
                page: i,
                perPage: 50,
              },
            });
            if (data) {
              setSets((prevData) => [...prevData, ...filterSets(data)]);
            }
            setCurrentPage(i);
            requestsMade.current += 1;
          }
        }
      }}
    >
      <DialogTrigger asChild>
        <Button disabled={savedTournamentSlug === ""} className="w-full">
          Choose set from{" "}
          {savedTournamentSlug !== "" ? savedTournamentSlug : "tournament"}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>
            Sets in{" "}
            {savedTournamentSlug !== "" ? savedTournamentSlug : "tournament"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col w-full gap-4">
          {loading && "Loading pages"}
          <DataTable
            columns={columns}
            data={setData}
            setSelection={setSelectedSet}
          />
          <h1>
            Page {currentPage} of {numPages} loaded
          </h1>
          {error && "An error has occured"}

          <Button
            className="w-full"
            type="button"
            // disabled={!selectedSet}
            onClick={() => {
              if (!selectedSet) {
                return;
              }
              const location = selectedSet[0].id;
              // console.log(selectedSet[1])
              for (let i = 0; i < getValues(`teams.0.players`).length; i++) {
                setValue(`teams.0.players.${i}.info`, {
                  teamName: sets[location].firstGroup.players[i].teamName,
                  playerTag: sets[location].firstGroup.players[i].playerTag,
                  pronouns: sets[location].firstGroup.players[i].pronouns,
                  twitter: sets[location].firstGroup.players[i].twitter,
                });
              }
              for (let i = 0; i < getValues(`teams.1.players`).length; i++) {
                setValue(`teams.1.players.${i}.info`, {
                  teamName: sets[location].secondGroup.players[i].teamName,
                  playerTag: sets[location].secondGroup.players[i].playerTag,
                  pronouns: sets[location].secondGroup.players[i].pronouns,
                  twitter: sets[location].secondGroup.players[i].twitter,
                });
              }
            }}
          >
            Apply this Set
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
export default Sets;
