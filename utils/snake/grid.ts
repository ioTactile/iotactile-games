import type { Position } from './types';

export const positionsEqual = (a: Position, b: Position): boolean => a.x === b.x && a.y === b.y;

export const clonePosition = (p: Position): Position => ({ x: p.x, y: p.y });

export const cloneSnake = (snake: Position[]): Position[] => snake.map(clonePosition);

export const isInsideGrid = (position: Position, gridSize: number): boolean =>
  position.x >= 0 && position.y >= 0 && position.x < gridSize && position.y < gridSize;

export const isOccupied = (snake: Position[], position: Position): boolean =>
  snake.some((segment) => positionsEqual(segment, position));

export const freeCells = (snake: Position[], gridSize: number): Position[] => {
  const cells: Position[] = [];
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const cell = { x, y };
      if (!isOccupied(snake, cell)) {
        cells.push(cell);
      }
    }
  }
  return cells;
};
