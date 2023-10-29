<template>
  <v-card class="bg-secondary mt-1" rounded="lg" width="260">
    <section class="pa-2">
      <div class="text-center">
        <form @submit.prevent="changeUsername">
          <label class="d-block" for="username-input">Pseudo</label>
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
            class="mt-1"
            block
            color="buttonBack"
            :loadind="loading"
          >
            Changer de pseudo
          </v-btn>
        </form>
      </div>
    </section>
    <v-divider class="my-2" />
    <section class="pa-2">
      <v-btn color="headline" block @click="emits('toggleTheme')">
        <v-icon :icon="mdiThemeLightDark" />
        <span class="pl-2">
          {{
            theme.dark === true
              ? 'Passer en mode clair'
              : 'Passer en mode sombre'
          }}
        </span>
      </v-btn>
    </section>
    <v-divider class="my-2" />
    <section class="pa-2">
      <v-btn color="main" block :disabled="loading" @click="logout">
        Se déconnecter
      </v-btn>
      <v-btn
        class="my-2"
        color="error"
        block
        :disabled="loading"
        @click="openDeleteUser = true"
      >
        Supprimer ton compte
      </v-btn>
      <v-btn v-if="userClaims?.admin" block color="headline" to="/admin">
        Espace d'administration
      </v-btn>
    </section>
  </v-card>

  <client-only>
    <v-dialog v-model="openDeleteUser" width="500">
      <v-card color="main" class="pa-2">
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
  VDialog
} from 'vuetify/components'
import {doc, updateDoc, getDoc, deleteDoc} from 'firebase/firestore'
import {deleteUser, getIdTokenResult, signOut} from '@firebase/auth'
import {mdiThemeLightDark} from '@mdi/js'
import {userConverter} from '~/stores'

// Props

defineProps<{ theme: { dark: boolean } }>()
const emits = defineEmits<{ (e: 'toggleTheme'): void }>()

// Vuefire

const {notifier} = useNotifier()
const auth = useFirebaseAuth()
const user = useCurrentUser()
const db = useFirestore()

// Refs

const userClaims = ref()
const form = ref(VForm)
const loading = ref<boolean>(false)
const openDeleteUser = ref<boolean>(false)
const username = ref<string>('')

// onMounted

onMounted(async () => {
  if (!user.value) {
    return
  }
  const userRef = doc(db, 'users', user.value.uid).withConverter(userConverter)
  const userDoc = await getDoc(userRef)
  const userFetched = userDoc.data()
  if (userFetched) {
    username.value = userFetched.username
  }

  const {claims} = await getIdTokenResult(user.value, true)
  userClaims.value = claims
})

const changeUsername = async () => {
  if (!user.value || !(await form.value?.validate())?.valid) {
    return
  }
  loading.value = true

  try {
    if (user.value) {
      const userId = user.value.uid
      const userRef = doc(db, 'users', userId).withConverter(userConverter)
      await updateDoc(userRef, {username: username.value})
      notifier({
        content: 'Ton pseudo a bien été mis à jour',
        color: 'main'
      })
    }
  } catch (error) {
    notifier({
      content:
        'Une erreur est survenue lors de la mise à jour de tes informations',
      color: 'error',
      error
    })
  } finally {
    loading.value = false
  }
}

// Methods

const deleteProfile = async () => {
  if (!user.value) {
    return
  }
  loading.value = true
  try {
    const userRef = doc(db, 'users', user.value.uid)
    await deleteDoc(userRef)
    await deleteUser(user.value)
  } catch (error) {
    notifier({
      content: 'Une erreur est survenue lors de la suppression de ton compte',
      color: 'error',
      error
    })
  } finally {
    loading.value = false
    openDeleteUser.value = false
  }
}

const logout = async () => {
  if (!auth) {
    return
  }
  loading.value = true
  try {
    await signOut(auth)
    await navigateTo('/')
  } catch (error) {
    notifier({
      content: 'Une erreur est survenue lors de la déconnexion',
      color: 'error',
      error
    })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card {
  left: 50px;
}
</style>
