<template>
  <div class="container-game-status">
    <div class="game-status">{{ gameStatus }}</div>
    <button @click="togglePause">
      <v-icon :icon="getTimerIcon" size="30" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiPauseBox, mdiPlayBox } from '@mdi/js'
import type { Timer } from '~/utils/minesweeper/Timer'

const props = defineProps<{
  gameStatus: string
  timer: Timer
}>()

const getTimerIcon = computed(() => {
  const { timer, gameStatus } = props
  if (gameStatus === 'Perdu' || gameStatus === 'Gagné') return mdiPauseBox
  return timer.getIsPaused() ? mdiPauseBox : mdiPlayBox
})

const togglePause = () => {
  const { timer, gameStatus } = props
  if (gameStatus !== 'En cours') return
  timer.togglePause()
}
</script>

<style scoped lang="scss">
.container-game-status {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: rgb(var(--v-theme-onBackground));

  .game-status {
    text-transform: uppercase;
    font-size: 1.5rem;
    margin-right: 10px;
  }
}
</style>
