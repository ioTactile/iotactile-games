<template>
  <div>
    <button
      v-for="(difficulty, i) in difficulties"
      :key="i"
      class="btn-difficulty"
      @click="startGame(difficulty.difficulty)"
    >
      {{ difficulty.name }}
    </button>
    <button class="btn-difficulty" @click="toggleCustomGame">
      Personnalisé
    </button>
  </div>
</template>

<script setup lang="ts">
import { Difficulty } from '~/utils/minesweeper/mineSweeper'
import type { GameOptions } from '~/utils/minesweeper/mineSweeper'

type Difficulties = {
  name: string
} & GameOptions

const props = defineProps<{
  difficulties: Difficulties[]
}>()

const emit = defineEmits<{
  (e: 'toggleCustomGame'): void
  (
    e: 'startGame',
    args: {
      numRows: number
      numCols: number
      numMines: number
      difficulty: Difficulty
    }
  ): void
}>()

const toggleCustomGame = () => emit('toggleCustomGame')

const startGame = (value: Difficulty) => {
  const { numRows, numCols, numMines, difficulty } = props.difficulties[value]
  emit('startGame', {
    numRows,
    numCols,
    numMines,
    difficulty
  })
}
</script>

<style scoped lang="scss">
.btn-difficulty {
  margin: 10px;
  color: rgb(var(--v-theme-secondary));
}
</style>
