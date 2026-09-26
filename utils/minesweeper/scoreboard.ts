import type { Difficulty } from "./types";
import type { CustomVictory } from "~/types/models";
import type { LocalMineSweeperScoreboardType } from "~/infrastructure/firestore/converters";

type OmittedDifficulty = Exclude<Difficulty, "custom">;

export type MineSweeperVictory = {
  victories: number;
  bestTime: number;
  victoryDate: Date;
};

export const createDefaultMineSweeperVictory = (): MineSweeperVictory => ({
  victories: 0,
  bestTime: 0,
  victoryDate: new Date(),
});

export const createEmptyMineSweeperScoreboard = (
  userId: string,
  username: string,
): LocalMineSweeperScoreboardType => ({
  userId,
  username,
  beginner: createDefaultMineSweeperVictory(),
  intermediate: createDefaultMineSweeperVictory(),
  expert: createDefaultMineSweeperVictory(),
  custom: [],
});

export const applyCustomVictory = (
  scoreboard: LocalMineSweeperScoreboardType,
  time: number,
  numRows: number,
  numCols: number,
  numMines: number,
  now: Date = new Date(),
): LocalMineSweeperScoreboardType => {
  const custom = [...scoreboard.custom];
  const customVictoryIndex = custom.findIndex(
    (customVictory: Pick<CustomVictory, "rows" | "cols" | "mines">) =>
      customVictory.rows === numRows &&
      customVictory.cols === numCols &&
      customVictory.mines === numMines,
  );

  if (customVictoryIndex !== -1) {
    const customVictory = custom[customVictoryIndex];
    const bestTime =
      customVictory.bestTime > time ? time : customVictory.bestTime;

    custom[customVictoryIndex] = {
      ...customVictory,
      victories: customVictory.victories + 1,
      bestTime,
      victoryDate: now,
    };
  } else {
    custom.push({
      rows: numRows,
      cols: numCols,
      mines: numMines,
      victories: 1,
      bestTime: time,
      victoryDate: now,
    });
  }

  return { ...scoreboard, custom };
};

export const applyDifficultyVictory = (
  scoreboard: LocalMineSweeperScoreboardType,
  time: number,
  difficulty: OmittedDifficulty,
  now: Date = new Date(),
): LocalMineSweeperScoreboardType => {
  const current = scoreboard[difficulty];
  const bestTime = current.bestTime > time ? time : current.bestTime || time;

  return {
    ...scoreboard,
    [difficulty]: {
      victories: current.victories + 1 || 1,
      bestTime,
      victoryDate: now,
    },
  };
};

export const applyMineSweeperVictory = (
  scoreboard: LocalMineSweeperScoreboardType,
  time: number,
  difficulty: Difficulty,
  numRows: number,
  numCols: number,
  numMines: number,
  now: Date = new Date(),
): LocalMineSweeperScoreboardType => {
  if (difficulty === "custom") {
    return applyCustomVictory(
      scoreboard,
      time,
      numRows,
      numCols,
      numMines,
      now,
    );
  }

  return applyDifficultyVictory(scoreboard, time, difficulty, now);
};
