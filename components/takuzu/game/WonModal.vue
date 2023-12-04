<template>
  <div class="won-modal-wrapper">
    <div class="won-modal-title">Bravo</div>
    <div class="won-modal-text">Tu as réussi à compléter le Takuzu !</div>
    <div class="won-modal-actions">
      <button class="button-action" @click="returnToMenu">Menu</button>
      <button class="button-action" @click="restart">Rejouer</button>
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
.won-modal-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  z-index: 1;
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  background-color: rgb(var(--v-theme-takuzuMainPrimary));
  box-shadow: 0 0 4px 4px rgba(var(--v-theme-takuzuMainShadow), 0.25);
  border-radius: 20px;
  padding: 20px;

  @media screen and (max-width: 600px) {
    border-radius: 0;
  }

  .won-modal-title {
    font-family: 'JetBrains Mono', monospace;
    text-align: center;
    font-size: 3rem;
    font-weight: 700;
    text-transform: uppercase;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
  }

  .won-modal-text {
    font-family: 'JetBrains Mono', monospace;
    text-align: center;
    font-size: 1.5rem;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
  }

  .won-modal-actions {
    display: flex;
    justify-content: space-evenly;

    @media screen and (max-width: 600px) {
      flex-direction: column;
      align-items: center;
    }

    .button-action {
      width: 200px;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      background-color: rgb(var(--v-theme-takuzuMainOnSurface));
      color: #ffffff;
      border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      transition: all 0.2s ease-in-out;
      font-family: 'JetBrains Mono', monospace;
      font-weight: 700;

      @media screen and (max-width: 600px) {
        margin-top: 1rem;
        width: 70vw;
      }
    }
  }
}
</style>
