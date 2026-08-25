export type HyundaiModel = {
  /** Matches a key in CAR_SPECS — drives the studio render. */
  id: string
  name: string
  category: string
  statement: string
  /** Optional approved photography. Art is used when absent or on load failure. */
  photo?: string
}

/**
 * Showcase only. Add a model here and it appears in the carousel — no other
 * change required.
 */
export const MODELS: HyundaiModel[] = [
  {
    id: 'creta',
    name: 'CRETA',
    category: 'SUV',
    statement: 'Dynamic everyday SUV for urban mobility.',
  },
  {
    id: 'stargazer',
    name: 'STARGAZER',
    category: 'MPV',
    statement: 'Spacious seven-seat comfort built around family journeys.',
  },
  {
    id: 'santa-fe',
    name: 'SANTA FE',
    category: 'SUV',
    statement: 'Confident proportions and generous space for longer distances.',
  },
  {
    id: 'palisade',
    name: 'PALISADE',
    category: 'FLAGSHIP SUV',
    statement: 'Executive presence with three rows of refined comfort.',
  },
  {
    id: 'kona-electric',
    name: 'KONA Electric',
    category: 'ELECTRIC SUV',
    statement: 'Compact electric mobility for the everyday drive.',
  },
  {
    id: 'ioniq-5',
    name: 'IONIQ 5',
    category: 'ELECTRIC',
    statement: 'A progressive electric statement on a dedicated EV platform.',
  },
]
