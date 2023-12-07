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
      <takuzu-game-main
        :timer="timer"
        :task-board="taskBoard"
        :disabled-cells="disabledCells"
        :options="props.options"
        :game-container="gameContainer"
        :scale="scale"
        :background-color="backgroundColor"
        @toggle-cell="toggleCell"
      />
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
  GameStatus,
  BoardSize
} from '~/utils/takuzu/types'
import type { Timer } from '~/utils/takuzu/timer'

type Options = {
  rowIndex: number
  colIndex: number
}

const props = defineProps<{
  options: GameOptions | null
}>()

const emits = defineEmits<{
  (e: 'action', value: string): void
}>()

const { width } = useDisplay()
const user = useCurrentUser()

onMounted(() => {
  const newOptions = props.options
  if (!newOptions) return
  start(newOptions)

  handleBoardContainerSize()
  handleBoardResize()
})

onUnmounted(() => {
  takuzu.value.getTimer().reset()
})

const takuzu = ref<ITakuzu>(new Takuzu())
const gameContainer = ref<HTMLElement | undefined>(undefined)
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

const toggleCell = async (options: Options): Promise<void> => {
  const { rowIndex, colIndex } = options

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

const getBoardWidthDependingOnBoardSize = (boardSize: BoardSize): number => {
  const boardSizeToWidthMap: Record<number, number> = {
    6: 320,
    8: 420,
    10: 520,
    12: 620
  }

  return boardSizeToWidthMap[boardSize]
}

const handleBoardContainerSize = (): void => {
  if (!props.options) return

  const { boardSize } = props.options
  const boardWidth = getBoardWidthDependingOnBoardSize(boardSize)
  setBoardContainerSize(boardWidth)
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
  }
}
</style>
