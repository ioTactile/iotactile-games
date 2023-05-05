<template>
  <v-card v-if="scores" rounded="0" class="card-container">
    <v-row>
      <v-col cols="6" class="pr-0">
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
      <v-col v-if="scores.playerOne" class="px-0">
        <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom text-center">A</span>
          <span class="border-bottom text-center">{{ scores.playerOne.one !== 0 ? scores.playerOne.one : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.two !== 0 ? scores.playerOne.two : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.three !== 0 ? scores.playerOne.three : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.four !== 0 ? scores.playerOne.four : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.five !== 0 ? scores.playerOne.five : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.six !== 0 ? scores.playerOne.six : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperSubtotalPlayerOne !== 0 ? checkUpperSubtotalPlayerOne : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkBonusPlayerOne !== 0 ? checkBonusPlayerOne : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperTotalPlayerOne !== 0 ? checkUpperTotalPlayerOne : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="border-bottom text-center">{{ scores.playerOne.threeOfAKind !== 0 ? scores.playerOne.threeOfAKind : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.fourOfAKind !== 0 ? scores.playerOne.fourOfAKind : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.fullHouse !== 0 ? scores.playerOne.fullHouse : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.smallStraight !== 0 ? scores.playerOne.smallStraight : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.largeStraight !== 0 ? scores.playerOne.largeStraight : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.dice !== 0 ? scores.playerOne.dice : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.playerOne.chance !== 0 ? scores.playerOne.chance : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkLowerTotalPlayerOne !== 0 ? checkLowerTotalPlayerOne : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkTotalPlayerOne !== 0 ? checkTotalPlayerOne : '_' }}</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col v-else class="bg-dicePrimary px-0" />
      <v-col v-if="scores.playerTwo" class="px-0">
        <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom text-center">B</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.one !== 0 ? scores.PlayerTwo.one : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.two !== 0 ? scores.PlayerTwo.two : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.three !== 0 ? scores.PlayerTwo.three : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.four !== 0 ? scores.PlayerTwo.four : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.five !== 0 ? scores.PlayerTwo.five : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.six !== 0 ? scores.PlayerTwo.six : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperSubtotalPlayerTwo !== 0 ? checkUpperSubtotalPlayerTwo : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkBonusPlayerTwo !== 0 ? checkBonusPlayerTwo : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperTotalPlayerTwo !== 0 ? checkUpperTotalPlayerTwo : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="border-bottom text-center">{{ scores.PlayerTwo.threeOfAKind !== 0 ? scores.PlayerTwo.threeOfAKind : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.fourOfAKind !== 0 ? scores.PlayerTwo.fourOfAKind : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.fullHouse !== 0 ? scores.PlayerTwo.fullHouse : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.smallStraight !== 0 ? scores.PlayerTwo.smallStraight : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.largeStraight !== 0 ? scores.PlayerTwo.largeStraight : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.dice !== 0 ? scores.PlayerTwo.dice : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerTwo.chance !== 0 ? scores.PlayerTwo.chance : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkLowerTotalPlayerTwo !== 0 ? checkLowerTotalPlayerTwo : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkTotalPlayerTwo !== 0 ? checkTotalPlayerTwo : '_' }}</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col v-else class="bg-dicePrimary px-0" />
      <v-col v-if="scores.playerThree" class="px-0">
        <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom text-center">C</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.one !== 0 ? scores.PlayerThree.one : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.two !== 0 ? scores.PlayerThree.two : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.three !== 0 ? scores.PlayerThree.three : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.four !== 0 ? scores.PlayerThree.four : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.five !== 0 ? scores.PlayerThree.five : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.six !== 0 ? scores.PlayerThree.six : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperSubtotalPlayerThree !== 0 ? checkUpperSubtotalPlayerThree : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkBonusPlayerThree !== 0 ? checkBonusPlayerThree : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperTotalPlayerThree !== 0 ? checkUpperTotalPlayerThree : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="border-bottom text-center">{{ scores.PlayerThree.threeOfAKind !== 0 ? scores.PlayerThree.threeOfAKind : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.fourOfAKind !== 0 ? scores.PlayerThree.fourOfAKind : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.fullHouse !== 0 ? scores.PlayerThree.fullHouse : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.smallStraight !== 0 ? scores.PlayerThree.smallStraight : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.largeStraight !== 0 ? scores.PlayerThree.largeStraight : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.dice !== 0 ? scores.PlayerThree.dice : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerThree.chance !== 0 ? scores.PlayerThree.chance : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkLowerTotalPlayerThree !== 0 ? checkLowerTotalPlayerThree : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkTotalPlayerThree !== 0 ? checkTotalPlayerThree : '_' }}</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col v-else class="bg-dicePrimary px-0" />
      <v-col v-if="scores.playerFour" class="px-0">
        <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom text-center">D</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.one !== 0 ? scores.PlayerFour.one : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.two !== 0 ? scores.PlayerFour.two : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.three !== 0 ? scores.PlayerFour.three : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.four !== 0 ? scores.PlayerFour.four : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.five !== 0 ? scores.PlayerFour.five : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.six !== 0 ? scores.PlayerFour.six : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperSubtotalPlayerFour !== 0 ? checkUpperSubtotalPlayerFour : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkBonusPlayerFour !== 0 ? checkBonusPlayerFour : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperTotalPlayerFour !== 0 ? checkUpperTotalPlayerFour : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="border-bottom text-center">{{ scores.PlayerFour.threeOfAKind !== 0 ? scores.PlayerFour.threeOfAKind : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.fourOfAKind !== 0 ? scores.PlayerFour.fourOfAKind : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.fullHouse !== 0 ? scores.PlayerFour.fullHouse : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.smallStraight !== 0 ? scores.PlayerFour.smallStraight : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.largeStraight !== 0 ? scores.PlayerFour.largeStraight : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.dice !== 0 ? scores.PlayerFour.dice : '_' }}</span>
          <span class="border-bottom text-center">{{ scores.PlayerFour.chance !== 0 ? scores.PlayerFour.chance : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkLowerTotalPlayerFour !== 0 ? checkLowerTotalPlayerFour : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkTotalPlayerFour !== 0 ? checkTotalPlayerFour : '_' }}</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col v-else class="bg-dicePrimary px-0" />
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { doc, collection } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'

const db = useFirestore()
const route = useRoute()

// i want to check all the combinations of the diceOnBoard and diceOnHand and return all possible scores for each combination

const scoresRef = doc(db, 'diceSessionScores', route.params.id as string)
const scores = useDocument(doc(collection(db, 'diceSessionScores'), scoresRef.id))

const checkUpperSubtotalPlayerOne = computed(() => {
  if (!scores.value) { return 0 }
  let subtotal = 0
  if (scores.value.playerOne.one !== 0) { subtotal += scores.value.playerOne.one }
  if (scores.value.playerOne.two !== 0) { subtotal += scores.value.playerOne.two }
  if (scores.value.playerOne.three !== 0) { subtotal += scores.value.playerOne.three }
  if (scores.value.playerOne.four !== 0) { subtotal += scores.value.playerOne.four }
  if (scores.value.playerOne.five !== 0) { subtotal += scores.value.playerOne.five }
  if (scores.value.playerOne.six !== 0) { subtotal += scores.value.player.six }

  return subtotal
})

const checkBonusPlayerOne = computed(() => {
  if (checkUpperSubtotalPlayerOne.value >= 63) {
    return 35
  } else {
    return 0
  }
})

const checkUpperTotalPlayerOne = computed(() => {
  return checkUpperSubtotalPlayerOne.value + checkBonusPlayerOne.value
})

const checkLowerTotalPlayerOne = computed(() => {
  if (!scores.value) { return 0 }
  let subtotal = 0
  if (scores.value.playerOne.threeOfAKind !== 0) { subtotal += scores.value.playerOne.threeOfAKind }
  if (scores.value.playerOne.fourOfAKind !== 0) { subtotal += scores.value.playerOne.fourOfAKind }
  if (scores.value.playerOne.fullHouse !== 0) { subtotal += scores.value.playerOne.fullHouse }
  if (scores.value.playerOne.smallStraight !== 0) { subtotal += scores.value.playerOne.smallStraight }
  if (scores.value.playerOne.largeStraight !== 0) { subtotal += scores.value.playerOne.largeStraight }
  if (scores.value.playerOne.dice !== 0) { subtotal += scores.value.playerOne.dice }
  if (scores.value.playerOne.chance !== 0) { subtotal += scores.value.playerOne.chance }

  return subtotal
})

const checkTotalPlayerOne = computed(() => {
  return checkUpperTotalPlayerOne.value + checkLowerTotalPlayerOne.value
})

const checkUpperSubtotalPlayerTwo = computed(() => {
  if (!scores.value) { return 0 }
  let subtotal = 0
  if (scores.value.playerTwo.one !== 0) { subtotal += scores.value.playerTwo.one }
  if (scores.value.playerTwo.two !== 0) { subtotal += scores.value.playerTwo.two }
  if (scores.value.playerTwo.three !== 0) { subtotal += scores.value.playerTwo.three }
  if (scores.value.playerTwo.four !== 0) { subtotal += scores.value.playerTwo.four }
  if (scores.value.playerTwo.five !== 0) { subtotal += scores.value.playerTwo.five }
  if (scores.value.playerTwo.six !== 0) { subtotal += scores.value.player.six }

  return subtotal
})

const checkBonusPlayerTwo = computed(() => {
  if (checkUpperSubtotalPlayerTwo.value >= 63) {
    return 35
  } else {
    return 0
  }
})

const checkUpperTotalPlayerTwo = computed(() => {
  return checkUpperSubtotalPlayerTwo.value + checkBonusPlayerTwo.value
})

const checkLowerTotalPlayerTwo = computed(() => {
  if (!scores.value) { return 0 }
  let subtotal = 0
  if (scores.value.playerTwo.threeOfAKind !== 0) { subtotal += scores.value.playerTwo.threeOfAKind }
  if (scores.value.playerTwo.fourOfAKind !== 0) { subtotal += scores.value.playerTwo.fourOfAKind }
  if (scores.value.playerTwo.fullHouse !== 0) { subtotal += scores.value.playerTwo.fullHouse }
  if (scores.value.playerTwo.smallStraight !== 0) { subtotal += scores.value.playerTwo.smallStraight }
  if (scores.value.playerTwo.largeStraight !== 0) { subtotal += scores.value.playerTwo.largeStraight }
  if (scores.value.playerTwo.dice !== 0) { subtotal += scores.value.playerTwo.dice }
  if (scores.value.playerTwo.chance !== 0) { subtotal += scores.value.playerTwo.chance }

  return subtotal
})

const checkTotalPlayerTwo = computed(() => {
  return checkUpperTotalPlayerTwo.value + checkLowerTotalPlayerTwo.value
})

const checkUpperSubtotalPlayerThree = computed(() => {
  if (!scores.value) { return 0 }
  let subtotal = 0
  if (scores.value.playerThree.one !== 0) { subtotal += scores.value.playerThree.one }
  if (scores.value.playerThree.two !== 0) { subtotal += scores.value.playerThree.two }
  if (scores.value.playerThree.three !== 0) { subtotal += scores.value.playerThree.three }
  if (scores.value.playerThree.four !== 0) { subtotal += scores.value.playerThree.four }
  if (scores.value.playerThree.five !== 0) { subtotal += scores.value.playerThree.five }
  if (scores.value.playerThree.six !== 0) { subtotal += scores.value.player.six }

  return subtotal
})

const checkBonusPlayerThree = computed(() => {
  if (checkUpperSubtotalPlayerThree.value >= 63) {
    return 35
  } else {
    return 0
  }
})

const checkUpperTotalPlayerThree = computed(() => {
  return checkUpperSubtotalPlayerThree.value + checkBonusPlayerThree.value
})

const checkLowerTotalPlayerThree = computed(() => {
  if (!scores.value) { return 0 }
  let subtotal = 0
  if (scores.value.playerThree.threeOfAKind !== 0) { subtotal += scores.value.playerThree.threeOfAKind }
  if (scores.value.playerThree.fourOfAKind !== 0) { subtotal += scores.value.playerThree.fourOfAKind }
  if (scores.value.playerThree.fullHouse !== 0) { subtotal += scores.value.playerThree.fullHouse }
  if (scores.value.playerThree.smallStraight !== 0) { subtotal += scores.value.playerThree.smallStraight }
  if (scores.value.playerThree.largeStraight !== 0) { subtotal += scores.value.playerThree.largeStraight }
  if (scores.value.playerThree.dice !== 0) { subtotal += scores.value.playerThree.dice }
  if (scores.value.playerThree.chance !== 0) { subtotal += scores.value.playerThree.chance }

  return subtotal
})

const checkTotalPlayerThree = computed(() => {
  return checkUpperTotalPlayerThree.value + checkLowerTotalPlayerThree.value
})

const checkUpperSubtotalPlayerFour = computed(() => {
  if (!scores.value) { return 0 }
  let subtotal = 0
  if (scores.value.playerFour.one !== 0) { subtotal += scores.value.playerFour.one }
  if (scores.value.playerFour.two !== 0) { subtotal += scores.value.playerFour.two }
  if (scores.value.playerFour.three !== 0) { subtotal += scores.value.playerFour.three }
  if (scores.value.playerFour.four !== 0) { subtotal += scores.value.playerFour.four }
  if (scores.value.playerFour.five !== 0) { subtotal += scores.value.playerFour.five }
  if (scores.value.playerFour.six !== 0) { subtotal += scores.value.player.six }

  return subtotal
})

const checkBonusPlayerFour = computed(() => {
  if (checkUpperSubtotalPlayerFour.value >= 63) {
    return 35
  } else {
    return 0
  }
})

const checkUpperTotalPlayerFour = computed(() => {
  return checkUpperSubtotalPlayerFour.value + checkBonusPlayerFour.value
})

const checkLowerTotalPlayerFour = computed(() => {
  if (!scores.value) { return 0 }
  let subtotal = 0
  if (scores.value.playerFour.threeOfAKind !== 0) { subtotal += scores.value.playerFour.threeOfAKind }
  if (scores.value.playerFour.fourOfAKind !== 0) { subtotal += scores.value.playerFour.fourOfAKind }
  if (scores.value.playerFour.fullHouse !== 0) { subtotal += scores.value.playerFour.fullHouse }
  if (scores.value.playerFour.smallStraight !== 0) { subtotal += scores.value.playerFour.smallStraight }
  if (scores.value.playerFour.largeStraight !== 0) { subtotal += scores.value.playerFour.largeStraight }
  if (scores.value.playerFour.dice !== 0) { subtotal += scores.value.playerFour.dice }
  if (scores.value.playerFour.chance !== 0) { subtotal += scores.value.playerFour.chance }

  return subtotal
})

const checkTotalPlayerFour = computed(() => {
  return checkUpperTotalPlayerFour.value + checkLowerTotalPlayerFour.value
})
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
