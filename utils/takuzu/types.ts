import { CellValues } from './constants'

export type GameStatus = 'waiting' | 'inProgress' | 'won' | 'lost'

export type BoardSize = 6 | 8 | 10 | 12

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

export type TakuzuCheckErrorType = 'duplicate' | 'balance' | 'triple'

export type GameOptions = {
  boardSize: BoardSize
  difficulty: Difficulty
}

export type TakuzuCheckResult =
  | {
      error: false
    }
  | {
      error: true
      type: TakuzuCheckErrorType
      message: string
      position: string[]
    }

export type TakuzuBoard = (typeof CellValues)[keyof typeof CellValues][][]

export type CellValues = (typeof CellValues)[keyof typeof CellValues]
