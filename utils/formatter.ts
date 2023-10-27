export const numberFormatter = (value: number, isPourcentage: boolean) => {
  const fixedValue = isPourcentage
    ? (value * 100).toFixed(2) + '%'
    : value.toFixed(2)
  return fixedValue
}
