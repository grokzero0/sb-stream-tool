import {
  BracketServiceClient,
  BracketType,
  GetBracketRequest,
  GetMatchRequest,
  GetTournamentRequest,
  GetTournamentStreamsRequest,
  MatchServiceClient,
  MatchState,
  PathType,
  StreamServiceClient,
  TournamentIdentifier,
  TournamentServiceClient,
  type Bracket,
  type Hierarchy,
  type Match,
  type MatchContext,
  type Round,
  type Seed,
  type Tournament,
} from "@parry-gg/client";
import { RpcError, StatusCode } from "grpc-web";
import type { PlayerInfo } from "@app/common";
import type {
  EventId,
  PlatformClient,
  PlatformEntrant,
  PlatformId,
  PlatformSet,
  ProgressCallback,
  SetState,
  TournamentPlatform,
} from "../types";

const PLATFORM_ID: PlatformId = "parrygg";
const DISPLAY_NAME = "parry.gg";
const API_KEY_DOCS_URL = "https://parry.gg/api-keys";
const GRPC_WEB_URL = "https://grpcweb.parry.gg";
const API_KEY_HEADER = "X-API-KEY";
const INVALID_KEY_MESSAGE =
  "Your parry.gg API key is invalid or expired. Open Settings to update it.";
const UNKNOWN_EVENT_NAME = "unknown event";
const REQUEST_FAILED_MESSAGE = "The parry.gg request failed";
const NO_TOURNAMENT_MESSAGE = "No parry.gg tournament found at";
const ROUND_ROBIN_ROUND_NAME = "Round Robin";
const TEAM_NAME_SEPARATOR = " / ";

// Admin URLs interleave a "_manage" segment: parry.gg/<tournament>/_manage/<event>/...
const MANAGE_PATH = "/_manage/";
const EVENT_URL_PATTERN =
  /^https:\/\/(?:www\.)?parry\.gg\/([^/?#]+)\/([^/?#]+)(?:[/?#].*)?$/;

const tournamentService = new TournamentServiceClient(GRPC_WEB_URL);
const bracketService = new BracketServiceClient(GRPC_WEB_URL);
const matchService = new MatchServiceClient(GRPC_WEB_URL);
const streamService = new StreamServiceClient(GRPC_WEB_URL);

function toSetState(state: MatchState): SetState {
  switch (state) {
    case MatchState.MATCH_STATE_READY:
      return "ready";
    case MatchState.MATCH_STATE_IN_PROGRESS:
      return "in-progress";
    case MatchState.MATCH_STATE_COMPLETED:
      return "completed";
    default:
      return "pending";
  }
}

// start.gg's equivalent filter is literally state:[1] (CREATED). parry splits that
// into PENDING and READY, and READY -- both entrants assigned -- is the category a
// stream operator actually wants, so both count as upcoming here.
function isUpcoming(state: SetState) {
  return state === "pending" || state === "ready";
}

function toPlayer(user: {
  getGamerTag(): string;
  getSponsorName(): string;
  getPronouns(): string;
}): PlayerInfo {
  return {
    teamName: user.getSponsorName(),
    playerTag: user.getGamerTag(),
    pronouns: user.getPronouns(),
    // parry has no Twitter field; LinkedAccount only covers Discord and start.gg.
    twitter: "",
  };
}

// Falls back to the projected entrant so a slot fed by an unfinished progression
// shows who is expected there rather than a blank row.
function toEntrant(seed: Seed | undefined): PlatformEntrant | null {
  const eventEntrant = seed?.hasEventEntrant()
    ? seed.getEventEntrant()
    : seed?.getProjectedEventEntrant();
  const entrant = eventEntrant?.getEntrant();

  if (!entrant) {
    return null;
  }

  const players = entrant.getUsersList().map(toPlayer);
  return {
    name:
      eventEntrant?.getName() ||
      players.map((player) => player.playerTag).join(TEAM_NAME_SEPARATOR),
    players,
  };
}

function padEntrants(entrants: PlatformEntrant[]): PlatformEntrant[] {
  while (entrants.length > 0 && entrants.length < 2) {
    entrants.push({
      name: "",
      players: entrants[0].players.map(() => ({
        teamName: "",
        playerTag: "",
        pronouns: "",
        twitter: "",
      })),
    });
  }
  return entrants;
}

function roundKey(round: number, winnersSide: boolean) {
  return `${round}:${String(winnersSide)}`;
}

function toRoundName(
  match: Match,
  rounds: Map<string, Round>,
  bracketType: BracketType,
) {
  if (bracketType === BracketType.BRACKET_TYPE_ROUND_ROBIN) {
    return ROUND_ROBIN_ROUND_NAME;
  }
  return (
    rounds.get(roundKey(match.getRound(), match.getWinnersSide()))?.getLabel() ??
    ""
  );
}

function toPlatformSet(
  match: Match,
  seeds: Map<string, Seed>,
  roundName: string,
  streams: Map<string, string>,
  tournamentName: string,
): PlatformSet | null {
  const entrants = padEntrants(
    match
      .getSlotsList()
      .map((slot) => toEntrant(seeds.get(slot.getSeedId())))
      .filter((entrant): entrant is PlatformEntrant => entrant !== null),
  );

  if (entrants.length === 0) {
    return null;
  }

  const streamId = match.hasStreamQueueEntry()
    ? match.getStreamQueueEntry()?.getStreamId()
    : undefined;

  return {
    matchName: roundName,
    state: toSetState(match.getState()),
    stream: (streamId && streams.get(streamId)) || "",
    tournamentName,
    entrants,
  };
}

function tournamentNameFromHierarchy(hierarchy: Hierarchy | undefined) {
  // PATH_TYPE_TOURNAMENT is 0, which protobuf also reports for an unset enum, so
  // a match here is not proof the field was populated.
  return (
    hierarchy
      ?.getPathsList()
      .find((path) => path.getType() === PathType.PATH_TYPE_TOURNAMENT)
      ?.getName() ?? ""
  );
}

class ParryggClient implements PlatformClient {
  private readonly metadata: Record<string, string>;

  constructor(apiKey: string) {
    this.metadata = { [API_KEY_HEADER]: apiKey };
  }

  // Surfaces a bad key as something actionable instead of a raw RpcError, and
  // never lets a blank RpcError message reach the UI as an empty error box --
  // parry.gg returns NOT_FOUND and several others with no message at all.
  private toError(reason: unknown): unknown {
    if (!(reason instanceof RpcError)) {
      return reason;
    }
    if (reason.code === StatusCode.UNAUTHENTICATED) {
      return new Error(INVALID_KEY_MESSAGE);
    }
    return new Error(
      reason.message || `${REQUEST_FAILED_MESSAGE} (code ${reason.code})`,
    );
  }

  private async call<T>(request: Promise<T>): Promise<T> {
    try {
      return await request;
    } catch (reason) {
      throw this.toError(reason);
    }
  }

  /** Resolves to undefined on NOT_FOUND, which callers treat as "no such record". */
  private async callOptional<T>(request: Promise<T>): Promise<T | undefined> {
    try {
      return await request;
    } catch (reason) {
      if (reason instanceof RpcError && reason.code === StatusCode.NOT_FOUND) {
        return undefined;
      }
      throw this.toError(reason);
    }
  }

  private async getTournament(tournamentSlug: string) {
    const request = new GetTournamentRequest();
    request.setTournamentSlug(tournamentSlug);
    const response = await this.callOptional(
      tournamentService.getTournament(request, this.metadata),
    );
    return response?.getTournament();
  }

  /** Maps stream id to channel name for every stream on the tournament. */
  private async getStreams(tournamentSlug: string) {
    const identifier = new TournamentIdentifier();
    identifier.setTournamentSlug(tournamentSlug);
    const request = new GetTournamentStreamsRequest();
    request.setTournamentIdentifier(identifier);

    const response = await this.call(
      streamService.getTournamentStreams(request, this.metadata),
    );
    return new Map(
      response.getStreamsList().map((stream) => [stream.getId(), stream.getChannel()]),
    );
  }

  private async getBracket(bracketId: string) {
    const request = new GetBracketRequest();
    request.setId(bracketId);
    const response = await this.call(
      bracketService.getBracket(request, this.metadata),
    );
    return response.getBracket();
  }

  async getSet(setId: string): Promise<PlatformSet | null> {
    const request = new GetMatchRequest();
    request.setId(setId);
    const response = await this.callOptional(
      matchService.getMatch(request, this.metadata),
    );

    const context: MatchContext | undefined = response?.getMatch();
    const match = context?.getMatch();
    if (!context || !match) {
      return null;
    }

    // A MatchContext carries its seeds and round inline, so unlike a list walk
    // this needs no bracket fetch. Stream is left empty to match start.gg, whose
    // set-by-id query does not select it either.
    const seeds = new Map(
      context.getSeedsList().map((seed) => [seed.getId(), seed]),
    );

    return toPlatformSet(
      match,
      seeds,
      context.getRound()?.getLabel() ?? "",
      new Map(),
      tournamentNameFromHierarchy(context.getHierarchy()),
    );
  }

  async getSets(
    eventId: EventId,
    opts: { upcomingOnly: boolean },
    onProgress?: ProgressCallback,
  ): Promise<PlatformSet[]> {
    const [tournamentSlug, eventSlug] = eventId.id.split("/");

    const tournament = await this.getTournament(tournamentSlug);
    if (!tournament) {
      // Otherwise a typo in the pasted URL reads as an event with no sets.
      throw new Error(`${NO_TOURNAMENT_MESSAGE} ${eventId.url}`);
    }

    const tournamentName = tournament.getName() || UNKNOWN_EVENT_NAME;
    const brackets = eventBrackets(tournament, eventSlug);

    if (brackets.length === 0) {
      // start.gg always reports its first page, so emit once regardless -- the
      // sheet only reads the tournament name when loaded is 1.
      onProgress?.({ loaded: 1, total: 0, tournamentName, sets: [] });
      return [];
    }

    const streams = await this.getStreams(tournamentSlug);
    const sets: PlatformSet[] = [];
    let loaded = 0;

    // Brackets are independent, so fetch them concurrently and report each as it
    // lands rather than making the sheet wait for the whole event.
    await Promise.all(
      brackets.map(async (bracketRef) => {
        const bracket = await this.getBracket(bracketRef.getId());
        const bracketSets = bracket
          ? bracketSetList(bracket, streams, tournamentName, opts.upcomingOnly)
          : [];

        sets.push(...bracketSets);
        loaded += 1;
        onProgress?.({
          loaded,
          total: brackets.length,
          tournamentName,
          sets: bracketSets,
        });
      }),
    );

    return sets;
  }
}

function eventBrackets(tournament: Tournament | undefined, eventSlug: string) {
  const event = tournament
    ?.getEventsList()
    .find((candidate) => candidate.getSlug() === eventSlug);

  return (
    event?.getPhasesList().flatMap((phase) => phase.getBracketsList()) ?? []
  );
}

/**
 * A Slot only carries a seed id, so players come from joining against the
 * bracket's seeds; round labels join on (number, winners side).
 */
function bracketSetList(
  bracket: Bracket,
  streams: Map<string, string>,
  tournamentName: string,
  upcomingOnly: boolean,
): PlatformSet[] {
  const seeds = new Map(
    bracket.getSeedsList().map((seed) => [seed.getId(), seed]),
  );
  const rounds = new Map(
    bracket
      .getRoundsList()
      .map((round) => [
        roundKey(round.getNumber(), round.getWinnersSide()),
        round,
      ]),
  );

  const sets: PlatformSet[] = [];
  for (const match of bracket.getMatchesList()) {
    const set = toPlatformSet(
      match,
      seeds,
      toRoundName(match, rounds, bracket.getType()),
      streams,
      tournamentName,
    );
    if (set && (!upcomingOnly || isUpcoming(set.state))) {
      sets.push(set);
    }
  }
  return sets;
}

export const ParryggPlatform: TournamentPlatform = {
  id: PLATFORM_ID,
  displayName: DISPLAY_NAME,
  apiKeyDocsUrl: API_KEY_DOCS_URL,
  // parry.gg does not surface a set id a user could paste, so the lookup is
  // hidden for now even though getSet below works.
  supportsSetLookup: false,

  parseEventUrl(url) {
    const match = url.replace(MANAGE_PATH, "/").match(EVENT_URL_PATTERN);
    if (!match) {
      return null;
    }

    const [, tournamentSlug, eventSlug] = match;
    return {
      platform: PLATFORM_ID,
      url,
      id: `${tournamentSlug}/${eventSlug}`,
    };
  },

  withApiKey(apiKey) {
    return new ParryggClient(apiKey);
  },
};
