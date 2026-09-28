<template>
  <div
    class="board"
    :class="{ 'board--lost': lost }"
    role="grid"
    :style="{
      gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
      gridTemplateRows: `repeat(${gridSize}, 1fr)`,
    }"
    aria-label="Grille Snake"
  >
    <div
      v-for="cell in cells"
      :key="cell.key"
      class="cell"
      :class="cell.className"
      role="gridcell"
    />
  </div>
</template>

<script setup lang="ts">
import type { Position } from '~/utils/snake/types';

const props = defineProps<{
  gridSize: number;
  snake: Position[];
  food: Position | null;
  lost?: boolean;
}>();

const cells = computed(() => {
  const snakeSet = new Map<string, number>();
  props.snake.forEach((segment, index) => {
    snakeSet.set(`${segment.x},${segment.y}`, index);
  });
  const foodKey = props.food ? `${props.food.x},${props.food.y}` : null;

  const result: { key: string; className: string }[] = [];
  for (let y = 0; y < props.gridSize; y++) {
    for (let x = 0; x < props.gridSize; x++) {
      const key = `${x},${y}`;
      const snakeIndex = snakeSet.get(key);
      let className = 'cell--empty';
      if (foodKey === key) {
        className = 'cell--food';
      } else if (snakeIndex === 0) {
        className = 'cell--head';
      } else if (snakeIndex !== undefined) {
        className = 'cell--body';
      }
      result.push({ key, className });
    }
  }
  return result;
});
</script>

<style scoped lang="scss">
.board {
  display: grid;
  width: 440px;
  max-width: 100%;
  aspect-ratio: 1;
  gap: 1px;
  padding: 6px;
  border-radius: 4px;
  background: rgb(var(--v-theme-snakeMainSecondary));
  border: 2px solid rgb(var(--v-theme-snakeMainPrimary));
  box-shadow: 0 0 18px rgba(184, 255, 60, 0.2);
  touch-action: none;
  user-select: none;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    filter 0.2s ease;

  &--lost {
    border-color: rgb(var(--v-theme-snakeMainTertiary));
    box-shadow: 0 0 18px rgba(255, 77, 109, 0.35);
    filter: saturate(0.7) brightness(0.85);
  }

  .cell {
    border-radius: 2px;
    min-width: 0;
    min-height: 0;

    &--empty {
      background: rgba(184, 255, 60, 0.04);
    }

    &--body {
      background: #6aa01f;
    }

    &--head {
      background: rgb(var(--v-theme-snakeMainPrimary));
      box-shadow: 0 0 6px rgba(184, 255, 60, 0.7);
    }

    &--food {
      background: rgb(var(--v-theme-snakeMainTertiary));
      border-radius: 50%;
      box-shadow: 0 0 8px rgba(255, 77, 109, 0.7);
      animation: food-pulse 0.8s ease-in-out infinite alternate;
    }
  }
}

@keyframes food-pulse {
  from {
    transform: scale(0.85);
  }
  to {
    transform: scale(1);
  }
}

@media screen and (max-width: 600px) {
  .board {
    width: min(92vw, 340px);
  }
}
</style>
