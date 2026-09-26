import { AbstractAudioService } from './audioService';
import type { IAudioClip } from './audioPort';

export interface ISoundService {
  loadSound(sound: string, src: string, volume: number): void;
  unloadSound(sound: string): void;
  playSound(sound: string): void;
  muteSound(sound: string): void;
  unmuteSound(sound: string): void;
  isSoundMuted(sound: string): boolean;
  stopAllSounds(): void;
  unloadAllSounds(): void;
  isSoundLoaded(sound: string): boolean;
  isSoundPlaying(sound: string): boolean;
}

export class SoundService extends AbstractAudioService implements ISoundService {
  protected audioObject: Record<string, IAudioClip> = {};

  public loadSound(sound: string, src: string, volume: number): void {
    this.loadAudio(sound, src, volume, this.audioObject);
  }

  public unloadSound(sound: string): void {
    this.unloadAudio(sound, this.audioObject);
  }

  public playSound(sound: string): void {
    this.playAudio(sound, this.audioObject);
  }

  public muteSound(sound: string): void {
    this.muteAudio(sound, this.audioObject);
  }

  public unmuteSound(sound: string): void {
    this.unmuteAudio(sound, this.audioObject);
  }

  public isSoundMuted(sound: string): boolean {
    return this.isAudioMuted(sound, this.audioObject);
  }

  public stopAllSounds(): void {
    this.stopAllAudio(this.audioObject);
  }

  public unloadAllSounds(): void {
    this.unloadAllAudio(this.audioObject);
    this.audioObject = {};
  }

  public isSoundLoaded(sound: string): boolean {
    return this.isAudioLoaded(sound, this.audioObject);
  }

  public isSoundPlaying(sound: string): boolean {
    return this.isAudioPlaying(sound, this.audioObject);
  }
}
