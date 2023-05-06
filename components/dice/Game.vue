<template>
  <v-container v-if="session" fluid class="container">
    <v-row>
      <v-col cols="9" class="background-image">
        <v-row>
          <v-col class="d-flex" cols="12">
            <dice-players :players="session.players" />
          </v-col>
          <v-col cols="6">
            <dice-board :dice-on-hand="session.diceOnHand" :dice-on-board="session.diceOnBoard" />
          </v-col>
          <v-col cols="6" class="right-side-container pb-0">
            <v-row class="h-100">
              <v-col cols="10">
                <v-btn v-for="(dice, i) in session.diceOnBoard" :key="i" class="dice-container" @click="addDice(i)">
                  {{ dice }}
                </v-btn>
              </v-col>
              <v-col cols="2">
                <div class="timer-container">
                  <span class="timer-content bg-dicePrimary text-h5 px-2">{{ timeLeft }}</span>
                </div>
                <div class="cup-one-container">
                  <v-btn :disabled="!isPlayerTurn && session.playerTries < 3" :style="session.playerTries < 3 ? 'opacity: 30%' : ''" @click="rollOne">
                    <v-img src="/cup-no-bg.png" height="80" width="50" />
                  </v-btn>
                </div>
                <div class="cup-two-container">
                  <v-btn :disabled="!isPlayerTurn && session.playerTries < 2" :style="session.playerTries < 2 ? 'opacity: 30%' : ''" @click="rollTwo">
                    <v-img src="/cup-no-bg.png" height="80" width="50" />
                  </v-btn>
                </div>
                <div class="cup-three-container">
                  <v-btn :disabled="!isPlayerTurn && session.playerTries < 1" :style="session.playerTries < 1 ? 'opacity: 30%' : ''" @click="rollThree">
                    <v-img src="/cup-no-bg.png" height="80" width="50" />
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" align-self="end" class="pl-0 pb-0">
                <div class="d-flex align-center bg-dicePrimary dice-plate-container">
                  <v-btn v-for="(dice, i) in session.diceOnHand" :key="i" class="dice-container" @click="removeDice(i)">
                    {{ dice }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="3">
        <div v-for="(player, i) in session.players" :key="i" class="d-flex justify-space-between text-h6">
          <span>Joueur {{ i + 1 }}:</span>
          <span>{{ player.username }}</span>
        </div>
        <v-divider class="my-4" />
        <div class="text-center">
          <v-btn
            v-if="session.players[0].id === user?.uid && !session.isStarted"
            color="tertiary"
            @click="startGame"
          >
            Démarrer la partie
          </v-btn>
        </div>
        <div>
          <v-card class="mt-4 overflow-auto" :max-height="400" rounded="0">
            <v-card-title class="text-h5 text-center">
              <span>Chat</span>
            </v-card-title>
            <v-card-text>
              <div v-for="(messageItem, i) in session.messages" :key="i" class="d-flex">
                <span>{{ messageItem.username }}:</span>
                <span>{{ messageItem.content }}</span>
              </div>
            </v-card-text>
          </v-card>
          <v-card class="d-flex align-center pa-2" rounded="0">
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
            <v-btn color="tertiary" class="ml-2" height="56px" @click="sendMessage">
              Envoyer
            </v-btn>
          </v-card>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup async>
import { collection, doc, setDoc, arrayUnion, onSnapshot } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'
import { diceSessionConverter, diceSessionPlayerTurnConverter } from '~/stores'

const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

const sessionRef = doc(db, 'diceSessions', route.params.id as string).withConverter(diceSessionConverter)
const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))
const playerTurnRef = doc(db, 'diceSessionPlayerTurn', route.params.id as string).withConverter(diceSessionPlayerTurnConverter)
const playerTurn = useDocument(doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id))

const message = ref<string>('')
const timeLeft = ref<string>('1:30')
const remainingTime = ref<number>()
const diceOnBoard = ref<number[]>([])
const diceOnHand = ref<number[]>([])

const startGame = async () => {
  if (!session.value) { return }
  await setDoc(sessionRef, {
    isStarted: true
  }, { merge: true })
  startTimer()
}

const startTimer = () => {
  remainingTime.value = 90
  setTimeout(() => {
    setInterval(() => {
      if (remainingTime.value === 0 || !remainingTime.value) { return }
      remainingTime.value--
      const minutes = Math.floor(remainingTime.value / 60)
      const seconds = remainingTime.value % 60
      timeLeft.value = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
    }, 1000)
  }, 1000)
}

onSnapshot(playerTurnRef, () => {
  startTimer()
})

const isPlayerTurn = computed(() => {
  if (!playerTurn.value) { return }
  if (playerTurn.value.playerId !== user.value?.uid) { return false }
  return true
})

const trueRandom = () => {
  return Math.floor(Math.random() * 6) + 1
}

const rollOne = async () => {
  if (!session.value) { return }
  if (session.value.playerTries < 3) { return }

  diceOnBoard.value = []

  for (let i = 0; i < 5; i++) {
    const dice = trueRandom()
    diceOnBoard.value.push(dice)
  }

  const diceSession = session.value
  diceSession.diceOnBoard = diceOnBoard.value
  diceSession.playerTries = 2
  await setDoc(sessionRef, diceSession, { merge: true })
}

const rollTwo = async () => {
  if (!session.value) { return }
  if (session.value.playerTries < 2) { return }
  if (!diceOnBoard.value.length) { return }

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
  if (!session.value) { return }
  if (session.value.playerTries < 1) { return }
  if (!diceOnBoard.value.length) { return }

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
  if (!session.value) { return }
  const diceSession = session.value
  diceOnBoard.value.push(diceSession.diceOnHand[index])
  diceSession.diceOnBoard.push(diceOnHand.value[index])
  await setDoc(sessionRef, diceSession, { merge: true })
  diceOnHand.value.splice(index, 1)
  diceSession.diceOnHand.splice(index, 1)
  await setDoc(sessionRef, diceSession, { merge: true })
}

const addDice = async (index: number) => {
  if (!session.value) { return }
  const diceSession = session.value
  diceOnHand.value.push(diceSession.diceOnBoard[index])
  diceSession.diceOnHand.push(diceOnBoard.value[index])
  await setDoc(sessionRef, diceSession, { merge: true })
  diceOnBoard.value.splice(index, 1)
  diceSession.diceOnBoard.splice(index, 1)
  await setDoc(sessionRef, diceSession, { merge: true })
}

const sendMessage = async () => {
  if (!message.value && !user.value && !session.value) { return }
  const username = session.value?.players.find((player: any) => player.id === user.value?.uid)?.username
  await setDoc(sessionRef, {
    messages: arrayUnion({
      username,
      content: message.value
    })
  }, { merge: true })
  message.value = ''
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
  border: 2px solid rgba(0, 0, 0, .8);
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
  top: 200px;
  right: 40px;
  transform: rotate(15deg);
}

.cup-three-container {
  cursor: pointer;
  position: absolute;
  top: 280px;
  right: 40px;
  transform: rotate(15deg);
}

.dice-plate-container{
  height: 70px;
  border: 2px solid rgba(0, 0, 0, .8);
}

.dice-container {
  width: 60px;
  height: 60px;
  border: 2px solid rgba(0, 0, 0, .8);
  border-radius: 5px;
  margin: 0 5px;
  background-color: rgba(255, 255, 255, .8);
  display: inline-block;
}
</style>
