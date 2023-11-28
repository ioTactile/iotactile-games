import { TileValues, ERRORS } from './constants'
import { countSubstrInStr } from './utils'
import type { TakuzuCheckErrorType, TakuzuCheckResult } from './types'

export const checkBoard = (board: string[][]): TakuzuCheckResult => {
  const rows: string[] = []
  const cols: string[] = []

  for (let i = 0; i < board.length; i++) {
    const row = board[i].join('')
    let col = ''

    for (let j = 0; j < board.length; j++) {
      col += board[i][j]
    }

    rows.push(row)
    cols.push(col)
  }

  const duplicatedRows = checkDuplication(rows, 'row')
  if (duplicatedRows.length > 0) {
    return createCheckerError('duplicate', ERRORS.DUPLICATE, duplicatedRows)
  }

  const duplicatedCols = checkDuplication(cols, 'col')
  if (duplicatedCols.length > 0) {
    return createCheckerError('duplicate', ERRORS.DUPLICATE, duplicatedCols)
  }

  for (let i = 0; i < rows.length; i++) {
    const isNotTripled = checkNotTriple(rows[i])
    if (!isNotTripled)
      return createCheckerError('triple', ERRORS.TRIPLE, [`row-${i}`])

    const isBalanced = checkBalance(rows[i])
    if (!isBalanced)
      return createCheckerError('balance', ERRORS.BALANCE, [`row-${i}`])
  }

  for (let i = 0; i < cols.length; i++) {
    const isNotTripled = checkNotTriple(cols[i])
    if (!isNotTripled)
      return createCheckerError('triple', ERRORS.TRIPLE, [`col-${i}`])

    const isBalanced = checkBalance(cols[i])
    if (!isBalanced)
      return createCheckerError('balance', ERRORS.BALANCE, [`col-${i}`])
  }

  return { error: false }
}

const checkBalance = (line: string): boolean => {
  const zeros = countSubstrInStr(line, TileValues.ZERO)
  const ones = countSubstrInStr(line, TileValues.ONE)

  const balanced = zeros === ones
  return balanced
}

const checkNotTriple = (line: string): boolean => {
  const tripleZeros = line.includes(TileValues.ZERO.repeat(3))
  const tripleOnes = line.includes(TileValues.ONE.repeat(3))

  const triple = tripleZeros || tripleOnes
  return !triple
}

const checkDuplication = (lines: string[], type: 'row' | 'col'): string[] => {
  const position = []

  for (let i = 0; i < lines.length; i++) {
    for (let j = i + 1; j < lines.length; j++) {
      if (lines[i] === lines[j]) {
        position.push(`${type}-${i}, ${type}-${j}`)
      }
    }

    if (position.length) break
  }

  return position
}

const createCheckerError = (
  type: TakuzuCheckErrorType,
  message: string,
  position: string[]
): TakuzuCheckResult => {
  return {
    error: true,
    type,
    message,
    position
  }
}
