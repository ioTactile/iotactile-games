<template>
  <v-app class="app-wrapper overflow-x-hidden">
    <Header admin />
    <v-main>
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

const user = useCurrentUser()

onBeforeMount(async () => {
  if (!user.value) {
    return await navigateTo('/')
  }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgb(204, 204, 204);
  width: 8px;
  border-radius: 8px;
}
</style>
