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

export const sum = (object: Record<string, number | null>) => {
  return Object.values(object).reduce((a, b) => (a || 0) + (b || 0), 0)
}

export const random = (length: number, extra?: number) => {
  return Math.floor(Math.random() * length) + (extra || 0)
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const audioTracks = [
  '1.m4a',
  '2.m4a',
  '3.m4a',
  '4.m4a',
  '5.m4a',
  '6.m4a',
  '7.m4a',
  '8.m4a',
  '9.m4a',
  '10.m4a',
  '11.m4a',
  '12.m4a',
  '13.m4a',
  '14.m4a',
  '15.m4a',
  '16.m4a',
  '17.m4a',
  '18.m4a',
  '19.m4a',
  '20.m4a'
]
