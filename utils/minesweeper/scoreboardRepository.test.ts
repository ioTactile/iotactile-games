import { describe, test, expect } from 'vitest';
import type { MineSweeperScoreboard } from '~/types/models';
import {
  recordMineSweeperVictory,
  type MineSweeperScoreboardRepository,
} from './scoreboardRepository';
import { createEmptyMineSweeperScoreboard } from './scoreboard';

const createFakeRepo = (
  initial: MineSweeperScoreboard | null = null,
): MineSweeperScoreboardRepository & {
  saved: MineSweeperScoreboard[];
} => {
  let current = initial;
  const saved: MineSweeperScoreboard[] = [];

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

describe('recordMineSweeperVictory', () => {
  test('creates scoreboard when missing then records victory', async () => {
    const repo = createFakeRepo(null);
    await recordMineSweeperVictory(repo, 'u1', 42, 'beginner', 9, 9, 10);

    expect(repo.saved).toHaveLength(1);
    expect(repo.saved[0].username).toBe('Anon');
    expect(repo.saved[0].beginner.victories).toBe(1);
    expect(repo.saved[0].beginner.bestTime).toBe(42);
  });

  test('updates existing scoreboard', async () => {
    const existing = createEmptyMineSweeperScoreboard('u1', 'Alice');
    existing.beginner.bestTime = 80;
    existing.beginner.victories = 2;
    const repo = createFakeRepo(existing);

    await recordMineSweeperVictory(repo, 'u1', 50, 'beginner', 9, 9, 10);

    expect(repo.saved[0].beginner.victories).toBe(3);
    expect(repo.saved[0].beginner.bestTime).toBe(50);
    expect(repo.saved[0].username).toBe('Alice');
  });
});
