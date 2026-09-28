import { describe, test, expect } from 'vitest';
import type { Game2048Scoreboard } from '~/types/models';
import { createEmptyGame2048Scoreboard } from './scoreboard';
import { recordGame2048Result, type Game2048ScoreboardRepository } from './scoreboardRepository';

const createFakeRepo = (
  initial: Game2048Scoreboard | null = null,
): Game2048ScoreboardRepository & { saved: Game2048Scoreboard[] } => {
  let current = initial;
  const saved: Game2048Scoreboard[] = [];

  return {
    saved,
    getUsername: async () => 'Anon',
    findByUserId: async () => current,
    findAll: async () => (current ? [current] : []),
    save: async (scoreboard) => {
      current = scoreboard;
      saved.push(scoreboard);
    },
  };
};

describe('recordGame2048Result', () => {
  test('creates scoreboard when missing', async () => {
    const repo = createFakeRepo(null);
    await recordGame2048Result(repo, 'u1', { score: 800, bestTile: 256, won: false });

    expect(repo.saved).toHaveLength(1);
    expect(repo.saved[0].username).toBe('Anon');
    expect(repo.saved[0].gamesPlayed).toBe(1);
    expect(repo.saved[0].bestScore).toBe(800);
  });

  test('updates existing scoreboard on victory', async () => {
    const existing = createEmptyGame2048Scoreboard('u1', 'Bob');
    existing.gamesPlayed = 1;
    existing.bestScore = 500;
    const repo = createFakeRepo(existing);

    await recordGame2048Result(repo, 'u1', { score: 2048, bestTile: 2048, won: true });

    expect(repo.saved[0].gamesPlayed).toBe(2);
    expect(repo.saved[0].victories).toBe(1);
    expect(repo.saved[0].bestScore).toBe(2048);
    expect(repo.saved[0].bestTile).toBe(2048);
  });
});
