import {
  collection,
  getDoc,
  setDoc,
  doc,
  type DocumentData,
} from "firebase/firestore";
import type { BoardSize, Difficulty } from "./types";
import type { LocalTakuzuScoreboardType } from "~/stores";

type TakuzuVictory = {
  victories: number;
  bestTime: number;
  victoryDate: Date;
};

const createDefaultVictory = (): TakuzuVictory => ({
  victories: 0,
  bestTime: 0,
  victoryDate: new Date(0),
});

const takuzuScoreboard = (): ReturnType<typeof collection> => {
  const db = useFirestore();
  const takuzuScoreboard = collection(db, "takuzuScoreboard").withConverter(
    takuzuScoreboardConverter,
  );
  return takuzuScoreboard;
};

const translateBoardSize = (
  boardSize: BoardSize,
): keyof LocalTakuzuScoreboardType => {
  switch (boardSize) {
    case 6:
      return "sixBySix";
    case 8:
      return "eightByEight";
    case 10:
      return "tenByTen";
    case 12:
      return "twelveByTwelve";
    default:
      return "sixBySix";
  }
};

const getUserData = async (userId: string): Promise<DocumentData | null> => {
  const db = useFirestore();
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  return userDoc.exists() ? userDoc.data() : null;
};

const getInitialValues = async (
  userId: string,
): Promise<LocalTakuzuScoreboardType> => {
  const userData = await getUserData(userId);

  const { username } = userData || { username: "Anonyme" };

  const scoreboard: LocalTakuzuScoreboardType = {
    userId,
    username,
    sixBySix: {
      easy: createDefaultVictory(),
      medium: createDefaultVictory(),
      hard: createDefaultVictory(),
      expert: createDefaultVictory(),
    },
    eightByEight: {
      easy: createDefaultVictory(),
      medium: createDefaultVictory(),
      hard: createDefaultVictory(),
      expert: createDefaultVictory(),
    },
    tenByTen: {
      easy: createDefaultVictory(),
      medium: createDefaultVictory(),
      hard: createDefaultVictory(),
      expert: createDefaultVictory(),
    },
    twelveByTwelve: {
      easy: createDefaultVictory(),
      medium: createDefaultVictory(),
      hard: createDefaultVictory(),
      expert: createDefaultVictory(),
    },
  };

  const scoreboardRef = doc(takuzuScoreboard(), userId);
  const scoreboardDoc = await getDoc(scoreboardRef);

  if (scoreboardDoc.exists()) {
    Object.assign(scoreboard, scoreboardDoc.data());
  }

  return scoreboard;
};

const updateScoreboard = (
  scoreboard: LocalTakuzuScoreboardType,
  size: keyof LocalTakuzuScoreboardType,
  time: number,
  difficulty: Difficulty,
): LocalTakuzuScoreboardType => {
  const sizeBoard = scoreboard[size] as Record<Difficulty, TakuzuVictory>;
  const boardDifficulty = sizeBoard[difficulty];

  boardDifficulty.victories += 1;
  if (boardDifficulty.bestTime === 0 || time < boardDifficulty.bestTime) {
    boardDifficulty.bestTime = time;
  }
  boardDifficulty.victoryDate = new Date(Date.now());

  sizeBoard[difficulty] = boardDifficulty;

  const newScoreboard = { ...scoreboard, [size]: sizeBoard };

  return newScoreboard;
};

export const saveScoreboard = async (
  userId: string,
  time: number,
  boardSize: BoardSize,
  difficulty: Difficulty,
): Promise<void> => {
  const scoreboard = await getInitialValues(userId);

  const sizeKey = translateBoardSize(boardSize);
  const updatedScoreboard = updateScoreboard(
    scoreboard,
    sizeKey,
    time,
    difficulty,
  );

  const scoreboardRef = doc(takuzuScoreboard(), userId);
  await setDoc(scoreboardRef, updatedScoreboard, { merge: true });
};
