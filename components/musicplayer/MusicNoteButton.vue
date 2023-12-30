<template>
  <div>
    <v-btn
      rounded="0"
      color="onSurface"
      :icon="mdiMusicNote"
      @click="toggleMusicPlayer"
    />
    <Teleport to="#music-player">
      <musicplayer v-show="isMusicPlayerVisible" ref="musicPlayer" />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { VBtn } from "vuetify/components";
import { mdiMusicNote } from "@mdi/js";
import { onClickOutside } from "@vueuse/core";

const isMusicPlayerVisible = ref<boolean>(false);
const musicPlayer = ref<HTMLElement>();

onClickOutside(musicPlayer, (): void => {
  isMusicPlayerVisible.value = false;
});

const toggleMusicPlayer = () => {
  isMusicPlayerVisible.value = !isMusicPlayerVisible.value;
};
</script>
