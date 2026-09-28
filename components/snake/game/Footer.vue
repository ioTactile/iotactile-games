<template>
  <div class="footer">
    <div class="actions">
      <button class="action-btn" @click="emit('toggle-pause')">
        {{ paused ? 'Reprendre' : 'Pause' }}
      </button>
      <button class="action-btn" @click="emit('restart')">Rejouer</button>
    </div>
    <div class="dpad" aria-label="Contrôles directionnels">
      <button class="dpad-btn up" @click="emit('move', 'up')">↑</button>
      <button class="dpad-btn left" @click="emit('move', 'left')">←</button>
      <button class="dpad-btn down" @click="emit('move', 'down')">↓</button>
      <button class="dpad-btn right" @click="emit('move', 'right')">→</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Direction } from '~/utils/snake/types';

defineProps<{
  paused: boolean;
}>();

const emit = defineEmits<{
  (e: 'toggle-pause'): void;
  (e: 'restart'): void;
  (e: 'move', direction: Direction): void;
}>();
</script>

<style scoped lang="scss">
.footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  font-family: 'Rajdhani', sans-serif;

  .actions {
    display: flex;
    gap: 0.75rem;
  }

  .action-btn {
    min-width: 110px;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background: transparent;
    border: 2px solid rgb(var(--v-theme-snakeMainPrimary));
    color: rgb(var(--v-theme-snakeMainOnSurface));
    font-weight: 700;
    font-family: inherit;
    letter-spacing: 0.08em;
    text-transform: uppercase;

    &:hover {
      background: rgba(184, 255, 60, 0.12);
    }
  }

  .dpad {
    display: grid;
    grid-template-columns: repeat(3, 52px);
    grid-template-rows: repeat(2, 52px);
    gap: 6px;
    justify-items: center;

    .dpad-btn {
      width: 52px;
      height: 52px;
      border-radius: 4px;
      background: rgb(var(--v-theme-snakeMainSecondary));
      color: rgb(var(--v-theme-snakeMainPrimary));
      border: 2px solid rgb(var(--v-theme-snakeMainPrimary));
      font-size: 1.35rem;
      font-weight: 700;

      &.up {
        grid-column: 2;
        grid-row: 1;
      }
      &.left {
        grid-column: 1;
        grid-row: 2;
      }
      &.down {
        grid-column: 2;
        grid-row: 2;
      }
      &.right {
        grid-column: 3;
        grid-row: 2;
      }
    }
  }
}
</style>
