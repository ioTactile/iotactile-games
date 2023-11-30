<template>
  <div class="game-wrapper">
    <takuzu-game-rules-modal
      v-if="isRulesModalActive"
      @open-rules="closeRulesModal"
    />
    <takuzu-game-won-modal
      v-if="isFinished"
      @restart="restart"
      @return-to-menu="returnToMenu"
    />
    <div class="board-container">
      <div class="header-container">
        <button class="rules" @click="openRulesModal">
          <v-icon :icon="mdiLightbulb" color="takuzuMainSurface" size="22" />
        </button>
        <span class="timer">
          {{ timerFormatter(elapsedTime, true) }}
        </span>
        <div class="void" />
      </div>
      <div class="board-container">
        <div ref="board" class="board" :style="boardSizeStyle">
          <div
            v-for="(row, rowIndex) in taskBoard"
            :key="rowIndex"
            class="board-row"
          >
            <div v-for="(_, colIndex) in row" :key="colIndex">
              <button
                class="cell-button"
                :class="[
                  cellValue(row[colIndex]),
                  startedCell(rowIndex, colIndex),
                  timer.getIsPaused() ? 'cell--paused' : ''
                ]"
                :style="borderEmptyCellsStyle(row[colIndex])"
                @click="toggleCell(rowIndex, colIndex)"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="error-message">{{ errorMessage }}</div>
      <div class="actions">
        <button class="button-action">
          <v-icon
            :icon="mdiStepBackward"
            color="takuzuMainSurface"
            size="22"
            @click="undo"
          />
        </button>
        <button class="button-action">
          <v-icon
            :icon="getPauseIcon"
            color="takuzuMainSurface"
            size="22"
            @click="togglePause"
          />
        </button>
        <button class="button-replay" @click="restart">Rejouer</button>
        <button class="button-action">
          <v-icon
            :icon="mdiRestart"
            color="takuzuMainSurface"
            size="22"
            :class="{ rotate: isRotating }"
            @click="reset"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import {
  mdiLightbulb,
  mdiPause,
  mdiPlay,
  mdiRestart,
  mdiStepBackward
} from '@mdi/js'
import { Takuzu, type ITakuzu } from '~/utils/takuzu/takuzu.js'
import { CellValues } from '~/utils/takuzu/constants'
import { sleep } from '~/utils'
import type {
  GameOptions,
  TakuzuBoard,
  CellValues as TCellValues,
  GameStatus
} from '~/utils/takuzu/types'
import type { Timer } from '~/utils/takuzu/timer'

onMounted(() => {
  const newOptions = props.options
  if (!newOptions) return
  start(newOptions)

  board.value?.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
})

onUnmounted(() => {
  takuzu.value.getTimer().reset()
})

const props = defineProps<{
  options: GameOptions | null
}>()

const emits = defineEmits<{
  (e: 'action', value: string): void
}>()

const takuzu = ref<ITakuzu>(new Takuzu())
const board = ref<HTMLElement | null>(null)
const errorMessage = ref<string>('')
const disabledCells = ref<boolean[][]>([])
const isRulesModalActive = ref<boolean>(false)
const isRotating = ref<boolean>(false)

const taskBoard = computed((): TakuzuBoard => takuzu.value.getTask())

const timer = computed((): Timer => takuzu.value.getTimer())

const elapsedTime = computed((): number =>
  takuzu.value.getTimer().getElapsedTime()
)

const gameStatus = computed((): GameStatus => takuzu.value.getGameStatus())

const boardHistory = computed((): TakuzuBoard[] =>
  takuzu.value.getBoardHistory()
)

const boardSize = computed((): number => {
  return takuzu.value.getBoardSize()
})

const boardSizeStyle = computed((): Record<string, string> => {
  return {
    gridTemplateRows: `repeat(${boardSize.value}, 40px)`,
    gridTemplateColumns: `repeat(${boardSize.value}, 40px)`,
    backgroundColor: getColor('background')
  }
})

const isFinished = computed((): boolean => {
  return takuzu.value.getGameStatus() === 'won'
})

const getPauseIcon = computed((): string => {
  if (timer.value.getIsPaused()) return mdiPlay
  if (gameStatus.value === 'inProgress') {
    return mdiPause
  } else {
    return mdiPlay
  }
})

const start = (options: GameOptions): void => {
  takuzu.value.start(options.boardSize, options.difficulty)
  disabledStartedCells()
}

const restart = (): void => {
  errorMessage.value = ''
  disabledCells.value = []

  takuzu.value.restart()
  disabledStartedCells()
}

const reset = async (): Promise<void> => {
  if (gameStatus.value !== 'inProgress') return
  isRotating.value = true
  await sleep(1000)
  isRotating.value = false
  takuzu.value.reset()
}

const togglePause = (): void => {
  if (gameStatus.value !== 'inProgress') return
  timer.value.togglePause()
}

const undo = (): void => {
  if (gameStatus.value !== 'inProgress') return
  takuzu.value.undo()
  console.log(boardHistory.value)
}

const returnToMenu = (): void => {
  emits('action', 'play')
}

const openRulesModal = (): void => {
  isRulesModalActive.value = true
  takuzu.value.getTimer().togglePause()
}

const closeRulesModal = (): void => {
  isRulesModalActive.value = false
  takuzu.value.getTimer().togglePause()
}

const toggleCell = (rowIndex: number, colIndex: number): void => {
  if (isFinished.value || disabledCells.value[rowIndex][colIndex]) return

  if (takuzu.value.getGameStatus() === 'waiting') {
    takuzu.value.startGame()
  }

  errorMessage.value = ''

  const oldValue = takuzu.value.getCell(rowIndex, colIndex)
  const newValue =
    oldValue === CellValues.EMPTY
      ? CellValues.ZERO
      : oldValue === CellValues.ZERO
        ? CellValues.ONE
        : CellValues.EMPTY

  takuzu.value.change(rowIndex, colIndex, newValue)

  if (!takuzu.value.isFull()) return

  const check = takuzu.value.check()
  if (check.error) {
    errorMessage.value = check.message
    return
  }

  errorMessage.value = ''
  takuzu.value.handleWin()
}

const disabledStartedCells = (): boolean[][] => {
  for (let i = 0; i < boardSize.value; i++) {
    disabledCells.value.push([])
    for (let j = 0; j < boardSize.value; j++) {
      disabledCells.value[i].push(taskBoard.value[i][j] !== CellValues.EMPTY)
    }
  }
  return disabledCells.value
}

const cellValue = (cell: TCellValues): string => {
  if (cell === CellValues.EMPTY) return 'cell--empty'
  if (cell === CellValues.ZERO) return 'cell--black'
  if (cell === CellValues.ONE) return 'cell--white'
  return ''
}

const startedCell = (rowIndex: number, colIndex: number): string => {
  if (disabledCells.value[rowIndex][colIndex]) return 'cell--started'
  return ''
}

const borderEmptyCellsStyle = (cell: TCellValues): string => {
  return cell === CellValues.EMPTY
    ? `border: 1px solid ${getColor('border')}`
    : ''
}

const getColor = (value: 'background' | 'border'): string => {
  if (!props.options) return ''
  if (value === 'background') {
    if (props.options.difficulty === 'easy') return '#4CAF50'
    if (props.options.difficulty === 'medium') return '#3F51B5'
    if (props.options.difficulty === 'hard') return '#FF9800'
    if (props.options.difficulty === 'expert') return '#F44336'
  } else if (value === 'border') {
    if (props.options.difficulty === 'easy') return '#388E3C'
    if (props.options.difficulty === 'medium') return '#303F9F'
    if (props.options.difficulty === 'hard') return '#F57C00'
    if (props.options.difficulty === 'expert') return '#D32F2F'
  }
  return ''
}
</script>

<style scoped lang="scss">
.game-wrapper {
  position: relative;
  width: 100%;

  .board-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    .header-container {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;

      .rules {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgb(var(--v-theme-takuzuMainOnSurface));
        border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
        transition: all 0.2s ease-in-out;
      }

      .timer {
        width: 150px;
        height: 30px;
        text-align: center;
        padding: 2.5px 5px;
        margin: 0 20px;
        border-radius: 20px;
        background-color: #ffffff;
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
        color: rgb(var(--v-theme-takuzuMainOnSurface));
        font-family: 'JetBrains Mono', monospace;
      }

      .void {
        width: 30px;
        height: 30px;
      }
    }

    .board-container {
      display: flex;
      justify-content: center;
      margin: 20px 0;

      .board {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        padding: 15px;
        gap: 10px;
        border-radius: 20px;

        .board-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          height: 40px;
          width: 100%;

          .cell-button {
            width: 40px;
            height: 40px;
            -webkit-transition: background-color 0.2s ease-out;
            -moz-transition: background-color 0.2s ease-out;
            -ms-transition: background-color 0.2s ease-out;
            transition: background-color 0.2s ease-out;
          }

          .cell--empty {
            border-radius: 50%;
          }

          .cell--black {
            background-color: #000000;
            border-radius: 50%;
          }

          .cell--white {
            background-color: #ffffff;
            border-radius: 50%;
          }

          .cell--started {
            box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
            transform-origin: center center;

            &:hover,
            &:active {
              -webkit-animation: wiggle 0.5s ease;
              -moz-animation: wiggle 0.5s ease;
              -ms-animation: wiggle 0.5s ease;
              animation: wiggle 0.5s ease;
            }
          }

          .cell--paused {
            background-color: rgba(0, 0, 0, 0.1);
            border: none !important;
            box-shadow: none !important;
            animation: none !important;
            cursor: not-allowed;
          }
        }
      }
    }

    .error-message {
      text-align: center;
      font-size: 1.25rem;
    }

    .actions {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;

      .button-replay {
        width: 200px;
        padding: 0.25rem 0.5rem;
        border-radius: 20px;
        background-color: rgb(var(--v-theme-takuzuMainOnSurface));
        color: rgb(var(--v-theme-background));
        border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
        transition: all 0.2s ease-in-out;
        font-family: 'JetBrains Mono', monospace;
        font-weight: 700;
      }

      .button-action {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: rgb(var(--v-theme-takuzuMainOnSurface));
        border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
        box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
        transition: all 0.2s ease-in-out;
      }

      .rotate {
        animation: rotate 1s forwards;
      }

      @keyframes rotate {
        to {
          transform: rotate(-360deg);
        }
      }
    }
  }
}

@keyframes wiggle {
  0% {
    transform: translateX(1px);
  }
  10% {
    transform: translateX(-1px);
  }
  20% {
    transform: translateX(1px);
  }
  30% {
    transform: translateX(-1px);
  }
  40% {
    transform: translateX(1px);
  }
  50% {
    transform: translateX(-1px);
  }
  60% {
    transform: translateX(1px);
  }
  70% {
    transform: translateX(-1px);
  }
  80% {
    transform: translateX(1px);
  }
  90% {
    transform: translateX(-1px);
  }
  100% {
    transform: none;
  }
}
</style>
