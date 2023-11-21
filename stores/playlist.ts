import { defineStore } from 'pinia'
import { PlaylistService } from '~/utils/music/playlistService'
import type { IPlaylistService } from '~/utils/music/playlistService'

export const usePlaylistStore = defineStore(
  'playlist',
  () => {
    const playlist = ref<IPlaylistService>(new PlaylistService())
    const isMusicActive = ref<boolean>(false)
    const isMusicMuted = ref<boolean>(false)
    const isMusicPaused = ref<boolean>(true)

    return {
      playlist,
      isMusicActive,
      isMusicMuted,
      isMusicPaused
    }
  },
  {
    persist: true
  }
)
