<template>
  <v-card rounded="0" class="card-container">
    <v-row>
      <v-col cols="6">
        <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom" />
          <span class="border-bottom px-2">As</span>
          <span class="border-bottom px-2">Deux</span>
          <span class="border-bottom px-2">Trois</span>
          <span class="border-bottom px-2">Quatre</span>
          <span class="border-bottom px-2">Cinq</span>
          <span class="border-bottom px-2">Six</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">Sous-total</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">Bonus <em class="font-weight-bold">(à partir de 63):</em></span>
          <span class="bg-dicePrimary divider border-bottom" />
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">Total de la partie supérieur :</span>
          <span class="bg-dicePrimary divider border-bottom" />
          <span class="border-bottom px-2">3 identiques</span>
          <span class="border-bottom px-2">4 identiques</span>
          <span class="border-bottom px-2">Full house</span>
          <span class="border-bottom px-2">Petite suite</span>
          <span class="border-bottom px-2">Grande suite</span>
          <span class="border-bottom px-2">5 identiques</span>
          <span class="border-bottom px-2">Chance</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">Total de la partie inférieur :</span>
          <span class="bg-dicePrimary divider border-bottom" />
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">Total de la partie :</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col>
        <!-- <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom" />
          <span class="border-bottom px-2">{{ scores.playerOne.aces ? scores.playerOne.aces : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.twos ? scores.playerOne.twos : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.threes ? scores.playerOne.threes : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.fours ? scores.playerOne.fours : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.fives ? scores.playerOne.fives : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.sixes ? scores.playerOne.sixes : '' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">{{ playerOneUpperSubtotal }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">{{ playerOneWithBonus }}</span>
          <span class="bg-dicePrimary divider border-bottom" />
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">{{ playerOneUpperTotal }}</span>
          <span class="bg-dicePrimary divider border-bottom" />
          <span class="border-bottom px-2">{{ scores.playerOne.threeOfAKind ? scores.playerOne.threeOfAKind : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.fourOfAKind ? scores.playerOne.fourOfAKind : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.fullHouse ? scores.playerOne.fullHouse : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.smallStraight ? scores.playerOne.smallStraight : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.largeStraight ? scores.playerOne.largeStraight : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.dice ? scores.playerOne.dice : '' }}</span>
          <span class="border-bottom px-2">{{ scores.playerOne.chance ? scores.playerOne.chance : '' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">{{ playerOneLowerTotal }}</span>
          <span class="bg-dicePrimary divider border-bottom" />
          <span class="font-weight-bold bg-dicePrimary border-bottom px-2">{{ playerOneTotal }}</span>
          <span class="bg-dicePrimary divider" />
        </div> -->
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
// import { DiceSessionScore } from '~/functions/src/types'

// defineProps<{
//     scores: DiceSessionScore
// }>()

// const playerOneUpperSubtotal = computed(() => {
//   return props.scores.playerOne.aces + props.scores.playerOne.twos + props.scores.playerOne.threes + props.scores.playerOne.fours + props.scores.playerOne.fives + props.scores.playerOne.sixes
// })
// const playerOneWithBonus = computed(() => {
//   return playerOneUpperSubtotal.value >= 63 ? playerOneUpperSubtotal.value + 35 : playerOneUpperSubtotal.value
// })
// const playerOneUpperTotal = computed(() => {
//   return playerOneWithBonus.value
// })
// const playerOneLowerTotal = computed(() => {
//   return props.scores.playerOne.threeOfAKind + props.scores.playerOne.fourOfAKind + props.scores.playerOne.fullHouse + props.scores.playerOne.smallStraight + props.scores.playerOne.largeStraight + props.scores.playerOne.dice + props.scores.playerOne.chance
// })
// const playerOneTotal = computed(() => {
//   return playerOneUpperTotal.value + playerOneLowerTotal.value
// })

</script>

<style scoped>
.divider {
  height: 8px;
}

.big-divider {
  height: 25px;
}

.border-top {
    border-top: 1px solid grey;
}

.border-bottom {
    border-bottom: 1px solid grey;
}

.card-container {
    border: 2px solid rgba(0, 0, 0, .8);
}
</style>
