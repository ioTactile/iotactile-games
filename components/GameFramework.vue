<template>
  <v-responsive :aspect-ratio="4 / 3" class="rounded-lg">
    <v-card
      :to="link"
      class="d-flex flex-column pa-1"
      rounded="lg"
      elevation="3"
      height="100%"
    >
      <v-img :src="img" :alt="alt" class="rounded-t-lg" height="136" />
      <div class="text-center">
        {{ title }}
      </div>
    </v-card>
  </v-responsive>
</template>

<script setup lang="ts">
import {VCard, VImg, VResponsive} from 'vuetify/components'
defineProps<{
  img: string
  alt: string
  title: string
  link: string
}>()
</script>
