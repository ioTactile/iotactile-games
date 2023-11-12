// import { collection, query, where, getDocs, limit } from 'firebase/firestore'
// import { describe, beforeEach, test, expect, afterAll } from 'vitest'
// import { DiceSession } from '../../utils/dice/diceSession'
// import type { IDiceSession } from '../../utils/dice/diceSession'
// import { diceSessionConverter } from '../../stores/index'
// import type { LocalDiceSessionType } from '../../stores/index'

// describe('DiceSession', () => {
//   const db = useFirestore()

//   const sessionsRef = collection(db, 'diceSessions').withConverter(
//     diceSessionConverter
//   )

//   let diceSession: IDiceSession
//   let testSession: LocalDiceSessionType | null = null

//   beforeEach(async () => {
//     diceSession = new DiceSession()
//     diceSession.create('test')

//     const sessionQuery = query(
//       sessionsRef,
//       where('name', '==', 'test'),
//       limit(1)
//     )
//     const sessionDocs = await getDocs(sessionQuery)

//     if (!sessionDocs.empty) {
//       const sessionDoc = sessionDocs.docs[0]
//       testSession = sessionDoc.data() as LocalDiceSessionType
//     }
//   })

//   test('should create a new session', () => {
//     expect(testSession).not.toBeNull()
//     expect(testSession?.name).toBe('test')
//     expect(testSession?.players).toEqual([
//       {
//         id: 'etf1JyyvSZZqvAiuexasHWifPKu1',
//         username: 'iotactile'
//       }
//     ])
//     expect(testSession?.isFull).toBe(false)
//     expect(testSession?.isStarted).toBe(false)
//     expect(testSession?.isFinished).toBe(false)
//     expect(testSession?.creationDate).toBeInstanceOf(Date)
//   })

//   afterAll(() => {
//     if (testSession) diceSession.delete(testSession)
//   })
// })
