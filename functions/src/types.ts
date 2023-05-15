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

export const diceSessionRemainingTurnsConverter = {
  toFirestore: (remainingTurns: DiceSessionRemainingTurns): DocumentData =>
    remainingTurns,
  fromFirestore(
      snapshot: QueryDocumentSnapshot<DiceSessionRemainingTurns>
  ): DiceSessionRemainingTurns {
    return snapshot.data();
  },
};

export const diceSessionDicesConverter = {
  toFirestore: (dices: DiceSessionDices): DocumentData => dices,
  fromFirestore(
      snapshot: QueryDocumentSnapshot<DiceSessionDices>
  ): DiceSessionDices {
    return snapshot.data();
  },
};

export const diceSessionPlayerTriesConverter = {
  toFirestore: (playerTries: DiceSessionPlayerTries): DocumentData =>
    playerTries,
  fromFirestore(
      snapshot: QueryDocumentSnapshot<DiceSessionPlayerTries>
  ): DiceSessionPlayerTries {
    return snapshot.data();
  },
};

export const diceSessionChatConverter = {
  toFirestore: (chat: DiceSessionChat): DocumentData => chat,
  fromFirestore(
      snapshot: QueryDocumentSnapshot<DiceSessionChat>
  ): DiceSessionChat {
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
  diceOnBoard: number[]
  diceOnHand: number[]
}

export type DiceSessionPlayerTries = {
  id: string
  tries: number
}

export type DiceSessionChat = {
  id: string
  messages?: {
    username: string
    message: string
  }[]
}

export type DiceScoreboard = {
  userId: string
  username: string
  games: number
  maxScore: number
  victories: number
  dice: number
}


export type DiceSessionScore = {
  id: string
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
