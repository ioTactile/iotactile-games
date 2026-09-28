<template>
  <div class="play-container">
    <p class="play-intro">
      Dirige le serpent, mange la nourriture, grandis — sans te mordre ni toucher les murs.
    </p>
    <button class="button-snake button-play" @click="emit('start-game')">Nouvelle partie</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'start-game'): void;
}>();
</script>

<style scoped lang="scss">
.play-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 3rem;
  height: 100%;
  width: 100%;
  padding: 2rem;

  .play-intro {
    max-width: 340px;
    text-align: center;
    font-family: 'Rajdhani', sans-serif;
    font-size: 1.25rem;
    line-height: 1.4;
    color: rgb(var(--v-theme-snakeMainOnSurface));
  }

  .button-play {
    width: 300px;
  }
}
</style>
