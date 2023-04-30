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
  isFull: boolean
  isStarted: boolean
  isFinished: boolean
  creationDate: Timestamp
}
