import { useLazyQuery } from "@apollo/client/react";
import { sleep } from "@renderer/utils/helpers";
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
      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            All sets in {eventName === "" ? "unknown event" : eventName}
          </SheetTitle>
          <SheetDescription>
            Pages {pagesLoaded} of {totalPagesState} loaded
          </SheetDescription>
        </SheetHeader>
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
