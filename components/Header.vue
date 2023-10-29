<template>
  <v-app-bar
    color="surface"
    density="comfortable"
    class="rounded-b-lg"
    absolute
    elevation="0"
  >
    <NuxtLink to="/">
      <v-img
        :src="theme.current.value.dark ? '/logo-dark.png' : '/logo.png'"
        alt="logo"
        height="80"
        width="200"
      />
    </NuxtLink>
    <v-spacer />
    <template v-if="admin && adminUser">
      <v-btn
        color="onSurface"
        to="/admin/utilisateurs"
        :icon="mdiAccountCheck"
      />
      <v-divider vertical class="mx-2" />
    </template>
    <v-btn
      v-if="!user"
      color="onSurface"
      :icon="mdiAccount"
      @click="login = true"
    />
    <v-menu v-else :close-on-content-click="false" origin="top right">
      <template #activator="{ props }">
        <v-btn color="onSurface" :icon="mdiAccount" v-bind="props" />
      </template>
      <UserDetails :theme="theme.current.value" @toggle-theme="toggleTheme" />
    </v-menu>
  </v-app-bar>

  <client-only>
    <Connexion v-model="login" />
  </client-only>
</template>

<script lang="ts" setup>
import {
  VAppBar,
  VBtn,
  VDivider,
  VMenu,
  VImg,
  VSpacer
} from 'vuetify/components'
import { useTheme } from 'vuetify'
import { getIdTokenResult } from 'firebase/auth'
import { mdiAccount, mdiAccountCheck } from '@mdi/js'

// Vuetify

const theme = useTheme()

// Props

defineProps<{ admin?: boolean }>()

// Vuefire

const user = useCurrentUser()

// Refs

const login = ref(false)
const adminUser = ref<boolean | unknown>(false)

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

// Methods

const toggleTheme = () => {
  theme.global.name.value =
    theme.name.value === 'myCustomLightTheme'
      ? 'myCustomDarkTheme'
      : 'myCustomLightTheme'
  localStorage.setItem('theme', theme.global.name.value)
}
</script>

<style lang="scss" scoped>
.v-app-bar {
  width: 1200px !important;
}
</style>
