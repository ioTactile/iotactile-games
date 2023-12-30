<template>
  <v-card class="bg-surface" rounded="lg" width="280">
    <section class="pa-2">
      <div class="text-center">
        <form @submit.prevent="changeUsername">
          <label class="d-block my-2" for="username-input">Pseudo</label>
          <InputsUsername
            id="username-input"
            v-model="username"
            type="text"
            variant="outlined"
            density="compact"
            placeholder="Choisissez votre pseudo"
          />
          <v-btn
            type="submit"
            class="mt-1 text-onSurfaceButton"
            block
            color="surfaceButton"
            :loadind="loading"
          >
            Changer de pseudo
          </v-btn>
        </form>
      </div>
    </section>
    <v-divider class="my-2" />
    <section class="pa-2">
      <v-btn
        color="primary"
        class="text-onPrimary"
        block
        @click="emits('toggleTheme')"
      >
        <v-icon :icon="mdiThemeLightDark" />
        <span class="pl-2">
          {{
            theme.dark === true
              ? "Passer en mode clair"
              : "Passer en mode sombre"
          }}
        </span>
      </v-btn>
    </section>
    <v-divider class="my-2" />
    <section class="pa-2">
      <v-btn
        v-if="adminUser"
        color="surfaceButton"
        block
        to="/admin"
        class="mb-2 text-onSurfaceButton"
      >
        Espace d'administration
      </v-btn>
      <v-btn
        color="surfaceButton"
        class="text-onSurfaceButton"
        block
        :disabled="loading"
        @click="logout"
      >
        Se déconnecter
      </v-btn>
      <v-btn
        variant="text"
        density="compact"
        block
        rounded="0"
        :icon="mdiDotsHorizontal"
        color="onSurface"
        class="mt-2"
        @click="isDeleting = !isDeleting"
      />
      <v-btn
        v-if="isDeleting"
        class="mt-2"
        color="error"
        block
        :disabled="loading"
        @click="openDeleteUser = true"
      >
        Supprimer ton compte
      </v-btn>
    </section>
  </v-card>

  <client-only>
    <v-dialog v-model="openDeleteUser" width="500">
      <v-card class="pa-2">
        <v-card-title class="text-center">
          Es tu sûr de vouloir supprimer ton compte ?
        </v-card-title>
        <div class="d-flex justify-center">
          <v-btn
            color="error"
            variant="text"
            :loading="loading"
            @click="deleteProfile"
          >
            Oui
          </v-btn>
          <v-btn
            variant="text"
            :loading="loading"
            @click="openDeleteUser = false"
          >
            Non
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </client-only>
</template>

<script setup lang="ts">
import {
  VForm,
  VCard,
  VCardTitle,
  VBtn,
  VDivider,
  VIcon,
  VDialog,
} from "vuetify/components";
import { doc, updateDoc, getDoc, deleteDoc } from "firebase/firestore";
import { deleteUser, signOut } from "@firebase/auth";
import { mdiDotsHorizontal, mdiThemeLightDark } from "@mdi/js";
import { userConverter } from "~/stores";

// Props

defineProps<{
  theme: { dark: boolean };
  adminUser: boolean | unknown;
}>();

const emits = defineEmits<{ (e: "toggleTheme"): void }>();

// Vuefire

const { notifier } = useNotifier();
const auth = useFirebaseAuth();
const user = useCurrentUser();
const db = useFirestore();

// Refs

const form = ref<VForm>();
const loading = ref<boolean>(false);
const openDeleteUser = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const username = ref<string>("");

// onMounted

onMounted(async () => {
  if (!user.value) {
    return;
  }

  const userRef = doc(db, "users", user.value.uid).withConverter(userConverter);
  const userDoc = await getDoc(userRef);
  const userFetched = userDoc.data();

  if (userFetched) {
    username.value = userFetched.username;
  }
});

const changeUsername = async () => {
  if (!user.value || !(await form.value?.validate())?.valid) {
    return;
  }

  try {
    loading.value = true;
    if (user.value) {
      const userId = user.value.uid;
      const userRef = doc(db, "users", userId).withConverter(userConverter);
      await updateDoc(userRef, { username: username.value });
      notifier({
        content: "Ton pseudo a bien été mis à jour",
        color: "main",
      });
    }
  } catch (error) {
    notifier({
      content:
        "Une erreur est survenue lors de la mise à jour de tes informations",
      color: "error",
      error,
    });
  } finally {
    loading.value = false;
  }
};

// Methods

const deleteProfile = async () => {
  if (!user.value) {
    return;
  }
  try {
    loading.value = true;

    const userRef = doc(db, "users", user.value.uid);
    await deleteDoc(userRef);
    await deleteUser(user.value);
  } catch (error) {
    notifier({
      content: "Une erreur est survenue lors de la suppression de ton compte",
      color: "error",
      error,
    });
  } finally {
    loading.value = false;
    openDeleteUser.value = false;
  }
};

const logout = async () => {
  if (!auth) {
    return;
  }

  try {
    loading.value = true;

    await signOut(auth);
    await navigateTo("/");
  } catch (error) {
    notifier({
      content: "Une erreur est survenue lors de la déconnexion",
      color: "error",
      error,
    });
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped lang="scss">
.v-card {
  left: 50px;
}
</style>
