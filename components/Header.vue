<template>
  <div>
    <v-app-bar color="secondary">
      <NuxtLink to="/" class="w-100">
        <v-img
          :src="theme.current.value.dark ? '/logo-dark.png' : '/logo.png'"
          alt="logo"
          height="80"
          width="200"
        />
      </NuxtLink>
      <v-spacer />
      <template v-if="admin && adminUser">
        <v-btn to="/admin/lingua-vault" :icon="mdiFileWordBox" class="mr-1" />
        <v-btn to="/admin/utilisateurs" :icon="mdiAccountCheck" />
        <v-divider vertical class="mx-2" />
      </template>
      <v-btn v-if="!user" :icon="mdiAccount" @click="login = true" />
      <v-menu v-else :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn :icon="mdiAccount" v-bind="props" />
        </template>
        <UserDetails :theme="theme.current.value" @toggle-theme="toggleTheme" />
      </v-menu>
    </v-app-bar>

    <client-only>
      <Connexion v-model="login" />
    </client-only>
  </div>
</template>

<script lang="ts" setup>
import { VAppBar, VBtn, VDivider, VMenu, VImg, VSpacer } from 'vuetify/components'
import { useTheme } from 'vuetify'
import { getIdTokenResult } from 'firebase/auth'
import { mdiAccount, mdiAccountCheck, mdiFileWordBox } from '@mdi/js'

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
    theme.name.value === 'myCustomLightTheme' ? 'myCustomDarkTheme' : 'myCustomLightTheme'
  localStorage.setItem('theme', theme.global.name.value)
}
</script>
