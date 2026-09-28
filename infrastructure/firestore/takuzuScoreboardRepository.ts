import { collection, getDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { TakuzuScoreboard } from '~/types/models';
import { takuzuScoreboardConverter } from '~/infrastructure/firestore/converters';
import type { TakuzuScoreboardRepository } from '~/utils/takuzu/scoreboardRepository';
import { recordTakuzuVictory } from '~/utils/takuzu/scoreboardRepository';
import type { BoardSize, Difficulty } from '~/utils/takuzu/types';

/** Adapter: Firestore implementation of TakuzuScoreboardRepository. */
export class FirestoreTakuzuScoreboardRepository implements TakuzuScoreboardRepository {
  constructor(private readonly db: Firestore) {}

  private collection() {
    return collection(this.db, 'takuzuScoreboard').withConverter(takuzuScoreboardConverter);
  }

  async getUsername(userId: string): Promise<string> {
    const userDoc = await getDoc(doc(this.db, 'users', userId));
    return userDoc.exists()
      ? ((userDoc.data()?.username as string | undefined) ?? 'Anonyme')
      : 'Anonyme';
  }

  async findByUserId(userId: string): Promise<TakuzuScoreboard | null> {
    const scoreboardDoc = await getDoc(doc(this.collection(), userId));
    return scoreboardDoc.exists() ? scoreboardDoc.data() : null;
  }

  async findAll(): Promise<TakuzuScoreboard[]> {
    const snapshot = await getDocs(this.collection());
    return snapshot.docs.map((scoreboardDoc) => scoreboardDoc.data());
  }

  async save(scoreboard: TakuzuScoreboard): Promise<void> {
    await setDoc(doc(this.collection(), scoreboard.userId), scoreboard, {
      merge: true,
    });
  }
}

export const createTakuzuScoreboardRepository = (): TakuzuScoreboardRepository =>
  new FirestoreTakuzuScoreboardRepository(useFirestore());

export const saveScoreboard = async (
  userId: string,
  time: number,
  boardSize: BoardSize,
  difficulty: Difficulty,
): Promise<void> => {
  await recordTakuzuVictory(
    createTakuzuScoreboardRepository(),
    userId,
    time,
    boardSize,
    difficulty,
  );
};

export const loadPlayerScoreboard = async (userId: string): Promise<TakuzuScoreboard | null> => {
  return createTakuzuScoreboardRepository().findByUserId(userId);
};

export const loadAllScoreboards = async (): Promise<TakuzuScoreboard[]> => {
  return createTakuzuScoreboardRepository().findAll();
};
