import type { Difficulty } from "./types";
import type {
  CustomVictory,
  MineSweeperScoreboard,
  MineSweeperVictory,
} from "~/types/models";

type OmittedDifficulty = Exclude<Difficulty, "custom">;

export const createDefaultMineSweeperVictory = (): MineSweeperVictory => ({
  victories: 0,
  bestTime: 0,
  victoryDate: new Date(),
});

export const createEmptyMineSweeperScoreboard = (
  userId: string,
  username: string,
): MineSweeperScoreboard => ({
  userId,
  username,
  beginner: createDefaultMineSweeperVictory(),
  intermediate: createDefaultMineSweeperVictory(),
  expert: createDefaultMineSweeperVictory(),
  custom: [],
});

export const applyCustomVictory = (
  scoreboard: MineSweeperScoreboard,
  time: number,
  numRows: number,
  numCols: number,
  numMines: number,
  now: Date = new Date(),
): MineSweeperScoreboard => {
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
  scoreboard: MineSweeperScoreboard,
  time: number,
  difficulty: OmittedDifficulty,
  now: Date = new Date(),
): MineSweeperScoreboard => {
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
  scoreboard: MineSweeperScoreboard,
  time: number,
  difficulty: Difficulty,
  numRows: number,
  numCols: number,
  numMines: number,
  now: Date = new Date(),
): MineSweeperScoreboard => {
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
