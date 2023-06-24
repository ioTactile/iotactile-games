<template>
  <v-card color="yellow" elevation="0">
    <v-card-title class="text-center text-subtitle-1 text-sm-h6">
      Manche {{ getTurns }} - {{ isFinder }}
    </v-card-title>
  </v-card>
  <div class="text-center text-h5 text-sm-h4 font-weight-bold my-2">
    {{ getWord }}
  </div>
  <v-progress-linear
    v-model="linearProgress"
    color="green"
    bg-opacity="0.5"
    height="40"
  />
</template>

<script lang="ts" setup>
import { VCard, VCardTitle, VProgressLinear } from 'vuetify/components'
import { Word } from '~/functions/src/types'

// Interfaces

// Props

const props = defineProps<{
    remainingTurns: number
    playerOne: boolean
    isPlayerOneFinder: boolean
    words: Word[]
    getTurns: number
}>()

// Refs

const remainingTime = ref<number>(60)
const linearProgress = ref<number>(0)
const intervalId = ref<NodeJS.Timeout | null>(null)

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

  if ((props.playerOne && isFinder) || (!props.playerOne && !isFinder)) {
    return props.words[props.getTurns - 1].word
  }
})

// Methods

const getRemainingTimeFromLocalStorage = () => {
  const storedValue = localStorage.getItem('remainingTime')
  if (storedValue === null || storedValue <= '0') {
    return 60
  } else {
    return parseInt(storedValue, 10)
  }
}

const startTimer = () => {
  stopTimer()

  remainingTime.value = getRemainingTimeFromLocalStorage()

  intervalId.value = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
      linearProgress.value = (remainingTime.value / 60) * 100
      localStorage.setItem('remainingTime', remainingTime.value.toString())
    } else {
      stopTimer()
    }
  }, 1000)
}

const stopTimer = () => {
  if (intervalId) {
    clearInterval(intervalId.value as NodeJS.Timeout)
    intervalId.value = null
  }
}

// Watch

watch(
  () => props.remainingTurns,
  () => {
    startTimer()
  },
  { immediate: true }
)

</script>
