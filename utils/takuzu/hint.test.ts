import { describe, test, expect } from 'vitest';
import { resolveHintCell } from './hint';
import type { TakuzuBoard } from './types';

const boardFrom = (rows: string[]): TakuzuBoard =>
  rows.map((row) => row.split('') as TakuzuBoard[number]);

describe('resolveHintCell', () => {
  test('hints a wrong placement before a logical empty cell', () => {
    const solution = boardFrom(['001011', '......', '......', '......', '......', '......']);
    const started = boardFrom(['00....', '......', '......', '......', '......', '......']);
    const task = boardFrom(['000...', '......', '......', '......', '......', '......']);

    expect(resolveHintCell(task, solution, started, 'easy')).toEqual({ row: 0, col: 2 });
  });

  test('hints the next pair-forced cell when board is clean', () => {
    const solution = boardFrom(['001011', '......', '......', '......', '......', '......']);
    const started = boardFrom(['00....', '......', '......', '......', '......', '......']);
    const task = boardFrom(['00....', '......', '......', '......', '......', '......']);

    expect(resolveHintCell(task, solution, started, 'easy')).toEqual({ row: 0, col: 2 });
  });
});
