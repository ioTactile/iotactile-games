import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { getFirestore } from "firebase-admin/firestore";
import {
  diceScoreboardConverter,
  diceSessionScoresConverter,
  userConverter,
} from "./types.js";
import {
  applyDiceSessionResult,
  collectSessionPlayers,
  resolveSessionWinner,
} from "../../shared/dice/endSessionScoreboard.js";

export const onDiceSessionEnd = onDocumentUpdated(
  {
    document: "diceSessions/{sessionId}",
    region: "europe-west3",
  },
  async (event) => {
    if (!event.data?.after.exists) {
      return;
    }

    const after = event.data.after.data();

    if (!after.isFinished) {
      return;
    }

    const firestore = getFirestore();
    const sessionId = event.params.sessionId;

    const playersScoresRef = firestore
      .collection("diceSessionScores")
      .withConverter(diceSessionScoresConverter)
      .doc(sessionId);
    const diceScoreboardRef = firestore
      .collection("diceScoreboard")
      .withConverter(diceScoreboardConverter);
    const usersRef = firestore.collection("users").withConverter(userConverter);

    const playersScoresDoc = await playersScoresRef.get();
    const playersScores = playersScoresDoc.data();
    if (!playersScores) {
      return;
    }

    const players = collectSessionPlayers(playersScores);
    const winner = resolveSessionWinner(players);

    await Promise.all(
      players.map(async (player) => {
        const playerRef = diceScoreboardRef.doc(player.id);
        const [playerDoc, userDoc] = await Promise.all([
          playerRef.get(),
          usersRef.doc(player.id).get(),
        ]);
        const playerData = playerDoc.data();
        const userData = userDoc.data();

        if (playerData && userData) {
          const updatedPlayerData = applyDiceSessionResult(
            playerData,
            player,
            winner,
            userData.username,
          );
          await playerRef.set(updatedPlayerData, { merge: true });
        }
      }),
    );
  },
);
