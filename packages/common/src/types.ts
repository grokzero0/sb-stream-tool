export type PlayerInfo = {
  teamName: string;
  playerTag: string;
  pronouns: string;
  twitter: string;
};

export type GameInfo = {
  character: string;
  altCostume: string;
  port: "Red" | "Blue" | "Green" | "Yellow";
};

export type SlippiPlayer = {
  character: string;
  color: string;
  playerId: number;
  port: number;
};

export type SlippiGameData = {
  isTeams: boolean;
  players: SlippiPlayer[][];
};

export type Player = {
  playerInfo: PlayerInfo;
  gameInfo: GameInfo;
};

export type Team = {
  name: string;
  score: number;
  inLosers: boolean;
  players: Player[];
};

export type Commentator = {
  name: string;
  twitter: string;
  pronouns: string;
};

export type Tournament = {
  name: string;
  bestOf: number;
  roundFormat: string;
  customRoundFormat: string;
  roundNumber?: number;
  setFormat: string;
  teams: Team[];
  commentators: Commentator[];
};

export type MeleeCharacter =
  | "Bowser"
  | "Captain Falcon"
  | "Donkey Kong"
  | "Dr. Mario"
  | "Falco"
  | "Fox"
  | "Ganondorf"
  | "Ice Climbers"
  | "Jigglypuff"
  | "Kirby"
  | "Link"
  | "Luigi"
  | "Mario"
  | "Marth"
  | "Mewtwo"
  | "Mr. Game & Watch"
  | "Ness"
  | "Peach"
  | "Pichu"
  | "Pikachu"
  | "Roy"
  | "Samus"
  | "Sheik"
  | "Yoshi"
  | "Young Link"
  | "Zelda"
  | "Random";

export type AltCostumeEntry = {
  characterName: MeleeCharacter;
  numberOfCostumes: number;
  colors: string[];
};
