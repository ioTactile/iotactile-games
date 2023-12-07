<template>
  <div
    class="content__main"
    :style="[
      `background-color: ${getColor('background')}`,
      `width: ${backgroundColor.width}`,
      `height: ${backgroundColor.height}`
    ]"
  >
    <div ref="board" class="board" :style="{ transform: `scale(${scale})` }">
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
</template>

<script setup lang="ts">
import { CellValues } from '~/utils/takuzu/constants'
import type { Timer } from '~/utils/takuzu/timer'
import type { CellValues as TCellValues, BoardSize } from '~/utils/takuzu/types'

const props = defineProps<{
  timer: Timer
  taskBoard: TCellValues[][]
  disabledCells: boolean[][]
  options: {
    boardSize: BoardSize
    difficulty: string
  } | null
  scale: number
  backgroundColor: {
    width: string
    height: string
  }
}>()

const emits = defineEmits<{
  (e: 'toggleCell', args: { rowIndex: number; colIndex: number }): void
}>()

onMounted(() => {
  board.value?.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })
})

const board = ref<HTMLElement | undefined>(undefined)

const toggleCell = (rowIndex: number, colIndex: number): void => {
  emits('toggleCell', { rowIndex, colIndex })
}

const cellValue = (cell: TCellValues): string => {
  if (cell === CellValues.EMPTY) return 'cell--empty'
  if (cell === CellValues.ZERO) return 'cell--black'
  if (cell === CellValues.ONE) return 'cell--white'
  return ''
}

const startedCell = (rowIndex: number, colIndex: number): string => {
  if (props.disabledCells[rowIndex][colIndex]) return 'cell--started'
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
</script>

<style scoped lang="scss">
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
</style>
