import { Howl } from "howler";
import type { IAudioClip } from "./audioPort";

/** Adapter: Howler implementation of IAudioClip. */
export class HowlerAudioClip implements IAudioClip {
  private readonly howl: Howl;

  constructor(src: string, volume: number) {
    this.howl = new Howl({ src: [src], volume });
  }

  play(): void {
    this.howl.play();
  }

  stop(): void {
    this.howl.stop();
  }

  pause(): void {
    this.howl.pause();
  }

  mute(muted: boolean): void {
    this.howl.mute(muted);
  }

  muted(): boolean {
    return !!this.howl.mute();
  }

  seek(position?: number): number {
    if (typeof position === "number") {
      this.howl.seek(position);
      return position;
    }
    return this.howl.seek() as number;
  }

  duration(): number {
    return this.howl.duration();
  }

  playing(): boolean {
    return this.howl.playing();
  }

  unload(): void {
    this.howl.unload();
  }

  volume(value: number): void {
    this.howl.volume(value);
  }

  once(event: "end", callback: () => void): void {
    this.howl.once(event, callback);
  }

  off(event: "end"): void {
    this.howl.off(event);
  }
}
