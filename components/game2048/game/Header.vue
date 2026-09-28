<template>
  <div class="header">
    <div class="score-box">
      <span class="label">Score</span>
      <span class="value">{{ score }}</span>
    </div>
    <div class="score-box best">
      <span class="label">Max</span>
      <span class="value">{{ bestTile }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  score: number;
  bestTile: number;
}>();
</script>

<style scoped lang="scss">
.header {
  display: flex;
  gap: 1rem;
  justify-content: center;
  width: 100%;
  font-family: 'Space Grotesk', sans-serif;

  .score-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 110px;
    padding: 0.65rem 1.25rem;
    border-radius: 12px;
    background: rgb(var(--v-theme-game2048MainSecondary));
    color: rgb(var(--v-theme-game2048MainPrimary));
    border: 2px solid rgb(var(--v-theme-game2048MainPrimary));

    &.best {
      border-color: rgb(var(--v-theme-game2048MainTertiary));
      color: rgb(var(--v-theme-game2048MainTertiary));
    }

    .label {
      font-size: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      opacity: 0.8;
    }

    .value {
      font-size: 1.5rem;
      font-weight: 700;
    }
  }
}
</style>
