export type CardUser = {
  id: string;
  username: string;
};

export type Dice = {
  id: number;
  face: number;
  isOnBoard: boolean;
};

export type User = {
  id: string;
  email: string;
  username: string;
  role?: { admin: true };
  creationDate: Date;
  updateDate: Date;
};

export type DiceSession = {
  id: string;
  name: string;
  players: CardUser[];
  isFull: boolean;
  isStarted: boolean;
  isFinished: boolean;
  creationDate: Date;
};

export type DiceSessionPlayerTurn = {
  id: string;
  playerId: string;
};

export type DiceSessionRemainingTurns = {
  id: string;
  remainingTurns: number;
};

export type DiceSessionDices = {
  id: string;
  dices: Dice[];
};

export type DiceSessionPlayerTries = {
  id: string;
  tries: number;
};

export type DiceSessionChat = {
  id: string;
  messages?: {
    index: number;
    username: string;
    content: string;
  }[];
};

export type DiceScoreboard = {
  userId: string;
  username: string;
  games: number;
  maxScore: number;
  averageScore: number;
  totalScore: number;
  victories: number;
  dice: number;
};

export type DicePlayerSheet = {
  id: string;
  one: number | null;
  two: number | null;
  three: number | null;
  four: number | null;
  five: number | null;
  six: number | null;
  bonus: number;
  threeOfAKind: number | null;
  fourOfAKind: number | null;
  fullHouse: number | null;
  smallStraight: number | null;
  largeStraight: number | null;
  chance: number | null;
  dice: number | null;
  total: number;
};

export type DiceSessionScores = {
  id: string;
  playerOne: DicePlayerSheet;
  playerTwo?: DicePlayerSheet;
  playerThree?: DicePlayerSheet;
  playerFour?: DicePlayerSheet;
  creationDate?: Date;
};

export type Word = {
  id: number;
  word: string;
  difficulty: number;
};

export type LinguaVaultSession = {
  id: string;
  playerOne: {
    id: string;
    username: string;
    isFinder: boolean;
  };
  playerTwo?: {
    id: string;
    username: string;
    isFinder: boolean;
  };
  isFull: boolean;
  isStarted: boolean;
  isFinished: boolean;
  isRoundFinished: boolean;
  isPlayerOneContinue: boolean | null;
  isPlayerTwoContinue: boolean | null;
  creationDate: Date;
};

export type LinguaVaultSessionWords = {
  id: string;
  words: Word[];
  testedWords: string[] | null;
  clues: string[] | null;
};

export type LinguaVaultSessionRemainingTurns = {
  id: string;
  remainingTurns: number;
};

export type LinguaVaultSessionPlayerTurn = {
  id: string;
  playerId: string;
};

export type LinguaVaultWords = {
  id: string;
  words: Word[];
};

export type LinguaVaultScoreboard = {
  userId: string;
  username: string;
  rounds: number;
  roundsWon: number;
  scoreToGuess: number;
  scoreToPropose: number;
};

export type CustomVictory = {
  rows: number;
  cols: number;
  mines: number;
  victories: number;
  bestTime: number;
  victoryDate: Date;
};

export type MineSweeperVictory = {
  victories: number;
  bestTime: number;
  victoryDate: Date;
};

export type MineSweeperScoreboard = {
  userId: string;
  username: string;
  beginner: MineSweeperVictory;
  intermediate: MineSweeperVictory;
  expert: MineSweeperVictory;
  custom: CustomVictory[];
};

export type TakuzuVictory = {
  victories: number;
  bestTime: number;
  victoryDate: Date;
};

export type TakuzuScoreboard = {
  userId: string;
  username: string;
  sixBySix: {
    easy: TakuzuVictory;
    medium: TakuzuVictory;
    hard: TakuzuVictory;
    expert: TakuzuVictory;
  };
  eightByEight: {
    easy: TakuzuVictory;
    medium: TakuzuVictory;
    hard: TakuzuVictory;
    expert: TakuzuVictory;
  };
  tenByTen: {
    easy: TakuzuVictory;
    medium: TakuzuVictory;
    hard: TakuzuVictory;
    expert: TakuzuVictory;
  };
  twelveByTwelve: {
    easy: TakuzuVictory;
    medium: TakuzuVictory;
    hard: TakuzuVictory;
    expert: TakuzuVictory;
  };
};
