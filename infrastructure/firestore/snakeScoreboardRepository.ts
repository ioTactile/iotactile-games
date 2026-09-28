import { collection, getDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { SnakeScoreboard } from '~/types/models';
import { snakeScoreboardConverter } from '~/infrastructure/firestore/converters';
import type { SnakeScoreboardRepository } from '~/utils/snake/scoreboardRepository';
import { recordSnakeResult } from '~/utils/snake/scoreboardRepository';
import type { SnakeResultPayload } from '~/utils/snake/types';

/** Adapter: Firestore implementation of SnakeScoreboardRepository. */
export class FirestoreSnakeScoreboardRepository implements SnakeScoreboardRepository {
  constructor(private readonly db: Firestore) {}

  private collection() {
    return collection(this.db, 'snakeScoreboard').withConverter(snakeScoreboardConverter);
  }

  async getUsername(userId: string): Promise<string> {
    const userDoc = await getDoc(doc(this.db, 'users', userId));
    return userDoc.exists()
      ? ((userDoc.data()?.username as string | undefined) ?? 'Anonyme')
      : 'Anonyme';
  }

  async findByUserId(userId: string): Promise<SnakeScoreboard | null> {
    const scoreboardDoc = await getDoc(doc(this.collection(), userId));
    return scoreboardDoc.exists() ? scoreboardDoc.data() : null;
  }

  async findAll(): Promise<SnakeScoreboard[]> {
    const snapshot = await getDocs(this.collection());
    return snapshot.docs.map((scoreboardDoc) => scoreboardDoc.data());
  }

  async save(scoreboard: SnakeScoreboard): Promise<void> {
    await setDoc(doc(this.collection(), scoreboard.userId), scoreboard, {
      merge: true,
    });
  }
}

export const createSnakeScoreboardRepository = (): SnakeScoreboardRepository =>
  new FirestoreSnakeScoreboardRepository(useFirestore());

export const saveScoreboard = async (userId: string, result: SnakeResultPayload): Promise<void> => {
  await recordSnakeResult(createSnakeScoreboardRepository(), userId, result);
};

export const loadPlayerScoreboard = async (userId: string): Promise<SnakeScoreboard | null> => {
  return createSnakeScoreboardRepository().findByUserId(userId);
};

export const loadAllScoreboards = async (): Promise<SnakeScoreboard[]> => {
  return createSnakeScoreboardRepository().findAll();
};
