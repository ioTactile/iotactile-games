import { CellValues } from './constants';
import type { CellValue, HintCell, HumanSolveResult, TakuzuBoard } from './types';
import { cloneBoard, isEmptyCell, isFilledCell } from './utils';

const opposite = (value: CellValue): CellValue =>
  value === CellValues.ZERO ? CellValues.ONE : CellValues.ZERO;

const countValue = (line: CellValue[], value: CellValue): number =>
  line.reduce((count, cell) => count + (cell === value ? 1 : 0), 0);

const emptyIndices = (line: CellValue[]): number[] =>
  line.reduce<number[]>((indices, cell, index) => {
    if (isEmptyCell(cell)) indices.push(index);
    return indices;
  }, []);

const setCell = (
  board: TakuzuBoard,
  row: number,
  col: number,
  value: CellValue,
  transposed: boolean,
): boolean => {
  const r = transposed ? col : row;
  const c = transposed ? row : col;
  if (board[r][c] === value) return false;
  if (isFilledCell(board[r][c])) return false;
  board[r][c] = value;
  return true;
};

const getLine = (board: TakuzuBoard, index: number, transposed: boolean): CellValue[] => {
  const n = board.length;
  if (!transposed) return [...board[index]];
  return Array.from({ length: n }, (_, i) => board[i][index]);
};

const wouldCreateTriple = (line: CellValue[], index: number, value: CellValue): boolean => {
  const next = [...line];
  next[index] = value;
  for (let i = 0; i < next.length - 2; i++) {
    if (next[i] === value && next[i + 1] === value && next[i + 2] === value) return true;
  }
  return false;
};

const lineIsComplete = (line: CellValue[]): boolean => line.every(isFilledCell);

const lineIsValidComplete = (line: CellValue[]): boolean => {
  const n = line.length;
  const half = n / 2;
  if (countValue(line, CellValues.ZERO) !== half) return false;
  if (countValue(line, CellValues.ONE) !== half) return false;
  for (let i = 0; i < n - 2; i++) {
    if (line[i] === line[i + 1] && line[i] === line[i + 2] && isFilledCell(line[i])) return false;
  }
  return true;
};

/** Tier 1: pairs force adjacent opposites (00. → 001, .00 → 100). */
export const applyPairs = (board: TakuzuBoard, lineIndex: number, transposed: boolean): boolean => {
  const line = getLine(board, lineIndex, transposed);
  const n = line.length;
  let changed = false;

  for (let i = 0; i < n - 1; i++) {
    if (!isFilledCell(line[i]) || line[i] !== line[i + 1]) continue;
    const value = opposite(line[i]);
    if (i - 1 >= 0 && isEmptyCell(line[i - 1])) {
      if (setCell(board, lineIndex, i - 1, value, transposed)) changed = true;
    }
    if (i + 2 < n && isEmptyCell(line[i + 2])) {
      if (setCell(board, lineIndex, i + 2, value, transposed)) changed = true;
    }
  }

  return changed;
};

/** Tier 1: sandwich forces the middle (0.0 → 010). */
export const applySandwich = (
  board: TakuzuBoard,
  lineIndex: number,
  transposed: boolean,
): boolean => {
  const line = getLine(board, lineIndex, transposed);
  const n = line.length;
  let changed = false;

  for (let i = 1; i < n - 1; i++) {
    if (!isEmptyCell(line[i])) continue;
    if (!isFilledCell(line[i - 1]) || line[i - 1] !== line[i + 1]) continue;
    const value = opposite(line[i - 1]);
    if (setCell(board, lineIndex, i, value, transposed)) changed = true;
  }

  return changed;
};

/** Tier 2: when a color hits N/2, fill remaining empties with the other. */
export const applyBalance = (
  board: TakuzuBoard,
  lineIndex: number,
  transposed: boolean,
): boolean => {
  const line = getLine(board, lineIndex, transposed);
  const half = line.length / 2;
  let changed = false;

  const zeros = countValue(line, CellValues.ZERO);
  const ones = countValue(line, CellValues.ONE);

  let fill: CellValue | null = null;
  if (zeros === half && ones < half) fill = CellValues.ONE;
  else if (ones === half && zeros < half) fill = CellValues.ZERO;

  if (!fill) return false;

  for (let i = 0; i < line.length; i++) {
    if (isEmptyCell(line[i]) && setCell(board, lineIndex, i, fill, transposed)) changed = true;
  }

  return changed;
};

const getFinishedParallelLines = (
  board: TakuzuBoard,
  lineIndex: number,
  transposed: boolean,
): CellValue[][] => {
  const n = board.length;
  const finished: CellValue[][] = [];
  for (let other = 0; other < n; other++) {
    if (other === lineIndex) continue;
    const otherLine = getLine(board, other, transposed);
    if (lineIsComplete(otherLine)) finished.push(otherLine);
  }
  return finished;
};

const duplicatesFinished = (trial: CellValue[], finishedLines: CellValue[][]): boolean =>
  finishedLines.some((finished) => trial.every((cell, i) => cell === finished[i]));

/** Tier 3: nearly-complete line must differ from any finished parallel line. */
export const applyUniqueness = (
  board: TakuzuBoard,
  lineIndex: number,
  transposed: boolean,
): boolean => {
  const line = getLine(board, lineIndex, transposed);
  const empties = emptyIndices(line);
  if (empties.length === 0 || empties.length > 2) return false;

  const finishedLines = getFinishedParallelLines(board, lineIndex, transposed);
  if (finishedLines.length === 0) return false;

  let changed = false;

  if (empties.length === 1) {
    const emptyIndex = empties[0];
    for (const value of [CellValues.ZERO, CellValues.ONE] as CellValue[]) {
      const trial = [...line];
      trial[emptyIndex] = value;
      if (duplicatesFinished(trial, finishedLines)) {
        if (setCell(board, lineIndex, emptyIndex, opposite(value), transposed)) changed = true;
        break;
      }
    }
    return changed;
  }

  const [a, b] = empties;
  const candidates: Array<[CellValue, CellValue]> = [
    [CellValues.ZERO, CellValues.ZERO],
    [CellValues.ZERO, CellValues.ONE],
    [CellValues.ONE, CellValues.ZERO],
    [CellValues.ONE, CellValues.ONE],
  ];

  const legal = candidates.filter(([va, vb]) => {
    const trial = [...line];
    trial[a] = va;
    trial[b] = vb;
    if (!lineIsValidComplete(trial)) return false;
    return !duplicatesFinished(trial, finishedLines);
  });

  if (legal.length === 0) return false;

  for (const idx of [a, b]) {
    const values = new Set(legal.map((pair) => (idx === a ? pair[0] : pair[1])));
    if (values.size === 1) {
      const value = [...values][0];
      if (setCell(board, lineIndex, idx, value, transposed)) changed = true;
    }
  }

  return changed;
};

/**
 * Tier 4: enumerate legal completions of a sparse line and project agreed cells.
 * Considers balance, no-triple, and uniqueness vs finished parallel lines.
 */
export const applyAdvancedElimination = (
  board: TakuzuBoard,
  lineIndex: number,
  transposed: boolean,
): boolean => {
  const line = getLine(board, lineIndex, transposed);
  const empties = emptyIndices(line);
  if (empties.length < 2 || empties.length > 4) return false;

  const n = board.length;
  const half = n / 2;
  const zerosNeeded = half - countValue(line, CellValues.ZERO);
  const onesNeeded = half - countValue(line, CellValues.ONE);
  if (zerosNeeded < 0 || onesNeeded < 0) return false;
  if (zerosNeeded + onesNeeded !== empties.length) return false;

  const finishedLines = getFinishedParallelLines(board, lineIndex, transposed);
  const legal: CellValue[][] = [];

  const recurse = (offset: number, zerosLeft: number, onesLeft: number, current: CellValue[]) => {
    if (offset === empties.length) {
      if (!lineIsValidComplete(current)) return;
      if (duplicatesFinished(current, finishedLines)) return;
      legal.push([...current]);
      return;
    }

    const index = empties[offset];
    for (const value of [CellValues.ZERO, CellValues.ONE] as CellValue[]) {
      if (value === CellValues.ZERO && zerosLeft <= 0) continue;
      if (value === CellValues.ONE && onesLeft <= 0) continue;
      if (wouldCreateTriple(current, index, value)) continue;
      current[index] = value;
      recurse(
        offset + 1,
        zerosLeft - (value === CellValues.ZERO ? 1 : 0),
        onesLeft - (value === CellValues.ONE ? 1 : 0),
        current,
      );
      current[index] = CellValues.EMPTY;
    }
  };

  recurse(0, zerosNeeded, onesNeeded, [...line]);
  if (legal.length === 0) return false;

  let changed = false;
  for (const index of empties) {
    const values = new Set(legal.map((candidate) => candidate[index]));
    if (values.size === 1) {
      const value = [...values][0];
      if (setCell(board, lineIndex, index, value, transposed)) changed = true;
    }
  }

  return changed;
};

const applyTierStrategies = (
  board: TakuzuBoard,
  lineIndex: number,
  transposed: boolean,
  allowedTier: number,
): { changed: boolean; maxTierUsed: number } => {
  let changed = false;
  let maxTierUsed = 0;

  if (allowedTier >= 1) {
    if (applyPairs(board, lineIndex, transposed)) {
      changed = true;
      maxTierUsed = Math.max(maxTierUsed, 1);
    }
    if (applySandwich(board, lineIndex, transposed)) {
      changed = true;
      maxTierUsed = Math.max(maxTierUsed, 1);
    }
  }

  if (allowedTier >= 2) {
    if (applyBalance(board, lineIndex, transposed)) {
      changed = true;
      maxTierUsed = Math.max(maxTierUsed, 2);
    }
  }

  if (allowedTier >= 3) {
    if (applyUniqueness(board, lineIndex, transposed)) {
      changed = true;
      maxTierUsed = Math.max(maxTierUsed, 3);
    }
  }

  if (allowedTier >= 4) {
    if (applyAdvancedElimination(board, lineIndex, transposed)) {
      changed = true;
      maxTierUsed = Math.max(maxTierUsed, 4);
    }
  }

  return { changed, maxTierUsed };
};

const boardIsFull = (board: TakuzuBoard): boolean =>
  board.every((row) => row.every((cell) => isFilledCell(cell)));

export const solveHuman = (board: TakuzuBoard, allowedTiers: number): HumanSolveResult => {
  const working = cloneBoard(board);
  let maxTierUsed = 0;
  let progress = true;

  while (progress) {
    progress = false;
    const n = working.length;

    for (const transposed of [false, true]) {
      for (let i = 0; i < n; i++) {
        const result = applyTierStrategies(working, i, transposed, allowedTiers);
        if (result.changed) {
          progress = true;
          maxTierUsed = Math.max(maxTierUsed, result.maxTierUsed);
        }
      }
    }
  }

  return {
    solved: boardIsFull(working),
    maxTierUsed,
    board: working,
  };
};

export const isFullySolvedByHuman = (board: TakuzuBoard, allowedTiers: number): boolean =>
  solveHuman(board, allowedTiers).solved;

export const findNextLogicalCell = (board: TakuzuBoard, allowedTiers: number): HintCell | null => {
  for (let tier = 1; tier <= allowedTiers; tier++) {
    const result = solveHuman(board, tier);
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board.length; col++) {
        if (isEmptyCell(board[row][col]) && isFilledCell(result.board[row][col])) {
          return { row, col };
        }
      }
    }
  }
  return null;
};
