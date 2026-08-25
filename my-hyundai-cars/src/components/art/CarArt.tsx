import { useId } from 'react'
import { CAR_VIEWBOX, type CarSpec, type Paint } from './carSpecs'
import { rockerWithArches, smoothPath, type Pt } from './geometry'

type CarArtProps = {
  spec: CarSpec
  paint?: Paint
  /** Accessible name. Ignored when `decorative` is true. */
  title: string
  className?: string
  rimLight?: boolean
  headlightGlow?: boolean
  shadow?: boolean
  decorative?: boolean
}

export default function CarArt({
  spec,
  paint,
  title,
  className,
  rimLight = false,
  headlightGlow = false,
  shadow = true,
  decorative = false,
}: CarArtProps) {
  const uid = useId().replace(/:/g, '')
  const p = paint ?? spec.paint
  const wheelCy = CAR_VIEWBOX.ground - spec.wheelR
  const L = spec.frontX - spec.rearX
  const H = CAR_VIEWBOX.ground - spec.roofY

  const bodyPath =
    smoothPath(spec.outline, 0.85, false) +
    ' ' +
    rockerWithArches(
      spec.rearX,
      spec.frontWheel,
      spec.rearWheel,
      wheelCy,
      spec.archR,
      spec.rocker,
    )

  const glassPath = smoothPath(spec.glass, 0.6, true)

  return (
    <svg
      viewBox={`0 0 ${CAR_VIEWBOX.w} ${CAR_VIEWBOX.h}`}
      className={className}
      role={decorative ? 'presentation' : 'img'}
      aria-label={decorative ? undefined : title}
      aria-hidden={decorative || undefined}
      focusable="false"
    >
      {!decorative && <title>{title}</title>}
      <defs>
        <linearGradient id={`${uid}-body`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.body[0]} />
          <stop offset="42%" stopColor={p.body[1]} />
          <stop offset="100%" stopColor={p.body[2]} />
        </linearGradient>
        <linearGradient id={`${uid}-glass`} x1="0.15" y1="0" x2="0.75" y2="1">
          <stop offset="0%" stopColor={p.glass[0]} />
          <stop offset="100%" stopColor={p.glass[1]} />
        </linearGradient>
        <linearGradient id={`${uid}-rim`} x1="0.15" y1="0" x2="0.85" y2="1">
          <stop offset="0%" stopColor="#EDF1F5" />
          <stop offset="50%" stopColor="#A6B0BB" />
          <stop offset="100%" stopColor="#4C555F" />
        </linearGradient>
        <linearGradient id={`${uid}-reflect`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="58%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id={`${uid}-shoulder`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id={`${uid}-occl`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-shadow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#0A0E14" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#0A0E14" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#0A0E14" stopOpacity="0" />
        </radialGradient>
        <radialGradient id={`${uid}-lampglow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={p.lamp} stopOpacity="0.8" />
          <stop offset="100%" stopColor={p.lamp} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-rimlight`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="40%" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
        </linearGradient>
        <clipPath id={`${uid}-clip`}>
          <path d={bodyPath} />
        </clipPath>
        <clipPath id={`${uid}-well`}>
          <rect x="0" y="0" width={CAR_VIEWBOX.w} height={spec.rocker} />
        </clipPath>
      </defs>

      {shadow && (
        <g>
          <ellipse
            cx={(spec.rearWheel + spec.frontWheel) / 2}
            cy={CAR_VIEWBOX.ground + 12}
            rx={L / 1.9}
            ry="22"
            fill={`url(#${uid}-shadow)`}
          />
          <ellipse
            cx={(spec.rearWheel + spec.frontWheel) / 2}
            cy={CAR_VIEWBOX.ground + 2}
            rx={L / 2.5}
            ry="9"
            fill={`url(#${uid}-shadow)`}
          />
        </g>
      )}

      {/* Dark wheel wells so the arch gap reads as shadow, not a whitewall. */}
      <g clipPath={`url(#${uid}-well)`}>
        {[spec.rearWheel, spec.frontWheel].map((cx) => (
          <circle key={cx} cx={cx} cy={wheelCy} r={spec.archR} fill="#080C11" opacity="0.94" />
        ))}
      </g>

      {[spec.rearWheel, spec.frontWheel].map((cx) => (
        <Wheel key={cx} cx={cx} cy={wheelCy} r={spec.wheelR} rimId={`${uid}-rim`} />
      ))}

      <path d={bodyPath} fill={`url(#${uid}-body)`} />

      <g clipPath={`url(#${uid}-clip)`}>
        {/* horizon reflection across the flank */}
        <rect
          x={spec.rearX}
          y={spec.beltY + 0.2 * H}
          width={L}
          height={0.22 * H}
          fill={`url(#${uid}-reflect)`}
          opacity="0.5"
        />
        {/* light catching the shoulder just under the glass */}
        <rect
          x={spec.rearX}
          y={spec.beltY}
          width={L}
          height={0.1 * H}
          fill={`url(#${uid}-shoulder)`}
          opacity="0.55"
        />
        <ellipse
          cx={(spec.rearWheel + spec.frontWheel) / 2}
          cy={spec.rocker + 0.03 * H}
          rx={L / 2}
          ry={0.16 * H}
          fill={`url(#${uid}-occl)`}
        />

        <path d={smoothPath(spec.belt, 1, false)} fill="none" stroke="#ffffff" strokeOpacity="0.34" strokeWidth="1.8" />
        <path d={smoothPath(spec.lower, 1, false)} fill="none" stroke="#000000" strokeOpacity="0.22" strokeWidth="2" />

        {spec.door.map((x) => (
          <line
            key={x}
            x1={x}
            y1={spec.beltY + 0.01 * H}
            x2={x - 0.008 * L}
            y2={spec.rocker - 0.01 * H}
            stroke="#000000"
            strokeOpacity="0.22"
            strokeWidth="1.6"
          />
        ))}

        <path d={glassPath} fill={`url(#${uid}-glass)`} />
        <path d={glassPath} fill="none" stroke="#ffffff" strokeOpacity="0.18" strokeWidth="1.6" />
        {/* B-pillar, painted in body colour so the glass reads as two windows */}
        <path
          d={`M ${spec.bPillar} ${spec.roofY} L ${spec.bPillar + 0.014 * L} ${spec.roofY} L ${
            spec.bPillar + 0.006 * L
          } ${spec.beltY} L ${spec.bPillar - 0.008 * L} ${spec.beltY} Z`}
          fill={`url(#${uid}-body)`}
        />
        <path d={quad(spec.mirror)} fill={`url(#${uid}-body)`} />
        <path d={quad(spec.mirror)} fill="#000000" fillOpacity="0.18" />

        <path d={quad(spec.headlight)} fill={p.lamp} fillOpacity="0.95" />
        <path
          d={quad(spec.headlight)}
          fill="none"
          stroke="#0A0E14"
          strokeOpacity="0.28"
          strokeWidth="1.2"
        />
        <path d={quad(spec.taillight)} fill="#B92E38" fillOpacity="0.92" />
        <path
          d={quad(spec.taillight)}
          fill="none"
          stroke="#0A0E14"
          strokeOpacity="0.3"
          strokeWidth="1.2"
        />

        {rimLight && (
          <path
            d={bodyPath}
            fill="none"
            stroke={`url(#${uid}-rimlight)`}
            strokeWidth="3"
            strokeLinejoin="round"
          />
        )}
      </g>

      {headlightGlow && (
        <ellipse
          cx={spec.frontX + 0.02 * L}
          cy={spec.headlight[1][1] + 0.02 * H}
          rx={0.34 * L}
          ry={0.26 * H}
          fill={`url(#${uid}-lampglow)`}
        />
      )}
    </svg>
  )
}

function quad(points: Pt[]): string {
  return `M ${points.map(([x, y]) => `${x} ${y}`).join(' L ')} Z`
}

function Wheel({ cx, cy, r, rimId }: { cx: number; cy: number; r: number; rimId: string }) {
  const rim = r * 0.7
  const face = r * 0.6
  const hub = r * 0.15
  const spokes = 5
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} fill="#10151B" />
      <circle cx={cx} cy={cy} r={r * 0.93} fill="#1A2028" />
      <circle cx={cx} cy={cy} r={rim} fill={`url(#${rimId})`} />
      <circle cx={cx} cy={cy} r={face} fill="#1E242C" />
      {Array.from({ length: spokes }).map((_, i) => {
        const a = (i / spokes) * Math.PI * 2 - Math.PI / 2
        const spread = 0.14
        return (
          <g key={i}>
            {[-spread, spread].map((offset) => (
              <line
                key={offset}
                x1={cx + Math.cos(a + offset * 1.6) * hub * 1.1}
                y1={cy + Math.sin(a + offset * 1.6) * hub * 1.1}
                x2={cx + Math.cos(a + offset * 0.35) * face * 0.94}
                y2={cy + Math.sin(a + offset * 0.35) * face * 0.94}
                stroke={`url(#${rimId})`}
                strokeWidth={r * 0.07}
                strokeLinecap="round"
              />
            ))}
          </g>
        )
      })}
      <circle cx={cx} cy={cy} r={hub} fill="#39424D" />
      <circle cx={cx} cy={cy} r={hub * 0.45} fill="#1A2028" />
    </g>
  )
}
