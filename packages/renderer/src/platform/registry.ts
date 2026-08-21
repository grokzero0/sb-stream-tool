import { StartggPlatform } from "./startgg/StartggPlatform";
import type { EventId, PlatformId, TournamentPlatform } from "./types";

export const PLATFORMS: TournamentPlatform[] = [StartggPlatform];

export function platformById(id: PlatformId): TournamentPlatform {
  const platform = PLATFORMS.find((candidate) => candidate.id === id);
  if (!platform) {
    throw new Error(`No tournament platform registered for id "${id}"`);
  }
  return platform;
}

/**
 * Used when no event is selected, since set lookup by id works without one.
 * Revisit once a second platform makes the choice non-obvious.
 */
export function defaultPlatform(): TournamentPlatform {
  return PLATFORMS[0];
}

export function platformForEventUrl(url: string): TournamentPlatform {
  const eventId = resolveEventUrl(url);
  return eventId ? platformById(eventId.platform) : defaultPlatform();
}

export function resolveEventUrl(url: string): EventId | null {
  for (const platform of PLATFORMS) {
    const eventId = platform.parseEventUrl(url);
    if (eventId) {
      return eventId;
    }
  }
  return null;
}
