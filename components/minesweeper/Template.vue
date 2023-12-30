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
  height: calc(100vh - 124px);
  background-color: rgb(var(--v-theme-background));

  @media screen and (max-width: 600px) {
    position: inherit;
    width: 100%;
    height: 100vh;
  }
}
</style>
