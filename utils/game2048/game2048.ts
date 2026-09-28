import { cloneBoard, createEmptyBoard, hasTile, maxTile } from './board';
import { WIN_TILE } from './constants';
import { canMove, moveBoard } from './move';
import type { IRandomSource } from './random';
import { MathRandomSource } from './random';
import { spawnTile } from './spawn';
import type { Board, Direction, GameStatus, MoveResult } from './types';

type Snapshot = {
  board: Board;
  score: number;
  status: GameStatus;
  hasWonOnce: boolean;
};

export interface IGame2048 {
  start(): void;
  restart(): void;
  move(direction: Direction): MoveResult | null;
  undo(): void;
  keepPlaying(): void;
  getBoard(): Board;
  getScore(): number;
  getBestTile(): number;
  getGameStatus(): GameStatus;
  getCanUndo(): boolean;
  getHasWonOnce(): boolean;
}

export class Game2048 implements IGame2048 {
  private board: Board;
  private score: number;
  private status: GameStatus;
  private hasWonOnce: boolean;
  private history: Snapshot[];
  private readonly random: IRandomSource;

  constructor(random: IRandomSource = new MathRandomSource()) {
    this.random = random;
    this.board = createEmptyBoard();
    this.score = 0;
    this.status = 'waiting';
    this.hasWonOnce = false;
    this.history = [];
  }

  public getBoard(): Board {
    return cloneBoard(this.board);
  }

  public getScore(): number {
    return this.score;
  }

  public getBestTile(): number {
    return maxTile(this.board);
  }

  public getGameStatus(): GameStatus {
    return this.status;
  }

  public getCanUndo(): boolean {
    return this.history.length > 0 && this.status !== 'lost';
  }

  public getHasWonOnce(): boolean {
    return this.hasWonOnce;
  }

  public start(): void {
    this.board = createEmptyBoard();
    this.score = 0;
    this.hasWonOnce = false;
    this.history = [];
    this.board = spawnTile(this.board, this.random).board;
    this.board = spawnTile(this.board, this.random).board;
    this.status = 'inProgress';
  }

  public restart(): void {
    this.start();
  }

  public move(direction: Direction): MoveResult | null {
    if (this.status === 'waiting' || this.status === 'lost') {
      return null;
    }
    // Allow moves while 'won' only after keepPlaying (status back to inProgress).
    // When status is 'won', block until keepPlaying or restart.
    if (this.status === 'won') {
      return null;
    }

    const result = moveBoard(this.board, direction);
    if (!result.moved) {
      return { board: cloneBoard(this.board), scoreGained: 0, moved: false };
    }

    this.pushHistory();
    this.board = result.board;
    this.score += result.scoreGained;
    this.board = spawnTile(this.board, this.random).board;

    if (!this.hasWonOnce && hasTile(this.board, WIN_TILE)) {
      this.hasWonOnce = true;
      this.status = 'won';
    } else if (!canMove(this.board)) {
      this.status = 'lost';
    }

    return {
      board: cloneBoard(this.board),
      scoreGained: result.scoreGained,
      moved: true,
    };
  }

  public undo(): void {
    if (!this.getCanUndo()) return;
    const snapshot = this.history.pop();
    if (!snapshot) return;
    this.board = cloneBoard(snapshot.board);
    this.score = snapshot.score;
    this.status = snapshot.status;
    this.hasWonOnce = snapshot.hasWonOnce;
  }

  public keepPlaying(): void {
    if (this.status !== 'won') return;
    this.status = 'inProgress';
  }

  private pushHistory(): void {
    this.history.push({
      board: cloneBoard(this.board),
      score: this.score,
      status: this.status,
      hasWonOnce: this.hasWonOnce,
    });
  }
}
