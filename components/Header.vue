<template>
  <div>
    <v-app-bar
      color="surface"
      density="comfortable"
      :class="{ 'rounded-b-lg': width > 1200 }"
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
      <template v-if="admin">
        <v-btn
          color="onSurface"
          to="/admin/utilisateurs"
          rounded="0"
          :icon="mdiAccountCheck"
        />
        <v-divider vertical class="mx-2" />
      </template>
      <template v-else>
        <musicplayer-music-note-button />
      </template>
      <v-btn
        v-if="!user"
        color="onSurface"
        rounded="0"
        :icon="mdiAccount"
        @click="login = true"
      />
      <v-menu
        v-else
        :close-on-content-click="false"
        offset="5"
        origin="top right"
      >
        <template #activator="{ props }">
          <v-btn
            color="onSurface"
            rounded="0"
            :icon="mdiAccount"
            v-bind="props"
          />
        </template>
        <UserDetails
          :theme="theme.current.value"
          :admin-user="adminClaims"
          @toggle-theme="toggleTheme"
        />
      </v-menu>
    </v-app-bar>
    <div id="music-player" :style="musicPlayerPositionStyle" />
  </div>

  <client-only>
    <Connexion v-model="login" />
  </client-only>
</template>

<script setup lang="ts">
import {
  VAppBar,
  VBtn,
  VDivider,
  VMenu,
  VImg,
  VSpacer,
} from "vuetify/components";
import { useTheme, useDisplay } from "vuetify";
import { mdiAccount, mdiAccountCheck } from "@mdi/js";
import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores/user";

// Vuetify

const theme = useTheme();
const { width } = useDisplay();

// Props

defineProps<{ admin?: boolean }>();

// Vuefire

const user = useCurrentUser();

// Refs

const login = ref(false);
const userStore = useUserStore();
const { adminClaims } = storeToRefs(userStore);

// onMounted

onMounted(() => {
  localStorage.getItem("theme") === "myCustomDarkTheme"
    ? (theme.global.name.value = "myCustomDarkTheme")
    : (theme.global.name.value = "myCustomLightTheme");
});

// Computed

const musicPlayerPositionStyle = computed(() => {
  return width.value < 375
    ? {
        top: "55px",
        right: "50%",
        transform: "translateX(50%)",
      }
    : {
        top: "5px",
        right: "110px",
      };
});

// Methods

const toggleTheme = () => {
  theme.global.name.value =
    theme.name.value === "myCustomLightTheme"
      ? "myCustomDarkTheme"
      : "myCustomLightTheme";
  localStorage.setItem("theme", theme.global.name.value);
};
</script>

<style scoped lang="scss">
#music-player {
  z-index: 9999;
  position: absolute;
}
</style>
