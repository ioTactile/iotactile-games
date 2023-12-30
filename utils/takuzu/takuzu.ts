import { generateBoard, prepareBoard } from "./generator";
import { checkBoard } from "./checker";
import type {
  TakuzuBoard,
  TakuzuCheckResult,
  CellValues as TCellValues,
  GameStatus,
  BoardSize,
  Difficulty,
} from "./types";
import { OUT_OF_RANGE, CellValues } from "./constants";
import { Timer } from "./timer";

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
  change(row: number, col: number, value: TCellValues): void;
  check(): TakuzuCheckResult;
  undo(): void;
  getCell(row: number, col: number): TCellValues;
  startGame(): void;
  handleWin(): void;
  isFull(): boolean;
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
    this.difficulty = "easy";
    this.timer = new Timer();
    this.GameStatus = "waiting";
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

  private generate(boardSize: BoardSize): void {
    let board: TakuzuBoard | null | undefined;
    let checkResult: TakuzuCheckResult | undefined;

    while (!board || (checkResult && checkResult.error)) {
      board = generateBoard(boardSize);
      if (board) checkResult = checkBoard(board);
    }

    this.board = board;
    this.boardSize = boardSize;
  }

  private prepare(difficulty: Difficulty): void {
    if (!this.board) this.generate(this.boardSize);

    const fillFactor = this.getFillFactor(difficulty);
    const task = prepareBoard(this.board, fillFactor);
    this.task = task;
    this.startedTask = task;
  }

  private getFillFactor(difficulty: Difficulty): number {
    switch (difficulty) {
      case "easy":
        return 0.5;
      case "medium":
        return 0.45;
      case "hard":
        return 0.4;
      case "expert":
        return 0.35;
      default:
        return 0.5;
    }
  }

  public start(boardSize: BoardSize, difficulty: Difficulty): void {
    this.generate(boardSize);
    this.prepare(difficulty);
  }

  public restart(): void {
    this.resetOptions();
    this.generate(this.boardSize);
    this.prepare(this.difficulty);
  }

  public reset(): void {
    this.resetOptions();
    this.task = this.startedTask;
  }

  public change(row: number, col: number, value: TCellValues): void {
    if (row >= this.boardSize || row < 0) throw new Error(OUT_OF_RANGE("row"));
    if (col >= this.boardSize || col < 0) throw new Error(OUT_OF_RANGE("col"));

    this.task = this.task.map((row) => [...row]);
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
      this.task = this.startedTask;
    }
  }

  public getCell(row: number, col: number): TCellValues {
    return this.task[row][col];
  }

  public startGame(): void {
    if (this.GameStatus === "waiting") {
      this.GameStatus = "inProgress";
      this.timer.start();
    }
  }

  public handleWin(): void {
    this.GameStatus = "won";
    this.timer.stop();
  }

  public isFull(): boolean {
    return this.task.every((row) =>
      row.every((value) => value !== CellValues.EMPTY),
    );
  }

  private resetOptions(): void {
    this.GameStatus = "waiting";
    this.timer.reset();
    this.boardHistory = [];
  }
}
