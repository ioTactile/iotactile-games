<template>
  <div>
    <Head>
      <Title>Session Dice - ioTactile Games</Title>
      <Meta name="description" content="Page d'une session de jeu Dice" />
    </Head>
    <dice-template v-if="session && playerTurn">
      <div class="pa-8">
        <div class="left-background" />
        <div class="d-flex justify-space-between">
          <dice-game-players
            :players="session.players"
            :player-turn-id="playerTurn.playerId"
          />
          <div>
            <dice-game-volumes />
            <dice-game-chat />
          </div>
        </div>
        <div class="mt-4">
          <dice-game-scoreboard v-if="isScoreboardActive" />
          <dice-game-playersheet v-else :player-sheet="playerSheet" />
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
} from '~/stores'

const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

const sessionId = route.params.id as string

const sessionRef = doc(db, 'diceSessions', sessionId).withConverter(
  diceSessionConverter,
)
const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))

const playerTurnRef = doc(db, 'diceSessionPlayerTurn', sessionId).withConverter(
  diceSessionPlayerTurnConverter,
)
const playerTurn = useDocument(
  doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id),
)

const scoresRef = doc(db, 'diceSessionScores', sessionId).withConverter(
  diceSessionScoresConverter,
)
const scores = useDocument(
  doc(collection(db, 'diceSessionScores'), scoresRef.id),
)

const isScoreboardActive = ref<boolean>(false)

watch(
  () => playerTurn.value?.playerId,
  (playerId) => {
    if (playerId === user.value?.uid) {
      isScoreboardActive.value = false
    } else {
      isScoreboardActive.value = true
    }
  },
)

console.log(scores.value?.playerTwo)

const playerSheet = computed(() => {
  if (scores.value?.playerOne.id === user.value?.uid) {
    return scores.value?.playerOne
  } else if (scores.value?.playerTwo?.id === user.value?.uid) {
    return scores.value?.playerTwo
  } else if (scores.value?.playerThree?.id === user.value?.uid) {
    return scores.value?.playerThree
  } else if (scores.value?.playerFour?.id === user.value?.uid) {
    return scores.value?.playerFour
  } else {
    return console.log('No player sheet found')
  }
})
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
</style>
