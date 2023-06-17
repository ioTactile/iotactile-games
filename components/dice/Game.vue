<template>
  <v-container v-if="session && playerTurn && dices && remainingTurns" fluid class="container">
    <v-row>
      <v-col cols="12" md="9">
        <div ref="fullscreenElement" class="background-image" :class="isFullscreen ? 'fullscreen' : 'notFullscreen'">
          <div class="fullscreen-btn">
            <v-btn :icon="isFullscreen ? mdiFullscreenExit : mdiFullscreen" variant="text" size="x-large" @click="toggleFullscreen" />
          </div>
          <v-row class="ma-0" :class="{'h-100' : isFullscreen}">
            <v-col class="d-flex" cols="12">
              <dice-players
                :players="session.players"
                :is-finished="session.isFinished"
                :player-turn-id="playerTurn.playerId"
              />
            </v-col>
            <v-col cols="12" md="6">
              <dice-board
                :is-fullscreen="isFullscreen"
                :players="session.players"
                :player-turn-id="playerTurn.playerId"
                :remaining-turns="remainingTurns.remainingTurns"
                :dices="dices.dices"
              />
            </v-col>
            <v-col cols="12" md="6" class="right-side-container pb-0">
              <v-row class="h-100">
                <v-col cols="10">
                  <div v-if="shakeClass" class="mt-16 ml-16">
                    <v-img
                      src="/cup-animation.png"
                      alt="Animation gobelet"
                      height="300"
                      width="300"
                      :class="shakeClass"
                    />
                  </div>
                  <div v-if="!hideDiceOnBoard" class="left-side-dices-container">
                    <v-btn
                      v-for="(dice, i) in diceOnBoard"
                      :key="i"
                      width="70"
                      variant="text"
                      class="dice-container"
                      @click="addDice(dice.id)"
                    >
                      <v-img
                        :src="getDiceFace(dice.face)"
                        alt="dés"
                        height="70"
                        width="70"
                        cover
                      />
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="2">
                  <div class="">
                    <volume-fullscreen
                      :volume="volume"
                      :is-fullscreen="isFullscreen"
                      :class="isSoundIconHover ? 'volume-fullscreen-hover' : 'volume-fullscreen'"
                      @update:volume="updateVolume"
                      @hoverEvent="isSoundIconHover = $event"
                    />
                  </div>
                  <div class="cup-one-container">
                    <v-btn
                      class="d-flex justify-center align-center"
                      variant="text"
                      heigth="100px"
                      width="60px"
                      :style="cups?.tries < 3 ? 'opacity: 0.5' : ''"
                      @click="rollOne"
                    >
                      <v-img
                        src="/cup-no-bg.png"
                        alt="gobelet un"
                        height="100"
                        width="60"
                      />
                    </v-btn>
                  </div>
                  <div class="cup-two-container">
                    <v-btn
                      class="d-flex justify-center align-center"
                      variant="text"
                      heigth="100px"
                      width="60px"
                      :style="cups?.tries < 2 ? 'opacity: 0.5' : ''"
                      @click="rollTwo"
                    >
                      <v-img
                        src="/cup-no-bg.png"
                        alt="gobelet deux"
                        height="100"
                        width="60"
                      />
                    </v-btn>
                  </div>
                  <div class="cup-three-container">
                    <v-btn
                      class="d-flex justify-center align-center"
                      variant="text"
                      heigth="100px"
                      width="60px"
                      :style="cups?.tries < 1 ? 'opacity: 0.5' : ''"
                      @click="rollThree"
                    >
                      <v-img
                        src="/cup-no-bg.png"
                        alt="gobelet trois"
                        height="100"
                        width="60"
                      />
                    </v-btn>
                  </div>
                </v-col>
                <v-col cols="12" align-self="end" :class="mdAndUp ? 'pl-0 pb-0' : ''">
                  <div class="dice-plate dice-plate-container">
                    <v-btn
                      v-for="(dice, i) in diceOnHand"
                      :key="i"
                      width="70"
                      variant="text"
                      class="dice-container pa-0 mx-2"
                      @click="removeDice(dice.id)"
                    >
                      <v-img
                        :src="getDiceFace(dice.face)"
                        alt="dés"
                        height="70"
                        width="70"
                        cover
                      />
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </div>
      </v-col>
      <v-col cols="12" md="3">
        <div class="d-flex justify-space-between align-center">
          <h2 class="dice-logo">
            Dice
          </h2>
          <v-btn :icon="isSoundMuted ? mdiVolumeOff : mdiVolumeHigh" variant="text" @click="toggleVolume" />
        </div>
        <v-card v-if="volumeCard" rounded="xl" height="42" class="d-flex justify-center align-center px-2">
          <v-slider
            v-model="volume"
            density="compact"
            min="0"
            max="1"
            step="0.01"
            thumb-size="12"
            track-size="2"
            hide-details
            @change="adjustVolume"
          />
        </v-card>
        <v-divider class="my-4" />
        <div class="text-center">
          <v-btn
            v-if="session.players[0].id === user?.uid && !session.isStarted"
            height="50px"
            block
            color="tertiary"
            class="mb-2"
            @click="startGame"
          >
            Démarrer la partie
          </v-btn>
          <v-btn
            v-if="!session.isStarted"
            height="50px"
            :loading="leaving"
            block
            color="headline"
            @click="leaveGame"
          >
            Quitter la partie
          </v-btn>
          <v-btn
            v-if="session.isFinished"
            height="50px"
            block
            color="tertiary"
            @click="isFinishedLocal = !isFinishedLocal"
          >
            Voir le classement
          </v-btn>
        </div>
        <div>
          <v-card class="mt-4 overflow-auto" :max-height="400" rounded="0">
            <v-card-title class="text-h5 text-center">
              <span>Chat</span>
            </v-card-title>
            <v-card-text>
              <div
                v-for="(messageItem, i) in chat?.messages"
                :key="i"
                class="d-flex"
              >
                <span class="mr-1">{{ messageItem.username }}:</span>
                <span>{{ messageItem.content }}</span>
              </div>
            </v-card-text>
          </v-card>
          <v-card class="d-flex align-center pa-2" rounded="0">
            <v-row class="pa-0">
              <v-col cols="12" xl="6">
                <v-textarea
                  v-model="message"
                  placeholder="Votre message"
                  variant="outlined"
                  rows="1"
                  auto-grow
                  hide-details
                  clearable
                  @keyup.enter="sendMessage"
                />
              </v-col>
              <v-col cols="12" xl="6" class="pt-0 pt-xl-3 align-self-center">
                <v-btn
                  block
                  color="tertiary"
                  height="46px"
                  @click="sendMessage"
                >
                  Envoyer
                </v-btn>
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-col>
    </v-row>

    <client-only>
      <v-dialog v-model="isFinishedLocal" width="600">
        <v-card color="diceClosePrimary card-container" rounded="lg">
          <v-card-title class="text-h5 text-center font-weight-bold">
            <span>Partie terminée</span>
          </v-card-title>
          <v-card-text class="mt-12">
            <v-row class="podium">
              <v-col :cols="fourthPlace ? 3 : 4" class="text-center">
                <span class="text-h6">{{
                  secondPlace ? secondPlace : ''
                }}</span>
                <div class="second-place">
                  <span class="place">2</span>
                </div>
              </v-col>
              <v-col :cols="fourthPlace ? 3 : 4" class="text-center">
                <div class="d-flex justify-center align-center mb-2">
                  <v-img
                    src="https://media.tenor.com/Luo9IUzhQt0AAAAi/crown.gif"
                    alt="couronne"
                    height="80"
                    width="50"
                  />
                </div>
                <span class="text-h6">{{ firstPlace ? firstPlace : '' }}</span>
                <div class="first-place">
                  <span class="place">1</span>
                </div>
              </v-col>
              <v-col :cols="fourthPlace ? 3 : 4" class="text-center">
                <span class="text-h6">{{ thirdPlace ? thirdPlace : '' }}</span>
                <div class="third-place">
                  <span class="place">3</span>
                </div>
              </v-col>
              <v-col
                v-if="fourthPlace"
                :cols="fourthPlace ? 3 : 4"
                class="text-center"
              >
                <span class="text-h6">{{ fourthPlace }}</span>
                <div class="fourth-place">
                  <span class="fourth-place-text">4</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn
              block
              variant="flat"
              elevation="6"
              color="tertiary"
              to="/dice/jouer"
            >
              Retourner au menu principal
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </client-only>
  </v-container>
</template>

<script lang="ts" setup>
import {
  VContainer,
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VCardActions,
  VBtn,
  VImg,
  VTextarea,
  VDivider,
  VDialog,
  VSlider
} from 'vuetify/components'
import { useTheme, useDisplay } from 'vuetify'
import {
  mdiVolumeHigh,
  mdiVolumeOff,
  mdiFullscreenExit,
  mdiFullscreen
} from '@mdi/js'
import {
  collection,
  doc,
  updateDoc,
  setDoc,
  getDoc,
  deleteDoc,
  deleteField,
  arrayUnion
} from 'firebase/firestore'
import {
  diceSessionConverter,
  diceSessionPlayerTurnConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionScoreConverter,
  diceSessionPlayerTriesConverter,
  diceSessionDicesConverter,
  diceSessionChatConverter,
  LocalDiceSessionScoreType
} from '~/stores'
import { CardUser, Dice } from '~/functions/src/types'
import SoundService from '~/utils/soundService'

// Types

type diceFaces = {
  [key: number]: { dark: string; light: string }
}

// Vuetify

const theme = useTheme()
const { mdAndUp } = useDisplay()

// Vuefire & Composables

const { notifier } = useNotifier()
const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

// Firestore

const sessionId = route.params.id as string

const sessionRef = doc(db, 'diceSessions', sessionId).withConverter(
  diceSessionConverter
)

const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))

const playerTurnRef = doc(db, 'diceSessionPlayerTurn', sessionId).withConverter(
  diceSessionPlayerTurnConverter
)

const playerTurn = useDocument(
  doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id)
)

const remainingTurnsRef = doc(
  db,
  'diceSessionRemainingTurns',
  sessionId
).withConverter(diceSessionRemainingTurnsConverter)

const remainingTurns = useDocument(
  doc(collection(db, 'diceSessionRemainingTurns'), remainingTurnsRef.id)
)

const cupsRef = doc(db, 'diceSessionPlayerTries', sessionId).withConverter(
  diceSessionPlayerTriesConverter
)

const cups = useDocument(
  doc(collection(db, 'diceSessionPlayerTries'), cupsRef.id)
)

const dicesRef = doc(db, 'diceSessionDices', sessionId).withConverter(
  diceSessionDicesConverter
)

const dices = useDocument(doc(collection(db, 'diceSessionDices'), dicesRef.id))

const chatRef = doc(db, 'diceSessionChat', sessionId).withConverter(
  diceSessionChatConverter
)

const chat = useDocument(doc(collection(db, 'diceSessionChat'), chatRef.id))

const scoresRef = doc(db, 'diceSessionScores', sessionId).withConverter(
  diceSessionScoreConverter
)

// Refs

const message = ref<string>('')
const shakeClass = ref<string>('')
const volume = ref<number>(0.5)
const isSoundMuted = ref(false)
const hideDiceOnBoard = ref(false)
const isFinishedLocal = ref(false)
const isFullscreen = ref(false)
const volumeCard = ref(false)
const leaving = ref(false)
const isSoundIconHover = ref(false)
const scores = ref<LocalDiceSessionScoreType | null>(null)
const fullscreenElement = ref<HTMLElement | null>(null)

let soundService: SoundService

// New Sound Effects

const sounds = {
  dice: '/dice.mp3',
  notification: '/notification.wav',
  message: '/message.mp3',
  shakeRoll: '/shake-and-roll.mp3',
  spongeBobDisappointed: '/sponge-bob-disappointed.mp3',
  spongeBobRemix: '/sponge-bob-remix.mp3'
}

// onMounted

onMounted(() => {
  fullscreenElement.value = fullscreenElement.value as HTMLElement
  document.addEventListener('fullscreenchange', handleFullscreenChange)

  soundService = new SoundService()

  soundService.loadSound('dice', sounds.dice)
  soundService.loadSound('notification', sounds.notification)
  soundService.loadSound('message', sounds.message)
  soundService.loadSound('shakeRoll', sounds.shakeRoll)
  soundService.loadSound('spongeBobDisappointed', sounds.spongeBobDisappointed)
  soundService.loadSound('spongeBobRemix', sounds.spongeBobRemix)

  const storedValue = localStorage.getItem('soundVolume')
  if (storedValue !== null) {
    volume.value = parseFloat(storedValue)

    if (volume.value === 0) {
      isSoundMuted.value = true
    }
  }
})

onUnmounted(() => {
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

onBeforeRouteLeave(() => {
  soundService.stopAllSounds()
})

// Watchers

watch(isFinishedLocal, async (newValue) => {
  if (newValue) {
    const userRef = doc(db, 'users', user.value?.uid as string)
    const userDoc = await getDoc(userRef)
    const username = userDoc.data()?.username
    const isUserFirstPlace = firstPlace.value === username
    const isUserSecondPlace = secondPlace.value === username
    const isUserThirdPlace = thirdPlace.value === username
    const isUserFourthPlace = fourthPlace.value === username

    if (isUserFirstPlace) {
      soundService.playSound('spongeBobRemix')
    } else if (isUserSecondPlace) {
      soundService.playSound('spongeBobDisappointed')
    } else if (isUserThirdPlace) {
      soundService.playSound('spongeBobDisappointed')
    } else if (isUserFourthPlace) {
      soundService.playSound('spongeBobDisappointed')
    } else {
      soundService.playSound('spongeBobDisappointed')
    }
  }
})

watch(remainingTurns, async (newValue) => {
  if (newValue && newValue.remainingTurns === 0) {
    await updateDoc(sessionRef, { isFinished: true })
    isFinishedLocal.value = true

    const scoresDoc = await getDoc(scoresRef)
    if (!scoresDoc.exists()) {
      return
    }
    scores.value = scoresDoc.data()
  }
})

watch(cups, async (newValue) => {
  if (newValue && newValue.tries !== 3) {
    hideDiceOnBoard.value = true
    soundService.playSound('shakeRoll')
    await sleep(500)
    shakeClass.value = 'shake'
    await sleep(1800)
    shakeClass.value = ''
    await sleep(100)
    hideDiceOnBoard.value = false
  }
})

watch(playerTurn, (newValue) => {
  if (
    newValue &&
    newValue.playerId === user.value?.uid &&
    session.value?.isStarted &&
    !session.value?.isFinished
  ) {
    soundService.playSound('notification')
  }
})

watch(volume, (newValue) => {
  if (newValue === 0) {
    isSoundMuted.value = true
  } else {
    isSoundMuted.value = false
  }
})

watch(chat, (newValue) => {
  if (newValue && newValue.messages.length > 0) {
    const lastMessage = newValue.messages[newValue.messages.length - 1]
    if (lastMessage.userId !== user.value?.uid) {
      soundService.playSound('message')
    }
  }
})

// Computed values

const firstPlace = computed(() => getPlaceName(1))
const secondPlace = computed(() => getPlaceName(2))
const thirdPlace = computed(() => getPlaceName(3))
const fourthPlace = computed(() => getPlaceName(4))

const adjustVolume = computed(() => {
  soundService.setGlobalVolume(volume.value)
})

const diceOnBoard = computed(() => {
  if (!dices.value || !dices.value.dices) {
    return
  }
  return dices.value.dices
    .filter((dice: Dice) => dice.isOnBoard)
    .sort((a: Dice, b: Dice) => a.face - b.face)
})

const diceOnHand = computed(() => {
  if (!dices.value || !dices.value.dices) {
    return
  }
  return dices.value.dices
    .filter((dice: Dice) => !dice.isOnBoard)
    .sort((a: Dice, b: Dice) => a.face - b.face)
})

// Methods

const startGame = async () => {
  if (!session.value) {
    return
  }
  if (session.value.players.length < 2) {
    notifier({ content: 'Vous devez être au moins 2 joueurs pour commencer la partie', color: 'error' })
    return
  }

  await updateDoc(sessionRef, { isStarted: true })
}

const removeDice = async (index: number) => {
  await manipulateDice(index, 'remove')
}

const addDice = async (index: number) => {
  await manipulateDice(index, 'add')
}

const trueRandom = () => {
  return Math.floor(Math.random() * 6) + 1
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const getFullscreenElement = () => {
  return document.fullscreenElement
}

const toggleFullscreen = () => {
  if (getFullscreenElement()) {
    document.exitFullscreen()
  } else {
    fullscreenElement.value?.requestFullscreen()
  }
}

const handleFullscreenChange = () => {
  isFullscreen.value = document.fullscreenElement !== null
}

const toggleVolume = () => {
  volumeCard.value = !volumeCard.value
}

const updateVolume = (value: number) => {
  volume.value = value
  soundService.setGlobalVolume(volume.value)
}

const getDiceFace = (dice: number) => {
  const diceFaces: diceFaces = {
    1: { dark: '/dices/dice-one.png', light: '/dices/dice-white-one.png' },
    2: { dark: '/dices/dice-two.png', light: '/dices/dice-white-two.png' },
    3: { dark: '/dices/dice-three.png', light: '/dices/dice-white-three.png' },
    4: { dark: '/dices/dice-four.png', light: '/dices/dice-white-four.png' },
    5: { dark: '/dices/dice-five.png', light: '/dices/dice-white-five.png' },
    6: { dark: '/dices/dice-six.png', light: '/dices/dice-white-six.png' }
  }

  const getTheme = theme.current.value
  const diceFace = diceFaces[dice]

  if (diceFace) {
    return getTheme.dark ? diceFace.dark : diceFace.light
  }

  return undefined
}

const rollDice = async (tries: number) => {
  if (
    !session.value ||
    !cups.value ||
    !dices.value ||
    !user.value ||
    !playerTurn.value
  ) {
    return
  }

  if (session.value.isStarted === false) {
    notifier({ content: "La partie n'a pas encore commencé", color: 'error' })
    return
  }

  if (session.value.isFinished === true) {
    notifier({ content: 'La partie est terminée', color: 'error' })
    return
  }

  if (playerTurn.value.playerId !== user.value.uid) {
    notifier({ content: 'Attends ton tour', color: 'error' })
    return
  }

  if (cups.value.tries < tries) {
    notifier({
      content: 'Tu as déjà lancé les dés de ce gobelet',
      color: 'error'
    })
    return
  }

  if ((cups.value.tries === 3 && tries === 2) || (cups.value.tries === 2 && tries === 1)) {
    notifier({
      content: 'Lances les dés du gobelet supérieur',
      color: 'error'
    })
    return
  }

  const rollDices = dices.value
  const diceOnBoard = rollDices.dices ? rollDices.dices.filter((dice: Dice) => dice.isOnBoard === true) : []

  if (diceOnBoard.length === 0) {
    rollDices.dices = []

    for (let i = 0; i < 5; i++) {
      const dice = trueRandom()
      rollDices.dices.push({
        id: i,
        face: dice,
        isOnBoard: true
      })
    }
  } else {
    for (let i = 0; i < diceOnBoard.length; i++) {
      const dice = trueRandom()
      rollDices.dices[diceOnBoard[i].id].face = dice
    }
  }

  await updateDoc(cupsRef, { tries: tries - 1 })
  await sleep(2300)
  await updateDoc(dicesRef, rollDices)
}

const rollOne = async () => {
  if (!cups.value) {
    return
  }

  await rollDice(3)
}

const rollTwo = async () => {
  if (!cups.value) {
    return
  }

  await rollDice(2)
}

const rollThree = async () => {
  if (!cups.value) {
    return
  }

  await rollDice(1)
}

const manipulateDice = async (id: number, action: 'add' | 'remove') => {
  if (!dices.value || !user.value || !playerTurn.value) {
    return
  }

  if (playerTurn.value.playerId !== user.value.uid) {
    notifier({ content: 'Attends ton tour', color: 'error' })
    return
  }

  soundService.playSound('dice')

  const dicesData = dices.value

  if (action === 'add') {
    dicesData.dices.find((dice: Dice) => dice.id === id).isOnBoard = false
  } else if (action === 'remove') {
    dicesData.dices.find((dice: Dice) => dice.id === id).isOnBoard = true
  }

  await updateDoc(dicesRef, dicesData)
}

const getPlaceName = (position: number) => {
  if (!isFinishedLocal || !scores.value || !session.value) {
    return false
  }

  if (position < 1 || position > 4) {
    return false
  }

  const playerScores = [
    scores.value.playerOne,
    scores.value.playerTwo,
    scores.value.playerThree,
    scores.value.playerFour
  ]
  const playerTotals = playerScores.map(player => (player ? player.total : 0))

  if (playerTotals.every(total => total === 0)) {
    return false
  }

  const players = session.value.players
  const sortedPlayers = players.filter((_: number, index: number) => playerScores[index] !== undefined)
    .sort((a: number, b: number) => playerTotals[players.indexOf(b)] - playerTotals[players.indexOf(a)])

  if (position > sortedPlayers.length) {
    return false
  }

  return sortedPlayers[position - 1].username
}

const sendMessage = async () => {
  if (!session.value || !message.value || !user.value) {
    return
  }

  const players = session.value.players
  const uid = user.value.uid

  const currentUser = players.find((player: CardUser) => player.id === uid)
  if (!currentUser) {
    return
  }

  const { username } = currentUser

  await setDoc(
    chatRef,
    {
      messages: arrayUnion({
        userId: uid,
        username,
        content: message.value
      })
    },
    { merge: true }
  )

  message.value = ''
}

const leaveGame = async () => {
  if (!user.value) {
    notifier({ content: 'Tu dois être connecté', color: 'error' })
    return
  }
  leaving.value = true

  try {
    const sessionDoc = await getDoc(sessionRef)
    const session = sessionDoc.data()
    const scoresDoc = await getDoc(scoresRef)
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
      await deleteDoc(playerTurnRef)
      await deleteDoc(scoresRef)
      await deleteDoc(remainingTurnsRef)
      await deleteDoc(dicesRef)
      await deleteDoc(cupsRef)
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
    } else if (scores?.playerThree?.id === user.value.uid) {
      await updateDoc(scoresRef, {
        playerThree: deleteField()
      })
    } else if (scores?.playerFour?.id === user.value.uid) {
      await updateDoc(scoresRef, {
        playerFour: deleteField()
      })
    }
    session.players = session.players.filter(
      player => player.id !== user.value?.uid
    )

    const joinRemainingTurnsDoc = await getDoc(remainingTurnsRef)
    if (!joinRemainingTurnsDoc.exists()) {
      return
    }
    const joinRemainingTurns = joinRemainingTurnsDoc.data()?.remainingTurns

    await updateDoc(remainingTurnsRef, {
      id: sessionId,
      remainingTurns: joinRemainingTurns - 13
    })

    if (session.players.length < 4) {
      session.isFull = false
    }
    await updateDoc(sessionRef, session)
  } finally {
    leaving.value = false
    navigateTo('/dice/jouer/')
  }
}
</script>

<style scoped>
.container {
  max-width: 1800px;
}

.background-image {
  background-image: url('/green-slate.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.fullscreen {
  max-width: 1080px;
  max-height: 1920px;
}

.notFullscreen {
  position: relative;
  width: 100%;
}

.fullscreen-btn {
  z-index: 9999;
  position: absolute;
  bottom: 10px;
  right: 10px;
}

.volume-fullscreen {
  position: absolute;
  top: 10px;
  right: 0px;
  z-index: 9999;
}

.volume-fullscreen-hover {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 9999;
}

.right-side-container {
  position: relative;
}

.timer-container {
  position: absolute;
  top: 50px;
  right: 30px;
}

.timer-content {
  border: 2px solid rgba(0, 0, 0, 0.8);
  border-radius: 5px;
}

.cup-one-container {
  cursor: pointer;
  position: absolute;
  top: 120px;
  right: 40px;
  transform: rotate(15deg);
}

.cup-two-container {
  cursor: pointer;
  position: absolute;
  top: 220px;
  right: 40px;
  transform: rotate(15deg);
}

.cup-three-container {
  cursor: pointer;
  position: absolute;
  top: 320px;
  right: 40px;
  transform: rotate(15deg);
}

.dice-plate-container {
  display: flex;
  align-items: center;
  height: 80px;
  width: 100%;
}
@media screen and (max-width: 1600px) {
  .dice-plate-container {
    display: inline-block;
    height: 160px;
  }
}

.left-side-dices-container {
  display: inline-block;
  align-items: center;
}

.dice-container {
  margin: 5px;
  height: 70px;
  width: 70px;
}

.card-container {
  border: 2px solid rgba(0, 0, 0, 0.8);
}

.podium {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin: 0 auto;
}

.first-place {
  height: 200px;
  background-color: rgb(255, 217, 0);
  border: 2px solid #ffbb00;
  border-radius: 10px;
}

.second-place {
  height: 150px;
  background-color: silver;
  border: 2px solid #7e7e7e;
  border-radius: 10px;
}

.third-place {
  height: 100px;
  background-color: #cd7f32;
  border: 2px solid #8b4513;
  border-radius: 10px;
}

/* make fourth place ridiculous */
.fourth-place {
  height: 40px;
  background-color: #e21ce9;
  border: 2px solid #4fd825;
  border-radius: 10px;
}

.place {
  font-size: 48px;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px #000;
}

.fourth-place-text {
  font-size: 24px;
  font-weight: bold;
  color: rgb(8, 255, 173);
  text-shadow: 2px 2px #000;
}

/* shaking */
.shake {
  animation: shake 0.5s ease-in-out 0s 3;
}

@keyframes shake {
  0% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(20px);
  }
  50% {
    transform: translateY(-20px);
  }
  75% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0);
  }
}

/* dice board */
.dice-plate {
  background: linear-gradient(
    to bottom right,
    rgb(var(--v-theme-dicePrimary)),
    rgb(var(--v-theme-diceClosePrimary))
  );
}
</style>
