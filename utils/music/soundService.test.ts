import { describe, beforeEach, test, expect, afterEach, vi } from "vitest";
import { SoundService } from "./soundService";

vi.mock("howler", () => {
  class HowlMock {
    private _muted = false;
    private _playing = false;

    play() {
      this._playing = true;
    }

    stop() {
      this._playing = false;
    }

    unload() {
      this._playing = false;
    }

    mute(value?: boolean) {
      if (typeof value === "boolean") {
        this._muted = value;
      }
      return this._muted;
    }

    playing() {
      return this._playing;
    }
  }

  return { Howl: HowlMock };
});

describe("SoundService", () => {
  let soundService: SoundService;
  const sounds = [
    {
      name: "Benzaiten Asian Lofi",
      src: "/music/asian-lofi/Benzaiten Asian Lofi.m4a",
    },
    {
      name: "Blossom Tree Asian Lofi",
      src: "/music/asian-lofi/Blossom Tree Asian Lofi.m4a",
    },
  ];

  beforeEach(() => {
    soundService = new SoundService();
  });

  afterEach(() => {
    soundService.unloadAllSounds();
  });

  test("should load sound", () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    expect(soundService.isSoundLoaded(sounds[0].name)).toBe(true);
  });

  test("should unload sound", () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.unloadSound(sounds[0].name);
    expect(soundService.isSoundLoaded(sounds[0].name)).toBe(false);
  });

  test("should play sound", () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.playSound(sounds[0].name);
    expect(soundService.isSoundPlaying(sounds[0].name)).toBe(true);
  });

  test("should mute sound", () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.muteSound(sounds[0].name);
    expect(soundService.isSoundMuted(sounds[0].name)).toBe(true);
  });

  test("should unmute sound", () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.muteSound(sounds[0].name);
    soundService.unmuteSound(sounds[0].name);
    expect(soundService.isSoundMuted(sounds[0].name)).toBe(false);
  });

  test("should stop all sounds", () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.loadSound(sounds[1].name, sounds[1].src, 0.5);
    soundService.playSound(sounds[0].name);
    soundService.playSound(sounds[1].name);
    soundService.stopAllSounds();
    expect(soundService.isSoundPlaying(sounds[0].name)).toBe(false);
    expect(soundService.isSoundPlaying(sounds[1].name)).toBe(false);
  });

  test("should unload all sounds", () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.loadSound(sounds[1].name, sounds[1].src, 0.5);
    soundService.unloadAllSounds();
    expect(soundService.isSoundLoaded(sounds[0].name)).toBe(false);
    expect(soundService.isSoundLoaded(sounds[1].name)).toBe(false);
  });
});
