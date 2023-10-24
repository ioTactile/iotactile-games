<template>
  <v-footer class="rounded-t-lg" color="secondary" absolute height="55.99" app>
    <div class="d-flex justify-space-evenly w-100 py-2">
      <NuxtLink to="/a-propos" class="text-decoration-none text-headline"> À propos </NuxtLink>
      <div>
        © {{ new Date().getFullYear() }} - Réalisé par
        <a href="https://github.com/ioTactile" class="text-decoration-none">
          <strong class="text-headline">iotactile</strong>
        </a>
      </div>
      <a href="mailto:jbs.io@protonmail.com" class="text-decoration-none text-headline">
        Me contacter
      </a>
    </div>
  </v-footer>
</template>

<script lang="ts" setup>
import { VFooter } from 'vuetify/components'
</script>

<style lang="scss" scoped>
.v-footer {
  width: 1200px !important;
}
</style>
