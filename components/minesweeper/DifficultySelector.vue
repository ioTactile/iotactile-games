<template>
  <div>
    <button
      v-for="(difficulty, i) in difficulties"
      :key="i"
      class="btn-difficulty"
      @click="selectDifficulty(difficulty.value)"
    >
      {{ difficulty.name }}
    </button>
    <button class="btn-difficulty" @click="toggleCustomGame">
      Personnalisé
    </button>
  </div>
</template>

<script setup lang="ts">
import { Difficulty } from '~/utils/minesweeper/enum'
import type { Difficulties } from '~/utils/minesweeper/types'

defineProps<{
  difficulties: Difficulties[]
}>()

const emit = defineEmits<{
  (e: 'toggleCustomGame'): void
  (e: 'selectDifficulty', difficulty: Difficulty): void
}>()

const toggleCustomGame = () => emit('toggleCustomGame')

const selectDifficulty = (difficulty: Difficulty) =>
  emit('selectDifficulty', difficulty)
</script>

<style scoped lang="scss">
.btn-difficulty {
  margin: 10px;
  color: rgb(var(--v-theme-secondary));
}
</style>
