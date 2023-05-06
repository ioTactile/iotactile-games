<template>
  <div>
    <v-app-bar color="secondary">
      <v-app-bar-nav-icon class="mr-4" @click.stop="drawer = !drawer" />
      <v-spacer class="d-block d-sm-none" />
      <NuxtLink to="/">
        <v-app-bar-title class="font-weight-bold text-buttonBack text-h4">
          iotactile Games
        </v-app-bar-title>
      </NuxtLink>
      <v-spacer />
      <span
        v-if="username"
        class="d-none d-sm-block"
      >Bonjour, {{ username }}</span>
      <v-btn icon="mdi-account" size="large" @click="isLogin('/profil')" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" width="200">
      <v-list nav class="pa-0">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :value="item"
          :to="item.link"
          active-color="highlight"
        >
          {{ item.title }}
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <client-only>
      <Connexion v-model="login" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { useFirestore, useCurrentUser } from 'vuefire'

const user = useCurrentUser()
const login = ref(false)
const drawer = ref(false)
const group = ref(null)

watch(group, () => {
  drawer.value = false
})

const items = [
  {
    title: 'Lingua Vault',
    link: '/lingua-vault'
  },
  {
    title: 'Dice',
    link: '/dice'
  }
]

const isLogin = (path: string) => {
  if (!user.value) {
    login.value = true
  } else {
    navigateTo(path)
  }
}
</script>
