import type { DiceScoreboard } from '~/types/models';

/** Port: persistence for dice scoreboards. */
export interface DiceScoreboardRepository {
  findByUserId(userId: string): Promise<DiceScoreboard | null>;
  findAllOrderedByVictories(): Promise<DiceScoreboard[]>;
}

export const createEmptyDiceScoreboard = (userId: string, username: string): DiceScoreboard => ({
  userId,
  username,
  games: 0,
  maxScore: 0,
  averageScore: 0,
  totalScore: 0,
  victories: 0,
  dice: 0,
});
