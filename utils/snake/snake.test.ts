import { describe, test, expect } from 'vitest';
import { FOOD_SCORE } from './constants';
import { SequenceRandomSource } from './random';
import { Snake } from './snake';
import type { Position } from './types';

/** Always pick first free cell for food. */
const firstCellRng = () => new SequenceRandomSource([0]);

describe('Snake', () => {
  test('start places snake and food', () => {
    const game = new Snake(firstCellRng(), 10);
    game.start();

    expect(game.getGameStatus()).toBe('inProgress');
    expect(game.getSnake()).toHaveLength(3);
    expect(game.getFood()).not.toBeNull();
    expect(game.getScore()).toBe(0);
    expect(game.getDirection()).toBe('right');
  });

  test('tick moves snake forward', () => {
    const game = new Snake(firstCellRng(), 10);
    game.start();
    const before = game.getSnake()[0];

    game.tick();

    expect(game.getSnake()[0]).toEqual({ x: before.x + 1, y: before.y });
    expect(game.getSnake()).toHaveLength(3);
  });

  test('setDirection queues turn and ignores reverse', () => {
    const game = new Snake(firstCellRng(), 10);
    game.start();
    game.setDirection('left'); // reverse of right — ignored
    game.tick();
    expect(game.getDirection()).toBe('right');

    game.setDirection('up');
    game.tick();
    expect(game.getDirection()).toBe('up');
  });

  test('eating food grows snake and increases score', () => {
    const game = new Snake(firstCellRng(), 10);
    game.start();

    // Force food one step ahead of head
    const forced = game as unknown as { food: Position; snake: Position[] };
    const head = forced.snake[0];
    forced.food = { x: head.x + 1, y: head.y };

    const result = game.tick();
    expect(result?.ateFood).toBe(true);
    expect(game.getScore()).toBe(FOOD_SCORE);
    expect(game.getSnake()).toHaveLength(4);
  });

  test('wall collision grants a grace window before losing', () => {
    const game = new Snake(firstCellRng(), 5);
    game.start();
    const forced = game as unknown as {
      snake: Position[];
      direction: string;
      pendingDirection: string | null;
    };
    forced.snake = [
      { x: 4, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
    ];
    forced.direction = 'right';
    forced.pendingDirection = null;

    // First contact starts grace — still alive, snake does not move
    expect(game.tick()?.lost).toBe(false);
    expect(game.getGameStatus()).toBe('inProgress');
    expect(game.getSnake()[0]).toEqual({ x: 4, y: 2 });

    // Next tick without turning → lost
    expect(game.tick()?.lost).toBe(true);
    expect(game.getGameStatus()).toBe('lost');
  });

  test('can turn away from the wall during grace', () => {
    const game = new Snake(firstCellRng(), 5);
    game.start();
    const forced = game as unknown as {
      snake: Position[];
      direction: string;
      pendingDirection: string | null;
      food: Position;
    };
    forced.snake = [
      { x: 4, y: 2 },
      { x: 3, y: 2 },
      { x: 2, y: 2 },
    ];
    forced.direction = 'right';
    forced.pendingDirection = null;
    forced.food = { x: 0, y: 0 };

    expect(game.tick()?.lost).toBe(false); // start grace

    game.setDirection('up');
    const result = game.tick();

    expect(result?.lost).toBe(false);
    expect(game.getGameStatus()).toBe('inProgress');
    expect(game.getSnake()[0]).toEqual({ x: 4, y: 1 });
  });

  test('hitting self sets lost', () => {
    const game = new Snake(firstCellRng(), 10);
    game.start();
    const forced = game as unknown as {
      snake: Position[];
      direction: string;
      pendingDirection: string | null;
      food: Position;
    };
    // U-shape: head will turn into body
    forced.snake = [
      { x: 2, y: 1 },
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
      { x: 1, y: 2 },
    ];
    forced.direction = 'left';
    forced.pendingDirection = null;
    forced.food = { x: 9, y: 9 };

    const result = game.tick();
    expect(result?.lost).toBe(true);
    expect(game.getGameStatus()).toBe('lost');
  });

  test('pause and resume', () => {
    const game = new Snake(firstCellRng(), 10);
    game.start();
    game.pause();
    expect(game.getGameStatus()).toBe('paused');
    expect(game.tick()).toBeNull();

    game.resume();
    expect(game.getGameStatus()).toBe('inProgress');
    expect(game.tick()).not.toBeNull();
  });

  test('tick returns null when waiting', () => {
    const game = new Snake(firstCellRng(), 10);
    expect(game.tick()).toBeNull();
  });

  test('restart resets score and status', () => {
    const game = new Snake(firstCellRng(), 10);
    game.start();
    const forced = game as unknown as { score: number };
    forced.score = 50;
    game.restart();

    expect(game.getScore()).toBe(0);
    expect(game.getGameStatus()).toBe('inProgress');
    expect(game.getSnake()).toHaveLength(3);
  });
});
