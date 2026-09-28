<template>
  <div class="board" role="grid" aria-label="Grille 2048">
    <div v-for="(row, rowIndex) in board" :key="rowIndex" class="board-row" role="row">
      <div
        v-for="(cell, colIndex) in row"
        :key="`${rowIndex}-${colIndex}`"
        class="cell"
        :class="tileClass(cell)"
        role="gridcell"
      >
        <span v-if="cell > 0" class="tile-value">{{ cell }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Board, TileValue } from '~/utils/game2048/types';

defineProps<{
  board: Board;
}>();

const tileClass = (value: TileValue): string => {
  if (value === 0) return 'cell--empty';
  if (value >= 2048) return 'cell--tile cell--tile-2048';
  return `cell--tile cell--tile-${value}`;
};
</script>

<style scoped lang="scss">
.board {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  border-radius: 16px;
  background: rgb(var(--v-theme-game2048MainSecondary));
  box-shadow: 0 0 0 3px rgba(45, 212, 168, 0.35);
  width: min(100%, 420px);
  aspect-ratio: 1;
  touch-action: none;
  user-select: none;

  .board-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 10px;
    flex: 1;
  }

  .cell {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 10px;
    font-family: 'Space Grotesk', sans-serif;
    font-weight: 700;

    &--empty {
      background: rgba(45, 212, 168, 0.08);
    }

    &--tile {
      animation: tile-pop 0.18s ease-out;
    }

    &--tile-2 {
      background: #1e4a3f;
      color: #9fe8cf;
    }
    &--tile-4 {
      background: #246b58;
      color: #d7fff0;
    }
    &--tile-8 {
      background: #2dd4a8;
      color: #0d1117;
    }
    &--tile-16 {
      background: #3ecf9a;
      color: #0d1117;
    }
    &--tile-32 {
      background: #5ee0a8;
      color: #0d1117;
    }
    &--tile-64 {
      background: #f0b429;
      color: #0d1117;
    }
    &--tile-128 {
      background: #e8952a;
      color: #0d1117;
      font-size: 1.35rem;
    }
    &--tile-256 {
      background: #d97820;
      color: #fff8e8;
      font-size: 1.35rem;
    }
    &--tile-512 {
      background: #c45f18;
      color: #fff8e8;
      font-size: 1.35rem;
    }
    &--tile-1024 {
      background: #a84812;
      color: #fff8e8;
      font-size: 1.1rem;
    }
    &--tile-2048 {
      background: linear-gradient(135deg, #2dd4a8, #f0b429);
      color: #0d1117;
      font-size: 1.05rem;
      box-shadow: 0 0 16px rgba(45, 212, 168, 0.55);
    }

    .tile-value {
      line-height: 1;
    }
  }
}

@keyframes tile-pop {
  from {
    transform: scale(0.85);
    opacity: 0.6;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@media screen and (max-width: 600px) {
  .board {
    width: min(100%, 340px);
    gap: 8px;
    padding: 10px;

    .board-row {
      gap: 8px;
    }

    .cell {
      font-size: 1.1rem;

      &--tile-128,
      &--tile-256,
      &--tile-512 {
        font-size: 1rem;
      }

      &--tile-1024,
      &--tile-2048 {
        font-size: 0.85rem;
      }
    }
  }
}
</style>
