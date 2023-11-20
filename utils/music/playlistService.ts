import { Howl } from 'howler'
import { AbstractAudioService } from './audioService'
import { asianLofi, christmasLofi, autumnLofi } from '~/utils'

export interface IPlaylistService {
  loadPlaylist(type: string): void
  changePlaylistType(type: string): void
  playPlaylist(): void
  mutePlaylist(): void
  unmutePlaylist(): void
  getTrackDuration(): number
  getCurrentTrack(): string
  getTrackSeek(): number
  getCurrentTime(): number
  pausePlaylist(): void
  skipTrack(direction: string): void
  changePlaylistVolume(newVolume: number): void
  getPlaylistVolumeFromLocalStorage(): number
  clearPlaylist(): void
  isPlaylistLoaded(playlistLength: number): boolean
  isPlaylistPlaying(playlistLength: number): boolean
}

export class PlaylistService
  extends AbstractAudioService
  implements IPlaylistService
{
  protected audioObject: Record<string, Howl> = {}
  private currentTrack: string = ''
  private currentTrackSeek: number = 0
  private playlist: string[] = []
  private playlistVolume: number = 0
  private interval: ReturnType<typeof setInterval> | undefined = undefined
  private currentTime: number = 0

  public loadPlaylist(type: string): void {
    const playlist = this.getPlaylistType(type)
    this.initPlaylistData(playlist)
    playlist.forEach((track) => {
      const src = `/music/${type}/${track}.m4a`
      this.loadAudio(track, src, this.playlistVolume, this.audioObject)
    })
  }

  public changePlaylistType(type: string): void {
    this.stopAndUnloadCurrentPlaylist()
    this.loadPlaylist(type)
    this.playPlaylist()
  }

  public playPlaylist(): void {
    this.playCurrentTrack()
    this.startInterval()
  }

  public mutePlaylist(): void {
    this.toggleMutePlaylist(true)
  }

  public unmutePlaylist(): void {
    this.toggleMutePlaylist(false)
  }

  public getTrackDuration(): number {
    return this.durationAudio(this.currentTrack, this.audioObject)
  }

  public getCurrentTrack(): string {
    return this.currentTrack
  }

  public getTrackSeek(): number {
    return this.seekAudio(this.currentTrack, this.audioObject)
  }

  public getCurrentTime(): number {
    return this.currentTime
  }

  public pausePlaylist(): void {
    if (this.isTrackPlaying(this.currentTrack)) {
      this.currentTrackSeek = this.seekAudio(
        this.currentTrack,
        this.audioObject
      )
      this.audioObject[this.currentTrack].off('end')
      this.pauseAudio(this.currentTrack, this.audioObject)
      this.stopInterval()
    }
  }

  public skipTrack(direction: string): void {
    if (direction === 'next') {
      this.stopTrack()
      this.currentTrack = this.getNextTrack()
    } else if (direction === 'previous') {
      this.stopTrack()
      this.currentTrack = this.getPreviousTrack()
    }
    this.playPlaylist()
  }

  public changePlaylistVolume(newVolume: number): void {
    this.playlistVolume = newVolume
    this.setPlaylistVolumeInLocalStorage(newVolume)
    const playlistLength = this.playlist.length
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = this.playlist[i]
      if (this.isTrackLoaded(playlistTrack)) {
        this.audioObject[playlistTrack].volume(this.playlistVolume)
      }
    }
  }

  public getPlaylistVolumeFromLocalStorage(): number {
    const playlistVolume = localStorage.getItem('playlistVolume') ?? null
    if (playlistVolume !== null) {
      return Number(playlistVolume)
    } else {
      return this.playlistVolume
    }
  }

  public clearPlaylist(): void {
    this.stopAllTracks()
    this.unloadAllTracks()
  }

  private startInterval(): void {
    if (this.interval !== undefined) {
      clearInterval(this.interval)
    }
    this.interval = setInterval(() => {
      this.currentTime += 1
    }, 1000)
  }

  private stopInterval(): void {
    if (this.interval) {
      clearInterval(this.interval)
    }
  }

  private resetCurrentTime(): void {
    this.interval = undefined
    this.currentTime = 0
  }

  private resetCurrentTrackSeek(): void {
    this.currentTrackSeek = 0
  }

  private clearTrack(): void {
    this.resetCurrentTrackSeek()
    this.stopInterval()
    this.resetCurrentTime()
  }

  private initPlaylistData(playlist: string[]): void {
    this.playlistVolume = this.getPlaylistVolumeFromLocalStorage() ?? 0.5
    this.playlist = playlist
    this.currentTrack = this.playlist[0]
  }

  private unloadPlaylistTracks(): void {
    const playlistLength = this.playlist.length
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = this.playlist[i]
      if (this.isTrackLoaded(playlistTrack)) {
        this.unloadAudio(playlistTrack, this.audioObject)
      }
    }
  }

  private stopAndUnloadCurrentPlaylist(): void {
    this.stopAllTracks()
    this.unloadPlaylistTracks()
  }

  private toggleMutePlaylist(isMute: boolean): void {
    const playlistLength = this.playlist.length
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = this.playlist[i]
      if (this.isTrackLoaded(playlistTrack)) {
        this.audioObject[playlistTrack].mute(isMute)
      }
    }
  }

  private getNextTrack(): string {
    const currentTrackIndex = this.getCurrentTrackIndex()
    if (currentTrackIndex === this.playlist.length - 1) {
      return this.playlist[0]
    }
    const nextTrack = this.playlist[currentTrackIndex + 1]
    return nextTrack
  }

  private getPreviousTrack(): string {
    const currentTrackIndex = this.getCurrentTrackIndex()
    if (currentTrackIndex === 0) {
      return this.playlist[this.playlist.length - 1]
    }
    const previousTrack = this.playlist[currentTrackIndex - 1]
    return previousTrack
  }

  private getCurrentTrackIndex(): number {
    const currentTrack = this.currentTrack
    const currentTrackIndex = this.playlist.indexOf(currentTrack)
    return currentTrackIndex
  }

  private playCurrentTrack(): void {
    const track = this.currentTrack

    if (this.currentTrackSeek !== 0) {
      this.playAudioWithSeek(track, this.currentTrackSeek, this.audioObject)
    } else {
      this.playAudio(track, this.audioObject)
    }

    const callback = () => {
      this.clearTrack()
      this.currentTrack = this.getNextTrack()
      this.playPlaylist()
    }

    this.audioObject[track].once('end', callback)
  }

  private getPlaylistType(type: string): string[] {
    switch (type) {
      case 'asian-lofi':
        return asianLofi
      case 'christmas-lofi':
        return christmasLofi
      case 'autumn-lofi':
        return autumnLofi
      default:
        return []
    }
  }

  private stopTrack(): void {
    if (this.isTrackPlaying(this.currentTrack)) {
      this.audioObject[this.currentTrack].off('end')
      this.stopAudio(this.currentTrack, this.audioObject)
      this.clearTrack()
    }
  }

  private stopAllTracks(): void {
    this.stopAllAudio(this.audioObject)
    this.clearTrack()
  }

  private unloadAllTracks(): void {
    this.unloadAllAudio(this.audioObject)
  }

  private isTrackLoaded(playlistTrack: string): boolean {
    return this.isAudioLoaded(playlistTrack, this.audioObject)
  }

  private isTrackPlaying(playlistTrack: string): boolean {
    return this.isAudioPlaying(playlistTrack, this.audioObject)
  }

  private setPlaylistVolumeInLocalStorage(volume: number): void {
    localStorage.setItem('playlistVolume', String(volume))
  }

  public isPlaylistLoaded(playlistLength: number): boolean {
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = this.playlist[i]
      if (!this.isTrackLoaded(playlistTrack)) {
        return false
      }
    }
    return true
  }

  public isPlaylistPlaying(playlistLength: number): boolean {
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = this.playlist[i]
      if (this.isTrackPlaying(playlistTrack)) {
        return true
      }
    }
    return false
  }
}
