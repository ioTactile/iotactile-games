<template>
  <div class="won-modal">
    <div class="won-modal-content">
      <div class="won-modal-title">Bravo !</div>
      <div class="won-modal-text">Tu as réussi à compléter le Takuzu !</div>
      <div class="won-modal-actions">
        <button class="button-action" @click="restart">Rejouer</button>
        <button class="button-action" @click="returnToMenu">Menu</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emits = defineEmits<{
  (e: 'restart'): void
  (e: 'returnToMenu'): void
}>()

const restart = () => emits('restart')
const returnToMenu = () => emits('returnToMenu')
</script>

<style scoped lang="scss">
.won-modal {
  position: fixed;
  z-index: 3;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
}

.won-modal-content {
  width: 500px;
  height: 300px;
  border-radius: 20px;
  padding: 10px;
  background-color: rgb(var(--v-theme-takuzuMainSurface));
  box-shadow: -10px -10px rgba(var(--v-theme-takuzuMainShadow), 0.3);
  color: rgb(var(--v-theme-onSurface));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .won-modal-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 3rem;
    font-weight: 700;
    text-transform: uppercase;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
  }

  .won-modal-text {
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    font-size: 1.5rem;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
    margin: 20px 0;
  }

  .won-modal-actions {
    display: flex;
    justify-content: space-evenly;
    width: 100%;

    .button-action {
      width: 200px;
      padding: 0.25rem 0.5rem;
      border-radius: 20px;
      background-color: rgb(var(--v-theme-takuzuMainOnSurface));
      color: rgb(var(--v-theme-background));
      border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
      box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease-in-out;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;
    }
  }
}
</style>
