import { describe, beforeEach, test, expect, afterEach } from 'vitest'
import { SoundService } from '../utils/soundService'
import type { ISoundService } from '../utils/soundService'
import { audioTracks } from '../utils/'

describe('SoundService', () => {
  let soundService: ISoundService

  beforeEach(() => {
    soundService = new SoundService()
  })

  afterEach(() => {
    soundService = null!
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
    soundService.loadAudioTracks('dice', audioTracks, 0.5)
    expect(soundService.isAudioTrackLoaded('dice', audioTracks.length)).toBe(
      true
    )

    soundService.unloadAudioTracks('dice', audioTracks.length)
    expect(soundService.isAudioTrackLoaded('dice', audioTracks.length)).toBe(
      false
    )
  })

  //   test('should play a track', () => {
  //     soundService.loadAudioTracks('dice', audioTracks, 1)
  //     soundService.playAudioTracks('dice', audioTracks.length)
  //     expect(
  //       soundService.isAudioTrackPlaying('dice', audioTracks.length)
  //     ).toBe(true)

  //     soundService.stopAudioTracks('dice', audioTracks.length)
  //     expect(
  //       soundService.isAudioTrackPlaying('dice', audioTracks.length)
  //     ).toBe(false)
  //   })

  //   test('should mute a track', () => {
  //     soundService.loadAudioTracks('dice', audioTracks, 1)
  //     soundService.muteAudioTracks('dice', audioTracks.length)
  //     expect(soundService.isAudioTrackMuted('dice', audioTracks.length)).toBe(
  //       true
  //     )

  //     soundService.unmuteAudioTracks('dice', audioTracks.length)
  //     expect(soundService.isAudioTrackMuted('dice', audioTracks.length)).toBe(
  //       false
  //     )
  //   })
})
