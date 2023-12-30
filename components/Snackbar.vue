<template>
  <v-snackbar
    v-model="notification.show"
    :color="notification.color"
    timeout="3000"
  >
    <span>
      {{ notification.content }}
    </span>
    <template #actions>
      <v-btn :icon="mdiClose" @click="notification.show = false" />
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { VSnackbar, VBtn } from 'vuetify/components'
import { mdiClose } from '@mdi/js'

const { notification } = useNotifier()
</script>
