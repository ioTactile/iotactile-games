<template>
  <div class="button-volume" :style="setPosition()">
    <v-hover v-slot="{ isHovering, props }">
      <div v-bind="props" class="button-wrapper">
        <Tooltip
          :content="handleVolumeIconTooltips"
          position="top left"
          :slot-height="40"
          :slot-width="40"
        >
          <template #activator="{ onMouseover, onMouseleave }">
            <button
              @click="emit('toggleMusicVolume')"
              @mouseover="onMouseover"
              @mouseleave="onMouseleave"
            >
              <v-icon size="40" :icon="handleVolumeIcon" />
            </button>
          </template>
        </Tooltip>
        <v-card
          v-if="isHovering || isCardHovering"
          width="60"
          color="mineSweeperMainTertiary"
          class="mt-2"
          @mouseover="hoverCard"
          @mouseleave="leaveCard"
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
import { VCard, VCardText, VIcon, VSlider, VHover } from 'vuetify/components'
import { mdiVolumeHigh, mdiVolumeOff } from '@mdi/js'
import { audioTracks } from '~/utils'
import type { ISoundService } from '~/utils/soundService'

if (process.client) {
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'm') {
      emit('toggleMusicVolume')
    }
  })
}

const properties = defineProps<{
  isMusicActive: boolean
  isMusicMuted: boolean
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
  return !properties.isMusicMuted && volume.value > 0
    ? mdiVolumeHigh
    : mdiVolumeOff
})

const handleVolumeIconTooltips = computed((): string => {
  return !properties.isMusicMuted && volume.value > 0
    ? 'Désactiver la musique (m)'
    : 'Activer la musique (m)'
})

const setPosition = (): { top: string; right: string } => {
  return properties.position === 'menu'
    ? { top: '58px', right: '20px' }
    : { top: '48px', right: '330px' }
}

const updateVolume = (value: number): void => {
  if (!properties.isMusicActive) {
    properties.soundService.loadAudioTracks('minesweeper', audioTracks(25))
    properties.soundService.playAudioTracks('minesweeper')
  }
  properties.soundService.changeAudioTracksVolume('minesweeper', value)
}

const hoverCard = (): void => {
  isCardHovering.value = true
}

const leaveCard = (): void => {
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
