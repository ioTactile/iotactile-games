import * as functions from "firebase-functions";

import {CardUser, DiceSession} from "./types.js";

// export const onDiceSession = functions
//     .region("europe-west3").firestore
//     .document("diceSessions/{sessionId}")
//     .onUpdate(async (change, context) => {
//       const session = change.after.exists ?
//       change.after.data() as DiceSession : null;

//       functions.logger.log("Session", session);

//       if (session && session.isStarted === true) {
//         const players = session.players;

//         functions.logger.log("players", players);

//         // Redirigez chaque joueur vers la page de jeu
//         players.forEach((player: CardUser) => {
//           if (player.id) {
//             const url = `http://localhost:3000/dice/jouer/${context.params.sessionId}`;

//             functions.logger.log("URL", url);

//             const options = {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//             };
//             fetch(url, options)
//                 .then((response) => functions.logger.log(response.status))
//                 .catch((error) => functions.logger.log(error));
//           }
//         });
//       }
// });

export const onDiceSession = functions
    .region("europe-west3").firestore
    .document("diceSessions/{sessionId}")
    .onUpdate((change, context) => {
      const session = change.after.exists ?
      change.after.data() as DiceSession : null;

      functions.logger.log("Session", session);

      if (session && session.isStarted === true) {
        const redirectURL = `http://localhost:3000/dice/jouer/${context.params.sessionId}`;
        const playersRef = change.after.ref.collection("players");

        return playersRef.get().then((snapshot ) => {
          const playerPromises = [] as Promise<any>[];
          snapshot.forEach((doc) => {
            const player = doc.data();
            const res = player.res;
            const promise = res.redirect(redirectURL);
            playerPromises.push(promise);
          });
          return Promise.all(playerPromises);
        });
      } else {
        return null;
      }
    });
