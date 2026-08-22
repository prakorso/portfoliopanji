/**
 * Abstract, brand-neutral visuals for each project.
 * These are illustrative placeholders — swap in real screenshots or photography
 * by replacing the returned markup with an <img src="/assets/..." /> per variant.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round'
}

function Dashboard() {
  const bars = [26, 44, 34, 62, 52, 78, 92]
  return (
    <>
      <rect x="24" y="28" width="392" height="248" rx="12" className="pv-panel" />
      <path d="M24 62h392" {...stroke} opacity="0.35" />
      <circle cx="44" cy="45" r="3.2" className="pv-dot" />
      <circle cx="56" cy="45" r="3.2" className="pv-dot" opacity="0.55" />
      <circle cx="68" cy="45" r="3.2" className="pv-dot" opacity="0.3" />

      {/* line chart */}
      <path
        d="M52 214 106 176 160 190 214 132 268 148 322 96 388 74"
        {...stroke}
        strokeWidth="2.4"
        className="pv-line"
      />
      <path
        d="M52 214 106 176 160 190 214 132 268 148 322 96 388 74 388 246H52Z"
        className="pv-area"
      />
      {[
        [106, 176],
        [214, 132],
        [322, 96],
        [388, 74]
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3.6" className="pv-node" />
      ))}
      <path d="M52 246h336" {...stroke} opacity="0.4" />

      {/* mobile campaign view */}
      <rect x="432" y="66" width="152" height="292" rx="20" className="pv-panel pv-panel--raised" />
      <rect x="446" y="80" width="124" height="60" rx="8" className="pv-fill" opacity="0.5" />
      <rect x="446" y="152" width="86" height="8" rx="4" className="pv-fill" />
      <rect x="446" y="168" width="112" height="6" rx="3" className="pv-fill" opacity="0.4" />
      {bars.map((h, i) => (
        <rect
          key={i}
          x={446 + i * 18}
          y={330 - h}
          width="10"
          height={h}
          rx="3"
          className={i > 4 ? 'pv-bar pv-bar--hot' : 'pv-bar'}
        />
      ))}

      {/* funnel */}
      <g opacity="0.9">
        <path d="M60 92h150l-18 26H78Z" className="pv-fill" opacity="0.55" />
        <path d="M82 126h106l-16 24H98Z" className="pv-fill" opacity="0.35" />
        <path d="M102 158h66l-14 22h-38Z" className="pv-fill" opacity="0.2" />
      </g>
    </>
  )
}

function Automotive() {
  return (
    <>
      {/* browser frame with inventory grid */}
      <rect x="20" y="30" width="330" height="238" rx="12" className="pv-panel" />
      <path d="M20 60h330" {...stroke} opacity="0.35" />
      <circle cx="38" cy="45" r="3.2" className="pv-dot" />
      <circle cx="50" cy="45" r="3.2" className="pv-dot" opacity="0.5" />
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect
            x={40 + (i % 2) * 152}
            y={78 + Math.floor(i / 2) * 96}
            width="132"
            height="76"
            rx="8"
            className="pv-fill"
            opacity={i === 0 ? 0.55 : 0.28}
          />
          <rect
            x={40 + (i % 2) * 152}
            y={162 + Math.floor(i / 2) * 96}
            width="70"
            height="6"
            rx="3"
            className="pv-fill"
            opacity="0.5"
          />
        </g>
      ))}

      {/* abstract vehicle profile */}
      <g transform="translate(272 188) scale(0.86)">
        <path
          d="M8 92c0-18 10-34 26-44l40-26c14-9 30-14 47-14h72c20 0 39 7 54 20l34 30c12 10 27 16 43 18l24 3c14 2 24 13 24 27v12c0 9-7 16-16 16H24c-9 0-16-7-16-16v-26Z"
          className="pv-fill"
          opacity="0.6"
        />
        <path
          d="M8 92c0-18 10-34 26-44l40-26c14-9 30-14 47-14h72c20 0 39 7 54 20l34 30c12 10 27 16 43 18l24 3c14 2 24 13 24 27v12c0 9-7 16-16 16H24c-9 0-16-7-16-16v-26Z"
          {...stroke}
          strokeWidth="1.8"
          className="pv-line"
        />
        <path d="M84 40h60v34H56Z" className="pv-glass" />
        <path d="M160 40h48c14 0 27 5 38 14l24 20h-110Z" className="pv-glass" />
        <circle cx="104" cy="134" r="30" className="pv-panel pv-panel--raised" />
        <circle cx="104" cy="134" r="13" {...stroke} strokeWidth="2" className="pv-line" />
        <circle cx="272" cy="134" r="30" className="pv-panel pv-panel--raised" />
        <circle cx="272" cy="134" r="13" {...stroke} strokeWidth="2" className="pv-line" />
      </g>
    </>
  )
}

function Devices() {
  return (
    <>
      {/* laptop */}
      <path d="M118 68h384c9 0 16 7 16 16v186H102V84c0-9 7-16 16-16Z" className="pv-panel" />
      <rect x="132" y="84" width="356" height="170" rx="6" className="pv-screen" />
      <path d="M62 274h496l-24 30c-4 5-10 8-16 8H102c-6 0-12-3-16-8l-24-30Z" className="pv-panel pv-panel--raised" />
      <path d="M268 274h84" {...stroke} strokeWidth="3" opacity="0.5" />

      {/* on-screen composition */}
      <rect x="152" y="104" width="150" height="82" rx="7" className="pv-fill" opacity="0.5" />
      <rect x="152" y="198" width="96" height="7" rx="3.5" className="pv-fill" />
      <rect x="152" y="214" width="132" height="6" rx="3" className="pv-fill" opacity="0.4" />
      <rect x="322" y="104" width="146" height="46" rx="7" className="pv-fill" opacity="0.28" />
      {[34, 58, 44, 76, 92].map((h, i) => (
        <rect
          key={i}
          x={322 + i * 30}
          y={228 - h}
          width="16"
          height={h}
          rx="4"
          className={i > 2 ? 'pv-bar pv-bar--hot' : 'pv-bar'}
        />
      ))}

      {/* floating metric chip */}
      <g transform="translate(452 40)">
        <rect width="132" height="58" rx="12" className="pv-panel pv-panel--raised" />
        <path d="M18 40 44 20l16 12 30-26" {...stroke} strokeWidth="2.2" className="pv-line" />
        <path d="M78 6h14v14" {...stroke} strokeWidth="2.2" className="pv-line" />
      </g>
    </>
  )
}

const variants = { dashboard: Dashboard, automotive: Automotive, devices: Devices }

export default function ProjectVisual({ variant = 'dashboard', className = '' }) {
  const Shape = variants[variant] ?? Dashboard
  return (
    <svg
      className={`project-visual ${className}`.trim()}
      viewBox="0 0 640 400"
      preserveAspectRatio="xMidYMid meet"
      role="presentation"
      aria-hidden="true"
    >
      <Shape />
    </svg>
  )
}
