<template>
  <div class="button-volume" :style="setPosition()">
    <v-hover v-slot="{ isHovering, props }" open-delay="200">
      <div v-bind="props" class="button-wrapper">
        <v-icon
          size="40"
          :icon="handleVolumeIcon"
          color="mineSweeperMainOnSurface"
          @click="emit('toggleMusicVolume')"
          @keyup.m="emit('toggleMusicVolume')"
        >
          <v-tooltip activator="parent" location="top" close-on-content-click>
            {{ handleVolumeIconTooltips }}
          </v-tooltip>
        </v-icon>
        <v-card
          v-if="isHovering || isCardHovering"
          width="60"
          color="mineSweeperMainTertiary"
          class="mt-2"
          @mouseover="hover"
          @mouseleave="leave"
        >
          <v-card-text class="pt-0">
            <v-slider
              v-model="volume"
              dense
              min="0"
              max="1"
              step="0.01"
              thumb-size="12"
              track-size="4"
              hide-details
              direction="vertical"
              color="white"
              @end="updateVolume"
            />
          </v-card-text>
        </v-card>
      </div>
    </v-hover>
  </div>
</template>

<script setup lang="ts">
import {
  VCard,
  VCardText,
  VIcon,
  VTooltip,
  VSlider,
  VHover
} from 'vuetify/components'
import { mdiVolumeHigh, mdiVolumeOff } from '@mdi/js'
import type { ISoundService } from '~/utils/soundService'

const properties = defineProps<{
  isMusicActive: boolean
  soundService: ISoundService
  position: 'menu' | 'game'
}>()

const emit = defineEmits<{
  (e: 'toggleMusicVolume'): void
}>()

const volume = ref<number>(0.5)
const isCardHovering = ref<boolean>(false)

onMounted(() => {
  volume.value = properties.soundService.getAudioTracksVolumeFromLocalStorage()
})

const handleVolumeIcon = computed((): string => {
  return properties.isMusicActive && volume.value > 0
    ? mdiVolumeHigh
    : mdiVolumeOff
})

const handleVolumeIconTooltips = computed((): string => {
  return properties.isMusicActive && volume.value > 0
    ? 'Désactiver la musique (m)'
    : 'Activer la musique (m)'
})

const setPosition = (): { top: string; right: string } => {
  return properties.position === 'menu'
    ? { top: '58px', right: '20px' }
    : { top: '48px', right: '330px' }
}

const updateVolume = (value: number): void => {
  properties.soundService.setAudioTracksVolumeInLocalStorage(value)
  properties.soundService.changeAudioTracksVolume('mineSweeper', value)
}

const hover = (): void => {
  isCardHovering.value = true
}

const leave = (): void => {
  isCardHovering.value = false
}
</script>

<style scoped lang="scss">
.button-volume {
  z-index: 2;
  position: absolute;

  .button-wrapper {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 60px;
  }
}
</style>
