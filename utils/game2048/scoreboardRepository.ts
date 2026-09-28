import type { Game2048Scoreboard } from '~/types/models';
import { applyGame2048Result, createEmptyGame2048Scoreboard } from './scoreboard';
import type { Game2048ResultPayload } from './types';

/** Port: persistence for 2048 scoreboards. */
export interface Game2048ScoreboardRepository {
  getUsername(userId: string): Promise<string>;
  findByUserId(userId: string): Promise<Game2048Scoreboard | null>;
  findAll(): Promise<Game2048Scoreboard[]>;
  save(scoreboard: Game2048Scoreboard): Promise<void>;
}

/** Application use-case: record a game result via the scoreboard port. */
export const recordGame2048Result = async (
  repository: Game2048ScoreboardRepository,
  userId: string,
  result: Game2048ResultPayload,
): Promise<void> => {
  const existing = await repository.findByUserId(userId);
  const username = existing?.username ?? (await repository.getUsername(userId));
  const base = existing ?? createEmptyGame2048Scoreboard(userId, username);
  const updated = applyGame2048Result(base, result);
  await repository.save(updated);
};
