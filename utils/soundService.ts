import { Howl } from 'howler'

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
  private audioTracks: Record<string, string[]> = {}
  private audioTracksLength: number = 0

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

  public loadAudioTracks(headerTrackName: string, audioTracks: string[]): void {
    this.shuffleAudioTracks(headerTrackName, audioTracks)
    audioTracks = this.audioTracks[headerTrackName]
    this.audioTracksLength = audioTracks.length

    audioTracks.forEach((audioTrack, index) => {
      const trackName = `${headerTrackName}-${index}`
      const src = `/${headerTrackName}/music/${audioTrack}`
      this.loadSound(trackName, src, 0.5)
    })
  }

  private shuffleAudioTracks(
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

  public playAudioTracks(headerTrackName: string): void {
    const audioTracksLength = this.audioTracks[headerTrackName].length
    if (this.audioTracksLength === 0) {
      this.loadAudioTracks(headerTrackName, this.audioTracks[headerTrackName])
      this.audioTracksLength = audioTracksLength
    }

    if (this.isAudioTrackPlaying(headerTrackName, audioTracksLength)) {
      return
    }

    const index = audioTracksLength - this.audioTracksLength
    const randomTrackName = `${headerTrackName}-${index}`
    this.playSound(randomTrackName)
    this.sounds[randomTrackName].once('end', () => {
      this.playAudioTracks(headerTrackName)
      this.unloadSound(randomTrackName)
      this.audioTracksLength -= 1
    })
  }

  public stopAudioTracks(headerTrackName: string): void {
    const audioTracksLength = this.audioTracks[headerTrackName].length
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
