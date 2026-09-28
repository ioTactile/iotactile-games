<template>
  <div class="play-container">
    <p class="play-intro">
      Glisse les tuiles pour les fusionner. Atteins <strong>2048</strong> pour gagner — puis
      continue si tu veux.
    </p>
    <button class="button-game2048 button-play" @click="startGame">Nouvelle partie</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'start-game'): void;
}>();

const startGame = (): void => {
  emit('start-game');
};
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
    font-family: 'Space Grotesk', sans-serif;
    font-size: 1.15rem;
    line-height: 1.5;
    color: rgb(var(--v-theme-game2048MainOnSurface));

    strong {
      color: rgb(var(--v-theme-game2048MainPrimary));
    }
  }

  .button-play {
    width: 260px;
  }
}
</style>
