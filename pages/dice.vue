<template>
  <div>
    <Head>
      <Title>Accueil Dice - ioTactile Games</Title>
      <Meta name="description" content="page d'accueil pour le jeu Dice" />
    </Head>
    <div id="scaler" :style="{ transform: `scale(${scale})` }">
      <div id="gamescene">
        <div class="d-flex flex-wrap justify-center mb-4">
          <v-btn
            v-for="(item, i) in items"
            :key="i"
            :to="`/dice${item.link}`"
            :append-icon="item.icon"
            color="buttonBack"
            variant="outlined"
            class="mx-1"
            :class="xs || sm ? 'mb-2' : ''"
            :size="xs ? 'small' : 'default'"
          >
            {{ item.title }}
          </v-btn>
        </div>
        <NuxtPage />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { VBtn } from 'vuetify/components'
import { useDisplay } from 'vuetify'
import { mdiAccountMultiple, mdiTextBox, mdiAccountDetails, mdiNoteText } from '@mdi/js'
import { useWindowSize } from '@vueuse/core'

// Vuetify

const { xs, sm } = useDisplay()

const items = [
  {
    title: 'Jouer',
    link: '/jouer',
    icon: mdiAccountMultiple
  },
  {
    title: 'Classement',
    link: '/classement',
    icon: mdiTextBox
  },
  {
    title: 'Résultats',
    link: '/resultats',
    icon: mdiAccountDetails
  },
  {
    title: 'Règles',
    link: '/regles',
    icon: mdiNoteText
  }
]

const scale = ref<number>(1)
const { width: windowWidth, height: windowHeight } = useWindowSize()

const handleResize = () => {
  const targetHeight = 1080
  const targetWidth = (16 / 9) * targetHeight
  scale.value = Math.min(windowHeight.value / targetHeight, windowWidth.value / targetWidth)
}

watch(
  [windowHeight, windowWidth],
  () => {
    handleResize()
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
#scaler {
  position: relative;
  transform-origin: top center;
  border: 0px solid transparent;
  transition: transform 200ms;
}

#gamescene {
  position: absolute;
  left: 50%;
  top: 70px;
  transform: translateX(-50%);
  width: 1200px;
}
</style>
