import { describe, beforeEach, test, expect } from 'vitest'
import {
  MineSweeper,
  GameStatus,
  Difficulty
} from '../../utils/minesweeper/mineSweeper'
import type { GameOptions } from '../../utils/minesweeper/mineSweeper'
import { sleep } from '../../utils/index'

describe('MineSweeper', () => {
  let mineSweeper: MineSweeper
  const options = {
    numRows: 5,
    numCols: 5,
    numMines: 3,
    difficulty: Difficulty.BEGINNER
  } as GameOptions

  beforeEach(() => {
    mineSweeper = new MineSweeper()
  })

  test('getBoard', () => {
    mineSweeper.setup(options)

    expect(mineSweeper.getNumRows()).toBe(5)
    expect(mineSweeper.getNumCols()).toBe(5)
    expect(mineSweeper.getNumMines()).toBe(3)
    expect(mineSweeper.getBoard().length).toBe(5)
    expect(mineSweeper.getBoard()[0].length).toBe(5)
    expect(mineSweeper.getNumFlags()).toBe(0)
    expect(mineSweeper.getNumRevealed()).toBe(0)
    expect(mineSweeper.getDifficulty()).toBe(Difficulty.BEGINNER)
    expect(mineSweeper.getGameStatus()).toBe(GameStatus.WAITING)
  })

  test('getGameStatus', () => {
    mineSweeper.setup(options)

    expect(mineSweeper.getGameStatus()).toBe(GameStatus.WAITING)
    expect(mineSweeper.getGameStatusString()).toBe('En attente')

    for (let row = 0; row < mineSweeper.getNumRows(); row++) {
      for (let col = 0; col < mineSweeper.getNumCols(); col++) {
        if (!mineSweeper.getCell(row, col).getIsMine()) {
          mineSweeper.handleCellAction(row, col, 'click')
          break
        }
      }
    }

    expect(mineSweeper.getGameStatus()).toBe(GameStatus.IN_PROGRESS)
    expect(mineSweeper.getGameStatusString()).toBe('En cours')

    for (let row = 0; row < mineSweeper.getNumRows(); row++) {
      for (let col = 0; col < mineSweeper.getNumCols(); col++) {
        if (mineSweeper.getCell(row, col).getIsMine()) {
          mineSweeper.handleCellAction(row, col, 'click')
          break
        }
      }
    }

    expect(mineSweeper.getGameStatus()).toBe(GameStatus.LOST)
    expect(mineSweeper.getGameStatusString()).toBe('Perdu')

    mineSweeper.restart(options)

    for (let row = 0; row < mineSweeper.getNumRows(); row++) {
      for (let col = 0; col < mineSweeper.getNumCols(); col++) {
        if (!mineSweeper.getCell(row, col).getIsMine()) {
          mineSweeper.handleCellAction(row, col, 'click')
        }
      }
    }

    expect(mineSweeper.getGameStatus()).toBe(GameStatus.WON)
    expect(mineSweeper.getGameStatusString()).toBe('Gagné')
  })

  test('handleCellAction', () => {
    mineSweeper.setup(options)

    mineSweeper.handleCellAction(3, 3, 'click')
    expect(mineSweeper.getCell(3, 3).getIsRevealed()).toBe(true)

    let cellWithAdjacentMines = false

    for (let row = 0; row < mineSweeper.getNumRows(); row++) {
      for (let col = 0; col < mineSweeper.getNumCols(); col++) {
        if (mineSweeper.getCell(row, col).getNumAdjacentMines() > 0) {
          cellWithAdjacentMines = true
          break
        }
      }
    }

    expect(cellWithAdjacentMines).toBe(true)

    mineSweeper.handleCellAction(1, 1, 'flag')
    expect(mineSweeper.getCell(1, 1).getIsRevealed()).toBe(true)
  })

  test('restart', () => {
    mineSweeper.setup(options)

    mineSweeper.handleCellAction(0, 0, 'click')
    expect(mineSweeper.getCell(0, 0).getIsRevealed()).toBe(true)

    mineSweeper.restart(options)

    expect(mineSweeper.getCell(0, 0).getIsRevealed()).toBe(false)
  })

  test('getTimer', async () => {
    mineSweeper.setup(options)
    expect(mineSweeper.getTimer().getNum()).toBe(0)

    mineSweeper.handleCellAction(0, 0, 'click')
    await sleep(1000)
    expect(mineSweeper.getTimer().getNum()).toBeGreaterThan(0)

    // const timer = mineSweeper.getTimer().getNum()
    // mineSweeper.getTimer().togglePause()
    // expect(mineSweeper.getTimer().getNum()).toBe(timer)
    // expect(mineSweeper.getTimer().getIsPaused()).toBe(true)

    // mineSweeper.getTimer().togglePause()

    mineSweeper.getTimer().stop()
    expect(mineSweeper.getTimer().getReturnType()).toBe(undefined)

    mineSweeper.getTimer().start()
    expect(mineSweeper.getTimer().getReturnType()).not.toBe(undefined)

    // mineSweeper.getTimer().reset()
    // expect(mineSweeper.getTimer().getReturnType()).toBe(undefined)
    // expect(mineSweeper.getTimer().getNum()).toBe(0)

    mineSweeper.restart(options)
    expect(mineSweeper.getTimer().getNum()).toBe(0)
  })
})
