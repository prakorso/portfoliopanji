const base = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

export const ArrowRight = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M4 12h15" />
    <path d="m13 6 6 6-6 6" />
  </svg>
)

export const ArrowLeft = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M20 12H5" />
    <path d="m11 6-6 6 6 6" />
  </svg>
)

export const ArrowUp = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M12 20V5" />
    <path d="m6 11 6-6 6 6" />
  </svg>
)

export const Download = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M12 4v11" />
    <path d="m7 11 5 5 5-5" />
    <path d="M5 20h14" />
  </svg>
)

export const Mail = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3.5 7 8.5 6 8.5-6" />
  </svg>
)

export const Phone = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M7.5 3.5h3l1.4 4-2 1.4a11.5 11.5 0 0 0 5.2 5.2l1.4-2 4 1.4v3a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 5.5 5.7a2 2 0 0 1 2-2.2Z" />
  </svg>
)

export const Pin = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
    <circle cx="12" cy="10" r="2.6" />
  </svg>
)

export const LinkedIn = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9.25h4v11.5H3V9.25Zm6.5 0h3.83v1.57h.05c.53-.95 1.83-1.95 3.77-1.95 4.03 0 4.78 2.5 4.78 5.76v6.12h-4v-5.43c0-1.29-.02-2.96-1.9-2.96-1.9 0-2.19 1.4-2.19 2.86v5.53h-4V9.25Z" />
  </svg>
)

export const Instagram = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
  </svg>
)

const capabilityIcons = {
  brand: (
    <>
      <path d="M12 3.5 20 8v8l-8 4.5L4 16V8l8-4.5Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  digital: (
    <>
      <rect x="3" y="4.5" width="18" height="13" rx="2" />
      <path d="M8 21h8" />
      <path d="M12 17.5V21" />
      <path d="M7 9h5" />
      <path d="M7 12.5h8" />
    </>
  ),
  performance: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4" />
      <path d="M12 12 19 5" />
    </>
  ),
  growth: (
    <>
      <path d="M4 19 10 13l3.2 3.2L20 9" />
      <path d="M15 9h5v5" />
      <path d="M4 19v-4" />
    </>
  )
}

export const CapabilityIcon = ({ name, size = 26 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    {capabilityIcons[name] ?? capabilityIcons.growth}
  </svg>
)

export const Play = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5-11-6.5Z" />
  </svg>
)

export const ExternalLink = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 4h6v6" />
    <path d="M20 4 11 13" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </svg>
)

export const Menu = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="M4 7h16" />
    <path d="M4 12h16" />
    <path d="M4 17h16" />
  </svg>
)

export const Close = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...base}>
    <path d="m6 6 12 12" />
    <path d="M18 6 6 18" />
  </svg>
)

export const Monogram = ({ size = 34 }) => (
  <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
    <rect x="1" y="1" width="46" height="46" rx="12" fill="url(#pp-grad)" />
    <path
      d="M17 34V15h8.4c3.9 0 6.4 2.3 6.4 5.9 0 3.7-2.6 6-6.6 6h-4.1V34H17Zm4.1-10.4h3.6c1.9 0 3-1 3-2.6s-1.1-2.6-3-2.6h-3.6v5.2Z"
      fill="#F8FAFC"
    />
    <defs>
      <linearGradient id="pp-grad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563EB" />
        <stop offset="1" stopColor="#0B1A2E" />
      </linearGradient>
    </defs>
  </svg>
)
