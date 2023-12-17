<template>
  <div class="container-game-status">
    <Tooltip
      :content="'Recommencer (r)'"
      position="top"
      :slot-height="30"
      :slot-width="30"
      class="button-restart"
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
      class="button-pause"
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
    <button class="button-action" :class="selectedAction" @click="selectAction">
      <div :class="otherAction" class="other-action" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiPauseBox, mdiPlayBox, mdiReload } from '@mdi/js'
import type { GameStatus } from '~/utils/minesweeper/types'
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
  (e: 'selected-action', value: string): void
}>()

const isRotating = ref<boolean>(false)
const selectedAction = ref<string>('mine')

const getTimerIcon = computed((): string => {
  const { timer, gameStatus } = props
  if (timer.getIsPaused()) return mdiPlayBox
  if (gameStatus === 'inProgress') {
    return mdiPauseBox
  } else {
    return mdiPlayBox
  }
})

const selectAction = (): void => {
  if (selectedAction.value === 'flag') {
    selectedAction.value = 'mine'
    emit('selected-action', 'mine')
  } else {
    selectedAction.value = 'flag'
    emit('selected-action', 'flag')
  }
}

const otherAction = computed((): string => {
  if (selectedAction.value === 'flag') {
    return 'mine'
  } else {
    return 'flag'
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

  .button-action {
    position: relative;
    width: 22.5px;
    height: 22.5px;
    border-radius: 3px;
    background-color: rgb(var(--v-theme-mineSweeperMainPrimary));
    border: 1px solid rgb(var(--v-theme-mineSweeperMainTertiary));
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
    background-size: 100% 100%;
    background-repeat: no-repeat;
    margin-left: 1rem;

    &.flag {
      background-image: url('/minesweeper/flag_nobg.png');
    }

    &.mine {
      background-image: url('/minesweeper/mine_nobg.png');
    }

    .other-action {
      position: absolute;
      bottom: -20%;
      left: -10%;
      width: 10px;
      height: 10px;
      border-radius: 3px;
      background-color: rgb(var(--v-theme-mineSweeperMainSecondary));
      border: 0.5px solid rgb(var(--v-theme-mineSweeperMainPrimary));
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.25);
      background-size: 100% 100%;
      background-repeat: no-repeat;

      &.flag {
        background-image: url('/minesweeper/flag_nobg.png');
      }

      &.mine {
        background-image: url('/minesweeper/mine_nobg.png');
      }
    }

    @media screen and (min-width: 600px) {
      display: none;
    }
  }
}
</style>
