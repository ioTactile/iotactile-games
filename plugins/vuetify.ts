import '@mdi/font/css/materialdesignicons.css'
import { createVuetify, ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const myTheme: ThemeDefinition = {
  dark: false,
  colors: {
    // Illustration
    main: '#eff0f3', // light grey
    secondary: '#fffffe', // white
    tertiary: '#d9376e', // pink
    stroke: '#0d0d0d', // black
    highlight: '#ff8e3c', // orange
    // Elements
    background: '#eff0f3', // light grey
    headline: '#0d0d0d', // black
    paragraph: '2a2a2a', // dark grey
    buttonBack: '#ff8e3c', // orange
    buttonText: '#0d0d0d', // black
    // Events
    error: '#ed4337', // red
    success: '#4caf50' // green
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi }
    },
    theme: {
      defaultTheme: 'myTheme',
      themes: { myTheme }
    },
    components,
    directives
  })

  nuxtApp.vueApp.use(vuetify)
})
