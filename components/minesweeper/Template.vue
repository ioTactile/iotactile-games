<template>
  <div id="scaler" :style="{ transform: `scale(${scale})` }">
    <div id="gamescene">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { width, height } = useDisplay()

const scale = ref<number>(1)
const resizeTimeout = ref<NodeJS.Timeout | null>(null)

const handleResize = () => {
  const targetHeight = 980
  const targetWidth = 1200

  if (height.value > targetHeight) {
    height.value = targetHeight
  }

  scale.value = Math.min(height.value / targetHeight, width.value / targetWidth)
}

watch(
  [width, height],
  () => {
    if (resizeTimeout.value) {
      clearTimeout(resizeTimeout.value)
    }
    resizeTimeout.value = setTimeout(() => {
      handleResize()
      resizeTimeout.value = null
    }, 300)
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
  top: 10px;
  transform: translateX(-50%);
  width: 1200px;
  height: 800px;
  background-color: rgb(var(--v-theme-background));
}
</style>
