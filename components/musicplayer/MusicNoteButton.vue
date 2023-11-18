<template>
  <v-menu
    :close-on-content-click="false"
    location="left"
    offset="5"
    transition="slide-x-reverse-transition"
  >
    <template #activator="{ props }">
      <v-btn
        rounded="0"
        color="onSurface"
        :icon="mdiMusicNote"
        v-bind="props"
      />
    </template>
    <musicplayer-main />
  </v-menu>
</template>

<script setup lang="ts">
import { VBtn, VMenu } from 'vuetify/components'
import { mdiMusicNote } from '@mdi/js'
</script>

<style scoped lang="scss"></style>
