import type { SnakeScoreboard } from '~/types/models';
import { applySnakeResult, createEmptySnakeScoreboard } from './scoreboard';
import type { SnakeResultPayload } from './types';

/** Port: persistence for snake scoreboards. */
export interface SnakeScoreboardRepository {
  getUsername(userId: string): Promise<string>;
  findByUserId(userId: string): Promise<SnakeScoreboard | null>;
  findAll(): Promise<SnakeScoreboard[]>;
  save(scoreboard: SnakeScoreboard): Promise<void>;
}

/** Application use-case: record a finished snake game. */
export const recordSnakeResult = async (
  repository: SnakeScoreboardRepository,
  userId: string,
  result: SnakeResultPayload,
): Promise<void> => {
  const existing = await repository.findByUserId(userId);
  const username = existing?.username ?? (await repository.getUsername(userId));
  const base = existing ?? createEmptySnakeScoreboard(userId, username);
  const updated = applySnakeResult(base, result);
  await repository.save(updated);
};
