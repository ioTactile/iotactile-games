<template>
  <div class="volume-container">
    <button @click="isHovering = !isHovering">
      <v-icon size="25" :icon="handleVolumeIcon" color="onBackground" />
    </button>
    <div v-if="isHovering" class="volume-slider-container">
      <v-slider
        v-model="volume"
        min="0"
        max="1"
        step="0.01"
        thumb-size="6"
        track-size="2"
        reverse
        hide-details
        color="onBackground"
        @end="updateVolume"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { VIcon, VSlider } from 'vuetify/components'
import { mdiVolumeHigh, mdiVolumeOff } from '@mdi/js'
import type { IPlaylistService } from '~/utils/music/playlistService'

const properties = defineProps<{
  isMusicMuted: boolean
  playlistService: IPlaylistService
  currentPlaylistGenre: string
}>()

const volume = ref<number>(0.5)
const isHovering = ref<boolean>(false)

onMounted(() => {
  volume.value = properties.playlistService.getPlaylistVolumeFromLocalStorage()
})

const handleVolumeIcon = computed((): string => {
  return !properties.isMusicMuted && volume.value > 0
    ? mdiVolumeHigh
    : mdiVolumeOff
})

const updateVolume = (value: number): void => {
  properties.playlistService.changePlaylistVolume(
    properties.currentPlaylistGenre,
    value
  )
  isHovering.value = false
}
</script>

<style scoped lang="scss">
.volume-container {
  position: relative;
  display: flex;
  align-items: center;

  .volume-slider-container {
    position: absolute;
    width: 100px;
    height: auto;
    right: calc(20px + 0.5rem);
  }
}
</style>
