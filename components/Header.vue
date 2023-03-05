<template>
  <div>
    <v-app-bar elevate-on-scroll elevation="0" color="secondary">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-spacer />
      <v-app-bar-title class="font-weight-bold text-buttonBack text-h4 text-center">
        iotactile Games
      </v-app-bar-title>
      <v-spacer />
      <v-btn icon="mdi-account" size="large" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" width="200"> 
      <v-list :items="items" class="pa-0" active-color="buttonBack" />
    </v-navigation-drawer>
  </div>
</template>

<script lang="ts" setup>
const drawer = ref(false)
const group = ref(null)

watch(group, () => {
  drawer.value = false
})

const items = [
  {
    title: 'Lingua Vault',
    value: 'lingua-vault',
  },
  {
    title: 'Dice',
    value: 'dice',
  }
]
</script>