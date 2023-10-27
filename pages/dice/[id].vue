<template>
  <div>
    <Head>
      <Title>Session Dice - ioTactile Games</Title>
      <Meta name="description" content="Page d'une session de jeu Dice" />
    </Head>
    <dice-template
      v-if="
        session &&
        playerTurn &&
        scores &&
        dices &&
        remainingTurns &&
        playerTries
      "
    >
      <div class="pa-8">
        <div class="left-background" />
        <div class="d-flex justify-space-between mb-4">
          <dice-game-players :players="session.players" />
          <div>
            <dice-game-volumes />
            <dice-game-chat />
          </div>
        </div>
        <div class="d-flex">
          <div class="left-side-wrapper">
            <dice-game-scoreboard
              v-if="isScoreboardActive"
              :scoreboard="scoreboard"
              @update:is-scoreboard-active="isScoreboardActive = $event"
            />
            <dice-game-playersheet
              v-else
              :session-id="sessionId"
              :is-player-turn="isPlayerTurn"
              :dices="dices.dices"
              :player-data="playerData"
              :player-turn-id="playerTurn.playerId"
              :players="session.players"
              :remaining-turns="remainingTurns.remainingTurns"
              @update:is-scoreboard-active="isScoreboardActive = $event"
            />
          </div>
          <div class="right-side-wrapper">
            <dice-game-board
              :session-id="sessionId"
              :is-player-turn="isPlayerTurn"
              :dices="dices.dices"
            />
            <dice-game-dices
              :session-id="sessionId"
              :is-player-turn="isPlayerTurn"
              :dices="dices.dices"
              :player-tries="playerTries.tries"
              :session-is-started="session.isStarted"
              :session-is-finished="session.isFinished"
            />
          </div>
        </div>
      </div>
    </dice-template>
  </div>
</template>

<script setup lang="ts">
import { collection, doc } from 'firebase/firestore'
import {
  diceSessionConverter,
  diceSessionPlayerTurnConverter,
  diceSessionScoresConverter,
  diceSessionDicesConverter,
  diceSessionRemainingTurnsConverter,
} from '~/stores'
import type { LocalDiceSessionScoresType } from '~/stores'

// Vuefire

const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

const sessionId = route.params.id as string

// Firebase refs and reactive data

const sessionRef = doc(db, 'diceSessions', sessionId).withConverter(
  diceSessionConverter,
)
const playerTurnRef = doc(db, 'diceSessionPlayerTurn', sessionId).withConverter(
  diceSessionPlayerTurnConverter,
)
const scoresRef = doc(db, 'diceSessionScores', sessionId).withConverter(
  diceSessionScoresConverter,
)
const dicesRef = doc(db, 'diceSessionDices', sessionId).withConverter(
  diceSessionDicesConverter,
)
const remainingTurnsRef = doc(
  db,
  'diceSessionRemainingTurns',
  sessionId,
).withConverter(diceSessionRemainingTurnsConverter)
const playerTriesRef = doc(
  db,
  'diceSessionPlayerTries',
  sessionId,
).withConverter(diceSessionPlayerTriesConverter)

const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))
const playerTurn = useDocument(
  doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id),
)
const scores = useDocument(
  doc(collection(db, 'diceSessionScores'), scoresRef.id),
)
const dices = useDocument(doc(collection(db, 'diceSessionDices'), dicesRef.id))
const remainingTurns = useDocument(
  doc(collection(db, 'diceSessionRemainingTurns'), remainingTurnsRef.id),
)
const playerTries = useDocument(
  doc(collection(db, 'diceSessionPlayerTries'), playerTriesRef.id),
)

// Refs

const isScoreboardActive = ref<boolean>(false)

// Computed

const isPlayerTurn = computed(() => {
  if (playerTurn.value?.playerId === user.value?.uid) {
    return true
  } else {
    return false
  }
})

const playerData = computed(() => {
  let playerSheet: LocalDiceSessionScoresType['playerOne'] | null = null
  let playerLocation: string | null = null

  if (scores.value) {
    if (scores.value.playerOne.id === user.value?.uid) {
      playerSheet = scores.value.playerOne
      playerLocation = 'playerOne'
    } else if (scores.value.playerTwo?.id === user.value?.uid) {
      playerSheet = scores.value.playerTwo
      playerLocation = 'playerTwo'
    } else if (scores.value.playerThree?.id === user.value?.uid) {
      playerSheet = scores.value.playerThree
      playerLocation = 'playerThree'
    } else if (scores.value.playerFour?.id === user.value?.uid) {
      playerSheet = scores.value.playerFour
      playerLocation = 'playerFour'
    }
  }

  return {
    playerSheet,
    playerLocation,
  }
})

const scoreboard = computed(() => {
  const scoreboard = scores.value
  if (!scoreboard) {
    return null
  }
  delete scoreboard.id
  delete scoreboard.creationDate
  return scoreboard as Omit<LocalDiceSessionScoresType, 'id' | 'creationDate'>
})

// Watchers

watch(
  () => playerTurn.value?.playerId,
  (playerId) => {
    if (playerId === user.value?.uid) {
      isScoreboardActive.value = false
    } else {
      isScoreboardActive.value = true
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.left-background {
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 500px;
  height: 800px;
  background-color: rgb(var(--v-theme-diceMainSecondary));
  border-radius: 8px;
}

.left-side-wrapper {
  width: 500px;
  height: 655px;
}

.right-side-wrapper {
  width: 700px;
  height: 655px;
}
</style>
