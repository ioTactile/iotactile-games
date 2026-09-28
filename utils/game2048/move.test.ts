import { describe, test, expect } from 'vitest';
import type { Board } from './types';
import { canMove, moveBoard } from './move';

const board = (rows: number[][]): Board => rows.map((row) => [...row]);

describe('moveBoard', () => {
  test('slides left and merges equal tiles once', () => {
    const result = moveBoard(
      board([
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'left',
    );

    expect(result.moved).toBe(true);
    expect(result.board[0]).toEqual([4, 4, 0, 0]);
    expect(result.scoreGained).toBe(8);
  });

  test('does not chain-merge in one move', () => {
    const result = moveBoard(
      board([
        [2, 2, 4, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'left',
    );

    expect(result.board[0]).toEqual([4, 4, 0, 0]);
    expect(result.scoreGained).toBe(4);
  });

  test('slides right', () => {
    const result = moveBoard(
      board([
        [2, 0, 0, 2],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'right',
    );

    expect(result.board[0]).toEqual([0, 0, 0, 4]);
    expect(result.scoreGained).toBe(4);
  });

  test('slides up', () => {
    const result = moveBoard(
      board([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'up',
    );

    expect(result.board[0][0]).toBe(4);
    expect(result.board[1][0]).toBe(0);
    expect(result.scoreGained).toBe(4);
  });

  test('slides down', () => {
    const result = moveBoard(
      board([
        [2, 0, 0, 0],
        [2, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'down',
    );

    expect(result.board[3][0]).toBe(4);
    expect(result.board[0][0]).toBe(0);
  });

  test('returns moved false when nothing changes', () => {
    const result = moveBoard(
      board([
        [2, 4, 8, 16],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]),
      'left',
    );

    expect(result.moved).toBe(false);
    expect(result.scoreGained).toBe(0);
  });
});

describe('canMove', () => {
  test('returns true when a merge is possible on a full board', () => {
    expect(
      canMove(
        board([
          [2, 4, 8, 16],
          [4, 8, 16, 32],
          [8, 16, 32, 64],
          [16, 32, 64, 64],
        ]),
      ),
    ).toBe(true);
  });

  test('returns false when no moves remain', () => {
    expect(
      canMove(
        board([
          [2, 4, 8, 16],
          [4, 8, 16, 32],
          [8, 16, 32, 64],
          [16, 32, 64, 128],
        ]),
      ),
    ).toBe(false);
  });

  test('returns true when empty cells exist', () => {
    expect(
      canMove(
        board([
          [2, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
          [0, 0, 0, 0],
        ]),
      ),
    ).toBe(true);
  });
});
