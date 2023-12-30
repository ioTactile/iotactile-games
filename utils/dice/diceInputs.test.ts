import { describe, test, expect } from "vitest";
import type { Dice } from "../../functions/src/types";
import * as diceInputs from "./diceInputs";

const createDice = (faces: number[]): Dice[] => {
  return faces.map((face, index) => ({
    id: index,
    face,
    isOnBoard: true,
  }));
};

describe("oneInput", () => {
  test("oneInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.oneInput(dices)).toBe(1);

    const dices2 = createDice([1, 1, 1, 2, 3]);
    expect(diceInputs.oneInput(dices2)).toBe(3);

    const dices3 = createDice([2, 2, 2, 2, 2]);
    expect(diceInputs.oneInput(dices3)).toBe(0);
  });

  test("twoInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.twoInput(dices)).toBe(2);

    const dices2 = createDice([2, 2, 2, 3, 4]);
    expect(diceInputs.twoInput(dices2)).toBe(6);

    const dices3 = createDice([3, 3, 3, 3, 3]);
    expect(diceInputs.twoInput(dices3)).toBe(0);
  });

  test("threeInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.threeInput(dices)).toBe(3);

    const dices2 = createDice([3, 3, 3, 4, 5]);
    expect(diceInputs.threeInput(dices2)).toBe(9);

    const dices3 = createDice([4, 4, 4, 4, 4]);
    expect(diceInputs.threeInput(dices3)).toBe(0);
  });

  test("fourInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.fourInput(dices)).toBe(4);

    const dices2 = createDice([4, 4, 4, 5, 6]);
    expect(diceInputs.fourInput(dices2)).toBe(12);

    const dices3 = createDice([5, 5, 5, 5, 5]);
    expect(diceInputs.fourInput(dices3)).toBe(0);
  });

  test("fiveInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.fiveInput(dices)).toBe(5);

    const dices2 = createDice([5, 5, 5, 6, 1]);
    expect(diceInputs.fiveInput(dices2)).toBe(15);

    const dices3 = createDice([6, 6, 6, 6, 6]);
    expect(diceInputs.fiveInput(dices3)).toBe(0);
  });

  test("sixInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.sixInput(dices)).toBe(0);

    const dices2 = createDice([6, 6, 6, 1, 2]);
    expect(diceInputs.sixInput(dices2)).toBe(18);

    const dices3 = createDice([6, 6, 6, 6, 6]);
    expect(diceInputs.sixInput(dices3)).toBe(30);
  });

  test("threeOfAKindInput", () => {
    const dices = createDice([1, 1, 3, 4, 5]);
    expect(diceInputs.threeOfAKindInput(dices)).toBe(0);

    const dices2 = createDice([1, 1, 1, 2, 3]);
    expect(diceInputs.threeOfAKindInput(dices2)).toBe(8);

    const dices3 = createDice([3, 3, 3, 3, 3]);
    expect(diceInputs.threeOfAKindInput(dices3)).toBe(15);
  });

  test("fourOfAKindInput", () => {
    const dices = createDice([1, 1, 1, 4, 5]);
    expect(diceInputs.fourOfAKindInput(dices)).toBe(0);

    const dices2 = createDice([4, 4, 4, 4, 2]);
    expect(diceInputs.fourOfAKindInput(dices2)).toBe(18);

    const dices3 = createDice([6, 6, 6, 6, 6]);
    expect(diceInputs.fourOfAKindInput(dices3)).toBe(30);
  });

  test("fullHouseInput", () => {
    const dices = createDice([1, 1, 1, 4, 5]);
    expect(diceInputs.fullHouseInput(dices)).toBe(0);

    const dices2 = createDice([3, 3, 3, 2, 2]);
    expect(diceInputs.fullHouseInput(dices2)).toBe(25);

    const dices3 = createDice([5, 5, 5, 5, 5]);
    expect(diceInputs.fullHouseInput(dices3)).toBe(0);
  });

  test("smallStraightInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.smallStraightInput(dices)).toBe(30);

    const dices2 = createDice([2, 3, 4, 5, 6]);
    expect(diceInputs.smallStraightInput(dices2)).toBe(30);

    const dices3 = createDice([1, 2, 3, 5, 6]);
    expect(diceInputs.smallStraightInput(dices3)).toBe(0);
  });

  test("largeStraightInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.largeStraightInput(dices)).toBe(40);

    const dices2 = createDice([2, 3, 4, 5, 6]);
    expect(diceInputs.largeStraightInput(dices2)).toBe(40);

    const dices3 = createDice([1, 2, 3, 4, 6]);
    expect(diceInputs.largeStraightInput(dices3)).toBe(0);
  });

  test("diceInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.diceInput(dices)).toBe(0);

    const dices2 = createDice([2, 2, 2, 3, 4]);
    expect(diceInputs.diceInput(dices2)).toBe(0);

    const dices3 = createDice([3, 3, 3, 3, 3]);
    expect(diceInputs.diceInput(dices3)).toBe(50);
  });

  test("chanceInput", () => {
    const dices = createDice([1, 2, 3, 4, 5]);
    expect(diceInputs.chanceInput(dices)).toBe(15);

    const dices2 = createDice([2, 3, 4, 5, 6]);
    expect(diceInputs.chanceInput(dices2)).toBe(20);

    const dices3 = createDice([2, 2, 5, 4, 6]);
    expect(diceInputs.chanceInput(dices3)).toBe(19);
  });
});
