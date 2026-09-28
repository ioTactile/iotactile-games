import { describe, test, expect } from 'vitest';
import { applySnakeResult, createEmptySnakeScoreboard } from './scoreboard';

describe('createEmptySnakeScoreboard', () => {
  test('creates zeroed scoreboard', () => {
    const sb = createEmptySnakeScoreboard('u1', 'Alice');
    expect(sb.gamesPlayed).toBe(0);
    expect(sb.bestScore).toBe(0);
    expect(sb.bestLength).toBe(0);
  });
});

describe('applySnakeResult', () => {
  test('increments gamesPlayed and updates bests', () => {
    const base = createEmptySnakeScoreboard('u1', 'Alice');
    const now = new Date('2026-01-15T12:00:00Z');
    const next = applySnakeResult(base, { score: 120, length: 15 }, now);

    expect(next.gamesPlayed).toBe(1);
    expect(next.bestScore).toBe(120);
    expect(next.bestLength).toBe(15);
    expect(next.lastPlayedAt).toEqual(now);
  });

  test('does not lower bests', () => {
    const base = createEmptySnakeScoreboard('u1', 'Alice');
    base.bestScore = 500;
    base.bestLength = 40;

    const next = applySnakeResult(base, { score: 50, length: 10 });

    expect(next.bestScore).toBe(500);
    expect(next.bestLength).toBe(40);
    expect(next.gamesPlayed).toBe(1);
  });
});
