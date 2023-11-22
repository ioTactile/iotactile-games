import { describe, beforeEach, test, expect } from 'vitest'
import { Timer } from './Timer'

describe('Timer', () => {
  let timer: Timer

  beforeEach(() => {
    timer = new Timer()
  })

  test('should initialize with default values', () => {
    expect(timer.getElapsedTime()).toBe(0)
    expect(timer.isStarted()).toBe(false)
    expect(timer.getIsPaused()).toBe(false)
    expect(timer.getReturnType()).toBe(undefined)
  })

  test('should start the timer', () => {
    timer.start()
    expect(timer.isStarted()).toBe(true)
    expect(timer.getIsPaused()).toBe(false)
    expect(timer.getReturnType()).toBeDefined()
  })

  test('should pause the timer', () => {
    timer.start()
    timer.togglePause()
    expect(timer.isStarted()).toBe(true)
    expect(timer.getIsPaused()).toBe(true)
    // expect(timer.getReturnType()).toBe(undefined)
  })

  test('should resume the timer', () => {
    timer.start()
    timer.togglePause()
    timer.togglePause()
    expect(timer.isStarted()).toBe(true)
    expect(timer.getIsPaused()).toBe(false)
    expect(timer.getReturnType()).toBeDefined()
  })

  test('should stop the timer', () => {
    timer.start()
    timer.stop()
    expect(timer.isStarted()).toBe(true)
    expect(timer.getReturnType()).toBe(undefined)
  })

  test('should reset the timer', () => {
    timer.start()
    timer.reset()
    expect(timer.isStarted()).toBe(false)
    expect(timer.getReturnType()).toBe(undefined)
    expect(timer.getElapsedTime()).toBe(0)
    expect(timer.getIsPaused()).toBe(false)
  })
})
