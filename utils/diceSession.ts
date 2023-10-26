import {
  collection,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  where,
  deleteField,
  Timestamp,
} from 'firebase/firestore'
import {
  diceSessionConverter,
  diceSessionPlayerTurnConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionDicesConverter,
  diceSessionPlayerTriesConverter,
  diceSessionScoresConverter,
  diceScoreboardConverter,
} from '~/stores'
import type { LocalDiceSessionType } from '~/stores'

export default class diceSession {
  private db = useFirestore()
  private user = useCurrentUser()

  private sessionsRef = collection(this.db, 'diceSessions').withConverter(
    diceSessionConverter,
  )

  private playerTurnRef = collection(
    this.db,
    'diceSessionPlayerTurn',
  ).withConverter(diceSessionPlayerTurnConverter)

  private remainingTurnsRef = collection(
    this.db,
    'diceSessionRemainingTurns',
  ).withConverter(diceSessionRemainingTurnsConverter)

  private dicesRef = collection(this.db, 'diceSessionDices').withConverter(
    diceSessionDicesConverter,
  )

  private playerTriesRef = collection(
    this.db,
    'diceSessionPlayerTries',
  ).withConverter(diceSessionPlayerTriesConverter)

  private scoresRef = collection(this.db, 'diceSessionScores').withConverter(
    diceSessionScoresConverter,
  )

  private scoreboardRef = collection(this.db, 'diceScoreboard').withConverter(
    diceScoreboardConverter,
  )

  private async getUsername() {
    if (!this.user.value) {
      return
    }
    const userRef = doc(this.db, 'users', this.user.value.uid)
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      return
    }
    return userDoc.data()?.username
  }

  private async checkScoreboard() {
    if (!this.user.value) {
      return
    }
    const scoreboardQuery = query(
      this.scoreboardRef,
      where('userId', '==', this.user.value.uid),
    )
    const scoreboardSnapshot = await getDocs(scoreboardQuery)
    const scoreboard = scoreboardSnapshot.docs.map((doc) => doc.data())
    if (scoreboard.length === 0) {
      const username = await this.getUsername()
      await setDoc(doc(this.scoreboardRef, this.user.value.uid), {
        userId: this.user.value!.uid,
        username,
        games: 0,
        maxScore: 0,
        averageScore: 0,
        totalScore: 0,
        victories: 0,
        dice: 0,
      })
    }
  }

  private initScores() {
    if (!this.user.value) {
      return
    }
    const scores = {
      id: this.user.value.uid,
      one: null,
      two: null,
      three: null,
      four: null,
      five: null,
      six: null,
      bonus: 0,
      threeOfAKind: null,
      fourOfAKind: null,
      fullHouse: null,
      smallStraight: null,
      largeStraight: null,
      chance: null,
      dice: null,
      total: 0,
    }
    return scores
  }

  create = async (name: string) => {
    if (!this.user.value) {
      return
    }

    const sessionId = doc(this.sessionsRef).id

    const sessionRef = doc(this.sessionsRef, sessionId)

    const username = await this.getUsername()

    await setDoc(sessionRef, {
      id: sessionId,
      name,
      players: [
        {
          id: this.user.value.uid,
          username,
        },
      ],
      isFull: false,
      isStarted: false,
      isFinished: false,
      creationDate: Timestamp.fromDate(new Date(Date.now())),
    })

    await setDoc(doc(this.playerTurnRef, sessionId), {
      id: sessionId,
      playerId: this.user.value.uid,
    })

    await setDoc(doc(this.remainingTurnsRef, sessionId), {
      id: sessionId,
      remainingTurns: 13,
    })

    await setDoc(doc(this.dicesRef, sessionId), {
      id: sessionId,
      dices: [],
    })

    await setDoc(doc(this.playerTriesRef, sessionId), {
      id: sessionId,
      tries: 3,
    })

    await setDoc(doc(this.scoresRef, sessionId), {
      id: sessionId,
      playerOne: this.initScores(),
      creationDate: Timestamp.fromDate(new Date(Date.now())),
    })

    this.checkScoreboard()
  }

  public async start(session: LocalDiceSessionType) {
    if (!this.user.value) {
      return
    }

    if (session.players.length < 2) {
      return
    }

    const sessionId = session.id

    const sessionRef = doc(this.sessionsRef, sessionId)

    await updateDoc(sessionRef, { isStarted: true })
  }

  public async leave(session: LocalDiceSessionType) {
    if (!this.user.value) {
      return
    }

    const sessionId = session.id

    const sessionRef = doc(this.sessionsRef, sessionId)
    const scoresDocRef = doc(this.scoresRef, sessionId)
    const remainingTurnsDoc = doc(this.remainingTurnsRef, sessionId)
    const scoresDoc = await getDoc(scoresDocRef)
    const scores = scoresDoc.data()

    if (!session) {
      return
    }

    if (!session.players.find((player) => player.id === this.user.value?.uid)) {
      return
    }

    if (session.isStarted) {
      return
    }

    if (scores?.playerTwo?.id === this.user.value.uid) {
      await updateDoc(scoresDocRef, {
        playerTwo: deleteField(),
      })
    } else if (scores?.playerThree?.id === this.user.value.uid) {
      await updateDoc(scoresDocRef, {
        playerThree: deleteField(),
      })
    } else if (scores?.playerFour?.id === this.user.value.uid) {
      await updateDoc(scoresDocRef, {
        playerFour: deleteField(),
      })
    }

    session.players = session.players.filter(
      (player) => player.id !== this.user.value?.uid,
    )

    const joinRemainingTurnsDoc = await getDoc(remainingTurnsDoc)

    if (!joinRemainingTurnsDoc.exists()) {
      return
    }

    const joinRemainingTurns = joinRemainingTurnsDoc.data()?.remainingTurns

    await updateDoc(remainingTurnsDoc, {
      id: sessionId,
      remainingTurns: joinRemainingTurns - 13,
    })

    if (session.players.length < 4) {
      session.isFull = false
    }

    await updateDoc(sessionRef, session)
  }

  public async delete(session: LocalDiceSessionType) {
    if (!this.user.value) {
      return
    }

    const sessionId = session.id

    const sessionRef = doc(this.sessionsRef, sessionId)
    const playerTurnDoc = doc(this.playerTurnRef, sessionId)
    const scoresDocRef = doc(this.scoresRef, sessionId)
    const remainingTurnsDoc = doc(this.remainingTurnsRef, sessionId)
    const dicesDoc = doc(this.dicesRef, sessionId)
    const playerTriesDoc = doc(this.playerTriesRef, sessionId)

    if (!session) {
      return
    }
    if (!session.players.find((player) => player.id === this.user.value?.uid)) {
      return
    }
    if (session.isStarted) {
      return
    }

    if (session.players.length === 1) {
      await deleteDoc(sessionRef)
      await deleteDoc(playerTurnDoc)
      await deleteDoc(scoresDocRef)
      await deleteDoc(remainingTurnsDoc)
      await deleteDoc(dicesDoc)
      await deleteDoc(playerTriesDoc)
    }
  }

  public async join(session: LocalDiceSessionType) {
    if (!this.user.value) {
      return
    }

    const sessionId = session.id
    const sessionRef = doc(this.sessionsRef, sessionId)

    const username = await this.getUsername()

    if (!session) {
      return
    }
    if (session.isStarted) {
      return
    }
    if (session.players.length >= 4) {
      return
    }

    session.players.push({
      id: this.user.value.uid,
      username,
    })

    if (session.players.length >= 4) {
      session.isFull = true
    }

    const joinRemainingTurnsRef = doc(this.remainingTurnsRef, sessionId)
    const joinRemainingTurnsDoc = await getDoc(joinRemainingTurnsRef)

    if (!joinRemainingTurnsDoc.exists()) {
      return
    }

    const joinRemainingTurns = joinRemainingTurnsDoc.data()?.remainingTurns

    await updateDoc(doc(this.remainingTurnsRef, sessionId), {
      id: sessionId,
      remainingTurns: joinRemainingTurns + 13,
    })

    await updateDoc(sessionRef, session)

    const scoresDoc = doc(this.scoresRef, sessionId)

    if (session.players.length === 2) {
      await updateDoc(scoresDoc, { playerTwo: this.initScores() })
    } else if (session.players.length === 3) {
      await updateDoc(scoresDoc, { playerThree: this.initScores() })
    } else if (session.players.length === 4) {
      await updateDoc(scoresDoc, { playerFour: this.initScores() })
    }

    this.checkScoreboard()
  }

  public async quickJoin() {
    if (!this.user.value) {
      return
    }

    const sessionsQuery = query(
      this.sessionsRef,
      where('isFull', '==', false),
      where('isStarted', '==', false),
    )
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map((doc) => doc.data())

    if (sessions.length === 0) {
      return
    }

    const session = sessions[Math.floor(Math.random() * sessions.length)]
    const sessionId = session.id
    const sessionRef = doc(this.sessionsRef, sessionId)

    if (session.players.find((player) => player.id === this.user.value?.uid)) {
      return
    }

    const username = await this.getUsername()

    session.players.push({
      id: this.user.value.uid,
      username,
    })

    if (session.players.length >= 4) {
      session.isFull = true
    }

    const joinRemainingTurnsRef = doc(this.remainingTurnsRef, sessionId)

    const joinRemainingTurnsDoc = await getDoc(joinRemainingTurnsRef)

    if (!joinRemainingTurnsDoc.exists()) {
      return
    }
    const joinRemainingTurns = joinRemainingTurnsDoc.data().remainingTurns

    await updateDoc(doc(this.remainingTurnsRef, sessionId), {
      id: sessionId,
      remainingTurns: joinRemainingTurns + 13,
    })

    await updateDoc(sessionRef, session)

    const scoresDoc = doc(this.scoresRef, sessionId)

    if (session.players.length === 2) {
      await updateDoc(scoresDoc, { playerTwo: this.initScores() })
    } else if (session.players.length === 3) {
      await updateDoc(scoresDoc, { playerThree: this.initScores() })
    } else if (session.players.length === 4) {
      await updateDoc(scoresDoc, { playerFour: this.initScores() })
    }

    this.checkScoreboard()
  }
}
