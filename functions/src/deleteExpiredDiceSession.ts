import * as functions from "firebase-functions";
import {WriteResult, getFirestore} from "firebase-admin/firestore";
import {Timestamp} from "./types.js";

export const deleteExpiredDiceSession = functions
    .region("europe-west3")
    .pubsub.schedule("0 0 * * *")
    .timeZone("Europe/Paris")
    .onRun(async (context) => {
      const firestore = getFirestore();
      const now = Timestamp.now();
      const expirationDate = new Date(now.toMillis() - 24 * 60 * 60 * 1000);

      const diceSessionsQuery = firestore
          .collection("diceSessions")
          .where("creationDate", "<=", expirationDate);
      const diceSessionsSnapshot = await diceSessionsQuery.get();

      console.log("Found", diceSessionsSnapshot.size, "expired dice sessions");

      const deletePromises: Promise<WriteResult>[] = [];

      diceSessionsSnapshot.forEach((doc) => {
        const sessionId = doc.id;
        const deletePromisesPerSession = [
          firestore.collection("diceSessions")
              .doc(sessionId).delete(),
          firestore.collection("diceSessionPlayerTurn")
              .doc(sessionId).delete(),
          firestore.collection("diceSessionRemainingTurns")
              .doc(sessionId).delete(),
          firestore.collection("diceSessionPlayerTries")
              .doc(sessionId).delete(),
          firestore.collection("diceSessionDices")
              .doc(sessionId).delete(),
          firestore.collection("diceSessionChat")
              .doc(sessionId).delete(),
        ];
        deletePromises.push(...deletePromisesPerSession);
      });

      await Promise.allSettled(deletePromises);

      return;
    });
