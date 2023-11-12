<template>
  <minesweeper-template>
    <div class="d-flex justify-center align-center h-100">
      <template v-if="menuPage !== 4">
        <div class="menu-wrapper">
          <button
            v-if="menuPage"
            class="arrow-back"
            @click="returnToPreviousPage(menuPage)"
          >
            <img src="/minesweeper/ui/left-arrow.svg" alt="Retour" />
          </button>
          <h1 class="game-title mt-10 mb-6">Démineur</h1>
          <div class="d-flex justify-center">
            <minesweeper-menu-main
              v-if="menuPage === 0"
              @action="handleActions"
            />
            <minesweeper-menu-play
              v-if="menuPage === 1"
              :is-custom="isCustom"
              @start-game="startGame"
              @is-custom="toggleIsCustom"
              @action="handleActions"
            />
            <minesweeper-menu-ranking
              v-if="menuPage === 2"
              @action="handleActions"
            />
            <minesweeper-menu-rules v-if="menuPage === 3" />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="game-page">
          <button class="arrow-back" @click="returnToPreviousPage(menuPage)">
            <img src="/minesweeper/ui/left-arrow.svg" alt="Retour" />
          </button>
          <h1 class="game-title">Démineur</h1>
          <minesweeper-game-status
            :game-status-to-string="gameStatusToString"
            :game-status="gameStatus"
            :timer="timer"
          />
          <div class="game-board">
            <minesweeper-game-board
              :game-board="gameBoard"
              :num-rows="numRows"
              :num-cols="numCols"
              :mine-sweeper="mineSweeper"
              :timer="timer"
              @restart-game="restartGame"
              @left-click="handleLeftClick"
              @right-click="handleRightClick"
            />
          </div>
        </div>
      </template>
    </div>
  </minesweeper-template>
</template>

<script setup lang="ts">
import { MineSweeper, Difficulty } from '~/utils/minesweeper/mineSweeper'
import type { GameOptions, IMineSweeper } from '~/utils/minesweeper/mineSweeper'
import type { Cell } from '~/utils/minesweeper/cell'
import type { Timer } from '~/utils/minesweeper/Timer'

useSeoMeta({
  title: 'Démineur - ioTactile Games',
  ogTitle: 'Démineur - ioTactile Games',
  description: 'Page du jeu Démineur',
  ogDescription: 'Page du jeu Démineur',
  ogImage: '/minesweeper.jpg'
})

definePageMeta({
  middleware: ['auth']
})

const actionMap: Record<string, number> = {
  play: 1,
  ranking: 2,
  rankingBeginner: 2.1,
  rankingIntermediate: 2.2,
  rankingExpert: 2.3,
  rankingCustom: 2.4,
  rules: 3,
  gameBoard: 4
}

const mineSweeper = ref<IMineSweeper>(new MineSweeper())
const numRows = ref<number>(9)
const numCols = ref<number>(9)
const numMines = ref<number>(10)
const difficulty = ref<Difficulty>(Difficulty.BEGINNER)
const menuPage = ref<number>(0)
const isCustom = ref<boolean>(false)

const toggleIsCustom = (value?: boolean): void => {
  isCustom.value = value ?? !isCustom.value
}

const handleActions = (action: string): void => {
  menuPage.value = actionMap[action] || 0
}

const returnToPreviousPage = (actualPage: number): void => {
  if (actualPage > 2 && actualPage < 3) {
    menuPage.value = 2
  } else if (actualPage === 1 && isCustom.value === true) {
    isCustom.value = false
  } else {
    menuPage.value = 0
  }
}

const gameBoard = computed((): Cell[][] => mineSweeper.value.getBoard())

const timer = computed((): Timer => mineSweeper.value.getTimer())

const gameStatusToString = computed((): string =>
  mineSweeper.value.getGameStatusString()
)

const gameStatus = computed((): number => mineSweeper.value.getGameStatus())

const startGame = (options: GameOptions): void => {
  if (options.numMines > options.numRows * options.numCols) {
    return
  }

  mineSweeper.value.setup(options)
  numRows.value = options.numRows
  numCols.value = options.numCols
  numMines.value = options.numMines
  difficulty.value = options.difficulty
}

const restartGame = (): void => {
  mineSweeper.value.restart({
    numRows: numRows.value,
    numCols: numCols.value,
    numMines: numMines.value,
    difficulty: difficulty.value
  })
}

const handleRightClick = (data: {
  rowIndex: number
  colIndex: number
}): void => {
  const { rowIndex, colIndex } = data
  mineSweeper.value.handleCellAction(rowIndex, colIndex, 'flag')
  togglePause()
}

const handleLeftClick = (data: {
  rowIndex: number
  colIndex: number
}): void => {
  const { rowIndex, colIndex } = data
  mineSweeper.value.handleCellAction(rowIndex, colIndex, 'click')
  togglePause()
}

const togglePause = () => {
  mineSweeper.value.togglePause()
}

onUnmounted((): void => {
  mineSweeper.value.getTimer().stop()
})
</script>

<style scoped lang="scss">
.menu-wrapper {
  position: relative;
  width: 500px;
  height: 650px;
  background-color: rgb(var(--v-theme-mineSweeperMainSurface));
  box-shadow: -10px -10px rgba(217, 217, 217, 0.3);
  color: rgb(var(--v-theme-mineSweeperMainBackground));

  .game-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    text-align: center;
  }

  .arrow-back {
    position: absolute;
    top: 58px;
    left: 20px;

    img {
      width: 40px;
      height: 40px;
    }
  }
}

.game-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1100px;
  height: 700px;
  padding: 2rem;
  background-color: rgb(var(--v-theme-mineSweeperMainSurface));
  box-shadow: -10px -10px rgba(217, 217, 217, 0.3);
  color: rgb(var(--v-theme-mineSweeperMainBackground));

  .game-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
    font-weight: bold;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    color: rgb(var(--v-theme-mineSweeperMainBackground));
  }

  .game-board {
    margin-top: 2rem;
  }

  .arrow-back {
    position: absolute;
    top: 48px;
    left: 340px;

    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
