<template>
  <div class="modal-container">
    <span class="title">Game Over</span>
    <p class="description">
      Score : <strong>{{ score }}</strong> — longueur : <strong>{{ length }}</strong>
    </p>
    <div class="actions">
      <button class="button-snake modal-btn" @click="emit('restart')">Rejouer</button>
      <button class="button-snake modal-btn ghost" @click="emit('return-to-menu')">Menu</button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  score: number;
  length: number;
}>();

const emit = defineEmits<{
  (e: 'restart'): void;
  (e: 'return-to-menu'): void;
}>();
</script>

<style scoped lang="scss">
.modal-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 1.5rem;
  z-index: 10;
  position: absolute;
  inset: 0;
  border-radius: 4px;
  padding: 2rem;
  background: rgba(10, 10, 12, 0.88);
  backdrop-filter: blur(2px);
  font-family: 'Rajdhani', sans-serif;
  color: #e8ffe0;

  @media screen and (max-width: 600px) {
    border-radius: 0;
  }

  .title {
    text-align: center;
    font-size: 2.75rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: rgb(var(--v-theme-snakeMainTertiary));
  }

  .description {
    text-align: center;
    font-size: 1.35rem;

    strong {
      color: rgb(var(--v-theme-snakeMainPrimary));
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
        box-shadow: none;
        color: #e8ffe0;
      }
    }
  }
}
</style>
