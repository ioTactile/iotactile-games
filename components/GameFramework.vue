<template>
  <v-responsive :aspect-ratio="4 / 3" class="rounded-lg">
    <v-card
      :to="link"
      class="d-flex flex-column pa-1"
      rounded="lg"
      elevation="3"
      height="100%"
    >
      <v-img
        :src="img"
        :alt="alt"
        :aspect-ratio="1.5"
        cover
        class="rounded-t-lg"
      />
      <h2 class="text-center mt-1" :style="{ fontFamily: font }">
        {{ title }}
      </h2>
    </v-card>
  </v-responsive>
</template>

<script setup lang="ts">
import { VCard, VImg, VResponsive } from "vuetify/components";

defineProps<{
  img: string;
  alt: string;
  title: string;
  link: string;
  font: string;
}>();
</script>

<style scoped lang="scss">
h2 {
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: 0.1rem;
  text-transform: uppercase;
  color: rgb(var(--v-theme-onSurface));
}
</style>
