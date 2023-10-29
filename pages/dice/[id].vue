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
          @desactivate-sound="desactivateSound"
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
        <dice-game-endgame-modal
          v-if="isEndgameModalActive"
          :session-id="sessionId"
          :players="session.players"
          :scores="scores.value"
          @open-endgame="isEndgameModalActive = $event"
        />
        <dice-game-rules-modal
          v-if="isRulesModalActive"
          @open-rules="isRulesModalActive = $event"
        />
        <dice-game-rules @open-rules="isRulesModalActive = $event" />
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
              :dices="dices.dices"
              :player-turn="playerTurn.playerId"
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
import { storeToRefs } from 'pinia'
import { useDiceSoundsStore } from '~/stores/diceSounds'
import {
  diceSessionConverter,
  diceSessionPlayerTurnConverter,
  diceSessionScoresConverter,
  diceSessionDicesConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionChatConverter
} from '~/stores'
import type { LocalDiceSessionScoresType } from '~/stores'
import SoundService from '~/utils/soundService'
import { diceAudioTracks as audioTracks } from '~/utils'

// Types

interface PlayerData {
  playerSheet: LocalDiceSessionScoresType['playerOne']
  playerLocation: string
}

// Vuefire

const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

const sessionId = route.params.id as string

// Firebase refs and reactive data

const sessionRef = doc(db, 'diceSessions', sessionId).withConverter(
  diceSessionConverter
)
const playerTurnRef = doc(db, 'diceSessionPlayerTurn', sessionId).withConverter(
  diceSessionPlayerTurnConverter
)
const scoresRef = doc(db, 'diceSessionScores', sessionId).withConverter(
  diceSessionScoresConverter
)
const dicesRef = doc(db, 'diceSessionDices', sessionId).withConverter(
  diceSessionDicesConverter
)
const remainingTurnsRef = doc(
  db,
  'diceSessionRemainingTurns',
  sessionId
).withConverter(diceSessionRemainingTurnsConverter)
const playerTriesRef = doc(
  db,
  'diceSessionPlayerTries',
  sessionId
).withConverter(diceSessionPlayerTriesConverter)
const chatRef = doc(db, 'diceSessionChat', sessionId).withConverter(
  diceSessionChatConverter
)

const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))
const playerTurn = useDocument(
  doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id)
)
const scores = useDocument(
  doc(collection(db, 'diceSessionScores'), scoresRef.id)
)
const dices = useDocument(doc(collection(db, 'diceSessionDices'), dicesRef.id))
const remainingTurns = useDocument(
  doc(collection(db, 'diceSessionRemainingTurns'), remainingTurnsRef.id)
)
const playerTries = useDocument(
  doc(collection(db, 'diceSessionPlayerTries'), playerTriesRef.id)
)
const chat = useDocument(doc(collection(db, 'diceSessionChat'), chatRef.id))

// Refs

const isScoreboardActive = ref<boolean>(false)
const isVolumesModalActive = ref<boolean>(false)
const isChatModalActive = ref<boolean>(false)
const isFirstVolumesModalOpen = ref<boolean>(true)
const isEndgameModalActive = ref<boolean>(false)
const isRulesModalActive = ref<boolean>(false)

const diceSoundsStore = useDiceSoundsStore()
const { isSoundEffectsActive, isNotificationsActive, isMusicActive } =
  storeToRefs(diceSoundsStore)

// Services

const soundS = new SoundService()

const activateSound = () => {
  soundS.loadSound('dice', '/dice/sounds/dice.mp3')
  soundS.loadSound('message', '/dice/sounds/message.mp3')
  soundS.loadSound('shakeRoll', '/dice/sounds/shake-and-roll.mp3')

  audioTracks.forEach((track, index) => {
    soundS.loadSound(`track-${index}`, `/dice/music/${track}`)
  })

  playRandomTrack()
}

const desactivateSound = () => {
  isSoundEffectsActive.value = false
  isNotificationsActive.value = false
  isMusicActive.value = false
}

const playRandomTrack = () => {
  const randomIndex = Math.floor(Math.random() * audioTracks.length)
  const randTrack = `track-${randomIndex}`
  soundS.playSound(randTrack)
  soundS.sounds[randTrack].on('end', () => {
    playRandomTrack()
  })
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

const playerData = computed((): PlayerData => {
  let playerSheet
  let playerLocation = ''

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
    playerLocation
  }
})

const scoreboard = computed(() => {
  const scoreboard = scores.value
  const newScoreboard: LocalDiceSessionScoresType['playerOne'][] = []
  if (scoreboard!.playerOne) newScoreboard.push(scoreboard!.playerOne)
  if (scoreboard?.playerTwo) newScoreboard.push(scoreboard!.playerTwo)
  if (scoreboard?.playerThree) newScoreboard.push(scoreboard!.playerThree)
  if (scoreboard?.playerFour) newScoreboard.push(scoreboard!.playerFour)
  return newScoreboard
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
  { immediate: true }
)

watch(
  () => session.value?.isFinished,
  (isFinished) => {
    if (isFinished) {
      isEndgameModalActive.value = true
    }
  },
  { immediate: true }
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
