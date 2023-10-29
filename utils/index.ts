export const numberFormatter = (value: number, isPourcentage: boolean) => {
  const fixedValue = isPourcentage
    ? (value * 100).toFixed(2) + '%'
    : value.toFixed(2)
  return fixedValue
}

export const sum = (object: Record<string, number | null>) => {
  return Object.values(object).reduce((a, b) => (a || 0) + (b || 0), 0)
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const diceAudioTracks = [
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
  '19.m4a'
]
