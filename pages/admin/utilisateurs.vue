<template>
  <v-container>
    <v-table class="mt-4" :height="users.length > 13 ? '60vh' : ''">
      <thead>
        <tr>
          <th>E-mail</th>
          <th>Admin</th>
          <th>Ajouter</th>
          <th>Retirer</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.email }}</td>
          <td>{{ user.role?.admin ? 'Oui' : 'Non' }}</td>
          <td>
            <v-btn
              :icon="mdiCheck"
              :disabled="adding !== null || user.role?.admin"
              :loading="adding === user.id"
              color="success"
              variant="text"
              @click="addAdmin(user.id)"
            />
          </td>
          <td>
            <v-btn
              :icon="mdiClose"
              :disabled="removing !== null || !user.role?.admin"
              :loading="removing === user.id"
              color="error"
              variant="text"
              @click="removeAdmin(user.id)"
            />
          </td>
        </tr>
      </tbody>
    </v-table>
  </v-container>
</template>

<script lang="ts" async setup>
import { VContainer, VTable, VBtn } from 'vuetify/components'
import { mdiCheck, mdiClose } from '@mdi/js'
import { collection, getDocs } from 'firebase/firestore'
import { useFirebaseFunctions } from '~/composables/useFirebaseFunctions'
import { userConverter } from '~/stores'
import type { LocalUserType } from '~/stores'

definePageMeta({ layout: 'admin' })

const db = useFirestore()
const functions = useFirebaseFunctions()
const { notifier } = useNotifier()

const removing = ref<string | null>(null)
const adding = ref<string | null>(null)
const users = ref<LocalUserType[]>([])

onMounted(async () => {
  const usersRef = collection(db, 'users').withConverter(userConverter)
  const usersDocs = await getDocs(usersRef)
  if (!usersDocs.empty) {
    users.value = usersDocs.docs.map((doc) => doc.data())
  }
})

const addAdmin = async (id: string) => {
  adding.value = id

  try {
    await functions('addAdmin')({
      id,
      role: { admin: true },
    })
    notifier({ content: 'Admin ajouté', color: 'success' })
  } finally {
    adding.value = null
  }
}

const removeAdmin = async (id: string) => {
  removing.value = id

  try {
    await functions('removeAdmin')({ id })
    notifier({ content: 'Admin retiré', color: 'success' })
  } finally {
    removing.value = null
  }
}
</script>
