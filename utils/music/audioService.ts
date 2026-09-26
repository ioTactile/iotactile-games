import type { IAudioClip } from "./audioPort";
import { HowlerAudioClip } from "./howlerAudioClip";

export type AudioClipFactory = (src: string, volume: number) => IAudioClip;

const defaultAudioClipFactory: AudioClipFactory = (src, volume) =>
  new HowlerAudioClip(src, volume);

export abstract class AbstractAudioService {
  protected abstract audioObject: Record<string, IAudioClip>;
  private readonly createClip: AudioClipFactory;

  constructor(createClip: AudioClipFactory = defaultAudioClipFactory) {
    this.createClip = createClip;
  }

  protected loadAudio(
    audio: string,
    src: string,
    volume: number,
    audioObject: Record<string, IAudioClip>,
  ): void {
    audioObject[audio] = this.createClip(src, volume);
  }

  protected unloadAudio(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].unload();
      delete audioObject[audio];
    }
  }

  protected playAudio(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].play();
    }
  }

  protected playAudioWithSeek(
    audio: string,
    seek: number,
    audioObject: Record<string, IAudioClip>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].seek(seek);
      audioObject[audio].play();
    }
  }

  protected stopAudio(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].stop();
    }
  }

  protected seekAudio(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): number {
    if (audioObject[audio]) {
      return audioObject[audio].seek();
    }
    return 0;
  }

  protected durationAudio(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): number {
    if (audioObject[audio]) {
      return audioObject[audio].duration();
    }
    return 0;
  }

  protected pauseAudio(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].pause();
    }
  }

  protected muteAudio(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].mute(true);
    }
  }

  protected unmuteAudio(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].mute(false);
    }
  }

  protected isAudioMuted(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): boolean {
    return !!audioObject[audio]?.muted();
  }

  protected stopAllAudio(audioObject: Record<string, IAudioClip>): void {
    Object.values(audioObject).forEach((audio) => {
      audio.stop();
    });
  }

  protected unloadAllAudio(audioObject: Record<string, IAudioClip>): void {
    Object.values(audioObject).forEach((audio) => {
      audio.unload();
    });
  }

  protected isAudioLoaded(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): boolean {
    return !!audioObject[audio];
  }

  protected isAudioPlaying(
    audio: string,
    audioObject: Record<string, IAudioClip>,
  ): boolean {
    return !!audioObject[audio]?.playing();
  }
}
