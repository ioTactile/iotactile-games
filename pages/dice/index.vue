<template>
  <dice-template>
    <div class="d-flex justify-center align-center h-100">
      <div class="menu-wrapper">
        <button
          v-if="menuPage"
          class="arrow-back"
          @click="returnToPreviousPage(menuPage)"
        >
          <svg
            height="56px"
            width="56px"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 512 512"
            xml:space="preserve"
            fill="#ffffff"
          >
            <g id="SVGRepo_bgCarrier" stroke-width="0" />

            <g
              id="SVGRepo_tracerCarrier"
              stroke-linecap="round"
              stroke-linejoin="round"
            />

            <g id="SVGRepo_iconCarrier">
              <g>
                <path
                  class="st0"
                  d="M479.568,159.192H294.751l22.54-96.459c2.094-8.92-1.451-18.198-8.937-23.475 c-7.488-5.268-17.419-5.463-25.111-0.496L10.34,235.768C3.846,240.461,0,247.987,0,256.001c0,8.013,3.846,15.539,10.34,20.232 L283.243,473.24c7.692,4.965,17.623,4.771,25.111-0.506c7.486-5.267,11.021-14.546,8.937-23.465l-22.54-96.459h184.817 c17.905,0,32.432-14.518,32.432-32.433V191.623C512,173.708,497.474,159.192,479.568,159.192z"
                />
              </g>
            </g>
          </svg>
        </button>
        <h1 class="game-title text-center mt-10 mb-6">Dice</h1>
        <div class="d-flex justify-center">
          <dice-menu-main v-if="menuPage === 0" @action="handleActions" />
          <dice-menu-play v-if="menuPage === 1" @action="handleActions" />
          <dice-menu-view-games v-if="menuPage === 1.1" />
          <dice-menu-new-game v-if="menuPage === 1.2" @action="handleActions" />
          <dice-menu-ranking v-if="menuPage === 2" />
          <dice-menu-results v-if="menuPage === 3" />
          <dice-menu-rules v-if="menuPage === 4" @action="handleActions" />
        </div>
      </div>
    </div>
  </dice-template>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'Dice - ioTactile Games',
  ogTitle: 'Dice - ioTactile Games',
  description: 'Menu du jeu Dice',
  ogDescription: 'Menu du jeu Dice',
  ogImage: '/dice.png'
})

definePageMeta({
  middleware: ['auth']
})

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
  width: 500px;
  height: 650px;
  background-color: rgb(var(--v-theme-diceMainSecondary));
  border-radius: 8px;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
  color: white;

  .game-title {
    font-family: 'Indie Flower', cursive;
    font-size: 4rem;
    font-weight: bold;
    letter-spacing: 0.3rem;
  }
}

.arrow-back {
  position: absolute;
  top: 58px;
  left: 20px;
}
</style>
