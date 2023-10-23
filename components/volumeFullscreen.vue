<template>
  <div v-if="isFullscreen">
    <v-hover v-slot="{ isHovering, props }" open-delay="100">
      <div v-bind="props" @mouseover="emitHoverEvent(true)" @mouseleave="emitHoverEvent(false)">
        <div
          class="volume-icon d-flex align-center justify-center"
          :class="{ 'volume-icon-hover': isHovering || isCardHovering }"
        >
          <v-icon size="large">
            {{ isSoundMuted ? mdiVolumeOff : mdiVolumeHigh }}
          </v-icon>
        </div>
        <v-card
          v-if="isHovering || isCardHovering"
          width="40"
          rounded="0"
          elevation="0"
          class="card-hover"
          @mouseover="handleCardHover"
          @mouseleave="handleCardLeave"
        >
          <v-card-text>
            <v-slider
              v-model="newVolume"
              dense
              min="0"
              max="1"
              step="0.01"
              thumb-size="12"
              track-size="2"
              hide-details
              direction="vertical"
            />
          </v-card-text>
        </v-card>
      </div>
    </v-hover>
  </div>
</template>

<script setup lang="ts">
import { VCard, VCardText, VHover, VIcon, VSlider } from 'vuetify/components'
import { mdiVolumeHigh, mdiVolumeOff } from '@mdi/js'

const properties = defineProps<{
  volume: number
  isFullscreen: boolean
}>()

const emits = defineEmits<{
  (e: 'update:volume', value: number): void
  (e: 'hoverEvent', value: boolean): void
}>()

const isSoundMuted = ref(false)
const isCardHovering = ref(false)
const newVolume = computed({
  get: () => properties.volume,
  set: (value) => {
    emits('update:volume', value)
  }
})

watch(newVolume, (newValue) => {
  newVolume.value = newValue
  if (newValue === 0) {
    isSoundMuted.value = true
  } else {
    isSoundMuted.value = false
  }
})

const handleCardHover = () => {
  isCardHovering.value = true
}

const handleCardLeave = () => {
  isCardHovering.value = false
}

const emitHoverEvent = (value: boolean) => {
  emits('hoverEvent', value)
}
</script>

<style scoped>
.volume-icon {
  border-top-left-radius: 20px;
  border-bottom-left-radius: 20px;
  background-color: white;
  width: 40px;
  height: 40px;
  opacity: 0.3;
}

.volume-icon-hover {
  border-top-right-radius: 20px;
  border-bottom-left-radius: 0px;
  border-bottom-right-radius: 0px;
  opacity: 1;
}

.card-hover {
  border-bottom-left-radius: 20px !important;
  border-bottom-right-radius: 20px !important;
}
</style>
