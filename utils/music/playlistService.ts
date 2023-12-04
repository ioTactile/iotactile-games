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
  getCustomTrackName(): string
  getTrackSeek(): number
  getCurrentTime(): number
  pausePlaylist(): void
  skipTrack(direction: string): void
  changePlaylistVolume(newVolume: number): void
  getPlaylistVolumeFromLocalStorage(): number
  clearPlaylist(): void
  isPlaylistLoaded(): boolean
  isPlaylistPlaying(): boolean
}

export class PlaylistService
  extends AbstractAudioService
  implements IPlaylistService
{
  protected audioObject: Record<string, Howl> = {}
  private currentTrack: string = ''
  private currentTrackSeek: number = 0
  private playlist: string[] = []
  private playlistType: string = ''
  private playlistVolume: number = 0
  private interval: ReturnType<typeof setInterval> | undefined = undefined
  private currentTime: number = 0

  public loadPlaylist(type: string): void {
    const playlist = this.handlePlaylistType(type)
    this.initPlaylistData(type, playlist)
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

  public getCustomTrackName(): string {
    return this.handleCustomTrackName(this.playlistType, this.currentTrack)
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
    this.stopTrack()
    this.currentTrack =
      direction === 'next' ? this.getNextTrack() : this.getPreviousTrack()
    this.playPlaylist()
  }

  public changePlaylistVolume(newVolume: number): void {
    this.playlistVolume = newVolume
    this.setPlaylistVolumeInLocalStorage(newVolume)
    this.adjustVolumeForAllTracks()
  }

  public getPlaylistVolumeFromLocalStorage(): number {
    return Number(localStorage.getItem('playlistVolume')) || this.playlistVolume
  }

  public clearPlaylist(): void {
    this.stopAllTracks()
    this.unloadAllTracks()
  }

  public isPlaylistLoaded(): boolean {
    return this.playlist.every((playlistTrack) =>
      this.isTrackLoaded(playlistTrack)
    )
  }

  public isPlaylistPlaying(): boolean {
    return this.playlist.some((playlistTrack) =>
      this.isTrackPlaying(playlistTrack)
    )
  }

  private adjustVolumeForAllTracks(): void {
    this.playlist.forEach((playlistTrack) => {
      if (this.isTrackLoaded(playlistTrack)) {
        this.audioObject[playlistTrack].volume(this.playlistVolume)
      }
    })
  }

  private toggleMutePlaylist(isMute: boolean): void {
    this.playlist.forEach((playlistTrack) => {
      if (this.isTrackLoaded(playlistTrack)) {
        this.audioObject[playlistTrack].mute(isMute)
      }
    })
  }

  private startInterval(): void {
    this.stopInterval()
    this.interval = setInterval(() => {
      this.currentTime += 1
    }, 1000)
  }

  private stopInterval(): void {
    clearInterval(this.interval)
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

  private initPlaylistData(type: string, playlist: string[]): void {
    this.playlistVolume = this.getPlaylistVolumeFromLocalStorage() ?? 0.5
    this.playlist = playlist
    this.playlistType = type
    this.currentTrack = this.playlist[0]
  }

  private unloadPlaylistTracks(): void {
    this.playlist.forEach((playlistTrack) => {
      if (this.isTrackLoaded(playlistTrack)) {
        this.unloadAudio(playlistTrack, this.audioObject)
      }
    })
  }

  private stopAndUnloadCurrentPlaylist(): void {
    this.stopAllTracks()
    this.unloadPlaylistTracks()
  }

  private getNextTrack(): string {
    const currentTrackIndex = this.getCurrentTrackIndex()
    return currentTrackIndex === this.playlist.length - 1
      ? this.playlist[0]
      : this.playlist[currentTrackIndex + 1]
  }

  private getPreviousTrack(): string {
    const currentTrackIndex = this.getCurrentTrackIndex()
    return currentTrackIndex === 0
      ? this.playlist[this.playlist.length - 1]
      : this.playlist[currentTrackIndex - 1]
  }

  private getCurrentTrackIndex(): number {
    return this.playlist.indexOf(this.currentTrack)
  }

  private playCurrentTrack(): void {
    const track = this.currentTrack
    const playCallback = () => {
      this.clearTrack()
      this.currentTrack = this.getNextTrack()
      this.playPlaylist()
    }

    if (this.currentTrackSeek !== 0) {
      this.playAudioWithSeek(track, this.currentTrackSeek, this.audioObject)
    } else {
      this.playAudio(track, this.audioObject)
    }

    this.audioObject[track].once('end', playCallback)
  }

  private handlePlaylistType(type: string): string[] {
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

  private handleCustomTrackName(type: string, track: string): string {
    switch (type) {
      case 'asian-lofi':
        return track.replace('Asian', '⛩️ Asian')
      case 'christmas-lofi':
        return track.replace('Christmas', '❄️ Christmas')
      case 'autumn-lofi':
        return track.replace('Autumn', '🍂 Autumn')
      default:
        return track
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
}
