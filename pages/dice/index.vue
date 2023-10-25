<template>
  <div>
    <Head>
      <Title>Dice - ioTactile Games</Title>
      <Meta name="description" content="Menu du jeu dice" />
    </Head>
    <dice-template>
      <div class="d-flex justify-center align-center h-100">
        <v-card
          class="menu-wrapper"
          width="500"
          height="650"
          color="diceMainSecondary"
          rounded="lg"
          elevation="3"
        >
          <button v-if="menuPage" class="arrow-back">
            <v-icon :icon="mdiArrowLeftBold" size="60" @click="returnToPreviousPage(menuPage)" />
          </button>
          <div class="dice-logo text-center mt-10 mb-6">Dice</div>
          <div class="d-flex justify-center">
            <dice-menu-main v-if="menuPage === 0" @action="handleActions" />
            <dice-menu-play v-if="menuPage === 1" @action="handleActions" />
            <dice-menu-view-games v-if="menuPage === 1.1" />
            <dice-menu-new-game v-if="menuPage === 1.2" @action="handleActions" />
            <dice-menu-ranking v-if="menuPage === 2" />
            <dice-menu-results v-if="menuPage === 3" />
            <dice-menu-rules v-if="menuPage === 4" @action="handleActions" />
          </div>
        </v-card>
      </div>
    </dice-template>
  </div>
</template>

<script setup lang="ts">
import { VCard, VIcon } from 'vuetify/components'
import { mdiArrowLeftBold } from '@mdi/js'

const menuPage = ref<number>(0)

const actionMap: Record<string, number> = {
  play: 1,
  quickGame: 1.1,
  viewGames: 1.1,
  newGame: 1.2,
  ranking: 2,
  results: 3,
  rules: 4
}

const handleActions = (action: string) => {
  menuPage.value = actionMap[action] || 0
}

const returnToPreviousPage = (actualPage: number) => {
  if (actualPage >= 2) {
    menuPage.value = 0
  } else if (actualPage > 1) {
    menuPage.value = 1
  } else if (actualPage === 1) {
    menuPage.value = 0
  }
}
</script>

<style scoped lang="scss">
.menu-wrapper {
  position: relative;
}

.arrow-back {
  position: absolute;
  top: 58px;
  left: 20px;
}
</style>
