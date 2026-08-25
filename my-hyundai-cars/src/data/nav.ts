import { TRADE_IN_URL } from '../config/site'

export type NavItem = {
  label: string
  href: string
  external?: boolean
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Business', href: '#business' },
  { label: 'Personal', href: '#personal' },
  { label: 'Models', href: '#models' },
  { label: 'Trade-In', href: TRADE_IN_URL, external: true },
]
