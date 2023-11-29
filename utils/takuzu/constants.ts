export const TileValues = {
  ZERO: '0',
  ONE: '1',
  EMPTY: '.'
} as const

export const ERRORS = {
  DUPLICATE: 'Toutes les lignes et colonnes doivent être uniques',
  BALANCE:
    'Il doit y avoir autant de boules blanches que de boules noires sur chaque ligne et chaque colonne',
  TRIPLE:
    'Il ne doit pas y avoir plus de deux boules de la même couleur côte à côte'
} as const

export const OUT_OF_RANGE = (line: 'row' | 'col') =>
  `Hors de porté: ${line} (index)`
