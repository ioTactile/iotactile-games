<template>
  <v-container v-if="session" fluid class="container">
    <v-row>
      <v-col cols="12" md="9" class="background-image">
        <v-row>
          <v-col class="d-flex" cols="12">
            <dice-players :players="session.players" />
          </v-col>
          <v-col cols="6">
            <dice-board
              :dice-on-hand="session.diceOnHand"
              :dice-on-board="session.diceOnBoard"
            />
          </v-col>
          <v-col cols="6" class="right-side-container pb-0">
            <v-row class="h-100">
              <v-col cols="10">
                <v-btn
                  v-for="(dice, i) in session.diceOnBoard"
                  :key="i"
                  :disabled="isPlayerTurn"
                  class="dice-container"
                  @click="addDice(i)"
                >
                  {{ dice }}
                </v-btn>
              </v-col>
              <v-col cols="2">
                <div class="timer-container">
                  <span class="timer-content bg-dicePrimary text-h5 px-2">{{
                    timeLeft
                  }}</span>
                </div>
                <div class="cup-one-container">
                  <v-btn
                    class="d-flex justify-center align-center"
                    variant="text"
                    :disabled="isPlayerTurnRollOne || session.isFinished || !session.isStarted"
                    heigth="80px"
                    width="50px"
                    @click="rollOne"
                  >
                    <v-img src="/cup-no-bg.png" alt="gobelet un" height="80" width="50" />
                  </v-btn>
                </div>
                <div class="cup-two-container">
                  <v-btn
                    class="d-flex justify-center align-center"
                    variant="text"
                    :disabled="isPlayerTurnRollTwo || session.isFinished || !session.isStarted"
                    heigth="80px"
                    width="50px"
                    @click="rollTwo"
                  >
                    <v-img src="/cup-no-bg.png" alt="gobelet deux" height="80" width="50" />
                  </v-btn>
                </div>
                <div class="cup-three-container">
                  <v-btn
                    class="d-flex justify-center align-center"
                    variant="text"
                    :disabled="isPlayerTurnRollThree || session.isFinished || !session.isStarted"
                    heigth="80px"
                    width="50px"
                    @click="rollThree"
                  >
                    <v-img src="/cup-no-bg.png" alt="gobelet trois" height="80" width="50" />
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" align-self="end" class="pl-0 pb-0">
                <div
                  class="d-flex align-center bg-dicePrimary dice-plate-container"
                >
                  <v-btn
                    v-for="(dice, i) in session.diceOnHand"
                    :key="i"
                    :disabled="isPlayerTurn"
                    class="dice-container"
                    @click="removeDice(i)"
                  >
                    {{ dice }}
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
        <div class="d-flex justify-end mt-4 mr-2">
          <v-btn variant="icon" :icon="isMuted === true ? 'mdi-volume-off' : 'mdi-volume-high'" @click="mutedEvent()" />
        </div>
      </v-col>
    </v-row>
    <client-only>
      <v-dialog v-model="isFinishedLocal" width="600">
        <v-card color="dicePrimary card-container" rounded="lg">
          <v-card-title class="text-h5 text-center">
            <span>Partie terminée</span>
          </v-card-title>
          <v-card-text class="mt-12">
            <v-row class="podium">
              <v-col :cols="fourthPlayer ? 3 : 4" class="text-center">
                <span class="text-h6">{{ secondPlayer ? secondPlayer : 'Deuxième' }}</span>
                <div class="second-place">
                  <span class="place">2</span>
                </div>
              </v-col>
              <v-col :cols="fourthPlayer ? 3 : 4" class="text-center">
                <div class="d-flex justify-center align-center mb-2">
                  <v-img src="https://media.tenor.com/Luo9IUzhQt0AAAAi/crown.gif" alt="couronne" height="80" width="50" />
                </div>
                <span class="text-h6">{{ firstPlayer ? firstPlayer : 'Premier' }}</span>
                <div class="first-place">
                  <span class="place">1</span>
                </div>
              </v-col>
              <v-col :cols="fourthPlayer ? 3 : 4" class="text-center">
                <span class="text-h6">{{ thirdPlayer ? thirdPlayer : 'Troisième' }}</span>
                <div class="third-place">
                  <span class="place">3</span>
                </div>
              </v-col>
              <v-col v-if="fourthPlayer" :cols="fourthPlayer ? 3 : 4" class="text-center">
                <span class="text-h6">{{ fourthPlayer }}</span>
                <div class="fourth-place">
                  <span class="fourth-place-text">4</span>
                </div>
              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions>
            <v-btn block color="highlight" to="/dice/jouer">
              Retourner au menu principal
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </client-only>
  </v-container>
</template>

<script lang="ts" setup async>
import { collection, doc, setDoc, getDoc, arrayUnion, onSnapshot } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'
import { storeToRefs } from 'pinia'
import { diceSessionConverter, diceSessionPlayerTurnConverter } from '~/stores'
import { useDicesStore } from '~/stores/dices'
import { useTimerStore } from '~/stores/timer'

// Firebase

// const { notifier } = useNotifier()
const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

const dicesStore = useDicesStore()
const timerStore = useTimerStore()
const { diceOnBoard, diceOnHand } = storeToRefs(dicesStore)
const { timer } = storeToRefs(timerStore)

const sessionRef = doc(
  db,
  'diceSessions',
  route.params.id as string
).withConverter(diceSessionConverter)
const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))
const playerTurnRef = doc(
  db,
  'diceSessionPlayerTurn',
  route.params.id as string
).withConverter(diceSessionPlayerTurnConverter)
const playerTurn = useDocument(
  doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id)
)
const scoresRef = doc(db, 'diceSessionScores', route.params.id as string)
const scores = useDocument(
  doc(collection(db, 'diceSessionScores'), scoresRef.id)
)

// Refs

const message = ref<string>('')
const timeLeft = ref<string>('1:30')
const isTimerRunning = ref(false)
const isFinishedLocal = ref(false)
const isMuted = ref(false)
let intervalId: NodeJS.Timeout | null = null
let sound: HTMLAudioElement | null = null

// New Sound Effects

// const diceSound = () => {
//   return new Audio('/dice.mp3')
// }
// const shakeRoll = () => {
//   return new Audio('/shake-and-roll.mp3')
// }
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
    const userRef = doc(db, 'users', user.value?.uid)
    const userDoc = await getDoc(userRef)
    const username = userDoc.data()?.username
    if (thirdPlayer.value === false) {
      if (firstPlayer.value === username) {
        spongeBobVictory().play()
        setTimeout(() => {
          sound = spongeBobRemix()
          sound.loop = true
          sound.play()
          isMuted.value = false
        }, 7000)
      } else if (secondPlayer.value === username) {
        spongeBobDisappointed().play()
      }
    } else if (fourthPlayer.value === false) {
      if (firstPlayer.value === username || secondPlayer.value === username) {
        spongeBobVictory().play()
        setTimeout(() => {
          sound = spongeBobRemix()
          sound.loop = true
          sound.play()
          isMuted.value = false
        }, 7000)
      } else if (thirdPlayer.value === username) {
        spongeBobDisappointed().play()
      }
    } else if (fourthPlayer.value !== false) {
      if (firstPlayer.value === username || secondPlayer.value === username || thirdPlayer.value === username) {
        spongeBobVictory().play()
        setTimeout(() => {
          sound = spongeBobRemix()
          sound.loop = true
          sound.play()
          isMuted.value = false
        }, 7000)
      } else if (fourthPlayer.value === username) {
        spongeBobDisappointed().play()
      }
    }
  }
})
onSnapshot(playerTurnRef, () => {
  if (isTimerRunning.value && !session.value?.isFinished) {
    startTimer()
  }
})
onSnapshot(sessionRef, async (snapshot) => {
  if (snapshot.data()?.remainingTurns !== session.value.remainingTurns && snapshot.data()?.remainingTurns === 0) {
    await setDoc(sessionRef, { isFinished: true }, { merge: true })
    isFinishedLocal.value = true
  }
})
// onSnapshot(sessionRef, (snapshot) => {
//   if (snapshot.data()?.playerTries === 0) { return }
//   if (snapshot.data()?.playerTries !== session.value?.playerTries) {
//     shakeRoll().play()
//   }
// })
// onSnapshot(sessionRef, (snapshot) => {
//   if (!snapshot.data()) { return }
//   if (
//     snapshot.data()?.diceOnBoard.length !== diceOnBoard.value.length ||
//     snapshot.data()?.diceOnHand.length !== diceOnHand.value.length
//   ) {
//     diceSound().play()
//   }
// })

// Computed values

const isPlayerTurn = computed(() => {
  if (
    playerTurn.value &&
    user.value &&
    playerTurn.value.playerId !== user.value.uid
  ) {
    return true
  }
  return false
})
const isPlayerTurnRollOne = computed(() => {
  if (!playerTurn.value || !user.value || !session.value) {
    return
  }
  if (
    playerTurn.value.playerId !== user.value.uid ||
    session.value.playerTries < 3
  ) {
    return true
  }
  return false
})
const isPlayerTurnRollTwo = computed(() => {
  if (!playerTurn.value || !user.value || !session.value) {
    return
  }
  if (
    playerTurn.value.playerId !== user.value.uid ||
    session.value.playerTries < 2
  ) {
    return true
  }
  return false
})
const isPlayerTurnRollThree = computed(() => {
  if (!playerTurn.value || !user.value || !session.value) {
    return
  }
  if (
    playerTurn.value.playerId !== user.value.uid ||
    session.value.playerTries < 1
  ) {
    return true
  }
  return false
})
const firstPlayer = computed(() => {
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
  if (playerOne > playerTwo && playerOne > playerThree && playerOne > playerFour) {
    return session.value.players[0].username
  }
  if (playerTwo > playerOne && playerTwo > playerThree && playerTwo > playerFour) {
    return session.value.players[1].username
  }
  if (playerThree > playerOne && playerThree > playerTwo && playerThree > playerFour) {
    return session.value.players[2].username
  }
  if (playerFour > playerOne && playerFour > playerTwo && playerFour > playerThree) {
    return session.value.players[3].username
  }
})
const secondPlayer = computed(() => {
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
  if (playerOne < playerTwo && playerOne > playerThree && playerOne > playerFour) {
    return session.value.players[0].username
  }
  if (playerTwo < playerOne && playerTwo > playerThree && playerTwo > playerFour) {
    return session.value.players[1].username
  }
  if (playerThree < playerOne && playerThree > playerTwo && playerThree > playerFour) {
    return session.value.players[2].username
  }
  if (playerFour < playerOne && playerFour > playerTwo && playerFour > playerThree) {
    return session.value.players[3].username
  }
})
const thirdPlayer = computed(() => {
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
  if (playerOne < playerTwo && playerOne < playerThree && playerOne > playerFour) {
    return session.value.players[0].username
  }
  if (playerTwo < playerOne && playerTwo < playerThree && playerTwo > playerFour) {
    return session.value.players[1].username
  }
  if (playerThree < playerOne && playerThree < playerTwo && playerThree > playerFour) {
    return session.value.players[2].username
  }
  if (playerFour < playerOne && playerFour < playerTwo && playerFour > playerThree) {
    return session.value.players[3].username
  }
})
const fourthPlayer = computed(() => {
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
  if (playerOne < playerTwo && playerOne < playerThree && playerOne < playerFour) {
    return session.value.players[0].username
  }
  if (playerTwo < playerOne && playerTwo < playerThree && playerTwo < playerFour) {
    return session.value.players[1].username
  }
  if (playerThree < playerOne && playerThree < playerTwo && playerThree < playerFour) {
    return session.value.players[2].username
  }
  if (playerFour < playerOne && playerFour < playerTwo && playerFour < playerThree) {
    return session.value.players[3].username
  }
})

// Methods

const startGame = async () => {
  if (!session.value) {
    return
  }
  await setDoc(sessionRef, { isStarted: true }, { merge: true })
  startTimer()
}

const startTimer = () => {
  clearInterval(intervalId!)
  timer.value = 90
  timeLeft.value = '1:30'
  intervalId = setInterval(() => {
    if (timer.value === 0 || !timer.value) {
      clearInterval(intervalId!)
      isTimerRunning.value = false
      return
    }
    timer.value--
    const minutes = Math.floor(timer.value / 60)
    const seconds = timer.value % 60
    timeLeft.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }, 1000)
  isTimerRunning.value = true
}

const trueRandom = () => {
  return Math.floor(Math.random() * 6) + 1
}

const rollOne = async () => {
  if (!session.value) {
    return
  }
  if (session.value.playerTries < 3) {
    return
  }

  diceOnBoard.value = []
  diceOnHand.value = []

  for (let i = 0; i < 5; i++) {
    const dice = trueRandom()
    diceOnBoard.value.push(dice)
  }

  const diceSession = session.value
  diceSession.diceOnBoard = diceOnBoard.value
  diceSession.diceOnHand = diceOnHand.value
  diceSession.playerTries = 2
  await setDoc(sessionRef, diceSession, { merge: true })
}

const rollTwo = async () => {
  if (!session.value) {
    return
  }
  if (session.value.playerTries < 2) {
    return
  }
  if (!diceOnBoard.value.length) {
    return
  }

  let diceSession = session.value
  const diceOnBoardLength = diceOnBoard.value.length
  diceOnBoard.value = []
  diceSession.diceOnBoard = []
  await setDoc(sessionRef, diceSession, { merge: true })

  for (let i = 0; i < diceOnBoardLength; i++) {
    const dice = trueRandom()
    diceOnBoard.value.push(dice)
  }

  diceSession = session.value
  diceSession.diceOnBoard = diceOnBoard.value
  diceSession.playerTries = 1
  await setDoc(sessionRef, diceSession, { merge: true })
}

const rollThree = async () => {
  if (!session.value) {
    return
  }
  if (session.value.playerTries < 1) {
    return
  }
  if (!diceOnBoard.value.length) {
    return
  }

  let diceSession = session.value
  const diceOnBoardLength = diceOnBoard.value.length
  diceOnBoard.value = []
  diceSession.diceOnBoard = []
  await setDoc(sessionRef, diceSession, { merge: true })

  for (let i = 0; i < diceOnBoardLength; i++) {
    const dice = trueRandom()
    diceOnBoard.value.push(dice)
  }

  diceSession = session.value
  diceSession.diceOnBoard = diceOnBoard.value
  diceSession.playerTries = 0
  await setDoc(sessionRef, diceSession, { merge: true })
}

const removeDice = async (index: number) => {
  if (!session.value) {
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
  if (!session.value) {
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
  if (!message.value && !user.value && !session.value) {
    return
  }
  const username = session.value?.players.find(
    (player: any) => player.id === user.value?.uid
  )?.username
  await setDoc(
    sessionRef,
    {
      messages: arrayUnion({
        username,
        content: message.value
      })
    },
    { merge: true }
  )
  message.value = ''
}

const mutedEvent = () => {
  if (isMuted.value) {
    sound.muted = false
    isMuted.value = false
  } else if (!isMuted.value) {
    sound.muted = true
    isMuted.value = true
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
  right: 30px;
  transform: rotate(15deg);
}

.cup-two-container {
  cursor: pointer;
  position: absolute;
  top: 200px;
  right: 30px;
  transform: rotate(15deg);
}

.cup-three-container {
  cursor: pointer;
  position: absolute;
  top: 280px;
  right: 30px;
  transform: rotate(15deg);
}

.dice-plate-container {
  height: 70px;
  border: 2px solid rgba(0, 0, 0, 0.8);
}

.dice-container {
  width: 60px;
  height: 60px;
  border: 2px solid rgba(0, 0, 0, 0.8);
  border-radius: 5px;
  margin: 5px;
  background-color: rgba(255, 255, 255, 0.8);
  display: inline-block;
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
</style>
