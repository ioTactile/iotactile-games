import { Howl } from 'howler'
import { random } from '../utils/'

export interface ISoundService {
  loadSound(key: string, src: string, volume: number): void
  unloadSound(key: string): void
  playSound(key: string): void
  stopSound(key: string): void
  loadAudioTracks(
    headerTrackName: string,
    audioTracks: string[],
    volume: number
  ): void
  playAudioTracks(headerTrackName: string, audioTracksLength: number): void
  stopAudioTracks(headerTrackName: string, audioTracksLength: number): void
  muteSound(key: string): void
  unmuteSound(key: string): void
  stopAllSounds(): void
  unloadAllSounds(): void
  isSoundLoaded(key: string): boolean
  isSoundMuted(key: string): boolean
  isSoundPlaying(key: string): boolean
  isAudioTrackPlaying(
    headerTrackName: string,
    audioTracksLength: number
  ): boolean
  isAudioTrackMuted(headerTrackName: string, audioTracksLength: number): boolean
  unloadAudioTracks(headerTrackName: string, audioTracksLength: number): void
  muteAudioTracks(headerTrackName: string, audioTracksLength: number): void
  unmuteAudioTracks(headerTrackName: string, audioTracksLength: number): void
  isAudioTrackLoaded(
    headerTrackName: string,
    audioTracksLength: number
  ): boolean
}

export class SoundService implements ISoundService {
  private sounds: Record<string, Howl> = {}

  public loadSound(key: string, src: string, volume: number): void {
    this.sounds[key] = new Howl({
      src: [src],
      volume
    })
  }

  public unloadSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].unload()
      delete this.sounds[key]
    }
  }

  public playSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].play()
    }
  }

  public stopSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].stop()
    }
  }

  public loadAudioTracks(
    headerTrackName: string,
    audioTracks: string[],
    volume: number
  ): void {
    audioTracks.forEach((audioTrack, index) => {
      const trackName = `${headerTrackName}-${index}`
      const src = `/${headerTrackName}/music/${audioTrack}`
      this.loadSound(trackName, src, volume)
    })
  }

  public playAudioTracks(
    headerTrackName: string,
    audioTracksLength: number
  ): void {
    const randomIndex = random(audioTracksLength)
    const randomTrackName = `${headerTrackName}-${randomIndex}`
    this.playSound(randomTrackName)
    this.sounds[randomTrackName].on('end', () => {
      this.playAudioTracks(headerTrackName, audioTracksLength)
    })
  }

  public stopAudioTracks(
    headerTrackName: string,
    audioTracksLength: number
  ): void {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      this.stopSound(trackName)
    }
  }

  public muteSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].mute(true)
    }
  }

  public unmuteSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].mute(false)
    }
  }

  public stopAllSounds(): void {
    Object.values(this.sounds).forEach((sound) => {
      sound.stop()
    })
  }

  public unloadAllSounds(): void {
    Object.values(this.sounds).forEach((sound) => {
      sound.unload()
    })
  }

  public isSoundMuted(key: string): boolean {
    return !!this.sounds[key]?.mute()
  }

  // For testing purposes

  public isSoundLoaded(key: string): boolean {
    return !!this.sounds[key]
  }

  public isSoundPlaying(key: string): boolean {
    return !!this.sounds[key]?.playing()
  }

  public isAudioTrackPlaying(
    headerTrackName: string,
    audioTracksLength: number
  ): boolean {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      if (this.isSoundPlaying(trackName)) {
        return true
      }
    }
    return false
  }

  public isAudioTrackMuted(
    headerTrackName: string,
    audioTracksLength: number
  ): boolean {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      if (!this.isSoundMuted(trackName)) {
        return false
      }
    }
    return true
  }

  public unloadAudioTracks(
    headerTrackName: string,
    audioTracksLength: number
  ): void {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      this.unloadSound(trackName)
    }
  }

  public muteAudioTracks(
    headerTrackName: string,
    audioTracksLength: number
  ): void {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      this.muteSound(trackName)
    }
  }

  public unmuteAudioTracks(
    headerTrackName: string,
    audioTracksLength: number
  ): void {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      this.unmuteSound(trackName)
    }
  }

  public isAudioTrackLoaded(
    headerTrackName: string,
    audioTracksLength: number
  ): boolean {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      if (!this.isSoundLoaded(trackName)) {
        return false
      }
    }
    return true
  }
}
