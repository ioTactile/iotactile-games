export const numberFormatter = (value: number, isPourcentage: boolean) => {
  const fixedValue = isPourcentage
    ? (value * 100).toFixed(2) + '%'
    : value.toFixed(2)
  return fixedValue
}

export const sum = (object: Record<string, number | null>) => {
  return Object.values(object).reduce((a, b) => (a || 0) + (b || 0), 0)
}
