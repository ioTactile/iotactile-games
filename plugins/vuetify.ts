import { createVuetify, type ThemeDefinition } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff', // white
    surface: '#ececec', // light grey
    primary: '#bb86fc', // purple
    secondary: '#03dac6', // green
    onBackground: '#000000', // black
    onSurface: '#000000', // dark grey
    onPrimary: '#000000', // black
    onSecondary: '#000000', // black
    // Main Dice colors
    diceMainPrimary: '#005541', // green
    diceMainSecondary: '#002E23', // dark green
    diceMainTertiary: '#EB9444', // orange
    diceMainLightTertiary: '#FFAC49', // light orange
    diceMainDarkTertiary: '#B77335', // dark orange
    diceMainModalBackground: '#d9d9d9' // light grey
  }
}
const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#121212', // dark grey
    surface: '#1d1d1d', // dark grey
    primary: '#bb86fc', // purple
    secondary: '#03dac6', // green
    onBackground: '#d9d9d9', // light grey
    onSurface: '#dfdfdf', // light grey
    onPrimary: '#000000', // black
    onSecondary: '#000000', // black
    // Main Dice colors
    diceMainPrimary: '#005541', // green
    diceMainSecondary: '#002E23', // dark green
    diceMainTertiary: '#EB9444', // orange
    diceMainLightTertiary: '#FFAC49', // light orange
    diceMainDarkTertiary: '#B77335', // dark orange
    diceMainModalBackground: '#2a2a2a' // dark grey
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: false,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi }
    },
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: { myCustomLightTheme, myCustomDarkTheme }
    }
  })

  nuxtApp.vueApp.use(vuetify)
})
