<template>
  <div ref="gameBoardRef" class="game-board">
    <div
      id="game"
      class="wrapper"
      :style="[{ transform: `scale(${scale})` }, gameSize]"
    >
      <div class="header-border-top">
        <div
          class="hd_wrapper-border-left-top wrapper-border-left-top"
          :style="horBorderSize"
        />
        <div
          class="hd_wrapper-border-hor wrapper-border-hor"
          :style="horLongBorderSize"
        />
        <div
          class="hd_wrapper-border-right-top wrapper-border-right-top"
          :style="horBorderSize"
        />
      </div>
      <div class="header-screen">
        <div
          class="hd_wrapper-border-vert wrapper-border-vert"
          :style="vertBorderSize"
        />
        <div class="top-area" :style="horTopAreaBorderSize">
          <div :style="contentFontSize">{{ numNotDetectedMines }}</div>
          <div class="timer" :style="contentFontSize">
            {{ timerFormatter(timer.getElapsedTime(), true) }}
          </div>
        </div>
        <div
          class="hd_wrapper-border-vert wrapper-border-vert"
          :style="vertBorderSize"
        />
      </div>
      <div class="header-border-t">
        <div
          class="hd_wrapper-border-t-left wrapper-border-t-left"
          :style="horBorderSize"
        />
        <div
          class="hd_wrapper-border-hor wrapper-border-hor"
          :style="horLongBorderSize"
        />
        <div
          class="hd_wrapper-border-t-right wrapper-border-t-right"
          :style="horBorderSize"
        />
      </div>
      <div class="content">
        <div
          class="hd_wrapper-border-vert wrapper-border-vert"
          :style="vertContentBorderSize"
        />
        <div class="grid" :style="gridStyle">
          <template v-if="mineSweeper.getTimer().getIsPaused()">
            <div v-for="(_, index) in numCells" :key="index" class="paused" />
          </template>
          <template v-else>
            <div v-for="(row, rowIndex) in gameBoard" :key="rowIndex">
              <div
                v-for="(_, colIndex) in row"
                :key="colIndex"
                class="cell"
                :style="cellSize"
                :class="cellType(row[colIndex])"
                @click.right="rightClick(rowIndex, colIndex)"
                @click.left="leftClick(rowIndex, colIndex)"
                @contextmenu.prevent
              />
            </div>
          </template>
        </div>
        <div
          class="hd_wrapper-border-vert wrapper-border-vert"
          :style="vertContentBorderSize"
        />
      </div>
      <div class="footer-border">
        <div
          class="hd_wrapper-border-left-bottom wrapper-border-left-bottom"
          :style="horBorderSize"
        />
        <div
          class="hd_wrapper-border-hor wrapper-border-hor"
          :style="horLongBorderSize"
        />
        <div
          class="hd_wrapper-border-right-bottom wrapper-border-right-bottom"
          :style="horBorderSize"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'
import { Cell } from '~/utils/minesweeper/cell'
import type { IMineSweeper } from '~/utils/minesweeper/mineSweeper'
import type { Timer } from '~/utils/minesweeper/Timer'
import { timerFormatter } from '~/utils'
import { useMineSweeperZoomLevelStore } from '~/stores/mineSweeperZoomLevel'

const props = defineProps<{
  gameBoard: Cell[][]
  numRows: number
  numCols: number
  mineSweeper: IMineSweeper
  timer: Timer
}>()

const emit = defineEmits<{
  (e: 'rightClick', args: { rowIndex: number; colIndex: number }): void
  (
    e: 'leftClick',
    args: { rowIndex: number; colIndex: number; callback(): void }
  ): void
}>()

const { width } = useDisplay()

const gameBoardRef = ref<HTMLElement>()

const zoomLevelStore = useMineSweeperZoomLevelStore()
const { zoomLevel } = storeToRefs(zoomLevelStore)

const numNotDetectedMines = computed((): number => {
  return props.mineSweeper.getNumMines() - props.mineSweeper.getNumFlags()
})

const gridStyle = computed(
  (): { gridTemplateColumns: string; gridTemplateRows: string } => {
    if (width.value > 600) {
      return {
        gridTemplateColumns: `repeat(${props.numRows}, ${zoomLevel.value}px)`,
        gridTemplateRows: `repeat(${props.numCols}, ${zoomLevel.value}px)`
      }
    } else {
      return {
        gridTemplateColumns: `repeat(${props.numCols}, ${zoomLevel.value}px)`,
        gridTemplateRows: `repeat(${props.numRows}, ${zoomLevel.value}px)`
      }
    }
  }
)

const gameSize = computed((): { width: string; height: string } => {
  if (width.value > 600) {
    return {
      width: `${props.numRows * zoomLevel.value + ratio(36)}px`,
      height: `${props.numCols * zoomLevel.value + ratio(96)}px`
    }
  } else {
    return {
      width: `${props.numCols * zoomLevel.value + ratio(36)}px`,
      height: `${props.numRows * zoomLevel.value + ratio(96)}px`
    }
  }
})

const horBorderSize = computed((): { width: string; height: string } => {
  return { width: `${ratio(18)}px`, height: `${ratio(16.5)}px` }
})

const horLongBorderSize = computed((): { width: string; height: string } => {
  if (width.value > 600) {
    return {
      width: `${props.numRows * zoomLevel.value}px`,
      height: `${ratio(16.5)}px`
    }
  } else {
    return {
      width: `${props.numCols * zoomLevel.value}px`,
      height: `${ratio(16.5)}px`
    }
  }
})

const horTopAreaBorderSize = computed((): { width: string; height: string } => {
  return { width: `calc(100% - ${ratio(36)}px`, height: `${ratio(48)}px` }
})

const vertBorderSize = computed((): { width: string; height: string } => {
  return { width: `${ratio(18)}px`, height: `${ratio(48)}px` }
})

const vertContentBorderSize = computed(
  (): { width: string; height: string } => {
    if (width.value > 600) {
      return {
        width: `${ratio(18)}px`,
        height: `${props.numCols * zoomLevel.value}px`
      }
    } else {
      return {
        width: `${ratio(18)}px`,
        height: `${props.numRows * zoomLevel.value}px`
      }
    }
  }
)

const contentFontSize = computed((): { fontSize: string } => {
  return { fontSize: `${ratio(1)}rem` }
})

const cellSize = computed(
  (): {
    width: string
    height: string
    fontSize: string
    lineHeight: string
  } => {
    return {
      width: `${zoomLevel.value}px`,
      height: `${zoomLevel.value}px`,
      fontSize: `${ratio(10)}px`,
      lineHeight: `${zoomLevel.value - ratio(1)}px`
    }
  }
)

const numCells = computed((): number => {
  return props.numRows * props.numCols
})

const ratio = (size: number): number => {
  return (zoomLevel.value * size) / 24
}

const cellType = (cell: Cell): string => {
  if (cell.getIsFlagged() && !cell.getIsRevealed()) {
    return 'flag'
  } else if (!cell.getIsRevealed()) {
    return 'cell_closed'
  } else if (cell.getIsMine()) {
    if (cell.getIsRevealed() && cell.getIsMineClicked()) {
      return 'cell_type11'
    } else {
      return 'cell_type10'
    }
  } else if (cell.getNumAdjacentMines() === 0) {
    return 'cell_type0'
  } else if (cell.getNumAdjacentMines() === 1) {
    return 'cell_type1'
  } else if (cell.getNumAdjacentMines() === 2) {
    return 'cell_type2'
  } else if (cell.getNumAdjacentMines() === 3) {
    return 'cell_type3'
  } else if (cell.getNumAdjacentMines() === 4) {
    return 'cell_type4'
  } else if (cell.getNumAdjacentMines() === 5) {
    return 'cell_type5'
  } else if (cell.getNumAdjacentMines() === 6) {
    return 'cell_type6'
  } else if (cell.getNumAdjacentMines() === 7) {
    return 'cell_type7'
  } else if (cell.getNumAdjacentMines() === 8) {
    return 'cell_type8'
  } else {
    return ''
  }
}

const scale = computed(() => {
  if (!gameBoardRef.value) return 1
  const gameBoardWith = gameBoardRef.value.clientWidth

  if (width.value < 600) {
    return Math.min(
      gameBoardWith / (props.numCols * zoomLevel.value + ratio(36)),
      1
    )
  }

  return 1
})

const rightClick = (rowIndex: number, colIndex: number): void => {
  emit('rightClick', {
    rowIndex,
    colIndex
  })
}

const leftClick = (rowIndex: number, colIndex: number): void => {
  emit('leftClick', { rowIndex, colIndex, callback: () => {} })
}
</script>

<style scoped lang="scss">
.game-board {
  position: relative;
  display: flex;
  justify-content: center;
  overflow: auto;
  width: 100%;
  height: 100%;
  margin: 1rem auto;

  #game {
    position: absolute;
    transform-origin: top;
    box-shadow: 0 4px 4px 0 rgba(19, 99, 172, 0.25);

    .header-border-top {
      .hd_wrapper-border-left-top {
        background-image: url('/minesweeper/borders/corner_up_left_blue_2x.png');
      }

      .hd_wrapper-border-hor {
        background-image: url('/minesweeper/borders/border_hor_blue_2x.png');
      }
      .hd_wrapper-border-right-top {
        background-image: url('/minesweeper/borders/corner_up_right_blue_2x.png');
      }
    }

    .header-screen {
      .hd_wrapper-border-vert {
        background-image: url('/minesweeper/borders/border_vert_blue_2x.png');
      }

      .top-area {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        float: left;
        background-color: #f0f8ff;
        color: rgb(var(--v-theme-mineSweeperMainBackground));

        div {
          font-weight: 700;
          font-family: 'Orbitron', 'sans-serif';
        }

        .timer {
          min-width: 100px;
          text-align: center;
        }
      }
    }

    .header-border-t {
      .hd_wrapper-border-t-left {
        background-image: url('/minesweeper/borders/t_left_blue_2x.png');
      }

      .hd_wrapper-border-hor {
        background-image: url('/minesweeper/borders/border_hor_blue_2x.png');
      }

      .hd_wrapper-border-t-right {
        background-image: url('/minesweeper/borders/t_right_blue_2x.png');
      }
    }

    .content {
      .hd_wrapper-border-vert {
        background-image: url('/minesweeper/borders/border_vert_blue_2x.png');
      }

      .grid {
        display: grid;
        float: left;

        .paused {
          width: 100%;
          height: 100%;
          border: 1px solid rgb(var(--v-theme-mineSweeperMainTertiary));
          background-color: rgb(var(--v-theme-mineSweeperMainPrimary));
        }

        .cell_closed {
          background-image: url('/minesweeper/closed.svg');
        }

        .flag {
          background-image: url('/minesweeper/flag.svg');
        }

        .cell_type0 {
          background-image: url('/minesweeper/type0.svg');
        }

        .cell_type1 {
          background-image: url('/minesweeper/type1.svg');
        }

        .cell_type2 {
          background-image: url('/minesweeper/type2.svg');
        }

        .cell_type3 {
          background-image: url('/minesweeper/type3.svg');
        }

        .cell_type4 {
          background-image: url('/minesweeper/type4.svg');
        }

        .cell_type5 {
          background-image: url('/minesweeper/type5.svg');
        }

        .cell_type6 {
          background-image: url('/minesweeper/type6.svg');
        }

        .cell_type7 {
          background-image: url('/minesweeper/type7.svg');
        }

        .cell_type8 {
          background-image: url('/minesweeper/type8.svg');
        }

        .cell_type10 {
          background-image: url('/minesweeper/mine.svg');
        }

        .cell_type11 {
          background-image: url('/minesweeper/mine_red.svg');
        }

        .cell {
          float: left;
          background-size: 100% 100%;
          font-weight: 700;
          text-align: center;
        }
      }
    }

    .footer-border {
      .hd_wrapper-border-left-bottom {
        background-image: url('/minesweeper/borders/corner_bottom_left_blue_2x.png');
      }

      .hd_wrapper-border-hor {
        background-image: url('/minesweeper/borders/border_hor_blue_2x.png');
      }

      .hd_wrapper-border-right-bottom {
        background-image: url('/minesweeper/borders/corner_bottom_right_blue_2x.png');
      }
    }

    .wrapper-border-left-top {
      float: left;
      background-size: 100% 100%;
    }

    .wrapper-border-hor {
      float: left;
      background-size: 100% 100%;
    }

    .wrapper-border-right-top {
      float: left;
      background-size: 100% 100%;
    }

    .wrapper-border-vert {
      float: left;
      background-size: 100% 100%;
    }

    .wrapper-border-t-left {
      float: left;
      background-size: 100% 100%;
    }

    .wrapper-border-t-right {
      float: left;
      background-size: 100% 100%;
    }

    .wrapper-border-left-bottom {
      float: left;
      background-size: 100% 100%;
    }

    .wrapper-border-right-bottom {
      float: left;
      background-size: 100% 100%;
    }
  }

  .wrapper {
    border-collapse: separate;
  }
}
</style>
