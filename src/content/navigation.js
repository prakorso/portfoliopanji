/**
 * Site navigation. This is page structure, not editable content — the anchors
 * must match the section ids rendered by the components, so it stays in code.
 */
export const navLinks = [
  { id: 'home', label: 'Home', href: '#home' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'contact', label: 'Contact', href: '#contact' }
]

/**
 * The header's own list. Contact is left out of it because the Get in touch
 * button beside it already goes to the same place; the freed slot carries the
 * portfolio download instead. The footer still lists every section.
 */
export const headerLinks = navLinks.filter((link) => link.id !== 'contact')
