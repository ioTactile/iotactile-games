import { BOARD_SIZE } from './constants';
import type { Board, TileValue } from './types';

export const createEmptyBoard = (size: number = BOARD_SIZE): Board =>
  Array.from({ length: size }, () => Array.from({ length: size }, () => 0 as TileValue));

export const cloneBoard = (board: Board): Board => board.map((row) => [...row]);

export type CellPosition = { row: number; col: number };

export const emptyCells = (board: Board): CellPosition[] => {
  const cells: CellPosition[] = [];
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) {
        cells.push({ row, col });
      }
    }
  }
  return cells;
};

export const hasTile = (board: Board, value: number): boolean =>
  board.some((row) => row.some((cell) => cell === value));

export const maxTile = (board: Board): number =>
  board.reduce((max, row) => Math.max(max, ...row), 0);
