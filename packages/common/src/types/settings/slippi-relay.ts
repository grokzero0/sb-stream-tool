export const ALL_SLIPPI_RELAY_STATUSES = [
  "disabled",
  "direct",
  "folder",
] as const;

export type SlippiRelayStatus = (typeof ALL_SLIPPI_RELAY_STATUSES)[number];

export type SlippiRelaySettings = {
  relayStatus: SlippiRelayStatus;
  directory: string;
  ip: string;
  port: string;
};

export type SlippiPlayer = {
  character: string;
  color: string;
  playerId: number;
  port: number;
  teamId: number;
};

export type SlippiGameData = {
  isTeams: boolean;
  players: SlippiPlayer[][];
};

export type SlippiGameEndData = {
  isTeams: boolean;
  winners: number[]; // all the winners' playerindexes
};
