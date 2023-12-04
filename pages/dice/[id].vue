<template>
  <dice-template
    v-if="
      session && playerTurn && scores && dices && remainingTurns && playerTries
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
        :sound-service="soundService"
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
        :scoreboard="scoreboard"
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
            :sound-service="soundService"
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
            :sound-service="soundService"
          />
          <dice-game-dices
            :session-id="sessionId"
            :is-player-turn="isPlayerTurn"
            :dices="dices.dices"
            :player-tries="playerTries.tries"
            :session-is-started="session.isStarted"
            :session-is-finished="session.isFinished"
            :sound-service="soundService"
          />
        </div>
      </div>
    </div>
  </dice-template>
</template>

<script setup lang="ts">
import { collection, doc, updateDoc } from 'firebase/firestore'
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
import { SoundService } from '~/utils/music/soundService'
import type { ISoundService } from '~/utils/music/soundService'
import { sleep } from '~/utils'

interface PlayerData {
  playerSheet: LocalDiceSessionScoresType['playerOne']
  playerLocation: string
}

const route = useRoute()
const sessionId = route.params.id as string

useSeoMeta({
  title: 'Session Dice - ioTactile Games',
  ogTitle: 'Session Dice - ioTactile Games',
  twitterTitle: 'Session Dice - ioTactile Games',
  description: 'Session de jeu Dice',
  ogDescription: 'Session de jeu Dice',
  twitterDescription: 'Session de jeu Dice',
  ogImage: '/dice/dice.png',
  twitterImage: '/dice/dice.png',
  twitterCard: 'summary_large_image',
  ogUrl: `https://iotactile.games/dice/${sessionId}`
})

useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png'
    }
  ]
})

definePageMeta({
  middleware: ['auth']
})

const db = useFirestore()
const user = useCurrentUser()

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

const isScoreboardActive = ref<boolean>(false)
const isVolumesModalActive = ref<boolean>(false)
const isChatModalActive = ref<boolean>(false)
const isFirstVolumesModalOpen = ref<boolean>(true)
const isEndgameModalActive = ref<boolean>(false)
const isRulesModalActive = ref<boolean>(false)

const diceSoundsStore = useDiceSoundsStore()
const { isSoundEffectsActive, isNotificationsActive } =
  storeToRefs(diceSoundsStore)

const soundService = ref<ISoundService>(new SoundService())

const activateSound = () => {
  isSoundEffectsActive.value = true
  isNotificationsActive.value = true
  loadSounds(1)
}

const desactivateSound = () => {
  isSoundEffectsActive.value = false
  isNotificationsActive.value = false
  loadSounds(0)
}

const loadSounds = (volume: number) => {
  soundService.value.loadSound('dice', '/dice/sounds/dice.mp3', volume)
  soundService.value.loadSound('message', '/dice/sounds/message.mp3', volume)
  soundService.value.loadSound(
    'shakeRoll',
    '/dice/sounds/shake-and-roll.mp3',
    volume
  )
}

onBeforeRouteLeave(() => {
  soundService.value.stopAllSounds()
  soundService.value.unloadAllSounds()
})

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

watch(
  () => playerTurn.value?.playerId,
  async (playerId) => {
    if (!session.value?.isFinished) {
      if (playerId === user.value?.uid) {
        await sleep(2000)
        isScoreboardActive.value = false
      } else {
        isScoreboardActive.value = true
      }
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

watch(
  () => remainingTurns.value?.remainingTurns,
  async (newValue, oldValue) => {
    if (oldValue !== undefined && newValue !== undefined && newValue === 0) {
      if (oldValue !== newValue) {
        await updateDoc(sessionRef, {
          isFinished: true
        })
      }
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
  border-radius: 8px 0 0 8px;
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
~/utils/music/soundService
