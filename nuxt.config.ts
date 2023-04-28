import { ServiceAccount } from 'firebase-admin/app'

const serviceAccount: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
}

export default defineNuxtConfig({
  css: ['vuetify/styles', '~/assets/main.scss'],
  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', 'nuxt-vuefire'],
  build: { transpile: ['vuetify'] },
  vite: { define: { 'process.env.DEBUG': false } },
  typescript: { shim: false },
  vuefire: {
    auth: true,
    config: {
      apiKey: 'AIzaSyDROkpZDuHw2KvV3OgPu9P-WJbk4_4-KJc',
      authDomain: 'iotactile-games.firebaseapp.com',
      databaseURL: 'https://iotactile-games-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'iotactile-games',
      storageBucket: 'iotactile-games.appspot.com',
      messagingSenderId: '863733555330',
      appId: '1:863733555330:web:5f68e24010403d7d6b949b',
      measurementId: 'G-7F7CDGDN3F'
    },
    admin: { serviceAccount }
  }
})
