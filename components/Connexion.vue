<template>
  <v-dialog
    width="500"
    :model-value="modelValue"
    :persistent="loading !== null"
    @update:model-value="emits('update:modelValue', $event)"
  >
    <v-card color="surface">
      <v-card-title class="d-flex align-center">
        <span class="mr-auto"> Viens t'amuser! </span>
        <v-btn
          :icon="mdiClose"
          variant="text"
          :disabled="loading !== null"
          @click="emits('update:modelValue', false)"
        />
      </v-card-title>
      <v-tabs v-model="tab" grow>
        <v-tab
          value="one"
          class="text-capitalize"
          @click="createAccount = false"
        >
          Connexion
        </v-tab>
        <v-tab
          value="two"
          class="text-capitalize"
          @click="createAccount = true"
        >
          Inscription
        </v-tab>
      </v-tabs>
      <v-card-text>
        <v-form ref="form" @submit.prevent="login">
          <v-window v-model="tab">
            <v-window-item value="one">
              <template v-if="!createAccount">
                <InputsEmail
                  v-model="email"
                  variant="outlined"
                  icon
                  class="my-2"
                  name="email"
                />
                <InputsPassword
                  v-if="!forgotPassword"
                  v-model="password"
                  variant="outlined"
                  @press-enter="login"
                />
              </template>
              <div class="d-flex justify-center mb-10">
                <v-btn variant="text" @click="forgotPassword = !forgotPassword">
                  {{ forgotPassword ? "Retour" : "Mot de passe oublié" }}
                </v-btn>
              </div>
            </v-window-item>

            <v-window-item value="two">
              <template v-if="createAccount">
                <InputsUsername
                  v-model="username"
                  variant="outlined"
                  icon
                  name="username"
                  class="mt-2"
                />
                <InputsEmail
                  v-model="email"
                  variant="outlined"
                  icon
                  name="createEmail"
                  class="my-2"
                />
                <InputsPasswordFirst v-model="password" variant="outlined" />
              </template>
            </v-window-item>
          </v-window>
          <v-btn
            block
            color="primary"
            class="text-onPrimary"
            type="submit"
            :disabled="loading !== null && loading !== 'email'"
            :loading="loading === 'email'"
          >
            {{
              createAccount
                ? "M'inscire"
                : forgotPassword
                  ? "Réinitialiser mon mot de passe"
                  : "Connexion"
            }}
          </v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import {
  VForm,
  VDialog,
  VCard,
  VCardTitle,
  VCardText,
  VBtn,
  VWindow,
  VWindowItem,
  VTabs,
  VTab,
} from "vuetify/components";
import { mdiClose } from "@mdi/js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  AuthErrorCodes,
  getIdTokenResult,
} from "firebase/auth";
import { FirebaseError } from "@firebase/util";
import { Timestamp, doc, setDoc } from "firebase/firestore";
import { useFirestore, useFirebaseAuth } from "vuefire";
import { storeToRefs } from "pinia";
import { useUserStore } from "~/stores/user";
import { userConverter } from "~/stores";

// Composable & Vuefire

const { notifier } = useNotifier();
const db = useFirestore();
const auth = useFirebaseAuth();

// Props

defineProps<{
  modelValue: boolean;
}>();

// Emits

const emits = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

// Refs

const email = ref("");
const username = ref("");
const password = ref("");
const date = ref(new Date(Date.now()));
const createAccount = ref(false);
const forgotPassword = ref(false);
const loading = ref<"email" | null>(null);
const form = ref<VForm>();
const tab = ref(null);

const userStore = useUserStore();
const { currentUser, adminClaims } = storeToRefs(userStore);

// Methods

const login = async () => {
  if (!auth || !(await form.value?.validate())?.valid) {
    return;
  }
  loading.value = "email";

  try {
    if (createAccount.value) {
      createUserWithEmailAndPassword(auth, email.value, password.value).then(
        (credentials) => {
          const userRef = doc(db, "users", credentials.user.uid).withConverter(
            userConverter,
          );
          setDoc(
            userRef,
            {
              id: credentials.user.uid,
              email: email.value,
              username: username.value,
              creationDate: Timestamp.fromDate(date.value),
              updateDate: Timestamp.now(),
            },
            { merge: true },
          );
        },
      );
      notifier({ content: "Inscription réussie", color: "success" });
    } else if (forgotPassword.value) {
      await sendPasswordResetEmail(auth, email.value);
      notifier({
        content: "Un email de réinitialisation a été envoyé",
        color: "success",
      });
      forgotPassword.value = false;
    } else {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email.value,
        password.value,
      );

      currentUser.value = userCredentials.user;
      const { claims } = await getIdTokenResult(currentUser.value, true);
      adminClaims.value = claims.admin ?? false;
    }
    emits("update:modelValue", false);
  } catch (error: unknown) {
    if (!(error instanceof FirebaseError)) {
      throw error;
    }
    let errMessage;
    switch (error.code) {
      case AuthErrorCodes.EMAIL_EXISTS:
        errMessage = "Adresse mail déjà utilisée";
        break;
      case AuthErrorCodes.USER_DELETED:
        errMessage = "Utilisateur supprimé";
        break;
      case AuthErrorCodes.INVALID_PASSWORD:
        errMessage = "Mot de passe incorrect";
        break;
      default:
        errMessage = "Une erreur est survenue";
        break;
    }
    notifier({ content: errMessage, color: "error", error });
  } finally {
    loading.value = null;
  }
};
</script>

<style scoped lang="scss">
.v-card-title {
  font-size: 1.5rem;
  color: rgb(var(--v-theme-text-onSurface));
}
</style>
