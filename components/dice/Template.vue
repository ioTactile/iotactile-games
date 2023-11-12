<template>
  <div id="scaler" :style="{ transform: `scale(${scale})` }">
    <div id="gamescene">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify'

const scale = ref<number>(1)
const { width, height } = useDisplay()

const handleResize = () => {
  const targetHeight = 980
  const targetWidth = 1200

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
  border-radius: 8px;
  background-color: rgb(var(--v-theme-diceMainPrimary));
}

@media screen and (max-width: 1120px) {
  #gamescene {
    border-radius: 0;
  }
}
</style>
