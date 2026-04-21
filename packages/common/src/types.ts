export type PortColor = "Red" | "Blue" | "Green" | "Yellow";

export type PlayerInfo = {
  teamName: string;
  playerTag: string;
  pronouns: string;
  twitter: string;
};

export type GameInfo = {
  character: string;
  altCostume: string;
  port: PortColor;
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

export type SlippiGameEndData = {
  isTeams: boolean;
  winner: number;
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

export type Placement =
  | "Friendlies"
  | "Exhibition Match"
  | "Money Match"
  | "Losers Round"
  | "Winners Round"
  | "Winners Quarter-Final"
  | "Winners Semi-Final"
  | "Winners Final"
  | "Losers Quarter-Final"
  | "Losers Semi-Final"
  | "Losers Final"
  | "Grand Final"
  | "Grand Finals Reset"
  | "Custom Match";
