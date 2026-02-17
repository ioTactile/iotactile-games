import {
  QueryDocumentSnapshot,
  Timestamp as FirestoreTimestamp,
} from "@firebase/firestore";
import type { FirestoreDataConverter } from "@firebase/firestore";
import { Timestamp } from "~/functions/src/types";
import type {
  LinguaVaultWords,
  LinguaVaultSession,
  LinguaVaultScoreboard,
  LinguaVaultSessionRemainingTurns,
  LinguaVaultSessionPlayerTurn,
  LinguaVaultSessionWords,
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

type DatabaseLinguaVaultWordsType = NestedTypeMapper<
  LinguaVaultWords,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalLinguaVaultWordsType = NestedTypeMapper<
  LinguaVaultWords,
  Timestamp,
  Date
>;

export const linguaVaultWordsConverter: FirestoreDataConverter<LocalLinguaVaultWordsType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseLinguaVaultWordsType>,
      options,
    ) => {
      const data = snapshot.data(options);

      return {
        ...data,
        id: snapshot.id,
      };
    },
  };

type DatabaseLinguaVaultSessionType = NestedTypeMapper<
  LinguaVaultSession,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalLinguaVaultSessionType = NestedTypeMapper<
  LinguaVaultSession,
  Timestamp,
  Date
>;

export const linguaVaultSessionConverter: FirestoreDataConverter<LocalLinguaVaultSessionType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseLinguaVaultSessionType>,
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

type DatabaseLinguaVaultScoreboardType = NestedTypeMapper<
  LinguaVaultScoreboard,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalLinguaVaultScoreboardType = NestedTypeMapper<
  LinguaVaultScoreboard,
  Timestamp,
  Date
>;

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
  Timestamp,
  FirestoreTimestamp
>;
export type LocalLinguaVaultSessionRemainingTurnsType = NestedTypeMapper<
  LinguaVaultSessionRemainingTurns,
  Timestamp,
  Date
>;

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
  Timestamp,
  FirestoreTimestamp
>;
export type LocalLinguaVaultSessionPlayerTurnType = NestedTypeMapper<
  LinguaVaultSessionPlayerTurn,
  Timestamp,
  Date
>;

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
  Timestamp,
  FirestoreTimestamp
>;
export type LocalLinguaVaultSessionWordsType = NestedTypeMapper<
  LinguaVaultSessionWords,
  Timestamp,
  Date
>;

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

