<template>
  <div class="container-game-status">
    <div class="game-status">{{ gameStatusToString }}</div>
    <button @click="togglePause">
      <v-icon :icon="getTimerIcon" size="30" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiPauseBox, mdiPlayBox } from '@mdi/js'
import { GameStatus } from '~/utils/minesweeper/mineSweeper'
import type { Timer } from '~/utils/minesweeper/Timer'

const props = defineProps<{
  gameStatusToString: string
  gameStatus: GameStatus
  timer: Timer
}>()

const getTimerIcon = computed((): string => {
  const { timer, gameStatus } = props
  if (timer.getIsPaused()) return mdiPlayBox
  if (gameStatus === GameStatus.IN_PROGRESS) {
    return mdiPauseBox
  } else {
    return mdiPlayBox
  }
})

const togglePause = (): void => {
  const { timer, gameStatus } = props
  if (gameStatus !== GameStatus.IN_PROGRESS) return
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
  color: rgb(var(--v-theme-mineSweeperMainBackground));

  .game-status {
    text-transform: uppercase;
    font-size: 1.5rem;
    margin-right: 10px;
  }
}
</style>
