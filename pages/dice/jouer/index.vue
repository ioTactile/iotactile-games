<template>
  <v-container>
    <v-row>
      <v-divider class="mb-4" />
      <v-col cols="6" class="text-end">
        <v-btn variant="flat" color="tertiary" :loading="loading" @click="quickJoin">
          Partie rapide
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-start">
        <v-btn variant="flat" color="tertiary" :loading="loading" @click="create">
          Créer une session
        </v-btn>
      </v-col>
      <v-divider class="mt-4" />
      <v-col cols="12" class="text-h4 my-4" align="center">
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
            <v-btn color="error" :loading="leaving" @click="leave(session.id)">
              Quitter
            </v-btn>
            <v-btn
              v-if="!session.isFull && session.players[0].id !== user?.uid"
              color="tertiary"
              :loading="loading"
              @click="join(session.id)"
            >
              {{ session.isFull ? 'Session pleine' : 'Rejoindre' }}
            </v-btn>
            <v-btn
              v-if="
                session.players.length > 1 &&
                  session.players[0].id === user?.uid
              "
              color="tertiary"
              variant="outlined"
              :loading="loading"
              @click="goTo(session.id)"
            >
              Rejoindre
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
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
import { diceSessionConverter, LocalDiceSessionType } from '~/stores'

const { notifier } = useNotifier()
const user = useCurrentUser()
const db = useFirestore()
const id = ref<string | null>(null)
const date = ref(new Date(Date.now()))

const loading = ref(false)
const leaving = ref(false)
const sessionsRef = collection(db, 'diceSessions').withConverter(diceSessionConverter)
// const sessions = useCollection(collection(db, 'diceSessions'))
const sessionsStartedQuery = query(sessionsRef, where('isStarted', '==', false))
const sessionsNotStarted = useCollection(sessionsStartedQuery)
const playerTurnRef = collection(db, 'diceSessionPlayerTurn')
const scoresRef = collection(db, 'diceSessionScores')

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
    subtotal: 0,
    upperTotal: 0,
    threeOfAKind: 69,
    fourOfAKind: 69,
    fullHouse: 69,
    smallStraight: 69,
    largeStraight: 69,
    chance: 69,
    dice: 69,
    lowerTotal: 0,
    total: 0
  }

  return scores
}

const goTo = (sessionId: string) => {
  navigateTo(`/dice/jouer/${sessionId}`)
}

const create = async () => {
  if (!user.value) {
    notifier({ content: 'Tu dois être connecté', color: 'error' })
    return
  }
  loading.value = true
  id.value = doc(sessionsRef).id
  const username = await getUsername()

  try {
    const sessionsQuery = query(sessionsRef, where('isFull', '==', false))
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map(doc => doc.data())
    const session = sessions.find(session => session.players.find(player => player.id === user.value?.uid))
    if (session?.isFinished === false) {
      notifier({ content: 'Tu es déjà dans une session non terminée', color: 'error' })
      return
    }
    const sessionRef = doc(sessionsRef, id.value)
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
      remainingTurns: 13,
      playerTries: 3,
      diceOnBoard: [],
      diceOnHand: [],
      creationDate: Timestamp.fromDate(date.value)
    })
    await setDoc(doc(playerTurnRef, id.value), {
      id: id.value,
      playerId: user.value.uid
    })
    await setDoc(doc(scoresRef, id.value), {
      id: id.value,
      playerOne: initScores()
    })
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
    const sessionsQuery = query(sessionsRef, where('isFull', '==', false))
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map(
      doc => doc.data() as LocalDiceSessionType
    )
    const session = sessions.find(session =>
      session.players.find(player => player.id === user.value?.uid)
    )
    if (session) {
      notifier({ content: 'Tu es déjà dans une session', color: 'error' })
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
    sessionToJoin.remainingTurns = sessionToJoin.remainingTurns + 13
    if (sessionToJoin.players.length >= 4) {
      sessionToJoin.isFull = true
    }
    if (sessionToJoin.isStarted) {
      notifier({ content: 'La partie a déjà commencé', color: 'error' })
      return
    }
    await setDoc(doc(sessionsRef, sessionToJoin.id), sessionToJoin)
    if (sessionToJoin.players.length === 1) {
      await setDoc(
        doc(scoresRef, sessionToJoin.id),
        { playerTwo: initScores() },
        { merge: true }
      )
    } else if (sessionToJoin.players.length === 2) {
      await setDoc(
        doc(scoresRef, sessionToJoin.id),
        { playerThree: initScores() },
        { merge: true }
      )
    } else if (sessionToJoin.players.length === 3) {
      await setDoc(
        doc(scoresRef, sessionToJoin.id),
        { playerFour: initScores() },
        { merge: true }
      )
    }
  } finally {
    loading.value = false
    if (sessionToJoin) {
      navigateTo(`/dice/jouer/${sessionToJoin.id}`)
    }
  }
}

const join = async (sessionId: string) => {
  if (!user.value) {
    return
  }
  loading.value = true

  try {
    const sessionRef = doc(sessionsRef, sessionId)
    const sessionDoc = await getDoc(sessionRef)
    const session = sessionDoc.data() as LocalDiceSessionType
    const username = await getUsername()
    if (!session) {
      return
    }
    if (session.players.find(player => player.id === user.value?.uid)) {
      notifier({ content: 'Tu es déjà dans cette session', color: 'error' })
      return
    }
    if (session.players.length >= 4) {
      return
    }
    session.players.push({
      id: user.value.uid,
      username
    })
    session.remainingTurns = session.remainingTurns + 13
    if (session.players.length >= 4) {
      session.isFull = true
    }
    if (session.isStarted) {
      notifier({ content: 'La partie a déjà commencé', color: 'error' })
      return
    }
    await setDoc(sessionRef, session)
    if (session.players.length === 2) {
      await setDoc(
        doc(scoresRef, session.id),
        { playerTwo: initScores() },
        { merge: true }
      )
    } else if (session.players.length === 3) {
      await setDoc(
        doc(scoresRef, session.id),
        { playerThree: initScores() },
        { merge: true }
      )
    } else if (session.players.length === 4) {
      await setDoc(
        doc(scoresRef, session.id),
        { playerFour: initScores() },
        { merge: true }
      )
    }
  } finally {
    loading.value = false
    navigateTo(`/dice/jouer/${sessionId}`)
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
    const session = sessionDoc.data() as LocalDiceSessionType
    const playerTurnRef = doc(
      collection(db, 'diceSessionPlayerTurn'),
      sessionId
    )
    const scoresRef = doc(collection(db, 'diceSessionScores'), sessionId)
    const scoresDoc = await getDoc(scoresRef)
    const scores = scoresDoc.data()
    if (!session) {
      return
    }
    if (scores?.playerOne.id === user.value.uid) {
      await updateDoc(scoresRef, {
        playerOne: deleteField()
      })
    } else if (scores?.playerTwo.id === user.value.uid) {
      await updateDoc(scoresRef, {
        playerTwo: deleteField()
      })
    } else if (scores?.playerThree.id === user.value.uid) {
      await updateDoc(scoresRef, {
        playerThree: deleteField()
      })
    } else if (scores?.playerFour.id === user.value.uid) {
      await updateDoc(scoresRef, {
        playerFour: deleteField()
      })
    }
    session.players = session.players.filter(
      player => player.id !== user.value?.uid
    )
    session.remainingTurns = session.remainingTurns - 13

    if (session.players.length === 0) {
      await deleteDoc(sessionRef)
      await deleteDoc(playerTurnRef)
      await deleteDoc(scoresRef)
      return
    }
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
