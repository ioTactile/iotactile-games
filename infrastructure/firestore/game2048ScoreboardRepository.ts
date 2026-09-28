import { collection, getDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { Game2048Scoreboard } from '~/types/models';
import { game2048ScoreboardConverter } from '~/infrastructure/firestore/converters';
import type { Game2048ScoreboardRepository } from '~/utils/game2048/scoreboardRepository';
import { recordGame2048Result } from '~/utils/game2048/scoreboardRepository';
import type { Game2048ResultPayload } from '~/utils/game2048/types';

/** Adapter: Firestore implementation of Game2048ScoreboardRepository. */
export class FirestoreGame2048ScoreboardRepository implements Game2048ScoreboardRepository {
  constructor(private readonly db: Firestore) {}

  private collection() {
    return collection(this.db, 'game2048Scoreboard').withConverter(game2048ScoreboardConverter);
  }

  async getUsername(userId: string): Promise<string> {
    const userDoc = await getDoc(doc(this.db, 'users', userId));
    return userDoc.exists()
      ? ((userDoc.data()?.username as string | undefined) ?? 'Anonyme')
      : 'Anonyme';
  }

  async findByUserId(userId: string): Promise<Game2048Scoreboard | null> {
    const scoreboardDoc = await getDoc(doc(this.collection(), userId));
    return scoreboardDoc.exists() ? scoreboardDoc.data() : null;
  }

  async findAll(): Promise<Game2048Scoreboard[]> {
    const snapshot = await getDocs(this.collection());
    return snapshot.docs.map((scoreboardDoc) => scoreboardDoc.data());
  }

  async save(scoreboard: Game2048Scoreboard): Promise<void> {
    await setDoc(doc(this.collection(), scoreboard.userId), scoreboard, {
      merge: true,
    });
  }
}

export const createGame2048ScoreboardRepository = (): Game2048ScoreboardRepository =>
  new FirestoreGame2048ScoreboardRepository(useFirestore());

export const saveScoreboard = async (
  userId: string,
  result: Game2048ResultPayload,
): Promise<void> => {
  await recordGame2048Result(createGame2048ScoreboardRepository(), userId, result);
};

export const loadPlayerScoreboard = async (userId: string): Promise<Game2048Scoreboard | null> => {
  return createGame2048ScoreboardRepository().findByUserId(userId);
};

export const loadAllScoreboards = async (): Promise<Game2048Scoreboard[]> => {
  return createGame2048ScoreboardRepository().findAll();
};
