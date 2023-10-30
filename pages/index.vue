<template>
  <div>
    <h1 class="d-none">iotactile games</h1>
    <v-row class="d-flex justify-center">
      <v-col cols="12" sm="6" md="4" class="pa-2 ma-0">
        <GameFramework
          img="/dice.png"
          alt="Dice game"
          title="Dice"
          link="/dice"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { VRow, VCol } from 'vuetify/components'

useSeoMeta({
  title: 'Accueil - ioTactile Games',
  ogTitle: 'Accueil - ioTactile Games',
  description:
    'ioTactile Games - Un site de jeux amusants à jouer seul ou à plusieurs',
  ogDescription:
    'ioTactile Games - Un site de jeux amusants à jouer seul ou à plusieurs'
})
</script>

<style scoped>
div {
  max-width: 1200px !important;
  margin: 10px 0;
}
</style>
