<template>
  <v-container v-if="session && playerTurn" fluid class="container">
    <v-row>
      <v-col cols="12" md="9" class="background-image">
        <v-row>
          <v-col class="d-flex" cols="12">
            <dice-players :players="session.players" :is-finished="session.isFinished" :player-turn-id="playerTurn.playerId" />
          </v-col>
          <v-col cols="6">
            <dice-board />
          </v-col>
          <v-col cols="6" class="right-side-container pb-0">
            <v-row class="h-100">
              <v-col cols="10">
                <div v-if="shakeClass" class="mt-16 ml-16">
                  <v-img src="/cup-animation.png" alt="Animation gobelet" height="300" width="300" :class="shakeClass" />
                </div>
                <div class="left-side-dices-container">
                  <v-btn
                    v-for="(dice, i) in session.diceOnBoard"
                    :key="i"
                    variant="text"
                    class="dice-container "
                    @click="addDice(i)"
                  >
                    <v-img :src="getDiceFace(dice)" alt="dés" height="80" width="80" cover />
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="2">
                <div class="cup-one-container">
                  <v-btn
                    class="d-flex justify-center align-center"
                    variant="text"
                    heigth="100px"
                    width="60px"
                    :style="cups?.playerTries < 3 ? 'opacity: 0.5' : ''"
                    @click="rollOne"
                  >
                    <v-img src="/cup-no-bg.png" alt="gobelet un" height="100" width="60" />
                  </v-btn>
                </div>
                <div class="cup-two-container">
                  <v-btn
                    class="d-flex justify-center align-center"
                    variant="text"
                    heigth="100px"
                    width="60px"
                    :style="cups?.playerTries < 2 ? 'opacity: 0.5' : ''"
                    @click="rollTwo"
                  >
                    <v-img src="/cup-no-bg.png" alt="gobelet deux" height="100" width="60" />
                  </v-btn>
                </div>
                <div class="cup-three-container">
                  <v-btn
                    class="d-flex justify-center align-center"
                    variant="text"
                    heigth="100px"
                    width="60px"
                    :style="cups?.playerTries < 1 ? 'opacity: 0.5' : ''"
                    @click="rollThree"
                  >
                    <v-img src="/cup-no-bg.png" alt="gobelet trois" height="100" width="60" />
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" align-self="end" class="pl-0 pb-0">
                <div
                  class="yellow-plate dice-plate-container"
                >
                  <v-btn
                    v-for="(dice, i) in session.diceOnHand"
                    :key="i"
                    heigth="80px"
                    width="80px"
                    variant="text"
                    class="dice-container pa-0 mx-2"
                    @click="removeDice(i)"
                  >
                    <v-img :src="getDiceFace(dice)" alt="dés" height="84" width="84" cover />
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" md="3">
        <div
          v-for="(player, i) in session.players"
          :key="i"
          class="d-flex justify-space-between text-h6"
        >
          <span>Joueur {{ i + 1 }}:</span>
          <span>{{ player.username }}</span>
        </div>
        <v-divider class="my-4" />
        <div class="text-center">
          <v-btn
            v-if="session.players[0].id === user?.uid && !session.isStarted"
            height="50px"
            block
            color="tertiary"
            @click="startGame"
          >
            Démarrer la partie
          </v-btn>
          <v-btn
            v-if="session.isFinished === true"
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
                v-for="(messageItem, i) in session.messages"
                :key="i"
                class="d-flex"
              >
                <span>{{ messageItem.username }}:</span>
                <span>{{ messageItem.content }}</span>
              </div>
            </v-card-text>
          </v-card>
          <v-card class="d-flex align-center pa-2" rounded="0">
            <v-row class="pa-0">
              <v-col cols="12" lg="6">
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
              <v-col cols="12" lg="6" class="pt-0 pt-lg-3">
                <v-btn
                  block
                  color="tertiary"
                  height="56px"
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
        <v-card color="dicePrimary card-container" rounded="lg">
          <v-card-title class="text-h5 text-center font-weight-bold">
            <span>Partie terminée</span>
          </v-card-title>
          <v-card-text class="mt-12">
            <v-row class="podium">
              <v-col :cols="fourthPlace ? 3 : 4" class="text-center">
                <span class="text-h6">{{ secondPlace ? secondPlace : '' }}</span>
                <div class="second-place">
                  <span class="place">2</span>
                </div>
              </v-col>
              <v-col :cols="fourthPlace ? 3 : 4" class="text-center">
                <div class="d-flex justify-center align-center mb-2">
                  <v-img src="https://media.tenor.com/Luo9IUzhQt0AAAAi/crown.gif" alt="couronne" height="80" width="50" />
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
              <v-col v-if="fourthPlace" :cols="fourthPlace ? 3 : 4" class="text-center">
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
              color="highlight"
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

<script lang="ts" setup async>
import { VContainer, VRow, VCol, VBtn, VCard, VCardTitle, VCardText, VCardActions, VImg, VDialog, VTextarea, VDivider } from 'vuetify/components'
import { collection, doc, setDoc, getDoc, arrayUnion } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'
import { storeToRefs } from 'pinia'
import { diceSessionConverter, diceSessionPlayerTurnConverter, diceSessionScoreConverter, LocalDiceSessionScoreType } from '~/stores'
import { useDicesStore } from '~/stores/dices'
import { CardUser } from '~/functions/src/types'

// Vuefire & Composables

const { notifier } = useNotifier()
const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

// Stores

const dicesStore = useDicesStore()
const { diceOnBoard, diceOnHand } = storeToRefs(dicesStore)

// Firestore

const sessionId = route.params.id as string
const sessionRef = doc(db, 'diceSessions', sessionId).withConverter(diceSessionConverter)
const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))
const cupsRef = doc(sessionRef, 'cups', sessionId)
const cups = useDocument(doc(collection(sessionRef, 'cups'), cupsRef.id))
const playerTurnRef = doc(db, 'diceSessionPlayerTurn', sessionId).withConverter(diceSessionPlayerTurnConverter)
const playerTurn = useDocument(doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id))

// Refs

const message = ref<string>('')
const shakeClass = ref<string>('')
const isFinishedLocal = ref(false)
const scores = ref<LocalDiceSessionScoreType|null>(null)

// New Sound Effects

// const diceSound = () => {
//   return new Audio('/dice.mp3')
// }
const shakeRoll = () => {
  return new Audio('/shake-and-roll.mp3')
}
const spongeBobDisappointed = () => {
  return new Audio('/sponge-bob-disappointed.mp3')
}
const spongeBobVictory = () => {
  return new Audio('/sponge-bob-victory.mp3')
}
const spongeBobRemix = () => {
  return new Audio('/sponge-bob-remix.mp3')
}

// Watchers

watch(isFinishedLocal, async (value) => {
  if (value) {
    const userRef = doc(db, 'users', user.value?.uid as string)
    const userDoc = await getDoc(userRef)
    const username = userDoc.data()?.username
    if (thirdPlace.value === false) {
      if (firstPlace.value === username) {
        spongeBobVictory().play()
        setTimeout(() => {
          spongeBobRemix().play()
        }, 7000)
      } else if (secondPlace.value === username) {
        spongeBobDisappointed().play()
      }
    } else if (fourthPlace.value === false) {
      if (firstPlace.value === username || secondPlace.value === username) {
        spongeBobVictory().play()
        setTimeout(() => {
          spongeBobRemix().play()
        }, 7000)
      } else if (thirdPlace.value === username) {
        spongeBobDisappointed().play()
      }
    } else if (fourthPlace.value !== false) {
      if (firstPlace.value === username || secondPlace.value === username || thirdPlace.value === username) {
        spongeBobVictory().play()
        setTimeout(() => {
          spongeBobRemix().play()
        }, 7000)
      } else if (fourthPlace.value === username) {
        spongeBobDisappointed().play()
      }
    }
  }
})
watch(session, async (newValue) => {
  if (newValue?.remainingTurns === 0) {
    await setDoc(sessionRef, { isFinished: true }, { merge: true })
    isFinishedLocal.value = true

    const scoresRef = doc(db, 'diceSessionScores', sessionId).withConverter(diceSessionScoreConverter)
    const scoresDoc = await getDoc(scoresRef)
    if (!scoresDoc.exists()) { return }
    scores.value = scoresDoc.data()
  }
})
watch(cups, async (newValue) => {
  if (newValue && newValue.playerTries !== 3) {
    shakeRoll().play()
    await sleep(500)
    shakeClass.value = 'shake'
    await sleep(1800)
    shakeClass.value = ''
  }
})

// Computed values

const firstPlace = computed(() => {
  if (!isFinishedLocal) { return }
  if (!scores.value || !session.value) { return }
  if (scores.value.playerOne.total === 0 || scores.value.playerTwo.total === 0) { return }
  let playerThree = 0
  let playerFour = 0
  const playerOne = scores.value.playerOne.total
  const playerTwo = scores.value.playerTwo.total
  if (scores.value.playerThree) {
    playerThree = scores.value.playerThree.total
  }
  if (scores.value.playerFour) {
    playerFour = scores.value.playerFour.total
  }
  const players = [playerOne, playerTwo, playerThree, playerFour]
  players.sort((a, b) => b - a)
  if (players[0] === playerOne) {
    return session.value.players[0].username
  }
  if (players[0] === playerTwo) {
    return session.value.players[1].username
  }
  if (players[0] === playerThree) {
    return session.value.players[2].username
  }
  if (players[0] === playerFour) {
    return session.value.players[3].username
  }
})
const secondPlace = computed(() => {
  if (!isFinishedLocal) { return }
  if (!scores.value || !session.value) { return }
  if (scores.value.playerOne.total === 0 || scores.value.playerTwo.total === 0) { return }
  let playerThree = 0
  let playerFour = 0
  const playerOne = scores.value.playerOne.total
  const playerTwo = scores.value.playerTwo.total
  if (scores.value.playerThree) {
    playerThree = scores.value.playerThree.total
  }
  if (scores.value.playerFour) {
    playerFour = scores.value.playerFour.total
  }
  const players = [playerOne, playerTwo, playerThree, playerFour]
  players.sort((a, b) => b - a)
  if (players[1] === playerOne) {
    return session.value.players[0].username
  }
  if (players[1] === playerTwo) {
    return session.value.players[1].username
  }
  if (players[1] === playerThree) {
    return session.value.players[2].username
  }
  if (players[1] === playerFour) {
    return session.value.players[3].username
  }
})
const thirdPlace = computed(() => {
  if (!isFinishedLocal) { return }
  if (!scores.value || !session.value) { return }
  if (!scores.value.playerThree) { return false }
  if (scores.value.playerOne.total === 0 || scores.value.playerTwo.total === 0) { return }
  let playerThree = 0
  let playerFour = 0
  const playerOne = scores.value.playerOne.total
  const playerTwo = scores.value.playerTwo.total
  if (scores.value.playerThree) {
    playerThree = scores.value.playerThree.total
  }
  if (scores.value.playerFour) {
    playerFour = scores.value.playerFour.total
  }
  const players = [playerOne, playerTwo, playerThree, playerFour]
  players.sort((a, b) => b - a)
  if (players[2] === playerOne) {
    return session.value.players[0].username
  }
  if (players[2] === playerTwo) {
    return session.value.players[1].username
  }
  if (players[2] === playerThree) {
    return session.value.players[2].username
  }
  if (players[2] === playerFour) {
    return session.value.players[3].username
  }
})
const fourthPlace = computed(() => {
  if (!isFinishedLocal) { return }
  if (!scores.value || !session.value) { return }
  if (!scores.value.playerFour) { return false }
  if (scores.value.playerOne.total === 0 || scores.value.playerTwo.total === 0) { return }
  let playerThree = 0
  let playerFour = 0
  const playerOne = scores.value.playerOne.total
  const playerTwo = scores.value.playerTwo.total
  if (scores.value.playerThree) {
    playerThree = scores.value.playerThree.total
  }
  if (scores.value.playerFour) {
    playerFour = scores.value.playerFour.total
  }
  const players = [playerOne, playerTwo, playerThree, playerFour]
  players.sort((a, b) => b - a)
  if (players[3] === playerOne) {
    return session.value.players[0].username
  }
  if (players[3] === playerTwo) {
    return session.value.players[1].username
  }
  if (players[3] === playerThree) {
    return session.value.players[2].username
  }
  if (players[3] === playerFour) {
    return session.value.players[3].username
  }
})

// Methods

const startGame = async () => {
  if (!session.value) {
    return
  }
  await setDoc(sessionRef, { isStarted: true }, { merge: true })
}

const trueRandom = () => {
  return Math.floor(Math.random() * 6) + 1
}

const getDiceFace = (dice: number) => {
  if (dice === 1) {
    return '/dices/dice-one.png'
  }
  if (dice === 2) {
    return '/dices/dice-two.png'
  }
  if (dice === 3) {
    return '/dices/dice-three.png'
  }
  if (dice === 4) {
    return '/dices/dice-four.png'
  }
  if (dice === 5) {
    return '/dices/dice-five.png'
  }
  if (dice === 6) {
    return '/dices/dice-six.png'
  }
}

const rollOne = async () => {
  if (!session.value || !cups.value || !user.value || !playerTurn.value) {
    return
  }
  if (session.value.isStarted === false) {
    notifier({ content: 'La partie n\'a pas encore commencé', color: 'dicePrimary' })
    return
  }
  if (session.value.isFinished === true) {
    notifier({ content: 'La partie est terminée', color: 'dicePrimary' })
    return
  }
  if (playerTurn.value.playerId !== user.value.uid) {
    notifier({ content: 'Attends ton tour', color: 'dicePrimary' })
    return
  }
  if (cups.value.playerTries < 3) {
    notifier({ content: 'Tu as déjà lancé les dés de ce gobelet', color: 'dicePrimary' })
    return
  }
  if ((session.value.diceOnBoard.length + session.value.diceOnHand.length) > 5) {
    notifier({ content: 'Le jeu lague, attends', color: 'dicePrimary' })
    return
  }

  const diceSessionCups = cups.value
  const diceSession = session.value
  diceOnBoard.value = []
  diceOnHand.value = []

  for (let i = 0; i < 5; i++) {
    const dice = trueRandom()
    diceOnBoard.value.push(dice)
  }

  diceSessionCups.playerTries = 2
  await setDoc(cupsRef, diceSessionCups, { merge: true })
  await sleep(2300)
  diceSession.diceOnBoard = diceOnBoard.value
  diceSession.diceOnHand = diceOnHand.value
  await setDoc(sessionRef, diceSession, { merge: true })
}

const rollTwo = async () => {
  if (!session.value || !cups.value || !user.value || !playerTurn.value) {
    return
  }
  if (session.value.isStarted === false) {
    notifier({ content: 'La partie n\'a pas encore commencé', color: 'dicePrimary' })
    return
  }
  if (session.value.isFinished === true) {
    notifier({ content: 'La partie est terminée', color: 'dicePrimary' })
    return
  }
  if (playerTurn.value.playerId !== user.value.uid) {
    notifier({ content: 'Attends ton tour', color: 'dicePrimary' })
    return
  }
  if (cups.value.playerTries < 2) {
    notifier({ content: 'Tu as déjà lancé les dés de ce gobelet', color: 'dicePrimary' })
    return
  }
  if (!diceOnBoard.value.length) {
    notifier({ content: 'Ta main est complète', color: 'dicePrimary' })
    return
  }
  if ((session.value.diceOnBoard.length + session.value.diceOnHand.length) > 5) {
    notifier({ content: 'Le jeu lague, attends', color: 'dicePrimary' })
    return
  }

  const diceSessionCups = cups.value
  const diceSession = session.value
  const diceOnBoardLength = diceOnBoard.value.length
  diceOnBoard.value = []
  diceSession.diceOnBoard = []
  await setDoc(sessionRef, diceSession, { merge: true })

  for (let i = 0; i < diceOnBoardLength; i++) {
    const dice = trueRandom()
    diceOnBoard.value.push(dice)
  }

  diceSessionCups.playerTries = 1
  await setDoc(cupsRef, diceSessionCups, { merge: true })
  await sleep(2300)
  diceSession.diceOnBoard = diceOnBoard.value
  await setDoc(sessionRef, diceSession, { merge: true })
}

const rollThree = async () => {
  if (!session.value || !cups.value || !user.value || !playerTurn.value) {
    return
  }
  if (session.value.isStarted === false) {
    notifier({ content: 'La partie n\'a pas encore commencé', color: 'dicePrimary' })
    return
  }
  if (session.value.isFinished === true) {
    notifier({ content: 'La partie est terminée', color: 'dicePrimary' })
    return
  }
  if (playerTurn.value.playerId !== user.value.uid) {
    notifier({ content: 'Attends ton tour', color: 'dicePrimary' })
    return
  }
  if (cups.value.playerTries < 1) {
    notifier({ content: 'Tu as déjà lancé les dés de ce gobelet', color: 'dicePrimary' })
    return
  }
  if (!diceOnBoard.value.length) {
    notifier({ content: 'Ta main est complète', color: 'dicePrimary' })
    return
  }
  if ((session.value.diceOnBoard.length + session.value.diceOnHand.length) > 5) {
    notifier({ content: 'Le jeu lague, attends', color: 'dicePrimary' })
    return
  }

  const diceSessionCups = cups.value
  const diceSession = session.value
  const diceOnBoardLength = diceOnBoard.value.length
  diceOnBoard.value = []
  diceSession.diceOnBoard = []
  await setDoc(sessionRef, diceSession, { merge: true })

  for (let i = 0; i < diceOnBoardLength; i++) {
    const dice = trueRandom()
    diceOnBoard.value.push(dice)
  }

  diceSessionCups.playerTries = 0
  await setDoc(cupsRef, diceSessionCups, { merge: true })
  await sleep(2300)
  diceSession.diceOnBoard = diceOnBoard.value
  await setDoc(sessionRef, diceSession, { merge: true })
}

const removeDice = async (index: number) => {
  if (!session.value || !cups.value || !user.value || !playerTurn.value) {
    return
  }
  if (playerTurn.value.playerId !== user.value.uid) {
    notifier({ content: 'Attends ton tour', color: 'dicePrimary' })
    return
  }
  const diceSession = session.value
  diceOnBoard.value.push(diceOnHand.value[index])
  diceSession.diceOnBoard.push(diceOnHand.value[index])
  await setDoc(sessionRef, diceSession, { merge: true })
  diceOnHand.value.splice(index, 1)
  diceSession.diceOnHand.splice(index, 1)
  await setDoc(sessionRef, diceSession, { merge: true })
}

const addDice = async (index: number) => {
  if (!session.value || !cups.value || !user.value || !playerTurn.value) {
    return
  }
  if (playerTurn.value.playerId !== user.value.uid) {
    notifier({ content: 'Attends ton tour', color: 'dicePrimary' })
    return
  }
  const diceSession = session.value
  diceOnHand.value.push(diceOnBoard.value[index])
  diceSession.diceOnHand.push(diceOnBoard.value[index])
  await setDoc(sessionRef, diceSession, { merge: true })
  diceOnBoard.value.splice(index, 1)
  diceSession.diceOnBoard.splice(index, 1)
  await setDoc(sessionRef, diceSession, { merge: true })
}

const sendMessage = async () => {
  if (!message.value && !session.value) {
    return
  }
  const username = session.value?.players.find(
    (player: CardUser) => player.id === user.value?.uid
  )?.username
  await setDoc(sessionRef, {
    messages: arrayUnion({
      username,
      content: message.value
    })
  },
  { merge: true }
  )
  message.value = ''
}

const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
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
  height: 90px;
  width: 100%;
  border: 1px solid rgb(var(--v-theme-dicePlayersBorder));
}
@media screen and (max-width:1600px) {
  .dice-plate-container {
    display: inline-block;
    align-items: center;
    height: 180px;
    width: 100%
  }
}

.left-side-dices-container {
  display: inline-block;
  align-items: center;
}

.dice-container {
  margin: 5px;
  height: 80px;
  width: 80px;
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
  0% { transform: translateY(0); }
  25% { transform: translateY(20px); }
  50% { transform: translateY(-20px); }
  75% { transform: translateY(20px); }
  100% { transform: translateY(0); }
}

/* dice board */
.yellow-plate {
  background: linear-gradient(to bottom right, rgb(var(--v-theme-dicePrimary)), rgb(var(--v-theme-diceClosePrimary)));
}
</style>
