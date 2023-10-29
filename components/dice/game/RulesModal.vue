<template>
  <div class="rules-modal-wrapper">
    <div class="content-wrapper">
      <div />
      <div class="content">
        <div class="dices-wrapper">
          <div class="left-column">
            <div v-for="(number, i) in leftColumn" :key="i">
              <v-icon :icon="number.icon" size="60" class="icon-wrapper" />
              <div class="values">
                <div>
                  <v-icon
                    v-for="(icon, j) in number.icons"
                    :key="j"
                    :icon="icon"
                    size="40"
                  />
                </div>
                <span>{{ number.text }}</span>
              </div>
            </div>
          </div>
          <div class="right-column">
            <div v-for="(number, i) in rightColumn" :key="i">
              <div class="img-wrapper">
                <v-img :src="number.src" width="40" height="40" />
              </div>
              <div class="values">
                <div>
                  <v-icon
                    v-for="(icon, j) in number.icons"
                    :key="j"
                    :icon="icon"
                    size="40"
                  />
                </div>
                <span>{{ number.text }}</span>
              </div>
            </div>
          </div>
        </div>
        <p>BONUS +35 : OBTENIR 63 POINTS DANS LA COLONNE DES NOMBRES</p>
      </div>
      <button @click="closeRules">
        <div class="svg-container">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path
              d="M 38.982422 6.9707031 A 2.0002 2.0002 0 0 0 37.585938 7.5859375 L 24 21.171875 L 10.414062 7.5859375 A 2.0002 2.0002 0 0 0 8.9785156 6.9804688 A 2.0002 2.0002 0 0 0 7.5859375 10.414062 L 21.171875 24 L 7.5859375 37.585938 A 2.0002 2.0002 0 1 0 10.414062 40.414062 L 24 26.828125 L 37.585938 40.414062 A 2.0002 2.0002 0 1 0 40.414062 37.585938 L 26.828125 24 L 40.414062 10.414062 A 2.0002 2.0002 0 0 0 38.982422 6.9707031 z"
            />
          </svg>
        </div>
      </button>
    </div>
    <button class="button-close" @click="closeRules">COMPRIS !</button>
  </div>
</template>

<script setup lang="ts">
import { VIcon, VImg } from 'vuetify/components'
import {
  mdiDice1,
  mdiDice2,
  mdiDice3,
  mdiDice4,
  mdiDice5,
  mdiDice6
} from '@mdi/js'

const emit = defineEmits<{ (e: 'openRules', value: boolean): void }>()

const leftColumn = [
  {
    icon: mdiDice1,
    icons: [mdiDice1, mdiDice1, mdiDice1, mdiDice1, mdiDice1, mdiDice1],
    text: 'NOMBRE DE 1'
  },
  {
    icon: mdiDice2,
    icons: [mdiDice2, mdiDice2, mdiDice2, mdiDice2, mdiDice2, mdiDice2],
    text: 'NOMBRE DE 2'
  },
  {
    icon: mdiDice3,
    icons: [mdiDice3, mdiDice3, mdiDice3, mdiDice3, mdiDice3, mdiDice3],
    text: 'NOMBRE DE 3'
  },
  {
    icon: mdiDice4,
    icons: [mdiDice4, mdiDice4, mdiDice4, mdiDice4, mdiDice4, mdiDice4],
    text: 'NOMBRE DE 4'
  },
  {
    icon: mdiDice5,
    icons: [mdiDice5, mdiDice5, mdiDice5, mdiDice5, mdiDice5, mdiDice5],
    text: 'NOMBRE DE 5'
  },
  {
    icon: mdiDice6,
    icons: [mdiDice6, mdiDice6, mdiDice6, mdiDice6, mdiDice6, mdiDice6],
    text: 'NOMBRE DE 6'
  }
]

const rightColumn = [
  {
    src: '/dice/inputs/three-of-a-kind.png',
    icons: [mdiDice4, mdiDice4, mdiDice4],
    text: 'BRELAN'
  },
  {
    src: '/dice/inputs/four-of-a-kind.png',
    icons: [mdiDice2, mdiDice2, mdiDice2, mdiDice2],
    text: 'CARRÉ'
  },
  {
    src: '/dice/inputs/full-house.png',
    icons: [mdiDice1, mdiDice1, mdiDice1, mdiDice3, mdiDice3],
    text: 'FULL HOUSE'
  },
  {
    src: '/dice/inputs/small-straight.png',
    icons: [mdiDice1, mdiDice2, mdiDice3, mdiDice4],
    text: 'SUITE DE 4 DÉS'
  },
  {
    src: '/dice/inputs/large-straight.png',
    icons: [mdiDice1, mdiDice2, mdiDice3, mdiDice4, mdiDice5],
    text: 'SUITE DE 5 DÉS'
  },
  {
    src: '/dice/inputs/dice.png',
    icons: [mdiDice6, mdiDice6, mdiDice6, mdiDice6, mdiDice6],
    text: '5 DÉS IDENTIQUES'
  },
  {
    src: '/dice/inputs/chance.png',
    icons: [mdiDice5, mdiDice6, mdiDice4, mdiDice2, mdiDice6],
    text: 'CHANCE'
  }
]

const closeRules = () => {
  emit('openRules', false)
}
</script>

<style scoped lang="scss">
.rules-modal-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 9999;
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 1140px;
  height: 660px;
  background-color: #d9d9d9;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.25);

  .content-wrapper {
    display: flex;
    justify-content: space-between;
    height: 100%;

    .content {
      display: flex;
      flex-direction: column;

      .dices-wrapper {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        width: 100%;
        height: 100%;
        border-radius: 8px;
        padding: 0 20px;
        font-size: 1.125rem;
        font-weight: 600;
        margin: 0 auto;

        .left-column {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;

          div {
            display: flex;
            align-items: center;

            .values {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-left: 10px;

              span {
                margin-left: 5px;
              }
            }

            .icon-wrapper {
              color: white;
            }
          }
        }

        .right-column {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;

          div {
            display: flex;
            align-items: center;

            .values {
              display: flex;
              flex-direction: column;
              align-items: flex-start;
              margin-left: 10px;

              span {
                margin-left: 5px;
              }
            }

            .img-wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              width: 50px;
              height: 50px;
              background-color: white;
              border-radius: 3px;
            }

            &:nth-child(4) > .img-wrapper > .v-img {
              width: 30px !important;
              height: 30px !important;
            }
          }
        }
      }

      p {
        margin: 10px auto 20px auto;
        font-size: 1.5rem;
        color: rgb(var(--v-theme-diceMainTertiary));
      }
    }

    button {
      width: 60px;
      height: 60px;
      background-color: rgb(var(--v-theme-diceMainTertiary));
      border-radius: 8px;
      box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    }
  }

  .button-close {
    margin: 0 auto;
    width: 200px;
    height: 60px;
    background-color: rgb(var(--v-theme-diceMainTertiary));
    border-radius: 8px;
    box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
    font-size: 2rem;
    color: white;
  }
}
</style>
