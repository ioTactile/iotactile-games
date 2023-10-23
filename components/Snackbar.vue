<template>
  <v-snackbar v-model="notification.show" :color="notification.color">
    <div class="text-body-1">
      {{ notification.content }}
    </div>
    <template #actions>
      <v-btn color="stroke" :icon="mdiClose" @click="notification.show = false" />
    </template>
  </v-snackbar>
</template>

<script lang="ts" setup>
import { VSnackbar, VBtn } from 'vuetify/components'
import { mdiClose } from '@mdi/js'

// Composable

const { notification } = useNotifier()
</script>
