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

export class MineSweeper {
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
    this.board = []
    this.numRows = 9
    this.numCols = 9
    this.numMines = 10
    this.difficulty = Difficulty.BEGINNER
    this.numFlags = 0
    this.numRevealed = 0
    this.timer = new Timer()
    this.gameStatus = GameStatus.WAITING
    for (let col = 0; col < this.numCols; col++) {
      this.board.push([])
      for (let row = 0; row < this.numRows; row++) {
        this.board[col].push(new Cell())
      }
    }

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

  public getTimer(): Timer {
    return this.timer
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
    this.board = []
    this.numRows = options.numRows
    this.numCols = options.numCols
    this.numMines = options.numMines
    this.difficulty = options.difficulty
    this.numFlags = 0
    this.numRevealed = 0
    this.timer = new Timer()
    this.gameStatus = GameStatus.WAITING
    for (let col = 0; col < this.numCols; col++) {
      this.board.push([])
      for (let row = 0; row < this.numRows; row++) {
        this.board[col].push(new Cell())
      }
    }

    this.generateBoard(this.numMines)
  }

  public restart(options: GameOptions): void {
    this.timer.reset()
    this.setup(options)
  }

  public clickCell(row: number, col: number): void {
    this.startTimer()
    const cell = this.board[row][col]

    if (this.gameStatus === GameStatus.WAITING) {
      this.gameStatus = GameStatus.IN_PROGRESS
    }

    if (cell.getIsFlagged()) {
      return
    }

    if (cell.getIsRevealed()) {
      return
    }

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
      this.clickAdjacentCells(row, col)
    }
  }

  public flagCell(row: number, col: number): void {
    this.startTimer()
    const cell = this.board[row][col]

    if (this.numFlags === this.numMines && !cell.getIsFlagged()) {
      return
    }

    if (cell.getIsRevealed()) {
      return
    }

    if (cell.getIsFlagged()) {
      this.numFlags--
    } else {
      this.numFlags++
    }

    cell.setIsFlagged(!cell.getIsFlagged())
  }

  private clickAdjacentCells(row: number, col: number): void {
    for (let i = row - 1; i <= row + 1; i++) {
      for (let j = col - 1; j <= col + 1; j++) {
        if (i < 0 || i >= this.numRows || j < 0 || j >= this.numCols) {
          continue
        }
        if (!this.board[i][j].getIsRevealed()) {
          this.clickCell(i, j)
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
    this.gameOver()
    this.timer.stop()
    this.gameStatus = GameStatus.LOST
  }

  private handleWin(): void {
    this.timer.stop()
    this.gameStatus = GameStatus.WON
  }

  private gameOver(): void {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (this.board[row][col].getIsMine()) {
          this.board[row][col].setIsRevealed(true)
        }
      }
    }
  }

  private startTimer(): void {
    if (this.gameStatus === GameStatus.WAITING) {
      this.timer.start()
    }
  }
}
