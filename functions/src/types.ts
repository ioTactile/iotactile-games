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

export const diceSessionConverter = {
  toFirestore: (session: DiceSession): DocumentData => session,
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceSession>): DiceSession {
    return snapshot.data();
  },
};

export const diceScoreboardConverter = {
  toFirestore: (scoreboard: DiceScoreboard): DocumentData => scoreboard,
  fromFirestore(
      snapshot: QueryDocumentSnapshot<DiceScoreboard>
  ): DiceScoreboard {
    return snapshot.data();
  },
};

export const diceSessionPlayerTurnConverter = {
  toFirestore: (playerTurn: DiceSessionPlayerTurn): DocumentData => playerTurn,
  fromFirestore(
      snapshot: QueryDocumentSnapshot<DiceSessionPlayerTurn>
  ): DiceSessionPlayerTurn {
    return snapshot.data();
  },
};

export const diceSessionScoreConverter = {
  toFirestore: (score: DiceSessionScore): DocumentData => score,
  fromFirestore(
      snapshot: QueryDocumentSnapshot<DiceSessionScore>
  ): DiceSessionScore {
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
  remainingTurns: number
  diceOnBoard: number[]
  diceOnHand: number[]
  creationDate: Timestamp
}

export type DiceScoreboard = {
  userId: string
  username: string
  maxScore: number
  victories: number
  dice: number
}

export type DiceSessionPlayerTurn = {
  sessionId: string
  playerId: string
}

export type DiceSessionScore = {
  sessionId: string
  playerOne: {
    id: string
    one: number
    two: number
    three: number
    four: number
    five: number
    six: number
    bonus: number
    threeOfAKind: number
    fourOfAKind: number
    fullHouse: number
    smallStraight: number
    largeStraight: number
    chance: number
    dice: number
    total: number
  }
  playerTwo: {
    id: string
    one: number
    two: number
    three: number
    four: number
    five: number
    six: number
    bonus: number
    threeOfAKind: number
    fourOfAKind: number
    fullHouse: number
    smallStraight: number
    largeStraight: number
    chance: number
    dice: number
    total: number
  }
  playerThree?: {
    id: string
    one: number
    two: number
    three: number
    four: number
    five: number
    six: number
    bonus: number
    threeOfAKind: number
    fourOfAKind: number
    fullHouse: number
    smallStraight: number
    largeStraight: number
    chance: number
    dice: number
    total: number
  }
  playerFour?: {
    id: string
    one: number
    two: number
    three: number
    four: number
    five: number
    six: number
    bonus: number
    threeOfAKind: number
    fourOfAKind: number
    fullHouse: number
    smallStraight: number
    largeStraight: number
    chance: number
    dice: number
    total: number
  }
}
