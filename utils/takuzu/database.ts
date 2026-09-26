import {
  collection,
  getDoc,
  setDoc,
  doc,
  type DocumentData,
} from "firebase/firestore";
import type { BoardSize, Difficulty } from "./types";
import { applyTakuzuVictory, createEmptyTakuzuScoreboard } from "./scoreboard";
import { takuzuScoreboardConverter } from "~/infrastructure/firestore/converters";
import type { LocalTakuzuScoreboardType } from "~/infrastructure/firestore/converters";

const takuzuScoreboardCollection = () => {
  const db = useFirestore();
  return collection(db, "takuzuScoreboard").withConverter(
    takuzuScoreboardConverter,
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
): Promise<LocalTakuzuScoreboardType> => {
  const userData = await getUserData(userId);
  const { username } = userData || { username: "Anonyme" };
  const scoreboard = createEmptyTakuzuScoreboard(userId, username);

  const scoreboardRef = doc(takuzuScoreboardCollection(), userId);
  const scoreboardDoc = await getDoc(scoreboardRef);

  if (scoreboardDoc.exists()) {
    Object.assign(scoreboard, scoreboardDoc.data());
  }

  return scoreboard;
};

export const saveScoreboard = async (
  userId: string,
  time: number,
  boardSize: BoardSize,
  difficulty: Difficulty,
): Promise<void> => {
  const scoreboard = await getInitialValues(userId);
  const updatedScoreboard = applyTakuzuVictory(
    scoreboard,
    boardSize,
    difficulty,
    time,
  );

  const scoreboardRef = doc(takuzuScoreboardCollection(), userId);
  await setDoc(scoreboardRef, updatedScoreboard, { merge: true });
};
