/** Port: audio clip independent from Howler (hexagonal). */
export interface IAudioClip {
  play(): void;
  stop(): void;
  pause(): void;
  mute(muted: boolean): void;
  muted(): boolean;
  seek(position?: number): number;
  duration(): number;
  playing(): boolean;
  unload(): void;
  volume(value: number): void;
  once(event: "end", callback: () => void): void;
  off(event: "end"): void;
}
