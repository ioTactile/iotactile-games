import {
  collection,
  getDoc,
  setDoc,
  doc,
  type DocumentData,
} from "firebase/firestore";
import type { Difficulty } from "./types";
import type { CustomVictory } from "~/functions/src/types";
import type { LocalMineSweeperScoreboardType } from "~/stores";

type OmittedCustomVictory = Omit<
  CustomVictory,
  "victories" | "bestTime" | "victoryDate"
>;

type OmittedDifficulty = "beginner" | "intermediate" | "expert";

type MineSweeperVictory = {
  victories: number;
  bestTime: number;
  victoryDate: Date;
};

const createDefaultVictory = (): MineSweeperVictory => ({
  victories: 0,
  bestTime: 0,
  victoryDate: new Date(),
});

const mineSweeperScoreboard = (): ReturnType<typeof collection> => {
  const db = useFirestore();
  const mineSweeperScoreboard = collection(
    db,
    "mineSweeperScoreboard",
  ).withConverter(mineSweeperScoreboardConverter);
  return mineSweeperScoreboard;
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

  const scoreboard: LocalMineSweeperScoreboardType = {
    userId,
    username,
    beginner: createDefaultVictory(),
    intermediate: createDefaultVictory(),
    expert: createDefaultVictory(),
    custom: [],
  };

  const scoreboardRef = doc(mineSweeperScoreboard(), userId);
  const scoreboardDoc = await getDoc(scoreboardRef);

  if (scoreboardDoc.exists()) {
    Object.assign(scoreboard, scoreboardDoc.data());
  }

  return scoreboard;
};

const updateCustomScoreboard = (
  scoreboard: LocalMineSweeperScoreboardType,
  time: number,
  customVictoryIndex: number,
) => {
  const customVictory = scoreboard["custom"][customVictoryIndex];
  const bestTime =
    customVictory.bestTime > time ? time : customVictory.bestTime;

  scoreboard["custom"][customVictoryIndex] = {
    ...customVictory,
    victories: customVictory.victories + 1,
    bestTime,
    victoryDate: new Date(Date.now()),
  };
};

const updateNonCustomScoreboard = (
  scoreboard: LocalMineSweeperScoreboardType,
  time: number,
  difficulty: OmittedDifficulty,
) => {
  const bestTime =
    scoreboard[difficulty].bestTime > time
      ? time
      : scoreboard[difficulty].bestTime || time;

  scoreboard[difficulty] = {
    victories: scoreboard[difficulty].victories + 1 || 1,
    bestTime,
    victoryDate: new Date(Date.now()),
  };
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

  if (difficulty === "custom") {
    const customVictoryIndex = scoreboard[difficulty].findIndex(
      (customVictory: OmittedCustomVictory) =>
        customVictory.rows === numRows &&
        customVictory.cols === numCols &&
        customVictory.mines === numMines,
    );

    if (customVictoryIndex !== -1) {
      updateCustomScoreboard(scoreboard, time, customVictoryIndex);
    } else {
      scoreboard["custom"].push({
        rows: numRows,
        cols: numCols,
        mines: numMines,
        victories: 1,
        bestTime: time,
        victoryDate: new Date(Date.now()),
      });
    }
  } else {
    updateNonCustomScoreboard(scoreboard, time, difficulty);
  }

  const scoreboardRef = doc(mineSweeperScoreboard(), userId);
  await setDoc(scoreboardRef, scoreboard, { merge: true });
};
