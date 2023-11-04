<template>
  <div class="container">
    <div class="header">
      <h1>Le jeu de la vie de Conway</h1>
      <div class="header-content">
        <div class="content-left">
          <label for="rows"> Colonnes </label>
          <input
            id="rows"
            v-model="numRows"
            :disabled="isRunning"
            type="number"
          />
          <label for="cols"> Lignes </label>
          <input
            id="cols"
            v-model="numCols"
            :disabled="isRunning"
            type="number"
          />
          <button :disabled="isRunning" @click="getBoard">Valider</button>
          <label for="speed"> Vitesse (ms) </label>
          <input
            id="speed"
            v-model="speed"
            :disabled="isRunning"
            type="number"
          />
        </div>
        <div class="content-right">
          <select v-model="selectedPattern" name="patterns">
            <option :value="null">Selectionne un pattern</option>
            <option
              v-for="(patern, i) in patternsArray"
              :key="i"
              :value="patern.schema"
            >
              {{ patern.name }}
            </option>
          </select>
          <!-- <button :disabled="true" @click="generateRandomPattern">
            Aléatoire
          </button> -->
          <button
            :class="isRunning ? 'bg-orange' : 'bg-green'"
            @click="startStop"
          >
            {{ isRunning ? 'Arrêter' : 'Démarrer' }}
          </button>
          <button class="bg-red" :disabled="isRunning" @click="clearBoard">
            Effacer
          </button>
        </div>
      </div>
    </div>
    <div class="grid" :style="gridStyle">
      <div v-for="(row, rowIndex) in board" :key="rowIndex">
        <div
          v-for="(cell, colIndex) in row"
          :key="colIndex"
          class="cell"
          :class="{ alive: cell }"
          @click="toggleCell(rowIndex, colIndex)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LifeGame } from '~/utils/lifeGame'
import * as patterns from '~/utils/lifeGamePatterns'

const numRows = ref<number>(100)
const numCols = ref<number>(60)
const lifeGame = ref<LifeGame | undefined>(undefined)
const isRunning = ref<boolean>(false)
const speed = ref<number>(100)
const intervalId = ref<NodeJS.Timeout | undefined>(undefined)
const selectedPattern = ref<number[][] | null>(null)

const patternsArray = [
  {
    schema: patterns.glider,
    name: 'Glider'
  },
  {
    schema: patterns.bar,
    name: 'La ruche'
  },
  {
    schema: patterns.pentaDecathlon,
    name: 'Pentadecathlon'
  },
  {
    schema: patterns.pentomino,
    name: 'Pentomino'
  }
]

watch(
  () => selectedPattern.value,
  (newValue) => {
    if (newValue) {
      clearBoard()
      lifeGame.value?.loadPattern(newValue)
      lifeGame.value?.getBoard().forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            addCell(rowIndex, colIndex)
          }
        })
      })
    }
  }
)

const board = computed(() => {
  return lifeGame.value?.getBoard()
})

const gridStyle = computed(() => {
  return {
    gridTemplateRows: `repeat(${numCols.value}, 10px)`,
    gridTemplateColumns: `repeat(${numRows.value}, 10px)`
  }
})

const startStop = () => {
  if (isRunning.value) {
    clearInterval(intervalId.value)
    intervalId.value = undefined
  } else {
    intervalId.value = setInterval(() => {
      lifeGame.value?.update()
      //   removeBorderConnectedGroups()
      removeActiveCells()
      lifeGame.value?.getBoard().forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
          if (cell) {
            addCell(rowIndex, colIndex)
          }
        })
      })
    }, speed.value)
  }
  isRunning.value = !isRunning.value
}

// const generateRandomPattern = () => {
//   clearBoard()
//   lifeGame.value?.generateRandomPattern()
//   lifeGame.value?.getBoard().forEach((row, rowIndex) => {
//     row.forEach((cell, colIndex) => {
//       if (cell) {
//         addCell(rowIndex, colIndex)
//       }
//     })
//   })
// }

const getBoard = () => {
  if (!numRows.value || !numCols.value) {
    return
  }

  clearBoard()
  lifeGame.value = new LifeGame(numRows.value, numCols.value)
}

const clearBoard = () => {
  lifeGame.value?.clearBoard()
  selectedPattern.value = null
  removeActiveCells()
}

const addCell = (rowIndex: number, colIndex: number) => {
  const cell = document.querySelector(
    `.grid > div:nth-child(${rowIndex + 1}) > div:nth-child(${colIndex + 1})`
  )
  if (cell) {
    cell.classList.add('alive')
  }
}

// const removeCell = (rowIndex: number, colIndex: number) => {
//   const cell = document.querySelector(
//     `.grid > div:nth-child(${rowIndex + 1}) > div:nth-child(${colIndex + 1})`
//   )
//   if (cell) {
//     cell.classList.remove('alive')
//   }
// }

const toggleCell = (rowIndex: number, colIndex: number) => {
  lifeGame.value?.toggleCell(rowIndex, colIndex)
  const cell = document.querySelector(
    `.grid > div:nth-child(${rowIndex + 1}) > div:nth-child(${colIndex + 1})`
  )
  if (cell) {
    cell.classList.toggle('alive')
  }
}

const removeActiveCells = () => {
  const activeCells = document.querySelectorAll('.alive')
  activeCells.forEach((cell) => {
    cell.classList.remove('alive')
  })
}

// const removeBorderConnectedGroups = () => {
//   if (!lifeGame.value) {
//     return
//   }

//   const visited: Set<string> = new Set()
//   const numRows = lifeGame.value.getNumRows()
//   const numCols = lifeGame.value.getNumCols()
//   const board = lifeGame.value.getBoard()

//   const isAtBorder = (row: number, col: number) =>
//     row === 0 || row === numRows - 1 || col === 0 || col === numCols - 1

//   const markConnectedToBorder = (row: number, col: number) => {
//     if (
//       row < 0 ||
//       row >= numRows ||
//       col < 0 ||
//       col >= numCols ||
//       visited.has(`${row}-${col}`) ||
//       !board[row][col]
//     ) {
//       return
//     }

//     visited.add(`${row}-${col}`)

//     markConnectedToBorder(row - 1, col)
//     markConnectedToBorder(row + 1, col)
//     markConnectedToBorder(row, col - 1)
//     markConnectedToBorder(row, col + 1)
//   }

//   for (let col = 0; col < numCols; col++) {
//     if (board[0][col]) {
//       markConnectedToBorder(0, col)
//     }
//     if (board[numRows - 1][col]) {
//       markConnectedToBorder(numRows - 1, col)
//     }
//   }

//   for (let row = 0; row < numRows; row++) {
//     if (board[row][0]) {
//       markConnectedToBorder(row, 0)
//     }
//     if (board[row][numCols - 1]) {
//       markConnectedToBorder(row, numCols - 1)
//     }
//   }

//   lifeGame.value.getBoard().forEach((row, rowIndex) => {
//     row.forEach((cell, colIndex) => {
//       if (
//         cell &&
//         visited.has(`${rowIndex}-${colIndex}`) &&
//         isAtBorder(rowIndex, colIndex)
//       ) {
//         lifeGame.value?.toggleCell(rowIndex, colIndex)
//         removeCell(rowIndex, colIndex)
//       }
//     })
//   })
// }
</script>

<style scoped lang="scss">
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 10px;

  .header {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;

    .header-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;

      .content-left {
        display: wrap;
        width: 60%;
      }

      .content-right {
        display: wrap;
        width: 40%;
      }
    }
  }

  .grid {
    margin-top: 10px;
    display: grid;
    border: 1px solid #aaa;

    .cell {
      width: 10px;
      height: 10px;
      background-color: white;
      border: 1px solid #aaa;
      cursor: pointer;
    }

    .alive {
      background-color: black;
    }
  }
}

button,
select,
input {
  margin: 5px;
  background-color: #ddd;
  border: 1px solid #aaa;
  border-radius: 5px;
  padding: 5px 10px;
}

input {
  width: 80px;
}
</style>
