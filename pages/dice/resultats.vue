<template>
  <div>
    <Head>
      <Title>Résultats de Dice - ioTactile Games</Title>
      <Meta name="description" content="Page des résultats personnels pour le jeu Dice" />
    </Head>
    <v-container>
      <v-row>
        <v-divider class="mb-4" />
        <v-col cols="12">
          <v-table v-if="player">
            <thead>
              <tr>
                <th class="text-center">
                  Nombre de parties
                </th>
                <th class="text-center">
                  Nombre de victoire
                </th>
                <th class="text-center">
                  Pourcentage de victoire
                </th>
                <th class="text-center">
                  Score le plus haut
                </th>
                <th class="text-center">
                  Score moyen
                </th>
                <th class="text-center">
                  Score total
                </th>
                <th class="text-center">
                  Nombre de 5 identiques
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="text-center">
                  {{ player.games }}
                </td>
                <td class="text-center">
                  {{ player.victories }}
                </td>
                <td class="text-center">
                  {{ numberFormatter(player.victories / player.games * 100) || 0 }}%
                </td>
                <td class="text-center">
                  {{ player.maxScore }}
                </td>
                <td class="text-center">
                  {{ numberFormatter(player.averageScore) }}
                </td>
                <td class="text-center">
                  {{ player.totalScore }}
                </td>
                <td class="text-center">
                  {{ player.dice }}
                </td>
              </tr>
            </tbody>
          </v-table>
          <h3 v-else class="text-h6 text-sm-h5 text-center">
            Vous n'avez pas encore joué à ce jeu.
          </h3>
        </v-col>
        <v-divider class="my-4" />
        <v-btn class="mx-auto" color="buttonBack" :rounded="0" @click="toggleDiceSession">
          <span v-if="showSessions">Cacher</span>
          <span v-else>Afficher</span> les sessions
        </v-btn>
        <v-col cols="12">
          <v-table v-if="sessions && showSessions">
            <thead>
              <tr>
                <th class="text-center">
                  Partie
                </th>
                <th class="text-center">
                  Joueurs
                </th>
                <th class="text-center">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(session, i) in sessions" :key="session.id" class="scoreboard" hover @click="getScoreboard(session)">
                <td class="text-center">
                  {{ sessions.length - i }}
                </td>
                <td class="text-center">
                  <div class="d-flex flex-column flex-sm-row justify-center">
                    <div class="d-flex flex-column" :class="session.playerThree ? 'pr-sm-2' : ''">
                      <span>{{ session.playerOne.username || 'Joueur 1' }}</span>
                      <span v-if="session.playerTwo">{{ session.playerTwo.username || 'Joueur 2' }}</span>
                    </div>
                    <div class="d-flex flex-column">
                      <span v-if="session.playerThree">{{ session.playerThree.username || 'Joueur 3' }}</span>
                      <span v-if="session.playerFour">{{ session.playerFour.username || 'Joueur 4' }}</span>
                    </div>
                  </div>
                </td>
                <td class="text-center">
                  {{ dateFormatter(session.creationDate) || 'inconnue' }}
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-col>
      </v-row>

      <dice-result-scoreboard v-if="scoreboardSession" v-model="openScoreboard" :session="scoreboardSession" />
    </v-container>
  </div>
</template>

<script lang="ts" setup async>
import { VContainer, VRow, VCol, VDivider, VTable, VBtn } from 'vuetify/components'
import { doc, getDoc, collection, getDocs } from 'firebase/firestore'
import { diceScoreboardConverter, LocalDiceScoreboardType, diceSessionScoreConverter, LocalDiceSessionScoreType } from '~/stores'

// Vuefire

const db = useFirestore()
const user = useCurrentUser()

// Firestore

const sessionsRef = collection(db, 'diceSessionScores').withConverter(diceSessionScoreConverter)

// Refs

const player = ref<LocalDiceScoreboardType>()
const sessions = ref<LocalDiceSessionScoreType[]>([])
const scoreboardSession = ref<LocalDiceSessionScoreType>()
const showSessions = ref(false)
const openScoreboard = ref(false)

// onMounted

onMounted(async () => {
  if (!user.value) { return }
  const playerRef = doc(db, 'diceScoreboard', user.value.uid).withConverter(diceScoreboardConverter)
  const playerDoc = await getDoc(playerRef)
  if (!playerDoc.exists()) { return }
  player.value = playerDoc.data()
})

// Watchers

watch(openScoreboard, (newValue) => {
  if (newValue === false) {
    scoreboardSession.value = undefined
  }
})

// Methods

const getDiceSession = async () => {
  const sessionsDocs = await getDocs(sessionsRef)
  if (sessionsDocs.empty) { return }
  const sessionsData = sessionsDocs.docs.map(doc => doc.data())

  const sessionsFiltered = sessionsData.filter((session) => {
    if (
      session.playerOne.id === user.value?.uid ||
      session.playerTwo?.id === user.value?.uid ||
      session.playerThree?.id === user.value?.uid ||
      session.playerFour?.id === user.value?.uid
    ) {
      return true
    }
    return false
  })

  sessions.value = sessionsFiltered
}

const getScoreboard = async (session: LocalDiceSessionScoreType) => {
  if (!user.value) { return }
  const sessionRef = doc(sessionsRef, session.id)
  const sessionDoc = await getDoc(sessionRef)
  if (!sessionDoc.exists()) { return }

  scoreboardSession.value = sessionDoc.data()
  openScoreboard.value = true
}

const toggleDiceSession = () => {
  if (sessions.value.length === 0) {
    getDiceSession()
    showSessions.value = !showSessions.value
  } else {
    showSessions.value = !showSessions.value
  }
}

const numberFormatter = (value: number) => {
  return value.toFixed(2)
}

const dateFormatter = new Intl.DateTimeFormat('fr', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).format
</script>

<style scoped>
.scoreboard {
  cursor: pointer;
}
</style>
