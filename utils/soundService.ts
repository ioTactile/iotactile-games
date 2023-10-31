import { Howl } from 'howler'
import { random } from '~/utils'

export default class SoundService {
  private sounds: Record<string, Howl> = {}

  public isSoundLoaded(key: string): boolean {
    return !!this.sounds[key]
  }

  public isSoundMuted(key: string): boolean {
    return this.sounds[key]?.volume() === 0
  }

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
      this.sounds[key].volume(0)
    }
  }

  public unmuteSound(key: string): void {
    if (this.sounds[key]) {
      this.sounds[key].volume(1)
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
}
