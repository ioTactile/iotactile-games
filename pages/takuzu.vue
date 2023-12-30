<template>
  <takuzu-template>
    <div class="container">
      <template v-if="menuPage !== 5">
        <div class="menu-page">
          <Tooltip
            content="Retour (esc)"
            position="top right"
            :slot-height="40"
            :slot-width="40"
            class="button-back"
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
          <h1 class="menu__title title">Takuzu</h1>
          <div class="menu__content">
            <takuzu-menu v-if="menuPage === 0" @action="handleActions" />
            <takuzu-menu-play v-if="menuPage === 1" @start-game="startGame" />
            <takuzu-menu-ranking v-if="menuPage === 2" />
            <takuzu-menu-results v-if="menuPage === 3" />
            <takuzu-menu-rules v-if="menuPage === 4" @action="handleActions" />
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
            class="button-back"
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
          <h1 class="title">Takuzu</h1>
          <div class="game-content">
            <takuzu-game :options="gameOptions" @action="handleActions" />
          </div>
        </div>
      </template>
    </div>
  </takuzu-template>
</template>

<script setup lang="ts">
import type { GameOptions } from "~/utils/takuzu/types";

useSeoMeta({
  title: "Takuzu - ioTactile Games",
  ogTitle: "Takuzu - ioTactile Games",
  twitterTitle: "Takuzu - ioTactile Games",
  description: "Page du jeu Takuzu",
  ogDescription: "Page du jeu Takuzu",
  twitterDescription: "Page du jeu Takuzu",
  ogImage: "/takuzu/takuzu.png",
  twitterImage: "/takuzu/takuzu.png",
  twitterCard: "summary_large_image",
  ogUrl: "https://iotactile.games/takuzu",
});

useHead({
  htmlAttrs: {
    lang: "fr",
  },
  link: [
    {
      rel: "icon",
      type: "image/png",
      href: "/favicon.png",
    },
  ],
});

if (process.client) {
  window.addEventListener("keyup", (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      returnToPreviousPage(menuPage.value);
    }
  });
}

const menuPage = ref<number>(0);
const gameOptions = ref<GameOptions | null>(null);

const actionMap: Record<string, number> = {
  play: 1,
  ranking: 2,
  rankingBeginner: 2.1,
  rankingIntermediate: 2.2,
  rankingExpert: 2.3,
  rankingCustom: 2.4,
  results: 3,
  rules: 4,
  gameBoard: 5,
};

const handleActions = (action: string): void => {
  menuPage.value = actionMap[action] || 0;
};

const returnToPreviousPage = (actualPage: number): void => {
  if (actualPage > 2 && actualPage < 3) {
    menuPage.value = 2;
  } else {
    menuPage.value = 0;
  }
};

const startGame = (options: GameOptions): void => {
  menuPage.value = 5;
  gameOptions.value = options;
};
</script>

<style scoped lang="scss">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;

  .menu-page {
    position: relative;
    width: 500px;
    height: 650px;
    border-radius: 20px;
    background-color: rgb(var(--v-theme-takuzuMainSurface));
    box-shadow: -10px -10px rgba(var(--v-theme-takuzuMainShadow), 0.3);
    color: rgb(var(--v-theme-onSurface));

    @media screen and (max-width: 600px) {
      width: 100%;
      height: calc(100% - 3rem);
      margin: 0 1rem;
    }

    .menu__title {
      padding: 40px 0 24px 0;
    }

    .menu__content {
      display: flex;
      justify-content: center;
      width: 100%;
      height: calc(100% - 150px);
    }

    .button-back {
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
    height: calc(100% - 100px);
    padding: 1rem;
    border-radius: 20px;
    background-color: rgb(var(--v-theme-takuzuMainSurface));
    box-shadow: -10px -10px rgba(var(--v-theme-takuzuMainShadow), 0.3);
    color: rgb(var(--v-theme-onSurface));

    @media screen and (max-width: 600px) {
      width: 100%;
      height: calc(100% - 2rem);
      margin: 0 1rem;
      padding: 0;
    }

    .game-content {
      display: flex;
      justify-content: center;
      overflow: auto;
      width: 100%;
      height: 100%;
      margin: 1rem auto;
    }

    .button-back {
      position: absolute;
      top: 34px;
      left: 400px;

      @media screen and (max-width: 600px) {
        top: 18px;
        left: 20px;
      }

      img {
        width: 40px;
        height: 40px;
      }
    }
  }

  .title {
    font-family: "QuickSand", sans-serif;
    font-size: 3rem;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
  }
}
</style>
