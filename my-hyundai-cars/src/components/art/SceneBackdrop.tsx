import { useId } from 'react'

export type SceneTone = 'night' | 'graphite' | 'light' | 'warm'

const TONES: Record<SceneTone, { top: string; bottom: string; glow: string; floor: string; streak: string }> = {
  night: { top: '#0B1622', bottom: '#05080D', glow: '#1E4C7A', floor: '#040709', streak: '#7FB4E8' },
  graphite: { top: '#141B23', bottom: '#080B10', glow: '#31404F', floor: '#05080B', streak: '#9DB3C7' },
  light: { top: '#FAF9F7', bottom: '#DFDCD6', glow: '#FFFFFF', floor: '#CFCBC4', streak: '#FFFFFF' },
  warm: { top: '#2A2119', bottom: '#0E0A07', glow: '#8A5E30', floor: '#0B0806', streak: '#E3B27C' },
}

/**
 * Cinematic environment plate behind the vehicle art. Deliberately quiet:
 * a horizon glow, a floor plane and a couple of light streaks — no parallax.
 */
export default function SceneBackdrop({
  tone = 'night',
  horizon = 0.72,
  streaks = true,
  className,
}: {
  tone?: SceneTone
  horizon?: number
  streaks?: boolean
  className?: string
}) {
  const uid = useId().replace(/[:]/g, '')
  const c = TONES[tone]
  const hy = 900 * horizon

  return (
    <svg
      viewBox="0 0 1600 900"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={`${uid}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.top} />
          <stop offset="100%" stopColor={c.bottom} />
        </linearGradient>
        <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={c.glow} stopOpacity={tone === 'light' ? '0.9' : '0.55'} />
          <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${uid}-floor`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={c.floor} stopOpacity="0.1" />
          <stop offset="100%" stopColor={c.floor} stopOpacity={tone === 'light' ? '0.5' : '0.95'} />
        </linearGradient>
        <linearGradient id={`${uid}-streak`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={c.streak} stopOpacity="0" />
          <stop offset="50%" stopColor={c.streak} stopOpacity={tone === 'light' ? '0.5' : '0.22'} />
          <stop offset="100%" stopColor={c.streak} stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1600" height="900" fill={`url(#${uid}-sky)`} />
      <ellipse cx="880" cy={hy - 60} rx="900" ry="300" fill={`url(#${uid}-glow)`} />
      <rect y={hy} width="1600" height={900 - hy} fill={`url(#${uid}-floor)`} />
      <rect y={hy} width="1600" height="1.5" fill={c.streak} opacity={tone === 'light' ? '0.28' : '0.16'} />

      {streaks && (
        <g>
          <rect x="120" y={hy + 74} width="760" height="2" fill={`url(#${uid}-streak)`} />
          <rect x="620" y={hy + 132} width="900" height="2.5" fill={`url(#${uid}-streak)`} />
          <rect x="-40" y={hy + 196} width="700" height="3" fill={`url(#${uid}-streak)`} />
          <rect x="180" y={hy - 168} width="520" height="1.5" fill={`url(#${uid}-streak)`} opacity="0.5" />
        </g>
      )}
    </svg>
  )
}
