import { CellValues } from './constants';
import type { CellValue, TakuzuBoard } from './types';

export const countSubstrInStr = (str: string, substr: string): number =>
  str.split(substr).length - 1;

export const getRandomNumber = (max: number, min: number = 0): number =>
  Math.round(Math.random() * (max - min) + min);

export const arrayFromLength = (length: number): string[] =>
  Array.from(new Array(length).keys()).map(() => '');

export const getRandomBoolean = (chance: number = 0.5): boolean => chance > Math.random();

export const takeRandomIndexFromArray = (array: any[]): number =>
  Math.floor(Math.random() * array.length);

export const cloneBoard = (board: TakuzuBoard): TakuzuBoard => board.map((row) => [...row]);

export const isEmptyCell = (value: CellValue): boolean => value === CellValues.EMPTY;

export const isFilledCell = (value: CellValue): boolean => !isEmptyCell(value);
