import { QueryDocumentSnapshot, Timestamp as FirestoreTimestamp } from '@firebase/firestore';
import type { FirestoreDataConverter } from '@firebase/firestore';
import type {
  User,
  DiceSession,
  DiceScoreboard,
  DiceSessionPlayerTurn,
  DiceSessionRemainingTurns,
  DiceSessionDices,
  DiceSessionPlayerTries,
  DiceSessionChat,
  DiceSessionScores,
  LinguaVaultWords,
  LinguaVaultSession,
  LinguaVaultScoreboard,
  LinguaVaultSessionRemainingTurns,
  LinguaVaultSessionPlayerTurn,
  LinguaVaultSessionWords,
  MineSweeperScoreboard,
  TakuzuScoreboard,
  Game2048Scoreboard,
} from '~/types/models';

type NestedTypeMapper<T, I, O> = T extends I
  ? O
  : {
      [Property in keyof T]: T[Property] extends Date | FirestoreTimestamp
        ? T[Property] extends I
          ? O
          : T[Property]
        : NestedTypeMapper<T[Property], I, O>;
    };

type DatabaseUserType = NestedTypeMapper<User, Date, FirestoreTimestamp>;
/** Domain user (Date fields). Alias kept for existing imports. */
export type LocalUserType = User;
export const userConverter: FirestoreDataConverter<LocalUserType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseUserType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
      updateDate: data.updateDate.toDate(),
    };
  },
};

type DatabaseDiceSessionType = NestedTypeMapper<DiceSession, Date, FirestoreTimestamp>;
export type LocalDiceSessionType = DiceSession;
export const diceSessionConverter: FirestoreDataConverter<LocalDiceSessionType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseDiceSessionType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
    };
  },
};

type DatabaseDiceScoreboardType = NestedTypeMapper<DiceScoreboard, Date, FirestoreTimestamp>;
export type LocalDiceScoreboardType = DiceScoreboard;
export const diceScoreboardConverter: FirestoreDataConverter<LocalDiceScoreboardType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseDiceScoreboardType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      userId: snapshot.id,
    };
  },
};

type DatabaseDiceSessionPlayerTurnType = NestedTypeMapper<
  DiceSessionPlayerTurn,
  Date,
  FirestoreTimestamp
>;
export type LocalDiceSessionPlayerTurnType = DiceSessionPlayerTurn;
export const diceSessionPlayerTurnConverter: FirestoreDataConverter<LocalDiceSessionPlayerTurnType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionPlayerTurnType>,
      options,
    ) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseDiceSessionRemainingTurnsType = NestedTypeMapper<
  DiceSessionRemainingTurns,
  Date,
  FirestoreTimestamp
>;
export type LocalDiceSessionRemainingTurnsType = DiceSessionRemainingTurns;
export const diceSessionRemainingTurnsConverter: FirestoreDataConverter<LocalDiceSessionRemainingTurnsType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionRemainingTurnsType>,
      options,
    ) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseDiceSessionDicesType = NestedTypeMapper<DiceSessionDices, Date, FirestoreTimestamp>;
export type LocalDiceSessionDicesType = DiceSessionDices;
export const diceSessionDicesConverter: FirestoreDataConverter<LocalDiceSessionDicesType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseDiceSessionDicesType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

type DatabaseDiceSessionPlayerTriesType = NestedTypeMapper<
  DiceSessionPlayerTries,
  Date,
  FirestoreTimestamp
>;
export type LocalDiceSessionPlayerTriesType = DiceSessionPlayerTries;
export const diceSessionPlayerTriesConverter: FirestoreDataConverter<LocalDiceSessionPlayerTriesType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionPlayerTriesType>,
      options,
    ) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseDiceSessionChatType = NestedTypeMapper<DiceSessionChat, Date, FirestoreTimestamp>;
export type LocalDiceSessionChatType = DiceSessionChat;
export const diceSessionChatConverter: FirestoreDataConverter<LocalDiceSessionChatType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseDiceSessionChatType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

type DatabaseDiceSessionScoresType = NestedTypeMapper<DiceSessionScores, Date, FirestoreTimestamp>;
export type LocalDiceSessionScoresType = DiceSessionScores;
export const diceSessionScoresConverter: FirestoreDataConverter<LocalDiceSessionScoresType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseDiceSessionScoresType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate ? data.creationDate.toDate() : undefined,
    };
  },
};

type DatabaseLinguaVaultWordsType = NestedTypeMapper<LinguaVaultWords, Date, FirestoreTimestamp>;
export type LocalLinguaVaultWordsType = LinguaVaultWords;
export const linguaVaultWordsConverter: FirestoreDataConverter<LocalLinguaVaultWordsType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseLinguaVaultWordsType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
    };
  },
};

type DatabaseLinguaVaultSessionType = NestedTypeMapper<
  LinguaVaultSession,
  Date,
  FirestoreTimestamp
>;
export type LocalLinguaVaultSessionType = LinguaVaultSession;
export const linguaVaultSessionConverter: FirestoreDataConverter<LocalLinguaVaultSessionType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseLinguaVaultSessionType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
    };
  },
};

type DatabaseLinguaVaultScoreboardType = NestedTypeMapper<
  LinguaVaultScoreboard,
  Date,
  FirestoreTimestamp
>;
export type LocalLinguaVaultScoreboardType = LinguaVaultScoreboard;
export const linguaVaultScoreboardConverter: FirestoreDataConverter<LocalLinguaVaultScoreboardType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseLinguaVaultScoreboardType>,
      options,
    ) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseLinguaVaultSessionRemainingTurnsType = NestedTypeMapper<
  LinguaVaultSessionRemainingTurns,
  Date,
  FirestoreTimestamp
>;
export type LocalLinguaVaultSessionRemainingTurnsType = LinguaVaultSessionRemainingTurns;
export const linguaVaultSessionRemainingTurnsConverter: FirestoreDataConverter<LocalLinguaVaultSessionRemainingTurnsType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseLinguaVaultSessionRemainingTurnsType>,
      options,
    ) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseLinguaVaultSessionPlayerTurnType = NestedTypeMapper<
  LinguaVaultSessionPlayerTurn,
  Date,
  FirestoreTimestamp
>;
export type LocalLinguaVaultSessionPlayerTurnType = LinguaVaultSessionPlayerTurn;
export const linguaVaultSessionPlayerTurnConverter: FirestoreDataConverter<LocalLinguaVaultSessionPlayerTurnType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseLinguaVaultSessionPlayerTurnType>,
      options,
    ) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseLinguaVaultSessionWordsType = NestedTypeMapper<
  LinguaVaultSessionWords,
  Date,
  FirestoreTimestamp
>;
export type LocalLinguaVaultSessionWordsType = LinguaVaultSessionWords;
export const linguaVaultSessionWordsConverter: FirestoreDataConverter<LocalLinguaVaultSessionWordsType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseLinguaVaultSessionWordsType>,
      options,
    ) => {
      const data = snapshot.data(options);
      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseMineSweeperSessionScoresType = NestedTypeMapper<
  MineSweeperScoreboard,
  Date,
  FirestoreTimestamp
>;
export type LocalMineSweeperScoreboardType = MineSweeperScoreboard;
export const mineSweeperScoreboardConverter: FirestoreDataConverter<LocalMineSweeperScoreboardType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseMineSweeperSessionScoresType>,
      options,
    ) => {
      const data = snapshot.data(options);
      return {
        ...data,
        userId: snapshot.id,
        beginner: {
          ...data.beginner,
          victoryDate: data.beginner.victoryDate.toDate(),
        },
        intermediate: {
          ...data.intermediate,
          victoryDate: data.intermediate.victoryDate.toDate(),
        },
        expert: {
          ...data.expert,
          victoryDate: data.expert.victoryDate.toDate(),
        },
        custom: data.custom.map((customVictory) => ({
          ...customVictory,
          victoryDate: customVictory.victoryDate.toDate(),
        })),
      };
    },
  };

type DatabaseTakuzuSessionScoresType = NestedTypeMapper<TakuzuScoreboard, Date, FirestoreTimestamp>;
export type LocalTakuzuScoreboardType = TakuzuScoreboard;
export const takuzuScoreboardConverter: FirestoreDataConverter<LocalTakuzuScoreboardType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseTakuzuSessionScoresType>, options) => {
    const data = snapshot.data(options);

    return {
      ...data,
      userId: snapshot.id,
      sixBySix: {
        easy: {
          ...data.sixBySix.easy,
          victoryDate: data.sixBySix.easy.victoryDate.toDate(),
        },
        medium: {
          ...data.sixBySix.medium,
          victoryDate: data.sixBySix.medium.victoryDate.toDate(),
        },
        hard: {
          ...data.sixBySix.hard,
          victoryDate: data.sixBySix.hard.victoryDate.toDate(),
        },
        expert: {
          ...data.sixBySix.expert,
          victoryDate: data.sixBySix.expert.victoryDate.toDate(),
        },
      },
      eightByEight: {
        easy: {
          ...data.eightByEight.easy,
          victoryDate: data.eightByEight.easy.victoryDate.toDate(),
        },
        medium: {
          ...data.eightByEight.medium,
          victoryDate: data.eightByEight.medium.victoryDate.toDate(),
        },
        hard: {
          ...data.eightByEight.hard,
          victoryDate: data.eightByEight.hard.victoryDate.toDate(),
        },
        expert: {
          ...data.eightByEight.expert,
          victoryDate: data.eightByEight.expert.victoryDate.toDate(),
        },
      },
      tenByTen: {
        easy: {
          ...data.tenByTen.easy,
          victoryDate: data.tenByTen.easy.victoryDate.toDate(),
        },
        medium: {
          ...data.tenByTen.medium,
          victoryDate: data.tenByTen.medium.victoryDate.toDate(),
        },
        hard: {
          ...data.tenByTen.hard,
          victoryDate: data.tenByTen.hard.victoryDate.toDate(),
        },
        expert: {
          ...data.tenByTen.expert,
          victoryDate: data.tenByTen.expert.victoryDate.toDate(),
        },
      },
      twelveByTwelve: {
        easy: {
          ...data.twelveByTwelve.easy,
          victoryDate: data.twelveByTwelve.easy.victoryDate.toDate(),
        },
        medium: {
          ...data.twelveByTwelve.medium,
          victoryDate: data.twelveByTwelve.medium.victoryDate.toDate(),
        },
        hard: {
          ...data.twelveByTwelve.hard,
          victoryDate: data.twelveByTwelve.hard.victoryDate.toDate(),
        },
        expert: {
          ...data.twelveByTwelve.expert,
          victoryDate: data.twelveByTwelve.expert.victoryDate.toDate(),
        },
      },
    };
  },
};

type DatabaseGame2048ScoreboardType = NestedTypeMapper<
  Game2048Scoreboard,
  Date,
  FirestoreTimestamp
>;
export type LocalGame2048ScoreboardType = Game2048Scoreboard;
export const game2048ScoreboardConverter: FirestoreDataConverter<LocalGame2048ScoreboardType> = {
  toFirestore: (item) => item,
  fromFirestore: (snapshot: QueryDocumentSnapshot<DatabaseGame2048ScoreboardType>, options) => {
    const data = snapshot.data(options);
    return {
      ...data,
      userId: snapshot.id,
      lastPlayedAt: data.lastPlayedAt.toDate(),
    };
  },
};
