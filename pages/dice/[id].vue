<template>
  <div>
    <Head>
      <Title>Session Dice - ioTactile Games</Title>
      <Meta name="description" content="Page d'une session de jeu Dice" />
    </Head>
    <dice-template>
      <dice-game-players :players="session!.players" :player-turn-id="playerTurn!.playerId" />
    </dice-template>
  </div>
</template>

<script setup lang="ts">
import { collection, doc } from 'firebase/firestore'
import { diceSessionConverter, diceSessionPlayerTurnConverter } from '~/stores'

const db = useFirestore()
const route = useRoute()

const sessionId = route.params.id as string

const sessionRef = doc(db, 'diceSessions', sessionId).withConverter(diceSessionConverter)
const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))

const playerTurnRef = doc(db, 'diceSessionPlayerTurn', sessionId).withConverter(
  diceSessionPlayerTurnConverter
)
const playerTurn = useDocument(doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id))
</script>
