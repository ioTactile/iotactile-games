<template>
  <div class="main-container">
    <div class="header-container">
      <div class="track-current-time">{{ trackSeek }}</div>
      <div class="track-title">{{ getCurrentTrack }}</div>
      <div class="track-duration">{{ trackDuration }}</div>
    </div>
    <div class="footer-container">
      <button class="playlist">
        <v-icon
          :icon="mdiFormatListCheckbox"
          size="25"
          @click="isShowPlaylists = !isShowPlaylists"
        />
      </button>
      <div class="action-button">
        <button class="previous-track" @click="handleSkipTrack('previous')">
          <v-icon :icon="mdiSkipPrevious" color="onSurface" />
        </button>
        <Tooltip
          class="toggle-pause"
          :content="handleVolumeIconTooltips"
          position="top"
          :slot-width="30"
          :slot-height="30"
        >
          <template #activator="{ onMouseover, onMouseleave }">
            <button
              @click="handlePlayPause"
              @mouseover="onMouseover"
              @mouseleave="onMouseleave"
            >
              <v-icon :icon="togglePlayPauseIcon" color="onSurface" />
            </button>
          </template>
        </Tooltip>
        <button class="next-track" @click="handleSkipTrack('next')">
          <v-icon :icon="mdiSkipNext" color="onSurface" />
        </button>
      </div>
      <musicplayer-volume
        :is-music-muted="isMusicMuted"
        :playlist-service="playlist"
        :current-playlist-genre="getPlaylistGenres"
      />
    </div>
    <template v-if="isShowPlaylists">
      <div class="playlists-container">
        <ul class="list-container">
          <li
            v-for="(p, i) in playlists"
            :key="i"
            class="list-content"
            @click="changePlaylist(p.value, p.tracks)"
          >
            {{ p.value }}
          </li>
        </ul>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { VIcon } from 'vuetify/components'
import {
  mdiFormatListCheckbox,
  mdiSkipPrevious,
  mdiPause,
  mdiPlay,
  mdiSkipNext
} from '@mdi/js'
import { timerFormatterLessThanTenMinutes } from '~/utils'
import { usePlaylistStore } from '~/stores/playlist'

if (process.client) {
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'm') {
      handlePlayPause()
    }
  })
}

onMounted(() => {
  isMusicActive.value = false
  isMusicMuted.value = false
  isMusicPaused.value = true
})

const playlistStore = usePlaylistStore()

const { playlist, isMusicActive, isMusicMuted, isMusicPaused } =
  storeToRefs(playlistStore)

const isShowPlaylists = ref<boolean>(false)

const playlists = [
  { value: 'chill', tracks: audioTracks(20) },
  { value: 'synthwave', tracks: audioTracks(25) }
]

playlist.value.loadPlaylist('chill', audioTracks(20))

const trackSeek = computed((): string => {
  return timerFormatterLessThanTenMinutes(
    Math.round(playlist.value.getTrackSeek())
  )
})

const trackDuration = computed((): string => {
  return timerFormatterLessThanTenMinutes(
    Math.round(playlist.value.getTrackDuration())
  )
})

const getPlaylistGenres = computed((): string => {
  return playlist.value.getCurrentPlaylistGenre()
})

const getCurrentTrack = computed((): string => {
  return playlist.value.getCurrentTrack()
})

const togglePlayPauseIcon = computed((): string => {
  return isMusicPaused.value ? mdiPlay : mdiPause
})

const handleVolumeIconTooltips = computed((): string => {
  return !isMusicMuted.value
    ? 'Désactiver la musique (m)'
    : 'Activer la musique (m)'
})

const handlePlayPause = (): void => {
  if (!isMusicActive.value) {
    isMusicActive.value = true
    isMusicPaused.value = false
    playlist.value.playPlaylist(getPlaylistGenres.value)
    return
  }

  if (isMusicPaused.value) {
    playlist.value.playPlaylist(getPlaylistGenres.value)
    isMusicPaused.value = false
  } else {
    playlist.value.pausePlaylist()
    isMusicPaused.value = true
  }
}

const handleSkipTrack = (direction: string): void => {
  if (direction === 'previous') {
    playlist.value.skipTrack('previous')
    isMusicPaused.value = false
  } else {
    playlist.value.skipTrack('next')
    isMusicPaused.value = false
  }
}

const changePlaylist = (genre: string, tracks: string[]): void => {
  playlist.value.changePlaylistGenre(genre, tracks)
  isMusicPaused.value = false
  isShowPlaylists.value = false
}

onBeforeUnmount(() => {
  playlist.value.clearPlaylist()
})
</script>

<style scoped lang="scss">
.main-container {
  width: 300px;
  height: auto;
  padding: 0.5rem 1rem;
  background-color: rgb(var(--v-theme-background));
  border-radius: 8px;
  box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.2);

  .header-container,
  .footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 3rem;

    .action-button {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100px;
    }
  }

  .header-container {
    .track-current-time,
    .track-duration {
      font-size: 0.75rem;
      color: rgb(var(--v-theme-onBackground));
    }

    .track-title {
      font-size: 0.875rem;
      color: rgb(var(--v-theme-onBackground));
    }
  }

  .playlists-container {
    background-color: rgb(var(--v-theme-background));

    .list-container {
      list-style: inside '- ';

      .list-content {
        text-transform: capitalize;
        padding: 0.5rem;
        color: rgb(var(--v-theme-onBackground));
        cursor: pointer;

        &:hover {
          background-color: rgba(var(--v-theme-onBackground), 0.25);
        }
      }
    }
  }
}
</style>
