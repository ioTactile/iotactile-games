import { onDocumentUpdated } from "firebase-functions/v2/firestore";
import { getFirestore } from "firebase-admin/firestore";
import {
  diceScoreboardConverter,
  diceSessionScoresConverter,
  userConverter,
} from "./types.js";

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

    const players = [
      playersScores?.playerOne,
      playersScores?.playerTwo,
      playersScores?.playerThree,
      playersScores?.playerFour,
    ];

    const playersTotal: number[] = [];
    let winner: string | undefined;

    players.forEach((player) => {
      if (player) {
        const { total = 0, id } = player;
        playersTotal.push(total);

        if (playersTotal.length === 1 || total > playersTotal[0]) {
          winner = id;
        }
      }
    });

    await Promise.all(
      players.map(async (player) => {
        if (player) {
          const { id, total = 0, dice } = player;
          const isDicePlayer = dice === 50;
          const playerRef = diceScoreboardRef.doc(id);
          const [playerDoc, userDoc] = await Promise.all([
            playerRef.get(),
            usersRef.doc(id).get(),
          ]);
          const playerData = playerDoc.data();
          const userData = userDoc.data();

          if (playerData && userData) {
            const scores =
              (playerData.totalScore + total) / (playerData.games + 1);
            const averageScore = playerData.games === 0 ? total : scores;

            const updatedPlayerData = {
              userId: id,
              username: userData.username,
              games: playerData.games + 1,
              maxScore: Math.max(playerData.maxScore, total),
              averageScore,
              totalScore: playerData.totalScore + total,
              victories:
                winner === id ? playerData.victories + 1 : playerData.victories,
              dice: isDicePlayer ? playerData.dice + 1 : playerData.dice,
            };

            await playerRef.set(updatedPlayerData, { merge: true });
          }
        }
      }),
    );
  },
);
