<template>
  <button class="ml-6">
    <v-icon :icon="mdiChatProcessingOutline" size="46" color="white" />
  </button>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import { mdiChatProcessingOutline } from '@mdi/js'
</script>

<style scoped lang="scss">
button {
  width: 64px;
  height: 64px;
  background-color: rgb(var(--v-theme-diceMainTertiary));
  border-radius: 8px;
  box-shadow: 0 4px 0 0 rgba(0, 0, 0, 0.3);
}
</style>
