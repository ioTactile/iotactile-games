<template>
  <div id="game" class="wrapper noselect" :style="gameSize">
    <div class="header-border-top">
      <div class="hd_wrapper-border-left-top wrapper-border-left-top" />
      <div class="hd_wrapper-border-hor wrapper-border-hor" />
      <div class="hd_wrapper-border-right-top wrapper-border-right-top" />
    </div>
    <div class="header-screen">
      <div class="hd_wrapper-border-vert wrapper-border-vert" />
      <div class="top-area">
        <div class="num-flags">{{ numNotDetectedMines }}</div>
        <v-icon
          :icon="mdiReload"
          size="30"
          :class="{ rotate: isRotating }"
          @click="restartGame"
        />
        <div class="timer">{{ timer.getNum() }}</div>
      </div>
      <div class="hd_wrapper-border-vert wrapper-border-vert" />
    </div>
    <div class="header-border-t">
      <div class="hd_wrapper-border-t-left wrapper-border-t-left" />
      <div class="hd_wrapper-border-hor wrapper-border-hor" />
      <div class="hd_wrapper-border-t-right wrapper-border-t-right" />
    </div>
    <div class="content">
      <div
        class="hd_wrapper-border-vert wrapper-border-vert"
        :style="contentWrapperBorderHeight"
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
              class="cell size24"
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
        :style="contentWrapperBorderHeight"
      />
    </div>
    <div class="footer-border">
      <div class="hd_wrapper-border-left-bottom wrapper-border-left-bottom" />
      <div class="hd_wrapper-border-hor wrapper-border-hor" />
      <div class="hd_wrapper-border-right-bottom wrapper-border-right-bottom" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiReload } from '@mdi/js'
import { Cell } from '~/utils/minesweeper/cell'
import type { IMineSweeper } from '~/utils/minesweeper/mineSweeper'
import type { Timer } from '~/utils/minesweeper/Timer'
import { sleep } from '~/utils'

const props = defineProps<{
  gameBoard: Cell[][]
  numRows: number
  numCols: number
  mineSweeper: IMineSweeper
  timer: Timer
}>()

const emit = defineEmits<{
  (e: 'restartGame'): void
  (e: 'rightClick', args: { rowIndex: number; colIndex: number }): void
  (e: 'leftClick', args: { rowIndex: number; colIndex: number }): void
}>()

const isRotating = ref<boolean>(false)
const cellSize = ref<number>(24)

const numNotDetectedMines = computed((): number => {
  return props.mineSweeper.getNumMines() - props.mineSweeper.getNumFlags()
})

const gridStyle = computed(
  (): { gridTemplateColumns: string; gridTemplateRows: string } => {
    return {
      gridTemplateColumns: `repeat(${props.numRows}, ${cellSize.value}px)`,
      gridTemplateRows: `repeat(${props.numCols}, ${cellSize.value}px)`
    }
  }
)

const gameSize = computed((): { width: string; height: string } => {
  return {
    width: `${props.numRows * cellSize.value + 36}px`,
    height: `${props.numCols * cellSize.value + 96}px`
  }
})

const contentWrapperBorderHeight = computed((): { height: string } => {
  return {
    height: `${props.numCols * cellSize.value}px`
  }
})

const numCells = computed((): number => {
  return props.numRows * props.numCols
})

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

const restartGame = async (): Promise<void> => {
  isRotating.value = true
  await sleep(1000)
  isRotating.value = false
  emit('restartGame')
}

const rightClick = (rowIndex: number, colIndex: number): void => {
  emit('rightClick', { rowIndex, colIndex })
}

const leftClick = (rowIndex: number, colIndex: number): void => {
  emit('leftClick', { rowIndex, colIndex })
}
</script>

<style scoped lang="scss">
#game {
  filter: brightness(100%);
  box-shadow: 0 4px 4px 0 rgba(19, 99, 172, 0.25);

  .header-border-top {
    .hd_wrapper-border-left-top {
      width: 18px;
      height: 16px;
      background-image: url('/minesweeper/borders/corner_up_left_blue_2x.png');
    }

    .hd_wrapper-border-hor {
      width: calc(100% - 36px);
      height: 16px;
      background-image: url('/minesweeper/borders/border_hor_blue_2x.png');
    }
    .hd_wrapper-border-right-top {
      width: 18px;
      height: 16px;
      background-image: url('/minesweeper/borders/corner_up_right_blue_2x.png');
    }

    .wrapper-border-right-top {
      float: left;
      background-size: 100% 100%;
    }
  }

  .header-screen {
    .hd_wrapper-border-vert {
      width: 18px;
      height: 48px;
      background-image: url('/minesweeper/borders/border_vert_blue_2x.png');
    }

    .top-area {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      width: calc(100% - 36px);
      height: 48px;
      float: left;
      background-color: #fff;
      color: #000000;

      div {
        font-size: 1.25rem;
        font-weight: 700;
      }

      .rotate {
        animation: rotate 1s forwards;
      }

      @keyframes rotate {
        to {
          transform: rotate(360deg);
        }
      }

      .num-flags,
      .timer {
        width: 30px;
      }

      .num-flags {
        text-align: start;
      }

      .timer {
        text-align: end;
      }
    }
  }

  .header-border-t {
    .hd_wrapper-border-t-left {
      width: 18px;
      height: 16px;
      background-image: url('/minesweeper/borders/t_left_blue_2x.png');
    }

    .hd_wrapper-border-hor {
      width: calc(100% - 36px);
      height: 16px;
      background-image: url('/minesweeper/borders/border_hor_blue_2x.png');
    }

    .hd_wrapper-border-t-right {
      width: 18px;
      height: 16px;
      background-image: url('/minesweeper/borders/t_right_blue_2x.png');
    }
  }

  .content {
    .hd_wrapper-border-vert {
      width: 18px;
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

      .size24 {
        width: 24px;
        height: 24px;
        font-size: 10px;
        line-height: 23px;
      }
    }
  }

  .footer-border {
    .hd_wrapper-border-left-bottom {
      width: 18px;
      height: 16px;
      background-image: url('/minesweeper/borders/corner_bottom_left_blue_2x.png');
    }

    .hd_wrapper-border-hor {
      width: calc(100% - 36px);
      height: 16px;
      background-image: url('/minesweeper/borders/border_hor_blue_2x.png');
    }

    .hd_wrapper-border-right-bottom {
      width: 18px;
      height: 16px;
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

.noselect {
  --webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
