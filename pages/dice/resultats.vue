<template>
  <v-container>
    <v-row>
      <v-divider class="mb-4" />
      <v-col>
        <v-table v-if="player">
          <thead>
            <tr>
              <th class="text-center">
                Nombre de parties
              </th>
              <th class="text-center">
                Nombre de victoire
              </th>
              <th class="text-center">
                Pourcentage de victoire
              </th>
              <th class="text-center">
                Score le plus haut
              </th>
              <th class="text-center">
                Score moyen
              </th>
              <th class="text-center">
                Score total
              </th>
              <th class="text-center">
                Nombre de 5 identiques
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-center">
                {{ player.games }}
              </td>
              <td class="text-center">
                {{ player.victories }}
              </td>
              <td class="text-center">
                {{ numberFormatter(player.victories / player.games * 100) || 0 }}%
              </td>
              <td class="text-center">
                {{ player.maxScore }}
              </td>
              <td class="text-center">
                {{ numberFormatter(player.averageScore) }}
              </td>
              <td class="text-center">
                {{ player.totalScore }}
              </td>
              <td class="text-center">
                {{ player.dice }}
              </td>
            </tr>
          </tbody>
        </v-table>
        <h3 v-else class="text-h6 text-sm-h5 text-center">
          Vous n'avez pas encore joué à ce jeu.
        </h3>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup async>
import { VContainer, VRow, VCol, VDivider, VTable } from 'vuetify/components'
import { doc, getDoc } from 'firebase/firestore'
import { diceScoreboardConverter, LocalDiceScoreboardType } from '~/stores'

// Vuefire

const db = useFirestore()
const user = useCurrentUser()

// Refs

const player = ref<LocalDiceScoreboardType>()

// onMounted

onMounted(async () => {
  if (!user.value) { return }
  const playerRef = doc(db, 'diceScoreboard', user.value.uid).withConverter(diceScoreboardConverter)
  const playerDoc = await getDoc(playerRef)
  if (!playerDoc.exists()) { return }
  player.value = playerDoc.data()
})

// Methods

const numberFormatter = (value: number) => {
  return value.toFixed(2)
}

</script>
