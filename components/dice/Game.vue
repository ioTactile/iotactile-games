<template>
  <v-container v-if="session">
    <v-row>
      <v-col cols="9" />
      <v-col cols="3">
        <div v-for="(player, i) in session.players" :key="i" class="d-flex justify-space-between text-h6">
          <span>Joueur {{ i + 1 }}:</span>
          <span>{{ player.username }}</span>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup async>
import { collection, doc } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'
import { diceSessionConverter } from '~/stores'

const db = useFirestore()
const route = useRoute()

const sessionId = route.params.id
const sessionRef = doc(db, 'diceSessions', sessionId).withConverter(diceSessionConverter)
console.log(sessionRef)
const session = useDocument(doc(collection(db, 'diceSessions'), sessionId))
</script>
