import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";

export {Timestamp};

export type CardUser = {
  id: string
  username: string
}

export const userConverter = {
  toFirestore: (user: User): DocumentData => user,
  fromFirestore(snapshot: QueryDocumentSnapshot<User>): User {
    return snapshot.data();
  },
};

export const wordConverter = {
  toFirestore: (word: Word): DocumentData => word,
  fromFirestore(snapshot: QueryDocumentSnapshot<Word>): Word {
    return snapshot.data();
  },
};

export const lvSessionConverter = {
  toFirestore: (session: LvSession): DocumentData => session,
  fromFirestore(snapshot: QueryDocumentSnapshot<LvSession>): LvSession {
    return snapshot.data();
  },
};

export const diceSessionConverter = {
  toFirestore: (session: DiceSession): DocumentData => session,
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceSession>): DiceSession {
    return snapshot.data();
  },
};

export type User = {
  id: string
  email: string
  username: string
  creationDate: Timestamp
  updateDate: Timestamp
}

export type Word = {
  id: string
  word: string
}

export type LvSession = {
  id: string
  word?: string
  playerOne?: string
  playerTwo?: string
  playerOneScore?: number
  playerTwoScore?: number
  isFull: boolean
  isStarted: boolean
  isFinished: boolean
  creationDate: Timestamp
}

export type DiceSession = {
  id: string
  players: CardUser[]
  messages?: {
    username: string
    message: string
  }[]
  scores?: DiceSessionScore
  isFull: boolean
  isStarted: boolean
  isFinished: boolean
  remainingTurns: number
  diceOnBoard: number[]
  diceOnHand: number[]
  playerTries: number
  creationDate: Timestamp
}

export type DiceSessionPlayerTurn = {
  sessionId: string
  playerId: string
}

export type DiceSessionScore = {
  playerOne: Scores
  playerTwo: Scores
  playerThree?: Scores
  playerFour?: Scores
}

export type Scores = {
  aces: number|null
  two: number|null
  three: number|null
  four: number|null
  five: number|null
  six: number|null
  subtotal: number|null
  bonus: number|null
  upperTotal: number|null
  threeOfAKind: number|null
  fourOfAKind: number|null
  fullHouse: number|null
  smallStraight: number|null
  largeStraight: number|null
  chance: number|null
  dice: number|null
  lowerTotal: number|null
  total: number|null
}
