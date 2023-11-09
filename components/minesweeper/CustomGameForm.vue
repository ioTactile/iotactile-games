<template>
  <form @submit.prevent="startCustomGame">
    <div class="form-group">
      <label for="custom_width"> Largeur </label>
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
      <label for="custom_height"> Hauteur </label>
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
</template>

<script setup lang="ts">
import { Difficulty } from '~/utils/minesweeper/mineSweeper'

const emit = defineEmits<{
  (
    e: 'startCustomGame',
    args: {
      numRows: number
      numCols: number
      numMines: number
      difficulty: Difficulty
    }
  ): void
}>()

const numRows = ref<number>(30)
const numCols = ref<number>(30)
const numMines = ref<number>(150)

const startCustomGame = () => {
  emit('startCustomGame', {
    numRows: numRows.value,
    numCols: numCols.value,
    numMines: numMines.value,
    difficulty: Difficulty.CUSTOM
  })
}
</script>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 210px;

  .form-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 5px;
    width: 100%;

    label {
      margin-bottom: 5px;
    }

    input {
      width: 100%;
      text-align: center;
    }

    input:focus {
      outline: none;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>
