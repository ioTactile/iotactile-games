<template>
  <v-container>
    <v-row>
      <v-divider class="mb-4" />
      <v-col cols="12">
        <v-table>
          <thead>
            <tr>
              <th class="text-center">
                Classement
              </th>
              <th class="text-center">
                Nom
              </th>
              <th class="text-center">
                Nombre de victoire
              </th>
              <th class="text-center">
                Score le plus haut
              </th>
              <th class="text-center">
                Nombre de 5 identiques
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(player, i) in scoreboard" :key="i">
              <td class="d-flex justify-center align-center">
                <v-img
                  v-if="i < 3"
                  :src="medal(i)"
                  alt="medal"
                  width="40"
                  height="40"
                />
                <span v-else>{{ i + 1 }}</span>
              </td>
              <td class="text-center">
                {{ player.username }}
              </td>
              <td class="text-center">
                {{ player.victories }}
              </td>
              <td class="text-center">
                {{ player.maxScore }}
              </td>
              <td class="text-center">
                {{ player.dice }}
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { VContainer, VDivider, VRow, VCol, VTable, VImg } from 'vuetify/components'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { diceScoreboardConverter } from '~/stores'

// Vuefire

const db = useFirestore()

// Firestore

const scoreboardRef = collection(db, 'diceScoreboard').withConverter(diceScoreboardConverter)
const scoreboardQuery = query(scoreboardRef, orderBy('victories', 'desc'))
const scoreboardDocs = await getDocs(scoreboardQuery)
const scoreboard = scoreboardDocs.docs.map(doc => doc.data())

// Methods

const medal = (i: number) => {
  if (i === 0) { return '/medals/gold-medal.png' }
  if (i === 1) { return '/medals/silver-medal.png' }
  if (i === 2) { return '/medals/bronze-medal.png' }
  return ''
}
</script>
