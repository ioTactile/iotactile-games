<template>
  <div id="scaler" :style="{ transform: `scale(${scale})` }">
    <div id="gamescene">
      <div class="first-layer" />
      <div class="second-layer" />
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const scale = ref<number>(1)
const { width, height } = useDisplay()

const handleResize = () => {
  const targetHeight = height.value - 124
  const targetWidth = 1200

  if (width.value < 600) {
    scale.value = 1
    return
  }

  if (height.value > targetHeight) {
    height.value = targetHeight
  }

  scale.value = Math.min(height.value / targetHeight, width.value / targetWidth)
}

watch(
  [height, width],
  () => {
    handleResize()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.first-layer {
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: 8px;
  background: radial-gradient(
    circle at 50% 50%,
    rgb(var(--v-theme-takuzuMainPrimary)) 0%,
    rgb(var(--v-theme-takuzuMainSecondary)) 100%
  );
}

.second-layer {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-size: cover;
  background-image: url('https://cdn.codenames.game/v20210210/img/bg-raster.svg');
  mix-blend-mode: overlay;
}

#scaler {
  position: relative;
}

#gamescene {
  position: absolute;
  left: 50%;
  top: 10px;
  transform: translateX(-50%);
  width: 1200px;
  height: calc(100vh - 124px);
  background-color: rgb(var(--v-theme-background));
}

@media screen and (max-width: 1120px) {
  .first-layer {
    border-radius: 0;
  }
}
</style>
