<template>
  <div>
    <Head>
      <Title>Contact - ioTactile Games</Title>
      <Meta name="description" content="Page pour me contacter" />
    </Head>
    <v-container class="container text-h6">
      <h3 class="text-h3">
        Contact
      </h3>
      <v-form ref="form" class="mt-10" @submit.prevent="sendMail">
        <v-row>
          <v-col cols="12" md="6">
            <v-text-field
              v-model="contact.name"
              label="Nom"
              :rules="rules.name"
              variant="outlined"
            />
          </v-col>
          <v-col cols="12" md="6">
            <InputsEmail
              v-model="contact.email"
              variant="outlined"
              icon
            />
          </v-col>
          <v-col cols="12" class="pt-0">
            <v-textarea
              v-model="contact.message"
              :rules="rules.message"
              label="Message"
              variant="outlined"
              rows="5"
              cols="5"
            />
          </v-col>
          <v-col cols="12" class="text-end ">
            <template v-if="!isSended">
              <v-btn
                :loading="loading"
                type="submit"
                color="tertiary"
                class="mr-2"
              >
                Envoyer
              </v-btn>
            </template>
            <template v-else>
              <v-alert type="success">
                Votre message a bien été envoyé !
              </v-alert>
            </template>
          </v-col>
        </v-row>
      </v-form>
    </v-container>
  </div>
</template>

<script lang="ts" setup>
import { VContainer, VForm, VRow, VCol, VAlert, VTextField, VTextarea, VBtn } from 'vuetify/components'

// Composable

const functions = useFirebaseFunctions()
const { notifier } = useNotifier()

// Refs

const form = ref(VForm)
const isSended = ref(false)
const loading = ref(false)
const subject = ref('')
const text = ref('')
const contact = ref({
  name: undefined,
  email: undefined,
  message: undefined
})

// Methods

const rules = {
  name: [
    (v: string) => !!v || 'Le nom est requis',
    (v: string) => v.length <= 50 || 'Le nom ne doit pas dépasser 50 caractères'
  ],
  message: [
    (v: string) => !!v || 'Le message est requis',
    (v: string) => v.length <= 500 || 'Le message ne doit pas dépasser 500 caractères'
  ]
}

const sendMail = async () => {
  if (!(await form.value.validate())?.valid) { return }
  loading.value = true
  subject.value = `Nouveau message de ${contact.value.name}`
  text.value = `Email : ${contact.value.email}\nMessage :\n${contact.value.message}`

  try {
    await functions('sendContact')({
      sender: contact.value.email,
      subject: subject.value,
      text: text.value
    })

    isSended.value = true
  } finally {
    if (isSended.value === false) {
      notifier({ content: 'Une erreur est survenue lors de l\'envoi du message', color: 'error' })
    } else {
      subject.value = ''
      text.value = ''
      contact.value = {
        name: undefined,
        email: undefined,
        message: undefined
      }
    }
    loading.value = false
  }
}
</script>

<style scoped>
.container {
  max-width: 726px;
}
</style>
