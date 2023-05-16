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
      if (!change.after.exists) {
        return;
      }

      const after = change.after.data();

      if (after.isFinished === false) {
        return;
      }

      const firestore = getFirestore();
      const sessionId = context.params.sessionId;

      const playersScoresRef = firestore
          .collection("diceSessionScores")
          .withConverter(diceSessionScoreConverter)
          .doc(sessionId);
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
      const playerThree = playersScores?.playerThree ?? null;
      const playerFour = playersScores?.playerFour ?? null;

      let isDicePlayerOne = false;
      let isDicePlayerTwo = false;
      let isDicePlayerThree = false;
      let isDicePlayerFour = false;
      let playerOneTotal: number|undefined;
      let playerTwoTotal: number|undefined;
      let playerThreeTotal: number|undefined;
      let playerFourTotal: number|undefined;
      let winner: string|undefined;
      const playersTotal: number[] = [];

      if (playerOne && playerTwo) {
        playerOneTotal = playerOne.total || 0;
        playerTwoTotal = playerTwo.total || 0;
        playersTotal.push(playerOneTotal, playerTwoTotal);
      }
      if (playerThree) {
        playerThreeTotal = playerThree.total || 0;
        playersTotal.push(playerThreeTotal);
      }
      if (playerOne && playerTwo && playerThree && playerFour) {
        playerFourTotal = playerFour.total || 0;
        playersTotal.push(playerFourTotal);
      }
      if (playersTotal) {
        playersTotal.sort((a, b) => b - a);
        if (playerOne && playersTotal[0] === playerOneTotal) {
          winner = playerOne.id;
        }
        if (playerTwo && playersTotal[0] === playerTwoTotal) {
          winner = playerTwo.id;
        }
        if (playerThree && playersTotal[0] === playerThreeTotal) {
          winner = playerThree.id;
        }
        if (playerFour && playersTotal[0] === playerFourTotal) {
          winner = playerFour.id;
        }
      }

      if (playerOne) {
        isDicePlayerOne = playerOne.dice === 50 ? true : false;
        const playerRef = diceScoreboardRef.doc(playerOne.id);
        const playerDoc = await playerRef.get();
        const player = playerDoc.data();
        const userDoc = await usersRef.doc(playerOne.id).get();
        const user = userDoc.data();
        if (user && player) {
          const averageScore = player.games === 0 ? playerOne.total : (
            (player.totalScore + playerOne.total) / (player.games + 1));
          await playerRef.set({
            userId: playerOne.id,
            username: user.username,
            games: player.games + 1,
            maxScore: player.maxScore > playerOne.total ?
          player.maxScore : playerOne.total,
            averageScore: averageScore,
            totalScore: player.totalScore + playerOne.total,
            victories: winner === playerOne.id ?
          player.victories + 1 : player.victories,
            dice: isDicePlayerOne ? player.dice + 1 : player.dice,
          }, {merge: true});
        }
      }
      if (playerTwo) {
        isDicePlayerTwo = playerTwo.dice === 50 ? true : false;
        const playerRef = diceScoreboardRef.doc(playerTwo.id);
        const playerDoc = await playerRef.get();
        const player = playerDoc.data();
        const userDoc = await usersRef.doc(playerTwo.id).get();
        const user = userDoc.data();
        if (user && player) {
          const averageScore = player.games === 0 ? playerTwo.total : (
            (player.totalScore + playerTwo.total) / (player.games + 1));
          await playerRef.set({
            userId: playerTwo.id,
            username: user.username,
            games: player.games + 1,
            maxScore: player.maxScore > playerTwo.total ?
          player.maxScore : playerTwo.total,
            averageScore: averageScore,
            totalScore: player.totalScore + playerTwo.total,
            victories: winner === playerTwo.id ?
          player.victories + 1 : player.victories,
            dice: isDicePlayerTwo ? player.dice + 1 : player.dice,
          }, {merge: true});
        }
      }
      if (playerThree) {
        isDicePlayerThree = playerThree.dice === 50 ? true : false;
        const playerRef = diceScoreboardRef.doc(playerThree.id);
        const playeDoc = await playerRef.get();
        const player = playeDoc.data();
        const userDoc = await usersRef.doc(playerThree.id).get();
        const user = userDoc.data();
        if (user && player) {
          const averageScore = player.games === 0 ? playerThree.total : (
            (player.totalScore + playerThree.total) / (player.games + 1));
          await playerRef.set({
            userId: playerThree.id,
            username: user.username,
            games: player.games + 1,
            maxScore: player.maxScore > playerThree.total ?
          player.maxScore : playerThree.total,
            averageScore: averageScore,
            totalScore: player.totalScore + playerThree.total,
            victories: winner === playerThree.id ?
          player.victories + 1 : player.victories,
            dice: isDicePlayerThree ? player.dice + 1 : player.dice,
          }, {merge: true});
        }
      }
      if (playerFour) {
        isDicePlayerFour = playerFour.dice === 50 ? true : false;
        const playerRef = diceScoreboardRef.doc(playerFour.id);
        const playerDoc = await playerRef.get();
        const player = playerDoc.data();
        const userDoc = await usersRef.doc(playerFour.id).get();
        const user = userDoc.data();
        if (user && player) {
          const averageScore = player.games === 0 ? playerFour.total : (
            (player.totalScore + playerFour.total) / (player.games + 1));
          await playerRef.set({
            userId: playerFour.id,
            username: user.username,
            games: player.games + 1,
            maxScore: player.maxScore > playerFour.total ?
          player.maxScore : playerFour.total,
            averageScore: averageScore,
            totalScore: player.totalScore + playerFour.total,
            victories: winner === playerFour.id ?
            player.victories + 1 : player.victories,
            dice: isDicePlayerFour ? player.dice + 1 : player.dice,
          }, {merge: true});
        }
      }

      await firestore.collection("diceSessionPlayerTurn")
          .doc(sessionId).delete();
      await firestore.collection("diceSessionRemainingTurns")
          .doc(sessionId).delete();
      await firestore.collection("diceSessionPlayerTries")
          .doc(sessionId).delete();
      await firestore.collection("diceSessionDices")
          .doc(sessionId).delete();
      await firestore.collection("diceSessionChat")
          .doc(sessionId).delete();

      return;
    });

