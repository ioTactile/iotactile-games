<template>
  <v-card v-if="scores && user && players" :rounded="0" class="card-container">
    <v-row>
      <v-col cols="12" class="pr-0">
        <v-table :density="isFullscreen ? 'default' : 'compact'">
          <thead>
            <tr>
              <th
                class="text-center border-darker bg-diceClosePrimary"
                width="40%"
              />
              <th
                class="text-center border-darker bg-diceClosePrimary"
                width="15%"
              >
                A
              </th>
              <th
                class="text-center border-darker bg-diceClosePrimary"
                width="15%"
              >
                {{ players.length > 1 ? 'B' : '' }}
              </th>
              <th
                class="text-center border-darker bg-diceClosePrimary"
                width="15%"
              >
                {{ players.length > 2 ? 'C' : '' }}
              </th>
              <th class="text-center bg-diceClosePrimary" width="15%">
                {{ players.length > 3 ? 'D' : '' }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="border-lighter">
                Un
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices && isPlayerTurnOne && scores.playerOne.one === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveOneInput()"
                >
                  {{ oneInput }}
                </v-btn><span v-else class="indie-flower">{{
                  scores.playerOne.one !== 69 ? scores.playerOne.one : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices && isPlayerTurnTwo && scores.playerTwo.one === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveOneInput()"
                  >
                    {{ oneInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerTwo.one !== 69 ? scores.playerTwo.one : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.one === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveOneInput()"
                  >
                    {{ oneInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerThree.one !== 69 ? scores.playerThree.one : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.one === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveOneInput()"
                  >
                    {{ oneInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerFour.one !== 69 ? scores.playerFour.one : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Deux
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices && isPlayerTurnOne && scores.playerOne.two === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveTwoInput()"
                >
                  {{ twoInput }}
                </v-btn><span v-else class="indie-flower">{{
                  scores.playerOne.two !== 69 ? scores.playerOne.two : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices && isPlayerTurnTwo && scores.playerTwo.two === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveTwoInput()"
                  >
                    {{ twoInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerTwo.two !== 69 ? scores.playerTwo.two : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.two === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveTwoInput()"
                  >
                    {{ twoInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerThree.two !== 69 ? scores.playerThree.two : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.two === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveTwoInput()"
                  >
                    {{ twoInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerFour.two !== 69 ? scores.playerFour.two : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Trois
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices && isPlayerTurnOne && scores.playerOne.three === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveThreeInput()"
                >
                  {{ threeInput }}
                </v-btn><span v-else class="indie-flower">{{
                  scores.playerOne.three !== 69 ? scores.playerOne.three : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices && isPlayerTurnTwo && scores.playerTwo.three === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveThreeInput()"
                  >
                    {{ threeInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerTwo.three !== 69 ? scores.playerTwo.three : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.three === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveThreeInput()"
                  >
                    {{ threeInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerThree.three !== 69
                      ? scores.playerThree.three
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.three === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveThreeInput()"
                  >
                    {{ threeInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerFour.three !== 69
                      ? scores.playerFour.three
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Quatre
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices && isPlayerTurnOne && scores.playerOne.four === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveFourInput()"
                >
                  {{ fourInput }}
                </v-btn><span v-else class="indie-flower">{{
                  scores.playerOne.four !== 69 ? scores.playerOne.four : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices && isPlayerTurnTwo && scores.playerTwo.four === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveFourInput()"
                  >
                    {{ fourInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerTwo.four !== 69 ? scores.playerTwo.four : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.four === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveFourInput()"
                  >
                    {{ fourInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerThree.four !== 69
                      ? scores.playerThree.four
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.four === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveFourInput()"
                  >
                    {{ fourInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerFour.four !== 69 ? scores.playerFour.four : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Cinq
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices && isPlayerTurnOne && scores.playerOne.five === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveFiveInput()"
                >
                  {{ fiveInput }}
                </v-btn><span v-else class="indie-flower">{{
                  scores.playerOne.five !== 69 ? scores.playerOne.five : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices && isPlayerTurnTwo && scores.playerTwo.five === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveFiveInput()"
                  >
                    {{ fiveInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerTwo.five !== 69 ? scores.playerTwo.five : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.five === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveFiveInput()"
                  >
                    {{ fiveInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerThree.five !== 69
                      ? scores.playerThree.five
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.five === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveFiveInput()"
                  >
                    {{ fiveInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerFour.five !== 69 ? scores.playerFour.five : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Six
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices && isPlayerTurnOne && scores.playerOne.six === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveSixInput()"
                >
                  {{ sixInput }}
                </v-btn><span v-else class="indie-flower">{{
                  scores.playerOne.six !== 69 ? scores.playerOne.six : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices && isPlayerTurnTwo && scores.playerTwo.six === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveSixInput()"
                  >
                    {{ sixInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerTwo.six !== 69 ? scores.playerTwo.six : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.six === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveSixInput()"
                  >
                    {{ sixInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerThree.six !== 69 ? scores.playerThree.six : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.six === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveSixInput()"
                  >
                    {{ sixInput }}
                  </v-btn><span v-else class="indie-flower">{{
                    scores.playerFour.six !== 69 ? scores.playerFour.six : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="bg-diceClosePrimary border-darker">
                Sous-total
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <span class="font-weight-bold">{{
                  checkUpperSubtotalPlayerOne !== 0
                    ? checkUpperSubtotalPlayerOne
                    : ''
                }}</span>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerTwo">
                  <span class="font-weight-bold">{{
                    checkUpperSubtotalPlayerTwo !== 0
                      ? checkUpperSubtotalPlayerTwo
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerThree">
                  <span class="font-weight-bold">{{
                    checkUpperSubtotalPlayerThree !== 0
                      ? checkUpperSubtotalPlayerThree
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary">
                <div v-if="scores.playerFour">
                  <span class="font-weight-bold">{{
                    checkUpperSubtotalPlayerFour !== 0
                      ? checkUpperSubtotalPlayerFour
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="bg-diceClosePrimary border-darker">
                Bonus (à partir de 63)
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <span class="font-weight-bold">{{
                  checkBonusPlayerOne !== 0 ? checkBonusPlayerOne : ''
                }}</span>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerTwo">
                  <span class="font-weight-bold">{{
                    checkBonusPlayerTwo !== 0 ? checkBonusPlayerTwo : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerThree">
                  <span class="font-weight-bold">{{
                    checkBonusPlayerThree !== 0 ? checkBonusPlayerThree : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary">
                <div v-if="scores.playerFour">
                  <span class="font-weight-bold">{{
                    checkBonusPlayerFour !== 0 ? checkBonusPlayerFour : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="bg-diceClosePrimary border-darker">
                Total de la partie supérieure
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <span class="font-weight-bold">{{
                  checkUpperTotalPlayerOne !== 0 ? checkUpperTotalPlayerOne : ''
                }}</span>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerTwo">
                  <span class="font-weight-bold">{{
                    checkUpperTotalPlayerTwo !== 0 ? checkUpperTotalPlayerTwo : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerThree">
                  <span class="font-weight-bold">{{
                    checkUpperTotalPlayerThree !== 0
                      ? checkUpperTotalPlayerThree
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary">
                <div v-if="scores.playerFour">
                  <span class="font-weight-bold">{{
                    checkUpperTotalPlayerFour !== 0
                      ? checkUpperTotalPlayerFour
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                3 identiques
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices &&
                      isPlayerTurnOne &&
                      scores.playerOne.threeOfAKind === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveThreeOfAKindInput()"
                >
                  {{ threeOfAKindInput }}
                </v-btn>
                <span v-else class="indie-flower">{{
                  scores.playerOne.threeOfAKind !== 69
                    ? scores.playerOne.threeOfAKind
                    : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnTwo &&
                        scores.playerTwo.threeOfAKind === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveThreeOfAKindInput()"
                  >
                    {{ threeOfAKindInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerTwo.threeOfAKind !== 69
                      ? scores.playerTwo.threeOfAKind
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.threeOfAKind === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveThreeOfAKindInput()"
                  >
                    {{ threeOfAKindInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerThree.threeOfAKind !== 69
                      ? scores.playerThree.threeOfAKind
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.threeOfAKind === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveThreeOfAKindInput()"
                  >
                    {{ threeOfAKindInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerFour.threeOfAKind !== 69
                      ? scores.playerFour.threeOfAKind
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                4 identiques
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices &&
                      isPlayerTurnOne &&
                      scores.playerOne.fourOfAKind === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveFourOfAKindInput()"
                >
                  {{ fourOfAKindInput }}
                </v-btn>
                <span v-else class="indie-flower">{{
                  scores.playerOne.fourOfAKind !== 69
                    ? scores.playerOne.fourOfAKind
                    : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnTwo &&
                        scores.playerTwo.fourOfAKind === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveFourOfAKindInput()"
                  >
                    {{ fourOfAKindInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerTwo.fourOfAKind !== 69
                      ? scores.playerTwo.fourOfAKind
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.fourOfAKind === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveFourOfAKindInput()"
                  >
                    {{ fourOfAKindInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerThree.fourOfAKind !== 69
                      ? scores.playerThree.fourOfAKind
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.fourOfAKind === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveFourOfAKindInput()"
                  >
                    {{ fourOfAKindInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerFour.fourOfAKind !== 69
                      ? scores.playerFour.fourOfAKind
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Full house
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices &&
                      isPlayerTurnOne &&
                      scores.playerOne.fullHouse === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveFullHouseInput()"
                >
                  {{ fullHouseInput }}
                </v-btn>
                <span v-else class="indie-flower">{{
                  scores.playerOne.fullHouse !== 69
                    ? scores.playerOne.fullHouse
                    : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnTwo &&
                        scores.playerTwo.fullHouse === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveFullHouseInput()"
                  >
                    {{ fullHouseInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerTwo.fullHouse !== 69
                      ? scores.playerTwo.fullHouse
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.fullHouse === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveFullHouseInput()"
                  >
                    {{ fullHouseInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerThree.fullHouse !== 69
                      ? scores.playerThree.fullHouse
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.fullHouse === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveFullHouseInput()"
                  >
                    {{ fullHouseInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerFour.fullHouse !== 69
                      ? scores.playerFour.fullHouse
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Petite suite
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices &&
                      isPlayerTurnOne &&
                      scores.playerOne.smallStraight === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveSmallStraightInput()"
                >
                  {{ smallStraightInput }}
                </v-btn>
                <span v-else class="indie-flower">{{
                  scores.playerOne.smallStraight !== 69
                    ? scores.playerOne.smallStraight
                    : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnTwo &&
                        scores.playerTwo.smallStraight === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveSmallStraightInput()"
                  >
                    {{ smallStraightInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerTwo.smallStraight !== 69
                      ? scores.playerTwo.smallStraight
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.smallStraight === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveSmallStraightInput()"
                  >
                    {{ smallStraightInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerThree.smallStraight !== 69
                      ? scores.playerThree.smallStraight
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.smallStraight === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveSmallStraightInput()"
                  >
                    {{ smallStraightInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerFour.smallStraight !== 69
                      ? scores.playerFour.smallStraight
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Grande suite
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices &&
                      isPlayerTurnOne &&
                      scores.playerOne.largeStraight === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveLargeStraightInput()"
                >
                  {{ largeStraightInput }}
                </v-btn>
                <span v-else class="indie-flower">{{
                  scores.playerOne.largeStraight !== 69
                    ? scores.playerOne.largeStraight
                    : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnTwo &&
                        scores.playerTwo.largeStraight === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveLargeStraightInput()"
                  >
                    {{ largeStraightInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerTwo.largeStraight !== 69
                      ? scores.playerTwo.largeStraight
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.largeStraight === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveLargeStraightInput()"
                  >
                    {{ largeStraightInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerThree.largeStraight !== 69
                      ? scores.playerThree.largeStraight
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.largeStraight === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveLargeStraightInput()"
                  >
                    {{ largeStraightInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerFour.largeStraight !== 69
                      ? scores.playerFour.largeStraight
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                5 identiques
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices && isPlayerTurnOne && scores.playerOne.dice === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveDiceInput()"
                >
                  {{ diceInput }}
                </v-btn>
                <span v-else class="indie-flower">{{
                  scores.playerOne.dice !== 69 ? scores.playerOne.dice : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices && isPlayerTurnTwo && scores.playerTwo.dice === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveDiceInput()"
                  >
                    {{ diceInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerTwo.dice !== 69 ? scores.playerTwo.dice : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.dice === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveDiceInput()"
                  >
                    {{ diceInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerThree.dice !== 69
                      ? scores.playerThree.dice
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.dice === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveDiceInput()"
                  >
                    {{ diceInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerFour.dice !== 69 ? scores.playerFour.dice : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="border-lighter">
                Chance
              </td>
              <td class="text-center border-lighter">
                <v-btn
                  v-if="
                    isDices && isPlayerTurnOne && scores.playerOne.chance === 69
                  "
                  :disabled="playerOne()"
                  variant="plain"
                  height="23"
                  rounded="0"
                  class="indie-flower"
                  @click="saveChanceInput()"
                >
                  {{ chanceInput }}
                </v-btn>
                <span v-else class="indie-flower">{{
                  scores.playerOne.chance !== 69 ? scores.playerOne.chance : ''
                }}</span>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerTwo">
                  <v-btn
                    v-if="
                      isDices && isPlayerTurnTwo && scores.playerTwo.chance === 69
                    "
                    :disabled="playerTwo()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    class="indie-flower"
                    @click="saveChanceInput()"
                  >
                    {{ chanceInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerTwo.chance !== 69 ? scores.playerTwo.chance : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerThree">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnThree &&
                        scores.playerThree.chance === 69
                    "
                    :disabled="playerThree()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveChanceInput()"
                  >
                    {{ chanceInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerThree.chance !== 69
                      ? scores.playerThree.chance
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center border-lighter">
                <div v-if="scores.playerFour">
                  <v-btn
                    v-if="
                      isDices &&
                        isPlayerTurnFour &&
                        scores.playerFour.chance === 69
                    "
                    :disabled="playerFour()"
                    variant="plain"
                    height="23"
                    rounded="0"
                    @click="saveChanceInput()"
                  >
                    {{ chanceInput }}
                  </v-btn>
                  <span v-else class="indie-flower">{{
                    scores.playerFour.chance !== 69
                      ? scores.playerFour.chance
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="bg-diceClosePrimary border-darker">
                Total de la partie inférieure
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <span class="font-weight-bold">{{
                  checkLowerTotalPlayerOne !== 0 ? checkLowerTotalPlayerOne : ''
                }}</span>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerTwo">
                  <span class="font-weight-bold">{{
                    checkLowerTotalPlayerTwo !== 0 ? checkLowerTotalPlayerTwo : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerThree">
                  <span class="font-weight-bold">{{
                    checkLowerTotalPlayerThree !== 0
                      ? checkLowerTotalPlayerThree
                      : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary">
                <div v-if="scores.playerFour">
                  <span class="font-weight-bold">{{
                    checkLowerTotalPlayerFour !== 0
                      ? checkLowerTotalPlayerFour
                      : ''
                  }}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td class="bg-diceClosePrimary border-darker">
                Total de la partie
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <span class="font-weight-bold">{{
                  checkTotalPlayerOne !== 0 ? checkTotalPlayerOne : ''
                }}</span>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerTwo">
                  <span class="font-weight-bold">{{
                    checkTotalPlayerTwo !== 0 ? checkTotalPlayerTwo : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary border-darker">
                <div v-if="scores.playerThree">
                  <span class="font-weight-bold">{{
                    checkTotalPlayerThree !== 0 ? checkTotalPlayerThree : ''
                  }}</span>
                </div>
              </td>
              <td class="text-center bg-diceClosePrimary">
                <div v-if="scores.playerFour">
                  <span class="font-weight-bold">{{
                    checkTotalPlayerFour !== 0 ? checkTotalPlayerFour : ''
                  }}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts" setup async>
import { VCard, VRow, VCol, VTable, VBtn } from 'vuetify/components'
import {
  doc, collection, setDoc
} from 'firebase/firestore'
import {
  diceSessionPlayerTurnConverter,
  diceSessionRemainingTurnsConverter,
  diceSessionPlayerTriesConverter,
  diceSessionDicesConverter,
  diceSessionScoreConverter
} from '~/stores'
import { Dice, CardUser } from '~/functions/src/types'

// Props

const props = defineProps<{
 isFullscreen: boolean,
 players: CardUser[],
 playerTurnId: string,
 remainingTurns: number,
 dices: Dice[]
}>()

// Vuefire

const db = useFirestore()
const user = useCurrentUser()
const route = useRoute()

// Firestore

const sessionId = route.params.id as string

const playerTurnRef = doc(db, 'diceSessionPlayerTurn', sessionId).withConverter(
  diceSessionPlayerTurnConverter
)

const remainingTurnsRef = doc(
  db,
  'diceSessionRemainingTurns',
  sessionId
).withConverter(diceSessionRemainingTurnsConverter)

const cupsRef = doc(db, 'diceSessionPlayerTries', sessionId).withConverter(
  diceSessionPlayerTriesConverter
)

const scoresRef = doc(db, 'diceSessionScores', sessionId).withConverter(
  diceSessionScoreConverter
)

const dicesRef = doc(db, 'diceSessionDices', sessionId).withConverter(
  diceSessionDicesConverter
)

const scores = useDocument(
  doc(collection(db, 'diceSessionScores'), scoresRef.id)
)

// Computed values

const isPlayerTurnOne = computed(() => {
  if (!props.playerTurnId) {
    return
  }
  if (props.playerTurnId === props.players[0].id) {
    return true
  }
  return false
})

const isPlayerTurnTwo = computed(() => {
  if (!props.playerTurnId) {
    return
  }
  if (props.playerTurnId === props.players[1].id) {
    return true
  }
  return false
})

const isPlayerTurnThree = computed(() => {
  if (!props.playerTurnId) {
    return
  }
  if (props.playerTurnId === props.players[2].id) {
    return true
  }
  return false
})

const isPlayerTurnFour = computed(() => {
  if (!props.playerTurnId) {
    return
  }
  if (props.playerTurnId === props.players[3].id) {
    return true
  }
  return false
})

const isDices = computed(() => {
  if (!props.dices.length) {
    return false
  }
  return true
})

// Methods

const playerOne = () => {
  if (!user.value) {
    return
  }
  if (user.value.uid === props.players[0].id) {
    return false
  }
  return true
}

const playerTwo = () => {
  if (!user.value) {
    return
  }
  if (user.value.uid === props.players[1].id) {
    return false
  }
  return true
}

const playerThree = () => {
  if (!user.value) {
    return
  }
  if (user.value.uid === props.players[2].id) {
    return false
  }
  return true
}

const playerFour = () => {
  if (!user.value) {
    return
  }
  if (user.value.uid === props.players[3].id) {
    return false
  }
  return true
}

const reduceRemainingTurn = () => {
  if (
    !props.remainingTurns ||
    props.remainingTurns === 0
  ) {
    return
  }
  return props.remainingTurns - 1
}

const switchPlayerTurn = async () => {
  const playerTurnIndex = props.players.findIndex(
    (player: any) => player.id === props.playerTurnId)
  const nextPlayerTurnIndex =
    playerTurnIndex === props.players.length - 1
      ? 0
      : playerTurnIndex + 1

  await setDoc(
    playerTurnRef,
    { playerId: props.players[nextPlayerTurnIndex].id },
    { merge: true }
  )
  await setDoc(
    dicesRef,
    {
      dices: []
    },
    { merge: true }
  )
  await setDoc(
    remainingTurnsRef,
    { remainingTurns: reduceRemainingTurn() },
    { merge: true }
  )
  await setDoc(cupsRef, { tries: 3 }, { merge: true })
}

const playerOneBonus = async () => {
  if (!scores.value) {
    return
  }
  if (scores.value.playerOne.bonus === 35) {
    return
  }
  scores.value.playerOne.bonus = 35
  scores.value.playerOne.total += 35
  await setDoc(scoresRef, scores.value, { merge: true })
}

const playerTwoBonus = async () => {
  if (!scores.value) {
    return
  }
  if (scores.value.playerTwo.bonus === 35) {
    return
  }
  scores.value.playerTwo.bonus = 35
  scores.value.playerTwo.total += 35
  await setDoc(scoresRef, scores.value, { merge: true })
}

const playerThreeBonus = async () => {
  if (!scores.value) {
    return
  }
  if (scores.value.playerThree.bonus === 35) {
    return
  }
  scores.value.playerThree.bonus = 35
  scores.value.playerThree.total += 35
  await setDoc(scoresRef, scores.value, { merge: true })
}

const playerFourBonus = async () => {
  if (!scores.value) {
    return
  }
  if (scores.value.playerFour.bonus === 35) {
    return
  }
  scores.value.playerFour.bonus = 35
  scores.value.playerFour.total += 35
  await setDoc(scoresRef, scores.value, { merge: true })
}

// Inputs value

const oneInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 1).length
  return faceLength * 1
})

const twoInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 2).length
  return faceLength * 2
})

const threeInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 3).length
  return faceLength * 3
})

const fourInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 4).length
  return faceLength * 4
})

const fiveInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 5).length
  return faceLength * 5
})

const sixInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceLength = props.dices.filter((dice: Dice) => dice.face === 6).length
  return faceLength * 6
})

const threeOfAKindInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceCounts: { [key: number]: number } = {}

  for (const dice of props.dices) {
    if (faceCounts[dice.face]) {
      faceCounts[dice.face]++
    } else {
      faceCounts[dice.face] = 1
    }
  }

  const hasThreeOfAKind = Object.values(faceCounts).some((count: number) => count >= 3)

  if (hasThreeOfAKind) {
    return props.dices.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
  } else {
    return 0
  }
})

const fourOfAKindInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const faceCounts: { [key: number]: number } = {}

  for (const dice of props.dices) {
    if (faceCounts[dice.face]) {
      faceCounts[dice.face]++
    } else {
      faceCounts[dice.face] = 1
    }
  }

  const hasFourOfAKind = Object.values(faceCounts).some((count: number) => count >= 4)

  if (hasFourOfAKind) {
    return props.dices.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
  } else {
    return 0
  }
})

const fullHouseInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const sortedDices = props.dices.slice().sort((a: Dice, b: Dice) => a.face - b.face)

  const isFullHouse =
    (sortedDices[0].face === sortedDices[1].face && sortedDices[0].face === sortedDices[2].face && sortedDices[3].face === sortedDices[4].face) ||
    (sortedDices[0].face === sortedDices[1].face && sortedDices[2].face === sortedDices[3].face && sortedDices[2].face === sortedDices[4].face)

  return isFullHouse ? 25 : 0
})

const smallStraightInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const sortedDices = props.dices.slice().sort((a: Dice, b: Dice) => a.face - b.face)

  const faces = new Set(sortedDices.map((dice: Dice) => dice.face))

  const isSmallStraight = (
    (faces.has(1) && faces.has(2) && faces.has(3) && faces.has(4)) ||
    (faces.has(2) && faces.has(3) && faces.has(4) && faces.has(5)) ||
    (faces.has(3) && faces.has(4) && faces.has(5) && faces.has(6))
  )

  return isSmallStraight ? 30 : 0
})

const largeStraightInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const sortedDices = props.dices.slice().sort((a: Dice, b: Dice) => a.face - b.face)

  const isLargeStraight =
    (sortedDices[0].face === 1 && sortedDices[1].face === 2 && sortedDices[2].face === 3 && sortedDices[3].face === 4 && sortedDices[4].face === 5) ||
    (sortedDices[0].face === 2 && sortedDices[1].face === 3 && sortedDices[2].face === 4 && sortedDices[3].face === 5 && sortedDices[4].face === 6)

  return isLargeStraight ? 40 : 0
})

const diceInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const firstFace = props.dices[0].face

  const isDice = props.dices.every((dice: Dice) => dice.face === firstFace)

  return isDice ? 50 : 0
})

const chanceInput = computed(() => {
  if (!props.dices || props.dices.length !== 5) {
    return 0
  }

  const chance = props.dices
  return chance.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
})

// Save Inputs value

const saveOneInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.one = oneInput.value
    scores.value.playerOne.total += oneInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.one = oneInput.value
    scores.value.playerTwo.total += oneInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.one = oneInput.value
    scores.value.playerThree.total += oneInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.one = oneInput.value
    scores.value.playerFour.total += oneInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveTwoInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.two = twoInput.value
    scores.value.playerOne.total += twoInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.two = twoInput.value
    scores.value.playerTwo.total += twoInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.two = twoInput.value
    scores.value.playerThree.total += twoInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.two = twoInput.value
    scores.value.playerFour.total += twoInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveThreeInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.three = threeInput.value
    scores.value.playerOne.total += threeInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.three = threeInput.value
    scores.value.playerTwo.total += threeInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.three = threeInput.value
    scores.value.playerThree.total += threeInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.three = threeInput.value
    scores.value.playerFour.total += threeInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveFourInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.four = fourInput.value
    scores.value.playerOne.total += fourInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.four = fourInput.value
    scores.value.playerTwo.total += fourInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.four = fourInput.value
    scores.value.playerThree.total += fourInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.four = fourInput.value
    scores.value.playerFour.total += fourInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveFiveInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.five = fiveInput.value
    scores.value.playerOne.total += fiveInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.five = fiveInput.value
    scores.value.playerTwo.total += fiveInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.five = fiveInput.value
    scores.value.playerThree.total += fiveInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.five = fiveInput.value
    scores.value.playerFour.total += fiveInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveSixInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.six = sixInput.value
    scores.value.playerOne.total += sixInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.six = sixInput.value
    scores.value.playerTwo.total += sixInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.six = sixInput.value
    scores.value.playerThree.total += sixInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.six = sixInput.value
    scores.value.playerFour.total += sixInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveThreeOfAKindInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.threeOfAKind = threeOfAKindInput.value
    scores.value.playerOne.total += threeOfAKindInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.threeOfAKind = threeOfAKindInput.value
    scores.value.playerTwo.total += threeOfAKindInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.threeOfAKind = threeOfAKindInput.value
    scores.value.playerThree.total += threeOfAKindInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.threeOfAKind = threeOfAKindInput.value
    scores.value.playerFour.total += threeOfAKindInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveFourOfAKindInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.fourOfAKind = fourOfAKindInput.value
    scores.value.playerOne.total += fourOfAKindInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.fourOfAKind = fourOfAKindInput.value
    scores.value.playerTwo.total += fourOfAKindInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.fourOfAKind = fourOfAKindInput.value
    scores.value.playerThree.total += fourOfAKindInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.fourOfAKind = fourOfAKindInput.value
    scores.value.playerFour.total += fourOfAKindInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveFullHouseInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.fullHouse = fullHouseInput.value
    scores.value.playerOne.total += fullHouseInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.fullHouse = fullHouseInput.value
    scores.value.playerTwo.total += fullHouseInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.fullHouse = fullHouseInput.value
    scores.value.playerThree.total += fullHouseInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.fullHouse = fullHouseInput.value
    scores.value.playerFour.total += fullHouseInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveSmallStraightInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.smallStraight = smallStraightInput.value
    scores.value.playerOne.total += smallStraightInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.smallStraight = smallStraightInput.value
    scores.value.playerTwo.total += smallStraightInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.smallStraight = smallStraightInput.value
    scores.value.playerThree.total += smallStraightInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.smallStraight = smallStraightInput.value
    scores.value.playerFour.total += smallStraightInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveLargeStraightInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.largeStraight = largeStraightInput.value
    scores.value.playerOne.total += largeStraightInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.largeStraight = largeStraightInput.value
    scores.value.playerTwo.total += largeStraightInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.largeStraight = largeStraightInput.value
    scores.value.playerThree.total += largeStraightInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.largeStraight = largeStraightInput.value
    scores.value.playerFour.total += largeStraightInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveDiceInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.dice = diceInput.value
    scores.value.playerOne.total += diceInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.dice = diceInput.value
    scores.value.playerTwo.total += diceInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.dice = diceInput.value
    scores.value.playerThree.total += diceInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.dice = diceInput.value
    scores.value.playerFour.total += diceInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

const saveChanceInput = async () => {
  if (!scores.value) {
    return
  }
  if (isPlayerTurnOne.value) {
    scores.value.playerOne.chance = chanceInput.value
    scores.value.playerOne.total += chanceInput.value
  } else if (isPlayerTurnTwo.value) {
    scores.value.playerTwo.chance = chanceInput.value
    scores.value.playerTwo.total += chanceInput.value
  } else if (isPlayerTurnThree.value) {
    scores.value.playerThree.chance = chanceInput.value
    scores.value.playerThree.total += chanceInput.value
  } else if (isPlayerTurnFour.value) {
    scores.value.playerFour.chance = chanceInput.value
    scores.value.playerFour.total += chanceInput.value
  }
  await setDoc(scoresRef, scores.value, { merge: true })
  switchPlayerTurn()
}

// Check Scores Values

const checkUpperSubtotalPlayerOne = computed(() => {
  if (!scores.value) {
    return 0
  }
  let subtotal = 0
  if (scores.value.playerOne.one !== 69) {
    subtotal += scores.value.playerOne.one
  }
  if (scores.value.playerOne.two !== 69) {
    subtotal += scores.value.playerOne.two
  }
  if (scores.value.playerOne.three !== 69) {
    subtotal += scores.value.playerOne.three
  }
  if (scores.value.playerOne.four !== 69) {
    subtotal += scores.value.playerOne.four
  }
  if (scores.value.playerOne.five !== 69) {
    subtotal += scores.value.playerOne.five
  }
  if (scores.value.playerOne.six !== 69) {
    subtotal += scores.value.playerOne.six
  }
  if (subtotal >= 63) {
    playerOneBonus()
  }
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
  if (!scores.value) {
    return 0
  }
  let subtotal = 0
  if (scores.value.playerOne.threeOfAKind !== 69) {
    subtotal += scores.value.playerOne.threeOfAKind
  }
  if (scores.value.playerOne.fourOfAKind !== 69) {
    subtotal += scores.value.playerOne.fourOfAKind
  }
  if (scores.value.playerOne.fullHouse !== 69) {
    subtotal += scores.value.playerOne.fullHouse
  }
  if (scores.value.playerOne.smallStraight !== 69) {
    subtotal += scores.value.playerOne.smallStraight
  }
  if (scores.value.playerOne.largeStraight !== 69) {
    subtotal += scores.value.playerOne.largeStraight
  }
  if (scores.value.playerOne.dice !== 69) {
    subtotal += scores.value.playerOne.dice
  }
  if (scores.value.playerOne.chance !== 69) {
    subtotal += scores.value.playerOne.chance
  }

  return subtotal
})

const checkTotalPlayerOne = computed(() => {
  return checkUpperTotalPlayerOne.value + checkLowerTotalPlayerOne.value
})

// Player Two

const checkUpperSubtotalPlayerTwo = computed(() => {
  if (!scores.value) {
    return 0
  }
  let subtotal = 0
  if (scores.value.playerTwo.one !== 69) {
    subtotal += scores.value.playerTwo.one
  }
  if (scores.value.playerTwo.two !== 69) {
    subtotal += scores.value.playerTwo.two
  }
  if (scores.value.playerTwo.three !== 69) {
    subtotal += scores.value.playerTwo.three
  }
  if (scores.value.playerTwo.four !== 69) {
    subtotal += scores.value.playerTwo.four
  }
  if (scores.value.playerTwo.five !== 69) {
    subtotal += scores.value.playerTwo.five
  }
  if (scores.value.playerTwo.six !== 69) {
    subtotal += scores.value.playerTwo.six
  }
  if (subtotal >= 63) {
    playerTwoBonus()
  }
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
  if (!scores.value) {
    return 0
  }
  let subtotal = 0
  if (scores.value.playerTwo.threeOfAKind !== 69) {
    subtotal += scores.value.playerTwo.threeOfAKind
  }
  if (scores.value.playerTwo.fourOfAKind !== 69) {
    subtotal += scores.value.playerTwo.fourOfAKind
  }
  if (scores.value.playerTwo.fullHouse !== 69) {
    subtotal += scores.value.playerTwo.fullHouse
  }
  if (scores.value.playerTwo.smallStraight !== 69) {
    subtotal += scores.value.playerTwo.smallStraight
  }
  if (scores.value.playerTwo.largeStraight !== 69) {
    subtotal += scores.value.playerTwo.largeStraight
  }
  if (scores.value.playerTwo.dice !== 69) {
    subtotal += scores.value.playerTwo.dice
  }
  if (scores.value.playerTwo.chance !== 69) {
    subtotal += scores.value.playerTwo.chance
  }

  return subtotal
})

const checkTotalPlayerTwo = computed(() => {
  return checkUpperTotalPlayerTwo.value + checkLowerTotalPlayerTwo.value
})

// Player Three

const checkUpperSubtotalPlayerThree = computed(() => {
  if (!scores.value) {
    return 0
  }
  let subtotal = 0
  if (scores.value.playerThree.one !== 69) {
    subtotal += scores.value.playerThree.one
  }
  if (scores.value.playerThree.two !== 69) {
    subtotal += scores.value.playerThree.two
  }
  if (scores.value.playerThree.three !== 69) {
    subtotal += scores.value.playerThree.three
  }
  if (scores.value.playerThree.four !== 69) {
    subtotal += scores.value.playerThree.four
  }
  if (scores.value.playerThree.five !== 69) {
    subtotal += scores.value.playerThree.five
  }
  if (scores.value.playerThree.six !== 69) {
    subtotal += scores.value.playerThree.six
  }
  if (subtotal >= 63) {
    playerThreeBonus()
  }
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
  if (!scores.value) {
    return 0
  }
  let subtotal = 0
  if (scores.value.playerThree.threeOfAKind !== 69) {
    subtotal += scores.value.playerThree.threeOfAKind
  }
  if (scores.value.playerThree.fourOfAKind !== 69) {
    subtotal += scores.value.playerThree.fourOfAKind
  }
  if (scores.value.playerThree.fullHouse !== 69) {
    subtotal += scores.value.playerThree.fullHouse
  }
  if (scores.value.playerThree.smallStraight !== 69) {
    subtotal += scores.value.playerThree.smallStraight
  }
  if (scores.value.playerThree.largeStraight !== 69) {
    subtotal += scores.value.playerThree.largeStraight
  }
  if (scores.value.playerThree.dice !== 69) {
    subtotal += scores.value.playerThree.dice
  }
  if (scores.value.playerThree.chance !== 69) {
    subtotal += scores.value.playerThree.chance
  }

  return subtotal
})

const checkTotalPlayerThree = computed(() => {
  return checkUpperTotalPlayerThree.value + checkLowerTotalPlayerThree.value
})

// Player Four

const checkUpperSubtotalPlayerFour = computed(() => {
  if (!scores.value) {
    return 0
  }
  let subtotal = 0
  if (scores.value.playerFour.one !== 69) {
    subtotal += scores.value.playerFour.one
  }
  if (scores.value.playerFour.two !== 69) {
    subtotal += scores.value.playerFour.two
  }
  if (scores.value.playerFour.three !== 69) {
    subtotal += scores.value.playerFour.three
  }
  if (scores.value.playerFour.four !== 69) {
    subtotal += scores.value.playerFour.four
  }
  if (scores.value.playerFour.five !== 69) {
    subtotal += scores.value.playerFour.five
  }
  if (scores.value.playerFour.six !== 69) {
    subtotal += scores.value.playerFour.six
  }
  if (subtotal >= 63) {
    playerFourBonus()
  }
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
  if (!scores.value) {
    return 0
  }
  let subtotal = 0
  if (scores.value.playerFour.threeOfAKind !== 69) {
    subtotal += scores.value.playerFour.threeOfAKind
  }
  if (scores.value.playerFour.fourOfAKind !== 69) {
    subtotal += scores.value.playerFour.fourOfAKind
  }
  if (scores.value.playerFour.fullHouse !== 69) {
    subtotal += scores.value.playerFour.fullHouse
  }
  if (scores.value.playerFour.smallStraight !== 69) {
    subtotal += scores.value.playerFour.smallStraight
  }
  if (scores.value.playerFour.largeStraight !== 69) {
    subtotal += scores.value.playerFour.largeStraight
  }
  if (scores.value.playerFour.dice !== 69) {
    subtotal += scores.value.playerFour.dice
  }
  if (scores.value.playerFour.chance !== 69) {
    subtotal += scores.value.playerFour.chance
  }

  return subtotal
})

const checkTotalPlayerFour = computed(() => {
  return checkUpperTotalPlayerFour.value + checkLowerTotalPlayerFour.value
})
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
