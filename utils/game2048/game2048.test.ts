import { describe, test, expect } from 'vitest';
import { Game2048 } from './game2048';
import { SequenceRandomSource } from './random';
import type { Board } from './types';

/** Enough 0s so spawns always land on first empty cells as 2s. */
const alwaysTwoAtStart = () => new SequenceRandomSource([0, 0.9]);

describe('Game2048', () => {
  test('start places two tiles and sets inProgress', () => {
    const game = new Game2048(alwaysTwoAtStart());
    game.start();

    expect(game.getGameStatus()).toBe('inProgress');
    const flat = game
      .getBoard()
      .flat()
      .filter((v) => v !== 0);
    expect(flat).toHaveLength(2);
    expect(game.getScore()).toBe(0);
  });

  test('move merges tiles and increases score', () => {
    const game = new Game2048(alwaysTwoAtStart());
    game.start();

    // Force a known board: two 2s on first row
    const forced = game as unknown as { board: Board };
    forced.board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    const result = game.move('left');
    expect(result?.moved).toBe(true);
    expect(game.getScore()).toBe(4);
    expect(game.getBoard()[0][0]).toBe(4);
  });

  test('move returns moved false without changing state when invalid', () => {
    const game = new Game2048(alwaysTwoAtStart());
    game.start();
    const forced = game as unknown as { board: Board; score: number };
    forced.board = [
      [2, 4, 8, 16],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    forced.score = 10;

    const result = game.move('left');
    expect(result?.moved).toBe(false);
    expect(game.getScore()).toBe(10);
  });

  test('reaches won when 2048 appears', () => {
    const game = new Game2048(alwaysTwoAtStart());
    game.start();
    const forced = game as unknown as { board: Board };
    forced.board = [
      [1024, 1024, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    game.move('left');
    expect(game.getGameStatus()).toBe('won');
    expect(game.getHasWonOnce()).toBe(true);
    expect(game.getBestTile()).toBeGreaterThanOrEqual(2048);
  });

  test('keepPlaying allows further moves after win', () => {
    const game = new Game2048(alwaysTwoAtStart());
    game.start();
    const forced = game as unknown as { board: Board };
    forced.board = [
      [1024, 1024, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    game.move('left');
    expect(game.move('right')).toBeNull();

    game.keepPlaying();
    expect(game.getGameStatus()).toBe('inProgress');
    expect(game.move('right')?.moved).toBeDefined();
  });

  test('sets lost when no moves remain', () => {
    const game = new Game2048(alwaysTwoAtStart());
    game.start();
    const forced = game as unknown as { board: Board };
    // Full board with one merge possible: merge bottom-right then spawn fills last cell...
    // Better: set a board where after move left on last mergeable pair, board is dead.
    // Simpler approach: set dead board and trigger via internal status after a fake move.
    // Put a mergeable pair, after merge+spawn board becomes dead.
    forced.board = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 64, 0],
    ];
    // Move right merges nothing useful - actually 64 and empty: slides 64 right.
    // Let's use a board with one empty and no merges possible after spawn.
    forced.board = [
      [2, 4, 8, 16],
      [4, 8, 16, 32],
      [8, 16, 32, 64],
      [16, 32, 0, 128],
    ];
    // Moving left: 0 slides under 32? row3: [16,32,0,128] left → [16,32,128,0] then spawn fills.
    // That still has moves. Need after spawn a dead board.

    // Inject: board that is already almost dead; move that doesn't help.
    // Use private access to set lost via canMove path:
    // Board with one empty at (3,2), moving down on col2 does nothing if col2 is all zeros except...
    // Easiest: after move, spawn places on last empty and no merges left.
    forced.board = [
      [2, 4, 8, 16],
      [32, 64, 128, 256],
      [512, 1024, 2, 4],
      [8, 16, 32, 0],
    ];
    // Move right on row3: [8,16,32,0] → [0,8,16,32], then spawn at (3,0) with 2 → dead?
    // Check merges: (3,0)=2 vs (2,0)=512 no; (3,1)=8 vs (2,1)=1024 no; etc.
    // Horizontal row3 after: [2,8,16,32] - all different. Vertical all different. Dead.
    game.move('right');
    expect(game.getGameStatus()).toBe('lost');
  });

  test('undo restores previous board and score', () => {
    const game = new Game2048(alwaysTwoAtStart());
    game.start();
    const forced = game as unknown as { board: Board };
    forced.board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    game.move('left');
    expect(game.getScore()).toBe(4);
    expect(game.getCanUndo()).toBe(true);

    game.undo();
    expect(game.getScore()).toBe(0);
    expect(game.getBoard()[0]).toEqual([2, 2, 0, 0]);
  });

  test('move returns null when waiting', () => {
    const game = new Game2048(alwaysTwoAtStart());
    expect(game.move('left')).toBeNull();
  });

  test('restart resets score and board', () => {
    const game = new Game2048(alwaysTwoAtStart());
    game.start();
    const forced = game as unknown as { board: Board };
    forced.board = [
      [2, 2, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    game.move('left');
    game.restart();

    expect(game.getScore()).toBe(0);
    expect(game.getGameStatus()).toBe('inProgress');
    expect(
      game
        .getBoard()
        .flat()
        .filter((v) => v !== 0),
    ).toHaveLength(2);
  });
});
