import { describe, beforeEach, test, expect } from 'vitest'
import { SoundService } from '../utils/soundService'
import type { ISoundService } from '../utils/soundService'
import { diceAudioTracks } from '../utils/'

describe('SoundService', () => {
  let soundService: ISoundService

  beforeEach(() => {
    soundService = new SoundService()
  })

  test('should load a sound', () => {
    soundService.loadSound('dice', '/dice/sounds/dice.mp3', 1)
    expect(soundService.isSoundLoaded('dice')).toBe(true)

    soundService.unloadSound('dice')
    expect(soundService.isSoundLoaded('dice')).toBe(false)
  })

  //   test('should play a sound', () => {
  //     soundService.loadSound('dice', '/dice/sounds/dice.mp3', 1)
  //     soundService.playSound('dice')
  //     expect(soundService.isSoundPlaying('dice')).toBe(true)

  //     soundService.stopSound('dice')
  //     expect(soundService.isSoundPlaying('dice')).toBe(false)
  //   })

  //   test('should mute a sound', () => {
  //     soundService.loadSound('dice', '/dice/sounds/dice.mp3', 1)
  //     soundService.muteSound('dice')
  //     expect(soundService.isSoundMuted('dice')).toBe(true)

  //     soundService.unmuteSound('dice')
  //     expect(soundService.isSoundMuted('dice')).toBe(false)
  //   })

  test('should load a track', () => {
    soundService.loadAudioTracks('dice', diceAudioTracks, 1)
    expect(
      soundService.isAudioTrackLoaded('dice', diceAudioTracks.length)
    ).toBe(true)

    soundService.unloadAudioTracks('dice', diceAudioTracks.length)
    expect(
      soundService.isAudioTrackLoaded('dice', diceAudioTracks.length)
    ).toBe(false)
  })

  //   test('should play a track', () => {
  //     soundService.loadAudioTracks('dice', diceAudioTracks, 1)
  //     soundService.playAudioTracks('dice', diceAudioTracks.length)
  //     expect(
  //       soundService.isAudioTrackPlaying('dice', diceAudioTracks.length)
  //     ).toBe(true)

  //     soundService.stopAudioTracks('dice', diceAudioTracks.length)
  //     expect(
  //       soundService.isAudioTrackPlaying('dice', diceAudioTracks.length)
  //     ).toBe(false)
  //   })

  //   test('should mute a track', () => {
  //     soundService.loadAudioTracks('dice', diceAudioTracks, 1)
  //     soundService.muteAudioTracks('dice', diceAudioTracks.length)
  //     expect(soundService.isAudioTrackMuted('dice', diceAudioTracks.length)).toBe(
  //       true
  //     )

  //     soundService.unmuteAudioTracks('dice', diceAudioTracks.length)
  //     expect(soundService.isAudioTrackMuted('dice', diceAudioTracks.length)).toBe(
  //       false
  //     )
  //   })
})
