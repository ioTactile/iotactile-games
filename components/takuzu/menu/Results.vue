<template>
  <div class="results-container">
    <div v-for="(size, i) in results" :key="i">
      <div class="header">
        <div>Grilles {{ sizeFormatter(i) }}</div>
      </div>
      <div class="content">
        <div v-for="(difficulty, j) in size" :key="j" class="difficulty">
          {{ difficulty.victories }}
        </div>
      </div>
    </div>
  </div>
</template>

<script async setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'
// import { timerFormatter, dateFormatter } from '~/utils'
import { takuzuScoreboardConverter } from '~/stores'
import type { TakuzuVictory } from '~/functions/src/types'

interface SizeBoard {
  easy: TakuzuVictory
  medium: TakuzuVictory
  hard: TakuzuVictory
  expert: TakuzuVictory
}

const db = useFirestore()
const user = useCurrentUser()

const playerScoreboardRef = doc(
  db,
  'takuzuScoreboard',
  user.value!.uid
).withConverter(takuzuScoreboardConverter)

onMounted(async () => {
  const playerScoreboardDoc = await getDoc(playerScoreboardRef)
  const playerResults = playerScoreboardDoc.data()
  if (!playerResults) return

  results.value = [
    playerResults.sixBySix,
    playerResults.eightByEight,
    playerResults.tenByTen,
    playerResults.twelveByTwelve
  ]
})

const results = ref<SizeBoard[]>([])

const sizeFormatter = (value: number) => {
  const sizes = ['6 x 6', '8 x 8', '10 x 10', '12 x 12']
  return sizes[value]
}
</script>

<style scoped lang="scss"></style>
