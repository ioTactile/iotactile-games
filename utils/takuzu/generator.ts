import { TileValues } from './constants'
import {
  arrayFromLength,
  countSubstrInStr,
  takeRandomIndexFromArray,
  getRandomNumber
} from './utils'
import type { TakuzuBoard } from './types'
import type { BoardSize } from './takuzu'

export const splitBoardIntoTiles = (
  board: TakuzuBoard[number]
): TakuzuBoard => {
  const splittedBoard: TakuzuBoard = []

  for (let i = 0; i < board.length; i++) {
    const splittedRow: TakuzuBoard[number] = []

    for (let j = 0; j < board.length; j++) {
      const value = board[i][j] as TakuzuBoard[number][number]
      splittedRow.push(value)
    }

    splittedBoard.push(splittedRow)
  }

  return splittedBoard
}

export const generateBoard = (boardSize: BoardSize): TakuzuBoard | null => {
  const board: TakuzuBoard[number] = []
  const cols = arrayFromLength(boardSize)
  let rows = generateRows(boardSize)

  let index: number
  let row: TakuzuBoard[number][number]

  for (let i = 0; i < boardSize; i++) {
    if (i > 1) {
      const nextRowPattern = defineNextRow(cols)
      const filteredRows = filteringRows(rows, nextRowPattern)

      index = getRandomNumber(filteredRows.length - 1)
      row = filteredRows[index]

      if (!row) return null
      index = rows.indexOf(row)
    } else {
      index = getRandomNumber(rows.length - 1)
      row = rows[index]
    }

    board.push(row)

    for (let j = 0; j < boardSize; j++) {
      cols[j] += row[j]
    }

    switch (index) {
      case 0:
        rows.splice(1)
        break
      case rows.length - 1:
        rows.pop()
        break
      default:
        rows = [...rows.slice(0, index), ...rows.slice(index + 1)]
        break
    }
  }

  return splitBoardIntoTiles(board)
}

export const generateRows = (boardSize: BoardSize): TakuzuBoard[number] => {
  const rows: TakuzuBoard[number] = []

  const max = 2 ** boardSize
  for (let i = 0; i < max; i++) {
    const str = i
      .toString(2)
      .padStart(boardSize, TileValues.ZERO)
      .toString() as TakuzuBoard[number][number]

    if (
      str.includes(TileValues.ZERO.repeat(3)) ||
      str.includes(TileValues.ONE.repeat(3)) ||
      countSubstrInStr(str, TileValues.ZERO) > boardSize / 2 ||
      countSubstrInStr(str, TileValues.ONE) > boardSize / 2
    )
      continue

    rows.push(str)
  }

  return rows
}

export const defineNextRow = (cols: string[]): string => {
  let nextRow = ''

  for (let i = 0; i < cols.length; i++) {
    if (cols[i].slice(-2) === TileValues.ZERO.repeat(2)) {
      nextRow += TileValues.ONE
    } else if (cols[i].slice(-2) === TileValues.ONE.repeat(2)) {
      nextRow += TileValues.ZERO
    } else if (countSubstrInStr(cols[i], TileValues.ZERO) === cols.length / 2) {
      nextRow += TileValues.ONE
    } else if (countSubstrInStr(cols[i], TileValues.ONE) === cols.length / 2) {
      nextRow += TileValues.ZERO
    } else {
      nextRow += TileValues.EMPTY
    }
  }

  return nextRow
}

export const filteringRows = (
  rows: TakuzuBoard[number],
  pattern: string
): TakuzuBoard[number] => {
  const filteredRows = rows.filter((row) => {
    let isNextRow = true
    for (let i = 0; i < rows.length; i++) {
      if (pattern[i] === TileValues.EMPTY) continue
      if (row.split('')[i] !== pattern[i]) {
        isNextRow = false
        break
      }
    }

    return isNextRow
  })

  return filteredRows
}

export const prepareBoard = (
  board: TakuzuBoard,
  fillFactor: number
): TakuzuBoard => {
  const preparedBoard = [...board]
  const boardSize = board.length
  const totalItemsInBoard = boardSize ** 2
  const numberOfItemsToFill = Math.floor(totalItemsInBoard * fillFactor)
  const numberOfEmptyItems = totalItemsInBoard - numberOfItemsToFill

  let currentNumberOfEmptyItems = 0

  while (numberOfEmptyItems !== currentNumberOfEmptyItems) {
    const rowIndex = takeRandomIndexFromArray(preparedBoard)
    const colIndex = takeRandomIndexFromArray(preparedBoard[rowIndex])

    if (preparedBoard[rowIndex][colIndex] === TileValues.EMPTY) continue
    preparedBoard[rowIndex][colIndex] = TileValues.EMPTY
    currentNumberOfEmptyItems++
  }

  return preparedBoard
}
