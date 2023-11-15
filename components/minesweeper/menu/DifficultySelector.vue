<template>
  <div class="d-flex flex-column">
    <button
      v-for="(difficulty, i) in difficulties"
      :key="i"
      class="button-mineSweeper"
      @click="startGame(difficulty.difficulty)"
    >
      {{ difficulty.name }}
    </button>
    <button class="button-mineSweeper" @click="toggleCustomGame">
      Personnalisé
    </button>
  </div>
</template>

<script setup lang="ts">
import type { GameOptions, Difficulty } from '~/utils/minesweeper/mineSweeper'

const emit = defineEmits<{
  (e: 'toggleCustomGame'): void
  (e: 'startGame', args: GameOptions): void
}>()

const difficulties: {
  name: string
  numRows: number
  numCols: number
  numMines: number
  difficulty: Difficulty
}[] = [
  {
    name: 'Débutant',
    numRows: 9,
    numCols: 9,
    numMines: 10,
    difficulty: 'beginner'
  },
  {
    name: 'Intermédiaire',
    numRows: 16,
    numCols: 16,
    numMines: 40,
    difficulty: 'intermediate'
  },
  {
    name: 'Expert',
    numRows: 30,
    numCols: 16,
    numMines: 99,
    difficulty: 'expert'
  }
]

const toggleCustomGame = (): void => emit('toggleCustomGame')

const startGame = (value: string): void => {
  const { numRows, numCols, numMines, difficulty } =
    difficulties[
      difficulties.findIndex((difficulty) => difficulty.difficulty === value)
    ]
  emit('startGame', {
    numRows,
    numCols,
    numMines,
    difficulty
  })
}
</script>

<style scoped lang="scss">
.button-mineSweeper:nth-child(odd) {
  margin: 3rem 0;
}
</style>
