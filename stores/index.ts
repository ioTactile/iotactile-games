import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  Timestamp as FirestoreTimestamp,
} from '@firebase/firestore'
import { Timestamp, User, Word, Session } from '~/functions/src/types'

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
  toFirestore: (item) => item,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DatabaseUserType>,
    options
  ) => {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
      updateDate: data.updateDate.toDate(),
    }
  },
}

type databaseWordType = NestedTypeMapper<Word, Timestamp, FirestoreTimestamp>
export type LocalWordType = NestedTypeMapper<Word, Timestamp, Date>
export const wordConverter: FirestoreDataConverter<LocalWordType> = {
  toFirestore: (item) => item,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<databaseWordType>,
    options
  ) => {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
    }
  },
}

type DatabaseSessionType = NestedTypeMapper<
  Session,
  Timestamp,
  FirestoreTimestamp
>
export type LocalSessionType = NestedTypeMapper<Session, Timestamp, Date>
export const sessionConverter: FirestoreDataConverter<LocalSessionType> = {
  toFirestore: (item) => item,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DatabaseSessionType>,
    options
  ) => {
    const data = snapshot.data(options)
    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
    }
  },
}
