<template>
  <v-snackbar v-model="notification.show" :color="notification.color">
    <span>
      {{ notification.content }}
    </span>
    <template #actions>
      <v-btn
        color="onPrimary"
        :icon="mdiClose"
        @click="notification.show = false"
      />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { VSnackbar, VBtn } from 'vuetify/components'
import { mdiClose } from '@mdi/js'

const { notification } = useNotifier()
</script>

<style scoped lang="scss">
span {
  font-size: 1rem;
  text-align: justify;
  color: rgb(var(--v-theme-onPrimary));
}
</style>
