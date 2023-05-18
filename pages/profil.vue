<template>
  <v-container align="center">
    <v-card max-width="500" color="secondary">
      <v-card-title class="d-flex justify-space-between align-center">
        <h2 class="text-h5">
          Mon profil
        </h2>
        <v-btn
          variant="text"
          :icon="mdiDotsVertical"
          @click="openDeleteUser = !openDeleteUser"
        />
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="updateProfile">
          <div class="d-flex">
            <InputsUsername
              v-model="username"
              :disabled="!change"
              variant="outlined"
            />
            <v-btn
              class="ml-2"
              :icon="mdiPencil"
              variant="text"
              @click="isChange()"
            />
          </div>
          <v-btn
            v-if="change"
            block
            type="submit"
            color="buttonBack"
            :loadind="loading"
          >
            Modifier
          </v-btn>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-text>
        <v-btn
          class="mt-2"
          block
          color="buttonBack"
          :disabled="loading"
          @click="logout"
        >
          Se déconnecter
        </v-btn>
        <v-btn
          v-if="openDeleteUser"
          class="mt-4"
          block
          color="buttonBack"
          variant="outlined"
          :disabled="loading"
          @click="deleteProfile"
        >
          Supprimer ton compte
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { VContainer, VCard, VCardTitle, VCardText, VForm, VDivider, VBtn } from 'vuetify/components'
import { mdiPencil, mdiDotsVertical } from '@mdi/js'
import { deleteUser, signOut } from '@firebase/auth'
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore'
import { useFirestore, useFirebaseAuth, useCurrentUser } from 'vuefire'
import { userConverter } from '~/stores'

// Composable & Vuefire

const { notifier } = useNotifier()
const auth = useFirebaseAuth()
const user = useCurrentUser()
const db = useFirestore()

// Refs

const loading = ref(false)
const change = ref(false)
const openDeleteUser = ref(false)
const username = ref('')
const form = ref(VForm)

// OnMounted

onMounted(async () => {
  if (!user.value) { return }
  const userRef = doc(db, 'users', user.value.uid).withConverter(userConverter)
  const userDoc = await getDoc(userRef)
  const userFetched = userDoc.data()
  if (userFetched) {
    username.value = userFetched.username
  }
})

// Methods

const isChange = () => {
  if (!change.value) {
    change.value = true
  } else {
    change.value = false
  }
}

const updateProfile = async () => {
  if (!user.value || !(await form.value?.validate())?.valid) { return }
  loading.value = true

  try {
    if (user.value) {
      const userId = user.value.uid
      const userRef = doc(db, 'users', userId).withConverter(userConverter)
      await setDoc(userRef, { username: username.value }, { merge: true })
      notifier({
        content: 'Profil mis à jour',
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
    change.value = false
    loading.value = false
  }
}

const deleteProfile = async () => {
  if (!user.value) { return }
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
  if (!auth) { return }
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
