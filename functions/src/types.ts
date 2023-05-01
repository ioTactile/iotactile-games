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
  timer: number
  counter: number
  creationDate: Timestamp
}

export type DiceSessionScore = {
  playerOne?: Scores
  playerTwo?: Scores
  playerThree?: Scores
  playerFour?: Scores
}

export type Scores = {
  aces?: number
  two?: number
  three?: number
  four?: number
  five?: number
  six?: number
  subtotal?: number
  bonus?: number
  upperTotal?: number
  threeOfAKind?: number
  fourOfAKind?: number
  fullHouse?: number
  smallStraight?: number
  largeStraight?: number
  chance?: number
  dice?: number
  lowerTotal?: number
  total?: number
}
