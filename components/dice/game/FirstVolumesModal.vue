<template>
  <div class="sound-modal-wrapper">
    <div class="sound-modal">
      <h3>ACTIVER LES SONS</h3>
      <div>
        <button @click="clickNoButton">Non</button>
        <button @click="clickYesButton">Oui</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'openModal', value: boolean): void
  (e: 'activateSound'): void
  (e: 'desactivateSound'): void
}>()

const clickYesButton = () => {
  emit('activateSound')
  emit('openModal', false)
}

const clickNoButton = () => {
  emit('openModal', false)
  emit('desactivateSound')
}
</script>

<style scoped lang="scss">
.sound-modal-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 1200px;
  height: 800px;
  background-color: rgba(var(--v-theme-diceMainModalBackground), 0.7);

  .sound-modal {
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    align-items: center;
    width: 300px;
    height: 200px;
    background-color: rgb(var(--v-theme-surface));
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    border-radius: 8px;
    padding: 10px 20px;

    h3 {
      text-align: center;
      font-size: 2rem;
      color: rgb(var(--v-theme-onSurface));
    }

    div {
      display: flex;
      justify-content: space-around;
      align-items: center;
      width: 100%;

      button {
        width: 100px;
        height: 50px;
        background-color: rgb(var(--v-theme-diceMainTertiary));
        color: white;
        border-radius: 8px;
        font-size: 1.5rem;
      }
    }
  }
}
</style>
