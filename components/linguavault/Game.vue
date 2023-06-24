<template>
  <v-container v-if="session && remainingTurns && playerTurn && words" fluid class="container">
    <v-row>
      <v-col cols="12">
        <LinguavaultHeader
          :remaining-turns="remainingTurns.remainingTurns"
          :words="words.words"
          :get-turns="getTurns"
          :player-one="getPlayerOne()"
          :is-player-one-finder="session.playerOne.isFinder"
        />
      </v-col>
      <v-col cols="12">
        <LinguavaultMain
          :tested-words="words.testedWords || []"
          :words="words.words"
          :get-turns="getTurns"
          :clues="words.clues || []"
          :player-one="getPlayerOne()"
          :is-player-one-finder="session.playerOne.isFinder"
          :player-turn-id="playerTurn.playerId"
          @update:new-clue="saveClue($event)"
          @update:new-tested-word="saveTestedWord($event)"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { VContainer, VRow, VCol } from 'vuetify/components'
import { doc, updateDoc } from 'firebase/firestore'
import {
  linguaVaultSessionConverter,
  linguaVaultSessionRemainingTurnsConverter,
  linguaVaultSessionPlayerTurnConverter,
  linguaVaultSessionWordsConverter
} from '~/stores'

// Vuefire & Composables

// const { notifier } = useNotifier()
const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

// Firestore

const sessionId = route.params.id as string

const sessionRef = doc(db, 'linguaVaultSessions', sessionId).withConverter(
  linguaVaultSessionConverter
)

const session = useDocument(sessionRef)

const remainingTurnsRef = doc(db, 'linguaVaultSessions', sessionId, 'remainingTurns', sessionId).withConverter(
  linguaVaultSessionRemainingTurnsConverter
)

const remainingTurns = useDocument(remainingTurnsRef)

const playerTurnRef = doc(db, 'linguaVaultSessions', sessionId, 'playerTurn', sessionId).withConverter(
  linguaVaultSessionPlayerTurnConverter
)

const playerTurn = useDocument(playerTurnRef)

const wordsRef = doc(db, 'linguaVaultSessions', sessionId, 'words', sessionId).withConverter(
  linguaVaultSessionWordsConverter
)

const words = useDocument(wordsRef)

// Computed

const getTurns = computed(() => 5 - remainingTurns.value!.remainingTurns)

// Methods

const getPlayerOne = () => session.value!.playerOne.id === user.value?.uid

const saveClue = async (clue: string) => {
  if (words.value) {
    const clues = words.value.clues || []
    const newClues = [...clues, clue]

    await updateDoc(wordsRef, {
      clues: newClues
    })

    switchPlayerTurn()
  }
}

const saveTestedWord = async (testedWord: string) => {
  if (words.value) {
    const testedWords = words.value.testedWords || []
    const newTestedWords = [...testedWords, testedWord]

    // Win condition
    if (testedWord === words.value.words[getTurns.value - 1].word) {
      await updateDoc(wordsRef, {
        testedWords: [],
        clues: []
      })
      await updateDoc(remainingTurnsRef, {
        remainingTurns: remainingTurns.value!.remainingTurns - 1
      })
      return
    }

    await updateDoc(wordsRef, {
      testedWords: newTestedWords
    })

    switchPlayerTurn()
  }
}

const switchPlayerTurn = async () => {
  if (playerTurn.value?.playerId === session.value?.playerOne.id) {
    await updateDoc(playerTurnRef, {
      playerId: session.value?.playerTwo.id
    })
  } else {
    await updateDoc(playerTurnRef, {
      playerId: session.value?.playerOne.id
    })
  }
}

</script>

<style scoped>
.container {
  max-width: 1800px;
}
</style>
