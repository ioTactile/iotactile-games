<template>
  <div id="scaler" :style="{ transform: `scale(${scale})` }">
    <div id="gamescene">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const scale = ref<number>(1)
const { width: windowWidth, height: windowHeight } = useWindowSize()

const handleResize = () => {
  const targetHeight = 1080
  const targetWidth = 1200

  if (windowHeight.value > targetHeight) {
    windowHeight.value = targetHeight
  }

  scale.value = Math.min(
    windowHeight.value / targetHeight,
    windowWidth.value / targetWidth
  )
}

watch(
  [windowHeight, windowWidth],
  () => {
    handleResize()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
#scaler {
  position: relative;
}

#gamescene {
  position: absolute;
  left: 50%;
  top: 50px;
  transform: translateX(-50%);
  width: 1200px;
  height: 800px;
  background-color: rgb(var(--v-theme-diceMainPrimary));
}
</style>
