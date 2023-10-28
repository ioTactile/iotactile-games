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
        <dice-game-first-volumes-modal
          v-if="isFirstVolumesModalOpen"
          @open-modal="isFirstVolumesModalOpen = $event"
          @activate-sound="activateSound"
        />
        <dice-game-volumes-modal
          v-if="isVolumesModalActive"
          :sound-service="soundS"
          @open-volumes="isVolumesModalActive = $event"
        />
        <dice-game-chat-modal
          v-if="isChatModalActive"
          :session-id="sessionId"
          :chat-messages="chat?.messages"
          :players="session.players"
          @open-chat="isChatModalActive = $event"
        />
        <div class="d-flex justify-space-between mb-4">
          <dice-game-players :players="session.players" />
          <div>
            <dice-game-volumes @open-volumes="isVolumesModalActive = $event" />
            <dice-game-chat
              :chat-messages="chat?.messages"
              :is-chat-active="isChatModalActive"
              :sound-service="soundS"
              @open-chat="isChatModalActive = $event"
            />
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
              :player-tries="playerTries.tries"
              :sound-service="soundS"
            />
            <dice-game-dices
              :session-id="sessionId"
              :is-player-turn="isPlayerTurn"
              :dices="dices.dices"
              :player-tries="playerTries.tries"
              :session-is-started="session.isStarted"
              :session-is-finished="session.isFinished"
              :sound-service="soundS"
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
  diceSessionChatConverter,
} from '~/stores'
import type { LocalDiceSessionScoresType } from '~/stores'
import SoundService from '~/utils/soundService'

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
const chatRef = doc(db, 'diceSessionChat', sessionId).withConverter(
  diceSessionChatConverter,
)

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
const chat = useDocument(doc(collection(db, 'diceSessionChat'), chatRef.id))

// Refs

const isScoreboardActive = ref<boolean>(false)
const isVolumesModalActive = ref<boolean>(false)
const isChatModalActive = ref<boolean>(false)
const isFirstVolumesModalOpen = ref<boolean>(true)

// Services

const soundS = new SoundService()

const activateSound = () => {
  soundS.loadSound('dice', '/dice/sounds/dice.mp3')
  soundS.loadSound('message', '/dice/sounds/message.mp3')
  soundS.loadSound('shakeRoll', '/dice/sounds/shake-and-roll.mp3')
}

onBeforeRouteLeave(() => {
  soundS.stopAllSounds()
})

// Computed

const isPlayerTurn = computed(() => {
  if (playerTurn.value?.playerId === user.value?.uid) {
    return true
  } else {
    return false
  }
})

const playerData = computed(() => {
  let playerSheet: LocalDiceSessionScoresType['playerOne']
  let playerLocation: string

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
