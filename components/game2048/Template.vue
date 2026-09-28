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
import { useDisplay } from 'vuetify';

const { width, height } = useDisplay();

const scale = ref<number>(1);

const handleResize = () => {
  const targetHeight = 924;
  const targetWidth = 1200;

  if (width.value < 600) {
    scale.value = 1;
    return;
  }

  if (height.value > targetHeight) {
    height.value = targetHeight;
  }

  scale.value = Math.min(height.value / targetHeight, width.value / targetWidth);
};

watch(
  [width, height],
  () => {
    if (width.value <= 1200 || height.value <= 924) {
      handleResize();
    }
  },
  { immediate: true },
);
</script>

<style scoped lang="scss">
.first-layer {
  position: absolute;
  z-index: -1;
  inset: 0;
  border-radius: 8px;
  background: radial-gradient(
    circle at 30% 20%,
    rgba(45, 212, 168, 0.35) 0%,
    rgb(var(--v-theme-game2048MainSecondary)) 70%
  );

  @media screen and (max-width: 1120px) {
    border-radius: 0;
  }
}

.second-layer {
  position: absolute;
  z-index: -1;
  inset: 0;
  background-image:
    linear-gradient(rgba(45, 212, 168, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(45, 212, 168, 0.06) 1px, transparent 1px);
  background-size: 32px 32px;
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
  height: 800px;
  background-color: rgb(var(--v-theme-background));

  @media screen and (max-width: 600px) {
    position: inherit;
    width: 100%;
    height: calc(100vh - 66px);
  }
}
</style>
