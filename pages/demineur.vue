<template>
  <div class="main-container">
    <h1 class="game-title">démineur</h1>
    <div class="header">
      <MinesweeperDifficultySelector
        :difficulties="difficulties"
        @toggle-custom-game="isCustom = !isCustom"
        @start-game="startGame"
      />
    </div>
    <div class="game">
      <MinesweeperGameBoard
        :game-board="gameBoard"
        :num-rows="numRows"
        :num-cols="numCols"
        :mine-sweeper="mineSweeper"
        :timer="timer.getNum()"
        @restart-game="restartGame"
        @left-click="handleLeftClick"
        @right-click="handleRightClick"
      />
      <MinesweeperGameStatus
        :game-status="gameStatus"
        :timer="timer"
        :is-custom="isCustom"
        @start-custom-game="startGame"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { MineSweeper, Difficulty } from '~/utils/minesweeper/mineSweeper'
import type { GameOptions } from '~/utils/minesweeper/mineSweeper'

useSeoMeta({
  title: 'Démineur - ioTactile Games',
  ogTitle: 'Démineur - ioTactile Games',
  description: 'Page du jeu Démineur',
  ogDescription: 'Page du jeu Démineur',
  ogImage: '/minesweeper.jpg'
})

const difficulties = [
  {
    name: 'Débutant',
    numRows: 9,
    numCols: 9,
    numMines: 10,
    difficulty: Difficulty.BEGINNER
  },
  {
    name: 'Intermédiaire',
    numRows: 16,
    numCols: 16,
    numMines: 40,
    difficulty: Difficulty.INTERMEDIATE
  },
  {
    name: 'Expert',
    numRows: 16,
    numCols: 30,
    numMines: 99,
    difficulty: Difficulty.EXPERT
  }
]

const mineSweeper = ref<MineSweeper>(new MineSweeper())
const numRows = ref<number>(9)
const numCols = ref<number>(9)
const numMines = ref<number>(10)
const difficulty = ref<Difficulty>(Difficulty.BEGINNER)
const isCustom = ref<boolean>(false)

const gameBoard = computed(() => mineSweeper.value.getBoard())

const timer = computed(() => mineSweeper.value.getTimer())

const gameStatus = computed(() => mineSweeper.value.getGameStatusString())

const startGame = (options: GameOptions) => {
  mineSweeper.value.setup(options)
  numRows.value = options.numRows
  numCols.value = options.numCols
  numMines.value = options.numMines
  difficulty.value = options.difficulty
  isCustom.value = false
}

const restartGame = () => {
  mineSweeper.value.restart({
    numRows: numRows.value,
    numCols: numCols.value,
    numMines: numMines.value,
    difficulty: difficulty.value
  })
  isCustom.value = false
}

const handleRightClick = (data: { rowIndex: number; colIndex: number }) => {
  const { rowIndex, colIndex } = data
  mineSweeper.value.flagCell(rowIndex, colIndex)
}

const handleLeftClick = (data: { rowIndex: number; colIndex: number }) => {
  const { rowIndex, colIndex } = data
  mineSweeper.value.clickCell(rowIndex, colIndex)
}

onUnmounted(() => {
  mineSweeper.value.getTimer().stop()
})
</script>

<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px;

  h1 {
    text-align: center;
    font-size: 2rem;
    text-transform: uppercase;
    color: rgb(var(--v-theme-onBackground));
  }

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .game {
    position: relative;
    display: flex;
    margin-top: 50px;
    margin-right: 140px;
  }
}
</style>
