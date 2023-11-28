export const TileValues = {
  ZERO: '0',
  ONE: '1',
  EMPTY: '.'
} as const

export const ERRORS = {
  DUPLICATE: 'Toutes les lignes et colonnes doivent être uniques',
  BALANCE:
    'Les tuiles doivent être en quantité égale sur chaque ligne et colonne',
  TRIPLE:
    'Il ne peut pas y avoir plus de deux tuiles consécutives de la même couleur'
} as const

export const OUT_OF_RANGE = (line: 'row' | 'col') =>
  `Hors de porté: ${line} (index)`
