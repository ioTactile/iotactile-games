export class LifeGame {
  private board: boolean[][]
  private numRows: number
  private numCols: number

  constructor(numRows: number, numCols: number) {
    this.numRows = numRows
    this.numCols = numCols
    this.board = new Array(numRows)
      .fill(null)
      .map(() => new Array(numCols).fill(false))
  }

  public getNumRows(): number {
    return this.numRows
  }

  public getNumCols(): number {
    return this.numCols
  }

  public getBoard(): boolean[][] {
    return this.board
  }

  public toggleCell(row: number, col: number): void {
    this.board[row][col] = !this.board[row][col]
  }

  public update(): void {
    const newBoard: boolean[][] = new Array(this.numRows)
      .fill(null)
      .map(() => new Array(this.numCols).fill(false))

    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        const isAlive = this.board[row][col]
        const neighbors = this.countAliveNeighbors(row, col)

        if (isAlive) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[row][col] = true
          }
        } else if (!isAlive && neighbors === 3) {
          newBoard[row][col] = true
        }
      }
    }

    this.board = newBoard
  }

  public clearBoard(): void {
    this.board = new Array(this.numRows)
      .fill(null)
      .map(() => new Array(this.numCols).fill(false))
  }

  public loadPattern(pattern: number[][]): void {
    const centeredPattern = this.centerPattern(pattern)

    for (const [row, col] of centeredPattern) {
      if (row >= 0 && row < this.numRows && col >= 0 && col < this.numCols) {
        this.board[row][col] = true
      }
    }
  }

  private centerPattern(pattern: number[][]): number[][] {
    const patternHeight = pattern.reduce(
      (maxRow, [row]) => Math.max(maxRow, row),
      0
    )
    const patternWidth = pattern.reduce(
      (maxCol, [, col]) => Math.max(maxCol, col),
      0
    )

    const offsetX = Math.floor((this.numCols - patternWidth) / 2)
    const offsetY = Math.floor((this.numRows - patternHeight) / 2)

    return pattern.map(([row, col]) => [row + offsetY, col + offsetX])
  }

  private countAliveNeighbors(row: number, col: number): number {
    let count = 0
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue
        const newRow = row + i
        const newCol = col + j
        if (
          newRow >= 0 &&
          newRow < this.numRows &&
          newCol >= 0 &&
          newCol < this.numCols
        ) {
          if (this.board[newRow][newCol]) {
            count++
          }
        }
      }
    }
    return count
  }
}
