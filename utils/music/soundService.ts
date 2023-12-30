import { Howl } from "howler";
import { AbstractAudioService } from "./audioService";

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

export class SoundService
  extends AbstractAudioService
  implements ISoundService
{
  protected audioObject: Record<string, Howl> = {};

  public loadSound(sound: string, src: string, volume: number): void {
    this.audioObject[sound] = new Howl({
      src: [src],
      volume,
    });
  }

  public unloadSound(sound: string): void {
    if (this.audioObject[sound]) {
      this.audioObject[sound].unload();
      delete this.audioObject[sound];
    }
  }

  public playSound(sound: string): void {
    if (this.audioObject[sound]) {
      this.audioObject[sound].play();
    }
  }

  public muteSound(sound: string): void {
    if (this.audioObject[sound]) {
      this.audioObject[sound].mute(true);
    }
  }

  public unmuteSound(sound: string): void {
    if (this.audioObject[sound]) {
      this.audioObject[sound].mute(false);
    }
  }

  public isSoundMuted(sound: string): boolean {
    return !!this.audioObject[sound]?.mute();
  }

  public stopAllSounds(): void {
    Object.values(this.audioObject).forEach((audio) => {
      audio.stop();
    });
  }

  public unloadAllSounds(): void {
    Object.values(this.audioObject).forEach((audio) => {
      audio.unload();
    });
  }

  public isSoundLoaded(sound: string): boolean {
    return !!this.audioObject[sound];
  }

  public isSoundPlaying(sound: string): boolean {
    return !!this.audioObject[sound]?.playing();
  }
}
