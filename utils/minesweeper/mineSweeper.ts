import { Cell } from './cell'
import { Timer } from './Timer'

export enum GameStatus {
  WAITING,
  IN_PROGRESS,
  WON,
  LOST
}

export enum Difficulty {
  BEGINNER,
  INTERMEDIATE,
  EXPERT,
  CUSTOM
}

export interface GameOptions {
  numRows: number
  numCols: number
  numMines: number
  difficulty: Difficulty
}

export interface IMineSweeper {
  getBoard(): Cell[][]
  getNumRows(): number
  getNumCols(): number
  getNumMines(): number
  getNumFlags(): number
  getTimer(): Timer
  getGameStatusString(): string
  getDifficulty(): Difficulty
  setup(options: GameOptions): void
  restart(options: GameOptions): void
  handleCellAction(row: number, col: number, action: 'click' | 'flag'): void
}

export class MineSweeper implements IMineSweeper {
  private board: Cell[][]
  private numRows: number
  private numCols: number
  private numMines: number
  private numFlags: number
  private numRevealed: number
  private timer: Timer
  private gameStatus: GameStatus
  private difficulty: Difficulty

  constructor() {
    this.numRows = 9
    this.numCols = 9
    this.numMines = 10
    this.difficulty = Difficulty.BEGINNER
    this.numFlags = 0
    this.numRevealed = 0
    this.timer = new Timer()
    this.gameStatus = GameStatus.WAITING
    this.board = Array.from({ length: this.numRows }, () =>
      Array.from({ length: this.numCols }, () => new Cell())
    )

    this.generateBoard(this.numMines)
  }

  public getBoard(): Cell[][] {
    return this.board
  }

  public getNumRows(): number {
    return this.numRows
  }

  public getNumCols(): number {
    return this.numCols
  }

  public getNumMines(): number {
    return this.numMines
  }

  public getNumFlags(): number {
    return this.numFlags
  }

  public getNumRevealed(): number {
    return this.numRevealed
  }

  public getTimer(): Timer {
    return this.timer
  }

  public getCell(row: number, col: number): Cell {
    return this.board[row][col]
  }

  public getGameStatus(): GameStatus {
    return this.gameStatus
  }

  public getGameStatusString(): string {
    switch (this.gameStatus) {
      case GameStatus.WAITING:
        return 'En attente'
      case GameStatus.IN_PROGRESS:
        return 'En cours'
      case GameStatus.WON:
        return 'Gagné'
      case GameStatus.LOST:
        return 'Perdu'
    }
  }

  public getDifficulty(): Difficulty {
    return this.difficulty
  }

  public setup(options: GameOptions): void {
    this.numRows = options.numRows
    this.numCols = options.numCols
    this.numMines = options.numMines
    this.difficulty = options.difficulty
    this.numFlags = 0
    this.numRevealed = 0
    this.timer = new Timer()
    this.gameStatus = GameStatus.WAITING
    this.board = this.board = Array.from({ length: this.numRows }, () =>
      Array.from({ length: this.numCols }, () => new Cell())
    )

    this.generateBoard(this.numMines)
  }

  public restart(options: GameOptions): void {
    this.timer.reset()
    this.setup(options)
  }

  public handleCellAction(
    row: number,
    col: number,
    action: 'click' | 'flag'
  ): void {
    if (
      this.gameStatus === GameStatus.LOST ||
      this.gameStatus === GameStatus.WON
    ) {
      return
    }

    this.startTimer()
    const cell = this.board[row][col]

    if (this.gameStatus === GameStatus.WAITING) {
      this.gameStatus = GameStatus.IN_PROGRESS
    }

    if (
      (action === 'flag' &&
        this.numFlags === this.numMines &&
        !cell.getIsFlagged()) ||
      (action === 'click' && (cell.getIsFlagged() || cell.getIsRevealed()))
    ) {
      return
    }

    if (action === 'flag') {
      this.handleFlagAction(cell)
    } else {
      this.handleClickAction(cell, row, col)
    }
  }

  private handleClickAction(cell: Cell, row: number, col: number): void {
    cell.setIsRevealed(true)
    this.numRevealed++

    if (cell.getIsMine()) {
      this.handleLoss(cell)
    } else if (
      this.numRevealed ===
      this.numRows * this.numCols - this.numMines
    ) {
      this.handleWin()
      this.gameStatus = GameStatus.WON
    } else if (cell.getNumAdjacentMines() === 0) {
      this.forEachAdjacentCell(row, col, (cell, row, col) => {
        if (!cell.getIsMine() && !cell.getIsRevealed()) {
          this.handleClickAction(cell, row, col)
        }
      })
    }
  }

  private handleFlagAction(cell: Cell): void {
    if (cell.getIsFlagged()) {
      this.numFlags--
    } else {
      this.numFlags++
    }
    cell.setIsFlagged(!cell.getIsFlagged())
  }

  private isValidCell(row: number, col: number): boolean {
    return row >= 0 && row < this.numRows && col >= 0 && col < this.numCols
  }

  private forEachAdjacentCell(
    row: number,
    col: number,
    callback: (cell: Cell, row: number, col: number) => void
  ): void {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (this.isValidCell(i, j)) {
          callback(this.board[i][j], i, j)
        }
      }
    }
  }

  private getNumAdjacentMines(row: number, col: number): number {
    if (this.board[row][col].getIsMine()) {
      return -1
    }

    let numAdjacentMines = 0
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i < 0 || i >= this.numRows || j < 0 || j >= this.numCols) {
          continue
        }
        if (this.board[i][j].getIsMine()) {
          numAdjacentMines++
        }
      }
    }

    return numAdjacentMines
  }

  private generateMines(numMines: number): void {
    let numMinesGenerated = 0
    while (numMinesGenerated < numMines) {
      const row = Math.floor(Math.random() * this.numRows)
      const col = Math.floor(Math.random() * this.numCols)
      if (!this.board[row][col].getIsMine()) {
        this.board[row][col].setIsMine(true)
        numMinesGenerated++
      }
    }
  }

  private generateNumAdjacentMines(): void {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        const numAdjacentMines = this.getNumAdjacentMines(row, col)
        this.board[row][col].setNumAdjacentMines(numAdjacentMines)
      }
    }
  }

  private generateBoard(numMines: number): void {
    this.generateMines(numMines)
    this.generateNumAdjacentMines()
  }

  private handleLoss(cell: Cell): void {
    cell.setIsMineClicked(true)
    this.handleGameOver()
    this.timer.stop()
    this.gameStatus = GameStatus.LOST
  }

  private handleWin(): void {
    this.timer.stop()
    this.gameStatus = GameStatus.WON
  }

  private handleGameOver(): void {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        const cell = this.board[row][col]
        if (cell.getIsMine() && !cell.getIsFlagged()) {
          cell.setIsRevealed(true)
        }
      }
    }
  }

  private startTimer(): void {
    if (this.gameStatus === GameStatus.WAITING && !this.timer.isStarted()) {
      this.timer.start()
    }
  }
}
