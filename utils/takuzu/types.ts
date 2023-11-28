import { TileValues } from './constants'

export type TakuzuCheckErrorType = 'duplicate' | 'balance' | 'triple'

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

export type TakuzuBoard = (typeof TileValues)[keyof typeof TileValues][][]

export type TileValues = (typeof TileValues)[keyof typeof TileValues]
