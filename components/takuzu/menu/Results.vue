<template>
  <div class="results-container">
    <div v-for="(size, i) in results" :key="i" class="result">
      <div class="header">
        <div>Grilles {{ sizeFormatter(i) }}</div>
      </div>
      <div class="content">
        <div
          v-for="(difficulty, j) in size"
          :key="j"
          class="difficulty"
          :style="difficultyBackgroundColorStyle(j)"
        >
          {{ difficulty.victories }}

          <div v-if="difficulty.bestTime > 0" class="time">
            {{ timerFormatter(difficulty.bestTime, true) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script async setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import { timerFormatter } from '~/utils'
import { takuzuScoreboardConverter } from '~/stores'

type TakuzuVictory = {
  victories: number
  bestTime: number
  victoryDate: Date
}

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

const difficultyBackgroundColorStyle = (value: string) => {
  const colors = ['#4CAF50', '#3F51B5', '#FF9800', '#F44336']
  switch (value) {
    case 'easy':
      return `background-color: ${colors[0]}`
    case 'medium':
      return `background-color: ${colors[1]}`
    case 'hard':
      return `background-color: ${colors[2]}`
    case 'expert':
      return `background-color: ${colors[3]}`
  }
}
</script>

<style scoped lang="scss">
.results-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  width: 100%;

  .result {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: rgb(var(--v-theme-takuzuMainShadow));
    width: 100%;
    padding: 0.5rem 1rem;

    .header {
      text-align: center;
      margin-bottom: 0.5rem;
    }

    .content {
      display: flex;
      align-items: center;
      justify-content: center;

      .difficulty {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 35px;
        height: 35px;
        border-radius: 50%;
        font-weight: 700;
        font-size: 0.85rem;
        margin: 0 0.5rem;
        cursor: pointer;

        &:hover {
          .time {
            display: block;
          }
        }

        .time {
          display: none;
          position: absolute;
          top: -35px;
          left: -17.5px;
          background-color: #ffffff;
          border-radius: 8px;
          padding: 0.25rem 0.5rem;
          font-weight: 500;
        }
      }
    }
  }
}
</style>
