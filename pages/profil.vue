<template>
  <v-container align="center">
    <v-card max-width="500">
      <v-card-title class="text-left">
        <h2 class="text-h5">Mon profil</h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateProfile">
          <div class="d-flex">
            <InputsUsername
              v-model="username"
              :disabled="!change"
              variant="outlined"
            />
            <v-btn
              class="ml-2"
              icon="mdi-pencil"
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
      <v-card-title class="text-left">
        <h2 class="text-h5">Sortir du club</h2>
      </v-card-title>
      <v-card-text>
        <span>Tu vas nous manquer, reviens vite!</span>
        <v-btn
          class="mt-2"
          block
          color="buttonBack"
          :disabled="loading"
          @click="logout"
        >
          Se déconnecter
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { userConverter } from '~/stores'

const { $notifier, $firebaseApp, $firestore } = useNuxtApp()

const loading = ref(false)
const change = ref(false)
const username = ref('')

function isChange() {
  if (!change.value) {
    change.value = true
  } else {
    change.value = false
  }
}

onMounted(() => {
  const auth = getAuth($firebaseApp)
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      return
    }
    const userId = user.uid
    const userRef = doc($firestore, 'users', userId).withConverter(
      userConverter
    )
    const userDoc = await getDoc(userRef)
    const userFetched = userDoc.data()
    if (userFetched) {
      username.value = userFetched.username
    }
  })
})

async function updateProfile() {
  loading.value = true
  const auth = getAuth($firebaseApp)
  try {
    if (auth.currentUser) {
      const userId = auth.currentUser.uid
      const userRef = doc($firestore, 'users', userId).withConverter(
        userConverter
      )
      await setDoc(userRef, { username: username.value }, { merge: true })
      $notifier({
        content: 'Profil mis à jour',
        color: 'main',
      })
    }
  } catch (error) {
    $notifier({
      content: 'Une erreur est survenue lors de la mise à jour de ton profil',
      color: 'error',
      error,
    })
  } finally {
    change.value = false
    loading.value = false
  }
}

async function logout() {
  loading.value = true
  const auth = getAuth($firebaseApp)
  try {
    await signOut(auth)
    await navigateTo('/')
  } catch (error) {
    $notifier({
      content: 'Une erreur est survenue lors de la déconnexion',
      color: 'error',
      error,
    })
  } finally {
    loading.value = false
  }
}
</script>
