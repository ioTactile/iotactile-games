<template>
  <v-container v-if="session && remainingTurns && playerTurn && words" fluid class="container">
    <v-row>
      <v-col cols="12">
        <LinguavaultHeader
          :remaining-turns="remainingTurns.remainingTurns"
          :words="words.words"
          :get-turns="getTurns"
          :is-round-finished="session.isRoundFinished"
          :player-one="getPlayerOne()"
          :is-player-one-finder="session.playerOne.isFinder"
        />
      </v-col>
      <v-col cols="12">
        <LinguavaultMain
          :tested-words="words.testedWords || []"
          :words="words.words"
          :get-turns="getTurns"
          :is-round-finished="session.isRoundFinished"
          :clues="words.clues || []"
          :player-one="getPlayerOne()"
          :is-player-one-finder="session.playerOne.isFinder"
          :player-turn-id="playerTurn.playerId"
          @update:new-clue="saveClue($event)"
          @update:new-tested-word="saveTestedWord($event)"
        />
      </v-col>
      <v-col cols="12">
        <LinguavaultResults
          :word-difficulty="words.words[getTurns - 1].difficulty"
          :is-win="isWin"
          :is-round-finished="session.isRoundFinished"
        />
      </v-col>
      <template v-if="session.isRoundFinished && !session.isFinished">
        <v-col cols="6" class="text-center">
          <v-btn color="green" :disabled="!session.isRoundFinished" @click="continueGame()">
            Continuer
          </v-btn>
        </v-col>
        <v-col cols="6" class="text-center">
          <v-btn color="red" :disabled="!session.isRoundFinished" @click="stopGame()">
            Arrêter
          </v-btn>
        </v-col>
      </template>
      <v-col v-if="session.isFinished" cols="12" class="text-center">
        <v-btn color="blue" to="/lingua-vault/jouer">
          Retour au menu
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { VContainer, VRow, VCol, VBtn } from 'vuetify/components'
import { doc, updateDoc } from 'firebase/firestore'
import { storeToRefs } from 'pinia'
import { useLvTimerStore } from '~/stores/lvTimer'
import {
  linguaVaultSessionConverter,
  linguaVaultSessionRemainingTurnsConverter,
  linguaVaultSessionPlayerTurnConverter,
  linguaVaultSessionWordsConverter
} from '~/stores'

// Vuefire & Composables

const { notifier } = useNotifier()
const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

// Firestore

const sessionId = route.params.id as string

const sessionRef = doc(db, 'linguaVaultSessions', sessionId).withConverter(
  linguaVaultSessionConverter
)

const session = useDocument(sessionRef)

const remainingTurnsRef = doc(
  db,
  'linguaVaultSessions',
  sessionId,
  'remainingTurns',
  sessionId
).withConverter(linguaVaultSessionRemainingTurnsConverter)

const remainingTurns = useDocument(remainingTurnsRef)

const playerTurnRef = doc(
  db,
  'linguaVaultSessions',
  sessionId,
  'playerTurn',
  sessionId
).withConverter(linguaVaultSessionPlayerTurnConverter)

const playerTurn = useDocument(playerTurnRef)

const wordsRef = doc(db, 'linguaVaultSessions', sessionId, 'words', sessionId).withConverter(
  linguaVaultSessionWordsConverter
)

const words = useDocument(wordsRef)

// Refs

const isWin = ref(false)

// Store

const lvTimerStoreRef = useLvTimerStore()
const { timer: remainingTime } = storeToRefs(lvTimerStoreRef)
const { save } = lvTimerStoreRef

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
    const isFinished = session.value?.isRoundFinished

    await updateDoc(wordsRef, {
      testedWords: newTestedWords
    })

    if (!isFinished) {
      switchPlayerTurn()
    }
  }
}

const switchPlayerTurn = async () => {
  if (!session.value?.playerTwo) {
    return
  }

  const playerOneId = session.value?.playerOne.id
  const playerTwoId = session.value?.playerTwo.id

  const newPlayerId = playerTurn.value?.playerId === playerOneId ? playerTwoId : playerOneId

  await updateDoc(playerTurnRef, {
    playerId: newPlayerId
  })
}

// const switchPlayerRole = async () => {
//   if (!session.value?.playerTwo) { return }

//   const newPlayerOneIsFinder = !session.value?.playerOne.isFinder
//   const newPlayerTwoIsFinder = !session.value?.playerTwo.isFinder

//   const updatedPlayerOne = {
//     ...session.value.playerOne,
//     isFinder: newPlayerOneIsFinder
//   }

//   const updatedPlayerTwo = {
//     ...session.value.playerTwo,
//     isFinder: newPlayerTwoIsFinder
//   }

//   await updateDoc(sessionRef, {
//     playerOne: updatedPlayerOne,
//     playerTwo: updatedPlayerTwo
//   })

//   await updateDoc(playerTurnRef, {
//     playerId: session.value?.playerOne.isFinder
//       ? session.value?.playerOne.id
//       : session.value?.playerTwo.id
//   })
// }

const continueGame = async () => {
  if (user.value?.uid === session.value?.playerOne.id) {
    await updateDoc(sessionRef, {
      isPlayerOneContinue: true
    })
  } else if (user.value?.uid === session.value?.playerTwo?.id) {
    await updateDoc(sessionRef, {
      isPlayerTwoContinue: true
    })
  }
}

const stopGame = async () => {
  if (user.value?.uid === session.value?.playerOne.id) {
    await updateDoc(sessionRef, {
      isPlayerOneContinue: false
    })
  } else if (user.value?.uid === session.value?.playerTwo?.id) {
    await updateDoc(sessionRef, {
      isPlayerTwoContinue: false
    })
  }
}

const isWordMatch = (trueWord: string, testedWord: string) => {
  const trueWordWithoutAccent = trueWord
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLocaleLowerCase()
  const testedWordWithoutAccent = testedWord
    .normalize('NFD')
    .replace(/[\u0300-\u036F]/g, '')
    .toLocaleLowerCase()

  if (trueWord.length > 5 && testedWord.length > 5) {
    let errorCount = 0

    for (let i = 0; i < testedWordWithoutAccent.length; i++) {
      if (testedWordWithoutAccent[i] !== trueWordWithoutAccent[i]) {
        errorCount++
        if (errorCount > 1) {
          return false
        }
      }
    }
    return true
  } else {
    return trueWordWithoutAccent === testedWordWithoutAccent
  }
}

// Watch

watch(
  () => words.value?.testedWords,
  async (newValue) => {
    if (newValue && newValue.length === 0) {
      return
    }
    const currentWord = words.value!.words[getTurns.value - 1].word
    const testedWords = words.value?.testedWords || []

    if (isWordMatch(currentWord, testedWords[testedWords.length - 1])) {
      notifier({ content: 'Bravo !', color: 'success' })
      save()
      isWin.value = true
      await updateDoc(sessionRef, {
        isRoundFinished: true
      })

      if (remainingTurns.value?.remainingTurns === 1) {
        await updateDoc(sessionRef, {
          isFinished: true
        })
      }
    } else if (
      !isWordMatch(currentWord, testedWords[testedWords.length - 1]) &&
      testedWords.length === 4
    ) {
      notifier({ content: 'Vous avez perdu', color: 'error' })
      save()
      await updateDoc(sessionRef, {
        isRoundFinished: true
      })

      if (remainingTurns.value?.remainingTurns === 1) {
        await updateDoc(sessionRef, {
          isFinished: true
        })
      }
    }
  }
)

watch(
  () => remainingTime.value,
  async (newValue) => {
    if (newValue && newValue === 0) {
      notifier({ content: 'Temps écoulé', color: 'error' })
      await updateDoc(sessionRef, {
        isRoundFinished: true
      })
    }
  }
)

watch(
  () => session.value,
  (newValue) => {
    if (
      newValue &&
      newValue.isPlayerOneContinue &&
      newValue.isPlayerTwoContinue &&
      !newValue.isRoundFinished
    ) {
      isWin.value = false

      //   await updateDoc(sessionRef, {
      //     isPlayerOneContinue: null,
      //     isPlayerTwoContinue: null,
      //     isRoundFinished: false
      //   })

      //   switchPlayerRole()

      //   await updateDoc(wordsRef, {
      //     testedWords: [],
      //     clues: []
      //   })

      //   await updateDoc(remainingTurnsRef, {
      //     remainingTurns: remainingTurns.value!.remainingTurns - 1
      //   })
      // } else if (newValue &&
      // newValue.isPlayerOneContinue === false &&
      // newValue.isPlayerTwoContinue === false) {
      //   await updateDoc(sessionRef, {
      //     isFinished: true
      //   })
    }
  }
)
</script>

<style scoped>
.container {
  max-width: 1800px;
}
</style>
