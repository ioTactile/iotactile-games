<template>
  <div>
    <v-app-bar color="secondary">
      <v-app-bar-nav-icon class="mr-4" @click.stop="drawer = !drawer" />
      <v-spacer class="d-block d-sm-none" />
      <NuxtLink to="/" class="w-100">
        <v-img src="/logo.png" alt="logo" height="80" width="200" />
      </NuxtLink>
      <v-spacer />
      <v-menu class="d-none d-sm-block" :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn class="d-none d-sm-block" variant="text" :icon="mdiMusicNoteEighth" v-bind="props" />
        </template>
        <music-player />
      </v-menu>
      <v-btn class="d-none d-sm-block" :icon="mdiThemeLightDark" @click="toggleTheme" />
      <v-btn :icon="mdiAccount" size="large" @click="isLogin('/profil')" />
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
      <div class="d-flex d-sm-none flex-column justify-center">
        <v-divider />
        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn variant="text" v-bind="props">
              Lecteur musique
            </v-btn>
          </template>
          <music-player />
        </v-menu>
        <v-btn variant="text" @click="toggleTheme">
          Changer de thème
        </v-btn>
      </div>
    </v-navigation-drawer>

    <client-only>
      <Connexion v-model="login" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { VAppBar, VAppBarNavIcon, VBtn, VDivider, VMenu, VList, VImg, VListItem, VNavigationDrawer, VSpacer } from 'vuetify/components'
import { useTheme } from 'vuetify'
import { mdiAccount, mdiThemeLightDark, mdiMusicNoteEighth } from '@mdi/js'

// Vuetify

const user = useCurrentUser()
const theme = useTheme()

// Refs

const login = ref(false)
const drawer = ref(false)
const group = ref(null)

// Watchers

watch(group, () => {
  drawer.value = false
})

const items = [
  {
    title: 'Lingua Vault',
    link: '/lingua-vault/jouer'
  },
  {
    title: 'Dice',
    link: '/dice/jouer'
  }
]

// Methods

const isLogin = (path: string) => {
  if (!user.value) {
    login.value = true
  } else {
    navigateTo(path)
  }
}

const toggleTheme = () => {
  theme.global.name.value = theme.name.value === 'myCustomLightTheme' ? 'myCustomDarkTheme' : 'myCustomLightTheme'
}
</script>
