import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp
} from 'firebase-admin/firestore'

export { Timestamp }

export const userConverter = {
  toFirestore: (user: User): DocumentData => user,
  fromFirestore(snapshot: QueryDocumentSnapshot<User>): User {
    return snapshot.data()
  }
}

// Dice

export type CardUser = {
  id: string
  username: string
}

export type Dice = {
  id: number
  face: number
  isOnBoard: boolean
}

export const diceSessionConverter = {
  toFirestore: (session: DiceSession): DocumentData => session,
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceSession>): DiceSession {
    return snapshot.data()
  }
}

export const diceScoreboardConverter = {
  toFirestore: (scoreboard: DiceScoreboard): DocumentData => scoreboard,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DiceScoreboard>
  ): DiceScoreboard {
    return snapshot.data()
  }
}

export const diceSessionPlayerTurnConverter = {
  toFirestore: (playerTurn: DiceSessionPlayerTurn): DocumentData => playerTurn,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DiceSessionPlayerTurn>
  ): DiceSessionPlayerTurn {
    return snapshot.data()
  }
}

export const diceSessionRemainingTurnsConverter = {
  toFirestore: (remainingTurns: DiceSessionRemainingTurns): DocumentData =>
    remainingTurns,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DiceSessionRemainingTurns>
  ): DiceSessionRemainingTurns {
    return snapshot.data()
  }
}

export const diceSessionDicesConverter = {
  toFirestore: (dices: DiceSessionDices): DocumentData => dices,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DiceSessionDices>
  ): DiceSessionDices {
    return snapshot.data()
  }
}

export const diceSessionPlayerTriesConverter = {
  toFirestore: (playerTries: DiceSessionPlayerTries): DocumentData =>
    playerTries,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DiceSessionPlayerTries>
  ): DiceSessionPlayerTries {
    return snapshot.data()
  }
}

export const diceSessionChatConverter = {
  toFirestore: (chat: DiceSessionChat): DocumentData => chat,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DiceSessionChat>
  ): DiceSessionChat {
    return snapshot.data()
  }
}

export const diceSessionScoresConverter = {
  toFirestore: (score: DiceSessionScores): DocumentData => score,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DiceSessionScores>
  ): DiceSessionScores {
    return snapshot.data()
  }
}

export type User = {
  id: string
  email: string
  username: string
  role?: { admin: true }
  creationDate: Timestamp
  updateDate: Timestamp
}

export type DiceSession = {
  id: string
  name: string
  players: CardUser[]
  isFull: boolean
  isStarted: boolean
  isFinished: boolean
  creationDate: Timestamp
}

export type DiceSessionPlayerTurn = {
  id: string
  playerId: string
}

export type DiceSessionRemainingTurns = {
  id: string
  remainingTurns: number
}

export type DiceSessionDices = {
  id: string
  dices: Dice[]
}

export type DiceSessionPlayerTries = {
  id: string
  tries: number
}

export type DiceSessionChat = {
  id: string
  messages?: {
    index: number
    username: string
    content: string
  }[]
}

export type DiceScoreboard = {
  userId: string
  username: string
  games: number
  maxScore: number
  averageScore: number
  totalScore: number
  victories: number
  dice: number
}

export type DiceSessionScores = {
  id: string
  playerOne: {
    id: string
    one: number | null
    two: number | null
    three: number | null
    four: number | null
    five: number | null
    six: number | null
    bonus: number
    threeOfAKind: number | null
    fourOfAKind: number | null
    fullHouse: number | null
    smallStraight: number | null
    largeStraight: number | null
    chance: number | null
    dice: number | null
    total: number
  }
  playerTwo?: {
    id: string
    one: number | null
    two: number | null
    three: number | null
    four: number | null
    five: number | null
    six: number | null
    bonus: number
    threeOfAKind: number | null
    fourOfAKind: number | null
    fullHouse: number | null
    smallStraight: number | null
    largeStraight: number | null
    chance: number | null
    dice: number | null
    total: number
  }
  playerThree?: {
    id: string
    one: number | null
    two: number | null
    three: number | null
    four: number | null
    five: number | null
    six: number | null
    bonus: number
    threeOfAKind: number | null
    fourOfAKind: number | null
    fullHouse: number | null
    smallStraight: number | null
    largeStraight: number | null
    chance: number | null
    dice: number | null
    total: number
  }
  playerFour?: {
    id: string
    one: number | null
    two: number | null
    three: number | null
    four: number | null
    five: number | null
    six: number | null
    bonus: number
    threeOfAKind: number | null
    fourOfAKind: number | null
    fullHouse: number | null
    smallStraight: number | null
    largeStraight: number | null
    chance: number | null
    dice: number | null
    total: number
  }
  creationDate?: Timestamp
}

// Lingua Vault

export type Word = {
  id: number
  word: string
  difficulty: number
}

export const linguaVaultWordsConverter = {
  toFirestore: (word: Word): DocumentData => word,
  fromFirestore(snapshot: QueryDocumentSnapshot<Word>): Word {
    return snapshot.data()
  }
}

export const linguaVaultSessionConverter = {
  toFirestore: (session: LinguaVaultSession): DocumentData => session,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<LinguaVaultSession>
  ): LinguaVaultSession {
    return snapshot.data()
  }
}

export const linguaVaultSessionWordsConverter = {
  toFirestore: (sessionWords: LinguaVaultSessionWords): DocumentData =>
    sessionWords,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<LinguaVaultSessionWords>
  ): LinguaVaultSessionWords {
    return snapshot.data()
  }
}

export const linguaVaultSessionRemainingTurnsConverter = {
  toFirestore: (
    remainingTurns: LinguaVaultSessionRemainingTurns
  ): DocumentData => remainingTurns,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<LinguaVaultSessionRemainingTurns>
  ): LinguaVaultSessionRemainingTurns {
    return snapshot.data()
  }
}

export const linguaVaultSessionPlayerTurnConverter = {
  toFirestore: (playerTurn: LinguaVaultSessionPlayerTurn): DocumentData =>
    playerTurn,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<LinguaVaultSessionPlayerTurn>
  ): LinguaVaultSessionPlayerTurn {
    return snapshot.data()
  }
}

export const linguaVaultScoreboardConverter = {
  toFirestore: (scoreboard: LinguaVaultScoreboard): DocumentData => scoreboard,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<LinguaVaultScoreboard>
  ): LinguaVaultScoreboard {
    return snapshot.data()
  }
}

export type LinguaVaultSession = {
  id: string
  playerOne: {
    id: string
    username: string
    isFinder: boolean
  }
  playerTwo?: {
    id: string
    username: string
    isFinder: boolean
  }
  isFull: boolean
  isStarted: boolean
  isFinished: boolean
  isRoundFinished: boolean
  isPlayerOneContinue: boolean | null
  isPlayerTwoContinue: boolean | null
  creationDate: Timestamp
}

export type LinguaVaultSessionWords = {
  id: string
  words: Word[]
  testedWords: string[] | null
  clues: string[] | null
}

export type LinguaVaultSessionRemainingTurns = {
  id: string
  remainingTurns: number
}

export type LinguaVaultSessionPlayerTurn = {
  id: string
  playerId: string
}

export type LinguaVaultWords = {
  id: string
  words: Word[]
}

export type LinguaVaultScoreboard = {
  userId: string
  username: string
  rounds: number
  roundsWon: number
  scoreToGuess: number
  scoreToPropose: number
}

// Mine Sweeper

export const mineSweeperScoreboardConverter = {
  toFirestore: (scoreboard: MineSweeperScoreboard): DocumentData => scoreboard,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<MineSweeperScoreboard>
  ): MineSweeperScoreboard {
    return snapshot.data()
  }
}

export type CustomVictory = {
  rows: number
  cols: number
  mines: number
  victories: number
  bestTime: number
  victoryDate: Timestamp
}

export type MineSweeperVictory = {
  victories: number
  bestTime: number
  victoryDate: Timestamp
}

export type MineSweeperScoreboard = {
  userId: string
  username: string
  beginner: MineSweeperVictory
  intermediate: MineSweeperVictory
  expert: MineSweeperVictory
  custom: CustomVictory[]
}

// Takuzu

export const takuzuScoreboardConverter = {
  toFirestore: (scoreboard: TakuzuScoreboard): DocumentData => scoreboard,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<TakuzuScoreboard>
  ): TakuzuScoreboard {
    return snapshot.data()
  }
}

export type TakuzuVictory = {
  victories: number
  bestTime: number
}

export type TakuzuScoreboard = {
  userId: string
  username: string
  sixBySix: {
    easy: TakuzuVictory
    medium: TakuzuVictory
    hard: TakuzuVictory
    expert: TakuzuVictory
  }
  eightByEight: {
    easy: TakuzuVictory
    medium: TakuzuVictory
    hard: TakuzuVictory
    expert: TakuzuVictory
  }
  tenByTen: {
    easy: TakuzuVictory
    medium: TakuzuVictory
    hard: TakuzuVictory
    expert: TakuzuVictory
  }
  twelveByTwelve: {
    easy: TakuzuVictory
    medium: TakuzuVictory
    hard: TakuzuVictory
    expert: TakuzuVictory
  }
}
