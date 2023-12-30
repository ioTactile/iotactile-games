<template>
  <div class="content__header">
    <button class="button-rules svg-container" @click="openRulesModal">
      <svg
        fill="#CFD8DC"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        width="20px"
        height="20px"
        viewBox="0 0 491.535 491.535"
        xml:space="preserve"
      >
        <g id="SVGRepo_bgCarrier" stroke-width="0" />

        <g
          id="SVGRepo_tracerCarrier"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <g id="SVGRepo_iconCarrier">
          <g>
            <g>
              <g id="Icons_9_">
                <g>
                  <path
                    d="M306.545,367.594H185.003c-9.041,0-16.382,7.338-16.382,16.385c0,9.05,7.341,16.384,16.382,16.384h121.542 c9.041,0,16.389-7.334,16.389-16.384C322.934,374.932,315.586,367.594,306.545,367.594z"
                  />
                  <path
                    d="M213.917,464.367v8.926c0,10.076,8.157,18.242,18.239,18.242h27.233c10.062,0,18.239-8.166,18.239-18.242v-8.926 c20.642-1.467,36.981-18.498,36.981-39.506H176.92C176.921,445.869,193.277,462.9,213.917,464.367z"
                  />
                  <path
                    d="M245.777,0C155.084,0,81.561,73.516,81.561,164.207c0,38.268,13.164,73.396,35.152,101.287 c19.444,24.647,37.874,51.592,53.76,78.688h150.583c16.049-27.353,34.146-53.793,53.78-78.707 c21.968-27.878,35.139-63.011,35.139-101.27C409.975,73.517,336.451,0,245.777,0z M246.05,56.971 c-58.297,0-105.702,47.412-105.702,105.692c0,9.048-7.327,16.385-16.389,16.385c-9.056,0-16.383-7.337-16.383-16.385 c0-76.346,62.114-138.46,138.474-138.46c9.034,0,16.383,7.334,16.383,16.382S255.084,56.971,246.05,56.971z"
                  />
                </g>
              </g>
            </g>
          </g>
        </g>
      </svg>
    </button>
    <time class="timer">
      {{ timerFormatter(elapsedTime, true) }}
    </time>
    <div class="void" />
  </div>
</template>

<script setup lang="ts">
import { timerFormatter } from "~/utils";

defineProps<{
  elapsedTime: number;
}>();

const emit = defineEmits<{ (e: "openRulesModal", value: boolean): void }>();

const openRulesModal = () => {
  emit("openRulesModal", true);
};
</script>

<style scoped lang="scss">
.content__header {
  display: flex;
  justify-content: center;
  align-items: center;

  .button-rules {
    width: 30px;
    height: 30px;
    background-color: rgb(var(--v-theme-takuzuMainOnSurface));
    border: 1px solid rgb(var(--v-theme-takuzuMainSuface));
    border-radius: 50%;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
    transition: all 0.2s ease-in-out;
  }

  .timer {
    width: 150px;
    height: 30px;
    text-align: center;
    padding: 2.5px 5px;
    margin: 0 20px;
    background-color: #ffffff;
    color: rgb(var(--v-theme-takuzuMainOnSurface));
    border-radius: 20px;
    box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.25);
  }

  .void {
    width: 30px;
    height: 30px;
  }
}
</style>
