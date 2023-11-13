<template>
  <v-app class="app-wrapper">
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
import { VApp, VMain } from 'vuetify/components'

const user = useCurrentUser()

onBeforeMount(async () => {
  if (!user.value) {
    return await navigateTo('/')
  }
})
</script>

<style scoped lang="scss">
.app-wrapper {
  overflow-x: hidden;
}
</style>
