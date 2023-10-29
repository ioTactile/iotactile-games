<template>
  <v-footer
    class="rounded-t-lg"
    color="secondary"
    absolute
    min-height="55.99"
    app
  >
    <div
      class="d-flex flex-wrap flex-sm-row justify-space-evenly align-center w-100 py-sm-2"
    >
      <NuxtLink to="/a-propos" class="text-decoration-none text-headline">
        À propos
      </NuxtLink>
      <div :class="xs ? 'order-3 pt-2' : ''">
        © {{ new Date().getFullYear() }} - Réalisé par
        <a href="https://github.com/ioTactile" class="text-decoration-none">
          <strong class="text-headline">iotactile</strong>
        </a>
      </div>
      <a
        href="mailto:jbs.io@protonmail.com"
        class="text-decoration-none text-headline"
      >
        Me contacter
      </a>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
import { VFooter } from 'vuetify/components'
import { useDisplay } from 'vuetify'

const { xs } = useDisplay()
</script>

<style lang="scss" scoped>
.v-footer {
  max-width: 1200px !important;
}
</style>
