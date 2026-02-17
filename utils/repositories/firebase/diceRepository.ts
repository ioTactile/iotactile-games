import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  diceSessionConverter,
  diceSessionPlayerTurnConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionDicesConverter,
  diceSessionPlayerTriesConverter,
  diceSessionScoresConverter,
  diceScoreboardConverter,
  diceSessionChatConverter,
} from "~/stores";
import type { LocalDiceSessionType } from "~/stores";

export const createDiceRepositories = (db: ReturnType<typeof useFirestore>) => {
  const sessionsRef = collection(db, "diceSessions").withConverter(
    diceSessionConverter,
  );
  const playerTurnRef = collection(
    db,
    "diceSessionPlayerTurn",
  ).withConverter(diceSessionPlayerTurnConverter);
  const remainingTurnsRef = collection(
    db,
    "diceSessionRemainingTurns",
  ).withConverter(diceSessionRemainingTurnsConverter);
  const dicesRef = collection(db, "diceSessionDices").withConverter(
    diceSessionDicesConverter,
  );
  const playerTriesRef = collection(
    db,
    "diceSessionPlayerTries",
  ).withConverter(diceSessionPlayerTriesConverter);
  const scoresRef = collection(db, "diceSessionScores").withConverter(
    diceSessionScoresConverter,
  );
  const scoreboardRef = collection(db, "diceScoreboard").withConverter(
    diceScoreboardConverter,
  );
  const chatRef = collection(db, "diceSessionChat").withConverter(
    diceSessionChatConverter,
  );

  return {
    refs: {
      sessionsRef,
      playerTurnRef,
      remainingTurnsRef,
      dicesRef,
      playerTriesRef,
      scoresRef,
      scoreboardRef,
      chatRef,
    },
    async getUserScoreboard(userId: string) {
      const scoreboardQuery = query(
        scoreboardRef,
        where("userId", "==", userId),
      );
      const scoreboardSnapshot = await getDocs(scoreboardQuery);

      return scoreboardSnapshot.docs.map((d) => d.data());
    },
    async ensureUserScoreboard(userId: string, username?: string | null) {
      const existing = await this.getUserScoreboard(userId);

      if (existing.length > 0) {
        return;
      }

      await setDoc(doc(scoreboardRef, userId), {
        userId,
        username,
        games: 0,
        maxScore: 0,
        averageScore: 0,
        totalScore: 0,
        victories: 0,
        dice: 0,
      });
    },
    async getSessionById(sessionId: string) {
      const sessionRef = doc(sessionsRef, sessionId);
      const sessionDoc = await getDoc(sessionRef);

      return sessionDoc.data() as LocalDiceSessionType | undefined;
    },
    async updateSession(session: LocalDiceSessionType) {
      const sessionRef = doc(sessionsRef, session.id);

      await updateDoc(sessionRef, session);
    },
    async deleteEntireSession(sessionId: string) {
      const sessionRef = doc(sessionsRef, sessionId);
      const playerTurnDoc = doc(playerTurnRef, sessionId);
      const scoresDocRef = doc(scoresRef, sessionId);
      const remainingTurnsDoc = doc(remainingTurnsRef, sessionId);
      const dicesDoc = doc(dicesRef, sessionId);
      const playerTriesDoc = doc(playerTriesRef, sessionId);
      const chatDoc = doc(chatRef, sessionId);

      await deleteDoc(sessionRef);
      await deleteDoc(playerTurnDoc);
      await deleteDoc(scoresDocRef);
      await deleteDoc(remainingTurnsDoc);
      await deleteDoc(dicesDoc);
      await deleteDoc(playerTriesDoc);
      await deleteDoc(chatDoc);
    },
  };
};

