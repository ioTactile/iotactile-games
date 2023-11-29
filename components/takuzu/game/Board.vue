<template>
  <div class="game-wrapper">
    <takuzu-game-rules-modal
      v-if="isRulesModalActive"
      @open-rules="isRulesModalActive = false"
    />
    <div class="board-container">
      <div class="header-container">
        <button class="rules" @click="isRulesModalActive = true">
          <v-icon :icon="mdiLightbulb" color="takuzuMainSurface" />
        </button>
        <span class="timer">
          {{ timerFormatter(timer, true) }}
        </span>
        <div class="void" />
      </div>
      <div ref="game" class="board-container">
        <div class="board" :style="boardSizeStyle">
          <div
            v-for="(row, rowIndex) in gameBoard"
            :key="rowIndex"
            class="board-row"
          >
            <div v-for="(_, colIndex) in row" :key="colIndex">
              <button
                class="cell-button"
                @click="toggleCell(rowIndex, colIndex)"
              >
                <div
                  class="cell-content"
                  :class="cellState(row[colIndex])"
                  :style="difficultyBorderColorStyle"
                >
                  <div :class="startedCell(rowIndex, colIndex)" />
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="error-message">{{ errorMessage }}</div>
      <button class="button-replay" @click="restart">Rejouer</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiLightbulb } from '@mdi/js'
import { TileValues } from '~/utils/takuzu/constants'
import type {
  GameOptions,
  TakuzuBoard,
  TileValues as TTileValues
} from '~/utils/takuzu/types'
import { Takuzu, type ITakuzu } from '~/utils/takuzu/takuzu.js'

onMounted(() => {
  game.value?.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })

  watch(
    () => props.options,
    (newOptions) => {
      startGame(newOptions)
    },
    {
      immediate: true
    }
  )
})

const props = defineProps<{
  options: GameOptions
}>()

const takuzu = ref<ITakuzu>(new Takuzu())
const game = ref<HTMLElement | null>(null)
const errorMessage = ref<string>('')
const disabledTiles = ref<boolean[][]>([])
const isRulesModalActive = ref<boolean>(false)

const startGame = (options: GameOptions): void => {
  takuzu.value.start(options.boardSize)
  disabledStartedTiles()
}

const gameBoard = computed((): TakuzuBoard => takuzu.value.getTask())

const timer = computed((): number => takuzu.value.getTimer().getElapsedTime())

const getBoardSize = computed((): number => {
  return takuzu.value.getBoardSize()
})

// const getGameStatus = computed((): string => {
//   if (takuzu.value.getGameStatus() === 'won') return 'Gagné'
//   return ''
// })

const boardSizeStyle = computed((): Record<string, string> => {
  return {
    gridTemplateRows: `repeat(${getBoardSize.value}, 30px)`,
    gridTemplateColumns: `repeat(${getBoardSize.value}, 30px)`,
    backgroundColor: getBackgroundColor()
  }
})

const difficultyBorderColorStyle = computed((): Record<string, string> => {
  return {
    border: `0.5px solid ${getBorderColor()}`
  }
})

const isFinished = computed((): boolean => {
  return takuzu.value.getGameStatus() === 'won'
})

const toggleCell = (rowIndex: number, colIndex: number): void => {
  if (isFinished.value || disabledTiles.value[rowIndex][colIndex]) return

  if (takuzu.value.getGameStatus() === 'waiting') {
    takuzu.value.startGame()
  }

  const oldValue = takuzu.value.getTile(rowIndex, colIndex)
  const newValue =
    oldValue === TileValues.EMPTY
      ? TileValues.ZERO
      : oldValue === TileValues.ZERO
        ? TileValues.ONE
        : TileValues.EMPTY

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

const disabledStartedTiles = (): boolean[][] => {
  for (let i = 0; i < getBoardSize.value; i++) {
    disabledTiles.value.push([])
    for (let j = 0; j < getBoardSize.value; j++) {
      disabledTiles.value[i].push(gameBoard.value[i][j] !== TileValues.EMPTY)
    }
  }
  return disabledTiles.value
}

const cellState = (cell: TTileValues): string => {
  if (cell === TileValues.EMPTY) return 'cell--empty'
  if (cell === TileValues.ZERO) return 'cell--black'
  if (cell === TileValues.ONE) return 'cell--white'
  return ''
}

const startedCell = (rowIndex: number, colIndex: number): string => {
  if (disabledTiles.value[rowIndex][colIndex]) return 'cell--started'
  return ''
}
const getBackgroundColor = (): string => {
  if (props.options.difficulty === 'easy') return '#4CAF50'
  if (props.options.difficulty === 'medium') return '#3F51B5'
  if (props.options.difficulty === 'hard') return '#FF9800'
  if (props.options.difficulty === 'expert') return '#F44336'
  return ''
}

const getBorderColor = (): string => {
  if (props.options.difficulty === 'easy') return '#388E3C'
  if (props.options.difficulty === 'medium') return '#303F9F'
  if (props.options.difficulty === 'hard') return '#F57C00'
  if (props.options.difficulty === 'expert') return '#D32F2F'
  return ''
}

const restart = (): void => {
  errorMessage.value = ''
  disabledTiles.value = []

  takuzu.value.restart(props.options.boardSize)
  disabledStartedTiles()
}
</script>

<style scoped lang="scss">
.game-wrapper {
  position: relative;
  width: 100%;
}
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
      background-color: #fff;
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
      color: rgb(var(--v-theme-takuzuMainOnSurface));
      font-family: 'JetBrains Mono', monospace;
    }

    .void {
      width: 30px;
      height: 30px;
    }
  }

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

  .game-status {
    text-align: center;
    font-size: 1.5rem;
    margin: 10px 0;
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
      padding: 10px;
      gap: 10px;
      border-radius: 12px;

      .board-row {
        display: flex;
        justify-content: center;
        gap: 10px;
        height: 30px;
        width: 100%;

        .cell-button {
          width: 30px;
          height: 30px;
        }

        .cell-content {
          position: relative;
          width: 100%;
          height: 100%;
          -webkit-transition: background-color 0.2s ease-out;
          -moz-transition: background-color 0.2s ease-out;
          -ms-transition: background-color 0.2s ease-out;
          transition: background-color 0.2s ease-out;
        }

        .cell--empty {
          background-color: transparent;
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
          z-index: 1;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background-color: #b3b3b3;
          cursor: default;
        }
      }
    }

    .error-message {
      text-align: center;
      font-size: 1.25rem;
    }
  }
}
</style>
