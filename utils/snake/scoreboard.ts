import type { SnakeScoreboard } from '~/types/models';
import type { SnakeResultPayload } from './types';

export const createEmptySnakeScoreboard = (userId: string, username: string): SnakeScoreboard => ({
  userId,
  username,
  gamesPlayed: 0,
  bestScore: 0,
  bestLength: 0,
  lastPlayedAt: new Date(0),
});

export const applySnakeResult = (
  scoreboard: SnakeScoreboard,
  result: SnakeResultPayload,
  now: Date = new Date(),
): SnakeScoreboard => {
  const next: SnakeScoreboard = {
    ...scoreboard,
    gamesPlayed: scoreboard.gamesPlayed + 1,
    lastPlayedAt: now,
  };

  if (result.score > scoreboard.bestScore) {
    next.bestScore = result.score;
  }

  if (result.length > scoreboard.bestLength) {
    next.bestLength = result.length;
  }

  return next;
};
