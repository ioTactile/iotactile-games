import type { BoardSize, Difficulty } from "./types";
import type { LocalTakuzuScoreboardType } from "~/infrastructure/firestore/converters";

export type TakuzuVictory = {
  victories: number;
  bestTime: number;
  victoryDate: Date;
};

export type TakuzuSizeKey = Exclude<
  keyof LocalTakuzuScoreboardType,
  "userId" | "username"
>;

export const createDefaultTakuzuVictory = (): TakuzuVictory => ({
  victories: 0,
  bestTime: 0,
  victoryDate: new Date(0),
});

const emptySizeBoard = () => ({
  easy: createDefaultTakuzuVictory(),
  medium: createDefaultTakuzuVictory(),
  hard: createDefaultTakuzuVictory(),
  expert: createDefaultTakuzuVictory(),
});

export const createEmptyTakuzuScoreboard = (
  userId: string,
  username: string,
): LocalTakuzuScoreboardType => ({
  userId,
  username,
  sixBySix: emptySizeBoard(),
  eightByEight: emptySizeBoard(),
  tenByTen: emptySizeBoard(),
  twelveByTwelve: emptySizeBoard(),
});

export const translateBoardSize = (boardSize: BoardSize): TakuzuSizeKey => {
  switch (boardSize) {
    case 6:
      return "sixBySix";
    case 8:
      return "eightByEight";
    case 10:
      return "tenByTen";
    case 12:
      return "twelveByTwelve";
    default:
      return "sixBySix";
  }
};

export const applyTakuzuVictory = (
  scoreboard: LocalTakuzuScoreboardType,
  boardSize: BoardSize,
  difficulty: Difficulty,
  time: number,
  now: Date = new Date(),
): LocalTakuzuScoreboardType => {
  const sizeKey = translateBoardSize(boardSize);
  const sizeBoard = {
    ...(scoreboard[sizeKey] as Record<Difficulty, TakuzuVictory>),
  };
  const boardDifficulty = { ...sizeBoard[difficulty] };

  boardDifficulty.victories += 1;
  if (boardDifficulty.bestTime === 0 || time < boardDifficulty.bestTime) {
    boardDifficulty.bestTime = time;
  }
  boardDifficulty.victoryDate = now;
  sizeBoard[difficulty] = boardDifficulty;

  return { ...scoreboard, [sizeKey]: sizeBoard };
};
