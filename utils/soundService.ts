import { Howl } from 'howler'

export default class SoundService {
  private sounds: Record<string, Howl> = {}
  private globalVolume = 1
  private isMuted = false

  public loadSound(key: string, src: string): void {
    this.sounds[key] = new Howl({
      src: [src],
      volume: this.getInitialVolume(),
    })
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
