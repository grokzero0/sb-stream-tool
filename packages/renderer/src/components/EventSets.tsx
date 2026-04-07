import { useLazyQuery } from "@apollo/client/react";
import { filterSets, sleep } from "@renderer/utils/helpers";
import { EventSetsDocument } from "@renderer/utils/queries.generated";
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

function EventSets() {
  const savedApiKey = useSettingsStore((state) => state.startggApiKey);
  const savedEventSlug = useSettingsStore((state) => state.eventSlug);
  const [currentEventSlug, setCurrentEventSlug] = useState("");
  const requestsLimitExceeded = useRef(false);
  const totalPages = useRef(1);
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [getData, { fetchMore, error }] = useLazyQuery(EventSetsDocument, {
    fetchPolicy: "network-only",
  });
  const [setsFetched, setSetsFetched] = useState<SetEntry[]>([]);
  const [tournamentName, setTournamentName] = useState("unknown event");
  const [totalPagesState, setTotalPagesState] = useState(0);
  const [selection, setSelection] = useState<RowSelectionState>({});
  const selectedValue = Object.keys(selection);
  const filteredData = setsFetched.map((set) => {
    return {
      stream: set.stream,
      matchName: set.matchName,
      firstGroupName: set.groups[0].name,
      secondGroupName: set.groups[1].name,
    };
  }) as SetTableEntry[];
  console.log(filteredData);

  const fetchSets = async () => {
    // console.log(requestsLimitExceeded.current);
    for (let i = 1; i <= totalPages.current; i++) {
      console.log(i);
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
              eventSlug: savedEventSlug,
              page: i,
              perPage: 50,
            },
          });
          totalPages.current = data?.event?.sets?.pageInfo?.totalPages ?? 0;
          setTotalPagesState(data?.event?.sets?.pageInfo?.totalPages ?? 0);
          setTournamentName(data?.event?.tournament?.name ?? "unknown event");
          setSetsFetched(filterSets(data));
        } else {
          const { data } = await fetchMore({ variables: { page: i } });
          const filteredSets = filterSets(data);
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
          currentEventSlug === savedEventSlug // ensure that you dont fetch the same set again while its loading
        ) {
          return;
        }
        setCurrentEventSlug(savedEventSlug);
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
            setSelection={setSelection}
            multiRows={false}
          />
          {selectedValue}
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button variant="outline">Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default EventSets;
