import {
  QueryDocumentSnapshot,
  Timestamp as FirestoreTimestamp,
} from "@firebase/firestore";
import type { FirestoreDataConverter } from "@firebase/firestore";
import { Timestamp } from "~/functions/src/types";
import type { TakuzuScoreboard } from "~/functions/src/types";

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

type DatabaseTakuzuSessionScoresType = NestedTypeMapper<
  TakuzuScoreboard,
  Timestamp,
  FirestoreTimestamp
>;
export type LocalTakuzuScoreboardType = NestedTypeMapper<
  TakuzuScoreboard,
  Timestamp,
  Date
>;

export const takuzuScoreboardConverter: FirestoreDataConverter<LocalTakuzuScoreboardType> =
  {
    toFirestore: (item) => item,
    fromFirestore: (
      snapshot: QueryDocumentSnapshot<DatabaseTakuzuSessionScoresType>,
      options,
    ) => {
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

