import type { Game2048Scoreboard } from '~/types/models';
import type { Game2048ResultPayload } from './types';

export const createEmptyGame2048Scoreboard = (
  userId: string,
  username: string,
): Game2048Scoreboard => ({
  userId,
  username,
  gamesPlayed: 0,
  victories: 0,
  bestScore: 0,
  bestTile: 0,
  lastPlayedAt: new Date(0),
});

/**
 * Applies a finished-game result: updates bests, increments gamesPlayed,
 * and increments victories when the player reached 2048.
 */
export const applyGame2048Result = (
  scoreboard: Game2048Scoreboard,
  result: Game2048ResultPayload,
  now: Date = new Date(),
): Game2048Scoreboard => {
  const next: Game2048Scoreboard = {
    ...scoreboard,
    gamesPlayed: scoreboard.gamesPlayed + 1,
    lastPlayedAt: now,
  };

  if (result.won) {
    next.victories = scoreboard.victories + 1;
  }

  if (result.score > scoreboard.bestScore) {
    next.bestScore = result.score;
  }

  if (result.bestTile > scoreboard.bestTile) {
    next.bestTile = result.bestTile;
  }

  return next;
};
