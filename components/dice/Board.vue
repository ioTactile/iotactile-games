<template>
  <v-card v-if="scores && user" rounded="0" class="card-container">
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
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveOneInput()"
          >
            {{ oneInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.one !== 0 ? scores.playerOne.one : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.two"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveTwoInput()"
          >
            {{ twoInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.two !== 0 ? scores.playerOne.two : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.three"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveThreeInput()"
          >
            {{ threeInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.three !== 0 ? scores.playerOne.three : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.four"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFourInput()"
          >
            {{ fourInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.four !== 0 ? scores.playerOne.four : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.five"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFiveInput()"
          >
            {{ fiveInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.five !== 0 ? scores.playerOne.five : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.six"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveSixInput()"
          >
            {{ sixInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.six !== 0 ? scores.playerOne.six : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperSubtotalPlayerOne ? checkUpperSubtotalPlayerOne : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkBonusPlayerOne ? checkBonusPlayerOne : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperTotalPlayerOne ? checkUpperTotalPlayerOne : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.threeOfAKind"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveThreeOfAKindInput()"
          >
            {{ threeOfAKindInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.threeOfAKind !== 0 ? scores.playerOne.threeOfAKind : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.fourOfAKind"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFourOfAKindInput()"
          >
            {{ fourOfAKindInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.fourOfAKind !== 0 ? scores.playerOne.fourOfAKind : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.fullHouse"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFullHouseInput()"
          >
            {{ fullHouseInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.fullHouse !== 0 ? scores.playerOne.fullHouse : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.smallStraight"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveSmallStraightInput()"
          >
            {{ smallStraightInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.smallStraight !== 0 ? scores.playerOne.smallStraight : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.largeStraight"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveLargeStraightInput()"
          >
            {{ largeStraightInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.largeStraight !== 0 ? scores.playerOne.largeStraight : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.dice"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveDiceInput()"
          >
            {{ diceInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.dice !== 0 ? scores.playerOne.dice : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnOne && !scores.playerOne.chance"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveChanceInput()"
          >
            {{ diceChance }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerOne.chance !== 0 ? scores.playerOne.chance : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkLowerTotalPlayerOne ? checkLowerTotalPlayerOne : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkTotalPlayerOne ? checkTotalPlayerOne : '_' }}</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col v-else class="bg-dicePrimary px-0" />
      <v-col v-if="scores.playerTwo" class="px-0">
        <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom text-center">B</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveOneInput()"
          >
            {{ oneInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.one !== 0 ? scores.playerTwo.one : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.two"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveTwoInput()"
          >
            {{ twoInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.two !== 0 ? scores.playerTwo.two : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.three"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveThreeInput()"
          >
            {{ threeInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.three !== 0 ? scores.playerTwo.three : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.four"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFourInput()"
          >
            {{ fourInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.four !== 0 ? scores.playerTwo.four : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.five"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFiveInput()"
          >
            {{ fiveInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.five !== 0 ? scores.playerTwo.five : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.six"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveSixInput()"
          >
            {{ sixInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.six !== 0 ? scores.playerTwo.six : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperSubtotalPlayerTwo ? checkUpperSubtotalPlayerTwo : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkBonusPlayerTwo ? checkBonusPlayerTwo : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperTotalPlayerTwo ? checkUpperTotalPlayerTwo : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.threeOfAKindInput"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveThreeOfAKindInput()"
          >
            {{ threeOfAKindInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.threeOfAKind !== 0 ? scores.playerTwo.threeOfAKind : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.fourOfAKindInput"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFourOfAKindInput()"
          >
            {{ fourOfAKindInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.fourOfAKind !== 0 ? scores.playerTwo.fourOfAKind : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.fullHouseInput"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFullHouseInput()"
          >
            {{ fullHouseInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.fullHouse !== 0 ? scores.playerTwo.fullHouse : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.smallStraightInput"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveSmallStraightInput()"
          >
            {{ smallStraightInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.smallStraight !== 0 ? scores.playerTwo.smallStraight : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.largeStraightInput"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveLargeStraightInput()"
          >
            {{ largeStraightInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.largeStraight !== 0 ? scores.playerTwo.largeStraight : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.diceInput"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveDiceInput()"
          >
            {{ diceInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.dice !== 0 ? scores.playerTwo.dice : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnTwo && !scores.playerTwo.chanceInput"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveChanceInput()"
          >
            {{ chanceInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerTwo.chance !== 0 ? scores.playerTwo.chance : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkLowerTotalPlayerTwo ? checkLowerTotalPlayerTwo : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkTotalPlayerTwo ? checkTotalPlayerTwo : '_' }}</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col v-else class="bg-dicePrimary px-0" />
      <v-col v-if="scores.playerThree" class="px-0">
        <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom text-center">C</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveOneInput()"
          >
            {{ oneInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.one !== 0 ? scores.playerThree.one : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.two"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveTwoInput()"
          >
            {{ twoInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.two !== 0 ? scores.playerThree.two : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.three"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveThreeInput()"
          >
            {{ threeInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.three !== 0 ? scores.playerThree.three : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.four"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFourInput()"
          >
            {{ fourInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.four !== 0 ? scores.playerThree.four : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.five"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFiveInput()"
          >
            {{ fiveInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.five !== 0 ? scores.playerThree.five : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.six"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveSixInput()"
          >
            {{ sixInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.six !== 0 ? scores.playerThree.six : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperSubtotalPlayerThree ? checkUpperSubtotalPlayerThree : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkBonusPlayerThree ? checkBonusPlayerThree : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperTotalPlayerThree ? checkUpperTotalPlayerThree : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveThreeOfAKindInput()"
          >
            {{ threeOfAKindInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.threeOfAKind !== 0 ? scores.playerThree.threeOfAKind : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFourOfAKindInput()"
          >
            {{ fourOfAKindInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.fourOfAKind !== 0 ? scores.playerThree.fourOfAKind : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFullHouseInput()"
          >
            {{ fullHouseInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.fullHouse !== 0 ? scores.playerThree.fullHouse : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveSmallStraightInput()"
          >
            {{ smallStraightInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.smallStraight !== 0 ? scores.playerThree.smallStraight : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveLargeStraightInput()"
          >
            {{ largeStraightInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.largeStraight !== 0 ? scores.playerThree.largeStraight : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveDiceInput()"
          >
            {{ diceInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.dice !== 0 ? scores.playerThree.dice : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnThree && !scores.playerThree.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveChanceInput()"
          >
            {{ chanceInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerThree.chance !== 0 ? scores.playerThree.chance : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkLowerTotalPlayerThree ? checkLowerTotalPlayerThree : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkTotalPlayerThree ? checkTotalPlayerThree : '_' }}</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col v-else class="bg-dicePrimary px-0" />
      <v-col v-if="scores.playerFour" class="px-0">
        <div class="d-flex flex-column justify-center text-subtitle-2">
          <span class="bg-dicePrimary big-divider border-bottom text-center">D</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.one"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveOneInput()"
          >
            {{ oneInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.one !== 0 ? scores.playerFour.one : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.two"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveTwoInput()"
          >
            {{ twoInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.two !== 0 ? scores.playerFour.two : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.three"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveThreeInput()"
          >
            {{ threeInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.three !== 0 ? scores.playerFour.three : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.four"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFourInput()"
          >
            {{ fourInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.four !== 0 ? scores.playerFour.four : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.five"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFiveInput()"
          >
            {{ fiveInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.five !== 0 ? scores.playerFour.five : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.six"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveSixInput()"
          >
            {{ sixInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.six !== 0 ? scores.playerFour.six : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperSubtotalPlayerFour ? checkUpperSubtotalPlayerFour : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkBonusPlayerFour ? checkBonusPlayerFour : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkUpperTotalPlayerFour ? checkUpperTotalPlayerFour : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.threeOfAKind"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveThreeOfAKindInput()"
          >
            {{ threeOfAKindInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.threeOfAKind !== 0 ? scores.playerFour.threeOfAKind : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.fourOfAKind"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFourOfAKindInput()"
          >
            {{ fourOfAKindInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.fourOfAKind !== 0 ? scores.playerFour.fourOfAKind : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.fullHouse"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveFullHouseInput()"
          >
            {{ fullHouseInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.fullHouse !== 0 ? scores.playerFour.fullHouse : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.smallStraight"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveSmallStraightInput()"
          >
            {{ smallStraightInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.smallStraight !== 0 ? scores.playerFour.smallStraight : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.largeStraight"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveLargeStraightInput()"
          >
            {{ largeStraightInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.largeStraight !== 0 ? scores.playerFour.largeStraight : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.dice"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveDiceInput()"
          >
            {{ diceInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.dice !== 0 ? scores.playerFour.dice : '_' }}</span>
          <v-btn
            v-if="isDices && isPlayerTurnFour && !scores.playerFour.chance"
            variant="plain"
            height="23"
            class="border-bottom"
            rounded="0"
            @click="saveChanceInput()"
          >
            {{ chanceInput }}
          </v-btn><span v-else class="border-bottom text-center">{{ scores.playerFour.chance !== 0 ? scores.playerFour.chance : '_' }}</span>
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkLowerTotalPlayerFour ? checkLowerTotalPlayerFour : '_' }}</span>
          <span class="bg-dicePrimary divider border-bottom text-center" />
          <span class="font-weight-bold bg-dicePrimary border-bottom text-center">{{ checkTotalPlayerFour ? checkTotalPlayerFour : '_' }}</span>
          <span class="bg-dicePrimary divider" />
        </div>
      </v-col>
      <v-col v-else class="bg-dicePrimary px-0" />
    </v-row>
  </v-card>
</template>

<script lang="ts" setup>
import { doc, collection, setDoc } from 'firebase/firestore'
import { useFirestore, useDocument } from 'vuefire'
import { diceSessionConverter, diceSessionPlayerTurnConverter } from '~/stores'

const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

const sessionRef = doc(db, 'diceSessions', route.params.id as string).withConverter(diceSessionConverter)
const session = useDocument(doc(collection(db, 'diceSessions'), sessionRef.id))
const playerTurnRef = doc(db, 'diceSessionPlayerTurn', route.params.id as string).withConverter(diceSessionPlayerTurnConverter)
const playerTurn = useDocument(doc(collection(db, 'diceSessionPlayerTurn'), playerTurnRef.id))
const scoresRef = doc(db, 'diceSessionScores', route.params.id as string)
const scores = useDocument(doc(collection(db, 'diceSessionScores'), scoresRef.id))

const diceOnBoard = computed(() => {
  if (!session.value) { return [] }
  return session.value.diceOnBoard
})
const diceOnHand = computed(() => {
  if (!session.value) { return [] }
  return session.value.diceOnHand
})
const dices = computed(() => {
  if (!session.value) { return [] }
  return [...diceOnBoard.value, ...diceOnHand.value]
})
const isPlayerTurnOne = computed(() => {
  if (playerTurn.value?.playerId !== session.value?.players[0].id) { return false }
  return true
})
const isPlayerTurnTwo = computed(() => {
  if (playerTurn.value?.playerId !== session.value?.players[1].id) { return false }
  return true
})
const isPlayerTurnThree = computed(() => {
  if (playerTurn.value?.playerId !== session.value?.players[2].id) { return false }
  return true
})
const isPlayerTurnFour = computed(() => {
  if (playerTurn.value?.playerId !== session.value?.players[3].id) { return false }
  return true
})

const switchPlayerTurn = async () => {
  if (!session.value) { return }
  const playerTurnIndex = session.value.players.findIndex((player: any) => player.id === playerTurn.value?.playerId)
  const nextPlayerTurnIndex = playerTurnIndex === session.value.players.length - 1 ? 0 : playerTurnIndex + 1
  await setDoc(playerTurnRef, { playerId: session.value.players[nextPlayerTurnIndex].id }, { merge: true })
}

const isDices = computed(() => {
  if (!session.value) { return false }
  if (session.value.diceOnHand.length < 1 && session.value.diceOnBoard.length < 1) { return false }
  return true
})

// Inputs value

const oneInput = computed(() => {
  if (!session.value) { return 0 }
  const ones = dices.value.filter(dice => dice.value === 1)
  return ones.reduce((acc, dice) => acc + dice.value, 0)
})
const twoInput = computed(() => {
  if (!session.value) { return 0 }
  const twos = dices.value.filter(dice => dice.value === 2)
  return twos.reduce((acc, dice) => acc + dice.value, 0)
})
const threeInput = computed(() => {
  if (!session.value) { return 0 }
  const threes = dices.value.filter(dice => dice.value === 3)
  return threes.reduce((acc, dice) => acc + dice.value, 0)
})
const fourInput = computed(() => {
  if (!session.value) { return 0 }
  const fours = dices.value.filter(dice => dice.value === 4)
  return fours.reduce((acc, dice) => acc + dice.value, 0)
})
const fiveInput = computed(() => {
  if (!session.value) { return 0 }
  const fives = dices.value.filter(dice => dice.value === 5)
  return fives.reduce((acc, dice) => acc + dice.value, 0)
})
const sixInput = computed(() => {
  if (!session.value) { return 0 }
  const sixes = dices.value.filter(dice => dice.value === 6)
  return sixes.reduce((acc, dice) => acc + dice.value, 0)
})
const threeOfAKindInput = computed(() => {
  if (!session.value) { return 0 }
  let ThreeOfAKind = false
  const newDices = dices.value
  for (let i = 0; newDices.length; i++) {
    if (newDices[i].value === newDices[i + 1].value && newDices[i].value === newDices[i + 2].value) {
      ThreeOfAKind = true
      break
    }
  }
  if (ThreeOfAKind) {
    return dices.value.reduce((acc, dice) => acc + dice.value, 0)
  } else {
    return 0
  }
})
const fourOfAKindInput = computed(() => {
  if (!session.value) { return 0 }
  let FourOfAKind = false
  const newDices = dices.value
  for (let i = 0; newDices.length; i++) {
    if (newDices[i].value === newDices[i + 1].value && newDices[i].value === newDices[i + 2].value && newDices[i].value === newDices[i + 3].value) {
      FourOfAKind = true
      break
    }
  }
  if (FourOfAKind) {
    return dices.value.reduce((acc, dice) => acc + dice.value, 0)
  } else {
    return 0
  }
})
const fullHouseInput = computed(() => {
  if (!session.value) { return 0 }
  const newDices = dices.value.sort()
  if ((newDices[0].value === newDices[1].value && newDices[1].value === newDices[2].value && newDices[3].value === newDices[4].value) ||
    (newDices[0].value === newDices[1].value && newDices[2].value === newDices[3].value && newDices[3].value === newDices[4].value)) {
    return 25
  } else {
    return 0
  }
})
const smallStraightInput = computed(() => {
  if (!session.value) { return 0 }
  dices.value.sort()
  if (dices.value.includes(1) && dices.value.includes(2) && dices.value.includes(3) && dices.value.includes(4)) {
    return 30
  } else if (dices.value.includes(2) && dices.value.includes(3) && dices.value.includes(4) && dices.value.includes(5)) {
    return 30
  } else if (dices.value.includes(3) && dices.value.includes(4) && dices.value.includes(5) && dices.value.includes(6)) {
    return 30
  } else {
    return 0
  }
})
const largeStraightInput = computed(() => {
  if (!session.value) { return 0 }
  dices.value.sort()
  if (dices.value.includes(1) && dices.value.includes(2) && dices.value.includes(3) && dices.value.includes(4) && dices.value.includes(5)) {
    return 40
  } else if (dices.value.includes(2) && dices.value.includes(3) && dices.value.includes(4) && dices.value.includes(5) && dices.value.includes(6)) {
    return 40
  } else {
    return 0
  }
})
const diceInput = computed(() => {
  if (!session.value) { return 0 }
  const newDices = dices.value.filter((dice) => {
    const newDices = dices.value.filter(d => d.value === dice.value)
    return newDices.length === 5
  })
  if (newDices.length === 5) {
    return 50
  } else {
    return 0
  }
})
const diceChance = computed(() => {
  if (!session.value) { return 0 }
  return dices.value.reduce((acc, dice) => acc + dice.value, 0)
})

// Save Inputs value

const saveOneInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.one = oneInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.one = oneInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.one = oneInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.one = oneInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveTwoInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.two = twoInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.two = twoInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.two = twoInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.two = twoInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveThreeInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.three = threeInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.three = threeInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.three = threeInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.three = threeInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveFourInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.four = fourInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.four = fourInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.four = fourInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.four = fourInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveFiveInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.five = fiveInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.five = fiveInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.five = fiveInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.five = fiveInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveSixInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.six = sixInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.six = sixInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.six = sixInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.six = sixInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveThreeOfAKindInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.threeOfAKind = threeOfAKindInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.threeOfAKind = threeOfAKindInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.threeOfAKind = threeOfAKindInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.threeOfAKind = threeOfAKindInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveFourOfAKindInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.fourOfAKind = fourOfAKindInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.fourOfAKind = fourOfAKindInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.fourOfAKind = fourOfAKindInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.fourOfAKind = fourOfAKindInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveFullHouseInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.fullHouse = fullHouseInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.fullHouse = fullHouseInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.fullHouse = fullHouseInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.fullHouse = fullHouseInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveSmallStraightInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.smallStraight = smallStraightInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.smallStraight = smallStraightInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.smallStraight = smallStraightInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.smallStraight = smallStraightInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveLargeStraightInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.largeStraight = largeStraightInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.largeStraight = largeStraightInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.largeStraight = largeStraightInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.largeStraight = largeStraightInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveDiceInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.dice = diceInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.dice = diceInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.dice = diceInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.dice = diceInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveChanceInput = async () => {
  if (!session.value) { return }
  if (!scores.value) { return }
  if (user.value.uid === session.value.players[0].id) {
    scores.value.playerOne.chance = chanceInput.value
  } else if (user.value.uid === session.value.players[1].id) {
    scores.value.playerTwo.chance = chanceInput.value
  } else if (user.value.uid === session.value.players[2].id) {
    scores.value.playerThree.chance = chanceInput.value
  } else if (user.value.uid === session.value.players[3].id) {
    scores.value.playerFour.chance = chanceInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

// Check Scores Values

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
