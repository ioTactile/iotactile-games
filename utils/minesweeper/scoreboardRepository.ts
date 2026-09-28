import type { MineSweeperScoreboard } from '~/types/models';
import type { Difficulty } from './types';
import { applyMineSweeperVictory, createEmptyMineSweeperScoreboard } from './scoreboard';

/** Port: persistence for minesweeper scoreboards. */
export interface MineSweeperScoreboardRepository {
  getUsername(userId: string): Promise<string>;
  findByUserId(userId: string): Promise<MineSweeperScoreboard | null>;
  findAll(): Promise<MineSweeperScoreboard[]>;
  save(scoreboard: MineSweeperScoreboard): Promise<void>;
}

/** Application use-case: record a victory via the scoreboard port. */
export const recordMineSweeperVictory = async (
  repository: MineSweeperScoreboardRepository,
  userId: string,
  time: number,
  difficulty: Difficulty,
  numRows: number,
  numCols: number,
  numMines: number,
): Promise<void> => {
  const existing = await repository.findByUserId(userId);
  const username = existing?.username ?? (await repository.getUsername(userId));
  const base = existing ?? createEmptyMineSweeperScoreboard(userId, username);
  const updated = applyMineSweeperVictory(base, time, difficulty, numRows, numCols, numMines);
  await repository.save(updated);
};
