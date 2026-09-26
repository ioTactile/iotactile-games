import { describe, test, expect } from 'vitest';
import type { TakuzuScoreboard } from '~/types/models';
import { recordTakuzuVictory, type TakuzuScoreboardRepository } from './scoreboardRepository';
import { createEmptyTakuzuScoreboard } from './scoreboard';

const createFakeRepo = (
  initial: TakuzuScoreboard | null = null,
): TakuzuScoreboardRepository & { saved: TakuzuScoreboard[] } => {
  let current = initial;
  const saved: TakuzuScoreboard[] = [];

  return {
    saved,
    getUsername: async () => 'Anon',
    findByUserId: async () => current,
    save: async (scoreboard) => {
      current = scoreboard;
      saved.push(scoreboard);
    },
  };
};

describe('recordTakuzuVictory', () => {
  test('creates scoreboard when missing', async () => {
    const repo = createFakeRepo(null);
    await recordTakuzuVictory(repo, 'u1', 120, 8, 'hard');

    expect(repo.saved).toHaveLength(1);
    expect(repo.saved[0].eightByEight.hard.victories).toBe(1);
    expect(repo.saved[0].eightByEight.hard.bestTime).toBe(120);
  });

  test('updates existing difficulty entry', async () => {
    const existing = createEmptyTakuzuScoreboard('u1', 'Bob');
    existing.sixBySix.easy.victories = 1;
    existing.sixBySix.easy.bestTime = 200;
    const repo = createFakeRepo(existing);

    await recordTakuzuVictory(repo, 'u1', 150, 6, 'easy');

    expect(repo.saved[0].sixBySix.easy.victories).toBe(2);
    expect(repo.saved[0].sixBySix.easy.bestTime).toBe(150);
  });
});
