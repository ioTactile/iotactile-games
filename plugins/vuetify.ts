import { createVuetify, type ThemeDefinition } from 'vuetify';
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg';

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    background: '#ffffff', // white
    surface: '#ececec', // light grey
    surfaceButton: '#d9d9d9', // white
    primary: '#bb86fc', // purple
    secondary: '#03dac6', // green
    onBackground: '#000000', // black
    onSurface: '#000000', // dark grey
    onSurfaceButton: '#000000', // black
    onPrimary: '#000000', // black
    onSecondary: '#000000', // black
    scrollBarThumb: '#7F7F7F', // light grey
    scrollBarThumbHover: '#5C5C5C', // grey
    diceMainPrimary: '#005541', // green
    diceMainSecondary: '#002E23', // dark green
    diceMainTertiary: '#EB9444', // orange
    diceMainLightTertiary: '#FFAC49', // light orange
    diceMainDarkTertiary: '#B77335', // dark orange
    diceMainModalBackground: '#d9d9d9', // light grey
    mineSweeperMainPrimary: '#1479d5', // blue
    mineSweeperMainSecondary: '#59b4fb', // light blue
    mineSweeperMainTertiary: '#1363ac', // dark blue
    mineSweeperMainBackground: '#161616', // dark grey
    mineSweeperMainSurface: '#d9d9d9', // light grey
    mineSweeperMainShadow: '#d9d9d9', // light grey
    mainSweeperMainOnSurface: '#161616', // dark grey
    takuzuMainPrimary: '#90a4ae', // light blue
    takuzuMainSecondary: '#37474F', // dark blue
    takuzuMainTertiary: '#546E7A', // grey
    takuzuMainSurface: '#CFD8DC', // light grey
    takuzuMainShadow: '#B0BEC5', // grey
    takuzuMainOnSurface: '#161616', // dark grey
    game2048MainPrimary: '#2dd4a8', // jade
    game2048MainSecondary: '#0d1117', // ink
    game2048MainTertiary: '#f0b429', // amber
    game2048MainSurface: '#e8f5f0', // mint wash
    game2048MainShadow: '#9bc4b5', // soft jade shadow
    game2048MainOnSurface: '#0d1117', // ink
    snakeMainPrimary: '#b8ff3c', // volt lime
    snakeMainSecondary: '#0a0a0c', // noir
    snakeMainTertiary: '#ff4d6d', // coral food
    snakeMainSurface: '#12141a', // dark panel
    snakeMainShadow: '#050507', // deep shadow
    snakeMainOnSurface: '#e8ffe0', // pale lime text
  },
};
const myCustomDarkTheme: ThemeDefinition = {
  dark: true,
  colors: {
    background: '#121212', // dark grey
    surface: '#1d1d1d', // dark grey
    surfaceButton: '#222222', // dark grey
    primary: '#bb86fc', // purple
    secondary: '#03dac6', // green
    onBackground: '#d9d9d9', // light grey
    onSurface: '#dfdfdf', // light grey
    onSurfaceButton: '#ffffff', // white
    onPrimary: '#000000', // black
    onSecondary: '#000000', // black
    scrollBarThumb: '#7F7F7F', // light grey
    scrollBarThumbHover: '#5C5C5C', // grey
    diceMainPrimary: '#005541', // green
    diceMainSecondary: '#002E23', // dark green
    diceMainTertiary: '#EB9444', // orange
    diceMainLightTertiary: '#FFAC49', // light orange
    diceMainDarkTertiary: '#B77335', // dark orange
    diceMainModalBackground: '#2a2a2a', // dark grey
    mineSweeperMainPrimary: '#1479d5', // blue
    mineSweeperMainSecondary: '#59b4fb', // light blue
    mineSweeperMainTertiary: '#1363ac', // dark blue
    mineSweeperMainBackground: '#161616', // dark grey
    mineSweeperMainSurface: '#222222', // dark grey
    mineSweeperMainShadow: '#979797', // grey
    mainSweeperMainOnSurface: '#d9d9d9', // light grey
    takuzuMainPrimary: '#90a4ae', // light blue
    takuzuMainSecondary: '#37474F', // dark blue
    takuzuMainTertiary: '#546E7A', // grey
    takuzuMainSurface: '#CFD8DC', // light grey
    takuzuMainShadow: '#B0BEC5', // grey
    takuzuMainOnSurface: '#161616', // dark grey
    game2048MainPrimary: '#2dd4a8', // jade
    game2048MainSecondary: '#0d1117', // ink
    game2048MainTertiary: '#f0b429', // amber
    game2048MainSurface: '#1a2220', // dark jade surface
    game2048MainShadow: '#0a0e0c', // deep shadow
    game2048MainOnSurface: '#e8f5f0', // mint text
    snakeMainPrimary: '#b8ff3c', // volt lime
    snakeMainSecondary: '#0a0a0c', // noir
    snakeMainTertiary: '#ff4d6d', // coral food
    snakeMainSurface: '#12141a', // dark panel
    snakeMainShadow: '#050507', // deep shadow
    snakeMainOnSurface: '#e8ffe0', // pale lime text
  },
};

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: { mdi },
    },
    theme: {
      defaultTheme: 'myCustomLightTheme',
      themes: { myCustomLightTheme, myCustomDarkTheme },
    },
  });

  nuxtApp.vueApp.use(vuetify);
});
