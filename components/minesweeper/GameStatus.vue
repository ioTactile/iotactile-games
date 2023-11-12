<template>
  <div class="container-game-status">
    <button @click="restartGame">
      <v-icon :icon="mdiReload" size="30" :class="{ rotate: isRotating }" />
    </button>
    <div class="game-status">{{ gameStatusToString }}</div>
    <button @click="togglePause">
      <v-icon :icon="getTimerIcon" size="30" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiPauseBox, mdiPlayBox, mdiReload } from '@mdi/js'
import { GameStatus } from '~/utils/minesweeper/mineSweeper'
import type { Timer } from '~/utils/minesweeper/Timer'
import { sleep } from '~/utils'

const props = defineProps<{
  gameStatusToString: string
  gameStatus: GameStatus
  timer: Timer
}>()

const emit = defineEmits<{
  (e: 'restartGame'): void
}>()

const isRotating = ref<boolean>(false)

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

const restartGame = async (): Promise<void> => {
  isRotating.value = true
  await sleep(1000)
  isRotating.value = false
  emit('restartGame')
}
</script>

<style scoped lang="scss">
.container-game-status {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: rgb(var(--v-theme-mineSweeperMainOnSurface));

  .game-status {
    text-transform: uppercase;
    font-size: 1.25rem;
    letter-spacing: 0.1rem;
    font-family: 'Orbitron', sans-serif;
    margin: 0 10px;
  }

  .rotate {
    animation: rotate 1s forwards;
  }

  @keyframes rotate {
    to {
      transform: rotate(360deg);
    }
  }
}
</style>
