<template>
  <div>
    <div class="header">
      <h1>Takuzu</h1>
      <div class="game-options">
        <div class="game-options__board-size">
          <label for="board-size">Taille</label>
          <select id="board-size" v-model="boardSize">
            <option value="4">4x4</option>
            <option value="6">6x6</option>
            <option value="8">8x8</option>
            <option value="10">10x10</option>
            <option value="12">12x12</option>
            <option value="14">14x14</option>
            <option value="16">16x16</option>
            <option value="18">18x18</option>
            <option value="20">20x20</option>
          </select>
        </div>
        <button @click="restart">Rejouer</button>
      </div>
      <div class="timer">
        Temps:
        <span>
          {{ timerFormatter(timer, true) }}
        </span>
      </div>
    </div>
    <div class="game-status">
      {{ getGameStatus }}
    </div>
    <div ref="game" class="board-container">
      <div class="board" :style="boardSizeStyle">
        <div
          v-for="(row, rowIndex) in gameBoard"
          :key="rowIndex"
          class="board-row"
        >
          <div v-for="(_, colIndex) in row" :key="colIndex">
            <button class="cell-button" @click="toggleCell(rowIndex, colIndex)">
              <div class="cell-content" :class="cellState(row[colIndex])">
                <div :class="startedCell(rowIndex, colIndex)" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="error-message">{{ errorMessage }}</div>
  </div>
</template>

<script setup lang="ts">
import { TileValues } from '~/utils/takuzu/constants'
import { Takuzu, type ITakuzu, type BoardSize } from '~/utils/takuzu/takuzu.js'
import type {
  TakuzuBoard,
  TileValues as TTileValues
} from '~/utils/takuzu/types'

const takuzu = ref<ITakuzu>(new Takuzu())
const boardSize = ref<BoardSize>(4)
const errorMessage = ref<string>('')
const disabledTiles = ref<boolean[][]>([])
const game = ref<HTMLElement | null>(null)

onMounted(() => {
  takuzu.value.start(boardSize.value)
  disabledStartedTiles()

  game.value?.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
})

const gameBoard = computed((): TakuzuBoard => takuzu.value.getTask())

const disabledStartedTiles = (): boolean[][] => {
  for (let i = 0; i < getBoardSize.value; i++) {
    disabledTiles.value.push([])
    for (let j = 0; j < getBoardSize.value; j++) {
      disabledTiles.value[i].push(gameBoard.value[i][j] !== TileValues.EMPTY)
    }
  }
  return disabledTiles.value
}

const timer = computed((): number => takuzu.value.getTimer().getElapsedTime())

const getBoardSize = computed((): number => {
  return takuzu.value.getBoardSize()
})

const getGameStatus = computed((): string => {
  if (takuzu.value.getGameStatus() === 'waiting') return 'En attente'
  if (takuzu.value.getGameStatus() === 'inProgress') return 'En cours'
  if (takuzu.value.getGameStatus() === 'won') return 'Gagné'
  if (takuzu.value.getGameStatus() === 'lost') return 'Perdu'
  return ''
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

const boardSizeStyle = computed((): Record<string, string> => {
  return {
    gridTemplateRows: `repeat(${getBoardSize.value}, 50px)`,
    gridTemplateColumns: `repeat(${getBoardSize.value}, 50px)`
  }
})

const isFinished = computed((): boolean => {
  return takuzu.value.getGameStatus() === 'won'
})

const restart = (): void => {
  errorMessage.value = ''
  disabledTiles.value = []

  takuzu.value.restart(boardSize.value)
  disabledStartedTiles()
}
</script>

<style scoped lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  h1 {
    font-size: 2rem;
  }

  .game-options {
    display: flex;
    align-items: center;
    gap: 10px;

    .game-options__board-size {
      display: flex;
      flex-direction: column;
      min-width: 150px;

      label {
        font-size: 1.25rem;
        text-align: center;
      }

      select {
        padding: 5px 10px;
        border-radius: 5px;
        border: none;
        background-color: #1e90ff;
        color: white;
        cursor: pointer;
      }
    }

    button {
      align-self: flex-end;
      padding: 5px 10px;
      border-radius: 5px;
      border: none;
      background-color: #1e90ff;
      color: white;
      cursor: pointer;
    }
  }

  .timer {
    min-width: 150px;
  }
}

.game-status {
  text-align: center;
  font-size: 1.5rem;
  margin: 10px 0;
}

.board-container {
  display: flex;
  justify-content: center;
  height: 100%;
  width: 100%;

  .board {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    background-color: #b3b3b3;
    padding: 5px;
    gap: 5px;
    border-radius: 5px;

    .board-row {
      display: flex;
      justify-content: center;
      gap: 5px;

      .cell-button {
        width: 50px;
        height: 50px;
        border-radius: 5px;
      }

      .cell-content {
        position: relative;
        width: 100%;
        height: 100%;
        margin: auto;
        -webkit-transition: background-color 0.2s ease-out;
        -moz-transition: background-color 0.2s ease-out;
        -ms-transition: background-color 0.2s ease-out;
        transition: background-color 0.2s ease-out;
      }

      .cell--empty {
        background-color: rgb(167, 167, 167);
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
</style>
