import { CellValues } from './constants';
import { DIFFICULTY_MAX_TIER } from './difficulty';
import { findNextLogicalCell } from './humanSolver';
import type { Difficulty, HintCell, TakuzuBoard } from './types';

export const resolveHintCell = (
  task: TakuzuBoard,
  solution: TakuzuBoard,
  startedTask: TakuzuBoard,
  difficulty: Difficulty,
): HintCell | null => {
  if (!solution.length || !task.length) return null;

  const size = solution.length;

  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (startedTask[row][col] !== CellValues.EMPTY) continue;
      const current = task[row][col];
      if (current !== CellValues.EMPTY && current !== solution[row][col]) {
        return { row, col };
      }
    }
  }

  const cleaned: TakuzuBoard = task.map((line, row) =>
    line.map((cell, col) => (cell === solution[row][col] ? cell : CellValues.EMPTY)),
  );

  return findNextLogicalCell(cleaned, DIFFICULTY_MAX_TIER[difficulty]);
};
