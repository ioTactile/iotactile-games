<template>
  <minesweeper-template>
    <div class="container">
      <template v-if="menuPage !== 5">
        <div class="menu-page">
          <div class="menu__header">
            <Tooltip
              v-if="menuPage"
              content="Retour (esc)"
              position="top right"
              :slot-height="40"
              :slot-width="40"
              class="button-back"
              @on-click="returnToPreviousPage(menuPage)"
            >
              <template #activator="{ onMouseover, onMouseleave, onClick }">
                <button
                  @click="onClick"
                  @mouseover="onMouseover"
                  @mouseleave="onMouseleave"
                >
                  <img :src="getArrowBackColor" alt="Retour" />
                </button>
              </template>
            </Tooltip>
            <div v-else class="void" />
            <h1 class="title">Démineur</h1>
            <div class="void" />
          </div>
          <div class="menu__content">
            <minesweeper-menu v-if="menuPage === 0" @action="handleActions" />
            <minesweeper-menu-play
              v-if="menuPage === 1"
              :is-custom="isCustom"
              @start-game="startGame"
              @is-custom="toggleIsCustom"
              @action="handleActions"
            />
            <minesweeper-menu-ranking
              v-if="
                menuPage === 2 ||
                menuPage === 2.1 ||
                menuPage === 2.2 ||
                menuPage === 2.3 ||
                menuPage === 2.4
              "
              :menu-page="menuPage"
              @action="handleActions"
            />
            <minesweeper-menu-results v-if="menuPage === 3" />
            <minesweeper-menu-rules
              v-if="menuPage === 4"
              @action="handleActions"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="game-page">
          <div class="game__header">
            <Tooltip
              content="Retour (esc)"
              position="top right"
              :slot-height="35"
              :slot-width="35"
              class="button-back"
              @on-click="returnToPreviousPage(menuPage)"
            >
              <template #activator="{ onMouseover, onMouseleave, onClick }">
                <button
                  @click="onClick"
                  @mouseover="onMouseover"
                  @mouseleave="onMouseleave"
                >
                  <img :src="getArrowBackColor" alt="Retour" />
                </button>
              </template>
            </Tooltip>
            <h1 class="title">Démineur</h1>
            <minesweeper-game-zoom v-if="width > 600" class="magnify" />
            <div v-else class="void" />
          </div>
          <minesweeper-game-status
            :game-status-to-string="gameStatusToString"
            :game-status="gameStatus"
            :timer="timer"
            @restart-game="restartGame"
            @selected-action="selectedAction = $event"
          />
          <minesweeper-game-board
            :game-board="gameBoard"
            :num-rows="numRows"
            :num-cols="numCols"
            :mine-sweeper="mineSweeper"
            :timer="timer"
            @left-click="handleLeftClick"
            @right-click="handleRightClick"
          />
        </div>
      </template>
    </div>
  </minesweeper-template>
</template>

<script setup lang="ts">
import { useTheme, useDisplay } from 'vuetify'
import { MineSweeper, type IMineSweeper } from '~/utils/minesweeper/mineSweeper'
import type {
  GameOptions,
  Difficulty,
  GameStatus
} from '~/utils/minesweeper/types'
import type { Cell } from '~/utils/minesweeper/cell'
import type { Timer } from '~/utils/minesweeper/Timer'
import { saveScoreboard } from '~/utils/minesweeper/database'

useSeoMeta({
  title: 'Démineur - ioTactile Games',
  ogTitle: 'Démineur - ioTactile Games',
  twitterTitle: 'Démineur - ioTactile Games',
  description: 'Page du jeu Démineur',
  ogDescription: 'Page du jeu Démineur',
  twitterDescription: 'Page du jeu Démineur',
  ogImage: '/minesweeper/minesweeper.png',
  twitterImage: '/minesweeper/minesweeper.png',
  twitterCard: 'summary_large_image',
  ogUrl: 'https://iotactile.games/minesweeper'
})

useHead({
  htmlAttrs: {
    lang: 'fr'
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: 'favicon.png'
    }
  ]
})

if (process.client) {
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      returnToPreviousPage(menuPage.value)
    }
  })
}

const { current } = useTheme()
const { width } = useDisplay()

const user = useCurrentUser()

const actionMap: Record<string, number> = {
  play: 1,
  ranking: 2,
  rankingBeginner: 2.1,
  rankingIntermediate: 2.2,
  rankingExpert: 2.3,
  rankingCustom: 2.4,
  results: 3,
  rules: 4,
  gameBoard: 5
}

const mineSweeper = ref<IMineSweeper>(new MineSweeper())
const numRows = ref<number>(9)
const numCols = ref<number>(9)
const numMines = ref<number>(10)
const difficulty = ref<Difficulty>('beginner')
const menuPage = ref<number>(0)
const isCustom = ref<boolean>(false)
const selectedAction = ref<string>('mine')

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

const gameBoard = computed((): Cell[][] => {
  const board = mineSweeper.value.getBoard()
  if (width.value > 600) {
    return board
  } else {
    const newBoard: Cell[][] = []
    for (let i = 0; i < board[0].length; i++) {
      newBoard.push([])
      for (let j = 0; j < board.length; j++) {
        newBoard[i].push(board[j][i])
      }
    }
    return newBoard
  }
})

const timer = computed((): Timer => mineSweeper.value.getTimer())

const gameStatusToString = computed((): string =>
  mineSweeper.value.getGameStatusString()
)

const gameStatus = computed((): GameStatus => mineSweeper.value.getGameStatus())

const getArrowBackColor = computed((): string => {
  return current.value.dark
    ? '/minesweeper/ui/left-arrow-grey.svg'
    : '/minesweeper/ui/left-arrow.svg'
})

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

  if (width.value > 600) {
    mineSweeper.value.handleCellAction(rowIndex, colIndex, 'flag')
  } else {
    mineSweeper.value.handleCellAction(colIndex, rowIndex, 'flag')
  }
}

const handleLeftClick = async (data: {
  rowIndex: number
  colIndex: number
  callback: (gameStatus: GameStatus) => void
}): Promise<void> => {
  const { rowIndex, colIndex } = data

  if (width.value > 600) {
    mineSweeper.value.handleCellAction(rowIndex, colIndex, 'click')
  } else if (width.value <= 600 && selectedAction.value === 'flag') {
    mineSweeper.value.handleCellAction(colIndex, rowIndex, 'flag')
  } else if (width.value <= 600 && selectedAction.value === 'mine') {
    mineSweeper.value.handleCellAction(colIndex, rowIndex, 'click')
  }

  data.callback(mineSweeper.value.getGameStatus())
  if (mineSweeper.value.getGameStatus() === 'won') {
    if (!user.value) return

    await saveScoreboard(
      user.value.uid,
      mineSweeper.value.getTimer().getElapsedTime(),
      difficulty.value,
      numCols.value,
      numRows.value,
      numMines.value
    )
  }
}

onBeforeRouteLeave((): void => {
  mineSweeper.value.getTimer().reset()
})
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .menu-page {
    position: relative;
    width: 500px;
    height: 650px;
    background-color: rgb(var(--v-theme-mineSweeperMainSurface));
    box-shadow: -10px -10px rgba(var(--v-theme-mineSweeperMainShadow), 0.3);
    color: rgb(var(--v-theme-onSurface));

    @media screen and (max-width: 600px) {
      box-shadow: none;
      width: 100%;
      height: 100%;
      margin: 0;
    }

    .menu__header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 40px 0 24px 0;

      .button-back {
        button {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        img {
          width: 40px;
          height: 40px;
        }

        @media screen and (max-width: 600px) {
          img {
            width: 30px;
            height: 30px;
          }
        }
      }

      .void {
        width: 40px;
        height: 40px;

        @media screen and (max-width: 600px) {
          width: 30px;
          height: 30px;
        }
      }
    }
  }

  .menu__content {
    display: flex;
    justify-content: center;
    width: 100%;
    height: calc(100% - 150px);
  }

  .game-page {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 1100px;
    height: calc(100% - 100px);
    padding: 1rem;
    background-color: rgb(var(--v-theme-mineSweeperMainSurface));
    box-shadow: -10px -10px rgba(var(--v-theme-mineSweeperMainShadow), 0.3);
    color: rgb(var(--v-theme-onSurface));

    @media screen and (max-width: 600px) {
      width: 100%;
      height: calc(100%);
      margin: 0;
      padding: 0;
      box-shadow: none;
    }

    .game__header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      gap: 1rem;

      .button-back {
        button {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        img {
          width: 40px;
          height: 40px;
        }

        @media screen and (max-width: 600px) {
          img {
            width: 30px;
            height: 30px;
          }
        }
      }

      .void {
        width: 40px;
        height: 40px;

        @media screen and (max-width: 600px) {
          width: 30px;
          height: 30px;
        }
      }

      @media screen and (max-width: 600px) {
        width: 100%;
        gap: 0;
      }
    }
  }

  .title {
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    color: rgb(var(--v-theme-mineSweeperMainOnSurface));

    @media screen and (max-width: 600px) {
      font-size: 2.5rem;
    }
  }
}
</style>
