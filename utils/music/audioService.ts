import { Howl } from "howler";

export abstract class AbstractAudioService {
  protected abstract audioObject: Record<string, Howl>;

  protected loadAudio(
    audio: string,
    src: string,
    volume: number,
    audioObject: Record<string, Howl>,
  ): void {
    audioObject[audio] = new Howl({
      src: [src],
      volume,
    });
  }

  protected unloadAudio(
    audio: string,
    audioObject: Record<string, Howl>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].unload();
      delete audioObject[audio];
    }
  }

  protected playAudio(audio: string, audioObject: Record<string, Howl>): void {
    if (audioObject[audio]) {
      audioObject[audio].play();
    }
  }

  protected playAudioWithSeek(
    audio: string,
    seek: number,
    audioObject: Record<string, Howl>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].seek(seek);
      audioObject[audio].play();
    }
  }

  protected stopAudio(audio: string, audioObject: Record<string, Howl>): void {
    if (audioObject[audio]) {
      audioObject[audio].stop();
    }
  }

  protected seekAudio(
    audio: string,
    audioObject: Record<string, Howl>,
  ): number {
    if (audioObject[audio]) {
      return audioObject[audio].seek();
    }
    return 0;
  }

  protected durationAudio(
    audio: string,
    audioObject: Record<string, Howl>,
  ): number {
    if (audioObject[audio]) {
      return audioObject[audio].duration();
    }
    return 0;
  }

  protected pauseAudio(audio: string, audioObject: Record<string, Howl>): void {
    if (audioObject[audio]) {
      audioObject[audio].pause();
    }
  }

  protected muteAudio(audio: string, audioObject: Record<string, Howl>): void {
    if (audioObject[audio]) {
      audioObject[audio].mute(true);
    }
  }

  protected unmuteAudio(
    audio: string,
    audioObject: Record<string, Howl>,
  ): void {
    if (audioObject[audio]) {
      audioObject[audio].mute(false);
    }
  }

  protected isAudioMuted(
    audio: string,
    audioObject: Record<string, Howl>,
  ): boolean {
    return !!audioObject[audio].mute();
  }

  protected stopAllAudio(audioObject: Record<string, Howl>): void {
    Object.values(audioObject).forEach((audio) => {
      audio.stop();
    });
  }

  protected unloadAllAudio(audioObject: Record<string, Howl>): void {
    Object.values(audioObject).forEach((audio) => {
      audio.unload();
    });
  }

  protected isAudioLoaded(
    audio: string,
    audioObject: Record<string, Howl>,
  ): boolean {
    return !!audioObject[audio];
  }

  protected isAudioPlaying(
    audio: string,
    audioObject: Record<string, Howl>,
  ): boolean {
    return !!audioObject[audio].playing();
  }
}
