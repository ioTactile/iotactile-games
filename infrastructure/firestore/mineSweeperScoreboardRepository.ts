import { collection, getDoc, getDocs, setDoc, doc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import type { MineSweeperScoreboard } from '~/types/models';
import { mineSweeperScoreboardConverter } from '~/infrastructure/firestore/converters';
import type { MineSweeperScoreboardRepository } from '~/utils/minesweeper/scoreboardRepository';
import { recordMineSweeperVictory } from '~/utils/minesweeper/scoreboardRepository';
import type { Difficulty } from '~/utils/minesweeper/types';

/** Adapter: Firestore implementation of MineSweeperScoreboardRepository. */
export class FirestoreMineSweeperScoreboardRepository implements MineSweeperScoreboardRepository {
  constructor(private readonly db: Firestore) {}

  private collection() {
    return collection(this.db, 'mineSweeperScoreboard').withConverter(
      mineSweeperScoreboardConverter,
    );
  }

  async getUsername(userId: string): Promise<string> {
    const userDoc = await getDoc(doc(this.db, 'users', userId));
    return userDoc.exists()
      ? ((userDoc.data()?.username as string | undefined) ?? 'Anonyme')
      : 'Anonyme';
  }

  async findByUserId(userId: string): Promise<MineSweeperScoreboard | null> {
    const scoreboardDoc = await getDoc(doc(this.collection(), userId));
    return scoreboardDoc.exists() ? scoreboardDoc.data() : null;
  }

  async findAll(): Promise<MineSweeperScoreboard[]> {
    const snapshot = await getDocs(this.collection());
    return snapshot.docs.map((scoreboardDoc) => scoreboardDoc.data());
  }

  async save(scoreboard: MineSweeperScoreboard): Promise<void> {
    await setDoc(doc(this.collection(), scoreboard.userId), scoreboard, {
      merge: true,
    });
  }
}

export const createMineSweeperScoreboardRepository = (): MineSweeperScoreboardRepository =>
  new FirestoreMineSweeperScoreboardRepository(useFirestore());

export const saveScoreboard = async (
  userId: string,
  time: number,
  difficulty: Difficulty,
  numRows: number,
  numCols: number,
  numMines: number,
): Promise<void> => {
  await recordMineSweeperVictory(
    createMineSweeperScoreboardRepository(),
    userId,
    time,
    difficulty,
    numRows,
    numCols,
    numMines,
  );
};

export const loadPlayerScoreboard = async (
  userId: string,
): Promise<MineSweeperScoreboard | null> => {
  return createMineSweeperScoreboardRepository().findByUserId(userId);
};

export const loadAllScoreboards = async (): Promise<MineSweeperScoreboard[]> => {
  return createMineSweeperScoreboardRepository().findAll();
};
