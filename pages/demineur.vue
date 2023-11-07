<template>
  <div class="container">
    <h1>Demineur</h1>
    <div class="header">
      <MinesweeperDifficultySelector
        :difficulties="difficulties"
        @toggle-custom-game="isCustom = !isCustom"
        @select-difficulty="initGame($event)"
      />
      <MinesweeperCustomGameForm
        v-if="isCustom"
        @init-custom-game="initCustomGame"
      />
    </div>
    <MinesweeperGameBoard
      :game-board="gameBoard"
      :game-status="gameStatus"
      :num-rows="numRows"
      :num-cols="numCols"
      :mine-sweeper="mineSwepper"
      :timer="timer"
      @restart-game="restartGame"
      @left-click="handleLeftClick"
      @right-click="handleRightClick"
    />
  </div>
</template>

<script setup lang="ts">
import { MineSweeper } from '~/utils/minesweeper/mineSweeper'
import { Difficulty } from '~/utils/minesweeper/enum'

const mineSwepper = ref<MineSweeper>(new MineSweeper())
const numRows = ref<number>(9)
const numCols = ref<number>(9)
const isCustom = ref<boolean>(false)
const timer = ref<number>(0)
const intervalId = ref<NodeJS.Timeout | undefined>(undefined)

const difficulties = [
  {
    value: Difficulty.BEGINNER,
    name: 'Débutant'
  },
  {
    value: Difficulty.INTERMEDIATE,
    name: 'Intermédiaire'
  },
  {
    value: Difficulty.EXPERT,
    name: 'Expert'
  }
]

const gameBoard = computed(() => mineSwepper.value.getBoard())

const gameStatus = computed(() => {
  if (mineSwepper.value.getGameStatus() === 0) {
    return 'En attente'
  } else if (mineSwepper.value.getGameStatus() === 1) {
    return 'En cours'
  } else if (mineSwepper.value.getGameStatus() === 2) {
    return 'Gagné'
  } else if (mineSwepper.value.getGameStatus() === 3) {
    return 'Perdu'
  }
})

const initGame = (difficulty: Difficulty) => {
  mineSwepper.value.setup(difficulty)
  numRows.value = mineSwepper.value.getNumRows()
  numCols.value = mineSwepper.value.getNumCols()
  restartTimer()
  isCustom.value = false
}

const initCustomGame = (data: {
  customRows: number
  customCols: number
  customMines: number
}) => {
  const { customRows, customCols, customMines } = data
  mineSwepper.value.setupCustom(customRows, customCols, customMines)
  numRows.value = mineSwepper.value.getNumRows()
  numCols.value = mineSwepper.value.getNumCols()
  restartTimer()
  isCustom.value = false
}

const restartGame = () => {
  mineSwepper.value.restart()
  restartTimer()
  isCustom.value = false
}

const handleRightClick = (data: { rowIndex: number; colIndex: number }) => {
  if (mineSwepper.value.getGameStatus() === 0) {
    startTimer()
  }
  const { rowIndex, colIndex } = data
  mineSwepper.value.flagCell(rowIndex, colIndex)
}

const handleLeftClick = (data: { rowIndex: number; colIndex: number }) => {
  if (mineSwepper.value.getGameStatus() === 0) {
    startTimer()
  }
  const { rowIndex, colIndex } = data
  mineSwepper.value.clickCell(rowIndex, colIndex)
}

const startTimer = () => {
  restartTimer()
  intervalId.value = setInterval(() => {
    timer.value++
  }, 1000)
}

const stopTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
}

const restartTimer = () => {
  if (intervalId.value) {
    clearInterval(intervalId.value)
  }
  timer.value = 0
}

watch(
  () => mineSwepper.value.getGameStatus(),
  (status) => {
    if (status === 2 || status === 3) {
      stopTimer()
    }
  }
)

onUnmounted(() => {
  restartTimer()
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;

  h1 {
    text-align: center;
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
}
</style>
