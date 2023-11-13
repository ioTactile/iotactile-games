<template>
  <div>
    <minesweeper-menu-custom-game-form
      v-if="isCustom"
      @start-custom-game="startGame"
    />
    <minesweeper-menu-difficulty-selector
      v-else
      @toggle-custom-game="toggleCustomGame"
      @start-game="startGame"
    />
  </div>
</template>

<script setup lang="ts">
import type { GameOptions } from '~/utils/minesweeper/mineSweeper'

defineProps<{
  isCustom: boolean
}>()

const emit = defineEmits<{
  (e: 'start-game', args: GameOptions): void
  (e: 'action', value: string): void
  (e: 'is-custom', value?: boolean): void
}>()

const startGame = (options: GameOptions): void => {
  emit('start-game', options)
  emit('is-custom', false)
  emit('action', 'gameBoard')
}

const toggleCustomGame = (): void => emit('is-custom')
</script>
