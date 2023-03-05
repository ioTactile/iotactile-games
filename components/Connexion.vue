<template>
  <v-dialog
    width="500"
    class="ma-0"
    :model-value="modelValue"
    :persistent="loading !== null"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="d-flex align-center">
        <h2 class="text-h5 mr-auto">
          Mon compte
        </h2>
        <v-btn
          icon="mdi-close"
          variant="text"
          :disabled="loading !== null" 
          @click="emits('update:modelValue', false)"
        />
      </v-card-title>
      <v-card-text>
        <v-form ref="form" @submit.prevent="login">
          <InputsEmail v-model="email" variant="outlined" icon />
          <template v-if="!forgotPassword">
            <InputsUsername v-if="createAccount" v-model="username" variant="outlined" icon />
            <InputsPassword
              v-if="!createAccount"
              v-model="password"
              variant="outlined"
            />
            <InputsPasswordFirst
              v-else
              v-model="password"
              variant="outlined"
              not-in-line
            />
          </template>

          <v-btn
            v-if="!createAccount"
            class="mb-2"
            variant="text"
            @click="forgotPassword = !forgotPassword"
          >
            {{ forgotPassword ? 'Connexion' : 'Mot de passe oublié' }}
          </v-btn>

          <v-btn
            block
            color="buttonBack"
            type="submit"
            :disabled="loading !== null && loading !== 'email'"
            :loading="loading === 'email'"
          >
            {{
              createAccount
                ? 'M\'inscire'
                : forgotPassword
                  ? 'Réinitialiser mon mot de passe'
                  : 'Connexion'
            }}
          </v-btn>
        </v-form>
      </v-card-text>
      <v-divider />
      <template v-if="!createAccount"> 
        <v-card-title>
          <h2 class="text-h5">
            Nouvel arrivant
          </h2>
        </v-card-title>
        <v-card-text class="text-center">
          <span>N'attends plus est rejoint le club</span>
          <v-btn
            class="mt-2"
            color="buttonBack"
            block
            :disabled="loading !== null"
            @click="createAccount = true"
          >
            Créer un compte
          </v-btn>
        </v-card-text>
      </template>
      <template v-else>
        <v-card-title>
          <h2 class="text-h5">
            Déjà membre
          </h2>
        </v-card-title>
        <v-card-text class="text-center">
          <span>Connectes toi pour rentrer dans le club</span>
          <v-btn
            class="mt-2"
            color="buttonBack"
            block
            :disabled="loading !== null"
            @click="createAccount = false"
          >
            Connexion
          </v-btn>
        </v-card-text>
      </template>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { VForm } from 'vuetify/components'
const supabase = useSupabaseClient()

const {$notifier} = useNuxtApp()

defineProps<{
    modelValue: boolean
}>()

const emits = defineEmits<{(e: 'update:modelValue', value: boolean): void}>()

const email = ref('')
const username = ref('')
const password = ref('')
const createAccount = ref(false)
const forgotPassword = ref(false)
const loading = ref<'email' | null>(null)
const form = ref<VForm>()

async function login() {
    if(!(await form.value?.validate())?.valid) {return}
    loading.value = 'email'
    try {
        if(createAccount.value) {
            const { error } = await supabase.auth.signUp({
            email: email.value,
            password: password.value,
            options: {
                data: {
                    username: username.value
                }
            }
            })
            if (error) throw error
        } else if(forgotPassword.value) {
            await supabase.auth.resetPasswordForEmail(email.value)
        } else {
            const {error} = await supabase.auth.signInWithPassword({
                email: email.value,
                password: password.value
            })
            if(error) throw error
        }
    } catch (error) {
        $notifier({
            content: 'Une erreur est survenue',
            color: 'main',
            error
        })
    } finally {
        loading.value = null 
        emits('update:modelValue', false) 
    }
}
</script>