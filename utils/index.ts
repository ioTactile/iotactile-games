export const numberFormatter = (value: number, isPourcentage: boolean) => {
  const fixedValue = isPourcentage
    ? (value * 100).toFixed(2) + '%'
    : value.toFixed(2)
  return fixedValue
}

export const dateFormatter = (value: Date) => {
  return value.toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric'
  })
}

export const timerFormatter = (value: number, withMs: boolean) => {
  let minutes = 0
  let seconds = 0
  let milliseconds = 0
  if (withMs) {
    minutes = Math.floor(value / 60000)
    seconds = Math.floor((value % 60000) / 1000)
    milliseconds = Math.floor((value % 1000) / 10)
    return `${minutes < 10 ? '0' : ''}${minutes}:${
      seconds < 10 ? '0' : ''
    }${seconds}:${milliseconds < 10 ? '0' : ''}${milliseconds}`
  }
  minutes = Math.floor(value / 60)
  seconds = Math.floor((value % 60) / 1000)
  return `${minutes < 10 ? '0' : ''}${minutes}:${
    seconds < 10 ? '0' : ''
  }${seconds}`
}

export const timerFormatterLessThanTenMinutes = (seconds: number) => {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds - minutes * 60
  return `${minutes}:${secs < 10 ? '0' : ''}${secs}`
}

export const sum = (object: Record<string, number | null>) => {
  return Object.values(object).reduce((a, b) => (a || 0) + (b || 0), 0)
}

export const random = (length: number, extra?: number) => {
  return Math.floor(Math.random() * length) + (extra || 0)
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const asianLofi = [
  'Benzaiten ⛩️ Asian Lofi',
  'Blossom Tree ⛩️ Asian Lofi',
  'Bon Odori ⛩️ Asian Lofi',
  'Ebisu ⛩️ Asian Lofi',
  'Fushimi Inari ⛩️ Asian Lofi',
  'Gion District ⛩️ Asian Lofi',
  'Hanabi Festivals ⛩️ Asian Lofi',
  'Higanbana Field ⛩️ Asian Lofi',
  'Himawari No Sato ⛩️ Asian Lofi',
  'Hot Spring ⛩️ Asian Lofi',
  'Nihon Buyo ⛩️ Asian Lofi',
  'Oni Gokko ⛩️ Asian Lofi',
  'Princess Abe ⛩️ Asian Lofi',
  'Reiwa Era ⛩️ Asian Lofi',
  'Shakuhachi ⛩️ Asian Lofi',
  'Tachinomi ⛩️ Asian Lofi',
  'Takahuru Bus Stop ⛩️ Asian Lofi',
  'Tengu ⛩️ Asian Lofi',
  'Ume ⛩️ Asian Lofi',
  'Walking Thru San Marino ⛩️ Asian Lofi'
]

export const christmasLofi = [
  'Arctic Aura ❄️ Christmas Winter Lofi',
  'Candy Cane ❄️ Christmas Winter Lofi',
  'Fireplace ❄️ Christmas Winter Lofi',
  'Fireside ❄️ Christmas Winter Lofi',
  'Frost Beats ❄️ Christmas Winter Lofi',
  'Frosty Dawn ❄️ Christmas Winter Lofi',
  'Frozen Echo ❄️ Christmas Winter Lofi',
  'Merry Lofi ❄️ Christmas Winter Lofi',
  'Noel Nights ❄️ Christmas Winter Lofi',
  'Northern Lights ❄️ Christmas Winter Lofi',
  'Polar Harmony ❄️ Christmas Winter Lofi',
  'Scented Dreams ❄️ Christmas Winter Lofi',
  'Sleigh Ride ❄️ Christmas Winter Lofi',
  'Snowdrift ❄️ Christmas Winter Lofi',
  'Snowfall ❄️ Christmas Winter Lofi',
  'Snowglobe ❄️ Christmas Winter Lofi',
  'Starlit ❄️ Christmas Winter Lofi',
  'Sweater Weather ❄️ Christmas Winter Lofi',
  'Tinsel Tunes ❄️ Christmas Winter Lofi',
  'Winter Whisper ❄️ Christmas Winter Lofi'
]

export const autumnLofi = [
  'Amber Ambiance 🍁 Autumn Lofi',
  'Autumns Haunted Hues 🍁 Autumn Lofi',
  'Bonfire Beats 🍁 Autumn Lofi',
  'Cinnamon Specters 🍁 Autumn Lofi',
  'Cursed Spells 🍁 Autumn Lofi',
  'Fallen Leaves 🍁 Autumn Lofi',
  'Falling Leaves 🍁 Autumn Lofi',
  'Fireplace Ghost 🍁 Autumn Lofi',
  'Lantern Glow 🍁 Autumn Lofi',
  'Mystical Maple 🍁 Autumn Lofi',
  'October Chill 🍁 Autumn Lofi',
  'October Overtures 🍁 Autumn Lofi',
  'Ominous Owls 🍁 Autumn Lofi',
  'Pumpkin Patch 🍁 Autumn Lofi',
  'Rainy Resonance 🍁 Autumn Lofi',
  'Sinister Strings 🍁 Autumn Lofi',
  'Twilight Tones 🍁 Autumn Lofi',
  'Voodoo 🍁 Autumn Lofi',
  'Whisper in the Wind 🍁 Autumn Lofi',
  'Witching Hours 🍁 Autumn Lofi'
]
