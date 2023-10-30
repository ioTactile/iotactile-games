import { Howl } from 'howler'
import { random } from '~/utils'

export default class SoundService {
  private sounds: Record<string, Howl> = {}
  private globalVolume = 1
  private isMuted = false

  public isSoundLoaded(key: string): boolean {
    return !!this.sounds[key]
  }

  public isSoundMuted(key: string): boolean {
    return this.sounds[key]?.volume() === 0
  }

  public loadSound(key: string, src: string): void {
    this.sounds[key] = new Howl({
      src: [src],
      volume: this.globalVolume
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

  public loadAudioTracks(headerTrackName: string, audioTracks: string[]) {
    audioTracks.forEach((audioTrack, index) => {
      const trackName = `${headerTrackName}-${index}`
      const src = `/${headerTrackName}/music/${audioTrack}`
      this.loadSound(trackName, src)
    })
  }

  public playAudioTracks(headerTrackName: string, audioTracksLength: number) {
    const randomIndex = random(audioTracksLength)
    const randomTrackName = `${headerTrackName}-${randomIndex}`
    this.playSound(randomTrackName)
    this.sounds[randomTrackName].on('end', () => {
      this.playAudioTracks(headerTrackName, audioTracksLength)
    })
  }

  public stopAudioTracks(headerTrackName: string, audioTracksLength: number) {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      this.stopSound(trackName)
    }
  }

  public muteSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].volume(0)
    }
  }

  public unmuteSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].volume(this.globalVolume)
    }
  }

  public muteAudioTracks(headerTrackName: string, audioTracksLength: number) {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      this.muteSound(trackName)
    }
  }

  public unmuteAudioTracks(headerTrackName: string, audioTracksLength: number) {
    for (let i = 0; i < audioTracksLength; i++) {
      const trackName = `${headerTrackName}-${i}`
      this.unmuteSound(trackName)
    }
  }

  public setSoundVolume(key: string, volume: number): void {
    if (this.sounds[key]) {
      this.sounds[key].volume(volume)
    }
  }

  public setGlobalVolume(volume: number): void {
    this.globalVolume = volume
    this.applyVolume()
    localStorage.setItem('soundVolume', volume.toString())
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

  private applyVolume(): void {
    const volume = this.isMuted ? 0 : this.globalVolume
    Object.values(this.sounds).forEach((sound) => {
      sound.volume(volume)
    })
  }

  private getInitialVolume(): number {
    const storedValue = localStorage.getItem('soundVolume')
    if (storedValue !== null) {
      const volume = parseFloat(storedValue)
      if (isNaN(volume)) {
        return this.isMuted ? 0 : this.globalVolume
      }
      return this.isMuted ? 0 : volume
    }
    return this.isMuted ? 0 : this.globalVolume
  }
}
