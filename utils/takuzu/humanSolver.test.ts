import { describe, test, expect } from 'vitest';
import { CellValues } from './constants';
import {
  applyPairs,
  applySandwich,
  applyBalance,
  applyUniqueness,
  applyAdvancedElimination,
  solveHuman,
  findNextLogicalCell,
} from './humanSolver';
import type { TakuzuBoard } from './types';

const boardFrom = (rows: string[]): TakuzuBoard =>
  rows.map((row) => row.split('') as TakuzuBoard[number]);

describe('takuzu humanSolver strategies', () => {
  test('applyPairs forces opposites beside a duo', () => {
    const board = boardFrom(['00....', '......', '......', '......', '......', '......']);
    expect(applyPairs(board, 0, false)).toBe(true);
    expect(board[0][2]).toBe(CellValues.ONE);
  });

  test('applySandwich fills the gap between identical values', () => {
    const board = boardFrom(['0.0...', '......', '......', '......', '......', '......']);
    expect(applySandwich(board, 0, false)).toBe(true);
    expect(board[0][1]).toBe(CellValues.ONE);
  });

  test('applyBalance fills remaining cells when quota is met', () => {
    const partial = boardFrom(['01010.', '......', '......', '......', '......', '......']);
    expect(applyBalance(partial, 0, false)).toBe(true);
    expect(partial[0][5]).toBe(CellValues.ONE);
  });

  test('applyUniqueness rejects a duplicate of a finished line', () => {
    const board = boardFrom(['010101', '01010.', '......', '......', '......', '......']);
    expect(applyUniqueness(board, 1, false)).toBe(true);
    expect(board[1][5]).toBe(CellValues.ZERO);
  });

  test('applyAdvancedElimination projects cells agreed by all legal completions', () => {
    const board = boardFrom(['00..1.', '......', '......', '......', '......', '......']);
    expect(applyAdvancedElimination(board, 0, false)).toBe(true);
    expect(board[0][2]).toBe(CellValues.ONE);
  });

  test('solveHuman solves a simple pair/sandwich puzzle with tier 1', () => {
    const board = boardFrom(['00.1.1', '1.10.0', '01.10.', '10.01.', '.1.01.', '.0.10.']);
    const before = board.map((row) => row.join('')).join('|');
    const result = solveHuman(board, 1);
    const after = result.board.map((row) => row.join('')).join('|');
    expect(after).not.toBe(before);
    expect(result.maxTierUsed).toBeLessThanOrEqual(1);
  });

  test('solveHuman with tier 2 completes a balance-gated line', () => {
    const board = boardFrom(['01010.', '10101.', '0101.0', '1010.1', '01.010', '10.101']);
    const result = solveHuman(board, 2);
    expect(result.board[0][5]).toBe(CellValues.ONE);
  });

  test('findNextLogicalCell returns a pair-forced cell with tier 1', () => {
    const board = boardFrom(['00....', '......', '......', '......', '......', '......']);
    const hint = findNextLogicalCell(board, 1);
    expect(hint).toEqual({ row: 0, col: 2 });
  });

  test('findNextLogicalCell prefers lower tiers before balance', () => {
    const board = boardFrom(['00....', '01010.', '......', '......', '......', '......']);
    const hint = findNextLogicalCell(board, 2);
    expect(hint).toEqual({ row: 0, col: 2 });
  });
});
