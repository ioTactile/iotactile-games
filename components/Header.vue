<template>
  <div>
    <v-app-bar color="secondary">
      <v-app-bar-nav-icon class="mr-4" @click="toggleDrawer" />
      <v-spacer class="d-block d-sm-none" />
      <NuxtLink to="/" class="w-100">
        <v-img
          :src="theme.current.value.dark ? '/logo-dark.png' : '/logo.png'"
          alt="logo"
          height="80"
          width="200"
        />
      </NuxtLink>
      <v-spacer />
      <template v-if="admin && adminUser && smAndUp">
        <v-btn to="/admin/lingua-vault" :icon="mdiFileWordBox" />
        <v-btn to="/admin/utilisateurs" :icon="mdiAccountCheck" />
        <v-divider vertical class="mx-2" />
      </template>
      <v-menu
        v-if="!admin"
        class="d-none d-sm-block"
        :close-on-content-click="false"
      >
        <template #activator="{ props }">
          <v-btn
            class="d-none d-sm-block"
            variant="text"
            :icon="mdiMusicNoteEighth"
            v-bind="props"
          />
        </template>
        <music-player />
      </v-menu>
      <v-btn
        class="d-none d-sm-block"
        :icon="mdiThemeLightDark"
        @click="toggleTheme"
      />
      <v-btn :icon="mdiAccount" @click="isLogin('/profil')" />
    </v-app-bar>
    <v-navigation-drawer v-model="drawer" width="200" color="secondary">
      <v-sheet class="d-flex flex-column" height="100%">
        <v-list v-if="!admin" nav>
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :value="item"
            :to="item.link"
            color="highlight"
            class="pl-4"
          >
            {{ item.title }}
          </v-list-item>
        </v-list>
        <v-list v-if="admin && adminUser" class="d-block d-sm-none" nav>
          <v-list-item
            v-for="(item, i) in adminItems"
            :key="i"
            :value="item"
            :to="item.link"
            color="highlight"
            class="pl-4"
          >
            {{ item.title }}
          </v-list-item>
        </v-list>
        <div class="d-flex d-sm-none flex-column justify-center mt-auto mb-4">
          <v-divider class="mb-2" />
          <v-menu :close-on-content-click="false">
            <template #activator="{ props }">
              <v-btn variant="text" v-bind="props">
                Lecteur musique
              </v-btn>
            </template>
            <music-player />
          </v-menu>
          <v-btn variant="text" class="mt-2" @click="toggleTheme">
            Thème {{ theme.current.value.dark ? 'clair' : 'sombre' }}
          </v-btn>
        </div>
      </v-sheet>
    </v-navigation-drawer>

    <client-only>
      <Connexion v-model="login" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import {
  VAppBar,
  VAppBarNavIcon,
  VSheet,
  VBtn,
  VDivider,
  VMenu,
  VList,
  VImg,
  VListItem,
  VNavigationDrawer,
  VSpacer
} from 'vuetify/components'
import { useTheme, useDisplay } from 'vuetify'
import { getIdTokenResult } from 'firebase/auth'
import {
  mdiAccount,
  mdiThemeLightDark,
  mdiMusicNoteEighth,
  mdiAccountCheck,
  mdiFileWordBox
} from '@mdi/js'

// Vuetify

const theme = useTheme()
const { smAndUp } = useDisplay()

// Props

defineProps<{ admin?: boolean }>()

// Vuefire

const user = useCurrentUser()

// Refs

const login = ref(false)
const drawer = ref(false)
const group = ref(null)
const adminUser = ref(false)

// onMounted

onMounted(async () => {
  localStorage.getItem('theme') === 'myCustomDarkTheme'
    ? (theme.global.name.value = 'myCustomDarkTheme')
    : (theme.global.name.value = 'myCustomLightTheme')

  if (!user.value) {
    return
  }

  const { claims } = await getIdTokenResult(user.value, true)
  adminUser.value = claims.admin
})

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

const adminItems = [
  {
    title: 'Utilisateurs',
    link: '/admin/utilisateurs'
  },
  {
    title: 'Lingua Vault',
    link: '/admin/lingua-vault'
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

const toggleDrawer = () => {
  drawer.value = !drawer.value
}

const toggleTheme = () => {
  theme.global.name.value =
    theme.name.value === 'myCustomLightTheme'
      ? 'myCustomDarkTheme'
      : 'myCustomLightTheme'
  localStorage.setItem('theme', theme.global.name.value)
}
</script>
