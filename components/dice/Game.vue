<template>
  <v-container v-if="session" fluid class="container">
    <v-row>
      <v-col cols="9" class="background-image">
        <v-row>
          <v-col class="d-flex" cols="12">
            <dice-players :players="session.players" />
          </v-col>
          <v-col cols="6">
            <dice-board :scores="session.players.scores" />
          </v-col>
          <v-col cols="6" class="right-side-container pb-0">
            <v-row class="h-100">
              <v-col cols="10" />
              <v-col cols="2">
                <div class="timer-container">
                  <span class="timer-content bg-dicePrimary text-h5 px-2">{{ timer(session.timer) }}</span>
                </div>
                <div class="cup-one-container">
                  <v-btn :disabled="cupOne" @click="rollOne">
                    <v-img
                      src="/cup-no-bg.png"
                      height="80"
                      width="50"
                    />
                  </v-btn>
                </div>
                <div class="cup-two-container">
                  <v-btn :disabled="cupTwo" @click="rollTwo">
                    <v-img src="/cup-no-bg.png" height="80" width="50" />
                  </v-btn>
                </div>
                <div class="cup-three-container">
                  <v-btn :disabled="cupThree" @click="rollThree">
                    <v-img src="/cup-no-bg.png" height="80" width="50" />
                  </v-btn>
                </div>
              </v-col>
              <v-col cols="12" align-self="end" class="pl-0 pb-0">
                <div class="d-flex align-center bg-dicePrimary dice-plate-container">
                  <v-btn v-for="(dice, i) in dices" :key="i" class="dice-container" @click="removeDice(i)">
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
import { storeToRefs } from 'pinia'
import { collection, doc, setDoc, arrayUnion } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'
import { diceSessionConverter } from '~/stores'
import { useDicesStore } from '~/stores/dices'

const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

const sessionId = route.params.id
const sessionRef = doc(db, 'diceSessions', sessionId).withConverter(diceSessionConverter)

const session = useDocument(doc(collection(db, 'diceSessions'), sessionId))

const message = ref<string>('')
const tries = ref<number>(3)
console.log(tries.value)
const cupOne = ref(true)
const cupTwo = ref(true)
const cupThree = ref(true)
const dicesStoreRef = useDicesStore()
const { dices, selectedDices } = storeToRefs(dicesStoreRef)
const { addDice, removeDice, resetDices, getDices } = dicesStoreRef

// how to construct a dice game ?
// a player can roll 3 times max per round and can store dices between each roll

// how to construct dice object structure ?

const startGame = async () => {
  if (!session.value) { return }
  await setDoc(sessionRef, { isStarted: true }, { merge: true })

  while (session.value.counter > 0) {
    await setDoc(sessionRef, { counter: session.value.counter - 1 }, { merge: true })
  }
}

const rollOne = () => {
  for (let i = 0; i < 5; i++) {
    addDice(Math.floor(Math.random() * 6) + 1)
  }
  cupOne.value = false
  tries.value--
  return dices
}

const rollTwo = () => {
  for (let i = 0; i < 5; i++) {
    addDice(Math.floor(Math.random() * 6) + 1)
  }
  cupOne.value = false
  tries.value--
  return dices
}

const rollThree = () => {
  for (let i = 0; i < 5; i++) {
    addDice(Math.floor(Math.random() * 6) + 1)
  }
  cupOne.value = false
  tries.value--
  return dices
}

const timer = (time: number) => {
  const minutes = Math.floor(time / 60)
  const seconds = time % 60
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
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
