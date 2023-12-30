<template>
  <div class="volume-container">
    <button @click="isHovering = !isHovering">
      <v-icon :icon="handleVolumeIcon" size="25" color="onBackground" />
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
import { VIcon, VSlider } from "vuetify/components";
import { mdiVolumeHigh, mdiVolumeOff } from "@mdi/js";
import type { IPlaylistService } from "~/utils/music/playlistService";

const props = defineProps<{
  isMusicMuted: boolean;
  playlist: IPlaylistService;
}>();

const volume = ref<number>(0.5);
const isHovering = ref<boolean>(false);

onMounted(() => {
  volume.value = props.playlist.getPlaylistVolumeFromLocalStorage();
});

const handleVolumeIcon = computed((): string => {
  return !props.isMusicMuted && volume.value > 0 ? mdiVolumeHigh : mdiVolumeOff;
});

const updateVolume = (value: number): void => {
  props.playlist.changePlaylistVolume(value);
  isHovering.value = false;
};
</script>

<style scoped lang="scss">
.volume-container {
  position: relative;
  display: flex;
  align-items: center;

  .volume-slider-container {
    background-color: rgb(var(--v-theme-background));
    border-radius: 4px;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);
    margin-right: 0.25rem;
    position: absolute;
    width: 150px;
    right: calc(20px + 0.5rem);
  }
}
</style>
