<template>
  <div>
    <Head>
      <Title>Jouer à Lingua Vault - ioTactile Games</Title>
      <Meta name="description" content="Page pour jouer à Lingua Vault" />
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
        <v-col v-if="sessionsNotStarted.length > 0" cols="12" class="text-h4 my-4" align="center">
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
              <div class="d-flex justify-space-between text-h6">
                <span>Joueur 1:</span>
                <span>{{ session.playerOne.username }}</span>
              </div>
              <div v-if="session.playerTwo" class="d-flex justify-space-between text-h6">
                <span>Joueur 2:</span>
                <span>{{ session.playerTwo.username }}</span>
              </div>
            </v-card-text>
            <v-card-actions class="d-flex justify-space-between">
              <v-btn color="error" :loading="leaving" @click="leave(session.id)">
                Quitter
              </v-btn>
              <v-btn color="tertiary" :loading="loading" @click="join(session.id)">
                Rejoindre
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
        <template v-if="sessionStarted.length > 0">
          <v-divider v-if="sessionsNotStarted.length > 0" class="mt-4" />
          <v-col cols="12" class="text-h4 my-4" align="center">
            <span>{{ sessionStarted.length === 1 ? 'Partie' : 'Parties' }} en cours</span>
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
                <div class="d-flex justify-space-between text-h6">
                  <span>Joueur 1:</span>
                  <span>{{ session.playerOne.username }}</span>
                </div>
                <div v-if="session.playerTwo" class="d-flex justify-space-between text-h6">
                  <span>Joueur 2:</span>
                  <span>{{ session.playerTwo.username }}</span>
                </div>
              </v-card-text>
              <v-card-actions class="d-flex justify-end">
                <v-btn color="tertiary" :loading="loading" @click="join(session.id)">
                  Rejoindre
                </v-btn>
              </v-card-actions>
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
  where,
  onSnapshot
} from 'firebase/firestore'
import {
  linguaVaultSessionConverter,
  linguaVaultSessionWordsConverter,
  linguaVaultScoreboardConverter,
  linguaVaultSessionRemainingTurnsConverter,
  linguaVaultSessionPlayerTurnConverter,
  LocalLinguaVaultSessionType
} from '~/stores'
import { Word } from '~/functions/src/types'

// Vuefire & Composables

const { notifier } = useNotifier()
const user = useCurrentUser()
const db = useFirestore()

// Firestore

const sessionsRef = collection(db, 'linguaVaultSessions').withConverter(linguaVaultSessionConverter)

const sessionsNotStarted = useCollection(query(sessionsRef, where('isStarted', '==', false)))

const sessionStarted = useCollection(
  query(sessionsRef, where('isStarted', '==', true), where('isFinished', '==', false))
)

const scoreboardRef = collection(db, 'linguaVaultScoreboard').withConverter(
  linguaVaultScoreboardConverter
)

// Refs

const id = ref<string | null>(null)
const date = ref(new Date(Date.now()))
const loading = ref(false)
const leaving = ref(false)

// Methods

const getRandomWords = async (sessionId: string): Promise<string[]> => {
  const wordsRef = doc(db, 'linguaVaultWords', 'AI8rozWXYEmchhc1pwar')
  const wordsDoc = await getDoc(wordsRef)
  if (!wordsDoc.exists()) {
    return []
  }
  const words = wordsDoc.data().words
  const sessionRef = doc(db, 'linguaVaultSessions', sessionId)
  const sessionDoc = await getDoc(sessionRef)
  const session = sessionDoc.data()
  const playerOneId = session?.playerOne.id
  const playerTwoId = session?.playerTwo?.id

  const playerOneScoreboardRef = doc(db, 'linguaVaultScoreboard', playerOneId)
  const playerOneScoreboardDoc = await getDoc(playerOneScoreboardRef)
  const playerOneScoreboard = playerOneScoreboardDoc.data()

  const playerTwoScoreboardRef = doc(db, 'linguaVaultScoreboard', playerTwoId)
  const playerTwoScoreboardDoc = await getDoc(playerTwoScoreboardRef)
  const playerTwoScoreboard = playerTwoScoreboardDoc.data()

  const playerOneTotalScore =
    playerOneScoreboard?.scoreToGuess + playerOneScoreboard?.scoreToPropose
  const playerTwoTotalScore =
    playerTwoScoreboard?.scoreToGuess + playerTwoScoreboard?.scoreToPropose

  const playerOneListWords = words.filter(
    (word: Word) =>
      word.difficulty >= playerOneTotalScore - 1000 && word.difficulty <= playerOneTotalScore + 1000
  )
  const playerTwoListWords = words.filter(
    (word: Word) =>
      word.difficulty >= playerTwoTotalScore - 1000 && word.difficulty <= playerTwoTotalScore + 1000
  )

  const playerOneRandomWords = playerOneListWords
    .sort(() => Math.random() - Math.random())
    .slice(0, 2)
  const playerTwoRandomWords = playerTwoListWords
    .sort(() => Math.random() - Math.random())
    .slice(0, 2)

  return [
    playerOneRandomWords[0],
    playerTwoRandomWords[0],
    playerOneRandomWords[1],
    playerTwoRandomWords[1]
  ]
}

const checkScoreboard = async () => {
  const scoreboardQuery = query(scoreboardRef, where('userId', '==', user.value?.uid))
  const scoreboardSnapshot = await getDocs(scoreboardQuery)
  const scoreboard = scoreboardSnapshot.docs.map(doc => doc.data())
  if (scoreboard.length === 0) {
    const username = await getUsername()
    await setDoc(doc(scoreboardRef, user.value?.uid), {
      userId: user.value!.uid,
      username,
      rounds: 0,
      roundsWon: 0,
      scoreToGuess: 1000,
      scoreToPropose: 1000
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

const create = async () => {
  if (!user.value) {
    notifier({ content: 'Tu dois être connecté', color: 'error' })
    return
  }
  loading.value = true
  id.value = doc(sessionsRef).id

  try {
    const sessionsQuery = query(
      sessionsRef,
      where('isFinished', '==', false),
      where('isStarted', '==', true)
    )
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map(doc => doc.data())
    const userInSession = sessions.find(
      session =>
        session.playerOne.id === user.value?.uid || session.playerTwo?.id === user.value?.uid
    )
    if (userInSession) {
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
      playerOne: {
        id: user.value.uid,
        username,
        isFinder: true
      },
      isFull: false,
      isStarted: false,
      isFinished: false,
      isRoundFinished: false,
      isPlayerOneContinue: null,
      isPlayerTwoContinue: null,
      creationDate: Timestamp.fromDate(date.value)
    })

    await setDoc(doc(db, 'linguaVaultSessions', id.value, 'playerTurn', id.value), {
      id: id.value,
      playerId: user.value.uid
    })

    await checkScoreboard()
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
  let sessionToJoin: LocalLinguaVaultSessionType | undefined

  try {
    const username = await getUsername()
    const sessionsQuery = query(
      sessionsRef,
      where('isFull', '==', false),
      where('isStarted', '==', false)
    )
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map(doc => doc.data())
    const userInSession = sessions.find(
      session =>
        session.playerOne.id === user.value?.uid || session.playerTwo?.id === user.value?.uid
    )
    if (userInSession) {
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
    await updateDoc(doc(sessionsRef, sessionToJoin.id), {
      playerTwo: {
        id: user.value.uid,
        username,
        isFinder: false
      },
      isFull: true
    })
    await checkScoreboard()
    const words = await getRandomWords(sessionToJoin.id)
    await setDoc(doc(db, 'linguaVaultSessions', sessionToJoin.id, 'words', sessionToJoin.id), {
      id: sessionToJoin.id,
      words
    })
    await setDoc(
      doc(db, 'linguaVaultSessions', sessionToJoin.id, 'remainingTurns', sessionToJoin.id),
      {
        id: sessionToJoin.id,
        remainingTurns: 4
      }
    )
  } finally {
    loading.value = false
    if (sessionToJoin) {
      navigateTo(`/lingua-vault/jouer/${sessionToJoin.id}`)
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
    if (session.playerOne.id === user.value?.uid || session.playerTwo?.id === user.value?.uid) {
      navigateTo(`/lingua-vault/jouer/${sessionId}`)
      return
    }
    if (session.isStarted) {
      notifier({ content: 'La partie a déjà commencé', color: 'error' })
      return
    }

    await updateDoc(sessionRef, {
      playerTwo: {
        id: user.value.uid,
        username,
        isFinder: false
      },
      isFull: true
    })

    await checkScoreboard()

    const words = await getRandomWords(sessionId)

    await setDoc(doc(db, 'linguaVaultSessions', sessionId, 'words', sessionId), {
      id: sessionId,
      words
    })

    await setDoc(doc(db, 'linguaVaultSessions', sessionId, 'remainingTurns', sessionId), {
      id: sessionId,
      remainingTurns: 4
    })
  } finally {
    loading.value = false
    navigateTo(`/lingua-vault/jouer/${sessionId}`)
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
    if (!session) {
      return
    }
    const wordsRef = doc(db, 'linguaVaultSessions', sessionId, 'words', sessionId).withConverter(
      linguaVaultSessionWordsConverter
    )
    const remainingTurnsRef = doc(
      db,
      'linguaVaultSessions',
      sessionId,
      'remainingTurns',
      sessionId
    ).withConverter(linguaVaultSessionRemainingTurnsConverter)
    const playerTurnRef = doc(
      db,
      'linguaVaultSessions',
      sessionId,
      'playerTurn',
      sessionId
    ).withConverter(linguaVaultSessionPlayerTurnConverter)

    if (session.playerOne.id === user.value?.uid) {
      await deleteDoc(sessionRef)
      await deleteDoc(wordsRef)
      await deleteDoc(remainingTurnsRef)
      await deleteDoc(playerTurnRef)
    } else if (session.playerTwo?.id === user.value?.uid) {
      await updateDoc(sessionRef, {
        playerTwo: deleteField(),
        isFull: false
      })
    }
  } finally {
    leaving.value = false
  }
}

const reset = () => {
  loading.value = false
  id.value = null
  date.value = new Date(Date.now())
}

// WatchEffect

watchEffect(() => {
  const idValue = id.value
  if (idValue) {
    const unsubscribe = onSnapshot(doc(sessionsRef, idValue), async (snapshot) => {
      const session = snapshot.data()
      if (!session) {
        return
      }
      if (session.playerTwo && !session.isStarted) {
        await updateDoc(doc(sessionsRef, session.id), {
          isStarted: true
        })
        navigateTo(`/lingua-vault/jouer/${session.id}`)
      }
    })

    return () => unsubscribe()
  }
})
</script>
