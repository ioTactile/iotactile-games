import { cloneBoard, emptyCells } from './board';
import { SPAWN_FOUR_PROBABILITY } from './constants';
import type { IRandomSource } from './random';
import type { Board, TileValue } from './types';

export type SpawnResult = {
  board: Board;
  spawned: boolean;
  value: TileValue;
  row: number;
  col: number;
};

/**
 * Spawns a 2 (90%) or 4 (10%) on a random empty cell.
 * Returns spawned: false if the board has no empty cells.
 */
export const spawnTile = (board: Board, random: IRandomSource): SpawnResult => {
  const cells = emptyCells(board);
  if (cells.length === 0) {
    return { board: cloneBoard(board), spawned: false, value: 0, row: -1, col: -1 };
  }

  const cellIndex = Math.floor(random.next() * cells.length);
  const { row, col } = cells[cellIndex];
  const value: TileValue = random.next() < SPAWN_FOUR_PROBABILITY ? 4 : 2;

  const next = cloneBoard(board);
  next[row][col] = value;

  return { board: next, spawned: true, value, row, col };
};
