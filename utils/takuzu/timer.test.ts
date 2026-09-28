import { describe, test, expect } from 'vitest';
import { Timer } from './timer';

describe('takuzu Timer', () => {
  test('addPenalty increases elapsed time', () => {
    const timer = new Timer();
    timer.start();
    timer.togglePause();

    const before = timer.getElapsedTime();
    timer.addPenalty(15_000);
    expect(timer.getElapsedTime()).toBe(before + 15_000);
  });

  test('addPenalty ignores non-positive values', () => {
    const timer = new Timer();
    timer.addPenalty(0);
    timer.addPenalty(-100);
    expect(timer.getElapsedTime()).toBe(0);
  });
});
