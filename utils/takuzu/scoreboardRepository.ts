import type { TakuzuScoreboard } from '~/types/models';
import type { BoardSize, Difficulty } from './types';
import { applyTakuzuVictory, createEmptyTakuzuScoreboard } from './scoreboard';

/** Port: persistence for takuzu scoreboards. */
export interface TakuzuScoreboardRepository {
  getUsername(userId: string): Promise<string>;
  findByUserId(userId: string): Promise<TakuzuScoreboard | null>;
  findAll(): Promise<TakuzuScoreboard[]>;
  save(scoreboard: TakuzuScoreboard): Promise<void>;
}

/** Application use-case: record a victory via the scoreboard port. */
export const recordTakuzuVictory = async (
  repository: TakuzuScoreboardRepository,
  userId: string,
  time: number,
  boardSize: BoardSize,
  difficulty: Difficulty,
): Promise<void> => {
  const existing = await repository.findByUserId(userId);
  const username = existing?.username ?? (await repository.getUsername(userId));
  const base = existing ?? createEmptyTakuzuScoreboard(userId, username);
  const updated = applyTakuzuVictory(base, boardSize, difficulty, time);
  await repository.save(updated);
};
