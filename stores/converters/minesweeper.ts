import {
  QueryDocumentSnapshot,
  Timestamp as FirestoreTimestamp,
} from "@firebase/firestore";
import type { FirestoreDataConverter } from "@firebase/firestore";
import { Timestamp } from "~/functions/src/types";
import type { MineSweeperScoreboard } from "~/functions/src/types";

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

type DatabaseMineSweeperSessionScoresType = NestedTypeMapper<
  MineSweeperScoreboard,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalMineSweeperScoreboardType = NestedTypeMapper<
  MineSweeperScoreboard,
  Timestamp,
  Date
>;

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

