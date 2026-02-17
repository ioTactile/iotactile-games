import {
  QueryDocumentSnapshot,
  Timestamp as FirestoreTimestamp,
} from "@firebase/firestore";
import type { FirestoreDataConverter } from "@firebase/firestore";
import { Timestamp } from "~/functions/src/types";
import type {
  DiceSession,
  DiceScoreboard,
  DiceSessionPlayerTurn,
  DiceSessionRemainingTurns,
  DiceSessionDices,
  DiceSessionPlayerTries,
  DiceSessionChat,
  DiceSessionScores,
} from "~/functions/src/types";

type NestedTypeMapper<T, I, O> = T extends I
  ? O
  : {
      [Property in keyof T]: T[Property] extends
        | Date
        | FirestoreTimestamp
        | Timestamp
        ? T[Property] extends I
          ? O
          : T[Property]
        : NestedTypeMapper<T[Property], I, O>;
    };

type DatabaseDiceSessionType = NestedTypeMapper<
  DiceSession,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalDiceSessionType = NestedTypeMapper<
  DiceSession,
  Timestamp,
  Date
>;

export const diceSessionConverter: FirestoreDataConverter<LocalDiceSessionType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionType>,
      options,
    ) => {
      const data = snapshot.data(options);

      return {
        ...data,
        id: snapshot.id,
        creationDate: data.creationDate.toDate(),
      };
    },
  };

type DatabaseDiceScoreboardType = NestedTypeMapper<
  DiceScoreboard,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalDiceScoreboardType = NestedTypeMapper<
  DiceScoreboard,
  Timestamp,
  Date
>;

export const diceScoreboardConverter: FirestoreDataConverter<LocalDiceScoreboardType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceScoreboardType>,
      options,
    ) => {
      const data = snapshot.data(options);

      return {
        ...data,
        userId: snapshot.id,
      };
    },
  };

type DatabaseDiceSessionPlayerTurnType = NestedTypeMapper<
  DiceSessionPlayerTurn,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalDiceSessionPlayerTurnType = NestedTypeMapper<
  DiceSessionPlayerTurn,
  Timestamp,
  Date
>;

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
  Timestamp,
  FirestoreTimestamp
>;
export type LocalDiceSessionRemainingTurnsType = NestedTypeMapper<
  DiceSessionRemainingTurns,
  Timestamp,
  Date
>;

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

type DatabaseDiceSessionDicesType = NestedTypeMapper<
  DiceSessionDices,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalDiceSessionDicesType = NestedTypeMapper<
  DiceSessionDices,
  Timestamp,
  Date
>;

export const diceSessionDicesConverter: FirestoreDataConverter<LocalDiceSessionDicesType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionDicesType>,
      options,
    ) => {
      const data = snapshot.data(options);

      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseDiceSessionPlayerTriesType = NestedTypeMapper<
  DiceSessionPlayerTries,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalDiceSessionPlayerTriesType = NestedTypeMapper<
  DiceSessionPlayerTries,
  Timestamp,
  Date
>;

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

type DatabaseDiceSessionChatType = NestedTypeMapper<
  DiceSessionChat,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalDiceSessionChatType = NestedTypeMapper<
  DiceSessionChat,
  Timestamp,
  Date
>;

export const diceSessionChatConverter: FirestoreDataConverter<LocalDiceSessionChatType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionChatType>,
      options,
    ) => {
      const data = snapshot.data(options);

      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseDiceSessionScoresType = NestedTypeMapper<
  DiceSessionScores,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalDiceSessionScoresType = NestedTypeMapper<
  DiceSessionScores,
  Timestamp,
  Date
>;

export const diceSessionScoresConverter: FirestoreDataConverter<LocalDiceSessionScoresType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionScoresType>,
      options,
    ) => {
      const data = snapshot.data(options);

      return {
        ...data,
        id: snapshot.id,
        creationDate: data.creationDate
          ? data.creationDate.toDate()
          : undefined,
      };
    },
  };

