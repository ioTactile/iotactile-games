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
  isFull: boolean
  isStarted: boolean
  isFinished: boolean
  timer: number
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
  sessionId: string
  playerOne: {
    id: string
    scores: Scores
  }
  playerTwo: {
    id: string
    scores: Scores
  }
  playerThree?: {
    id: string
    scores: Scores
  }
  playerFour?: {
    id: string
    scores: Scores
  }
}

export type Scores = {
  one: number
  two: number
  three: number
  four: number
  five: number
  six: number
  subtotal: number
  upperTotal: number
  threeOfAKind: number
  fourOfAKind: number
  fullHouse: number
  smallStraight: number
  largeStraight: number
  chance: number
  dice: number
  lowerTotal: number
  total: number
}
