import * as functions from "firebase-functions";
import {getFirestore} from "firebase-admin/firestore";
import {CardUser, diceScoreboardConverter} from "./types.js";

export const createDiceScoreboardPlayer = functions
    .region("europe-west3")
    .https.onCall(async (data: CardUser) => {
      const firestore = getFirestore();

      const diceScoreboardRef = firestore
          .collection("diceScoreboard")
          .withConverter(diceScoreboardConverter);

      await diceScoreboardRef.doc(data.id).set({
        userId: data.id,
        username: data.username,
        maxScore: 0,
        victories: 0,
        dice: 0,
      });
    });
