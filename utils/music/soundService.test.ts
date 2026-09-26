import { describe, beforeEach, test, expect, afterEach } from 'vitest';
import { SoundService } from './soundService';
import type { IAudioClip } from './audioPort';

const createFakeClip = (): IAudioClip => {
  let playing = false;
  let muted = false;

  return {
    play: () => {
      playing = true;
    },
    stop: () => {
      playing = false;
    },
    pause: () => {
      playing = false;
    },
    mute: (value: boolean) => {
      muted = value;
    },
    muted: () => muted,
    seek: () => 0,
    duration: () => 1,
    playing: () => playing,
    unload: () => {
      playing = false;
    },
    volume: () => undefined,
    once: () => undefined,
    off: () => undefined,
  };
};

describe('SoundService', () => {
  let soundService: SoundService;
  const sounds = [
    {
      name: 'Benzaiten Asian Lofi',
      src: '/music/asian-lofi/Benzaiten Asian Lofi.m4a',
    },
    {
      name: 'Blossom Tree Asian Lofi',
      src: '/music/asian-lofi/Blossom Tree Asian Lofi.m4a',
    },
  ];

  beforeEach(() => {
    soundService = new SoundService(() => createFakeClip());
  });

  afterEach(() => {
    soundService.unloadAllSounds();
  });

  test('should load sound', () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    expect(soundService.isSoundLoaded(sounds[0].name)).toBe(true);
  });

  test('should unload sound', () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.unloadSound(sounds[0].name);
    expect(soundService.isSoundLoaded(sounds[0].name)).toBe(false);
  });

  test('should play sound', () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.playSound(sounds[0].name);
    expect(soundService.isSoundPlaying(sounds[0].name)).toBe(true);
  });

  test('should mute sound', () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.muteSound(sounds[0].name);
    expect(soundService.isSoundMuted(sounds[0].name)).toBe(true);
  });

  test('should unmute sound', () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.muteSound(sounds[0].name);
    soundService.unmuteSound(sounds[0].name);
    expect(soundService.isSoundMuted(sounds[0].name)).toBe(false);
  });

  test('should stop all sounds', () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.loadSound(sounds[1].name, sounds[1].src, 0.5);
    soundService.playSound(sounds[0].name);
    soundService.playSound(sounds[1].name);
    soundService.stopAllSounds();
    expect(soundService.isSoundPlaying(sounds[0].name)).toBe(false);
    expect(soundService.isSoundPlaying(sounds[1].name)).toBe(false);
  });

  test('should unload all sounds', () => {
    soundService.loadSound(sounds[0].name, sounds[0].src, 0.5);
    soundService.loadSound(sounds[1].name, sounds[1].src, 0.5);
    soundService.unloadAllSounds();
    expect(soundService.isSoundLoaded(sounds[0].name)).toBe(false);
    expect(soundService.isSoundLoaded(sounds[1].name)).toBe(false);
  });
});
