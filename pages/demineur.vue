<template>
  <div class="container">
    <h1>Demineur</h1>
    <div class="header">
      <div>
        <button
          v-for="(difficulty, i) in difficulties"
          :key="i"
          class="btn-difficulty"
          @click="init(difficulty.value)"
        >
          {{ difficulty.name }}
        </button>
        <button class="btn-difficulty" @click="isCustom = !isCustom">
          Personnalisé
        </button>
      </div>
      <div v-if="isCustom">
        <form class="form-inline" @submit.prevent="initCustom">
          <div class="form-group">
            <label for="custom_width"> Hauteur </label>
            <input
              id="custom_width"
              v-model="numRows"
              type="number"
              min="1"
              max="100"
              class="form-control custom-input"
            />
          </div>
          <div class="form-group">
            <label for="custom_height"> Largeur </label>
            <input
              id="custom_height"
              v-model="numCols"
              type="number"
              min="1"
              max="100"
              class="form-control custom-input"
            />
          </div>
          <div class="form-group">
            <label for="custom_mines"> Mines </label>
            <input
              id="custom_mines"
              v-model="numMines"
              type="number"
              min="1"
              max="10000"
              class="form-control custom-input"
            />
          </div>
          <button type="submit" class="btn">Valider</button>
        </form>
      </div>
    </div>
    <div id="game" class="wrapper noselect" :style="gameWith">
      <div class="header-border-top">
        <div class="hd_wrapper-border-left-top wrapper-border-left-top" />
        <div class="hd_wrapper-border-hor wrapper-border-hor" />
        <div class="hd_wrapper-border-right-top wrapper-border-right-top" />
      </div>
      <div class="header-screen">
        <div class="hd_wrapper-border-vert wrapper-border-vert" />
        <div id="top_area" class="top-area">
          <div>{{ gameStatus }}</div>
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
        <div id="grid" :style="gridStyle">
          <div
            v-for="(row, rowIndex) in game"
            :key="rowIndex"
            :style="gridStyle"
          >
            <div
              v-for="(_, colIndex) in row"
              :key="colIndex"
              class="cell size24"
              :class="cellType(row[colIndex])"
              @click="mineSwepper.clickCell(rowIndex, colIndex)"
            />
          </div>
        </div>
        <div
          class="hd_wrapper-border-vert wrapper-border-vert"
          :style="contentWrapperBorderHeight"
        />
      </div>
      <div class="footer-border">
        <div class="hd_wrapper-border-left-bottom wrapper-border-left-bottom" />
        <div class="hd_wrapper-border-hor wrapper-border-hor" />
        <div
          class="hd_wrapper-border-right-bottom wrapper-border-right-bottom"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MineSweeper } from '~/utils/minesweeper/mineSweeper'
import { Cell } from '~/utils/minesweeper/cell'
import { Difficulty } from '~/utils/minesweeper/enum'

const mineSwepper = ref<MineSweeper>(new MineSweeper())
const numRows = ref<number>(9)
const numCols = ref<number>(9)
const numMines = ref<number>(10)
const isCustom = ref<boolean>(false)

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

const game = computed(() => mineSwepper.value?.getBoard())

const gridStyle = computed(() => {
  return {
    gridTemplateRows: `repeat(${numCols.value}, 24px)`,
    gridTemplateColumns: `repeat(${numRows.value}, 24px)`
  }
})

const gameStatus = computed(() => {
  if (mineSwepper.value?.getGameStatus() === 0) {
    return 'En attente'
  } else if (mineSwepper.value?.getGameStatus() === 1) {
    return 'En cours'
  } else if (mineSwepper.value?.getGameStatus() === 2) {
    return 'Gagné'
  } else if (mineSwepper.value?.getGameStatus() === 3) {
    return 'Perdu'
  }
})

const gameWith = computed(() => {
  switch (mineSwepper.value?.getDifficulty()) {
    case Difficulty.BEGINNER:
      return {
        width: '254px'
      }
    case Difficulty.INTERMEDIATE:
      return {
        width: '420px'
      }
    case Difficulty.EXPERT:
      return {
        width: '756px'
      }
  }
})

const contentWrapperBorderHeight = computed(() => {
  switch (mineSwepper.value.getDifficulty()) {
    case Difficulty.BEGINNER:
      return {
        height: '216px',
        marginLeft: '1px'
      }
    case Difficulty.INTERMEDIATE:
      return {
        height: '384px'
      }
    case Difficulty.EXPERT:
      return {
        height: '384px'
      }
  }
})

const init = (difficulty: Difficulty) => {
  mineSwepper.value.setup(difficulty)
  numRows.value = mineSwepper.value.getNumRows()
  numCols.value = mineSwepper.value.getNumCols()
}

const initCustom = () => {
  mineSwepper.value.setupCustom(numRows.value, numCols.value, numMines.value)
}

const cellType = (cell: Cell) => {
  if (!cell.getIsRevealed()) {
    return 'cell_closed'
  } else if (cell.getIsMine()) {
    if (cell.getIsRevealed()) {
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
  }
}
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

    .btn-difficulty {
      margin: 10px;
      color: rgb(var(--v-theme-secondary));
    }

    .form-inline .form-group {
      display: inline-block;
      width: auto;
    }

    @media screen and (min-width: 768px) {
      .form-inline .form-group {
        margin-bottom: 0;
        vertical-align: middle;
      }
    }

    .form-group {
      margin-bottom: 15px;
    }

    @media screen and (min-width: 768px) {
      .form-inline .form-control {
        display: inline-block;
        margin-bottom: 0;
        vertical-align: middle;
      }
    }

    .custom-input {
      display: block;
      height: 28px;
      width: 47px;
      margin: 0 15px 0 5px;
      padding: 3px 6px;
      font-size: 14px;
      color: #555;
      background-color: #fff;
      border: 1px solid #ccc;
      -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
      -webkit-transition:
        border-color ease-in-out 0.15s,
        -webkit-box-shadow ease-in-out 0.15s;
      -o-transition:
        border-color ease-in-out 0.15s,
        box-shadow ease-in-out 0.15s;
      transition:
        border-color ease-in-out 0.15s,
        box-shadow ease-in-out 0.15s;
    }

    label {
      display: inline-block;
      max-width: 100%;
      font-size: 14px;
      margin-bottom: 5px;
      font-weight: 700;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .btn {
      display: inline-block;
      color: #333;
      background-color: #fff;
      border-color: #ccc;
      margin-bottom: 0;
      text-align: center;
      vertical-align: middle;
      -ms-touch-action: manipulation;
      touch-action: manipulation;
      border: 1px solid #ccc;
      white-space: nowrap;
      padding: 6px 12px;
      font-size: 14px;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    @media screen and (min-width: 768px) {
      .btn {
        padding: 4px 10px;
        margin-left: 4px;
      }
    }
  }
}

#game {
  margin-top: 20px;
  filter: brightness(100%);

  .header-border-top {
    .hd_wrapper-border-left-top {
      width: 18px;
      height: 16.5px;
      background-image: url('minesweeper/corner_up_left_2x.png');
    }

    .hd_wrapper-border-hor {
      width: calc(100% - 36px);
      height: 16.5px;
      background-image: url('minesweeper/border_hor_2x.png');
    }
    .hd_wrapper-border-right-top {
      width: 18px;
      height: 16.5px;
      background-image: url('minesweeper/corner_up_right_2x.png');
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
      background-image: url('minesweeper/border_vert_2x.png');
    }

    .top-area {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% - 36px);
      height: 48px;
      float: left;
      background-color: #c0c0c0;

      div {
        font-size: 1.25rem;
        font-weight: 700;
      }
    }
  }

  .header-border-t {
    .hd_wrapper-border-t-left {
      width: 18px;
      height: 16.5px;
      background-image: url('minesweeper/t_left_2x.png');
    }

    .hd_wrapper-border-hor {
      width: calc(100% - 36px);
      height: 16.5px;
      background-image: url('minesweeper/border_hor_2x.png');
    }

    .hd_wrapper-border-t-right {
      width: 18px;
      height: 16.5px;
      background-image: url('minesweeper/t_right_2x.png');
    }
  }
  .content {
    .hd_wrapper-border-vert {
      width: 18px;
      background-image: url('minesweeper/border_vert_2x.png');
    }

    #grid {
      display: grid;
      float: left;

      .cell_closed {
        background-image: url('minesweeper/closed.svg');
      }

      .cell_type0 {
        background-image: url('minesweeper/type0.svg');
      }

      .cell_type1 {
        background-image: url('minesweeper/type1.svg');
      }

      .cell_type2 {
        background-image: url('minesweeper/type2.svg');
      }

      .cell_type3 {
        background-image: url('minesweeper/type3.svg');
      }

      .cell_type10 {
        background-image: url('minesweeper/mine.svg');
      }

      .cell_type11 {
        background-image: url('minesweeper/mine_red.svg');
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
      height: 16.5px;
      background-image: url('minesweeper/corner_bottom_left_2x.png');
    }

    .hd_wrapper-border-hor {
      width: calc(100% - 36px);
      height: 16.5px;
      background-image: url('minesweeper/border_hor_2x.png');
    }

    .hd_wrapper-border-right-bottom {
      width: 18px;
      height: 16.5px;
      background-image: url('minesweeper/corner_bottom_right_2x.png');
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

.noselect {
  --webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
