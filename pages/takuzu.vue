<template>
  <takuzu-template>
    <div class="d-flex justify-center align-center h-100">
      <template v-if="menuPage !== 5">
        <div class="menu-wrapper">
          <Tooltip
            content="Retour (esc)"
            position="top right"
            :slot-height="40"
            :slot-width="40"
            class="arrow-back"
            @on-click="returnToPreviousPage(menuPage)"
          >
            <template #activator="{ onMouseover, onMouseleave, onClick }">
              <button
                v-if="menuPage"
                @click="onClick"
                @mouseover="onMouseover"
                @mouseleave="onMouseleave"
              >
                <img src="/takuzu/ui/arrow-left.svg" alt="Retour" />
              </button>
            </template>
          </Tooltip>
          <h1 class="game-title mt-10 mb-6">Takuzu</h1>
          <div class="menu-content">
            <takuzu-menu-main v-if="menuPage === 0" @action="handleActions" />
            <takuzu-menu-play
              v-if="menuPage === 1"
              @start-game="startGameHandler"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="game-page">
          <Tooltip
            content="Retour (esc)"
            position="top right"
            :slot-height="35"
            :slot-width="35"
            class="arrow-back"
            @on-click="returnToPreviousPage(menuPage)"
          >
            <template #activator="{ onMouseover, onMouseleave, onClick }">
              <button
                @click="onClick"
                @mouseover="onMouseover"
                @mouseleave="onMouseleave"
              >
                <img src="/takuzu/ui/arrow-left.svg" alt="Retour" />
              </button>
            </template>
          </Tooltip>
          <h1 class="game-title">Takuzu</h1>
          <div class="game-board">
            <takuzu-game-board :options="gameOptions" />
          </div>
        </div>
      </template>
    </div>
  </takuzu-template>
</template>

<script setup lang="ts">
import type { GameOptions } from '~/utils/takuzu/types'

if (process.client) {
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      returnToPreviousPage(menuPage.value)
    }
  })
}

const menuPage = ref<number>(0)
const gameOptions = ref<GameOptions>({
  boardSize: 6,
  difficulty: 'easy'
})

const actionMap: Record<string, number> = {
  play: 1,
  ranking: 2,
  rankingBeginner: 2.1,
  rankingIntermediate: 2.2,
  rankingExpert: 2.3,
  rankingCustom: 2.4,
  results: 3,
  rules: 4,
  gameBoard: 5
}

const handleActions = (action: string): void => {
  menuPage.value = actionMap[action] || 0
}

const returnToPreviousPage = (actualPage: number): void => {
  if (actualPage > 2 && actualPage < 3) {
    menuPage.value = 2
  } else {
    menuPage.value = 0
  }
}

const startGameHandler = (options: GameOptions): void => {
  menuPage.value = 5
  gameOptions.value = options
}
</script>

<style scoped lang="scss">
.menu-wrapper {
  position: relative;
  width: 500px;
  height: 650px;
  border-radius: 20px;
  background-color: rgb(var(--v-theme-takuzuMainSurface));
  box-shadow: -10px -10px rgba(var(--v-theme-takuzuMainShadow), 0.3);
  color: rgb(var(--v-theme-onSurface));

  .menu-content {
    display: flex;
    justify-content: center;
  }

  .game-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    text-align: center;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
  }

  .arrow-back {
    position: absolute;
    top: 58px;
    left: 20px;

    img {
      width: 40px;
      height: 40px;
    }
  }
}

.game-page {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 1100px;
  height: 700px;
  padding: 2rem;
  border-radius: 20px;
  background-color: rgb(var(--v-theme-takuzuMainSurface));
  box-shadow: -10px -10px rgba(var(--v-theme-takuzuMainShadow), 0.3);
  color: rgb(var(--v-theme-onSurface));

  .game-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 3rem;
    font-weight: 700;
    letter-spacing: 0.1rem;
    text-transform: uppercase;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
  }

  .game-board {
    display: flex;
    justify-content: center;
    overflow: auto;
    width: 100%;
    height: 100%;
    margin: 1rem auto;
  }

  .arrow-back {
    position: absolute;
    top: 48px;
    left: 400px;

    img {
      width: 40px;
      height: 40px;
    }
  }
}
</style>
