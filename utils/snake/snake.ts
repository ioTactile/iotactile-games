import { FOOD_SCORE, GRID_SIZE, INITIAL_SNAKE_LENGTH, WALL_GRACE_TICKS } from './constants';
import { spawnFood } from './food';
import { clonePosition, cloneSnake, isInsideGrid, positionsEqual } from './grid';
import { hitsSelf, nextHead, oppositeDirection } from './movement';
import type { IRandomSource } from './random';
import { MathRandomSource } from './random';
import type { Direction, GameStatus, Position, TickResult } from './types';

export interface ISnake {
  start(): void;
  restart(): void;
  pause(): void;
  resume(): void;
  setDirection(direction: Direction): void;
  tick(): TickResult | null;
  getSnake(): Position[];
  getFood(): Position | null;
  getDirection(): Direction;
  getScore(): number;
  getLength(): number;
  getGameStatus(): GameStatus;
  getGridSize(): number;
}

export class Snake implements ISnake {
  private snake: Position[];
  private food: Position | null;
  private direction: Direction;
  private pendingDirection: Direction | null;
  private score: number;
  private status: GameStatus;
  private wallGraceTicksRemaining: number;
  private readonly gridSize: number;
  private readonly random: IRandomSource;

  constructor(random: IRandomSource = new MathRandomSource(), gridSize: number = GRID_SIZE) {
    this.random = random;
    this.gridSize = gridSize;
    this.snake = [];
    this.food = null;
    this.direction = 'right';
    this.pendingDirection = null;
    this.score = 0;
    this.status = 'waiting';
    this.wallGraceTicksRemaining = 0;
  }

  public getSnake(): Position[] {
    return cloneSnake(this.snake);
  }

  public getFood(): Position | null {
    return this.food ? clonePosition(this.food) : null;
  }

  public getDirection(): Direction {
    return this.direction;
  }

  public getScore(): number {
    return this.score;
  }

  public getLength(): number {
    return this.snake.length;
  }

  public getGameStatus(): GameStatus {
    return this.status;
  }

  public getGridSize(): number {
    return this.gridSize;
  }

  public start(): void {
    const midY = Math.floor(this.gridSize / 2);
    const startX = Math.floor(this.gridSize / 2) - 1;
    this.snake = [];
    for (let i = 0; i < INITIAL_SNAKE_LENGTH; i++) {
      this.snake.push({ x: startX - i, y: midY });
    }
    this.direction = 'right';
    this.pendingDirection = null;
    this.score = 0;
    this.wallGraceTicksRemaining = 0;
    this.food = spawnFood(this.snake, this.gridSize, this.random);
    this.status = 'inProgress';
  }

  public restart(): void {
    this.start();
  }

  public pause(): void {
    if (this.status === 'inProgress') {
      this.status = 'paused';
    }
  }

  public resume(): void {
    if (this.status === 'paused') {
      this.status = 'inProgress';
    }
  }

  public setDirection(direction: Direction): void {
    if (this.status !== 'inProgress' && this.status !== 'paused') return;
    if (direction === oppositeDirection(this.direction)) return;
    this.pendingDirection = direction;
  }

  public tick(): TickResult | null {
    if (this.status !== 'inProgress') return null;

    if (this.pendingDirection) {
      if (this.pendingDirection !== oppositeDirection(this.direction)) {
        this.direction = this.pendingDirection;
      }
      this.pendingDirection = null;
    }

    const head = this.snake[0];
    const next = nextHead(head, this.direction);

    if (!isInsideGrid(next, this.gridSize)) {
      return this.handleWallCollision();
    }

    this.wallGraceTicksRemaining = 0;

    const ateFood = this.food !== null && positionsEqual(next, this.food);

    if (hitsSelf(this.snake, next, ateFood)) {
      this.status = 'lost';
      return { ateFood: false, lost: true };
    }

    this.snake = [next, ...this.snake];
    if (ateFood) {
      this.score += FOOD_SCORE;
      this.food = spawnFood(this.snake, this.gridSize, this.random);
      if (this.food === null) {
        this.status = 'lost';
        return { ateFood: true, lost: true };
      }
    } else {
      this.snake.pop();
    }

    return { ateFood, lost: false };
  }

  private handleWallCollision(): TickResult {
    if (this.wallGraceTicksRemaining <= 0) {
      this.wallGraceTicksRemaining = WALL_GRACE_TICKS;
      return { ateFood: false, lost: false };
    }

    this.wallGraceTicksRemaining -= 1;
    if (this.wallGraceTicksRemaining <= 0) {
      this.status = 'lost';
      return { ateFood: false, lost: true };
    }

    return { ateFood: false, lost: false };
  }
}
