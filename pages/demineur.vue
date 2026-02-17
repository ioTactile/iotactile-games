<template>
  <minesweeper-template>
    <div class="container">
      <template v-if="menuPage !== 5">
        <div class="menu-page">
          <div class="menu__header">
            <Tooltip
              v-if="menuPage"
              content="Retour (esc)"
              position="top right"
              :slot-height="40"
              :slot-width="40"
              class="button-back"
              @on-click="returnToPreviousPage(menuPage)"
            >
              <template #activator="{ onMouseover, onMouseleave, onClick }">
                <button
                  @click="onClick"
                  @mouseover="onMouseover"
                  @mouseleave="onMouseleave"
                >
                  <img :src="getArrowBackColor" alt="Retour" />
                </button>
              </template>
            </Tooltip>
            <div v-else class="void" />
            <h1 class="title">Démineur</h1>
            <div class="void" />
          </div>
          <div class="menu__content">
            <minesweeper-menu v-if="menuPage === 0" @action="handleActions" />
            <minesweeper-menu-play
              v-if="menuPage === 1"
              :is-custom="isCustom"
              @start-game="startGame"
              @is-custom="toggleIsCustom"
              @action="handleActions"
            />
            <minesweeper-menu-ranking
              v-if="
                menuPage === 2 ||
                menuPage === 2.1 ||
                menuPage === 2.2 ||
                menuPage === 2.3 ||
                menuPage === 2.4
              "
              :menu-page="menuPage"
              @action="handleActions"
            />
            <minesweeper-menu-results v-if="menuPage === 3" />
            <minesweeper-menu-rules
              v-if="menuPage === 4"
              @action="handleActions"
            />
          </div>
        </div>
      </template>
      <template v-else>
        <div class="game-page">
          <div class="game__header">
            <Tooltip
              content="Retour (esc)"
              position="top right"
              :slot-height="35"
              :slot-width="35"
              class="button-back"
              @on-click="returnToPreviousPage(menuPage)"
            >
              <template #activator="{ onMouseover, onMouseleave, onClick }">
                <button
                  @click="onClick"
                  @mouseover="onMouseover"
                  @mouseleave="onMouseleave"
                >
                  <img :src="getArrowBackColor" alt="Retour" />
                </button>
              </template>
            </Tooltip>
            <h1 class="title">Démineur</h1>
            <minesweeper-game-zoom v-if="width > 600" class="magnify" />
            <div v-else class="void" />
          </div>
          <minesweeper-game-status
            :game-status-to-string="gameStatusToString"
            :game-status="gameStatus"
            :timer="timer"
            @restart-game="restartGame"
            @selected-action="selectedAction = $event"
          />
          <minesweeper-game-board
            :game-board="gameBoard"
            :num-rows="numRows"
            :num-cols="numCols"
            :mine-sweeper="mineSweeper"
            :timer="timer"
            @left-click="handleLeftClick"
            @right-click="handleRightClick"
          />
        </div>
      </template>
    </div>
  </minesweeper-template>
</template>

<script setup lang="ts">
import { useDisplay } from "vuetify";
import { useMinesweeperGame } from "~/composables/useMinesweeperGame";

useSeoMeta({
  title: "Démineur - ioTactile Games",
  ogTitle: "Démineur - ioTactile Games",
  twitterTitle: "Démineur - ioTactile Games",
  description: "Page du jeu Démineur",
  ogDescription: "Page du jeu Démineur",
  twitterDescription: "Page du jeu Démineur",
  ogImage: "/minesweeper/minesweeper.png",
  twitterImage: "/minesweeper/minesweeper.png",
  twitterCard: "summary_large_image",
  ogUrl: "https://iotactile.games/minesweeper",
});

useHead({
  htmlAttrs: {
    lang: "fr",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "favicon.png",
    },
  ],
});

const { width } = useDisplay();
const {
  menuPage,
  isCustom,
  selectedAction,
  gameBoard,
  timer,
  gameStatusToString,
  gameStatus,
  getArrowBackColor,
  startGame,
  restartGame,
  handleRightClick,
  handleLeftClick,
  handleActions,
  toggleIsCustom,
  returnToPreviousPage,
} = useMinesweeperGame();
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .menu-page {
    align-self: flex-start;
    width: 500px;
    height: 650px;
    margin-top: 5rem;
    background-color: rgb(var(--v-theme-mineSweeperMainSurface));
    box-shadow: -10px -10px rgba(var(--v-theme-mineSweeperMainShadow), 0.3);
    color: rgb(var(--v-theme-onSurface));

    @media screen and (max-width: 600px) {
      align-self: center;
      box-shadow: none;
      width: 100%;
      height: 100%;
      margin: 0;
    }

    .menu__header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 40px 0 24px 0;

      .button-back {
        button {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        img {
          width: 40px;
          height: 40px;
        }

        @media screen and (max-width: 600px) {
          img {
            width: 30px;
            height: 30px;
          }
        }
      }

      .void {
        width: 40px;
        height: 40px;

        @media screen and (max-width: 600px) {
          width: 30px;
          height: 30px;
        }
      }
    }
  }

  .menu__content {
    display: flex;
    justify-content: center;
    width: 100%;
    height: calc(100% - 150px);
  }

  .game-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: calc(100% - 2rem);
    height: calc(100% - 1rem);
    padding: 1rem;
    background-color: rgb(var(--v-theme-mineSweeperMainSurface));
    box-shadow: -10px -10px rgba(var(--v-theme-mineSweeperMainShadow), 0.3);
    color: rgb(var(--v-theme-onSurface));

    @media screen and (max-width: 600px) {
      width: 100%;
      height: 100%;
      padding: 0;
      box-shadow: none;
    }

    .game__header {
      display: flex;
      justify-content: space-around;
      align-items: center;
      gap: 1rem;

      .button-back {
        button {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        img {
          width: 40px;
          height: 40px;
        }

        @media screen and (max-width: 600px) {
          img {
            width: 30px;
            height: 30px;
          }
        }
      }

      .void {
        width: 40px;
        height: 40px;

        @media screen and (max-width: 600px) {
          width: 30px;
          height: 30px;
        }
      }

      @media screen and (max-width: 600px) {
        width: 100%;
        gap: 0;
      }
    }
  }

  .title {
    font-family: "Orbitron", sans-serif;
    font-size: 3rem;
    font-weight: 700;
    text-transform: uppercase;
    color: rgb(var(--v-theme-mineSweeperMainOnSurface));

    @media screen and (max-width: 600px) {
      font-size: 2.5rem;
    }
  }
}
</style>
