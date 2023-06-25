<template>
  <v-row>
    <v-col cols="6">
      <v-card width="100%" rounded="0" elevation="0">
        <v-card-title class="bg-grey text-center">
          Indices
        </v-card-title>
        <v-card-text class="pa-0">
          <div
            v-for="(clue, i) in clues"
            :key="i"
            class="text-center text-h6 pa-0 item-border-left"
          >
            {{ clue }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col cols="6">
      <v-card width="100%" rounded="0" elevation="0">
        <v-card-title class="bg-grey text-center">
          Réponses
        </v-card-title>
        <v-card-text class="pa-0">
          <div
            v-for="(testedWord, j) in testedWords"
            :key="j"
            class="text-center text-h6 pa-0 item-border-right"
          >
            {{ testedWord }}
          </div>
        </v-card-text>
      </v-card>
    </v-col>
    <v-col v-if="!isRoundFinished" cols="12" class="d-flex flex-column align-center mt-8">
      <v-text-field
        v-if="
          ((props.playerOne && isPlayerOneFinder) ||
            (!props.playerOne && !isPlayerOneFinder)) &&
            playerTurnId === user?.uid &&
            clues.length !== 4
        "
        v-model="newClue"
        autofocus
        label="Ton indice"
        variant="outlined"
        density="comfortable"
        :disabled="clues.length === 4"
        hide-details
        class="item-size"
        @keyup.enter="sendNewWord()"
      />
      <v-text-field
        v-if="
          ((props.playerOne && !isPlayerOneFinder) ||
            (!props.playerOne && isPlayerOneFinder)) &&
            playerTurnId === user?.uid &&
            testedWords.length !== 4
        "
        v-model="newTestedWord"
        autofocus
        label="Ton Mot à tester"
        variant="outlined"
        density="comfortable"
        :disabled="testedWords.length === 4"
        hide-details
        class="item-size"
        @keyup.enter="sendNewWord()"
      />
      <v-btn
        v-if="playerTurnId === user?.uid"
        class="mt-8"
        color="light-blue"
        @click="sendNewWord()"
      >
        Envoyer
      </v-btn>
    </v-col>
  </v-row>
</template>

<script setup lang="ts">
import {
  VRow,
  VCol,
  VCard,
  VCardTitle,
  VCardText,
  VTextField,
  VBtn
} from 'vuetify/components'
import { Word } from '~/functions/src/types'

// Props

const props = defineProps<{
  testedWords: string[]
  clues: string[]
  words: Word[]
  getTurns: number
  playerOne: boolean
  isPlayerOneFinder: boolean
  isRoundFinished: boolean
  playerTurnId: string
}>()

const emits = defineEmits<{(e: 'update:newClue', value: string): void, (e: 'update:newTestedWord', value: string): void}>()

// Vuefire & Composables

const { notifier } = useNotifier()
const user = useCurrentUser()

// Refs

const newClue = ref<string>('')
const newTestedWord = ref<string>('')

// Computed

const getWord = computed(() => {
  const isFinder = props.isPlayerOneFinder

  if ((props.playerOne && isFinder) || (!props.playerOne && !isFinder)) {
    return props.words[props.getTurns - 1].word
  }
})

// Methods

const isWordMatch = (trueWord: string, clueWord: string, options: string) => {
  const trueWordWithoutAccent = trueWord.normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLocaleLowerCase()
  const clueWordWithoutAccent = clueWord.normalize('NFD').replace(/[\u0300-\u036F]/g, '').toLocaleLowerCase()

  if (options === 'threeLetter' && (trueWordWithoutAccent.substring(0, 3) === clueWordWithoutAccent.substring(0, 3))) {
    return true
  } else if (options === 'same' && (trueWordWithoutAccent === clueWordWithoutAccent)) {
    return true
  }
}

const sendNewWord = () => {
  if (!newClue.value && !newTestedWord.value) {
    notifier({ content: 'Veuillez entrer un mot', color: 'error' })
    return
  }

  if (newClue.value && getWord.value && isWordMatch(getWord.value, newClue.value, 'same')) {
    notifier({ content: 'Tu ne peux pas donner le mot à trouver en indice', color: 'error' })
    return
  }

  if (newClue.value && props.clues.some(clue => isWordMatch(clue, newClue.value, 'same'))) {
    notifier({ content: 'Tu as déjà donné cet indice', color: 'error' })
    return
  }

  if ((newClue.value && getWord.value && isWordMatch(getWord.value, newClue.value, 'threeLetter'))) {
    notifier({
      content: 'Les 3 premières lettres ne peuvent pas être identiques',
      color: 'error'
    })
    return
  }

  const isFinder = props.isPlayerOneFinder

  if ((props.playerOne && isFinder) || (!props.playerOne && !isFinder)) {
    emits('update:newClue', newClue.value)
    newClue.value = ''
  } else {
    emits('update:newTestedWord', newTestedWord.value)
    newTestedWord.value = ''
  }
}
</script>

<style scoped>
.item-border-left {
  border-left: 8px solid lightblue;
}

.item-border-right {
  border-right: 8px solid lightblue;
}

.item-size {
  width: 100%;
  min-width: 200px;
  max-width: 300px;
}
</style>
