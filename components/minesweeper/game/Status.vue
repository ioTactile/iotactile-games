<template>
  <div class="container-game-status">
    <Tooltip
      :content="'Recommencer (r)'"
      position="top"
      :slot-height="30"
      :slot-width="30"
    >
      <template #activator="{ onMouseover, onMouseleave }">
        <button
          @click="restartGame"
          @mouseover="onMouseover"
          @mouseleave="onMouseleave"
        >
          <v-icon :icon="mdiReload" size="30" :class="{ rotate: isRotating }" />
        </button>
      </template>
    </Tooltip>
    <div class="game-status">{{ gameStatusToString }}</div>
    <Tooltip
      :content="timer.getIsPaused() ? 'Reprendre (espace)' : 'Pause (espace)'"
      position="top"
      :slot-height="30"
      :slot-width="30"
    >
      <template #activator="{ onMouseover, onMouseleave }">
        <button
          @click="togglePause"
          @mouseover="onMouseover"
          @mouseleave="onMouseleave"
        >
          <v-icon :icon="getTimerIcon" size="30" />
        </button>
      </template>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiPauseBox, mdiPlayBox, mdiReload } from '@mdi/js'
import type { GameStatus } from '~/utils/minesweeper/mineSweeper'
import type { Timer } from '~/utils/minesweeper/Timer'
import { sleep } from '~/utils'

if (process.client) {
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'r') {
      restartGame()
    }
    if (e.key === ' ') {
      togglePause()
    }
  })
}

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
  if (gameStatus === 'inProgress') {
    return mdiPauseBox
  } else {
    return mdiPlayBox
  }
})

const togglePause = (): void => {
  const { timer, gameStatus } = props
  if (gameStatus !== 'inProgress') return
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
  font-weight: 700;
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
