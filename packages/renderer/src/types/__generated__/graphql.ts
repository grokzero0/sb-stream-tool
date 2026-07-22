/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** Represents the source of a stream */
export type StreamSource =
  /** Stream is on smashcast.tv channel */
  | 'HITBOX'
  /** Stream is on a mixer.com channel */
  | 'MIXER'
  /** Stream is on a stream.me channel */
  | 'STREAMME'
  /** Stream is on twitch.tv channel */
  | 'TWITCH'
  /** Stream is on a youtube.com channel */
  | 'YOUTUBE';

export type SetEntrantsQueryVariables = Exact<{
  setId: string | number;
}>;


export type SetEntrantsQuery = { set: { __typename: 'Set', id: string | null, fullRoundText: string | null, event: { __typename: 'Event', name: string | null, tournament: { __typename: 'Tournament', name: string | null } | null, videogame: { __typename: 'Videogame', id: string | null, displayName: string | null } | null } | null, slots: Array<{ __typename: 'SetSlot', id: string | null, entrant: { __typename: 'Entrant', id: string | null, name: string | null, participants: Array<{ __typename: 'Participant', id: string | null, prefix: string | null, gamerTag: string | null, connectedAccounts: unknown, user: { __typename: 'User', genderPronoun: string | null, authorizations: Array<{ __typename: 'ProfileAuthorization', externalUsername: string | null } | null> | null } | null } | null> | null } | null } | null> | null } | null };

export type EntrantsByVideogameInTournamentQueryVariables = Exact<{
  tourneySlug?: string | null | undefined;
  videogameId?: Array<string | number | null | undefined> | string | number | null | undefined;
}>;


export type EntrantsByVideogameInTournamentQuery = { tournament: { __typename: 'Tournament', id: string | null, name: string | null, events: Array<{ __typename: 'Event', id: string | null, name: string | null, entrants: { __typename: 'EntrantConnection', nodes: Array<{ __typename: 'Entrant', id: string | null, participants: Array<{ __typename: 'Participant', id: string | null, prefix: string | null, gamerTag: string | null, user: { __typename: 'User', genderPronoun: string | null, authorizations: Array<{ __typename: 'ProfileAuthorization', externalUsername: string | null } | null> | null } | null } | null> | null } | null> | null } | null } | null> | null } | null };

export type LiveEventSetsQueryVariables = Exact<{
  eventSlug: string;
  page: number;
  perPage: number;
}>;


export type LiveEventSetsQuery = { event: { __typename: 'Event', id: string | null, name: string | null, tournament: { __typename: 'Tournament', name: string | null } | null, sets: { __typename: 'SetConnection', pageInfo: { __typename: 'PageInfo', total: number | null, totalPages: number | null } | null, nodes: Array<{ __typename: 'Set', fullRoundText: string | null, state: number | null, stream: { __typename: 'Streams', streamSource: StreamSource | null, streamName: string | null } | null, slots: Array<{ __typename: 'SetSlot', id: string | null, entrant: { __typename: 'Entrant', id: string | null, name: string | null, participants: Array<{ __typename: 'Participant', id: string | null, prefix: string | null, gamerTag: string | null, connectedAccounts: unknown, user: { __typename: 'User', genderPronoun: string | null, authorizations: Array<{ __typename: 'ProfileAuthorization', externalUsername: string | null } | null> | null } | null } | null> | null } | null } | null> | null } | null> | null } | null } | null };

export type EventSetsQueryVariables = Exact<{
  eventSlug: string;
  page: number;
  perPage: number;
}>;


export type EventSetsQuery = { event: { __typename: 'Event', id: string | null, name: string | null, tournament: { __typename: 'Tournament', name: string | null } | null, sets: { __typename: 'SetConnection', pageInfo: { __typename: 'PageInfo', total: number | null, totalPages: number | null } | null, nodes: Array<{ __typename: 'Set', fullRoundText: string | null, state: number | null, stream: { __typename: 'Streams', streamSource: StreamSource | null, streamName: string | null } | null, slots: Array<{ __typename: 'SetSlot', id: string | null, entrant: { __typename: 'Entrant', id: string | null, name: string | null, participants: Array<{ __typename: 'Participant', id: string | null, prefix: string | null, gamerTag: string | null, connectedAccounts: unknown, user: { __typename: 'User', genderPronoun: string | null, authorizations: Array<{ __typename: 'ProfileAuthorization', externalUsername: string | null } | null> | null } | null } | null> | null } | null } | null> | null } | null> | null } | null } | null };
