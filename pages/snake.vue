<template>
  <SnakeTemplate>
    <div class="container">
      <template v-if="menuPage !== 5">
        <div class="menu-page">
          <Tooltip
            content="Retour (esc)"
            position="top right"
            :slot-height="40"
            :slot-width="40"
            class="button-back"
            @on-click="returnToPreviousPage()"
          >
            <template #activator="{ onMouseover, onMouseleave, onClick }">
              <button
                v-if="menuPage"
                @click="onClick"
                @mouseover="onMouseover"
                @mouseleave="onMouseleave"
              >
                <img src="/snake/ui/arrow-left.svg" alt="Retour" />
              </button>
            </template>
          </Tooltip>
          <h1 class="menu__title title">Snake</h1>
          <div class="menu__content">
            <SnakeMenu v-if="menuPage === 0" @action="handleActions" />
            <SnakeMenuPlay v-if="menuPage === 1" @start-game="startGame" />
            <SnakeMenuRanking v-if="menuPage === 2" />
            <SnakeMenuResults v-if="menuPage === 3" />
            <SnakeMenuRules v-if="menuPage === 4" @action="handleActions" />
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
            @on-click="returnToPreviousPage()"
          >
            <template #activator="{ onMouseover, onMouseleave, onClick }">
              <button @click="onClick" @mouseover="onMouseover" @mouseleave="onMouseleave">
                <img src="/snake/ui/arrow-left.svg" alt="Retour" />
              </button>
            </template>
          </Tooltip>
          <h1 class="title">Snake</h1>
          <div class="game-content">
            <SnakeGame @action="handleActions" />
          </div>
        </div>
      </template>
    </div>
  </SnakeTemplate>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Snake - ioTactile Games',
  ogTitle: 'Snake - ioTactile Games',
  twitterTitle: 'Snake - ioTactile Games',
  description: 'Joue à Snake — mange, grandis, bat ton score',
  ogDescription: 'Joue à Snake — mange, grandis, bat ton score',
  twitterDescription: 'Joue à Snake — mange, grandis, bat ton score',
  ogImage: '/snake/snake.svg',
  twitterImage: '/snake/snake.svg',
  twitterCard: 'summary_large_image',
  ogUrl: 'https://iotactile.games/snake',
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
      returnToPreviousPage();
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

const returnToPreviousPage = (): void => {
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
    border-radius: 8px;
    background-color: rgb(var(--v-theme-snakeMainSurface));
    box-shadow: -8px -8px rgba(var(--v-theme-snakeMainShadow), 0.8);
    border: 1px solid rgba(184, 255, 60, 0.25);
    color: rgb(var(--v-theme-snakeMainOnSurface));

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
    height: calc(100% - 60px);
    padding: 1rem;
    border-radius: 8px;
    background-color: rgb(var(--v-theme-snakeMainSurface));
    box-shadow: -8px -8px rgba(var(--v-theme-snakeMainShadow), 0.8);
    border: 1px solid rgba(184, 255, 60, 0.25);
    color: rgb(var(--v-theme-snakeMainOnSurface));

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
    font-family: 'Rajdhani', sans-serif;
    font-size: 3rem;
    font-weight: 700;
    text-transform: uppercase;
    text-align: center;
    letter-spacing: 0.18em;
    color: rgb(var(--v-theme-snakeMainPrimary));
  }
}
</style>
