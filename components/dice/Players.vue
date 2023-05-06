<template>
  <v-row>
    <v-col cols="3" class="px-0 py-2">
      <v-card
        class="mx-2"
        color="dicePrimary"
        :class="
          players[0]?.id === user?.uid
            ? 'card-container-currentuser'
            : 'card-container'
        "
        rounded="0"
      >
        <div class="d-flex text-center text-h6 pa-2">
          <span class="letter-spacing">A</span>
          <span>{{ players[0]?.username }}</span>
        </div>
      </v-card>
    </v-col>
    <v-col cols="3" class="px-0 py-2">
      <v-card
        class="mx-2"
        color="dicePrimary"
        :class="
          players[1]?.id === user?.uid
            ? 'card-container-currentuser'
            : 'card-container'
        "
        rounded="0"
      >
        <div class="d-flex text-center text-h6 pa-2">
          <span class="letter-spacing">B</span>
          <span>{{ players[1]?.username }}</span>
        </div>
      </v-card>
    </v-col>
    <v-col cols="3" class="px-0 py-2">
      <v-card
        class="mx-2"
        color="dicePrimary"
        :class="
          players[2]?.id === user?.uid
            ? 'card-container-currentuser'
            : 'card-container'
        "
        rounded="0"
      >
        <div class="d-flex text-center text-h6 pa-2">
          <span class="letter-spacing">C</span>
          <span>{{ players[2]?.username }}</span>
        </div>
      </v-card>
    </v-col>
    <v-col cols="3" class="px-0 py-2">
      <v-card
        class="mx-2"
        color="dicePrimary"
        :class="
          players[3]?.id === user?.uid
            ? 'card-container-currentuser'
            : 'card-container'
        "
        rounded="0"
      >
        <div class="d-flex text-center text-h6 pa-2">
          <span class="letter-spacing">D</span>
          <span>{{ players[3]?.username }}</span>
        </div>
      </v-card>
    </v-col>
  </v-row>
</template>

<script lang="ts" setup>
import { CardUser } from '~/functions/src/types'

const user = useCurrentUser()

defineProps<{
  players: CardUser[]
}>()

// const userLetter = (index: number) => {
//   const letters = ['A', 'B', 'C', 'D']
//   return letters[index]
// }
</script>

<style scoped>
.letter-spacing {
  width: 30px;
}

.card-container {
  border: 1px solid red;
}

.card-container-currentuser {
  border: 1px solid blue;
}
</style>
