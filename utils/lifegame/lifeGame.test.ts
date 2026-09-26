import { describe, test, expect } from 'vitest';
import { LifeGame } from './lifeGame';

describe('LifeGame', () => {
  test('initializes an empty board', () => {
    const game = new LifeGame(3, 3);
    expect(game.getNumRows()).toBe(3);
    expect(game.getNumCols()).toBe(3);
    expect(
      game
        .getBoard()
        .flat()
        .every((cell) => cell === false),
    ).toBe(true);
  });

  test('toggleCell flips a cell', () => {
    const game = new LifeGame(2, 2);
    game.toggleCell(0, 1);
    expect(game.getBoard()[0][1]).toBe(true);
    game.toggleCell(0, 1);
    expect(game.getBoard()[0][1]).toBe(false);
  });

  test('blinker oscillator evolves correctly', () => {
    const game = new LifeGame(5, 5);
    game.toggleCell(2, 1);
    game.toggleCell(2, 2);
    game.toggleCell(2, 3);

    game.update();
    expect(game.getBoard()[1][2]).toBe(true);
    expect(game.getBoard()[2][2]).toBe(true);
    expect(game.getBoard()[3][2]).toBe(true);
    expect(game.getBoard()[2][1]).toBe(false);
    expect(game.getBoard()[2][3]).toBe(false);

    game.update();
    expect(game.getBoard()[2][1]).toBe(true);
    expect(game.getBoard()[2][2]).toBe(true);
    expect(game.getBoard()[2][3]).toBe(true);
  });

  test('clearBoard resets all cells', () => {
    const game = new LifeGame(2, 2);
    game.toggleCell(0, 0);
    game.clearBoard();
    expect(
      game
        .getBoard()
        .flat()
        .every((cell) => cell === false),
    ).toBe(true);
  });

  test('loadPattern centers coordinates on the board', () => {
    const game = new LifeGame(5, 5);
    game.loadPattern([
      [0, 0],
      [0, 1],
    ]);
    const aliveCount = game.getBoard().flat().filter(Boolean).length;
    expect(aliveCount).toBe(2);
  });
});
