// import { type ServiceAccount } from 'firebase-admin/app'

// const serviceAccount: ServiceAccount = {
//   projectId: process.env.FIREBASE_PROJECT_ID,
//   clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//   privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
// }

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  css: ['vuetify/styles', '~/assets/main.scss'],
  modules: ['@pinia/nuxt', '@pinia-plugin-persistedstate/nuxt', 'nuxt-vuefire'],
  build: { transpile: ['vuetify'] },
  vite: { define: { 'process.env.DEBUG': false } },
  typescript: { shim: false },
  runtimeConfig: {
    APP_CHECK_DEBUG_TOKEN_FROM_CI: process.env.APP_CHECK_DEBUG_TOKEN_FROM_CI
  },
  vuefire: {
    auth: {
      enabled: true
    },
    appCheck: {
      debug: process.env.NODE_ENV !== 'production',
      isTokenAutoRefreshEnabled: true,
      provider: 'ReCaptchaV3',
      key: '6LeX9wgmAAAAAHi6PchwsVVGppRZRK2OOHTdIUUJ'
    },
    config: {
      apiKey: 'AIzaSyDROkpZDuHw2KvV3OgPu9P-WJbk4_4-KJc',
      authDomain: 'iotactile-games.firebaseapp.com',
      databaseURL:
        'https://iotactile-games-default-rtdb.europe-west1.firebasedatabase.app',
      projectId: 'iotactile-games',
      storageBucket: 'iotactile-games.appspot.com',
      messagingSenderId: '863733555330',
      appId: '1:863733555330:web:5f68e24010403d7d6b949b',
      measurementId: 'G-7F7CDGDN3F'
    }
    // admin: { serviceAccount }
  }
})
