<template>
  <v-app class="app-wrapper overflow-x-hidden">
    <Header />
    <v-main class="bg-background">
      <slot />
    </v-main>
    <Footer />
    <ClientOnly>
      <Snackbar />
    </ClientOnly>
  </v-app>
</template>

<script lang="ts" setup>
import { VApp, VMain } from 'vuetify/components'
</script>

<style lang="scss" scoped>
.app-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
