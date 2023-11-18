import { Howl } from 'howler'
import { AbstractAudioService } from './audioService'

export interface IPlaylistService {
  loadPlaylist(playlistGenre: string, playlist: string[]): void
  unloadPlaylist(playlistGenre: string): void
  changePlaylistGenre(playlistGenre: string, playlist: string[]): void
  playPlaylist(playlistGenre: string): void
  mutePlaylist(): void
  unmutePlaylist(): void
  getTrackSeek(): number
  getTrackDuration(): number
  getCurrentTrack(): string
  getCurrentPlaylistGenre(): string
  pausePlaylist(): void
  skipTrack(direction: string): void
  changePlaylistVolume(playlistGenre: string, newVolume: number): void
  getPlaylistVolumeFromLocalStorage(): number
  clearPlaylist(): void
  isPlaylistLoaded(playlistGenre: string, playlistLength: number): boolean
  isPlaylistPlaying(playlistGenre: string, playlistLength: number): boolean
}

export class PlaylistService
  extends AbstractAudioService
  implements IPlaylistService
{
  protected audioObject: Record<string, Howl> = {}
  private currentTrack: string = ''
  private currentTrackID: number = 0
  private currentTrackSeek: number = 0
  private playlist: Record<string, string[]> = {}
  private currentPlaylistGenre: string = ''
  private playlistVolume: number = 0

  public loadPlaylist(playlistGenre: string, playlist: string[]): void {
    this.initPlaylistData(playlistGenre, playlist)
    playlist.forEach((track, index) => {
      const playlistTrack = `${playlistGenre}-${index}`
      const src = `/music/${playlistGenre}/${track}`
      this.loadAudio(playlistTrack, src, this.playlistVolume, this.audioObject)
    })
  }

  public unloadPlaylist(playlistGenre: string): void {
    this.unloadAllTracksInPlaylist(playlistGenre)
    this.resetCurrentPlaylistData()
  }

  public changePlaylistGenre(playlistGenre: string, playlist: string[]): void {
    this.stopAndUnloadCurrentPlaylist()
    this.loadPlaylist(playlistGenre, playlist)
    this.playPlaylist(playlistGenre)
  }

  public playPlaylist(playlistGenre: string): void {
    const nextTrack = this.getNextTrack(playlistGenre)
    this.playCurrentTrack(nextTrack)
  }

  public mutePlaylist(): void {
    this.toggleMutePlaylist(true)
  }

  public unmutePlaylist(): void {
    this.toggleMutePlaylist(false)
  }

  public getTrackSeek(): number {
    return this.seekAudio(this.currentTrack, this.audioObject)
  }

  public getTrackDuration(): number {
    return this.durationAudio(this.currentTrack, this.audioObject)
  }

  public getCurrentTrack(): string {
    return this.currentTrack
  }

  public getCurrentPlaylistGenre(): string {
    return this.currentPlaylistGenre
  }

  public pausePlaylist(): void {
    if (this.isTrackPlaying(this.currentTrack)) {
      this.pauseAudio(this.currentTrack, this.audioObject)
      this.currentTrackSeek = this.getTrackSeek()
    }
  }

  public skipTrack(direction: string): void {
    if (direction === 'next') {
      this.stopTrack()
      if (
        this.getCurrentTrackNumber() ===
        this.playlist[this.currentPlaylistGenre].length - 1
      ) {
        this.currentTrack = `${this.currentPlaylistGenre}-0`
      }
    } else if (direction === 'previous') {
      this.stopTrack()
      if (this.getCurrentTrackNumber() === 0) {
        this.currentTrack = `${this.currentPlaylistGenre}-${
          this.playlist[this.currentPlaylistGenre].length - 1
        }`
      }
    }
    this.playPlaylist(this.currentPlaylistGenre)
  }

  public changePlaylistVolume(playlistGenre: string, newVolume: number): void {
    this.playlistVolume = newVolume
    this.setPlaylistVolumeInLocalStorage(newVolume)
    const playlistLength = this.playlist[playlistGenre].length
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = `${playlistGenre}-${i}`
      if (this.isTrackLoaded(playlistTrack)) {
        this.audioObject[playlistTrack].volume(this.playlistVolume)
      }
    }
  }

  public getPlaylistVolumeFromLocalStorage(): number {
    const playlistVolume = localStorage.getItem('playlistVolume')
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

  private initPlaylistData(playlistGenre: string, playlist: string[]): void {
    this.playlistVolume = this.getPlaylistVolumeFromLocalStorage() ?? 0.5
    this.playlist[playlistGenre] = playlist
    this.currentTrack = `${playlistGenre}-0`
    this.currentPlaylistGenre = playlistGenre
  }

  private unloadAllTracksInPlaylist(playlistGenre: string): void {
    const playlistLength = this.playlist[playlistGenre].length
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = `${playlistGenre}-${i}`
      if (this.isTrackLoaded(playlistTrack)) {
        this.unloadAudio(playlistTrack, this.audioObject)
      }
    }
    this.resetCurrentPlaylistData()
  }

  private stopAndUnloadCurrentPlaylist(): void {
    this.stopAllTracks()
    this.unloadPlaylist(this.currentPlaylistGenre)
  }

  private toggleMutePlaylist(isMute: boolean): void {
    const playlistLength = this.playlist[this.currentPlaylistGenre].length
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = `${this.currentPlaylistGenre}-${i}`
      if (this.isTrackLoaded(playlistTrack)) {
        this.audioObject[playlistTrack].mute(isMute)
      }
    }
  }

  private getNextTrack(playlistGenre: string): string {
    const nextTrackNumber =
      this.getCurrentTrackNumber() === this.playlist[playlistGenre].length - 1
        ? 0
        : this.getCurrentTrackNumber() + 1
    return `${playlistGenre}-${nextTrackNumber}`
  }

  private playCurrentTrack(track: string): void {
    this.currentTrackID = this.audioObject[track].play()
    this.playAudio(track, this.audioObject)
    if (this.isAudioPlaying(track, this.audioObject)) {
      this.audioObject[track].seek(this.currentTrackSeek)
    }
    this.audioObject[track].once('end', () => {
      this.currentTrack = this.getNextTrack(this.currentPlaylistGenre)
      this.playPlaylist(this.currentPlaylistGenre)
    })
  }

  private resetCurrentPlaylistData(): void {
    this.currentTrack = ''
    this.currentPlaylistGenre = ''
  }

  private getCurrentTrackNumber(): number {
    return Number(this.currentTrack.split('-')[1])
  }

  private stopTrack(): void {
    if (this.isTrackPlaying(this.currentTrack)) {
      this.stopAudio(this.currentTrack, this.audioObject)
      this.audioObject[this.currentTrack].off('end', this.currentTrackID)
    }
  }

  private stopAllTracks(): void {
    this.stopAllAudio(this.audioObject)
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

  private shuffleAndStorePlaylist(
    playlistGenre: string,
    audioTracks: string[]
  ): void {
    const audioTracksCopy = [...audioTracks]
    for (let i = audioTracksCopy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      const temp = audioTracksCopy[i]
      audioTracksCopy[i] = audioTracksCopy[j]
      audioTracksCopy[j] = temp
    }
    this.playlist[playlistGenre] = audioTracksCopy
  }

  private setPlaylistVolumeInLocalStorage(volume: number): void {
    localStorage.setItem('playlistVolume', String(volume))
  }

  public isPlaylistLoaded(
    playlistGenre: string,
    playlistLength: number
  ): boolean {
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = `${playlistGenre}-${i}`
      if (!this.isTrackLoaded(playlistTrack)) {
        return false
      }
    }
    return true
  }

  public isPlaylistPlaying(
    playlistGenre: string,
    playlistLength: number
  ): boolean {
    for (let i = 0; i < playlistLength; i++) {
      const playlistTrack = `${playlistGenre}-${i}`
      if (this.isTrackPlaying(playlistTrack)) {
        return true
      }
    }
    return false
  }
}
