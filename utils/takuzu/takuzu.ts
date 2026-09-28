import { generatePuzzle } from './generator';
import { checkBoard } from './checker';
import type {
  TakuzuBoard,
  TakuzuCheckResult,
  CellValue,
  GameStatus,
  BoardSize,
  Difficulty,
  HintCell,
} from './types';
import { OUT_OF_RANGE, CellValues } from './constants';
import { resolveHintCell } from './hint';
import { cloneBoard } from './utils';
import { Timer } from './timer';

export interface ITakuzu {
  getBoard(): TakuzuBoard;
  getTask(): TakuzuBoard;
  getStartedTask(): TakuzuBoard;
  getBoardHistory(): TakuzuBoard[];
  getBoardSize(): BoardSize;
  getDifficulty(): Difficulty;
  getTimer(): Timer;
  getGameStatus(): GameStatus;
  start(boardSize: BoardSize, difficulty: Difficulty): void;
  restart(): void;
  reset(): void;
  change(row: number, col: number, value: CellValue): void;
  check(): TakuzuCheckResult;
  undo(): void;
  getCell(row: number, col: number): CellValue;
  startGame(): void;
  handleWin(): void;
  isFull(): boolean;
  getHintCell(): HintCell | null;
}

export class Takuzu implements ITakuzu {
  private board: TakuzuBoard;
  private task: TakuzuBoard;
  private startedTask: TakuzuBoard;
  private boardHistory: TakuzuBoard[];
  private boardSize: BoardSize;
  private difficulty: Difficulty;
  private timer: Timer;
  private GameStatus: GameStatus;

  constructor() {
    this.board = [];
    this.task = [];
    this.startedTask = [];
    this.boardHistory = [];
    this.boardSize = 6;
    this.difficulty = 'easy';
    this.timer = new Timer();
    this.GameStatus = 'waiting';
  }

  public getBoard(): TakuzuBoard {
    return this.board;
  }

  public getTask(): TakuzuBoard {
    return this.task;
  }

  public getStartedTask(): TakuzuBoard {
    return this.startedTask;
  }

  public getBoardHistory(): TakuzuBoard[] {
    return this.boardHistory;
  }

  public getBoardSize(): BoardSize {
    return this.boardSize;
  }

  public getDifficulty(): Difficulty {
    return this.difficulty;
  }

  public getTimer(): Timer {
    return this.timer;
  }

  public getGameStatus(): GameStatus {
    return this.GameStatus;
  }

  private generate(boardSize: BoardSize, difficulty: Difficulty): void {
    const { solution, puzzle } = generatePuzzle(boardSize, difficulty);
    this.board = solution;
    this.boardSize = boardSize;
    this.difficulty = difficulty;
    this.task = puzzle;
    this.startedTask = cloneBoard(puzzle);
  }

  public start(boardSize: BoardSize, difficulty: Difficulty): void {
    this.generate(boardSize, difficulty);
  }

  public restart(): void {
    this.resetOptions();
    this.generate(this.boardSize, this.difficulty);
  }

  public reset(): void {
    this.resetOptions();
    this.task = cloneBoard(this.startedTask);
  }

  public change(row: number, col: number, value: CellValue): void {
    if (row >= this.boardSize || row < 0) throw new Error(OUT_OF_RANGE('row'));
    if (col >= this.boardSize || col < 0) throw new Error(OUT_OF_RANGE('col'));

    this.task = cloneBoard(this.task);
    this.task[row][col] = value;
    this.boardHistory.push(this.task);
  }

  public check(): TakuzuCheckResult {
    return checkBoard(this.task);
  }

  public undo(): void {
    this.boardHistory.pop();
    if (this.boardHistory.length) {
      this.task = this.boardHistory[this.boardHistory.length - 1];
    } else {
      this.task = cloneBoard(this.startedTask);
    }
  }

  public getCell(row: number, col: number): CellValue {
    return this.task[row][col];
  }

  public startGame(): void {
    if (this.GameStatus === 'waiting') {
      this.GameStatus = 'inProgress';
      this.timer.start();
    }
  }

  public handleWin(): void {
    this.GameStatus = 'won';
    this.timer.stop();
  }

  public isFull(): boolean {
    return this.task.every((row) => row.every((value) => value !== CellValues.EMPTY));
  }

  public getHintCell(): HintCell | null {
    return resolveHintCell(this.task, this.board, this.startedTask, this.difficulty);
  }

  private resetOptions(): void {
    this.GameStatus = 'waiting';
    this.timer.reset();
    this.boardHistory = [];
  }
}
