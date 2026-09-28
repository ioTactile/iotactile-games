import { describe, test, expect } from 'vitest';
import { applyGame2048Result, createEmptyGame2048Scoreboard } from './scoreboard';

describe('createEmptyGame2048Scoreboard', () => {
  test('creates zeroed scoreboard', () => {
    const sb = createEmptyGame2048Scoreboard('u1', 'Alice');
    expect(sb.userId).toBe('u1');
    expect(sb.username).toBe('Alice');
    expect(sb.gamesPlayed).toBe(0);
    expect(sb.victories).toBe(0);
    expect(sb.bestScore).toBe(0);
    expect(sb.bestTile).toBe(0);
  });
});

describe('applyGame2048Result', () => {
  test('increments gamesPlayed and updates bests on loss', () => {
    const base = createEmptyGame2048Scoreboard('u1', 'Alice');
    const now = new Date('2026-01-15T12:00:00Z');
    const next = applyGame2048Result(base, { score: 1200, bestTile: 512, won: false }, now);

    expect(next.gamesPlayed).toBe(1);
    expect(next.victories).toBe(0);
    expect(next.bestScore).toBe(1200);
    expect(next.bestTile).toBe(512);
    expect(next.lastPlayedAt).toEqual(now);
  });

  test('increments victories on win', () => {
    const base = createEmptyGame2048Scoreboard('u1', 'Alice');
    base.gamesPlayed = 2;
    base.bestScore = 500;
    base.bestTile = 256;

    const next = applyGame2048Result(base, { score: 400, bestTile: 2048, won: true });

    expect(next.gamesPlayed).toBe(3);
    expect(next.victories).toBe(1);
    expect(next.bestScore).toBe(500);
    expect(next.bestTile).toBe(2048);
  });

  test('does not lower best score or tile', () => {
    const base = createEmptyGame2048Scoreboard('u1', 'Alice');
    base.bestScore = 9000;
    base.bestTile = 4096;

    const next = applyGame2048Result(base, { score: 100, bestTile: 64, won: false });

    expect(next.bestScore).toBe(9000);
    expect(next.bestTile).toBe(4096);
  });
});
