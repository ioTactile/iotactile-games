// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/supabase', '@pinia/nuxt'],
  build: { transpile: ['vuetify'] },
  vite: { define: { 'process.env.DEBUG': false } },
  typescript: { shim: false },
  css: ['vuetify/styles', '~/assets/main.scss'],
})
