<template>
  <Game2048Template>
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
                <img src="/game2048/ui/arrow-left.svg" alt="Retour" />
              </button>
            </template>
          </Tooltip>
          <h1 class="menu__title title">2048</h1>
          <div class="menu__content">
            <Game2048Menu v-if="menuPage === 0" @action="handleActions" />
            <Game2048MenuPlay v-if="menuPage === 1" @start-game="startGame" />
            <Game2048MenuRanking v-if="menuPage === 2" />
            <Game2048MenuResults v-if="menuPage === 3" />
            <Game2048MenuRules v-if="menuPage === 4" @action="handleActions" />
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
              <button @click="onClick" @mouseover="onMouseover" @mouseleave="onMouseleave">
                <img src="/game2048/ui/arrow-left.svg" alt="Retour" />
              </button>
            </template>
          </Tooltip>
          <h1 class="title">2048</h1>
          <div class="game-content">
            <Game2048Game @action="handleActions" />
          </div>
        </div>
      </template>
    </div>
  </Game2048Template>
</template>

<script setup lang="ts">
useSeoMeta({
  title: '2048 - ioTactile Games',
  ogTitle: '2048 - ioTactile Games',
  twitterTitle: '2048 - ioTactile Games',
  description: 'Joue à 2048 — fusionne les tuiles jusqu’à 2048',
  ogDescription: 'Joue à 2048 — fusionne les tuiles jusqu’à 2048',
  twitterDescription: 'Joue à 2048 — fusionne les tuiles jusqu’à 2048',
  ogImage: '/game2048/game2048.svg',
  twitterImage: '/game2048/game2048.svg',
  twitterCard: 'summary_large_image',
  ogUrl: 'https://iotactile.games/2048',
});

useHead({
  htmlAttrs: {
    lang: 'fr',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon.png',
    },
  ],
});

if (import.meta.client) {
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      returnToPreviousPage(menuPage.value);
    }
  });
}

const menuPage = ref<number>(0);

const actionMap: Record<string, number> = {
  play: 1,
  ranking: 2,
  results: 3,
  rules: 4,
  gameBoard: 5,
  menu: 0,
};

const handleActions = (action: string): void => {
  menuPage.value = actionMap[action] ?? 0;
};

const returnToPreviousPage = (_actualPage: number): void => {
  menuPage.value = 0;
};

const startGame = (): void => {
  menuPage.value = 5;
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
    background-color: rgb(var(--v-theme-game2048MainSurface));
    box-shadow: -10px -10px rgba(var(--v-theme-game2048MainShadow), 0.45);
    color: rgb(var(--v-theme-game2048MainOnSurface));

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
    width: 700px;
    height: calc(100% - 80px);
    padding: 1rem;
    border-radius: 20px;
    background-color: rgb(var(--v-theme-game2048MainSurface));
    box-shadow: -10px -10px rgba(var(--v-theme-game2048MainShadow), 0.45);
    color: rgb(var(--v-theme-game2048MainOnSurface));

    @media screen and (max-width: 600px) {
      width: 100%;
      height: calc(100% - 2rem);
      margin: 0 1rem;
      padding: 0.5rem;
    }

    .game-content {
      display: flex;
      justify-content: center;
      overflow: auto;
      width: 100%;
      height: 100%;
      margin: 0.5rem auto;
    }

    .button-back {
      position: absolute;
      top: 28px;
      left: 24px;

      img {
        width: 36px;
        height: 36px;
      }
    }
  }

  .title {
    font-family: 'Space Grotesk', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.06em;
    color: rgb(var(--v-theme-game2048MainOnSurface));
  }
}
</style>
