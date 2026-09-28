import { describe, test, expect } from 'vitest';
import { hitsSelf, nextHead, oppositeDirection } from './movement';

describe('oppositeDirection', () => {
  test('returns opposites', () => {
    expect(oppositeDirection('up')).toBe('down');
    expect(oppositeDirection('down')).toBe('up');
    expect(oppositeDirection('left')).toBe('right');
    expect(oppositeDirection('right')).toBe('left');
  });
});

describe('nextHead', () => {
  test('moves one step', () => {
    expect(nextHead({ x: 2, y: 2 }, 'up')).toEqual({ x: 2, y: 1 });
    expect(nextHead({ x: 2, y: 2 }, 'down')).toEqual({ x: 2, y: 3 });
    expect(nextHead({ x: 2, y: 2 }, 'left')).toEqual({ x: 1, y: 2 });
    expect(nextHead({ x: 2, y: 2 }, 'right')).toEqual({ x: 3, y: 2 });
  });
});

describe('hitsSelf', () => {
  test('ignores tail tip when not growing', () => {
    const snake = [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ];
    // Moving into where the tip is — tip will leave, so not a hit
    expect(hitsSelf(snake, { x: 0, y: 0 }, false)).toBe(false);
  });

  test('detects body collision', () => {
    const snake = [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 1, y: 1 },
    ];
    expect(hitsSelf(snake, { x: 1, y: 0 }, false)).toBe(true);
  });

  test('includes full body when growing', () => {
    const snake = [
      { x: 2, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: 0 },
    ];
    expect(hitsSelf(snake, { x: 0, y: 0 }, true)).toBe(true);
  });
});
