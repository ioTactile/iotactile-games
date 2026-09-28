import { freeCells } from './grid';
import type { IRandomSource } from './random';
import type { Position } from './types';

/**
 * Spawns food on a random free cell.
 * Returns null if the grid is full (snake filled the board).
 */
export const spawnFood = (
  snake: Position[],
  gridSize: number,
  random: IRandomSource,
): Position | null => {
  const cells = freeCells(snake, gridSize);
  if (cells.length === 0) return null;

  const index = Math.floor(random.next() * cells.length);
  return { ...cells[index] };
};
