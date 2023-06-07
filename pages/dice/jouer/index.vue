<template>
  <div>
    <Head>
      <Title>Jouer à Dice - ioTactile Games</Title>
      <Meta name="description" content="Page pour jouer à Dice" />
    </Head>
    <v-container>
      <v-row>
        <v-divider class="mb-4" />
        <v-col cols="6" class="text-end">
          <v-btn
            variant="flat"
            color="tertiary"
            class="text-subtitle-2 text-sm-h6"
            :loading="loading"
            @click="quickJoin"
          >
            Partie rapide
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-start">
          <v-btn
            variant="flat"
            color="tertiary"
            class="text-subtitle-2 text-sm-h6"
            :loading="loading"
            @click="create"
          >
            Créer une session
          </v-btn>
        </v-col>
        <v-divider class="mt-4" />
        <v-col
          v-if="sessionsNotStarted.length > 0"
          cols="12"
          class="text-h4 my-4"
          align="center"
        >
          <span>Rejoindre une session</span>
        </v-col>
        <v-col
          v-for="(session, i) in sessionsNotStarted"
          :key="i"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <v-card v-if="!session.isStarted">
            <v-card-title class="text-h5 text-center">
              <span>Session {{ i + 1 }}</span>
            </v-card-title>
            <v-card-text>
              <div
                v-for="(player, j) in session.players"
                :key="j"
                class="d-flex justify-space-between text-h6"
              >
                <span>Joueur {{ j + 1 }}:</span>
                <span>{{ player.username }}</span>
              </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-space-between">
              <v-btn
                color="error"
                :loading="leaving"
                @click="leave(session.id)"
              >
                Quitter
              </v-btn>
              <v-btn
                color="tertiary"
                :loading="loading"
                @click="join(session.id)"
              >
                Rejoindre
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <template v-if="sessionStarted.length > 0">
          <v-divider class="mt-4" />
          <v-col cols="12" class="text-h4 my-4" align="center">
            <span>Parties en cours</span>
          </v-col>
          <v-col
            v-for="(session, i) in sessionStarted"
            :key="i"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card v-if="session.isStarted">
              <v-card-title class="text-h5 text-center">
                <span>Session {{ i + 1 }}</span>
              </v-card-title>
              <v-card-text>
                <div
                  v-for="(player, j) in session.players"
                  :key="j"
                  class="d-flex justify-space-between text-h6"
                >
                  <span>Joueur {{ j + 1 }}:</span>
                  <span>{{ player.username }}</span>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import {
  VContainer,
  VRow,
  VCol,
  VDivider,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn
} from 'vuetify/components'
import {
  Timestamp,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  deleteField,
  updateDoc,
  query,
  where
} from 'firebase/firestore'
import { useFirestore, useCollection } from 'vuefire'
import {
  diceSessionConverter,
  diceScoreboardConverter,
  diceSessionPlayerTurnConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionDicesConverter,
  diceSessionPlayerTriesConverter,
  LocalDiceSessionType
} from '~/stores'

// Vuefire & Composables

const { notifier } = useNotifier()
const user = useCurrentUser()
const db = useFirestore()

// Firestore

const sessionsRef = collection(db, 'diceSessions').withConverter(
  diceSessionConverter
)
const sessionsNotStarted = useCollection(
  query(sessionsRef, where('isStarted', '==', false))
)
const sessionStarted = useCollection(
  query(
    sessionsRef,
    where('isStarted', '==', true),
    where('isFinished', '==', false)
  )
)
const playerTurnRef = collection(db, 'diceSessionPlayerTurn').withConverter(
  diceSessionPlayerTurnConverter
)
const remainingTurnsRef = collection(
  db,
  'diceSessionRemainingTurns'
).withConverter(diceSessionRemainingTurnsConverter)
const dicesRef = collection(db, 'diceSessionDices').withConverter(
  diceSessionDicesConverter
)
const playerTriesRef = collection(db, 'diceSessionPlayerTries').withConverter(
  diceSessionPlayerTriesConverter
)
const scoresRef = collection(db, 'diceSessionScores')
const scoreboardRef = collection(db, 'diceScoreboard').withConverter(
  diceScoreboardConverter
)

// Refs

const id = ref<string | null>(null)
const date = ref(new Date(Date.now()))
const loading = ref(false)
const leaving = ref(false)

// Methods

const checkScoreboard = async () => {
  const scoreboardQuery = query(
    scoreboardRef,
    where('userId', '==', user.value?.uid)
  )
  const scoreboardSnapshot = await getDocs(scoreboardQuery)
  const scoreboard = scoreboardSnapshot.docs.map(doc => doc.data())
  if (scoreboard.length === 0) {
    const username = await getUsername()
    await setDoc(doc(scoreboardRef, user.value?.uid), {
      userId: user.value?.uid,
      username,
      games: 0,
      maxScore: 0,
      averageScore: 0,
      totalScore: 0,
      victories: 0,
      dice: 0
    })
  }
}

const getUsername = async () => {
  if (!user.value) {
    return
  }
  const userRef = doc(db, 'users', user.value.uid)
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) {
    return
  }
  return userDoc.data()?.username
}

const initScores = () => {
  if (!user.value) {
    return
  }
  const scores = {
    id: user.value.uid,
    one: 69,
    two: 69,
    three: 69,
    four: 69,
    five: 69,
    six: 69,
    bonus: 0,
    threeOfAKind: 69,
    fourOfAKind: 69,
    fullHouse: 69,
    smallStraight: 69,
    largeStraight: 69,
    chance: 69,
    dice: 69,
    total: 0
  }

  return scores
}

const create = async () => {
  if (!user.value) {
    notifier({ content: 'Tu dois être connecté', color: 'error' })
    return
  }
  loading.value = true
  id.value = doc(sessionsRef).id

  try {
    const sessionsQuery = query(sessionsRef, where('isFull', '==', false))
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map(doc => doc.data())
    const session = sessions.find(session =>
      session.players.find(player => player.id === user.value?.uid)
    )
    if (session?.isFinished === false) {
      notifier({
        content: 'Tu es déjà dans une session non terminée',
        color: 'error'
      })
      return
    }
    const sessionRef = doc(sessionsRef, id.value)
    const username = await getUsername()
    await setDoc(sessionRef, {
      id: id.value,
      players: [
        {
          id: user.value.uid,
          username
        }
      ],
      isFull: false,
      isStarted: false,
      isFinished: false,
      creationDate: Timestamp.fromDate(date.value)
    })
    await setDoc(doc(playerTurnRef, id.value), {
      id: id.value,
      playerId: user.value.uid
    })
    await setDoc(doc(remainingTurnsRef, id.value), {
      id: id.value,
      remainingTurns: 13
    })
    await setDoc(doc(dicesRef, id.value), {
      id: id.value,
      diceOnBoard: [],
      diceOnHand: []
    })
    await setDoc(doc(playerTriesRef, id.value), {
      id: id.value,
      tries: 3
    })
    await setDoc(doc(scoresRef, id.value), {
      id: id.value,
      playerOne: initScores(),
      creationDate: Timestamp.fromDate(date.value)
    })
    checkScoreboard()
  } finally {
    reset()
  }
}

const quickJoin = async () => {
  if (!user.value) {
    notifier({ content: 'Tu dois être connecté', color: 'error' })
    return
  }
  loading.value = true
  let sessionToJoin: LocalDiceSessionType | undefined

  try {
    const username = await getUsername()
    const sessionsQuery = query(
      sessionsRef,
      where('isFull', '==', false),
      where('isStarted', '==', false)
    )
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map(doc => doc.data())
    const session = sessions.find(session =>
      session.players.find(player => player.id === user.value?.uid)
    )
    if (session) {
      notifier({
        content: 'Tu es déjà dans une session en cours',
        color: 'error'
      })
      return
    }
    if (sessions.length === 0) {
      await create()
      return
    }

    sessionToJoin = sessions[Math.floor(Math.random() * sessions.length)]
    sessionToJoin.players.push({
      id: user.value.uid,
      username
    })
    if (sessionToJoin.players.length >= 4) {
      sessionToJoin.isFull = true
    }

    const joinRemainingTurnsRef = doc(remainingTurnsRef, sessionToJoin.id)
    const joinRemainingTurnsDoc = await getDoc(joinRemainingTurnsRef)
    if (!joinRemainingTurnsDoc.exists()) {
      return
    }
    const joinRemainingTurns = joinRemainingTurnsDoc.data().remainingTurns

    await setDoc(doc(remainingTurnsRef, sessionToJoin.id), {
      id: sessionToJoin.id,
      remainingTurns: joinRemainingTurns + 13
    })
    await setDoc(doc(sessionsRef, sessionToJoin.id), sessionToJoin)

    const scoresDoc = doc(scoresRef, sessionToJoin.id)
    if (sessionToJoin.players.length === 1) {
      await setDoc(scoresDoc, { playerTwo: initScores() }, { merge: true })
    } else if (sessionToJoin.players.length === 2) {
      await setDoc(scoresDoc, { playerThree: initScores() }, { merge: true })
    } else if (sessionToJoin.players.length === 3) {
      await setDoc(scoresDoc, { playerFour: initScores() }, { merge: true })
    }
    checkScoreboard()
  } finally {
    loading.value = false
    if (sessionToJoin) {
      navigateTo(`/dice/jouer/${sessionToJoin.id}`)
    }
  }
}

const join = async (sessionId: string) => {
  if (!user.value) {
    notifier({ content: 'Tu dois être connecté', color: 'error' })
    return
  }
  loading.value = true

  try {
    const sessionRef = doc(sessionsRef, sessionId)
    const sessionDoc = await getDoc(sessionRef)
    const session = sessionDoc.data()
    const username = await getUsername()
    if (!session) {
      return
    }
    if (session.isStarted) {
      notifier({ content: 'La partie a déjà commencé', color: 'error' })
      return
    }
    if (session.players.find(player => player.id === user.value?.uid)) {
      navigateTo(`/dice/jouer/${sessionId}`)
      // notifier({ content: 'Tu es déjà dans cette session', color: 'error' })
      return
    }
    if (session.players.length >= 4) {
      notifier({ content: 'La session est pleine', color: 'error' })
      return
    }
    session.players.push({
      id: user.value.uid,
      username
    })
    if (session.players.length >= 4) {
      session.isFull = true
    }

    const joinRemainingTurnsRef = doc(remainingTurnsRef, sessionId)
    const joinRemainingTurnsDoc = await getDoc(joinRemainingTurnsRef)
    if (!joinRemainingTurnsDoc.exists()) {
      return
    }
    const joinRemainingTurns = joinRemainingTurnsDoc.data()?.remainingTurns

    await setDoc(doc(remainingTurnsRef, sessionId), {
      id: sessionId,
      remainingTurns: joinRemainingTurns + 13
    })
    await setDoc(sessionRef, session)

    if (session.players.length === 2) {
      await setDoc(
        doc(scoresRef, sessionId),
        { playerTwo: initScores() },
        { merge: true }
      )
    } else if (session.players.length === 3) {
      await setDoc(
        doc(scoresRef, sessionId),
        { playerThree: initScores() },
        { merge: true }
      )
    } else if (session.players.length === 4) {
      await setDoc(
        doc(scoresRef, sessionId),
        { playerFour: initScores() },
        { merge: true }
      )
    }
    checkScoreboard()
  } finally {
    loading.value = false
  }
}

const leave = async (sessionId: string) => {
  if (!user.value) {
    notifier({ content: 'Tu dois être connecté', color: 'error' })
    return
  }
  leaving.value = true

  try {
    const sessionRef = doc(sessionsRef, sessionId)
    const sessionDoc = await getDoc(sessionRef)
    const session = sessionDoc.data()
    const playerTurnDoc = doc(playerTurnRef, sessionId)
    const scoresDocRef = doc(scoresRef, sessionId)
    const remainingTurnsDoc = doc(remainingTurnsRef, sessionId)
    const dicesDoc = doc(dicesRef, sessionId)
    const playerTriesDoc = doc(playerTriesRef, sessionId)
    const scoresDoc = await getDoc(scoresDocRef)
    const scores = scoresDoc.data()
    if (!session) {
      return
    }
    if (!session.players.find(player => player.id === user.value?.uid)) {
      notifier({ content: "Tu n'es pas dans cette session", color: 'error' })
      return
    }
    if (session.isStarted) {
      notifier({ content: 'La partie a déjà commencé', color: 'error' })
      return
    }
    if (session.players.length === 1) {
      await deleteDoc(sessionRef)
      await deleteDoc(playerTurnDoc)
      await deleteDoc(scoresDocRef)
      await deleteDoc(remainingTurnsDoc)
      await deleteDoc(dicesDoc)
      await deleteDoc(playerTriesDoc)
      return
    }

    if (scores?.playerOne.id === user.value.uid) {
      await updateDoc(scoresDocRef, {
        playerOne: deleteField()
      })
    } else if (scores?.playerTwo.id === user.value.uid) {
      await updateDoc(scoresDocRef, {
        playerTwo: deleteField()
      })
    } else if (scores?.playerThree.id === user.value.uid) {
      await updateDoc(scoresDocRef, {
        playerThree: deleteField()
      })
    } else if (scores?.playerFour.id === user.value.uid) {
      await updateDoc(scoresDocRef, {
        playerFour: deleteField()
      })
    }
    session.players = session.players.filter(
      player => player.id !== user.value?.uid
    )

    const joinRemainingTurnsDoc = await getDoc(remainingTurnsDoc)
    if (!joinRemainingTurnsDoc.exists()) {
      return
    }
    const joinRemainingTurns = joinRemainingTurnsDoc.data()?.remainingTurns

    await setDoc(doc(remainingTurnsRef, sessionId), {
      id: sessionId,
      remainingTurns: joinRemainingTurns - 13
    })

    if (session.players.length < 4) {
      session.isFull = false
    }
    await setDoc(sessionRef, session)
  } finally {
    leaving.value = false
  }
}

const reset = () => {
  loading.value = false
  id.value = null
  date.value = new Date(Date.now())
}
</script>
