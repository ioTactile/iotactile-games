import { cloneBoard } from './board';
import type { Board, Direction, MoveResult, TileValue } from './types';

const slideAndMergeLine = (line: TileValue[]): { line: TileValue[]; scoreGained: number } => {
  const filtered = line.filter((v) => v !== 0);
  const merged: TileValue[] = [];
  let scoreGained = 0;
  let i = 0;

  while (i < filtered.length) {
    if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
      const value = (filtered[i] * 2) as TileValue;
      merged.push(value);
      scoreGained += value;
      i += 2;
    } else {
      merged.push(filtered[i]);
      i += 1;
    }
  }

  while (merged.length < line.length) {
    merged.push(0);
  }

  return { line: merged, scoreGained };
};

const getLine = (board: Board, index: number, direction: Direction): TileValue[] => {
  switch (direction) {
    case 'left':
      return [...board[index]];
    case 'right':
      return [...board[index]].reverse();
    case 'up':
      return board.map((row) => row[index]);
    case 'down':
      return board.map((row) => row[index]).reverse();
  }
};

const setLine = (board: Board, index: number, direction: Direction, line: TileValue[]): void => {
  const size = board.length;
  switch (direction) {
    case 'left':
      for (let col = 0; col < size; col++) {
        board[index][col] = line[col];
      }
      break;
    case 'right': {
      const reversed = [...line].reverse();
      for (let col = 0; col < size; col++) {
        board[index][col] = reversed[col];
      }
      break;
    }
    case 'up':
      for (let row = 0; row < size; row++) {
        board[row][index] = line[row];
      }
      break;
    case 'down': {
      const reversed = [...line].reverse();
      for (let row = 0; row < size; row++) {
        board[row][index] = reversed[row];
      }
      break;
    }
  }
};

const boardsEqual = (a: Board, b: Board): boolean => {
  for (let row = 0; row < a.length; row++) {
    for (let col = 0; col < a[row].length; col++) {
      if (a[row][col] !== b[row][col]) return false;
    }
  }
  return true;
};

export const moveBoard = (board: Board, direction: Direction): MoveResult => {
  const next = cloneBoard(board);
  let scoreGained = 0;
  const size = board.length;

  for (let i = 0; i < size; i++) {
    const line = getLine(next, i, direction);
    const result = slideAndMergeLine(line);
    setLine(next, i, direction, result.line);
    scoreGained += result.scoreGained;
  }

  const moved = !boardsEqual(board, next);
  return { board: next, scoreGained, moved };
};

export const canMove = (board: Board): boolean => {
  const directions: Direction[] = ['up', 'down', 'left', 'right'];
  return directions.some((direction) => moveBoard(board, direction).moved);
};
