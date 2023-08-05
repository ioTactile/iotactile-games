import * as functions from "firebase-functions";
import {getFirestore} from "firebase-admin/firestore";
import {
  linguaVaultSessionWordsConverter,
  linguaVaultSessionConverter,
  linguaVaultSessionRemainingTurnsConverter,
  linguaVaultSessionPlayerTurnConverter,
} from "./types.js";

export const onLinguaVaultSessionRematch = functions
    .region("europe-west3")
    .firestore.document("linguaVaultSessions/{sessiontId}")
    .onUpdate(async (change, context) => {
      if (!change.after.exists) {
        return;
      }

      const after = change.after.data();

      if (!after.isFinished) {
        return;
      }

      if (after.isPlayerOneContinue === null ||
        after.isPlayerTwoContinue === null) {
        return;
      }

      const firestore = getFirestore();
      const sessionId = context.params.sessiontId;

      const sessionRef = firestore
          .collection("linguaVaultSessions")
          .doc(sessionId)
          .withConverter(linguaVaultSessionConverter);

      const wordsRef = firestore
          .collection("linguaVaultSessions")
          .doc(sessionId)
          .collection("words")
          .doc(sessionId)
          .withConverter(linguaVaultSessionWordsConverter);

      const remainingTurnsRef = firestore
          .collection("linguaVaultSessions")
          .doc(sessionId)
          .collection("remainingTurns")
          .doc(sessionId)
          .withConverter(linguaVaultSessionRemainingTurnsConverter);

      const playerTurnRef = firestore
          .collection("linguaVaultSessions")
          .doc(sessionId)
          .collection("playerTurn")
          .doc(sessionId)
          .withConverter(linguaVaultSessionPlayerTurnConverter);


      if (after.isPlayerOneContinue === true &&
        after.isPlayerTwoContinue === true) {
        await sessionRef.update({
          isRoundFinished: false,
          isPlayerOneContinue: null,
          isPlayerTwoContinue: null,
        });

        await wordsRef.update({
          testedWords: [],
          clues: [],
        });

        const remainingTurnsDoc = await remainingTurnsRef.get();
        const remainingTurns = remainingTurnsDoc.data();

        await remainingTurnsRef.update({
          remainingTurns: remainingTurns!.remainingTurns - 1,
        });

        const sessionDoc = await sessionRef.get();
        const session = sessionDoc.data();

        const newPlayerOneIsFinder = !session!.playerOne.isFinder;
        const newPlayerTwoIsFinder = !session!.playerTwo!.isFinder;

        const updatePlayerOne = {
          ...session!.playerOne,
          isFinder: newPlayerOneIsFinder,
        };

        const updatePlayerTwo = {
          ...session!.playerTwo!,
          isFinder: newPlayerTwoIsFinder,
        };

        await sessionRef.update({
          playerOne: updatePlayerOne,
          playerTwo: updatePlayerTwo,
        });

        await playerTurnRef.update({
          playerId: session!.playerOne.isFinder ?
            session!.playerOne.id :
            session!.playerTwo!.id,
        });
      } else if (after.isPlayerOneContinue === false &&
        after.isPlayerTwoContinue === false) {
        await sessionRef.update({
          isFinished: true,
        });
      }

      return;
    });
