export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "nuxt-vuefire",
    "@vueuse/nuxt",
  ],
  css: ["vuetify/styles", "~/assets/main.scss"],
  build: { transpile: ["vuetify"] },
  vite: { define: { "process.env.DEBUG": false } },
  runtimeConfig: {
    APP_CHECK_DEBUG_TOKEN_FROM_CI: process.env.APP_CHECK_DEBUG_TOKEN_FROM_CI,
    // public: {
    //   firebaseApiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
    //   firebaseAuthDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    //   firebaseDatabaseURL: process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL,
    //   firebaseProjectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
    //   firebaseStorageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    //   firebaseMessagingSenderId:
    //     process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    //   firebaseAppId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
    //   firebaseMeasurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    //   firebaseRecaptchaKey: process.env.NUXT_PUBLIC_FIREBASE_RECAPTCHA_KEY,
    // },
  },
  vuefire: {
    auth: {
      enabled: true,
    },
    appCheck: {
      debug: process.env.NODE_ENV !== "production",
      isTokenAutoRefreshEnabled: true,
      provider: "ReCaptchaV3",
      key: "6LeX9wgmAAAAAHi6PchwsVVGppRZRK2OOHTdIUUJ",
      // key: process.env.NUXT_PUBLIC_FIREBASE_RECAPTCHA_KEY,
    },
    config: {
      apiKey: "AIzaSyDROkpZDuHw2KvV3OgPu9P-WJbk4_4-KJc",
      authDomain: "iotactile-games.firebaseapp.com",
      databaseURL:
        "https://iotactile-games-default-rtdb.europe-west1.firebasedatabase.app",
      projectId: "iotactile-games",
      storageBucket: "iotactile-games.appspot.com",
      messagingSenderId: "863733555330",
      appId: "1:863733555330:web:5f68e24010403d7d6b949b",
      measurementId: "G-7F7CDGDN3F",
      // apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      // authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      // databaseURL: process.env.NUXT_PUBLIC_FIREBASE_DATABASE_URL,
      // projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      // storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      // messagingSenderId:
      //   process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      // appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      // measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
  },
});
