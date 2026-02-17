import {
  QueryDocumentSnapshot,
  Timestamp as FirestoreTimestamp,
} from "@firebase/firestore";
import type { FirestoreDataConverter } from "@firebase/firestore";
import { Timestamp } from "~/functions/src/types";
import type { User } from "~/functions/src/types";

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

type DatabaseUserType = NestedTypeMapper<User, Timestamp, FirestoreTimestamp>;
export type LocalUserType = NestedTypeMapper<User, Timestamp, Date>;

export const userConverter: FirestoreDataConverter<LocalUserType> = {
  toFirestore: (item) => item,
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<DatabaseUserType>,
    options,
  ) => {
    const data = snapshot.data(options);

    return {
      ...data,
      id: snapshot.id,
      creationDate: data.creationDate.toDate(),
      updateDate: data.updateDate.toDate(),
    };
  },
};

