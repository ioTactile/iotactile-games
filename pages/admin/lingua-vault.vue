<template>
  <v-container>
    <div
      class="d-flex flex-column flex-sm-row justify-space-between align-center mt-2"
    >
      <h2 class="mb-2 mb-sm-0">Lingua Vault</h2>
      <v-form ref="form" class="d-flex align-center">
        <v-text-field
          v-model="newWord"
          label="Ajouter un mot"
          :rules="[(v) => !!v || 'Ce champ est requis']"
          variant="outlined"
          hide-details
          density="compact"
          class="text-field mr-2"
        />
        <v-btn color="tertiary" :loading="loading" @click="addWord">
          Ajouter
        </v-btn>
      </v-form>
    </div>
    <v-table class="mt-4" :height="words.length > 13 ? '60vh' : ''">
      <thead>
        <tr>
          <th>Mot</th>
          <th>Difficulté</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="word in words" :key="word.id">
          <td>{{ word.word }}</td>
          <td>{{ word.difficulty }}</td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts" setup>
import { VContainer, VTable, VTextField, VBtn, VForm } from 'vuetify/components'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { type Word } from '~/functions/src/types'
import { linguaVaultWordsConverter } from '~/stores'

definePageMeta({ layout: 'admin' })

const db = useFirestore()
const { notifier } = useNotifier()

const wordsRef = doc(
  db,
  'linguaVaultWords',
  'AI8rozWXYEmchhc1pwar' as string,
).withConverter(linguaVaultWordsConverter)

const loading = ref(false)
const form = ref<VForm>()
const words = ref<Word[]>([])
const newWord = ref<string>('')

onMounted(async () => {
  const wordsDocs = await getDoc(wordsRef)
  if (wordsDocs.exists()) {
    words.value = wordsDocs.data().words
  }
})

const addWord = async () => {
  if (!newWord.value || !(await form.value?.validate())?.valid) {
    return
  }

  if (words.value.find((w) => w.word === newWord.value)) {
    notifier({ content: 'Ce mot existe déjà', color: 'error' })
    return
  }

  loading.value = true

  const values = {
    words: [
      ...words.value,
      {
        id: (words.value.length || 0) + 1,
        word: newWord.value,
        difficulty: 1000,
      },
    ],
  }

  try {
    await updateDoc(wordsRef, values)
    words.value = values.words
  } finally {
    newWord.value = ''
    loading.value = false
  }
}
</script>

<style scoped>
.text-field {
  min-width: 200px;
}
</style>
