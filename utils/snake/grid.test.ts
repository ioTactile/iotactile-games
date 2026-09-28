import { describe, test, expect } from 'vitest';
import { freeCells, isInsideGrid, isOccupied, positionsEqual } from './grid';

describe('positionsEqual', () => {
  test('compares coordinates', () => {
    expect(positionsEqual({ x: 1, y: 2 }, { x: 1, y: 2 })).toBe(true);
    expect(positionsEqual({ x: 1, y: 2 }, { x: 2, y: 1 })).toBe(false);
  });
});

describe('isInsideGrid', () => {
  test('rejects out of bounds', () => {
    expect(isInsideGrid({ x: 0, y: 0 }, 4)).toBe(true);
    expect(isInsideGrid({ x: -1, y: 0 }, 4)).toBe(false);
    expect(isInsideGrid({ x: 4, y: 0 }, 4)).toBe(false);
  });
});

describe('isOccupied / freeCells', () => {
  test('lists free cells excluding snake', () => {
    const snake = [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
    ];
    expect(isOccupied(snake, { x: 0, y: 0 })).toBe(true);
    expect(freeCells(snake, 2)).toEqual([
      { x: 0, y: 1 },
      { x: 1, y: 1 },
    ]);
  });
});
