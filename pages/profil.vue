<template>
  <v-container align="center">
    <v-card max-width="500">
      <v-card-title class="text-left">
        <h2 class="text-h5">
          Mon profil
        </h2>
      </v-card-title>
      <v-card-text>
        <v-form @submit.prevent="updateProfile">
          <div class="d-flex">
            <InputsUsername v-model="username" :disabled="!change" variant="outlined" />
            <v-btn class="ml-2" icon="mdi-pencil" variant="text" @click="isChange()" />
          </div>
          <v-btn v-if="change" block type="submit" color="buttonBack" :loadind="loading">
            Modifier
          </v-btn>
        </v-form>
      </v-card-text>
      <v-divider />
      <v-card-title class="text-left">
        <h2 class="text-h5">
          Sortir du club
        </h2>
      </v-card-title>
      <v-card-text>
        <span>Tu vas nous manquer, reviens vite!</span>
        <v-btn class="mt-2" block color="buttonBack" :disabled="loading" @click="signOut">
          Se déconnecter
        </v-btn>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts"  setup>
const supabase = useSupabaseClient()
const user = useSupabaseUser()

const {$notifier} = useNuxtApp()

const loading = ref(false)
const change = ref(false)
const username = ref('')

function isChange() {
  if(!change.value) {
    change.value = true
  } else {
    change.value = false
  }
}

onMounted(() => {
  getProfile()
})

async function getProfile() {
  if (!user.value) {return}
  try {
			loading.value = true;
			const { data, error, status } = await supabase.from('profiles').select(`username`).eq('id', user.value.id).single();
			if (data) {
				username.value = data.username;
			}
			if (error && status !== 406) throw error;
		} catch (error) {
			if (error instanceof Error) {
				alert(error.message);
			}
		} finally {
			loading.value = false;
		}
}

async function updateProfile() {
  if (!user.value) {return}
  try {
    loading.value = true
    const { error } = await supabase.from('profiles').upsert({
      id: user.value.id,
      username: username.value,
      updated_at: new Date(),
    }, 
    {
      returning: 'minimal', // Don't return the value after inserting
    })
    $notifier({
            content: 'Profil mis à jour',
            color: 'main'
        })
    if (error) throw error
  } catch (error) {
    $notifier({
            content: 'Une erreur est survenue lors de la mise à jour de ton profil',
            color: 'main',
            error
        })
  } finally {
    change.value = false
    loading.value = false
  }
}

async function signOut() {
    try {
        loading.value = true
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        user.value = null
    } catch (error) {
        $notifier({
            content: 'Une erreur est survenue lors de la déconnexion',
            color: 'main',
            error
        })
    } finally {
        loading.value = false
        navigateTo('/')
    }
}
</script>