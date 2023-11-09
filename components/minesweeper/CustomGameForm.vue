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
      />
    </div>
    <button type="submit" class="btn">VALIDER</button>
  </form>
</template>

<script setup lang="ts">
import { Difficulty } from '~/utils/minesweeper/mineSweeper'
import type { GameOptions } from '~/utils/minesweeper/mineSweeper'

const emit = defineEmits<{
  (e: 'startCustomGame', args: GameOptions): void
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
  display: inline-block;
  margin-bottom: 10px;
  font-size: 0.8rem;

  .form-group {
    display: inline-block;
    color: rgb(var(--v-theme-onBackground));

    label {
      text-transform: uppercase;
      margin-left: 10px;
    }

    input {
      border: 1px solid #ccc;
      text-align: center;
      width: 50px;
      height: 25px;
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

  @media screen and (max-width: 600px) {
    display: flex;
    flex-flow: row wrap;
    justify-content: center;
    align-items: center;

    .form-group {
      margin: 5px;
    }
  }

  button {
    border: 1px solid #ccc;
    margin-left: 10px;
    padding: 0 5px;
    width: 60px;
    height: 25px;
  }
}
</style>
