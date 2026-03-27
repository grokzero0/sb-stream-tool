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

function EventSetsQuery() {
  const savedApiKey = useSettingsStore((state) => state.startggApiKey);
  const savedEventSlug = useSettingsStore((state) => state.eventSlug);
  const requestsLimitExceeded = useRef(false);
  const [totalPagesState, setTotalPagesState] = useState(1);
  const totalPages = useRef(1);
  const [pagesLoaded, setPagesLoaded] = useState(0);
  const [eventName, setEventName] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [getData] = useLazyQuery(EventSetsDocument, {
    fetchPolicy: "network-only",
  });
  const [setsLoaded, setSetsLoaded] = useState<SetEntry[]>([]);
  const [selection, setSelection] = useState<RowSelectionState>({});
  const selectedValue = Object.keys(selection);
  const data = setsLoaded.map((set) => {
    return {
      stream: set.stream,
      matchName: set.matchName,
      firstGroupName: set.groups[0].name,
      secondGroupName: set.groups[1].name,
    };
  }) as SetTableEntry[];

  const fetchSets = async () => {
    console.log(requestsLimitExceeded.current);
    for (let i = 1; i <= totalPages.current; i++) {
      console.log(i);
      do {
        if (requestsLimitExceeded.current) {
          await sleep(60000);
        }
        const { data, error } = await getData({
          variables: {
            eventSlug: savedEventSlug,
            page: i,
            perPage: 50,
          },
        });
        if (!data || error) {
          requestsLimitExceeded.current = true;
        } else {
          requestsLimitExceeded.current = false;
          if (i === 1) {
            setTotalPagesState(data.event?.sets?.pageInfo?.totalPages ?? 0);
            totalPages.current = data.event?.sets?.pageInfo?.totalPages ?? 0;
            setEventName(data.event?.tournament?.name ?? "");
            setSetsLoaded(filterSets(data));
          } else {
            setSetsLoaded((prevSetsLoaded) => [
              ...prevSetsLoaded,
              ...filterSets(data),
            ]);
          }
          setPagesLoaded((pages) => pages + 1);
        }
      } while (requestsLimitExceeded.current);
    }
  };
  return (
    <Sheet
      open={sheetOpen}
      onOpenChange={(open) => {
        setSheetOpen(open);
        if (open == false || savedEventSlug === "") {
          return;
        }
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
          <SheetTitle>
            All sets in {eventName === "" ? "unknown event" : eventName}
          </SheetTitle>
          <SheetDescription>
            Pages {pagesLoaded} of {totalPagesState} loaded
          </SheetDescription>
        </SheetHeader>
        <div>
          <DataTable
            columns={columns}
            data={data}
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

export default EventSetsQuery;
