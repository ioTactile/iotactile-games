import * as functions from "firebase-functions";
import {getFirestore} from "firebase-admin/firestore";
import {
  diceScoreboardConverter,
  diceSessionScoreConverter,
  userConverter,
} from "./types.js";

export const onDiceSessionEnd = functions
    .region("europe-west3").firestore
    .document("diceSessions/{sessionId}")
    .onUpdate( async (change, context) => {
      const after = change.after.exists ? change.after.data() : null;

      if (after && after.remainingTurns !== 0) {
        return;
      }
      const firestore = getFirestore();

      const playersScoresRef = firestore
          .collection("diceSessionScores")
          .withConverter(diceSessionScoreConverter)
          .doc(context.params.sessionId);
      const diceScoreboardRef = firestore
          .collection("diceScoreboard")
          .withConverter(diceScoreboardConverter);
      const usersRef = firestore
          .collection("users")
          .withConverter(userConverter);

      const playersScoresDoc = await playersScoresRef.get();
      const playersScores = playersScoresDoc.data();
      const playerOne = playersScores?.playerOne;
      const playerTwo = playersScores?.playerTwo;
      const playerThree = playersScores?.playerThree;
      const playerFour = playersScores?.playerFour;
      let totalPlayerOne = 0;
      let totalPlayerTwo = 0;
      let totalPlayerThree = 0;
      let totalPlayerFour = 0;
      let isDicePlayerOne = false;
      let isDicePlayerTwo = false;
      let isDicePlayerThree = false;
      let isDicePlayerFour = false;
      if (playerOne) {
        totalPlayerOne = playerOne.total;
        isDicePlayerOne = playerOne.dice === 50 ? true : false;
      }
      if (playerTwo) {
        totalPlayerTwo = playerTwo.total;
        isDicePlayerTwo = playerTwo.dice === 50 ? true : false;
      }
      if (playerThree) {
        totalPlayerThree = playerThree.total;
        isDicePlayerThree = playerThree.dice === 50 ? true : false;
      }
      if (playerFour) {
        totalPlayerFour = playerFour.total;
        isDicePlayerFour = playerFour.dice === 50 ? true : false;
      }

      let winner;
      if (totalPlayerOne > totalPlayerTwo &&
        totalPlayerOne > totalPlayerThree &&
        totalPlayerOne > totalPlayerFour) {
        winner = playerOne?.id;
      }
      if (totalPlayerTwo > totalPlayerOne &&
        totalPlayerTwo > totalPlayerThree &&
        totalPlayerTwo > totalPlayerFour) {
        winner = playerTwo?.id;
      }
      if (totalPlayerThree > totalPlayerOne &&
        totalPlayerThree > totalPlayerTwo &&
        totalPlayerThree > totalPlayerFour) {
        winner = playerThree?.id;
      }
      if (totalPlayerFour > totalPlayerOne &&
        totalPlayerFour > totalPlayerTwo &&
        totalPlayerFour > totalPlayerThree) {
        winner = playerFour?.id;
      }

      if (playerOne) {
        const playerRef = diceScoreboardRef.doc(playerOne.id);
        const playerDoc = await playerRef.get();
        const player = playerDoc.data();
        const userDoc = await usersRef.doc(playerOne.id).get();
        const user = userDoc.data();
        if (!user || !player) {
          return;
        }
        console.log("playerOne", playerOne.id,
            playerOne.total, player.victories, playerOne.dice);
        await playerRef.set({
          userId: playerOne.id,
          username: user.username,
          maxScore: player.maxScore > playerOne.total ?
          player.maxScore : playerOne.total,
          victories: winner === playerOne.id ?
          player.victories + 1 : player.victories,
          dice: isDicePlayerOne ? player.dice + 1 : player.dice,
        }, {merge: true});
      }
      if (playerTwo) {
        const playerRef = diceScoreboardRef.doc(playerTwo.id);
        const playerDoc = await playerRef.get();
        const player = playerDoc.data();
        const userDoc = await usersRef.doc(playerTwo.id).get();
        const user = userDoc.data();
        if (!user || !player) {
          return;
        }
        console.log("playerTwo", playerTwo.id,
            playerTwo.total, player.victories, playerTwo.dice);
        await playerRef.set({
          userId: playerTwo.id,
          username: user.username,
          maxScore: player.maxScore > playerTwo.total ?
          player.maxScore : playerTwo.total,
          victories: winner === playerTwo.id ?
          player.victories + 1 : player.victories,
          dice: isDicePlayerTwo ? player.dice + 1 : player.dice,
        }, {merge: true});
      }
      if (playerThree) {
        const playerRef = diceScoreboardRef.doc(playerThree.id);
        const playeDoc = await playerRef.get();
        const player = playeDoc.data();
        const userDoc = await usersRef.doc(playerThree.id).get();
        const user = userDoc.data();
        if (!user || !player) {
          return;
        }
        await playerRef.set({
          userId: playerThree.id,
          username: user.username,
          maxScore: player.maxScore > playerThree.total ?
          player.maxScore : playerThree.total,
          victories: winner === playerThree.id ?
          player.victories + 1 : player.victories,
          dice: isDicePlayerThree ? player.dice + 1 : player.dice,
        }, {merge: true});
      }
      if (playerFour) {
        const playerRef = diceScoreboardRef.doc(playerFour.id);
        const playerDoc = await playerRef.get();
        const player = playerDoc.data();
        const userDoc = await usersRef.doc(playerFour.id).get();
        const user = userDoc.data();
        if (!user || !player) {
          return;
        }
        await playerRef.set({
          userId: playerFour.id,
          username: user.username,
          maxScore: player.maxScore > playerFour.total ?
          player.maxScore : playerFour.total,
          victories: winner === playerFour.id ?
            player.victories + 1 : player.victories,
          dice: isDicePlayerFour ? player.dice + 1 : player.dice,
        }, {merge: true});
      }
    });

