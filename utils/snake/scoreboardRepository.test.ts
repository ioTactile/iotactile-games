import { describe, test, expect } from 'vitest';
import type { SnakeScoreboard } from '~/types/models';
import { createEmptySnakeScoreboard } from './scoreboard';
import { recordSnakeResult, type SnakeScoreboardRepository } from './scoreboardRepository';

const createFakeRepo = (
  initial: SnakeScoreboard | null = null,
): SnakeScoreboardRepository & { saved: SnakeScoreboard[] } => {
  let current = initial;
  const saved: SnakeScoreboard[] = [];

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

describe('recordSnakeResult', () => {
  test('creates scoreboard when missing', async () => {
    const repo = createFakeRepo(null);
    await recordSnakeResult(repo, 'u1', { score: 80, length: 11 });

    expect(repo.saved).toHaveLength(1);
    expect(repo.saved[0].username).toBe('Anon');
    expect(repo.saved[0].bestScore).toBe(80);
    expect(repo.saved[0].bestLength).toBe(11);
  });

  test('updates existing scoreboard', async () => {
    const existing = createEmptySnakeScoreboard('u1', 'Bob');
    existing.gamesPlayed = 2;
    existing.bestScore = 50;
    const repo = createFakeRepo(existing);

    await recordSnakeResult(repo, 'u1', { score: 200, length: 25 });

    expect(repo.saved[0].gamesPlayed).toBe(3);
    expect(repo.saved[0].bestScore).toBe(200);
    expect(repo.saved[0].bestLength).toBe(25);
  });
});
