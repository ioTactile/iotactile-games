<template>
  <div class="rules-modal-wrapper">
    <div class="header">
      <button @click="closeRules">
        <div class="svg-container">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            fill="rgb(var(--v-theme-takuzuMainSurface))"
            width="28px"
            height="28px"
          >
            <path
              d="M 38.982422 6.9707031 A 2.0002 2.0002 0 0 0 37.585938 7.5859375 L 24 21.171875 L 10.414062 7.5859375 A 2.0002 2.0002 0 0 0 8.9785156 6.9804688 A 2.0002 2.0002 0 0 0 7.5859375 10.414062 L 21.171875 24 L 7.5859375 37.585938 A 2.0002 2.0002 0 1 0 10.414062 40.414062 L 24 26.828125 L 37.585938 40.414062 A 2.0002 2.0002 0 1 0 40.414062 37.585938 L 26.828125 24 L 40.414062 10.414062 A 2.0002 2.0002 0 0 0 38.982422 6.9707031 z"
            />
          </svg>
        </div>
      </button>
    </div>
    <div class="content">
      <div>
        <span>Règle 1</span>
        <p>
          Il doit y avoir autant de boules blanches que de boules noires sur
          chaque ligne et chaque colonne.
        </p>
        <span>Règle 2</span>
        <p>
          Il ne doit pas y avoir plus de deux boules de la même couleur côte à
          côte.
        </p>
        <span>Règle 3</span>
        <p>Chaque ligne et chaque colonne doit être unique.</p>
      </div>
    </div>
    <button class="button-close" @click="closeRules">COMPRIS !</button>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{ (e: 'openRules', value: boolean): void }>()

const closeRules = () => {
  emit('openRules', false)
}
</script>

<style scoped lang="scss">
.rules-modal-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 2;
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

  .header {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    height: 50px;
    margin-bottom: 1rem;

    button {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background-color: rgb(var(--v-theme-takuzuMainOnSurface));
      color: rgb(var(--v-theme-background));
      border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    }
  }

  .content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 100%;

    width: 100%;
    padding: 0 20px;

    span {
      font-size: 1.25rem;
      font-weight: 700;
      color: rgb(var(--v-theme-takuzuMainOnSurface));
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 1rem;
    }

    p {
      color: rgb(var(--v-theme-takuzuMainOnSurface));
      font-family: 'JetBrains Mono', monospace;
      margin-bottom: 3rem;
    }
  }

  .button-close {
    width: 200px;
    padding: 0.5rem 1rem;
    margin: 0 auto;
    border-radius: 20px;
    background-color: rgb(var(--v-theme-takuzuMainOnSurface));
    color: rgb(var(--v-theme-background));
    border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease-in-out;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
  }
}
</style>
