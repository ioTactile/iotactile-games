import { describe, test, expect } from 'vitest';
import { spawnFood } from './food';
import { SequenceRandomSource } from './random';

describe('spawnFood', () => {
  test('places food on a free cell', () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];
    // 2x2 grid → free: (0,1), (1,1). floor(0 * 2)=0 → (0,1)
    const food = spawnFood(snake, 2, new SequenceRandomSource([0]));
    expect(food).toEqual({ x: 0, y: 1 });
  });

  test('returns null when grid is full', () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ];
    expect(spawnFood(snake, 2, new SequenceRandomSource([0]))).toBeNull();
  });
});
