import * as functions from 'firebase-functions'
import { getFirestore } from 'firebase-admin/firestore'
import { diceScoreboardConverter, diceSessionScoreConverter, userConverter } from './types.js'

export const onDiceSessionEnd = functions
  .region('europe-west3')
  .firestore.document('diceSessions/{sessionId}')
  .onUpdate(async (change, context) => {
    if (!change.after.exists) {
      return
    }

    const after = change.after.data()

    if (!after.isFinished) {
      return
    }

    const firestore = getFirestore()
    const sessionId = context.params.sessionId

    const playersScoresRef = firestore
      .collection('diceSessionScores')
      .withConverter(diceSessionScoreConverter)
      .doc(sessionId)
    const diceScoreboardRef = firestore
      .collection('diceScoreboard')
      .withConverter(diceScoreboardConverter)
    const usersRef = firestore.collection('users').withConverter(userConverter)

    const playersScoresDoc = await playersScoresRef.get()
    const playersScores = playersScoresDoc.data()

    const players = [
      playersScores?.playerOne,
      playersScores?.playerTwo,
      playersScores?.playerThree,
      playersScores?.playerFour
    ]

    const playersTotal: number[] = []
    let winner: string | undefined

    players.forEach((player) => {
      if (player) {
        const { total = 0, id } = player
        playersTotal.push(total)

        if (playersTotal.length === 1 || total > playersTotal[0]) {
          winner = id
        }
      }
    })

    players.forEach(async (player) => {
      if (player) {
        const { id, total = 0, dice } = player
        const isDicePlayer = dice === 50
        const playerRef = diceScoreboardRef.doc(id)
        const [playerDoc, userDoc] = await Promise.all([playerRef.get(), usersRef.doc(id).get()])
        const playerData = playerDoc.data()
        const userData = userDoc.data()

        if (playerData && userData) {
          const averageScore =
            playerData.games === 0
              ? total
              : (playerData.totalScore + total) / (playerData.games + 1)

          const updatedPlayerData = {
            userId: id,
            username: userData.username,
            games: playerData.games + 1,
            maxScore: Math.max(playerData.maxScore, total),
            averageScore,
            totalScore: playerData.totalScore + total,
            victories: winner === id ? playerData.victories + 1 : playerData.victories,
            dice: isDicePlayer ? playerData.dice + 1 : playerData.dice
          }

          await playerRef.set(updatedPlayerData, { merge: true })
        }
      }
    })

    return
  })
