import { collection, getDoc, getDocs, query, orderBy, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { DiceScoreboard } from '~/types/models';
import { diceScoreboardConverter } from '~/infrastructure/firestore/converters';
import type { DiceScoreboardRepository } from '~/utils/dice/scoreboardRepository';

/** Adapter: Firestore implementation of DiceScoreboardRepository. */
export class FirestoreDiceScoreboardRepository implements DiceScoreboardRepository {
  constructor(private readonly db: Firestore) {}

  private collection() {
    return collection(this.db, 'diceScoreboard').withConverter(diceScoreboardConverter);
  }

  async findByUserId(userId: string): Promise<DiceScoreboard | null> {
    const scoreboardDoc = await getDoc(doc(this.collection(), userId));
    return scoreboardDoc.exists() ? scoreboardDoc.data() : null;
  }

  async findAllOrderedByVictories(): Promise<DiceScoreboard[]> {
    const scoreboardQuery = query(this.collection(), orderBy('victories', 'desc'));
    const snapshot = await getDocs(scoreboardQuery);
    return snapshot.docs.map((scoreboardDoc) => scoreboardDoc.data());
  }
}

export const createDiceScoreboardRepository = (): DiceScoreboardRepository =>
  new FirestoreDiceScoreboardRepository(useFirestore());

export const loadPlayerScoreboard = async (userId: string): Promise<DiceScoreboard | null> => {
  return createDiceScoreboardRepository().findByUserId(userId);
};

export const loadRankingScoreboards = async (): Promise<DiceScoreboard[]> => {
  return createDiceScoreboardRepository().findAllOrderedByVictories();
};
