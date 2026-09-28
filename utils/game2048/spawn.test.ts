import { describe, test, expect } from 'vitest';
import { createEmptyBoard } from './board';
import { SequenceRandomSource } from './random';
import { spawnTile } from './spawn';

describe('spawnTile', () => {
  test('spawns a 2 when second random is above threshold', () => {
    // cellIndex = floor(0 * 16) = 0 → (0,0); value = 0.5 >= 0.1 → 2
    const random = new SequenceRandomSource([0, 0.5]);
    const result = spawnTile(createEmptyBoard(), random);

    expect(result.spawned).toBe(true);
    expect(result.value).toBe(2);
    expect(result.row).toBe(0);
    expect(result.col).toBe(0);
    expect(result.board[0][0]).toBe(2);
  });

  test('spawns a 4 when second random is below threshold', () => {
    const random = new SequenceRandomSource([0, 0.05]);
    const result = spawnTile(createEmptyBoard(), random);

    expect(result.value).toBe(4);
    expect(result.board[0][0]).toBe(4);
  });

  test('returns spawned false on a full board', () => {
    const board = createEmptyBoard();
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        board[r][c] = 2;
      }
    }
    const result = spawnTile(board, new SequenceRandomSource([0]));

    expect(result.spawned).toBe(false);
  });

  test('picks a later empty cell from random index', () => {
    // 16 empty cells; floor(0.5 * 16) = 8 → row 2, col 0
    const random = new SequenceRandomSource([0.5, 0.9]);
    const result = spawnTile(createEmptyBoard(), random);

    expect(result.row).toBe(2);
    expect(result.col).toBe(0);
  });
});
