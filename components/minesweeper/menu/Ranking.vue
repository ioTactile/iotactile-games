<template>
  <template v-if="menuPage === 2">
    <div class="d-flex flex-column">
      <button
        v-for="(item, i) in menuItems"
        :key="i"
        class="button-mineSweeper"
        @click="getRanking(item.action, item.value)"
      >
        {{ item.title }}
      </button>
    </div>
  </template>
  <template
    v-for="(difficulty, i) in ['beginner', 'intermediate', 'expert']"
    v-else
    :key="i"
  >
    <div v-if="menuPage === getRankingPage(i)">
      <div class="header d-flex justify-space-between">
        <div>Classement</div>
        <div>Joueur</div>
        <div>Temps</div>
      </div>
      <template v-if="isBestTime(difficulty)">
        <div class="content-wrapper">
          <div
            v-for="(player, j) in ranking"
            :key="j"
            class="content d-flex justify-space-between"
          >
            <div>{{ j + 1 }}</div>
            <div>{{ player.username }}</div>
            <div>
              {{ getFormattedTime(player, difficulty) }}
            </div>
          </div>
        </div>
      </template>
      <template v-else>
        <div class="no-best-time">
          Aucune partie n'a été gagnée dans cette difficulté
        </div>
      </template>
    </div>
  </template>
  <!-- <template v-if="menuPage === 2.4">
    <div />
  </template> -->
</template>

<script setup lang="ts">
import { collection, getDocs } from 'firebase/firestore'
import {
  mineSweeperScoreboardConverter,
  type LocalMineSweeperScoreboardType
} from '~/stores'
import { timerFormatter } from '~/utils'

type DifficultyType = 'beginner' | 'intermediate' | 'expert'

defineProps<{
  menuPage: number
}>()

const emit = defineEmits<{
  (e: 'action', value: string): void
}>()

const db = useFirestore()

const mineSweeperScoreboard = collection(
  db,
  'mineSweeperScoreboard'
).withConverter(mineSweeperScoreboardConverter)

const menuItems = [
  {
    title: 'Débutant',
    action: 'rankingBeginner',
    value: 'beginner'
  },
  {
    title: 'Intermédiaire',
    action: 'rankingIntermediate',
    value: 'intermediate'
  },
  {
    title: 'Expert',
    action: 'rankingExpert',
    value: 'expert'
  }
  // {
  //   title: 'Personnalisé',
  //   action: 'rankingCustom',
  //   value: 'custom'
  // }
]

const ranking = ref<LocalMineSweeperScoreboardType[]>([])

const getRanking = async (action: string, value: string) => {
  emit('action', action)
  if (ranking.value.length === 0) {
    const rankingDocs = await getDocs(mineSweeperScoreboard)
    ranking.value = rankingDocs.docs.map((doc) => doc.data())
  }
  if (value === 'custom') {
    ranking.value = ranking.value.filter((item) => item.custom)
    ranking.value.forEach((item) => {
      item.custom.sort((a, b) => a.bestTime - b.bestTime)
    })
  } else if (value === 'beginner') {
    ranking.value = ranking.value.filter((item) => item.beginner.victories > 0)
    ranking.value.sort((a, b) => a.beginner.bestTime - b.beginner.bestTime)
  } else if (value === 'intermediate') {
    ranking.value = ranking.value.filter(
      (item) => item.intermediate.victories > 0
    )
    ranking.value.sort(
      (a, b) => a.intermediate.bestTime - b.intermediate.bestTime
    )
  } else if (value === 'expert') {
    ranking.value = ranking.value.filter((item) => item.expert.victories > 0)
    ranking.value.sort((a, b) => a.expert.bestTime - b.expert.bestTime)
  }
}

const getRankingPage = (index: number): number => {
  return Number.parseFloat(`2.${index + 1}`)
}

const getFormattedTime = (
  player: LocalMineSweeperScoreboardType,
  difficulty: string
) => {
  const difficultyKey = difficulty as DifficultyType
  const time = player[difficultyKey].bestTime

  return timerFormatter(time, true)
}

const isBestTime = (difficulty: string): boolean => {
  return ranking.value.length > 0
    ? ranking.value.some(
        (item) => item[difficulty as DifficultyType].bestTime > 0
      )
    : false
}
</script>

<style scoped lang="scss">
.button-mineSweeper:nth-child(odd) {
  margin: 3rem 0;
}

.header {
  width: 500px;
  height: 40px;
  font-size: 1.25rem;
  font-family: 'Orbitron', sans-serif;
  color: rgb(var(--v-theme-onSurfaceButton));
  background-color: rgb(var(--v-theme-mineSweeperMainSecondary));

  div {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.content-wrapper {
  height: 400px;
  width: 500px;
  overflow-y: auto;
  .content {
    height: 50px;
    font-size: 1.25rem;
    font-family: 'Orbitron', sans-serif;
    color: rgb(var(--v-theme-onSurfaceButton));
    background-color: rgb(var(--v-theme-mineSweeperMainPrimary));

    div {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
  .content:nth-child(even) {
    background-color: rgb(var(--v-theme-mineSweeperMainSecondary));
  }
}

.no-best-time {
  margin-top: 1rem;
  text-align: center;
  font-size: 1.25rem;
  font-family: 'Orbitron', sans-serif;
  color: rgb(var(--v-theme-mineSweeperOnSurface));
}

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: rgb(var(--v-theme-mineSweeperMainBackground));
  border-radius: 0;
}
</style>
