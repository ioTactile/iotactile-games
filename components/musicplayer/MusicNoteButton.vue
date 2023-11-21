<template>
  <div>
    <v-btn
      rounded="0"
      color="onSurface"
      :icon="mdiMusicNote"
      @click="toggleMusicPlayer"
    />
    <Teleport to="#music-player">
      <musicplayer-main
        v-show="isMusicPlayerVisible"
        @click:outside="isMusicPlayerVisible = false"
      />
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { VBtn } from 'vuetify/components'
import { mdiMusicNote } from '@mdi/js'

const isMusicPlayerVisible = ref<boolean>(false)

const toggleMusicPlayer = () => {
  isMusicPlayerVisible.value = !isMusicPlayerVisible.value
}
</script>
