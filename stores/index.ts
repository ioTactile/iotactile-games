import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp as FirestoreTimestamp
} from '@firebase/firestore'
import {
  Timestamp,
  User,
  DiceSession,
  DiceScoreboard,
  DiceSessionPlayerTurn,
  DiceSessionScore
} from '~/functions/src/types'

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
        : NestedTypeMapper<T[Property], I, O>
    }

type DatabaseUserType = NestedTypeMapper<User, Timestamp, FirestoreTimestamp>
export type LocalUserType = NestedTypeMapper<User, Timestamp, Date>
export const userConverter: FirestoreDataConverter<LocalUserType> = {
  toFirestore: item => item,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DatabaseUserType>,
    options
  ) => {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
      updateDate: data.updateDate.toDate()
    }
  }
}

type DatabaseDiceSessionType = NestedTypeMapper<
  DiceSession,
  Timestamp,
  FirestoreTimestamp
>
export type LocalDiceSessionType = NestedTypeMapper<
  DiceSession,
  Timestamp,
  Date
>
export const diceSessionConverter: FirestoreDataConverter<LocalDiceSessionType> =
  {
    toFirestore: item => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionType>,
      options
    ) => {
      const data = snapshot.data(options)
      return {
        ...data,
        id: snapshot.id,
        creationDate: data.creationDate.toDate()
      }
    }
  }

type DatabaseDiceScoreboardType = NestedTypeMapper<
  DiceScoreboard,
  Timestamp,
  FirestoreTimestamp
>
export type LocalDiceScoreboardType = NestedTypeMapper<
  DiceScoreboard,
  Timestamp,
  Date
>
export const diceScoreboardConverter: FirestoreDataConverter<LocalDiceScoreboardType> =
  {
    toFirestore: item => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceScoreboardType>,
      options
    ) => {
      const data = snapshot.data(options)
      return {
        ...data,
        id: snapshot.id
      }
    }
  }

type DatabaseDiceSessionPlayerTurnType = NestedTypeMapper<
  DiceSessionPlayerTurn,
  Timestamp,
  FirestoreTimestamp
>
export type LocalDiceSessionPlayerTurnType = NestedTypeMapper<
  DiceSessionPlayerTurn,
  Timestamp,
  Date
>
export const diceSessionPlayerTurnConverter: FirestoreDataConverter<LocalDiceSessionPlayerTurnType> =
  {
    toFirestore: item => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionPlayerTurnType>,
      options
    ) => {
      const data = snapshot.data(options)
      return {
        ...data,
        id: snapshot.id
      }
    }
  }

  type DatabaseDiceSessionScoreType = NestedTypeMapper<
  DiceSessionScore,
  Timestamp,
  FirestoreTimestamp
>
export type LocalDiceSessionScoreType = NestedTypeMapper<
  DiceSessionScore,
  Timestamp,
  Date
>
export const diceSessionScoreConverter: FirestoreDataConverter<LocalDiceSessionScoreType> =
  {
    toFirestore: item => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseDiceSessionScoreType>,
      options
    ) => {
      const data = snapshot.data(options)
      return {
        ...data,
        id: snapshot.id
      }
    }
  }
