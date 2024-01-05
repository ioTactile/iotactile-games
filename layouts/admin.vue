<template>
  <v-app>
    <Header admin />
    <v-main>
      <slot />
    </v-main>
    <Footer />
    <client-only>
      <Snackbar />
    </client-only>
  </v-app>
</template>

<script setup lang="ts">
import { VApp, VMain } from "vuetify/components";
</script>
