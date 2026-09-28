<template>
  <div class="header">
    <div class="score-box">
      <span class="label">Score</span>
      <span class="value">{{ score }}</span>
    </div>
    <div class="score-box length">
      <span class="label">Longueur</span>
      <span class="value">{{ length }}</span>
    </div>
    <div v-if="paused" class="paused-badge">Pause</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  score: number;
  length: number;
  paused: boolean;
}>();
</script>

<style scoped lang="scss">
.header {
  display: flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  width: 100%;
  font-family: 'Rajdhani', sans-serif;
  flex-wrap: wrap;

  .score-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 100px;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    background: rgb(var(--v-theme-snakeMainSecondary));
    color: rgb(var(--v-theme-snakeMainPrimary));
    border: 2px solid rgb(var(--v-theme-snakeMainPrimary));
    box-shadow: 0 0 10px rgba(184, 255, 60, 0.25);

    &.length {
      border-color: rgba(184, 255, 60, 0.5);
      color: rgb(var(--v-theme-snakeMainOnSurface));
    }

    .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      opacity: 0.8;
    }

    .value {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }

  .paused-badge {
    padding: 0.4rem 0.9rem;
    border: 2px solid rgb(var(--v-theme-snakeMainTertiary));
    color: rgb(var(--v-theme-snakeMainTertiary));
    text-transform: uppercase;
    letter-spacing: 0.15em;
    font-weight: 700;
    font-size: 0.9rem;
  }
}
</style>
