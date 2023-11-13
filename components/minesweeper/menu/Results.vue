<template>
  <div v-if="playerResults" class="difficulty-container">
    <div
      v-for="(difficulty, i) in ['beginner', 'intermediate', 'expert']"
      :key="i"
      class="difficulty-wrapper"
    >
      <button
        class="button-difficulty"
        @click="getDifficultyResults(difficulty)"
      >
        <h2>{{ getDifficultyName(difficulty) }}</h2>
        <v-icon :icon="mdiChevronDown" color="onSurface" />
      </button>
      <template v-if="isDifficulty(difficulty)">
        <template
          v-if="playerResults[difficulty as DifficultyType].victories > 0"
        >
          <div class="header d-flex justify-space-between">
            <div>Victoires</div>
            <div>Temps</div>
            <div>Date</div>
          </div>
          <div class="content d-flex justify-space-between">
            <div>
              {{ playerResults[difficulty as DifficultyType].victories }}
            </div>
            <div>
              {{
                timerFormatter(
                  playerResults[difficulty as DifficultyType].bestTime,
                  true
                )
              }}
            </div>
            <div>
              {{
                dateFormatter(
                  playerResults[difficulty as DifficultyType].victoryDate
                )
              }}
            </div>
          </div>
        </template>
        <template v-else>
          <div class="no-best-time">
            Aucune partie n'a été gagnée dans cette difficulté
          </div>
        </template>
      </template>
    </div>
  </div>
</template>

<script async setup lang="ts">
import { doc, getDoc } from 'firebase/firestore'
import { VIcon } from 'vuetify/components'
import { mdiChevronDown } from '@mdi/js'
import { timerFormatter, dateFormatter } from '~/utils'
import { mineSweeperScoreboardConverter } from '~/stores'

type DifficultyType = 'beginner' | 'intermediate' | 'expert'

const db = useFirestore()
const user = useCurrentUser()

const playerScoreboardRef = doc(
  db,
  'mineSweeperScoreboard',
  user.value!.uid
).withConverter(mineSweeperScoreboardConverter)
const playerScoreboardDoc = await getDoc(playerScoreboardRef)
const playerResults = playerScoreboardDoc.data()

const isBeginner = ref<boolean>(true)
const isIntermediate = ref<boolean>(true)
const isExpert = ref<boolean>(true)

const getDifficultyResults = (difficulty: string): void => {
  switch (difficulty) {
    case 'beginner':
      isBeginner.value = !isBeginner.value
      break
    case 'intermediate':
      isIntermediate.value = !isIntermediate.value
      break
    case 'expert':
      isExpert.value = !isExpert.value
      break
    default:
      break
  }
}

const getDifficultyName = (difficulty: string): string => {
  switch (difficulty) {
    case 'beginner':
      return 'Débutant'
    case 'intermediate':
      return 'Intermédiaire'
    case 'expert':
      return 'Expert'
    default:
      return ''
  }
}

const isDifficulty = (difficulty: string): boolean => {
  switch (difficulty) {
    case 'beginner':
      return isBeginner.value
    case 'intermediate':
      return isIntermediate.value
    case 'expert':
      return isExpert.value
    default:
      return false
  }
}
</script>

<style scoped lang="scss">
.difficulty-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  .difficulty-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;

    &:nth-child(even) {
      margin: 1rem 0;
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

    .content {
      width: 500px;
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

    .button-difficulty {
      display: grid;
      grid-template-columns: 1fr 2rem;
      align-items: center;
      width: 100%;
      height: 50px;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
      border-top: 4px solid rgb(var(--v-theme-mineSweeperMainSecondary));
      border-left: 4px solid rgb(var(--v-theme-mineSweeperMainSecondary));
      border-right: 4px solid rgb(var(--v-theme-mineSweeperMainTertiary));
      border-bottom: 4px solid rgb(var(--v-theme-mineSweeperMainTertiary));
      background-color: rgb(var(--v-theme-mineSweeperMainPrimary));

      h2 {
        text-transform: uppercase;
        font-size: 1.5rem;
        margin-left: 2rem;
        color: rgb(var(--v-theme-onSurface));
        font-family: 'Orbitron', sans-serif;
        font-weight: 400;
      }
    }

    .no-best-time {
      margin-top: 1rem;
      text-align: center;
      font-size: 1.25rem;
      font-family: 'Orbitron', sans-serif;
      color: rgb(var(--v-theme-mineSweeperOnSurface));
    }
  }
}
</style>
