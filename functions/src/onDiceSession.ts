import * as functions from "firebase-functions";

import {CardUser, DiceSession} from "./types.js";

export const onDiceSession = functions
    .region("europe-west3").firestore
    .document("diceSessions/{sessionId}")
    .onUpdate(async (change, context) => {
      const session = change.after.exists ?
      change.after.data() as DiceSession : null;

      if (session && session.isStarted === true) {
        const players = session.players;

        // Redirigez chaque joueur vers la page de jeu
        players.forEach((player: CardUser) => {
          if (player.id) {
            const url = `http://localhost:3000/dice/jouer/${context.params.sessionId}`;
            const options = {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            };
            fetch(url, options)
                .then((response) => console.log(response.status))
                .catch((error) => console.log(error));
          }
        });
      }
    });
