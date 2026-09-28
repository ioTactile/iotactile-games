import { describe, test, expect } from 'vitest';
import {
  generateBoard,
  generateRows,
  splitBoardIntoCells,
  generatePuzzle,
  carvePuzzle,
  countEmptyCells,
} from './generator';
import { checkBoard } from './checker';
import { DIFFICULTY_MAX_TIER, DIFFICULTY_MIN_EMPTY_RATIO } from './difficulty';
import { isFullySolvedByHuman, solveHuman } from './humanSolver';
import type { Difficulty } from './types';

describe('takuzu generator', () => {
  test('generateRows only keeps balanced non-triple patterns', () => {
    const rows = generateRows(6);
    expect(rows.length).toBeGreaterThan(0);
    for (const row of rows) {
      expect(row).toHaveLength(6);
      const zeros = [...row].filter((cell) => cell === '0').length;
      const ones = [...row].filter((cell) => cell === '1').length;
      expect(zeros).toBe(ones);
      expect(row.includes('000')).toBe(false);
      expect(row.includes('111')).toBe(false);
    }
  });

  test('splitBoardIntoCells keeps a square matrix', () => {
    const board = ['0101', '1010', '0101', '1010'];
    const cells = splitBoardIntoCells(board);
    expect(cells).toHaveLength(4);
    expect(cells[0]).toEqual(['0', '1', '0', '1']);
  });

  test('generateBoard returns a valid completed board for size 6', () => {
    let board = null;
    for (let attempt = 0; attempt < 80 && (!board || checkBoard(board).error); attempt++) {
      board = generateBoard(6);
    }
    expect(board).not.toBeNull();
    expect(board).toHaveLength(6);
    expect(checkBoard(board!).error).toBe(false);
  });

  test.each(['easy', 'medium', 'hard', 'expert'] as Difficulty[])(
    'generatePuzzle 6x6 %s is solvable at its strategy ceiling',
    (difficulty) => {
      const { solution, puzzle } = generatePuzzle(6, difficulty);

      expect(checkBoard(solution).error).toBe(false);
      expect(puzzle).toHaveLength(6);

      const allowedTiers = DIFFICULTY_MAX_TIER[difficulty];
      expect(isFullySolvedByHuman(puzzle, allowedTiers)).toBe(true);

      const solved = solveHuman(puzzle, allowedTiers);
      expect(solved.board).toEqual(solution);
    },
  );

  test('hard 6x6 is not fully solvable with only medium strategies when floor is met', () => {
    let foundStrict = false;

    for (let i = 0; i < 15 && !foundStrict; i++) {
      const { puzzle } = generatePuzzle(6, 'hard');
      const emptyRatio = countEmptyCells(puzzle) / 36;
      const weakSolvable = isFullySolvedByHuman(puzzle, DIFFICULTY_MAX_TIER.medium);
      if (emptyRatio >= DIFFICULTY_MIN_EMPTY_RATIO.hard && !weakSolvable) {
        foundStrict = true;
      }
      // Always must be solvable at hard ceiling
      expect(isFullySolvedByHuman(puzzle, DIFFICULTY_MAX_TIER.hard)).toBe(true);
    }

    // Best-effort: with retries the generator usually finds a strict hard puzzle
    expect(foundStrict).toBe(true);
  });

  test('carvePuzzle keeps human solvability for easy', () => {
    let solution = null;
    for (let attempt = 0; attempt < 30 && !solution; attempt++) {
      solution = generateBoard(6);
    }
    expect(solution).not.toBeNull();

    const puzzle = carvePuzzle(solution!, 'easy');
    expect(isFullySolvedByHuman(puzzle, DIFFICULTY_MAX_TIER.easy)).toBe(true);
    expect(countEmptyCells(puzzle)).toBeGreaterThan(0);
  });

  test('generatePuzzle smoke 8x8 medium', () => {
    const { solution, puzzle } = generatePuzzle(8, 'medium');
    expect(checkBoard(solution).error).toBe(false);
    expect(puzzle).toHaveLength(8);
    expect(isFullySolvedByHuman(puzzle, DIFFICULTY_MAX_TIER.medium)).toBe(true);
  });
});
