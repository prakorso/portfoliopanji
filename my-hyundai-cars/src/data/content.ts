export type SolutionRow = {
  title: string
  description: string
}

export const PERSONAL_SOLUTIONS: SolutionRow[] = [
  { title: 'Family', description: 'Comfortable mobility for family journeys and growing needs.' },
  { title: 'Daily Drive', description: 'Practical Hyundai mobility for everyday life.' },
  { title: 'Premium', description: 'Elevated comfort and refined mobility.' },
  { title: 'Electric', description: 'A more progressive way to move.' },
]

export const BUSINESS_SOLUTIONS: SolutionRow[] = [
  {
    title: 'Corporate Fleet',
    description: 'Structured vehicle programmes for companies and their teams.',
  },
  {
    title: 'Operational Vehicles',
    description: 'Dependable units for daily operational and field requirements.',
  },
  {
    title: 'Rental & Mobility',
    description: 'Vehicle planning for rental, shuttle and mobility operators.',
  },
  {
    title: 'Executive & Management',
    description: 'Representative vehicles for directors and management.',
  },
]

export type ProcessStep = {
  number: string
  title: string
  description: string
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: '01',
    title: 'Tell Us What You Need',
    description: 'Share your personal or business requirements.',
  },
  {
    number: '02',
    title: 'Get the Right Recommendation',
    description: "We'll help identify the right Hyundai solution.",
  },
  {
    number: '03',
    title: 'Explore Your Options',
    description: 'Discuss suitable Hyundai models and purchase requirements.',
  },
  {
    number: '04',
    title: 'Move Forward With Confidence',
    description: 'Get support throughout the purchase process.',
  },
]

export const WHY_US: SolutionRow[] = [
  {
    title: 'Personal Consultation',
    description: "Guidance based on the customer's actual requirements.",
  },
  {
    title: 'Business & Fleet Support',
    description: 'Support for corporate, fleet, rental, and business requirements.',
  },
  { title: 'Direct Access', description: 'Direct communication with a Hyundai consultant.' },
  { title: 'Purchase Assistance', description: 'Support throughout the purchase process.' },
]
