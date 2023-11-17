import { Howl } from 'howler'

export interface ISoundService {
  loadSound(key: string, src: string, volume: number): void
  unloadSound(key: string): void
  playSound(key: string): void
  muteSound(key: string): void
  unmuteSound(key: string): void
  isSoundMuted(key: string): boolean

  loadAudioTracks(headerTrackName: string, audioTracks: string[]): void
  unloadAudioTracks(headerTrackName: string): void
  playAudioTracks(headerTrackName: string): void
  muteAudioTracks(headerTrackName: string): void
  unmuteAudioTracks(headerTrackName: string): void

  changeAudioTracksVolume(headerTrackName: string, volume: number): void
  getAudioTracksVolumeFromLocalStorage(): number

  stopAllSounds(): void
  unloadAllSounds(): void

  isSoundLoaded(key: string): boolean
  isSoundPlaying(key: string): boolean
  isAudioTrackLoaded(
    headerTrackName: string,
    audioTracksLength: number
  ): boolean
  isAudioTrackPlaying(
    headerTrackName: string,
    audioTracksLength: number
  ): boolean
  isAudioTrackMuted(headerTrackName: string, audioTracksLength: number): boolean
}

export class SoundService implements ISoundService {
  private sounds: Record<string, Howl> = {}
  private audioTracks: Record<string, string[]> = {}
  private audioTracksLength: number = 0
  private audioTracksVolume: number = 0

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

  public isSoundMuted(key: string): boolean {
    return !!this.sounds[key]?.mute()
  }

  public loadAudioTracks(headerTrackName: string, audioTracks: string[]): void {
    this.audioTracksVolume = this.getAudioTracksVolumeFromLocalStorage() ?? 0.5

    this.shuffleAndStoreAudioTracks(headerTrackName, audioTracks)
    audioTracks = this.audioTracks[headerTrackName]
    this.audioTracksLength = audioTracks.length

    audioTracks.forEach((audioTrack, index) => {
      const trackName = `${headerTrackName}-${index}`
      const src = `/${headerTrackName}/music/${audioTrack}`
      this.loadSound(trackName, src, this.audioTracksVolume)
    })
  }

  public unloadAudioTracks(headerTrackName: string): void {
    const audioTracksLength = this.audioTracks[headerTrackName].length
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      if (this.isSoundLoaded(trackName)) {
        this.unloadSound(trackName)
      }
    }
  }

  public playAudioTracks(headerTrackName: string): void {
    const audioTracksLength = this.audioTracks[headerTrackName].length
    if (this.audioTracksLength === 0) {
      this.loadAudioTracks(headerTrackName, this.audioTracks[headerTrackName])
      this.audioTracksLength = audioTracksLength
    }

    const index = audioTracksLength - this.audioTracksLength
    const trackName = `${headerTrackName}-${index}`
    this.playSound(trackName)
    this.sounds[trackName].once('end', () => {
      this.audioTracksLength -= 1
      this.unloadSound(trackName)
      this.playAudioTracks(headerTrackName)
    })
  }

  public muteAudioTracks(headerTrackName: string): void {
    const audioTracksLength = this.audioTracks[headerTrackName].length
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      if (this.isSoundLoaded(trackName)) {
        this.muteSound(trackName)
      }
    }
  }

  public unmuteAudioTracks(headerTrackName: string): void {
    const audioTracksLength = this.audioTracks[headerTrackName].length
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      if (this.isSoundLoaded(trackName)) {
        this.unmuteSound(trackName)
      }
    }
  }

  public changeAudioTracksVolume(
    headerTrackName: string,
    newVolume: number
  ): void {
    this.audioTracksVolume = newVolume
    this.setAudioTracksVolumeInLocalStorage(newVolume)
    const audioTracksLength = this.audioTracks[headerTrackName].length
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      if (this.isSoundLoaded(trackName)) {
        this.sounds[trackName].volume(this.audioTracksVolume)
      }
    }
  }

  public getAudioTracksVolumeFromLocalStorage(): number {
    const audioTracksVolume = localStorage.getItem('audioTracksVolume')
    if (audioTracksVolume !== null) {
      return Number(audioTracksVolume)
    } else {
      return this.audioTracksVolume
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

  // Private methods

  private shuffleAndStoreAudioTracks(
    headerTrackName: string,
    audioTracks: string[]
  ): void {
    const audioTracksCopy = [...audioTracks]
    for (let i = audioTracksCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = audioTracksCopy[i]
      audioTracksCopy[i] = audioTracksCopy[j]
      audioTracksCopy[j] = temp
    }
    this.audioTracks[headerTrackName] = audioTracksCopy
  }

  private setAudioTracksVolumeInLocalStorage(volume: number): void {
    localStorage.setItem('audioTracksVolume', String(volume))
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
