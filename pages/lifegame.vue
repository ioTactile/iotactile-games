<template>
  <div class="container">
    <div class="header">
      <h1>Le jeu de la vie de Conway</h1>
      <div class="header-content">
        <div class="content-left">
          <div>
            <label for="rows"> Colonnes </label>
            <input
              id="rows"
              v-model="numRows"
              :disabled="isRunning"
              type="number"
            />
          </div>
          <div>
            <label for="cols"> Lignes </label>
            <input
              id="cols"
              v-model="numCols"
              :disabled="isRunning"
              type="number"
            />
          </div>
          <div>
            <label for="speed"> Vitesse (ms) </label>
            <input
              id="speed"
              v-model="speed"
              :disabled="isRunning"
              type="number"
            />
          </div>
          <button class="validate" :disabled="isRunning" @click="getBoard">
            Valider
          </button>
        </div>
        <div class="content-right">
          <div>
            <select
              v-model="selectedPattern"
              :disabled="isRunning || !lifeGame"
              name="patterns"
            >
              <option :value="null">Selectionne un paterne</option>
              <option
                v-for="(patern, i) in patternsArray"
                :key="i"
                :value="patern.schema"
              >
                {{ patern.name }}
              </option>
            </select>
            <button
              class="text-onSurface"
              :class="isRunning ? 'bg-orange' : 'bg-green'"
              :disabled="!lifeGame"
              @click="startStop"
            >
              {{ isRunning ? 'Arrêter' : 'Démarrer' }}
            </button>
          </div>
          <div>
            <div class="d-flex align-center">
              <span class="mr-3"> Enregistrer </span>
              <label class="switch">
                <input
                  v-model="isRecording"
                  :disabled="isRunning || !lifeGame"
                  type="checkbox"
                />
                <span />
              </label>
            </div>
            <button
              class="bg-red text-onSurface"
              :disabled="isRunning || !lifeGame"
              @click="clearBoard"
            >
              Effacer
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="grid-container">
      <div class="grid" :style="gridStyle">
        <div v-for="(row, rowIndex) in board" :key="rowIndex">
          <div
            v-for="(cell, colIndex) in row"
            :key="colIndex"
            class="cell"
            :class="{ alive: cell }"
            @click="toggleCell(rowIndex, colIndex)"
            @mousedown="isDrawing = true"
            @mouseup="isDrawing = false"
            @mouseover="isDrawing ? toggleCell(rowIndex, colIndex) : null"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { LifeGame } from '~/utils/lifeGame'
import * as patterns from '~/utils/lifeGamePatterns'

const numRows = ref<number>(100)
const numCols = ref<number>(80)
const lifeGame = ref<LifeGame | null>(null)
const isDrawing = ref<boolean>(false)
const isRunning = ref<boolean>(false)
const isRecording = ref<boolean>(false)
const speed = ref<number>(100)
const intervalId = ref<NodeJS.Timeout | undefined>(undefined)
const selectedPattern = ref<number[][] | null>(null)
const mediaRecorder = ref<MediaRecorder | null>(null)
const recordedChunks = ref<Blob[]>([])

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

    if (isRecording.value && mediaRecorder.value) {
      mediaRecorder.value.stop()
      const blob = new Blob(recordedChunks.value, {
        type: 'video/webm'
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `life_game_${Date.now()}.webm`
      a.click()
      recordedChunks.value = []
    }
  } else {
    if (isRecording.value) {
      const stream = (
        document.querySelector('.grid') as HTMLDivElement
      ).captureStream() as MediaStream
      mediaRecorder.value = new MediaRecorder(stream, {
        mimeType: 'video/webm'
      })
      mediaRecorder.value.ondataavailable = (e) => {
        if (e.data.size > 0) {
          recordedChunks.value.push(e.data)
        }
      }
      mediaRecorder.value.start()
    }

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
  if (!lifeGame.value) {
    return
  }
  isDrawing.value = true
  lifeGame.value.toggleCell(rowIndex, colIndex)
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
    padding: 10px;
    background-color: rgb(var(--v-theme-surface));
    border-radius: 8px;
    color: rgb(var(--v-theme-onSurface));

    .header-content {
      display: flex;
      justify-content: space-between;
      width: 100%;

      .content-left {
        display: flex;

        div {
          margin: 0 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .validate {
          height: 34px;
          align-self: flex-end;
          margin-bottom: 15px;
          width: 80px;
        }
      }

      .content-right {
        display: flex;
        flex-direction: column;

        div {
          margin: 0 10px;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          button {
            height: 34px;
            width: 100px;
          }
        }
      }
    }
  }

  @media screen and (max-width: 900px) {
    .header {
      h1 {
        font-size: 1.5rem;
      }
      .header-content {
        flex-direction: column;

        .content-left {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);

          div {
            margin: 10px 0;
          }

          .validate {
            height: 34px;
            justify-self: center;
          }
        }

        .content-right {
          width: 100%;
          flex-direction: column;

          div {
            justify-content: space-between;
            margin: 10px 0;
            height: 34px;

            div:first-child {
              margin-left: 5px;
              width: 221px;
              padding-right: 10px;
            }
          }
        }
      }
    }
  }

  .grid-container {
    display: flex;
    justify-content: center;
    overflow: auto;
    height: 100%;
    width: 100%;

    .grid {
      margin-top: 10px;
      display: grid;
      gap: 1px;

      .cell {
        width: 10px;
        height: 10px;
        background-color: white;
        border: 1px solid #ccc;
        cursor: pointer;
      }

      .alive {
        background-color: black;
      }
    }
  }
}

button,
select,
input {
  margin: 5px;
  background-color: rgb(var(--v-theme-background));
  color: rgb(var(--v-theme-onBackground));
  border-radius: 5px;
  padding: 5px 10px;
}

input {
  width: 80px;
}

.switch {
  display: inline-block;
  position: relative;
  width: 52px;
  height: 30px;
  cursor: pointer;
  overflow: hidden;

  input {
    position: absolute;
    top: -30px;
    left: -30px;
    width: 0;
    height: 0;
  }

  input + span {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: #90caf9;
    border-radius: 20px;
  }

  input:checked + span {
    background: #1565c0;
  }

  input + span:before {
    content: '';
    display: inline-block;
    position: absolute;
    top: 50%;
    left: 4px;
    width: 22px;
    height: 22px;
    background: white;
    border-radius: 50%;
    transform: translateY(-50%);
    transition: all 0.5s;
  }

  input:checked + span:before {
    left: 26px;
  }
}
</style>
