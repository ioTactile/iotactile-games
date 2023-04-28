import {
  DocumentData,
  QueryDocumentSnapshot,
  Timestamp,
} from "firebase-admin/firestore";

export {Timestamp};

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

export const sessionConverter = {
  toFirestore: (session: Session): DocumentData => session,
  fromFirestore(snapshot: QueryDocumentSnapshot<Session>): Session {
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

export type Session = {
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
