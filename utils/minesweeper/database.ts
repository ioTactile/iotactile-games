import {
  collection,
  getDoc,
  setDoc,
  doc,
  type DocumentData,
} from "firebase/firestore";
import type { Difficulty } from "./types";
import {
  applyMineSweeperVictory,
  createEmptyMineSweeperScoreboard,
} from "./scoreboard";
import { mineSweeperScoreboardConverter } from "~/infrastructure/firestore/converters";
import type { LocalMineSweeperScoreboardType } from "~/infrastructure/firestore/converters";

const mineSweeperScoreboardCollection = () => {
  const db = useFirestore();
  return collection(db, "mineSweeperScoreboard").withConverter(
    mineSweeperScoreboardConverter,
  );
};

const getUserData = async (userId: string): Promise<DocumentData | null> => {
  const db = useFirestore();
  const userRef = doc(db, "users", userId);
  const userDoc = await getDoc(userRef);

  return userDoc.exists() ? userDoc.data() : null;
};

const getInitialValues = async (
  userId: string,
): Promise<LocalMineSweeperScoreboardType> => {
  const userData = await getUserData(userId);
  const { username } = userData || { username: "Anonyme" };
  const scoreboard = createEmptyMineSweeperScoreboard(userId, username);

  const scoreboardRef = doc(mineSweeperScoreboardCollection(), userId);
  const scoreboardDoc = await getDoc(scoreboardRef);

  if (scoreboardDoc.exists()) {
    Object.assign(scoreboard, scoreboardDoc.data());
  }

  return scoreboard;
};

export const saveScoreboard = async (
  userId: string,
  time: number,
  difficulty: Difficulty,
  numRows: number,
  numCols: number,
  numMines: number,
): Promise<void> => {
  const scoreboard = await getInitialValues(userId);
  const updated = applyMineSweeperVictory(
    scoreboard,
    time,
    difficulty,
    numRows,
    numCols,
    numMines,
  );

  const scoreboardRef = doc(mineSweeperScoreboardCollection(), userId);
  await setDoc(scoreboardRef, updated, { merge: true });
};
