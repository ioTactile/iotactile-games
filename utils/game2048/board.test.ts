import { describe, test, expect } from 'vitest';
import { cloneBoard, createEmptyBoard, emptyCells, hasTile, maxTile } from './board';

describe('createEmptyBoard', () => {
  test('creates a 4x4 board of zeros by default', () => {
    const board = createEmptyBoard();
    expect(board).toHaveLength(4);
    expect(board.every((row) => row.length === 4 && row.every((c) => c === 0))).toBe(true);
  });

  test('creates a board of given size', () => {
    expect(createEmptyBoard(3)).toHaveLength(3);
  });
});

describe('cloneBoard', () => {
  test('returns a deep copy', () => {
    const board = createEmptyBoard();
    board[0][0] = 2;
    const cloned = cloneBoard(board);
    cloned[0][0] = 4;
    expect(board[0][0]).toBe(2);
  });
});

describe('emptyCells', () => {
  test('lists all empty positions', () => {
    const board = createEmptyBoard();
    board[1][2] = 2;
    const cells = emptyCells(board);
    expect(cells).toHaveLength(15);
    expect(cells.find((c) => c.row === 1 && c.col === 2)).toBeUndefined();
  });
});

describe('hasTile', () => {
  test('detects presence of a value', () => {
    const board = createEmptyBoard();
    board[0][0] = 2048;
    expect(hasTile(board, 2048)).toBe(true);
    expect(hasTile(board, 1024)).toBe(false);
  });
});

describe('maxTile', () => {
  test('returns the highest tile', () => {
    const board = createEmptyBoard();
    board[0][0] = 8;
    board[2][3] = 64;
    expect(maxTile(board)).toBe(64);
  });
});
