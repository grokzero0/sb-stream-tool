import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { EventSetsQuery } from "./queries.generated";
import { SetEntry } from "./types/tournament";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function filterSets(data: EventSetsQuery): SetEntry[] {
  const filteredSets = [] as SetEntry[];
  if (
    (!data.event?.sets?.nodes && data?.event?.sets?.nodes === null) ||
    data.event?.sets?.nodes === undefined
  ) {
    return [];
  }
  for (const node of data.event.sets.nodes) {
    if (
      node?.fullRoundText &&
      node.state &&
      node.slots &&
      node.slots[0]?.entrant?.participants &&
      node.slots[1]?.entrant?.participants
    ) {
      filteredSets.push({
        stream: node.stream?.streamName ?? "",
        matchName: node.fullRoundText,
        status: node.state,
        firstGroup: {
          name: node.slots[0].entrant.name ?? "",
          players: node.slots[0].entrant.participants.map((participant) => {
            return {
              teamName: participant?.prefix ?? "",
              playerTag: participant?.gamerTag ?? "",
              pronouns: participant?.user?.genderPronoun ?? "",
              twitter:
                participant?.user?.authorizations?.[0]?.externalUsername ?? "",
            };
          }),
        },
        secondGroup: {
          name: node.slots[1].entrant.name ?? "",
          players: node.slots[1].entrant.participants.map((participant) => {
            return {
              teamName: participant?.prefix ?? "",
              playerTag: participant?.gamerTag ?? "",
              pronouns: participant?.user?.genderPronoun ?? "",
              twitter:
                participant?.user?.authorizations?.[0]?.externalUsername ?? "",
            };
          }),
        },
      });
    }
  }
  console.log("Done filtering");
  return filteredSets as SetEntry[];
}
