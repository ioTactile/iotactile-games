import { positionsEqual } from './grid';
import type { Direction, Position } from './types';

export const oppositeDirection = (direction: Direction): Direction => {
  switch (direction) {
    case 'up':
      return 'down';
    case 'down':
      return 'up';
    case 'left':
      return 'right';
    case 'right':
      return 'left';
  }
};

export const nextHead = (head: Position, direction: Direction): Position => {
  switch (direction) {
    case 'up':
      return { x: head.x, y: head.y - 1 };
    case 'down':
      return { x: head.x, y: head.y + 1 };
    case 'left':
      return { x: head.x - 1, y: head.y };
    case 'right':
      return { x: head.x + 1, y: head.y };
  }
};

/** True if the next head hits the body (excluding the current tail tip, which will move away). */
export const hitsSelf = (snake: Position[], next: Position, grows: boolean): boolean => {
  const bodyToCheck = grows ? snake : snake.slice(0, -1);
  return bodyToCheck.some((segment) => positionsEqual(segment, next));
};
