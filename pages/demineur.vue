<template>
  <minesweeper-template>
    <div class="d-flex justify-center align-center h-100">
      <template v-if="menuPage !== 5">
        <div class="menu-wrapper">
          <Tooltip
            content="Retour (esc)"
            position="top right"
            :slot-height="40"
            :slot-width="40"
            class="arrow-back"
            @on-click="returnToPreviousPage(menuPage)"
          >
            <template #activator="{ onMouseover, onMouseleave, onClick }">
              <button
                v-if="menuPage"
                @click="onClick"
                @mouseover="onMouseover"
                @mouseleave="onMouseleave"
              >
                <img :src="getArrowBackColor" alt="Retour" />
              </button>
            </template>
          </Tooltip>
          <h1 class="game-title mt-10 mb-6">Démineur</h1>
          <div class="menu-content">
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
          <Tooltip
            content="Retour (esc)"
            position="top right"
            :slot-height="35"
            :slot-width="35"
            class="arrow-back"
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
          <h1 class="game-title">Démineur</h1>
          <minesweeper-game-zoom class="magnify" />
          <minesweeper-game-status
            :game-status-to-string="gameStatusToString"
            :game-status="gameStatus"
            :timer="timer"
            @restart-game="restartGame"
          />
          <div class="game-board">
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
        </div>
      </template>
    </div>
  </minesweeper-template>
</template>

<script setup lang="ts">
import { collection, getDoc, setDoc, doc } from 'firebase/firestore'
import { useTheme } from 'vuetify'
import { mineSweeperScoreboardConverter } from '~/stores'
import { MineSweeper } from '~/utils/minesweeper/mineSweeper'
import type {
  GameOptions,
  IMineSweeper,
  Difficulty,
  GameStatus
} from '~/utils/minesweeper/mineSweeper'
import type { Cell } from '~/utils/minesweeper/cell'
import type { Timer } from '~/utils/minesweeper/Timer'
import type { CustomVictory } from '~/functions/src/types'

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

type OmittedCustomVictory = Omit<
  CustomVictory,
  'victories' | 'bestTime' | 'victoryDate'
>

if (process.client) {
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      returnToPreviousPage(menuPage.value)
    }
  })
}

const { current } = useTheme()

const db = useFirestore()
const user = useCurrentUser()

const mineSweeperScoreboard = collection(
  db,
  'mineSweeperScoreboard'
).withConverter(mineSweeperScoreboardConverter)

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
  mineSweeper.value.handleCellAction(rowIndex, colIndex, 'flag')
}

const handleLeftClick = async (data: {
  rowIndex: number
  colIndex: number
  callback: (gameStatus: GameStatus) => void
}): Promise<void> => {
  const { rowIndex, colIndex } = data
  mineSweeper.value.handleCellAction(rowIndex, colIndex, 'click')

  data.callback(mineSweeper.value.getGameStatus())
  if (mineSweeper.value.getGameStatus() === 'won') {
    if (!user.value) return
    const userRef = doc(db, 'users', user.value.uid)
    const userDoc = await getDoc(userRef)
    if (!userDoc.exists()) {
      return
    }
    const username = userDoc.data().username

    const difficulty = mineSweeper.value.getDifficulty()

    let scoreboard: LocalMineSweeperScoreboardType = {
      userId: user.value.uid,
      username,
      beginner: {
        victories: 0,
        bestTime: 0,
        victoryDate: new Date()
      },
      intermediate: {
        victories: 0,
        bestTime: 0,
        victoryDate: new Date()
      },
      expert: {
        victories: 0,
        bestTime: 0,
        victoryDate: new Date()
      },
      custom: []
    }

    const scoreboardRef = doc(mineSweeperScoreboard, user.value.uid)
    const scoreboardDoc = await getDoc(scoreboardRef)

    if (scoreboardDoc.exists()) {
      scoreboard = scoreboardDoc.data() || scoreboard
    }

    if (difficulty === 'custom') {
      const customVictoryIndex = scoreboard[difficulty].findIndex(
        (customVictory: OmittedCustomVictory) =>
          customVictory.rows === mineSweeper.value.getNumRows() &&
          customVictory.cols === mineSweeper.value.getNumCols() &&
          customVictory.mines === mineSweeper.value.getNumMines()
      )

      if (customVictoryIndex !== -1) {
        const scoreboardIndex = scoreboard[difficulty][customVictoryIndex]
        const bestTime =
          scoreboardIndex.bestTime >
          mineSweeper.value.getTimer().getElapsedTime()
            ? mineSweeper.value.getTimer().getElapsedTime()
            : scoreboardIndex.bestTime
        scoreboard[difficulty][customVictoryIndex] = {
          rows: scoreboardIndex.rows,
          cols: scoreboardIndex.cols,
          mines: scoreboardIndex.mines,
          victories: scoreboardIndex.victories + 1,
          bestTime,
          victoryDate: new Date(Date.now())
        }
      } else {
        scoreboard[difficulty].push({
          rows: mineSweeper.value.getNumRows(),
          cols: mineSweeper.value.getNumCols(),
          mines: mineSweeper.value.getNumMines(),
          victories: 1,
          bestTime: mineSweeper.value.getTimer().getElapsedTime(),
          victoryDate: new Date(Date.now())
        })
      }
    } else {
      const bestTime =
        scoreboard[difficulty]?.bestTime >
        mineSweeper.value.getTimer().getElapsedTime()
          ? mineSweeper.value.getTimer().getElapsedTime()
          : scoreboard[difficulty]?.bestTime ||
            mineSweeper.value.getTimer().getElapsedTime()
      scoreboard[difficulty] = {
        victories: scoreboard[difficulty]?.victories + 1 || 1,
        bestTime,
        victoryDate: new Date(Date.now())
      }
    }

    await setDoc(scoreboardRef, scoreboard, { merge: true })
  }
}

onBeforeRouteLeave((): void => {
  mineSweeper.value.getTimer().reset()
})
</script>

<style scoped lang="scss">
.menu-wrapper {
  position: relative;
  width: 500px;
  height: 650px;
  background-color: rgb(var(--v-theme-mineSweeperMainSurface));
  box-shadow: -10px -10px rgba(var(--v-theme-mineSweeperMainShadow), 0.3);
  color: rgb(var(--v-theme-onSurface));

  .menu-content {
    display: flex;
    justify-content: center;
  }

  .game-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
    font-weight: 700;
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
  box-shadow: -10px -10px rgba(var(--v-theme-mineSweeperMainShadow), 0.3);
  color: rgb(var(--v-theme-onSurface));

  .game-title {
    font-family: 'Orbitron', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    color: rgb(var(--v-theme-mineSweeperMainOnSurface));
  }

  .game-board {
    display: flex;
    justify-content: center;
    overflow: auto;
    width: 100%;
    height: 100%;
    margin: 1rem auto;
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

  .magnify {
    position: absolute;
    top: 50px;
    right: 345px;
  }
}
</style>
