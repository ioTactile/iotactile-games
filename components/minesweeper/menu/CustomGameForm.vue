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
    <button type="submit" class="button-mineSweeper">VALIDER</button>
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

const startCustomGame = (): void => {
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
  margin-top: 2rem;

  .form-group {
    display: flex;
    justify-content: space-between;
    align-items: center;

    label {
      font-size: 1.75rem;
      font-weight: bold;
      font-family: 'Orbitron', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.1rem;
    }

    input {
      width: 100px;
      height: 64px;
      text-align: center;
      background-color: rgb(var(--v-theme-mineSweeperMainPrimary));
      border-top: 4px solid rgb(var(--v-theme-mineSweeperMainSecondary));
      border-left: 4px solid rgb(var(--v-theme-mineSweeperMainSecondary));
      border-right: 4px solid rgb(var(--v-theme-mineSweeperMainTertiary));
      border-bottom: 4px solid rgb(var(--v-theme-mineSweeperMainTertiary));
      color: white;
      font-size: 1.5rem;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      font-family: 'Orbitron', sans-serif;
      letter-spacing: 0.1rem;
      margin: 1rem 0;
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

  button {
    margin-top: 1rem;
  }
}
</style>
