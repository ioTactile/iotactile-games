<template>
  <v-container>
    <h1 class="admin-header">Interface administrateur</h1>
  </v-container>
</template>

<script setup lang="ts">
import { VContainer } from "vuetify/components";

definePageMeta({ layout: "admin", middleware: "auth" });
</script>

<style setup lang="scss">
.admin-header {
  text-align: center;
  text-transform: uppercase;
  font-size: 3rem;
  color: rgb(var(--v-theme-onBackground));
}
</style>
