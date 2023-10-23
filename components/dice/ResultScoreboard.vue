<template>
  <v-dialog :model-value="modelValue" max-width="500px" persistent>
    <v-card :rounded="0">
      <v-card-title class="d-flex justify-space-between align-center">
        <h2 class="text-h6 text-sm-h5">
          Résultats
        </h2>
        <v-btn :icon="mdiClose" variant="text" @click="emits('update:modelValue', false)" />
      </v-card-title>
      <v-card-text>
        <v-table density="compact" class="card-container">
          <thead>
            <tr>
              <th class="text-center border-darker bg-diceClosePrimary" width="40%" />
              <th class="text-center border-darker bg-diceClosePrimary" width="15%">
                A
              </th>
              <th class="text-center border-darker bg-diceClosePrimary" width="15%">
                {{ session.playerTwo ? 'B' : '' }}
              </th>
              <th class="text-center border-darker bg-diceClosePrimary" width="15%">
                {{ session.playerThree ? 'C' : '' }}
              </th>
              <th class="text-center bg-diceClosePrimary" width="15%">
                {{ session.playerFour ? 'D' : '' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.label">
              <td class="border-lighter">
                {{ item.label }}
              </td>
              <td class="text-center border-lighter">
                {{ item.data[0] }}
              </td>
              <td class="text-center border-lighter">
                {{ item.data[1] }}
              </td>
              <td class="text-center border-lighter">
                {{ item.data[2] }}
              </td>
              <td class="text-center border-lighter">
                {{ item.data[3] }}
              </td>
            </tr>
          </tbody>
        </v-table>
        <v-divider class="my-4" />
        <v-row class="px-2">
          <v-col cols="12" sm="6" class="text-body-2 text-sm-body-1">
            A : {{ session.playerOne.username || 'Joueur 1' }}
          </v-col>
          <v-col v-if="session.playerTwo" cols="12" sm="6" class="text-body-2 text-sm-body-1">
            B : {{ session.playerTwo.username || 'Joueur 2' }}
          </v-col>
          <v-col v-if="session.playerThree" cols="12" sm="6" class="text-body-2 text-sm-body-1">
            C : {{ session.playerThree.username || 'Joueur 3' }}
          </v-col>
          <v-col v-if="session.playerFour" cols="12" sm="6" class="text-body-2 text-sm-body-1">
            D : {{ session.playerFour.username || 'Joueur 4' }}
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {
  VRow,
  VCol,
  VCard,
  VBtn,
  VDivider,
  VCardTitle,
  VCardText,
  VTable,
  VDialog
} from 'vuetify/components'
import { mdiClose } from '@mdi/js'
import { LocalDiceSessionScoreType } from '~/stores'

const props = defineProps<{
  modelValue: boolean
  session: LocalDiceSessionScoreType
}>()

const emits = defineEmits<{(e: 'update:modelValue', value: boolean): void }>()

const upperTotal = (player: string) => {
  if (player === 'playerOne') {
    return (
      props.session.playerOne.one! +
      props.session.playerOne.two! +
      props.session.playerOne.three! +
      props.session.playerOne.four! +
      props.session.playerOne.five! +
      props.session.playerOne.six!
    )
  } else if (player === 'playerTwo') {
    return (
      props.session.playerTwo.one! +
      props.session.playerTwo.two! +
      props.session.playerTwo.three! +
      props.session.playerTwo.four! +
      props.session.playerTwo.five! +
      props.session.playerTwo.six!
    )
  } else if (props.session.playerThree && player === 'playerThree') {
    return (
      props.session.playerThree.one! +
      props.session.playerThree.two! +
      props.session.playerThree.three! +
      props.session.playerThree.four! +
      props.session.playerThree.five! +
      props.session.playerThree.six!
    )
  } else if (props.session.playerFour && player === 'playerFour') {
    return (
      props.session.playerFour.one! +
      props.session.playerFour.two! +
      props.session.playerFour.three! +
      props.session.playerFour.four! +
      props.session.playerFour.five! +
      props.session.playerFour.six!
    )
  }
}

const lowerTotal = (player: string) => {
  if (player === 'playerOne') {
    return (
      props.session.playerOne.threeOfAKind! +
      props.session.playerOne.fourOfAKind! +
      props.session.playerOne.fullHouse! +
      props.session.playerOne.smallStraight! +
      props.session.playerOne.largeStraight! +
      props.session.playerOne.dice! +
      props.session.playerOne.chance!
    )
  } else if (player === 'playerTwo') {
    return (
      props.session.playerTwo.threeOfAKind! +
      props.session.playerTwo.fourOfAKind! +
      props.session.playerTwo.fullHouse! +
      props.session.playerTwo.smallStraight! +
      props.session.playerTwo.largeStraight! +
      props.session.playerTwo.dice! +
      props.session.playerTwo.chance!
    )
  } else if (props.session.playerThree && player === 'playerThree') {
    return (
      props.session.playerThree.threeOfAKind! +
      props.session.playerThree.fourOfAKind! +
      props.session.playerThree.fullHouse! +
      props.session.playerThree.smallStraight! +
      props.session.playerThree.largeStraight! +
      props.session.playerThree.dice! +
      props.session.playerThree.chance!
    )
  } else if (props.session.playerFour && player === 'playerFour') {
    return (
      props.session.playerFour.threeOfAKind! +
      props.session.playerFour.fourOfAKind! +
      props.session.playerFour.fullHouse! +
      props.session.playerFour.smallStraight! +
      props.session.playerFour.largeStraight! +
      props.session.playerFour.dice! +
      props.session.playerFour.chance!
    )
  }
}

const items = [
  {
    label: 'Un',
    data: [
      props.session.playerOne.one,
      props.session.playerTwo ? props.session.playerTwo.one : '',
      props.session.playerThree ? props.session.playerThree.one : '',
      props.session.playerFour ? props.session.playerFour.one : ''
    ]
  },
  {
    label: 'Deux',
    data: [
      props.session.playerOne.two,
      props.session.playerTwo ? props.session.playerTwo.two : '',
      props.session.playerThree ? props.session.playerThree.two : '',
      props.session.playerFour ? props.session.playerFour.two : ''
    ]
  },
  {
    label: 'Trois',
    data: [
      props.session.playerOne.three,
      props.session.playerTwo ? props.session.playerTwo.three : '',
      props.session.playerThree ? props.session.playerThree.three : '',
      props.session.playerFour ? props.session.playerFour.three : ''
    ]
  },
  {
    label: 'Quatre',
    data: [
      props.session.playerOne.four,
      props.session.playerTwo ? props.session.playerTwo.four : '',
      props.session.playerThree ? props.session.playerThree.four : '',
      props.session.playerFour ? props.session.playerFour.four : ''
    ]
  },
  {
    label: 'Cinq',
    data: [
      props.session.playerOne.five,
      props.session.playerTwo ? props.session.playerTwo.five : '',
      props.session.playerThree ? props.session.playerThree.five : '',
      props.session.playerFour ? props.session.playerFour.five : ''
    ]
  },
  {
    label: 'Six',
    data: [
      props.session.playerOne.six,
      props.session.playerTwo ? props.session.playerTwo.six : '',
      props.session.playerThree ? props.session.playerThree.six : '',
      props.session.playerFour ? props.session.playerFour.six : ''
    ]
  },
  {
    label: 'Total supérieur',
    data: [
      upperTotal('playerOne'),
      props.session.playerTwo ? upperTotal('playerTwo') : '',
      props.session.playerThree ? upperTotal('playerThree') : '',
      props.session.playerFour ? upperTotal('playerFour') : ''
    ]
  },
  {
    label: '3 identiques',
    data: [
      props.session.playerOne.threeOfAKind,
      props.session.playerTwo ? props.session.playerTwo.threeOfAKind : '',
      props.session.playerThree ? props.session.playerThree.threeOfAKind : '',
      props.session.playerFour ? props.session.playerFour.threeOfAKind : ''
    ]
  },
  {
    label: '4 identiques',
    data: [
      props.session.playerOne.fourOfAKind,
      props.session.playerTwo ? props.session.playerTwo.fourOfAKind : '',
      props.session.playerThree ? props.session.playerThree.fourOfAKind : '',
      props.session.playerFour ? props.session.playerFour.fourOfAKind : ''
    ]
  },
  {
    label: 'Fullhouse',
    data: [
      props.session.playerOne.fullHouse,
      props.session.playerTwo ? props.session.playerTwo.fullHouse : '',
      props.session.playerThree ? props.session.playerThree.fullHouse : '',
      props.session.playerFour ? props.session.playerFour.fullHouse : ''
    ]
  },
  {
    label: 'Petite suite',
    data: [
      props.session.playerOne.smallStraight,
      props.session.playerTwo ? props.session.playerTwo.smallStraight : '',
      props.session.playerThree ? props.session.playerThree.smallStraight : '',
      props.session.playerFour ? props.session.playerFour.smallStraight : ''
    ]
  },
  {
    label: 'Grande suite',
    data: [
      props.session.playerOne.largeStraight,
      props.session.playerTwo ? props.session.playerTwo.largeStraight : '',
      props.session.playerThree ? props.session.playerThree.largeStraight : '',
      props.session.playerFour ? props.session.playerFour.largeStraight : ''
    ]
  },
  {
    label: 'Dice',
    data: [
      props.session.playerOne.dice,
      props.session.playerTwo ? props.session.playerTwo.dice : '',
      props.session.playerThree ? props.session.playerThree.dice : '',
      props.session.playerFour ? props.session.playerFour.dice : ''
    ]
  },
  {
    label: 'Chance',
    data: [
      props.session.playerOne.chance,
      props.session.playerTwo ? props.session.playerTwo.chance : '',
      props.session.playerThree ? props.session.playerThree.chance : '',
      props.session.playerFour ? props.session.playerFour.chance : ''
    ]
  },
  {
    label: 'Total inférieur',
    data: [
      lowerTotal('playerOne'),
      props.session.playerTwo ? lowerTotal('playerTwo') : '',
      props.session.playerThree ? lowerTotal('playerThree') : '',
      props.session.playerFour ? lowerTotal('playerFour') : ''
    ]
  },
  {
    label: 'Total',
    data: [
      props.session.playerOne.total,
      props.session.playerTwo ? props.session.playerTwo.total : '',
      props.session.playerThree ? props.session.playerThree.total : '',
      props.session.playerFour ? props.session.playerFour.total : ''
    ]
  }
]
</script>

<style scoped>
.border-lighter {
  border-right: 1px solid rgb(var(--v-theme-diceBorder));
}

.border-darker {
  border-right: 1px solid rgb(var(--v-theme-diceCloseBorder));
}

.card-container {
  border: 2px solid rgba(0, 0, 0, 0.8);
}
</style>
