<template>
  <div ref="gameWrapper" class="game-wrapper">
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
        <button class="rules svg-container" @click="openRulesModal">
          <svg
            fill="#CFD8DC"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="20px"
            height="20px"
            viewBox="0 0 491.535 491.535"
            xml:space="preserve"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <g>
                <g>
                  <g id="Icons_9_">
                    <g>
                      <path
                        d="M306.545,367.594H185.003c-9.041,0-16.382,7.338-16.382,16.385c0,9.05,7.341,16.384,16.382,16.384h121.542 c9.041,0,16.389-7.334,16.389-16.384C322.934,374.932,315.586,367.594,306.545,367.594z"
                      />
                      <path
                        d="M213.917,464.367v8.926c0,10.076,8.157,18.242,18.239,18.242h27.233c10.062,0,18.239-8.166,18.239-18.242v-8.926 c20.642-1.467,36.981-18.498,36.981-39.506H176.92C176.921,445.869,193.277,462.9,213.917,464.367z"
                      />
                      <path
                        d="M245.777,0C155.084,0,81.561,73.516,81.561,164.207c0,38.268,13.164,73.396,35.152,101.287 c19.444,24.647,37.874,51.592,53.76,78.688h150.583c16.049-27.353,34.146-53.793,53.78-78.707 c21.968-27.878,35.139-63.011,35.139-101.27C409.975,73.517,336.451,0,245.777,0z M246.05,56.971 c-58.297,0-105.702,47.412-105.702,105.692c0,9.048-7.327,16.385-16.389,16.385c-9.056,0-16.383-7.337-16.383-16.385 c0-76.346,62.114-138.46,138.474-138.46c9.034,0,16.383,7.334,16.383,16.382S255.084,56.971,246.05,56.971z"
                      />
                    </g>
                  </g>
                </g>
              </g>
            </g>
          </svg>
        </button>
        <span class="timer">
          {{ timerFormatter(elapsedTime, true) }}
        </span>
        <div class="void" />
      </div>
      <div
        class="board-content"
        :style="[
          `background-color: ${getColor('background')}`,
          `width: ${backgroundColor.width}`,
          `height: ${backgroundColor.height}`
        ]"
      >
        <div ref="board" class="board" :style="`transform: scale(${scale})`">
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
      <span v-if="errorMessage" class="error-message">{{ errorMessage }}</span>
      <div class="actions">
        <button class="button-action undo svg-container" @click="undo">
          <svg
            fill="#CFD8DC"
            width="20px"
            height="20px"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
            stroke="#CFD8DC"
            stroke-width="0.0002"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                d="M17.959 4.571L10.756 9.52s-.279.201-.279.481.279.479.279.479l7.203 4.951c.572.38 1.041.099 1.041-.626V5.196c0-.727-.469-1.008-1.041-.625zm-9.076 0L1.68 9.52s-.279.201-.279.481.279.479.279.479l7.203 4.951c.572.381 1.041.1 1.041-.625v-9.61c0-.727-.469-1.008-1.041-.625z"
              />
            </g>
          </svg>
        </button>
        <button class="button-action pause svg-container" @click="togglePause">
          <svg
            v-if="isPaused"
            width="28px"
            height="28px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                d="M8.286 3.407A1.5 1.5 0 0 0 6 4.684v14.632a1.5 1.5 0 0 0 2.286 1.277l11.888-7.316a1.5 1.5 0 0 0 0-2.555L8.286 3.407z"
                fill="#CFD8DC"
              />
            </g>
          </svg>
          <svg
            v-else
            width="28px"
            height="28px"
            viewBox="0 0 24 24"
            fill=""
            data-name="Flat Color"
            xmlns="http://www.w3.org/2000/svg"
            class="icon flat-color"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                id="primary"
                d="M19,4V20a2,2,0,0,1-2,2H15a2,2,0,0,1-2-2V4a2,2,0,0,1,2-2h2A2,2,0,0,1,19,4ZM9,2H7A2,2,0,0,0,5,4V20a2,2,0,0,0,2,2H9a2,2,0,0,0,2-2V4A2,2,0,0,0,9,2Z"
                fill="#cfd8dc"
              />
            </g>
          </svg>
        </button>
        <button class="button-action svg-container" @click="reset">
          <svg
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            :class="{ rotate: isRotating }"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <path
                d="M12.207 2.293a1 1 0 0 1 0 1.414L10.914 5H12.5c4.652 0 8.5 3.848 8.5 8.5S17.152 22 12.5 22 4 18.152 4 13.5a1 1 0 1 1 2 0c0 3.548 2.952 6.5 6.5 6.5s6.5-2.952 6.5-6.5S16.048 7 12.5 7h-1.586l1.293 1.293a1 1 0 0 1-1.414 1.414l-3-3a1 1 0 0 1 0-1.414l3-3a1 1 0 0 1 1.414 0z"
                fill="#CFD8DC"
              />
            </g>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { Takuzu, type ITakuzu } from '~/utils/takuzu/takuzu.js'
import { CellValues } from '~/utils/takuzu/constants'
import { saveScoreboard } from '~/utils/takuzu/database'
import { sleep } from '~/utils'
import type {
  GameOptions,
  TakuzuBoard,
  CellValues as TCellValues,
  GameStatus,
  BoardSize
} from '~/utils/takuzu/types'
import type { Timer } from '~/utils/takuzu/timer'

const user = useCurrentUser()

const { width, height } = useDisplay()

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
const gameWrapper = ref<HTMLElement | null>(null)
const board = ref<HTMLElement | null>(null)
const errorMessage = ref<string>('')
const disabledCells = ref<boolean[][]>([])
const isRulesModalActive = ref<boolean>(false)
const isRotating = ref<boolean>(false)
const scale = ref<number>(1)
const backgroundColor = reactive<{ width: string; height: string }>({
  width: '320px',
  height: '320px'
})

// const resizeTimeout = ref<NodeJS.Timeout | null>(null)

const taskBoard = computed((): TakuzuBoard => takuzu.value.getTask())

const timer = computed((): Timer => takuzu.value.getTimer())

const elapsedTime = computed((): number =>
  takuzu.value.getTimer().getElapsedTime()
)

const gameStatus = computed((): GameStatus => takuzu.value.getGameStatus())

const boardSize = computed((): number => {
  return takuzu.value.getBoardSize()
})

const isFinished = computed((): boolean => {
  return takuzu.value.getGameStatus() === 'won'
})

const isPaused = computed((): boolean => {
  if (timer.value.getIsPaused()) return true
  return false
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
  errorMessage.value = ''
  takuzu.value.reset()
}

const togglePause = (): void => {
  if (gameStatus.value !== 'inProgress') return
  timer.value.togglePause()
}

const undo = (): void => {
  if (gameStatus.value !== 'inProgress') return
  takuzu.value.undo()
}

const returnToMenu = (): void => {
  emits('action', 'play')
}

const openRulesModal = (): void => {
  isRulesModalActive.value = true
  if (gameStatus.value === 'inProgress') takuzu.value.getTimer().togglePause()
}

const closeRulesModal = (): void => {
  isRulesModalActive.value = false
  if (gameStatus.value === 'inProgress') takuzu.value.getTimer().togglePause()
}

const toggleCell = async (
  rowIndex: number,
  colIndex: number
): Promise<void> => {
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

  if (!user.value || !elapsedTime.value || !props.options) return
  const { boardSize, difficulty } = props.options

  await saveScoreboard(user.value.uid, elapsedTime.value, boardSize, difficulty)
  console.log('Scoreboard saved')
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

const getWithByBoardSize = (boardSize?: BoardSize): number => {
  switch (boardSize) {
    case 6:
      return 320
    case 8:
      return 420
    case 10:
      return 520
    case 12:
      return 620
    default:
      return 320
  }
}

const HandleBackgroundColor = (): void => {
  if (!props.options) return
  const { boardSize } = props.options
  let boardWidth = getWithByBoardSize(boardSize)
  const targetWidth = width.value - 60

  if (width.value < 600) {
    boardWidth = Math.min(targetWidth, boardWidth)
  } else if (
    width.value > 600 &&
    gameWrapper.value &&
    gameWrapper.value.clientHeight - 200 < boardWidth
  ) {
    boardWidth = gameWrapper.value.clientHeight - 200
  }

  backgroundColor.width = `${boardWidth}px`
  backgroundColor.height = `${boardWidth}px`
}

const handleResize = (): void => {
  if (!props.options) return
  const { boardSize } = props.options
  const boardWidth = getWithByBoardSize(boardSize)

  const targetWidth = width.value - 60

  if (width.value < 600) {
    scale.value = Math.min(targetWidth / boardWidth, 1)
    return
  } else if (
    width.value > 600 &&
    gameWrapper.value &&
    gameWrapper.value.clientHeight - 200 < boardWidth
  ) {
    scale.value = (gameWrapper.value.clientHeight - 200) / boardWidth
    return
  }

  scale.value = 1
}

watch(
  [width, height],
  () => {
    HandleBackgroundColor()
    handleResize()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.game-wrapper {
  position: relative;
  width: 100%;
  height: 100%;

  .board-container {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width: 600px) {
      justify-content: space-evenly;
    }

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

        @media screen and (max-width: 600px) {
          padding-right: 2px;
        }
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

    .board-content {
      display: flex;
      justify-content: center;
      margin: 20px 0;
      border-radius: 20px;

      @media screen and (max-width: 600px) {
        margin: 10px 0;
      }

      .board {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        padding: 15px;
        gap: 10px;

        .board-row {
          display: flex;
          justify-content: center;
          gap: 10px;
          height: auto;
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
      font-size: 1rem;
      margin: 0 auto 20px auto;
      max-width: 500px;

      @media screen and (max-width: 600px) {
        margin: 0.5rem 5px;
        font-size: 0.85rem;
      }
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

        @media screen and (max-width: 600px) {
          padding-right: 2px;
        }
      }

      .button-action.pause {
        width: 40px;
        height: 40px;
      }

      .button-action.undo {
        padding-right: 2px;

        @media screen and (max-width: 600px) {
          padding-right: 4px;
        }
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
