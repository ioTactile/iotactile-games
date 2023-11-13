<template>
  <v-app class="app-wrapper">
    <Header />
    <v-main>
      <slot />
    </v-main>
    <Footer />
    <ClientOnly>
      <Snackbar />
    </ClientOnly>
  </v-app>
</template>

<script setup lang="ts">
import { VApp, VMain } from 'vuetify/components'
</script>

<style scoped lang="scss">
.app-wrapper {
  overflow-x: hidden;
}
</style>
