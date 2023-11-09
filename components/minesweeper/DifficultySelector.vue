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
  (e: 'startGame', args: GameOptions): void
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
div {
  display: flex;
  align-items: center;

  .btn-difficulty {
    margin: 10px;
    color: #1479d5;
  }
}

@media (max-width: 600px) {
  div {
    display: flex;
    flex-flow: wrap;
    justify-content: center;
  }
}
</style>
