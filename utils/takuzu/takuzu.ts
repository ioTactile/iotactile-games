import { generateBoard, prepareBoard } from './generator'
import { checkBoard } from './checker'
import type {
  TakuzuBoard,
  TakuzuCheckResult,
  TileValues as TTilesValues,
  GameStatus,
  BoardSize
} from './types'
import { OUT_OF_RANGE, TileValues } from './constants'
import { Timer } from './timer'

export interface ITakuzu {
  getBoard(): TakuzuBoard
  getTask(): TakuzuBoard
  getBoardSize(): BoardSize
  getTimer(): Timer
  getGameStatus(): GameStatus
  generate(boardSize: BoardSize): void
  prepare(boardSize: BoardSize, fillFactor?: number): void
  start(boardSize: BoardSize): void
  restart(boardSize: BoardSize): void
  change(row: number, col: number, value: TTilesValues): void
  check(): TakuzuCheckResult
  getTile(row: number, col: number): TTilesValues
  startGame(): void
  handleWin(): void
  isFull(): boolean
}

export class Takuzu implements ITakuzu {
  private board: TakuzuBoard
  private task: TakuzuBoard
  private boardSize: BoardSize
  private timer: Timer
  private GameStatus: GameStatus

  constructor() {
    this.board = []
    this.task = []
    this.boardSize = 6
    this.timer = new Timer()
    this.GameStatus = 'waiting'
  }

  public getBoard(): TakuzuBoard {
    return this.board
  }

  public getTask(): TakuzuBoard {
    return this.task
  }

  public getBoardSize(): BoardSize {
    return this.boardSize
  }

  public getTimer(): Timer {
    return this.timer
  }

  public getGameStatus(): GameStatus {
    return this.GameStatus
  }

  public generate(boardSize: BoardSize): void {
    let board: TakuzuBoard | null | undefined
    let checkResult: TakuzuCheckResult | undefined

    while (!board || (checkResult && checkResult.error)) {
      board = generateBoard(boardSize)
      if (board) checkResult = checkBoard(board)
    }

    this.board = board
    this.boardSize = boardSize
  }

  public prepare(fillFactor: number = 0.4) {
    if (!this.board) this.generate(this.boardSize)

    this.task = prepareBoard(this.board, fillFactor)
  }

  public start(boardSize: BoardSize): void {
    this.generate(boardSize)
    this.prepare()
  }

  public restart(boardSize: BoardSize): void {
    this.GameStatus = 'waiting'
    this.timer.reset()
    this.generate(boardSize)
    this.prepare()
  }

  public change(row: number, col: number, value: TTilesValues): void {
    if (row >= this.boardSize || row < 0) throw new Error(OUT_OF_RANGE('row'))
    if (col >= this.boardSize || col < 0) throw new Error(OUT_OF_RANGE('col'))

    this.task[row][col] = value
  }

  public check(): TakuzuCheckResult {
    return checkBoard(this.board)
  }

  public getTile(row: number, col: number): TTilesValues {
    return this.board[row][col]
  }

  public startGame(): void {
    if (this.GameStatus === 'waiting') {
      this.GameStatus = 'inProgress'
      this.timer.start()
    }
  }

  public handleWin(): void {
    this.GameStatus = 'won'
    this.timer.stop()
  }

  public isFull(): boolean {
    return this.board.every((row) =>
      row.every((value) => value !== TileValues.EMPTY)
    )
  }
}
