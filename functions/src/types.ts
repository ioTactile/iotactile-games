import { DocumentData, QueryDocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

export { Timestamp };
export type {
  CardUser,
  CustomVictory,
  Dice,
  DiceScoreboard,
  DiceSession,
  DiceSessionChat,
  DiceSessionDices,
  DiceSessionPlayerTries,
  DiceSessionPlayerTurn,
  DiceSessionRemainingTurns,
  DiceSessionScores,
  LinguaVaultScoreboard,
  LinguaVaultSession,
  LinguaVaultSessionPlayerTurn,
  LinguaVaultSessionRemainingTurns,
  LinguaVaultSessionWords,
  LinguaVaultWords,
  MineSweeperScoreboard,
  MineSweeperVictory,
  TakuzuScoreboard,
  TakuzuVictory,
  User,
  Word,
} from '../../types/models.js';

import type {
  DiceScoreboard,
  DiceSession,
  DiceSessionChat,
  DiceSessionDices,
  DiceSessionPlayerTries,
  DiceSessionPlayerTurn,
  DiceSessionRemainingTurns,
  DiceSessionScores,
  LinguaVaultScoreboard,
  LinguaVaultSession,
  LinguaVaultSessionPlayerTurn,
  LinguaVaultSessionRemainingTurns,
  LinguaVaultSessionWords,
  MineSweeperScoreboard,
  TakuzuScoreboard,
  User,
  Word,
} from '../../types/models.js';

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
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceScoreboard>): DiceScoreboard {
    return snapshot.data();
  },
};

export const diceSessionPlayerTurnConverter = {
  toFirestore: (playerTurn: DiceSessionPlayerTurn): DocumentData => playerTurn,
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceSessionPlayerTurn>): DiceSessionPlayerTurn {
    return snapshot.data();
  },
};

export const diceSessionRemainingTurnsConverter = {
  toFirestore: (remainingTurns: DiceSessionRemainingTurns): DocumentData => remainingTurns,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<DiceSessionRemainingTurns>,
  ): DiceSessionRemainingTurns {
    return snapshot.data();
  },
};

export const diceSessionDicesConverter = {
  toFirestore: (dices: DiceSessionDices): DocumentData => dices,
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceSessionDices>): DiceSessionDices {
    return snapshot.data();
  },
};

export const diceSessionPlayerTriesConverter = {
  toFirestore: (playerTries: DiceSessionPlayerTries): DocumentData => playerTries,
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceSessionPlayerTries>): DiceSessionPlayerTries {
    return snapshot.data();
  },
};

export const diceSessionChatConverter = {
  toFirestore: (chat: DiceSessionChat): DocumentData => chat,
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceSessionChat>): DiceSessionChat {
    return snapshot.data();
  },
};

export const diceSessionScoresConverter = {
  toFirestore: (score: DiceSessionScores): DocumentData => score,
  fromFirestore(snapshot: QueryDocumentSnapshot<DiceSessionScores>): DiceSessionScores {
    return snapshot.data();
  },
};

export const linguaVaultWordsConverter = {
  toFirestore: (word: Word): DocumentData => word,
  fromFirestore(snapshot: QueryDocumentSnapshot<Word>): Word {
    return snapshot.data();
  },
};

export const linguaVaultSessionConverter = {
  toFirestore: (session: LinguaVaultSession): DocumentData => session,
  fromFirestore(snapshot: QueryDocumentSnapshot<LinguaVaultSession>): LinguaVaultSession {
    return snapshot.data();
  },
};

export const linguaVaultSessionWordsConverter = {
  toFirestore: (sessionWords: LinguaVaultSessionWords): DocumentData => sessionWords,
  fromFirestore(snapshot: QueryDocumentSnapshot<LinguaVaultSessionWords>): LinguaVaultSessionWords {
    return snapshot.data();
  },
};

export const linguaVaultSessionRemainingTurnsConverter = {
  toFirestore: (remainingTurns: LinguaVaultSessionRemainingTurns): DocumentData => remainingTurns,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<LinguaVaultSessionRemainingTurns>,
  ): LinguaVaultSessionRemainingTurns {
    return snapshot.data();
  },
};

export const linguaVaultSessionPlayerTurnConverter = {
  toFirestore: (playerTurn: LinguaVaultSessionPlayerTurn): DocumentData => playerTurn,
  fromFirestore(
    snapshot: QueryDocumentSnapshot<LinguaVaultSessionPlayerTurn>,
  ): LinguaVaultSessionPlayerTurn {
    return snapshot.data();
  },
};

export const linguaVaultScoreboardConverter = {
  toFirestore: (scoreboard: LinguaVaultScoreboard): DocumentData => scoreboard,
  fromFirestore(snapshot: QueryDocumentSnapshot<LinguaVaultScoreboard>): LinguaVaultScoreboard {
    return snapshot.data();
  },
};

export const mineSweeperScoreboardConverter = {
  toFirestore: (scoreboard: MineSweeperScoreboard): DocumentData => scoreboard,
  fromFirestore(snapshot: QueryDocumentSnapshot<MineSweeperScoreboard>): MineSweeperScoreboard {
    return snapshot.data();
  },
};

export const takuzuScoreboardConverter = {
  toFirestore: (scoreboard: TakuzuScoreboard): DocumentData => scoreboard,
  fromFirestore(snapshot: QueryDocumentSnapshot<TakuzuScoreboard>): TakuzuScoreboard {
    return snapshot.data();
  },
};
