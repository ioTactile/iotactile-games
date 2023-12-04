<template>
  <div class="results-container">
    <div v-for="(size, i) in scoreboard" :key="i" class="result">
      <div class="header">
        <div>Grilles {{ sizeFormatter(i) }}</div>
      </div>
      <div class="content">
        <div
          v-for="(_, j) in size"
          :key="j"
          class="difficulty"
          :style="difficultyBackgroundColorStyle(j)"
          @click="setSelectResults(i, j)"
        >
          {{ numPlayers(i, j) }}
        </div>
      </div>
    </div>
    <template v-if="selectResults.length > 0">
      <div class="players-result">
        <div class="players-result_header">
          <div class="header">Classement</div>
          <div class="header">Joueur</div>
          <div class="header">Temps</div>
        </div>
        <div class="players-result_wrapper">
          <div
            v-for="(player, k) in selectResults"
            :key="k"
            class="players-result_content"
          >
            <div class="content">{{ k + 1 }}</div>
            <div class="content">{{ usernames[k] }}</div>
            <div class="content">
              {{ timerFormatter(player.bestTime, true) }}
            </div>
          </div>
        </div>
        <div class="back-wrapper">
          <button class="back" @click="backToRanking">Retour</button>
        </div>
      </div>
    </template>
    <template v-if="isNotResults === true">
      <span class="no-best-time">
        Aucune partie n'a été gagnée dans cette difficulté
      </span>
    </template>
  </div>
</template>

<script async setup lang="ts">
import { collection, getDocs } from 'firebase/firestore'
import { takuzuScoreboardConverter } from '~/stores'
import { timerFormatter } from '~/utils'

type TakuzuVictory = {
  victories: number
  bestTime: number
  victoryDate: Date
}

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert'

interface SizeBoard {
  easy: TakuzuVictory
  medium: TakuzuVictory
  hard: TakuzuVictory
  expert: TakuzuVictory
}

interface PlayerScoreboard {
  username: string
  scoreboard: SizeBoard[]
}

const db = useFirestore()

const playerScoreboardRef = collection(db, 'takuzuScoreboard').withConverter(
  takuzuScoreboardConverter
)

onMounted(async () => {
  const playerScoreboardDoc = await getDocs(playerScoreboardRef)

  const playersScoreboardData = playerScoreboardDoc.docs.map((doc) =>
    doc.data()
  )
  if (!playersScoreboardData) return

  playersScoreboard.value = playersScoreboardData.map((playerScoreboard) => ({
    username: playerScoreboard.username,
    scoreboard: [
      playerScoreboard.sixBySix,
      playerScoreboard.eightByEight,
      playerScoreboard.tenByTen,
      playerScoreboard.twelveByTwelve
    ]
  }))
})

const playersScoreboard = ref<PlayerScoreboard[]>([])
const selectResults = ref<TakuzuVictory[]>([])
const usernames = ref<string[]>([])
const isNotResults = ref<boolean>(false)

const scoreboard = [
  {
    easy: {},
    medium: {},
    hard: {},
    expert: {}
  },
  {
    easy: {},
    medium: {},
    hard: {},
    expert: {}
  },
  {
    easy: {},
    medium: {},
    hard: {},
    expert: {}
  },
  {
    easy: {},
    medium: {},
    hard: {},
    expert: {}
  }
]

const setSelectResults = (size: number, difficulty: Difficulty): void => {
  const players = playersScoreboard.value.map(
    (sizeBoard) => sizeBoard.scoreboard[size][difficulty]
  )

  const filteredPlayers = players
    .filter((player) => player.bestTime > 0)
    .sort((a, b) => a.bestTime - b.bestTime)

  selectResults.value = filteredPlayers

  usernames.value = getUsernames(size, difficulty)

  if (filteredPlayers.length > 0) {
    isNotResults.value = false
  } else {
    isNotResults.value = true
  }
}

const getUsernames = (size: number, difficulty: Difficulty): string[] => {
  const usernames = playersScoreboard.value
    .map((playerScoreboard) => playerScoreboard.username)
    .sort((a, b) => {
      const playerA = playersScoreboard.value.find(
        (playerScoreboard) => playerScoreboard.username === a
      )
      const playerB = playersScoreboard.value.find(
        (playerScoreboard) => playerScoreboard.username === b
      )

      const playerAScore = playerA!.scoreboard[size][difficulty]
      const playerBScore = playerB!.scoreboard[size][difficulty]

      if (playerAScore.bestTime === 0) return 1
      if (playerBScore.bestTime === 0) return -1

      return playerAScore.bestTime - playerBScore.bestTime
    })

  return usernames
}

const sizeFormatter = (value: number): string => {
  const sizes = ['6 x 6', '8 x 8', '10 x 10', '12 x 12']
  return sizes[value]
}

const difficultyBackgroundColorStyle = (value: string): string => {
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
    default:
      return ''
  }
}

const numPlayers = (size: number, difficulty: Difficulty): number => {
  const players = playersScoreboard.value.map(
    (sizeBoard) => sizeBoard.scoreboard[size][difficulty]
  )

  const filteredPlayers = players.filter((player) => player.bestTime > 0)

  return filteredPlayers.length
}

const backToRanking = (): void => {
  selectResults.value = []
  usernames.value = []
}
</script>

<style scoped lang="scss">
.results-container {
  position: relative;
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
    color: #000000;
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
      }
    }
  }

  .players-result_wrapper {
    position: relative;
    overflow-y: auto;
  }

  .players-result {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
    background-color: rgb(var(--v-theme-takuzuMainShadow));
    width: 100%;
    height: 100%;

    .back-wrapper {
      align-self: center;
      margin-top: auto;

      .back {
        width: 150px;
        padding: 0.5rem 1rem;
        margin: 0.5rem 0;
        font-size: 1rem;
        font-weight: 700;
        border-radius: 20px;
        background-color: rgb(var(--v-theme-takuzuMainOnSurface));
        color: #ffffff;
        border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
        box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
        font-family: 'JetBrains Mono', monospace;
        transition: all 0.2s ease-in-out;

        @media screen and (max-width: 600px) {
          width: 70vw;
          padding: 0.25rem 0.5rem;
        }
      }
    }

    .players-result_header,
    .players-result_content {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;

      .header,
      .content {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgb(var(--v-theme-takuzuMainOnSurface));
      }
    }

    .players-result_header {
      height: 40px;
      background-color: rgb(var(--v-theme-takuzuMainPrimary));
    }

    .players-result_content {
      height: 50px;
      background-color: rgb(var(--v-theme-takuzuMainTertiary));

      &:nth-child(even) {
        background-color: rgb(var(--v-theme-takuzuMainPrimary));
      }
    }
  }

  .no-best-time {
    text-align: center;
    font-family: 'JetBrains Mono', monospace;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
  }
}
</style>
