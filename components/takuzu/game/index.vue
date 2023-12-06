<template>
  <div ref="gameContainer" class="game-container">
    <takuzu-game-rules-modal
      v-if="isRulesModalActive"
      @open-rules="closeRulesModal"
    />
    <takuzu-game-victory-modal
      v-if="isFinished"
      :elapsed-time="elapsedTime"
      @restart="restart"
      @return-to-menu="returnToMenu"
    />
    <div class="content">
      <takuzu-game-header
        :elapsed-time="elapsedTime"
        @open-rules-modal="openRulesModal"
      />
      <div
        class="content__main"
        :style="[
          `background-color: ${getColor('background')}`,
          `width: ${backgroundColor.width}`,
          `height: ${backgroundColor.height}`
        ]"
      >
        <div
          ref="board"
          class="board"
          :style="{ transform: `scale(${scale})` }"
        >
          <div
            v-for="(row, rowIndex) in taskBoard"
            :key="rowIndex"
            class="board-row"
          >
            <div v-for="(_, colIndex) in row" :key="colIndex">
              <button
                class="button-cell"
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
      <takuzu-game-footer
        :error-message="errorMessage"
        :is-paused="isPaused"
        :is-rotating="isRotating"
        @undo="undo"
        @toggle-pause="togglePause"
        @reset="reset"
      />
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

const props = defineProps<{
  options: GameOptions | null
}>()

const emits = defineEmits<{
  (e: 'action', value: string): void
}>()

const user = useCurrentUser()

const { width } = useDisplay()

onMounted(() => {
  const newOptions = props.options
  if (!newOptions) return
  start(newOptions)

  board.value?.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })

  handleBoardContainerSize()
  handleBoardResize()
})

onUnmounted(() => {
  takuzu.value.getTimer().reset()
})

const takuzu = ref<ITakuzu>(new Takuzu())
const gameContainer = ref<HTMLElement | null>(null)
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

const getBoardWidthDependingOnBoardSize = (boardSize: BoardSize): number => {
  const boardSizeToWidthMap: Record<number, number> = {
    6: 320,
    8: 420,
    10: 520,
    12: 620
  }

  return boardSizeToWidthMap[boardSize]
}

const setBoardContainerSize = (boardWidth: number): void => {
  if (!props.options) return

  const targetWidth = width.value - 60
  const adjustedBoardWidth =
    width.value < 600
      ? Math.min(targetWidth, boardWidth)
      : gameContainer.value &&
          gameContainer.value.clientHeight - 200 < boardWidth
        ? gameContainer.value.clientHeight - 200
        : boardWidth

  backgroundColor.width = `${adjustedBoardWidth}px`
  backgroundColor.height = `${adjustedBoardWidth}px`
}

const handleBoardContainerSize = (): void => {
  if (!props.options) return

  const { boardSize } = props.options
  const boardWidth = getBoardWidthDependingOnBoardSize(boardSize)
  setBoardContainerSize(boardWidth)
}

const handleBoardResize = (): void => {
  if (!props.options) return

  const { boardSize } = props.options
  const boardWidth = getBoardWidthDependingOnBoardSize(boardSize)
  const targetWidth = width.value - 60

  if (width.value < 600) {
    scale.value = Math.min(targetWidth / boardWidth, 1)
  } else if (
    width.value > 600 &&
    gameContainer.value &&
    gameContainer.value.clientHeight - 200 < boardWidth
  ) {
    scale.value = (gameContainer.value.clientHeight - 200) / boardWidth
  } else {
    scale.value = 1
  }
}
</script>

<style scoped lang="scss">
.game-container {
  position: relative;
  width: 100%;
  height: 100%;

  .content {
    display: flex;
    flex-direction: column;
    align-items: center;

    @media screen and (max-width: 600px) {
      justify-content: space-evenly;
    }

    .content__main {
      display: flex;
      justify-content: center;
      border-radius: 20px;
      margin: 20px 0;

      @media screen and (max-width: 600px) {
        margin: 10px 0;
      }

      .board {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 10px;

        .board-row {
          width: 100%;
          height: 40px;
          display: flex;
          gap: 10px;

          .button-cell {
            width: 40px;
            height: 40px;
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

            &:hover,
            &:active {
              animation: wiggle 0.5s ease;
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
  }
}
</style>
