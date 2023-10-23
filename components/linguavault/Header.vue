<template>
  <v-card color="yellow" elevation="0" rounded="0">
    <v-card-title class="text-center text-subtitle-1 text-sm-h6">
      Manche {{ getTurns }} - {{ isFinder }}
    </v-card-title>
  </v-card>
  <div class="text-center text-h5 text-sm-h4 font-weight-bold my-2">
    {{ getWord }}
  </div>
  <v-progress-linear v-model="linearProgress" color="green" bg-opacity="0.5" height="40" />
</template>

<script lang="ts" setup>
import { VCard, VCardTitle, VProgressLinear } from 'vuetify/components'
import { storeToRefs } from 'pinia'
import { useLvTimerStore } from '~/stores/lvTimer'
import { Word } from '~/functions/src/types'

// Props

const props = defineProps<{
  remainingTurns: number
  playerOne: boolean
  isPlayerOneFinder: boolean
  words: Word[]
  getTurns: number
  isRoundFinished: boolean
}>()

// Store

const lvTimerStoreRef = useLvTimerStore()
const { linearProgress, isRunning } = storeToRefs(lvTimerStoreRef)
const { start } = lvTimerStoreRef

// Computed

const isFinder = computed(() => {
  const isFinder = props.isPlayerOneFinder

  if ((props.playerOne && isFinder) || (!props.playerOne && !isFinder)) {
    return 'À toi de faire deviner le mot'
  } else {
    return 'Tu dois deviner le mot'
  }
})

const getWord = computed(() => {
  const isFinder = props.isPlayerOneFinder

  if (props.isRoundFinished) {
    return props.words[props.getTurns - 1].word
  }

  if ((props.playerOne && isFinder) || (!props.playerOne && !isFinder)) {
    return props.words[props.getTurns - 1].word
  }
})

// Watch

watch(
  () => props.remainingTurns,
  () => {
    if (isRunning.value || props.isRoundFinished) {
      return
    }
    start()
  },
  { immediate: true }
)
</script>
