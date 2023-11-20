<template>
  <div class="main-container">
    <div class="header-container">
      <div class="track-current-time">{{ currentTime }}</div>
      <div class="track-title-container">
        <div class="track-title">
          <div class="text">{{ getCurrentTrack }}</div>
        </div>
      </div>
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
      <musicplayer-volume :is-music-muted="isMusicMuted" :playlist="playlist" />
    </div>
    <template v-if="isShowPlaylists">
      <div class="playlists-container">
        <ul class="list-container">
          <li v-for="(p, i) in playlists" :key="i" class="list-content">
            <button @click="changePlaylistType(p.value)">
              {{ p.name }}
            </button>
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
import { PlaylistService } from '~/utils/music/playlistService'
import type { IPlaylistService } from '~/utils/music/playlistService'

if (process.client) {
  window.addEventListener('keyup', (e: KeyboardEvent) => {
    if (e.key === 'm') {
      handlePlayPause()
    }
  })
}

const playlist = ref<IPlaylistService>(new PlaylistService())
const isShowPlaylists = ref<boolean>(false)
const isMusicActive = ref<boolean>(false)
const isMusicMuted = ref<boolean>(false)
const isMusicPaused = ref<boolean>(true)

const playlists = [
  { name: 'Christmas Lofi', value: 'christmas-lofi' },
  { name: 'Autumn Lofi', value: 'autumn-lofi' },
  { name: 'Asian Lofi', value: 'asian-lofi' },
  { name: 'Synthwave', value: 'synthwave' }
]

onMounted(() => {
  playlist.value.loadPlaylist('christmas-lofi')
})

const currentTime = computed((): string => {
  return timerFormatterLessThanTenMinutes(
    Math.round(playlist.value.getCurrentTime())
  )
})

const trackDuration = computed((): string => {
  return timerFormatterLessThanTenMinutes(
    Math.round(playlist.value.getTrackDuration())
  )
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
    playlist.value.playPlaylist()
    return
  }

  if (isMusicPaused.value) {
    playlist.value.playPlaylist()
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

const changePlaylistType = (type: string): void => {
  playlist.value.changePlaylistType(type)
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

    .track-title-container {
      width: 160px;
      overflow: hidden;

      .track-title {
        position: relative;
        font-size: 0.875rem;
        color: rgb(var(--v-theme-onBackground));
        width: 160px;
        white-space: nowrap;
        overflow: hidden;

        .text {
          display: inline-block;
          animation: marquee 10s linear infinite;

          @keyframes marquee {
            0% {
              transform: translateX(160px);
            }

            100% {
              transform: translateX(-100%);
            }
          }
        }
      }
    }
  }

  .playlists-container {
    background-color: rgb(var(--v-theme-background));

    .list-container {
      list-style: none;

      .list-content {
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
