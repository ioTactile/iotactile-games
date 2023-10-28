import { get } from 'firebase/database'
import type { Dice } from '~/functions/src/types'

type PlayerSheetRow = {
  value: string
  icon?: string
  src?: string
  input: number | null
}

export const oneInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const faceLength = dices.filter((dice: Dice) => dice.face === 1).length
  return faceLength * 1
}

export const twoInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const faceLength = dices.filter((dice: Dice) => dice.face === 2).length
  return faceLength * 2
}

export const threeInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const faceLength = dices.filter((dice: Dice) => dice.face === 3).length
  return faceLength * 3
}

export const fourInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const faceLength = dices.filter((dice: Dice) => dice.face === 4).length
  return faceLength * 4
}

export const fiveInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const faceLength = dices.filter((dice: Dice) => dice.face === 5).length
  return faceLength * 5
}

export const sixInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const faceLength = dices.filter((dice: Dice) => dice.face === 6).length
  return faceLength * 6
}

export const threeOfAKindInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const faceCounts: { [key: number]: number } = {}

  for (const dice of dices) {
    if (faceCounts[dice.face]) {
      faceCounts[dice.face]++
    } else {
      faceCounts[dice.face] = 1
    }
  }

  const hasThreeOfAKind = Object.values(faceCounts).some(
    (count: number) => count >= 3,
  )

  if (hasThreeOfAKind) {
    return dices.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
  } else {
    return 0
  }
}

export const fourOfAKindInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const faceCounts: { [key: number]: number } = {}

  for (const dice of dices) {
    if (faceCounts[dice.face]) {
      faceCounts[dice.face]++
    } else {
      faceCounts[dice.face] = 1
    }
  }

  const hasFourOfAKind = Object.values(faceCounts).some(
    (count: number) => count >= 4,
  )

  if (hasFourOfAKind) {
    return dices.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
  } else {
    return 0
  }
}

export const fullHouseInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const sortedDices = dices.slice().sort((a: Dice, b: Dice) => a.face - b.face)

  const isFullHouse =
    (sortedDices[0].face === sortedDices[1].face &&
      sortedDices[0].face === sortedDices[2].face &&
      sortedDices[3].face === sortedDices[4].face) ||
    (sortedDices[0].face === sortedDices[1].face &&
      sortedDices[2].face === sortedDices[3].face &&
      sortedDices[2].face === sortedDices[4].face)

  return isFullHouse ? 25 : 0
}

export const smallStraightInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const sortedDices = dices.slice().sort((a: Dice, b: Dice) => a.face - b.face)

  const faces = new Set(sortedDices.map((dice: Dice) => dice.face))

  const isSmallStraight =
    (faces.has(1) && faces.has(2) && faces.has(3) && faces.has(4)) ||
    (faces.has(2) && faces.has(3) && faces.has(4) && faces.has(5)) ||
    (faces.has(3) && faces.has(4) && faces.has(5) && faces.has(6))

  return isSmallStraight ? 30 : 0
}

export const largeStraightInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const sortedDices = dices.slice().sort((a: Dice, b: Dice) => a.face - b.face)

  const isLargeStraight =
    (sortedDices[0].face === 1 &&
      sortedDices[1].face === 2 &&
      sortedDices[2].face === 3 &&
      sortedDices[3].face === 4 &&
      sortedDices[4].face === 5) ||
    (sortedDices[0].face === 2 &&
      sortedDices[1].face === 3 &&
      sortedDices[2].face === 4 &&
      sortedDices[3].face === 5 &&
      sortedDices[4].face === 6)

  return isLargeStraight ? 40 : 0
}

export const diceInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const firstFace = dices[0].face

  const isDice = dices.every((dice: Dice) => dice.face === firstFace)

  return isDice ? 50 : 0
}

export const chanceInput = (dices: Dice[]) => {
  if (!dices || dices.length !== 5) {
    return 0
  }

  const chance = dices
  return chance.reduce((acc: number, dice: Dice) => acc + dice.face, 0)
}

export const getUpperSectionTotal = (playerSheet: PlayerSheetRow[]) => {
  const upperSectionRows = playerSheet.slice(0, 6)
  const upperSectionTotal = upperSectionRows.reduce(
    (acc: number, row: PlayerSheetRow) => acc + (row.input || 0),
    0,
  )

  return upperSectionTotal
}

export const getLowerSectionTotal = (playerSheet: PlayerSheetRow[]) => {
  const lowerSectionRows = playerSheet.slice(0, 7)
  const lowerSectionTotal = lowerSectionRows.reduce(
    (acc: number, row: PlayerSheetRow) => acc + (row.input || 0),
    0,
  )

  return lowerSectionTotal
}
