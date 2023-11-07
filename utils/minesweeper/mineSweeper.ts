import { Cell } from './cell'
import { GameStatus, Difficulty } from './enum'

export class MineSweeper {
  private board: Cell[][]
  private numRows: number
  private numCols: number
  private numMines: number
  private numFlags: number
  private numRevealed: number
  private gameStatus: GameStatus
  private difficulty: Difficulty

  constructor() {
    this.board = []
    this.numRows = 9
    this.numCols = 9
    this.numMines = 10
    this.numFlags = 0
    this.numRevealed = 0
    this.gameStatus = GameStatus.WAITING
    this.difficulty = Difficulty.BEGINNER
    for (let row = 0; row < this.numRows; row++) {
      this.board.push([])
      for (let col = 0; col < this.numCols; col++) {
        this.board[row].push(new Cell(false))
      }
    }
  }

  public getBoard(): Cell[][] {
    return this.board
  }

  public setBoard(board: Cell[][]): void {
    this.board = board
  }

  public getNumRows(): number {
    return this.numRows
  }

  public getNumCols(): number {
    return this.numCols
  }

  public getDifficulty(): Difficulty {
    return this.difficulty
  }

  public setup(difficulty: Difficulty): void {
    this.difficulty = difficulty
    switch (difficulty) {
      case Difficulty.BEGINNER:
        this.numRows = 9
        this.numCols = 9
        this.numMines = 10
        break
      case Difficulty.INTERMEDIATE:
        this.numRows = 16
        this.numCols = 16
        this.numMines = 40
        break
      case Difficulty.EXPERT:
        this.numRows = 30
        this.numCols = 16
        this.numMines = 99
        break
      case Difficulty.CUSTOM:
        break
    }
    this.numFlags = 0
    this.numRevealed = 0
    this.gameStatus = GameStatus.WAITING
    this.board = []
    for (let row = 0; row < this.numRows; row++) {
      this.board.push([])
      for (let col = 0; col < this.numCols; col++) {
        this.board[row].push(new Cell(false))
      }
    }
  }

  public setupCustom(numRows: number, numCols: number, numMines: number): void {
    this.difficulty = Difficulty.CUSTOM
    this.numRows = numRows
    this.numCols = numCols
    this.numMines = numMines
    this.numFlags = 0
    this.numRevealed = 0
    this.gameStatus = GameStatus.WAITING
    this.board = []
    for (let row = 0; row < this.numRows; row++) {
      this.board.push([])
      for (let col = 0; col < this.numCols; col++) {
        this.board[row].push(new Cell(false))
      }
    }
  }

  public clickCell(row: number, col: number): void {
    const cell = this.board[row][col]
    if (this.gameStatus === GameStatus.WAITING) {
      this.gameStatus = GameStatus.IN_PROGRESS
    }
    if (cell.getIsRevealed()) {
      return
    }
    cell.setIsRevealed(true)
    this.numRevealed++
    if (cell.getIsMine()) {
      this.gameStatus = GameStatus.LOST
      this.gameOver()
    } else if (
      this.numRevealed ===
      this.numRows * this.numCols - this.numMines
    ) {
      this.gameStatus = GameStatus.WON
    } else if (cell.getNumAdjacentMines() === 0) {
      this.clickAdjacentCells(row, col)
    }
  }

  public flagCell(row: number, col: number): void {
    const cell = this.board[row][col]
    cell.setIsFlagged(!cell.getIsFlagged())
  }

  public clickAdjacentCells(row: number, col: number): void {
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

  public getNumAdjacentMines(row: number, col: number): number {
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

  public generateMines(numMines: number): void {
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

  public generateNumAdjacentMines(): void {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        const numAdjacentMines = this.getNumAdjacentMines(row, col)
        this.board[row][col].setNumAdjacentMines(numAdjacentMines)
      }
    }
  }

  public generateBoard(numMines: number): void {
    this.generateMines(numMines)
    this.generateNumAdjacentMines()
  }

  public gameOver(): void {
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (this.board[row][col].getIsMine()) {
          this.board[row][col].setIsRevealed(true)
        }
      }
    }
  }
}
