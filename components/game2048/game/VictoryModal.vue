<template>
  <div class="modal-container">
    <span class="title">2048 !</span>
    <p class="description">
      Tu as atteint la tuile 2048 avec un score de <strong>{{ score }}</strong
      >.
    </p>
    <div class="actions">
      <button class="button-game2048 modal-btn" @click="emit('keep-playing')">Continuer</button>
      <button class="button-game2048 modal-btn ghost" @click="emit('restart')">Rejouer</button>
      <button class="button-game2048 modal-btn ghost" @click="emit('return-to-menu')">Menu</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  score: number;
}>();

const emit = defineEmits<{
  (e: 'keep-playing'): void;
  (e: 'restart'): void;
  (e: 'return-to-menu'): void;
}>();
</script>

<style scoped lang="scss">
.modal-container {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  z-index: 2;
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 2rem;
  background: rgba(13, 17, 23, 0.92);
  font-family: 'Space Grotesk', sans-serif;
  color: #e8f5f0;

  @media screen and (max-width: 600px) {
    border-radius: 0;
  }

  .title {
    text-align: center;
    font-size: 3rem;
    font-weight: 700;
    color: rgb(var(--v-theme-game2048MainPrimary));
  }

  .description {
    text-align: center;
    font-size: 1.25rem;

    strong {
      color: rgb(var(--v-theme-game2048MainTertiary));
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;

    .modal-btn {
      width: min(260px, 80vw);
      height: 52px;
      font-size: 1.25rem;

      &.ghost {
        background: transparent;
        color: #e8f5f0;
        box-shadow: none;
      }
    }
  }
}
</style>
