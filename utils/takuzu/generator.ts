import { checkBoard } from './checker';
import { CellValues } from './constants';
import {
  DIFFICULTY_MAX_TIER,
  DIFFICULTY_MIN_EMPTY_RATIO,
  requiresHarderThanPrevious,
} from './difficulty';
import { isFullySolvedByHuman } from './humanSolver';
import { arrayFromLength, cloneBoard, countSubstrInStr, getRandomNumber } from './utils';
import type { TakuzuBoard, BoardSize, Difficulty } from './types';

const MAX_CARVE_ATTEMPTS = 40;
const MAX_BOARD_GENERATION_ATTEMPTS = 80;

const generateValidBoard = (boardSize: BoardSize): TakuzuBoard | null => {
  for (let attempt = 0; attempt < MAX_BOARD_GENERATION_ATTEMPTS; attempt++) {
    const board = generateBoard(boardSize);
    if (board && !checkBoard(board).error) return board;
  }
  return null;
};

export const splitBoardIntoCells = (board: TakuzuBoard[number]): TakuzuBoard => {
  const splittedBoard: TakuzuBoard = [];

  for (let i = 0; i < board.length; i++) {
    const splittedRow: TakuzuBoard[number] = [];

    for (let j = 0; j < board.length; j++) {
      const value = board[i][j] as TakuzuBoard[number][number];
      splittedRow.push(value);
    }

    splittedBoard.push(splittedRow);
  }

  return splittedBoard;
};

export const generateBoard = (boardSize: BoardSize): TakuzuBoard | null => {
  const board: TakuzuBoard[number] = [];
  const cols = arrayFromLength(boardSize);
  let rows = generateRows(boardSize);

  let index: number;
  let row: TakuzuBoard[number][number];

  for (let i = 0; i < boardSize; i++) {
    if (i > 1) {
      const nextRowPattern = defineNextRow(cols);
      const filteredRows = filteringRows(rows, nextRowPattern);

      index = getRandomNumber(filteredRows.length - 1);
      row = filteredRows[index];

      if (!row) return null;
      index = rows.indexOf(row);
    } else {
      index = getRandomNumber(rows.length - 1);
      row = rows[index];
    }

    board.push(row);

    for (let j = 0; j < boardSize; j++) {
      cols[j] += row[j];
    }

    switch (index) {
      case 0:
        rows.splice(1);
        break;
      case rows.length - 1:
        rows.pop();
        break;
      default:
        rows = [...rows.slice(0, index), ...rows.slice(index + 1)];
        break;
    }
  }

  return splitBoardIntoCells(board);
};

export const generateRows = (boardSize: BoardSize): TakuzuBoard[number] => {
  const rows: TakuzuBoard[number] = [];

  const max = 2 ** boardSize;
  for (let i = 0; i < max; i++) {
    const str = i
      .toString(2)
      .padStart(boardSize, CellValues.ZERO)
      .toString() as TakuzuBoard[number][number];

    if (
      str.includes(CellValues.ZERO.repeat(3)) ||
      str.includes(CellValues.ONE.repeat(3)) ||
      countSubstrInStr(str, CellValues.ZERO) > boardSize / 2 ||
      countSubstrInStr(str, CellValues.ONE) > boardSize / 2
    )
      continue;

    rows.push(str);
  }

  return rows;
};

export const defineNextRow = (cols: string[]): string => {
  let nextRow = '';

  for (let i = 0; i < cols.length; i++) {
    if (cols[i].slice(-2) === CellValues.ZERO.repeat(2)) {
      nextRow += CellValues.ONE;
    } else if (cols[i].slice(-2) === CellValues.ONE.repeat(2)) {
      nextRow += CellValues.ZERO;
    } else if (countSubstrInStr(cols[i], CellValues.ZERO) === cols.length / 2) {
      nextRow += CellValues.ONE;
    } else if (countSubstrInStr(cols[i], CellValues.ONE) === cols.length / 2) {
      nextRow += CellValues.ZERO;
    } else {
      nextRow += CellValues.EMPTY;
    }
  }

  return nextRow;
};

export const filteringRows = (rows: TakuzuBoard[number], pattern: string): TakuzuBoard[number] => {
  const filteredRows = rows.filter((row) => {
    let isNextRow = true;
    for (let i = 0; i < rows.length; i++) {
      if (pattern[i] === CellValues.EMPTY) continue;
      if (row.split('')[i] !== pattern[i]) {
        isNextRow = false;
        break;
      }
    }

    return isNextRow;
  });

  return filteredRows;
};

export const countEmptyCells = (board: TakuzuBoard): number =>
  board.reduce(
    (total, row) =>
      total + row.reduce((rowTotal, cell) => rowTotal + (cell === CellValues.EMPTY ? 1 : 0), 0),
    0,
  );

const shufflePositions = (boardSize: number): Array<{ row: number; col: number }> => {
  const positions: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < boardSize; row++) {
    for (let col = 0; col < boardSize; col++) {
      positions.push({ row, col });
    }
  }

  for (let i = positions.length - 1; i > 0; i--) {
    const j = getRandomNumber(i);
    [positions[i], positions[j]] = [positions[j], positions[i]];
  }

  return positions;
};

/**
 * Remove clues while keeping the puzzle solvable by the human solver
 * at the given difficulty's strategy ceiling.
 */
export const carvePuzzle = (solution: TakuzuBoard, difficulty: Difficulty): TakuzuBoard => {
  const puzzle = cloneBoard(solution);
  const allowedTier = DIFFICULTY_MAX_TIER[difficulty];
  const positions = shufflePositions(solution.length);

  for (const { row, col } of positions) {
    const previous = puzzle[row][col];
    if (previous === CellValues.EMPTY) continue;

    puzzle[row][col] = CellValues.EMPTY;

    if (!isFullySolvedByHuman(puzzle, allowedTier)) {
      puzzle[row][col] = previous;
    }
  }

  return puzzle;
};

const meetsDifficultyFloor = (puzzle: TakuzuBoard, difficulty: Difficulty): boolean => {
  const emptyRatio = countEmptyCells(puzzle) / (puzzle.length * puzzle.length);
  if (emptyRatio < DIFFICULTY_MIN_EMPTY_RATIO[difficulty]) return false;

  if (!requiresHarderThanPrevious(difficulty)) return true;

  const weakerTier = DIFFICULTY_MAX_TIER[difficulty] - 1;
  return !isFullySolvedByHuman(puzzle, weakerTier);
};

/**
 * Generate a full valid board then carve clues for the target difficulty.
 * Retries with a new solution when empty-ratio / difficulty floor is not met.
 */
export const generatePuzzle = (
  boardSize: BoardSize,
  difficulty: Difficulty,
): { solution: TakuzuBoard; puzzle: TakuzuBoard } => {
  let best: { solution: TakuzuBoard; puzzle: TakuzuBoard } | null = null;
  let bestEmptyCount = -1;

  for (let attempt = 0; attempt < MAX_CARVE_ATTEMPTS; attempt++) {
    const solution = generateValidBoard(boardSize);
    if (!solution) continue;

    const puzzle = carvePuzzle(solution, difficulty);
    const emptyCount = countEmptyCells(puzzle);

    if (emptyCount > bestEmptyCount) {
      best = { solution, puzzle };
      bestEmptyCount = emptyCount;
    }

    if (meetsDifficultyFloor(puzzle, difficulty)) {
      return { solution, puzzle };
    }
  }

  if (!best) {
    throw new Error(`Unable to generate a Takuzu puzzle for size ${boardSize}`);
  }

  return best;
};
