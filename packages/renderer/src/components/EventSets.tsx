import { useLazyQuery } from "@apollo/client/react";
import {
  changeSetFormat,
  filterSets,
  getSetFormat,
  isInPlacementList,
  sleep,
} from "@renderer/utils/helpers";
import { useSettingsStore } from "@renderer/zustand/store";
import { useRef, useState } from "react";
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
import { SetEntry, SetTableEntry } from "@renderer/types/tournament";
import { DataTable } from "./ui/data-table";
import { columns } from "@renderer/types/columns";
import { RowSelectionState } from "@tanstack/react-table";
import { useFormContext } from "react-hook-form";
import { Tournament } from "@app/common";
import { usePlayerFormFieldArrayContext } from "../hooks/use-player-form-field-array-context";
import { EventSetsDocument } from "@renderer/types/__generated__/graphql-types";
import { useCreateAtom, useSelector } from "@tanstack/react-store";

function EventSets() {
  const savedApiKey = useSettingsStore((state) => state.startggApiKey);
  const savedEventSlug = useSettingsStore((state) => state.eventSlug);
  const currentEventSlug = useRef("");
  const requestsLimitExceeded = useRef(false);
  const totalPagesRef = useRef(1); // for the for loop
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [getData, { fetchMore, error }] = useLazyQuery(EventSetsDocument, {
    fetchPolicy: "network-only",
  });
  const [setsFetched, setSetsFetched] = useState<SetEntry[]>([]);
  const [tournamentName, setTournamentName] = useState("unknown event");
  const [totalPagesState, setTotalPagesState] = useState(0); // for ui rendering
  const rowSelectionAtom = useCreateAtom<RowSelectionState>({});
  const selectedRow = useSelector(rowSelectionAtom);
  const filteredData = setsFetched.map((set) => {
    return {
      stream: set.stream,
      matchName: set.matchName,
      firstGroupName: set.groups[0].name,
      secondGroupName: set.groups[1].name,
    };
  }) as SetTableEntry[];
  const { setValue, getValues } = useFormContext<Tournament>();
  const teams = usePlayerFormFieldArrayContext();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const [statusMessage, setStatusMessage] = useState("");

  const apply = () => {
    const selectedSetIndex = parseInt(Object.keys(selectedRow)[0]);
    if (
      Number.isNaN(selectedSetIndex) ||
      setsFetched[selectedSetIndex].groups.length <= 0
    ) {
      return;
    }
    const setFormat = getSetFormat(
      getValues("teams.0.players").length, // each team's player count are guaranteed to be the same
      setsFetched[selectedSetIndex].groups[0].players.length, // all sets are guaranteed to be the same
    );
    changeSetFormat(setFormat, teams);
    setValue("setFormat", setFormat);
    setValue("name", tournamentName);
    const setRoundFormat = setsFetched[selectedSetIndex].matchName;
    const regex = /^(?:Winners|Losers) Round \d+$/;
    if (regex.test(setRoundFormat)) {
      const splitRoundFormat = setRoundFormat.split(" "); // only known way to get the numeric value
      setValue("roundFormat", `${splitRoundFormat[0]} ${splitRoundFormat[1]}`);
      setValue("roundNumber", parseInt(splitRoundFormat[2]) ?? 0);
    } else {
      if (isInPlacementList(setRoundFormat)) {
        setValue("roundFormat", setRoundFormat);
        setValue("customRoundFormat", "");
      } else {
        setValue("roundFormat", "Custom Match");
        setValue("customRoundFormat", setRoundFormat);
      }
      setValue("roundNumber", 0);
    }

    for (let i = 0; i < getValues("teams").length; i++) {
      for (let j = 0; j < getValues(`teams.${i}.players`).length; j++) {
        setValue(`teams.${i}.players.${j}.playerInfo`, {
          teamName: setsFetched[selectedSetIndex].groups[i].players[j].teamName,
          playerTag:
            setsFetched[selectedSetIndex].groups[i].players[j].playerTag,
          pronouns: setsFetched[selectedSetIndex].groups[i].players[j].pronouns,
          twitter: setsFetched[selectedSetIndex].groups[i].players[j].twitter,
        });
      }
    }
    setStatusMessage(`Applying Set ${selectedSetIndex}...`);

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setStatusMessage("");
      setSheetOpen(false);
    }, 2000);
  };

  const fetchSets = async () => {
    for (let i = 1; i <= totalPagesRef.current; i++) {
      do {
        if (error && !requestsLimitExceeded.current) {
          console.log("Error found");
          requestsLimitExceeded.current = true;
          await sleep(60000).then(
            () => (requestsLimitExceeded.current = false),
          );
        }
        if (i == 1) {
          const { data } = await getData({
            variables: {
              eventSlug: currentEventSlug.current,
              page: i,
              perPage: 50,
            },
          });
          totalPagesRef.current = data?.event?.sets?.pageInfo?.totalPages ?? 0;
          setTotalPagesState(data?.event?.sets?.pageInfo?.totalPages ?? 0);
          setTournamentName(data?.event?.tournament?.name ?? "unknown event");
          setSetsFetched(filterSets(data?.event?.sets?.nodes));
        } else {
          const { data } = await fetchMore({ variables: { page: i } });
          const filteredSets = filterSets(data?.event?.sets?.nodes);
          setSetsFetched((prevSets) => [...prevSets, ...filteredSets]);
        }
        setPagesLoaded((pages) => pages + 1);
      } while (requestsLimitExceeded.current);
    }
  };
  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(open) => {
        setSheetOpen(open);
        if (
          open == false ||
          savedEventSlug === "" ||
          currentEventSlug.current === savedEventSlug // ensure that you dont fetch the same set again while its loading
        ) {
          return;
        }

        currentEventSlug.current = savedEventSlug;
        fetchSets().catch((reason) => console.log(reason));
      }}
    >
      <SheetTrigger asChild>
        <Button disabled={savedApiKey === "" || savedEventSlug === ""}>
          Get all sets in {savedEventSlug === "" ? "event" : savedEventSlug}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>All sets in {tournamentName}</SheetTitle>
          <SheetDescription>
            Pages {pagesLoaded} of {totalPagesState} loaded
          </SheetDescription>
        </SheetHeader>
        <div>
          <DataTable
            columns={columns}
            data={filteredData}
            rowSelectionAtom={rowSelectionAtom}
            multiRows={false}
          />
        </div>
        <SheetFooter>
          {statusMessage}
          <Button type="button" onClick={apply}>
            Apply this set
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default EventSets;
