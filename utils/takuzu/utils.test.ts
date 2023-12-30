import { test, expect, describe } from "vitest";
import {
  countSubstrInStr,
  getRandomNumber,
  arrayFromLength,
  getRandomBoolean,
  takeRandomIndexFromArray,
} from "./utils";

describe("getRandomNumber", () => {
  test("should return a number within the specified range", () => {
    const min = 0;
    const max = 10;
    const randomNumber = getRandomNumber(max, min);
    expect(randomNumber).toBeDefined();
    expect(randomNumber).toBeGreaterThanOrEqual(min);
    expect(randomNumber).toBeLessThanOrEqual(max);
  });

  test("should return a number within the default range if only max is provided", () => {
    const max = 10;
    const randomNumber = getRandomNumber(max);
    expect(randomNumber).toBeDefined();
    expect(randomNumber).toBeGreaterThanOrEqual(0);
    expect(randomNumber).toBeLessThanOrEqual(max);
  });
});

describe("countSubstrInStr", () => {
  test("should return the number of times a substring appears in a string", () => {
    const str = "hello world";
    const substr = "l";
    expect(countSubstrInStr(str, substr)).toBe(3);
  });
});

describe("arrayFromLength", () => {
  test("should return an array of the specified length", () => {
    const length = 10;
    const array = arrayFromLength(length);
    expect(array).toBeDefined();
    expect(array.length).toBe(length);
  });
});

describe("getRandomBoolean", () => {
  test("should return true or false based on the specified chance", () => {
    const chance = 0.5;
    const boolean = getRandomBoolean(chance);
    expect(boolean).toBeDefined();
    expect(boolean).toBe(boolean);
  });
});

describe("takeRandomIndexFromArray", () => {
  test("should return a random index from the array", () => {
    const array = [1, 2, 3, 4, 5];
    const randomIndex = takeRandomIndexFromArray(array);
    expect(array[randomIndex]).toBeDefined();
    expect(array[randomIndex]).toBeGreaterThanOrEqual(0);
    expect(array[randomIndex]).toBeLessThanOrEqual(array.length);
  });
});
