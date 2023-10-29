import * as functions from 'firebase-functions'
import { WriteResult, getFirestore } from 'firebase-admin/firestore'
import { Timestamp } from './types.js'

export const deleteExpiredSessions = functions
  .region('europe-west3')
  .pubsub.schedule('0 0 * * *')
  .timeZone('Europe/Paris')
  .onRun(async () => {
    const firestore = getFirestore()
    const now = Timestamp.now()
    const expirationDate = new Date(now.toMillis() - 24 * 60 * 60 * 1000)

    const diceSessionsQuery = firestore
      .collection('diceSessions')
      .where('creationDate', '<=', expirationDate)
    const diceSessionsSnapshot = await diceSessionsQuery.get()

    const linguaVaultQuery = firestore
      .collection('linguaVaultSessions')
      .where('creationDate', '<=', expirationDate)
    const linguaVaultSessionsSnapshot = await linguaVaultQuery.get()

    const deletePromises: Promise<WriteResult>[] = []

    linguaVaultSessionsSnapshot.forEach((doc) => {
      const sessionId = doc.id
      const deletePromisesPerSession = [
        firestore.collection('linguaVaultSessions').doc(sessionId).delete()
      ]
      deletePromises.push(...deletePromisesPerSession)
    })

    diceSessionsSnapshot.forEach((doc) => {
      const sessionId = doc.id
      const deletePromisesPerSession = [
        firestore.collection('diceSessions').doc(sessionId).delete(),
        firestore.collection('diceSessionPlayerTurn').doc(sessionId).delete(),
        firestore
          .collection('diceSessionRemainingTurns')
          .doc(sessionId)
          .delete(),
        firestore.collection('diceSessionPlayerTries').doc(sessionId).delete(),
        firestore.collection('diceSessionDices').doc(sessionId).delete(),
        firestore.collection('diceSessionChat').doc(sessionId).delete()
      ]
      deletePromises.push(...deletePromisesPerSession)
      if (doc.data().players.length === 1) {
        deletePromises.push(
          firestore.collection('diceSessionScore').doc(sessionId).delete()
        )
      }
    })

    await Promise.allSettled(deletePromises)

    return
  })
