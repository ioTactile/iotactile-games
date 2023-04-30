<template>
  <v-container>
    <v-row>
      <v-divider class="mb-4" />
      <v-col cols="6" class="text-end">
        <v-btn variant="flat" color="tertiary" @click="joinRandomSession">
          Partie rapide
        </v-btn>
      </v-col>
      <v-col cols="6" class="text-start">
        <v-btn variant="flat" color="tertiary" @click="create">
          Créer une session
        </v-btn>
      </v-col>
      <v-divider class="mt-4" />
      <v-col cols="12" class="text-h4 my-4" align="center">
        <span>Rejoindre une session</span>
      </v-col>
      <v-col
        v-for="(session, i) in sessions"
        :key="i"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-card-title class="text-h5 text-center">
            <span>Session {{ i + 1 }}</span>
          </v-card-title>
          <v-card-text>
            <div v-for="(player, j) in session.players" :key="j" class="d-flex justify-space-between text-h6">
              <span>Joueur {{ j + 1 }}:</span>
              <span>{{ player.username }}</span>
            </div>
          </v-card-text>
          <v-card-actions class="d-flex justify-space-between">
            <v-btn
              color="error"
              @click="leave(session.id)"
            >
              Quitter
            </v-btn>
            <v-btn
              v-if="!session.isFull && session.players[0].id !== user?.uid"
              color="tertiary"
              @click="join(session.id)"
            >
              {{ session.isFull ? 'Session pleine' : 'Rejoindre' }}
            </v-btn>
            <v-btn
              v-if="session.players.length > 1 && session.players[0].id === user?.uid"
              color="tertiary"
              variant="outlined"
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
import { Timestamp, collection, doc, setDoc, getDoc, getDocs, deleteDoc, query, where } from 'firebase/firestore'
import { useFirestore } from 'vuefire'
import { diceSessionConverter, LocalDiceSessionType } from '~/stores'

const { notifier } = useNotifier()
const user = useCurrentUser()
const db = useFirestore()
const id = ref<string | null>(null)
const date = ref(new Date(Date.now()))

const loading = ref(false)
const sessionsRef = collection(db, 'diceSessions').withConverter(diceSessionConverter)
const sessions = useCollection(collection(db, 'diceSessions'))

const getUsername = async () => {
  if (!user.value) { return }
  const userRef = doc(db, 'users', user.value.uid)
  const userDoc = await getDoc(userRef)
  if (!userDoc.exists()) { return }
  return userDoc.data()?.username
}

const goTo = (sessionId: string) => {
  navigateTo(`/dice/jouer/${sessionId}`)
}

const create = async () => {
  if (!user.value) { return }
  loading.value = true
  id.value = doc(sessionsRef).id
  const username = await getUsername()

  try {
    const sessionsQuery = query(sessionsRef, where('isFull', '==', false))
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map(doc => doc.data() as LocalDiceSessionType)
    const session = sessions.find(session => session.players.find(player => player.id === user.value?.uid))
    if (session) {
      notifier({ content: 'Vous êtes déjà dans une session', color: 'error' })
      return
    }
    const sessionRef = doc(sessionsRef, id.value)
    await setDoc(sessionRef, {
      id: id.value,
      players: [{
        id: user.value.uid,
        username,
        isReady: false
      }],
      isFull: false,
      isStarted: false,
      isFinished: false,
      creationDate: Timestamp.fromDate(date.value)
    })
  } finally {
    reset()
  }
}

const joinRandomSession = async () => {
  if (!user.value) { return }
  loading.value = true

  try {
    const username = await getUsername()
    const sessionsQuery = query(sessionsRef, where('isFull', '==', false))
    const sessionsSnapshot = await getDocs(sessionsQuery)
    const sessions = sessionsSnapshot.docs.map(doc => doc.data() as LocalDiceSessionType)
    const session = sessions.find(session => session.players.find(player => player.id === user.value?.uid))
    if (session) {
      notifier({ content: 'Vous êtes déjà dans une session', color: 'error' })
      return
    }
    if (sessions.length === 0) {
      await create()
      return
    }
    const sessionToJoin = sessions[Math.floor(Math.random() * sessions.length)]
    sessionToJoin.players.push({
      id: user.value.uid,
      username,
      isReady: false
    })
    if (sessionToJoin.players.length >= 4) {
      sessionToJoin.isFull = true
    }
    await setDoc(doc(sessionsRef, sessionToJoin.id), sessionToJoin)
  } finally {
    loading.value = false
    navigateTo(`/dice/jouer/${sessionToJoin.id}`)
  }
}

const join = async (sessionId: string) => {
  if (!user.value) { return }
  loading.value = true

  try {
    const sessionRef = doc(sessionsRef, sessionId)
    const sessionDoc = await getDoc(sessionRef)
    const session = sessionDoc.data() as LocalDiceSessionType
    const username = await getUsername()
    if (!session) { return }
    if (session.players.find(player => player.id === user.value?.uid)) {
      notifier({ content: 'Vous êtes déjà dans cette session', color: 'error' })
      return
    }
    if (session.players.length >= 4) { return }
    session.players.push({
      id: user.value.uid,
      username,
      isReady: false
    })
    if (session.players.length >= 4) {
      session.isFull = true
    }
    await setDoc(sessionRef, session)
  } finally {
    loading.value = false
    navigateTo(`/dice/jouer/${sessionId}`)
  }
}

const leave = async (sessionId: string) => {
  if (!user.value) { return }
  loading.value = true

  try {
    const sessionRef = doc(sessionsRef, sessionId)
    const sessionDoc = await getDoc(sessionRef)
    const session = sessionDoc.data() as LocalDiceSessionType
    if (!session) { return }
    session.players = session.players.filter(player => player.id !== user.value?.uid)
    if (session.players.length === 0) {
      await deleteDoc(sessionRef)
      return
    }
    if (session.players.length < 4) {
      session.isFull = false
    }
    await setDoc(sessionRef, session)
  } finally {
    loading.value = false
  }
}

const reset = () => {
  loading.value = false
  id.value = null
  date.value = new Date(Date.now())
}
</script>
