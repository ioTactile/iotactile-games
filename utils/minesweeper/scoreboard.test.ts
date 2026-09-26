import { describe, test, expect } from 'vitest';
import {
  applyCustomVictory,
  applyDifficultyVictory,
  applyMineSweeperVictory,
  createEmptyMineSweeperScoreboard,
} from './scoreboard';

describe('minesweeper scoreboard domain', () => {
  const now = new Date('2026-01-01T00:00:00.000Z');

  test('createEmptyMineSweeperScoreboard', () => {
    const scoreboard = createEmptyMineSweeperScoreboard('u1', 'Alice');
    expect(scoreboard.userId).toBe('u1');
    expect(scoreboard.username).toBe('Alice');
    expect(scoreboard.beginner.victories).toBe(0);
    expect(scoreboard.custom).toEqual([]);
  });

  test('applyDifficultyVictory improves best time and increments victories', () => {
    const base = createEmptyMineSweeperScoreboard('u1', 'Alice');
    base.beginner.bestTime = 120;

    const updated = applyDifficultyVictory(base, 90, 'beginner', now);
    expect(updated.beginner.victories).toBe(1);
    expect(updated.beginner.bestTime).toBe(90);
    expect(updated.beginner.victoryDate).toEqual(now);

    const slower = applyDifficultyVictory(updated, 100, 'beginner', now);
    expect(slower.beginner.victories).toBe(2);
    expect(slower.beginner.bestTime).toBe(90);
  });

  test('applyCustomVictory creates or updates custom entry', () => {
    const base = createEmptyMineSweeperScoreboard('u1', 'Alice');
    const created = applyCustomVictory(base, 50, 10, 10, 15, now);
    expect(created.custom).toHaveLength(1);
    expect(created.custom[0]).toMatchObject({
      rows: 10,
      cols: 10,
      mines: 15,
      victories: 1,
      bestTime: 50,
    });

    const updated = applyCustomVictory(created, 40, 10, 10, 15, now);
    expect(updated.custom).toHaveLength(1);
    expect(updated.custom[0].victories).toBe(2);
    expect(updated.custom[0].bestTime).toBe(40);
  });

  test('applyMineSweeperVictory routes custom vs difficulty', () => {
    const base = createEmptyMineSweeperScoreboard('u1', 'Alice');
    const custom = applyMineSweeperVictory(base, 30, 'custom', 8, 8, 10, now);
    expect(custom.custom).toHaveLength(1);

    const expert = applyMineSweeperVictory(base, 200, 'expert', 16, 30, 99, now);
    expect(expert.expert.victories).toBe(1);
    expect(expert.expert.bestTime).toBe(200);
  });
});
